import cv2
from PIL import Image, ImageOps, ImageEnhance, ImageChops, ImageFilter, ImageStat
import numpy as np
from os.path import splitext
from os import stat
from app.products.models import LocalAssetInfoHolder
from xapi.settings import TEST_LOCAL, LOCAL_STORAGE_LOCATION, USE_LOCAL_STORAGE, AWS_STORAGE_BUCKET_NAME, \
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
import requests
from .manipulateImage import detect_blob, get_background_type
from .manipulateImage import ManipulateImage, load_image
from .file_name_functions import build_filename, build_key, build_filename_number
from app.products.utility import get_file_type
from app.accounts.models import Profile, Company, User
from app.products.models import Product, ProductAsset, AssetContentStandards, ProductMessageThread, MessageParticipant
from os.path import normcase, isfile, isdir, join
from os import makedirs
from app.core.utility import boto3Upload3
from django.utils import timezone


def check_margin(img, mask=False, margin_type='pixel'):
    """
    takes an image and returns the margin parameters
    :param img: img as a byte string
    :param mask: img as a byte string
    :param margin_type: 'percentage' or 'pixel'; if 'percentage' then the results are returned as a percentage
     between 0 and 100; if 'pixel, returns the pixel value
    :return:
    """
    if mask:
        if img.max() > float(1):
            # convert the mask to scale between 0-1
            norm_image = cv2.normalize(img, None, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32F)
        else:
            img = img.astype(float)

    else:
        # we have to figure out the background
        existing_background_type, existing_background_color = get_background_type(img)
        if existing_background_type == 'transparent':
            mask = img[:, :, 3]
        else:
            existing_background_color = np.uint8([[existing_background_color]])
            existing_background_color = cv2.cvtColor(existing_background_color, cv2.COLOR_BGR2HSV)
            # create strict tolerances for upper and lower bounds that we can exploit later ;)
            upper_v = existing_background_color[0][0][2] + 1
            if upper_v > 255:
                upper_v = 255
            lower_v = existing_background_color[0][0][2] - 1
            if lower_v < 0:
                lower_v = 0

            upper = np.array([existing_background_color[0][0][0], existing_background_color[0][0][1], upper_v])
            lower = np.array([existing_background_color[0][0][0], existing_background_color[0][0][1], lower_v])

            # convert to hsv because ... COLOR ... read a book you dumb dumb, you shouldn't be asking questions ;)
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

            # grab the pixels that meet this tolerance
            mask = cv2.inRange(hsv, lower, upper)

            thresh = mask > 0
            mask = np.zeros_like(img, np.uint8)

            # output is a one channel mask
            mask[thresh] = 255
            _, mask = cv2.threshold(mask, 1, 255, cv2.THRESH_BINARY)
            mask = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
            mask = detect_blob(mask)
            mask = cv2.bitwise_not(mask)
            img = mask

    img_height, img_width = img.shape[:2]
    try:
        img_channels = img.shape[2]
    except:
        img_channels = 1

    if img_channels >= 3 and float(img.max()) > float(1):
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, img = cv2.threshold(img[:, :], 1, 255, cv2.THRESH_BINARY)
    img = detect_blob(img)
    y, x = img[:, :].nonzero()  # get the nonzero alpha coordinates
    minx = np.min(x)
    miny = np.min(y)
    maxx = np.max(x)
    maxy = np.max(y)

    if margin_type == 'percentage':
        margin_value_top = miny / img_height
        margin_value_bottom = (img_height - maxy) / img_height
        margin_value_left = minx / img_width
        margin_value_right = (img_width - maxx) / img_width
    else:
        margin_value_top = miny
        margin_value_bottom = img_height - maxy
        margin_value_left = minx
        margin_value_right = img_width - maxx

    return margin_value_top, margin_value_bottom, margin_value_left, margin_value_right


def save_adjusted_asset(asset, mask, name, productAsset, product, contentStandard, request, key):

    file_type = get_file_type(name)
    userID = request.data['userid']
    profile = Profile.objects.get(user=userID)
    company = Company.objects.get(pk=profile.companyProfile.pk)
    com = company.slug

    # new way of adding an asset; much more concise
    # check that the asset is not a 360 or folder, if so let's go farther into the rabbit hole
    # TODO: [BACKEND][Jacob] add in 360 logic
    if int(file_type) != int(2):
        # if it is a single file let's give it a "2D" string
        if int(file_type) == int(1):
            typs = "2D"
        # if it's a video, let's give it a "Video" string
        elif int(file_type) == int(3):
            typs = "Video"
        # if it's a 3D model, let's give it a "3D" string
        elif int(file_type) == int(4):
            typs = "3D"
        # otherwise it is a miscellaneous asset
        else:
            typs = "Miscellaneous"

        if USE_LOCAL_STORAGE:
            outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, key))
            if not isdir(outputLocation):
                makedirs(outputLocation)
            location = build_filename_number(normcase(join(outputLocation, name)))
            if location is None:
                return {'location': location}
            if int(file_type) == int(1):
                # save the frickin file, but optimize it first
                asset.save(location, optimize=True)
            else:
                # TODO: [BACKEND][Jacob] need to make sure that the assets that are being written are byte objects,
                #  2D assets are already taken care of
                with open(location, 'wb+') as f:
                    f.write(asset.read())
            print("successfully wrote to:", location)

        # otherwise we are saving it to the cloud
        else:
            # set the asset as a byte object
            asset = asset.tobytes()
            # TODO: [BACKEND][Jacob] how to check s3 file already exists and compress image before saving it to s3
            location = boto3Upload3(asset, com, key)
            loc = location.split('/')
            newlocation = loc[0] + '//d27vruithpdhv2.cloudfront.net/' + loc[3] + '/' + loc[4] + '/' + loc[5] + '/' + \
                          loc[6] + '/' + loc[7]

        # let's create the new asset in the database
        new_asset = ProductAsset()
        new_asset.product = Product.objects.get(uniqueID=productAsset.product.uniqueID)
        new_asset.file_name = name
        if USE_LOCAL_STORAGE:
            # record the local storage area
            new_asset.url = location
        else:
            # use cloudfront location
            new_asset.url = str(newlocation)
        if mask is not None:
            # name the mask directory
            key = key + '/masks/'

            # save the mask
            if USE_LOCAL_STORAGE:
                outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, key))
                if not isdir(outputLocation):
                    makedirs(outputLocation)
                location = build_filename_number(normcase(join(outputLocation, name)))

                # save the frickin file, but optimize it first
                asset.save(location, optimize=True)
                print("successfully wrote to:", location)

            # otherwise we are saving it to the cloud
            else:
                # set the asset as a byte object
                asset = asset.tobytes()
                # TODO: [BACKEND][Jacob] how to check s3 file already exists and compress image before saving it to s3
                location = boto3Upload3(asset, com, key)
                loc = location.split('/')
                newlocation = loc[0] + '//d27vruithpdhv2.cloudfront.net/' + loc[3] + '/' + loc[4] + '/' + loc[5] + '/' + \
                              loc[6] + '/' + loc[7]
        new_asset.verified_background_removed = True
        new_asset.mask_url = location
        new_asset.original = False
        new_asset.lastmodified = timezone.now()
        new_asset.deletedon = ''
        new_asset.verified_background_removed = productAsset.verified_background_removed
        new_asset.save()

        try:
            # let's generate some data on the asset so that it makes for quicker lookups in the future
            new_asset.generate_asset_attributes()
        except:
            print("could not generate asset attributes for:", str(name))

        # let's see if this product asset already has a content standard list associated with it
        new_cs = AssetContentStandards()

        # let's add the info to the database
        new_cs.contentStandard = contentStandard
        new_cs.product = Product.objects.get(uniqueID=productAsset.product.uniqueID)
        new_cs.productAsset = productAsset
        new_cs.lastmodified = timezone.now()
        new_cs.deletedon = ''
        new_cs.save()

    # since we were successful, let's create the new message thread for the new asset
    print("creating message thread")
    new_thread = ProductMessageThread()
    new_thread.product = Product.objects.get(uniqueID=productAsset.product.uniqueID)
    new_thread.ProductAsset = new_asset
    new_thread.messageThreadName = str(name)
    currentDT = timezone.now()
    new_thread.creationDateTime = currentDT
    new_thread.lastUpdateDateTime = currentDT
    new_thread.save()
    # let's create a new part to this message thread
    print("creating message part")
    createdThread = ProductMessageThread.objects.get(pk=new_thread.id)

    new_part = MessageParticipant()
    new_part.first_name = profile.first_name
    new_part.last_name = profile.last_name
    new_part.participant = User.objects.get(user=userID)
    new_part.save()

    print("saved the new part in the new thread before")
    createdThread.participants.add(new_part)
    # createdThread.participants.add(user[0])
    createdThread.save()
    print("saved the new part in the new thread after")

    company.update_storage()
    company.save()

    return {'location': location}


def image_to_content_standard(image, contentStandard, request, debug=False, applyContentStandard=True):
    """
    compares an image to a content standard
    :param debug:  boolean; if true prints out variables
    :param image: ProductAsset object
    :param contentStandard: content standard object to compare the image against
    :param applyContentStandard: if False willonly analyze a product to a content standard; True will apply the content
     standard
    :return:
    """
    # let's see if there is any preexisting data on this image
    img = None
    if image.asset_height is None or image.asset_width is None or image.asset_channels is None or \
            image.asset_background_type is None:

        file_bytes = load_image(str(image.url))

        if image.assetType == int(3):
            img = cv2.VideoCapture(file_bytes)
            _, img = img.read()
        else:
            # print(file_bytes)

            img = Image.open(file_bytes)
            img = np.array(img)

        imgName, imgExt = splitext(image.file_name)
        imgHeight, imgWidth = img.shape[:2]
        try:
            imgChannel = img.shape[2]
        except IndexError:
            imgChannel = 1
        imgFileSize = stat(image).st_size  # in Bytes

        # get background color by sampling the corner of the image
        imgBG = img[0:10, 0:10]
        imgBG = cv2.mean(imgBG)
        if int(imgChannel) >= int(3):
            # dealing with an 3+ channel image
            if int(imgChannel) == int(4) and int(imgBG[-1]) == int(0):
                imgBG = 'Transparent'
            elif int(sum(imgBG[:]) / len(imgBG)) == int(255):
                imgBG = 'White'
            elif int(sum(imgBG[:]) / len(imgBG)) == int(0):
                imgBG = 'Black'
        else:
            # dealing with a single channel image
            if int(sum(imgBG[:]) / len(imgBG)) == int(255):
                imgBG = 'White'
            elif int(sum(imgBG[:]) / len(imgBG)) == int(0):
                imgBG = 'Black'

        if debug:
            print("Image Name, Ext:", imgName, ", ", imgExt)
            print("Image Height, Image Width:", imgHeight, imgWidth)
            print("Image Channels:", imgChannel)
            print("Image File Size:", imgFileSize / 1000000)
            print("Image Background:", imgBG)

        # now that we grabbed all that info let's tuck it away for a rainy day:
        setattr(image, 'asset_height', imgHeight)
        setattr(image, 'asset_width', imgWidth)
        setattr(image, 'asset_channels', imgChannel)
        setattr(image, 'asset_background_type', imgBG)
        setattr(image, 'size', imgFileSize)
        image.save()

    """############## LET'S START COMPARING ##################"""
    # make a dict to store errors which we can pass onto another function to correct later
    # currently I am formatting the dictionary to be passed to the manipulate image function
    errors = {}
    errorCount = 0

    """############## COMPARING VERIFIED BACKGROUND ##################"""
    # now that we have our basic information let's check to see if this asset has a verified removed background
    if contentStandard.verified_background_removed is True:
        if image.verified_background_removed is not True:
            # we don't know if the background has been removed
            errors['remove_background'] = 'True'
            errorCount += 1

    """############## COMPARING HEIGHT & WIDTH ##################"""
    if contentStandard.strictnessLevel == 'lazy':
        if contentStandard.image_height is not None:
            if int(image.asset_height) < int(contentStandard.image_height):
                if contentStandard.image_width is not None:
                    if int(image.asset_width) < int(contentStandard.image_width):
                        # both are too small, so let's grab the smaller of the two and get one of the dimensions up to spec,
                        # otherwise we will distort the image
                        if image.asset_width < image.asset_height:
                            scaled_height = contentStandard.image_height
                            scaled_width = contentStandard.image_height / image.asset_height * image.asset_width
                        elif image.asset_width > image.asset_height:
                            scaled_height = contentStandard.image_width / image.asset_width * image.asset_height
                            scaled_width = contentStandard.image_width
                        else:
                            scaled_height = contentStandard.image_height
                            scaled_width = contentStandard.image_width
                        errors['resize-only'] = {'width': scaled_width,
                                                 'height': scaled_height}
                else:
                    if image.asset_width != image.asset_height:
                        scaled_height = contentStandard.image_height
                        scaled_width = contentStandard.image_height / image.asset_height * image.asset_width
                    else:
                        scaled_height = contentStandard.image_height
                        scaled_width = contentStandard.image_height
                    errors['resize-only'] = {'width': scaled_width,
                                             'height': scaled_height}
            else:
                if contentStandard.image_width is not None:
                    if int(image.asset_width) < int(contentStandard.image_width):
                        if image.asset_width != image.asset_height:
                            scaled_height = contentStandard.image_width / image.asset_width * image.asset_height
                            scaled_width = contentStandard.image_width
                        else:
                            scaled_height = contentStandard.image_width
                            scaled_width = contentStandard.image_width

                        errors['resize-only'] = {'width': scaled_width,
                                                 'height': scaled_height}
        else:
            if contentStandard.image_width is not None:
                if int(image.asset_width) < int(contentStandard.image_width):
                    if image.asset_width != image.asset_height:
                        scaled_height = contentStandard.image_width / image.asset_width * image.asset_height
                        scaled_width = contentStandard.image_width
                    else:
                        scaled_height = contentStandard.image_width
                        scaled_width = contentStandard.image_width

                    errors['resize-only'] = {'width': scaled_width,
                                             'height': scaled_height}

            else:
                # we have nothing to compare to
                pass

    else:
        # contentStandard.strictnessLevel == 'strict':
        if contentStandard.image_height is not None:
            if contentStandard.image_width is not None:
                if image.asset_height != contentStandard.image_height and image.asset_width != contentStandard.image_width:
                    errors['resize-only'] = {'width': contentStandard.image_width,
                                             'height': contentStandard.image_height}
            else:
                if image.asset_height != contentStandard.image_height:
                    scaled_width = contentStandard.image_height / image.asset_height * image.asset_width
                    errors['resize-only'] = {'width': scaled_width,
                                             'height': contentStandard.image_height}
        if image.asset_width != contentStandard.image_width:
            scaled_height = contentStandard.image_width / image.asset_width * image.asset_height
            errors['resize-only'] = {'width': contentStandard.image_width,
                                     'height': scaled_height}



    if 'resize-only' in errors:
        resizeDict = errors['resize-only']

    """############## COMPARING SQUARE/CANVAS ASSET ##################"""
    if contentStandard.force_asset_square:
        if contentStandard.image_width != contentStandard.image_height:
            squareSize = max(contentStandard.image_width, contentStandard.image_height)
        else:
            squareSize = contentStandard.image_width
        if image.asset_height != squareSize or image.asset_width != squareSize:
            errors['place_on_canvas'] = True
            place_on_canvas_dict = {'width': squareSize, 'height': squareSize}
            errorCount += 1
    else:
        if image.asset_height != contentStandard.image_height or image.asset_width != contentStandard.image_width:
            errors['place_on_canvas'] = True
            place_on_canvas_dict = {'width': contentStandard.image_width, 'height': contentStandard.image_height}
            errorCount += 1

    """############## COMPARING BACKGROUND TYPE ##################"""
    # let's check the image background type:
    # Background identifiers: 1 = transparent; 2 = white; 3 = black; 4 = unknown; 5 = custom
    # since the old content standards and the new asset types operate a little differently let's get them talking
    # in the same language

    if int(image.asset_background_type) == int(1):
        local_test_variable = 'transparent'
        existing_background = 'transparent'
    elif int(image.asset_background_type) == int(2):
        local_test_variable = 'white'
        existing_background = [255, 255, 255]
    elif int(image.asset_background_type) == int(3):
        local_test_variable = 'black'
        existing_background = [0, 0, 0]
    elif int(image.asset_background_type) == int(5):
        local_test_variable = 'custom'
        existing_background = None
    else:
        # either it is explicitly unknown or there is nothing in the field so we don't know anyways
        local_test_variable = 'unknown'
        existing_background = None
    background_color = None
    if str(local_test_variable).lower() != str(contentStandard.image_background_type).lower():
        if int(contentStandard.image_background_type) == 'transparent':
            background_color = 'transparent'
        elif int(contentStandard.image_background_type) == int(2):
            background_color = [255, 255, 255]
        elif int(contentStandard.image_background_type) == int(3):
            background_color = [0, 0, 0]
        elif int(contentStandard.image_background_type) == int(5):
            background_color = None
        else:
            # either it is explicitly unknown or there is nothing in the field so we don't know anyways
            background_color = None
        if image.verified_background_removed is True:
            # TODO: [BACKEND][Jacob] known issue that replacing the background relies on the alpha channel or a mask
            errors['replace_background'] = {'background_color': background_color,
                                            'existing_background': 'transparent'}
        else:
            errors['replace_background'] = {'background_color': background_color,
                                            'existing_background': existing_background}
    # let's check the color space:
    # TODO: [BACKEND][Jacob] add in color space check [FUTURE RELEASE]

    """############## COMPARING MARGINS ##################"""

    # let's check the image margin
    if image.verified_background_removed:
        img = load_image(image.mask_url)
        img = cv2.imread(img, cv2.IMREAD_UNCHANGED)
        if contentStandard.image_margin_type == 'percent':
            margin_value_top, margin_value_bottom, margin_value_left, margin_value_right = \
                check_margin(img, mask=True, margin_type='percentage')
        else:
            margin_value_top, margin_value_bottom, margin_value_left, margin_value_right = \
                check_margin(img, mask=True)

    else:
        if img is None:
            img = load_image(image.url)
            print(img)
            img = Image.open(img)
            img = np.array(img)
        if contentStandard.image_margin_type == 'percent':
            margin_value_top, margin_value_bottom, margin_value_left, margin_value_right = \
                check_margin(img, margin_type='percentage')
        else:
            margin_value_top, margin_value_bottom, margin_value_left, margin_value_right = \
                check_margin(img)

    topErrorFlag = False
    bottomErrorFlag = False
    leftErrorFlag = False
    rightErrorFlag = False

    if contentStandard.image_margin_type == 'percent':
        # allow 5 pixels of deviation from both sides of the bounds
        allowed_deviation = (5 / image.asset_height) * 100
    else:
        allowed_deviation = 5
    if not (contentStandard.image_margin_top - allowed_deviation) <= margin_value_top <= \
           (contentStandard.image_margin_top + allowed_deviation):
        topErrorFlag = True
    if not (contentStandard.image_margin_bottom - allowed_deviation) <= margin_value_bottom <= \
           (contentStandard.image_margin_bottom + allowed_deviation):
        bottomErrorFlag = True
    if not (contentStandard.image_margin_left - allowed_deviation) <= margin_value_left <= \
           (contentStandard.image_margin_left + allowed_deviation):
        leftErrorFlag = True
    if not (contentStandard.image_margin_right - allowed_deviation) <= margin_value_right <= \
           (contentStandard.image_margin_right + allowed_deviation):
        rightErrorFlag = True

    recenterFlag = False
    errorFlag = False
    if topErrorFlag and bottomErrorFlag:
        if leftErrorFlag and rightErrorFlag:
            # all parameters off, concern
            errorFlag = True
        else:
            # we have an object that is wider than it is tall no concern here
            pass
    else:
        # we have an object that is taller than it is wide no concern here
        pass

    if leftErrorFlag or rightErrorFlag or topErrorFlag or bottomErrorFlag:
        # we should recenter anyways
        recenterFlag = True

    if errorFlag or recenterFlag:
        if contentStandard.image_margin_type == 'percent':
            minx = contentStandard.image_margin_left / 100 * image.asset_width
            maxx = contentStandard.image_margin_right / 100 * image.asset_width
            miny = contentStandard.image_margin_top / 100 * image.asset_height
            maxy = contentStandard.image_margin_bottom / 100 * image.asset_height
        else:
            minx = contentStandard.image_margin_left
            maxx = image.asset_width - contentStandard.image_margin_right
            miny = contentStandard.image_margin_top
            maxy = image.asset_height - contentStandard.image_margin_bottom

        if background_color is None:
            bg = [255, 255, 255]
        else:
            bg = background_color

        # TODO: [BACKEND][Jacob] add in functionality to have offset images (aka top > bottom, left < right, etc))
        if contentStandard.force_asset_square:
            newWidth = max(contentStandard.image_width, contentStandard.image_height)
            newHeight = max(contentStandard.image_width, contentStandard.image_height)
            if contentStandard.image_margin_type == 'percent':
                # let's get the average margin size in pixels
                productHeight = (contentStandard.image_margin_right + contentStandard.image_margin_left +
                                 contentStandard.image_margin_top + contentStandard.image_margin_bottom) / 2 / 100 * newWidth
                productWidth = productHeight
            else:
                productHeight = newHeight - ((contentStandard.image_margin_right + contentStandard.image_margin_left +
                                              contentStandard.image_margin_top + contentStandard.image_margin_bottom) / 2)
                productWidth = productHeight
        else:
            newWidth = contentStandard.image_width
            newHeight = contentStandard.image_height
            if contentStandard.image_margin_type == 'percent':
                productWidth = contentStandard.asset_width - (contentStandard.asset_width *
                                                              (contentStandard.image_margin_left +
                                                               contentStandard.image_margin_right) / 100)
                productHeight = contentStandard.asset_height - (contentStandard.asset_height *
                                                                (contentStandard.image_margin_top +
                                                                 contentStandard.image_margin_bottom) / 100)
            else:
                productWidth = contentStandard.asset_width - contentStandard.image_margin_left + \
                               contentStandard.image_margin_right
                productHeight = contentStandard.asset_height - contentStandard.image_margin_top + \
                                contentStandard.image_margin_bottom

        errors['adjust_margin'] = True

    """############## COMPARING NAMING CONVENTION ##################"""

    # check the delimiter
    image_delimiter_hyphen = str(image.file_name).count("-")
    image_delimiter_underscore = str(image.file_name).count("_")
    namingConventionError = False
    image_delimiter = ''
    if image_delimiter_hyphen + image_delimiter_underscore > 0 and image_delimiter_hyphen != image_delimiter_underscore:
        if image_delimiter_hyphen > image_delimiter_underscore:
            image_delimiter = "-"
        else:
            image_delimiter = "_"
    else:
        namingConventionError = True

    if not namingConventionError and not image_delimiter == contentStandard.filename_delimiter:
        namingConventionError = True

    product_object = Product
    cs_filename, prefix, base, suffix, delim = build_filename(contentStandard, product_object=product_object)
    # remove the numbers at the end of image_name
    file_name, _ = splitext(str(image.file_name))
    rev_image_name = file_name[::-1]
    count = 0
    for i in rev_image_name:
        if i.isdigit():
            count += 1
            continue
        else:
            break
    count = len(file_name) - count
    image_name = file_name[:count]
    image_file_number = file_name[count:]
    if image_name != cs_filename:
        namingConventionError = True

    if namingConventionError:
        errors['rename'] = {'prefix': prefix,
                            'base': base,
                            'suffix': suffix,
                            'delim': delim}

    """############## COMPARING FILE TYPE ##################"""
    file_type = str(str(image.file_name)[int(str(image.file_name).rfind('.')):])
    cs_file_type = str(contentStandard.image_file_type)
    if cs_file_type[1] != '.':
        cs_file_type = '.' + cs_file_type
    if not file_type in cs_file_type:
        errors['file_type'] = {'file_type': cs_file_type}

    """############## COMPARING FILE SIZE ##################"""
    # let's check the image file size
    if float(image.size) > float(contentStandard.image_ideal_file_size):
        errors['file_size'] = {'compress'}

    """############## CREATING DICT FILE SIZE ##################"""

    errorsCount = 0
    manipulateDict = {}
    if applyContentStandard:
        # let's create the dictionary to pass onto manipulate images
        if 'remove_background' in errors:
            manipulateDict['remove_background'] = True
            errorsCount += 1
            if 'replace_background' in errors:
                # TODO [BACKEND][Jacob] once bgRemove is in, implement it into the logic
                manipulateDict['replace_background'] = {'background_color': background_color}
                errorsCount += 1
                if 'adjust_margin' in errors:
                    manipulateDict["crop"] = {"leftBorder": minx,
                                              "rightBorder": maxx,
                                              "topBorder": miny,
                                              "bottomBorder": maxy}
                    errorsCount += 1
                    if contentStandard.force_asset_square:
                        manipulateDict["square"] = {'fill_color': bg}
                        errorsCount += 1
                    manipulateDict["resize"] = {"width": productWidth,
                                                "height": productHeight}
                    errorsCount += 1
                    manipulateDict["add_border"] = {"method": "add",
                                                    "size": {"height": newHeight - productHeight,
                                                             "width": newWidth - productWidth},
                                                    "color": bg,
                                                    }
                    errorsCount += 1
                    if 'rename' in errors:
                        manipulateDict['rename'] = {'prefix': prefix,
                                                    'base': base,
                                                    'suffix': suffix,
                                                    'delim': delim}
                        errorsCount += 1
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
                    else:
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
                else:
                    if 'resize-only' in errors:
                        manipulateDict['resize'] = resizeDict
                        errorsCount += 1
                    if 'place_on_canvas' in errors:
                        manipulateDict['place_on_canvas'] = place_on_canvas_dict
                        errorsCount += 1
                    if 'rename' in errors:
                        manipulateDict['rename'] = {'prefix': prefix,
                                                    'base': base,
                                                    'suffix': suffix,
                                                    'delim': delim}
                        errorsCount += 1
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
                    else:
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
            else:
                if 'adjust_margin' in errors:
                    manipulateDict["crop"] = {"leftBorder": minx,
                                              "rightBorder": maxx,
                                              "topBorder": miny,
                                              "bottomBorder": maxy}
                    errorsCount += 1
                    if contentStandard.force_asset_square:
                        manipulateDict["square"] = {'fill_color': bg}
                        errorsCount += 1
                    manipulateDict["resize"] = {"width": productWidth,
                                                "height": productHeight}
                    errorsCount += 1
                    manipulateDict["add_border"] = {"method": "add",
                                                    "size": {"height": newHeight - productHeight,
                                                             "width": newWidth - productWidth},
                                                    "color": bg,
                                                    }
                    errorsCount += 1
                    if 'rename' in errors:
                        manipulateDict['rename'] = {'prefix': prefix,
                                                    'base': base,
                                                    'suffix': suffix,
                                                    'delim': delim}
                        errorsCount += 1
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
                    else:
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
                else:
                    if 'resize-only' in errors:
                        manipulateDict['resize'] = resizeDict
                        errorsCount += 1
                    if 'place_on_canvas' in errors:
                        manipulateDict['place_on_canvas'] = place_on_canvas_dict
                        errorsCount += 1
                    if 'rename' in errors:
                        manipulateDict['rename'] = {'prefix': prefix,
                                                    'base': base,
                                                    'suffix': suffix,
                                                    'delim': delim}
                        errorsCount += 1
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
                    else:
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
        else:
            if 'replace_background' in errors:
                # TODO [BACKEND][Jacob] once bgRemove is in, implement it into the logic
                manipulateDict['replace_background'] = {'background_color': background_color}
                errorsCount += 1
                if 'adjust_margin' in errors:
                    manipulateDict["crop"] = {"leftBorder": minx,
                                              "rightBorder": maxx,
                                              "topBorder": miny,
                                              "bottomBorder": maxy}
                    errorsCount += 1
                    if contentStandard.force_asset_square:
                        manipulateDict["square"] = {'fill_color': bg}
                        errorsCount += 1
                    manipulateDict["resize"] = {"width": productWidth,
                                                "height": productHeight}
                    errorsCount += 1
                    manipulateDict["add_border"] = {"method": "add",
                                                    "size": {"height": newHeight - productHeight,
                                                             "width": newWidth - productWidth},
                                                    "color": bg,
                                                    }
                    errorsCount += 1
                    if 'rename' in errors:
                        manipulateDict['rename'] = {'prefix': prefix,
                                                    'base': base,
                                                    'suffix': suffix,
                                                    'delim': delim}
                        errorsCount += 1
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
                    else:
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
                else:
                    if 'resize-only' in errors:
                        manipulateDict['resize'] = resizeDict
                        errorsCount += 1
                    if 'place_on_canvas' in errors:
                        manipulateDict['place_on_canvas'] = place_on_canvas_dict
                        errorsCount += 1
                    if 'rename' in errors:
                        manipulateDict['rename'] = {'prefix': prefix,
                                                    'base': base,
                                                    'suffix': suffix,
                                                    'delim': delim}
                        errorsCount += 1
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
                    else:
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
            else:
                if 'adjust_margin' in errors:
                    manipulateDict["crop"] = {"leftBorder": minx,
                                              "rightBorder": maxx,
                                              "topBorder": miny,
                                              "bottomBorder": maxy}
                    errorsCount += 1
                    if contentStandard.force_asset_square:
                        manipulateDict["square"] = {'fill_color': bg}
                        errorsCount += 1
                    manipulateDict["resize"] = {"width": productWidth,
                                                "height": productHeight}
                    errorsCount += 1
                    manipulateDict["add_border"] = {"method": "add",
                                                    "size": {"height": newHeight - productHeight,
                                                             "width": newWidth - productWidth},
                                                    "color": bg,
                                                    }
                    errorsCount += 1
                    if 'rename' in errors:
                        manipulateDict['rename'] = {'prefix': prefix,
                                                    'base': base,
                                                    'suffix': suffix,
                                                    'delim': delim}
                        errorsCount += 1
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
                    else:
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
                else:
                    if 'resize-only' in errors:
                        manipulateDict['resize'] = resizeDict
                        errorsCount += 1
                    if 'place_on_canvas' in errors:
                        manipulateDict['place_on_canvas'] = place_on_canvas_dict
                        errorsCount += 1
                    if 'rename' in errors:
                        manipulateDict['rename'] = {'prefix': prefix,
                                                    'base': base,
                                                    'suffix': suffix,
                                                    'delim': delim}
                        errorsCount += 1
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
                    else:
                        if 'file_type' in errors:
                            manipulateDict['rename']['file_type'] = cs_file_type
                            errorsCount += 1
                            if 'file_size' in errors:
                                manipulateDict['rename']['compress'] = True
                                errorsCount += 1
        img = Image.fromarray(img)
        imageEditor = ManipulateImage(img, image)
        outimg, outmask = imageEditor.manipulate(manipulateDict)
        outImgName = build_filename(useDict=True, prefix=prefix, base=base, suffix=suffix,
                                    delim=delim, ext=cs_file_type, number=image_file_number)
        # save some memory
        del imageEditor

        # if the standards are 'strict' then let's double check that the photo is the correct size
        if contentStandard.strictnessLevel == 'strict':
            if 'resize' in manipulateDict or 'resize-only' in manipulateDict:
                manipulateDict = {'resize': {"width": contentStandard.image_width,
                                             "height": contentStandard.image_height}}
                imageEditor = ManipulateImage(outimg, mask=outmask)
                outimg = imageEditor.manipulate(manipulateDict)

                # save some memory
                del imageEditor
        return outimg, outmask, outImgName, errorsCount
    else:
        return None, None, 0


def product_to_content_standard(contentStandard, request, product=None, debug=False, applyContentStandard=False,
                                specificAssets=None):
    """
    compares a product object to a content standard object
    :param product: Product object
    :param contentStandard: ContentStandard object
    :param debug:
    :return: dictionary of actions to fix the deficiencies
    """
    # let's check the number of assets first
    errors = 0
    errorsList = []
    hasProduct_object = False
    if specificAssets is None:
        AssetImages = ProductAsset.objects.filter(product=product.uniqueID,
                                                  assetType=1,
                                                  appliedContentStandard__contentStandard__uniqueID=
                                                  contentStandard.uniqueID)
        Asset360s = ProductAsset.objects.filter(product=product.uniqueID,
                                                assetType=2,
                                                appliedContentStandard__contentStandard__uniqueID=
                                                contentStandard.uniqueID)
        AssetVideos = ProductAsset.objects.filter(product=product.uniqueID,
                                                  assetType=3,
                                                  appliedContentStandard__contentStandard__uniqueID=
                                                  contentStandard.uniqueID)
        Asset3DModels = ProductAsset.objects.filter(product=product.uniqueID,
                                                    assetType=4,
                                                    appliedContentStandard__contentStandard__uniqueID=
                                                    contentStandard.uniqueID)

        AllAssetImages = ProductAsset.objects.filter(product=product.uniqueID, assetType=1)
        AllAsset360s = ProductAsset.objects.filter(product=product.uniqueID, assetType=2)
        AllAssetVideos = ProductAsset.objects.filter(product=product.uniqueID, assetType=3)
        AllAsset3DModels = ProductAsset.objects.filter(product=product.uniqueID, assetType=4)

        assets = []
        if AssetImages.count() < AllAssetImages.count():
            assets.append(AllAssetImages)
        else:
            assets.append(AssetImages)

        if Asset360s.count() < AllAsset360s.count():
            assets.append(AllAsset360s)
        else:
            assets.append(Asset360s)

        if AssetVideos.count() < AllAssetVideos.count():
            assets.append(AllAssetVideos)
        else:
            assets.append(AssetVideos)

        if Asset3DModels.count() < AllAsset3DModels.count():
            assets.append(AllAsset3DModels)
        else:
            assets.append(Asset3DModels)
        hasProduct_object = True

    else:
        assets = [specificAssets]
        # let's see if we are editing objects or just names
        try:
            test = assets[0].uniqueID
            del test
        except:
            lc = 0
            for asset in assets[0]:
                assets[lc] = ProductAsset.objects.get(uniqueID=asset)
                lc += 1
            hasProduct_object = False
            del lc

    # iterate over the assets
    count = 0
    for assetType in assets:
        for asset in assetType:
            # if asset is an image or video, let's act on it
            if count == 0 or count == 2:
                outimg, outmask, outImgName, errors = image_to_content_standard(asset, contentStandard, request,
                                                                       applyContentStandard=applyContentStandard)

                # let's creat our key
                key = build_key(request=request, file_address=outImgName, productAsset_object=asset,
                                contentStandard=contentStandard)
                if hasProduct_object:
                    save_adjusted_asset(outimg, outImgName, outmask, asset, product, contentStandard, request, key=key)
                else:
                    product = Product.objects.get(id=asset.product)
                    save_adjusted_asset(outimg, outImgName, outmask, asset, product, contentStandard, request, key=key)
                errors += errors
            if count == 1:
                # TODO: [BACKEND][Jacob] add in 360 logic
                pass
        count += 1

    if contentStandard.image_number is not None:
        if int(len(assets[0])) < int(contentStandard.image_number):
            errors += 1
            errorsList.append('Insufficient Number of Images')

    if contentStandard.description:
        if not product.description:
            errors += 1
            errorsList.append('No Product Description')

    return errorsList, errors


def product_list_to_content_standard(productList, contentStandard, request, debug=False, applyContentStandard=False):
    """
    compares a product object to a content standard object
    :param productList: list of Product objects or Product.UniqueIDs
    :param contentStandard: ContentStandard object
    :param debug:
    :return: dictionary of actions to fix the deficiencies
    """
    # let's check the number of assets first
    errorCount = 0
    errorsList = []
    try:
        test = productList[0].uniqueID
        usingObjects = True
        del test
    except:
        usingObjects = False



    for product in productList:
        if not usingObjects:
            product = Product.objects.get(uniqueID=product)
        errors = product_to_content_standard(product=product, contentStandard=contentStandard, debug=debug,
                                             applyContentStandard=applyContentStandard, request=request)
        errorsList.append({product.uniqueID: errors[0]})
        errorCount += int(errors[1])
