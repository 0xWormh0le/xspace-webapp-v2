import ipdb
from os import listdir, walk, remove, makedirs
from os.path import join, isdir, isfile, normcase, split, splitext
import zipfile
from pathlib import Path
import re
from xapi.settings import USE_LOCAL_STORAGE, LOCAL_STORAGE_LOCATION, AWS_STORAGE_BUCKET_NAME, \
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BASE_DIR, LOCAL_STORAGE_URL
import pprint
from io import BytesIO
import boto3


def migrate_products(Product):
    restr = u'[/\\:\\?\\\u201d\\<\\>\\|\\[\\]\\(\\)\\^\\#\\%\\&\\!\\@\\:\\+\\=\\{\\}\\\u2019\\~\\\u2013\u2014]'
    pds = Product.objects.all()
    found_array = []
    count = 0
    print('Starting migration')
    for idx, pd in enumerate(pds):
        count += 1
        name = pd.name
        pd.url_safe = create_url_safe(name)
        pd.save()
        print("{} of {} fixed.".format(count, pds.count()))


def migrate_companies(Company):
    restr = u'[/\\:\\?\\\u201d\\<\\>\\|\\[\\]\\(\\)\\^\\#\\%\\&\\!\\@\\:\\+\\=\\{\\}\\\u2019\\~\\\u2013\u2014]'
    cmps = Company.objects.all()
    found_array = []
    count = 0
    print('Starting migration')
    for idx, cmp in enumerate(cmps):
        count += 1
        name = cmp.name
        cmp.url_safe = create_url_safe(name)
        cmp.save()
        print("{} of {} fixed.".format(count, cmps.count()))


def create_url_safe(name):
    # TODO: [BACKEND][Dom] verify against database that the url doesn't already exist
    restr = u'[/\\:\\?\\\u201d\\<\\>\\|\\[\\]\\(\\)\\^\\#\\%\\&\\!\\@\\:\\+\\=\\{\\}\\\u2019\\~\\\u2013\u2014]'
    url_safe_name = name.replace(' ', '')
    url_safe_name = url_safe_name.lower()
    url_safe_name = re.sub(restr, "_", url_safe_name)
    return url_safe_name


def get_file_type(file_address):
    # print("getting file type from:", file_address)
    try:
        ext = str(str(file_address)[int(str(file_address).rfind('.')):])
        ext = ext.lower()
    except IndexError:
        return 0
    # print("found ext as:", ext)
    imgTypes = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.raw', '.dng', '.bmp', '.jfif']
    videoTypes = ['.webm', '.mkv', '.flv', '.flv', '.vob', '.ogv', '.ogg', '.drc', '.gif', '.gifv', '.mng',
                  '.avi', '.mov', '.mts', '.m2ts', '.ts', '.qt', '.wmv', '.yuv', '.rm', '.rmvb', '.asf',
                  '.amv', '.mp4', '.m4p', '.m4v', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.mpg', '.m2v',
                  '.svi', '.3gp', '.3g2', '.mxf', '.roq', '.nsv', '.flv', '.f4v', '.f4p', '.f4a', '.f4b']
    threedModelTypes = ['amf', '.blend', '.dgn', '.dwf', '.dwg', '.dxf', '.flt', '.fvrml', '.hsf', '.iges',
                        '.imml', '.ipa', '.ma', '.mb', '.obj', '.ply', '.pov', '.prc', '.step', '.skp', '.stl',
                        '.u3d', '.vrml', '.xaml', '.xgl', '.xvl', '.xvrml', '.x3d', '.3d', '.3df', '.3dm',
                        '.3ds', '.3dxml']
    file_types = [imgTypes, videoTypes, threedModelTypes]
    count = 0
    for g in file_types:
        for f in g:
            if str(ext) == f:
                if count == 0:
                    return 1
                elif count == 1:
                    return 3
                elif count == 2:
                    return 4
        count += 1
    # didn't find anything return '0' meaning 'IDK what the heck this is'
    return 0


def local_find_files(directory, ext=None, subd=True, folder=False, relative=True):
    """
    finds the files in the directories and/or subdirectories that match the type
    :param directory: Directory you want to search
    :param ext: AKA extension of the file. should be input similar to 'png' format
    :param subd: Boolean where True is if you only want to search that directory and its subdirectories
    False gives you the results from only that directory and not its subdirectories
    :param folder: if True, will return the folder paths in the directory, when combined with 'subd=True' all
    subdirectory folder paths will be returned
    :return: returns a dictionary of 'WindowsPaths' or 'PosixPaths' (linux/mac) depending on the OS
    """
    result = []
    if not isdir(directory):
        return 0, result
    if folder:
        if subd:
            for root, dirs, files in walk(directory):
                for d in dirs:
                    result.append(Path(join(root, d)))
        else:
            if len(listdir(directory)) > 0:
                result = [f for f in listdir(directory) if isdir(join(directory, f))]
                count = 0
                for f in result:
                    result[count] = Path(join(directory, f))
                    count += 1
    # since we are not searching for a folder, we will assume that files are being searched for
    else:
        if subd:
            if ext is None:
                result = list(Path(str(directory)).glob('**/*.*'))
            else:
                if len(ext) > 3:
                    ext = ext[-3:]
                result = list(Path(str(directory)).glob(str("**/*.%s" % ext)))
        else:
            if ext is None:
                result = list(Path(str(directory)).glob("*.*"))
            else:
                if len(ext) > 3:
                    ext = ext[-3:]
                result = list(Path(str(directory)).glob(str("*.%s" % ext)))
    if len(result) == 0:
        return 0, result
    else:
        outdict = []
        count = 0
        for i in result:
            if relative:
                i = normcase(i)
                directory = normcase(directory)
                i = str(i).replace(directory, '')
            outdict.append({'key': normcase(i)})
            count += 1
        return len(result), outdict


def is_product(product):
    from app.products.models import Product
    try:
        test = Product.objects.get(uniqueID=product.uniqueID)
        return True
    except:
        return False


def is_company(company):
    from app.accounts.models import Company
    try:
        test = Company.objects.get(uniqueID=company.uniqueID)
        return True
    except:
        return False


def is_asset(asset):
    from app.products.models import ProductAsset
    try:
        test = ProductAsset.objects.get(uniqueID=asset.uniqueID)
        return True
    except:
        return False


def is_image(asset):
    from app.products.models import ProductAsset
    try:
        test = ProductAsset.objects.get(uniqueID=asset.uniqueID)
        return True
    except:
        return False


def has_content_standard(asset):
    from app.products.models import AssetContentStandards
    try:
        test = AssetContentStandards.objects.get(productAsset=asset)
        return True
    except:
        # we might be dealing with a product
        try:
            test = AssetContentStandards.objects.get(product=asset)
            return True
        except:
            # we might be dealing with a company\
            # TODO: [BACKEND][Jacob] add logic for dealing with companies
            return False


def is_content_standard(contentStandard):
    """
    true/false helper test
    :param asset:
    :return:
    """
    from app.orders.models import ContentStandard
    try:
        test = ContentStandard.objects.get(uniqueID=contentStandard.uniqueID)
        return True
    except:
        return False


def is_profile(p):
    """
    true/false helper test
    :param p:
    :return:
    """
    from app.accounts.models import Profile
    try:
        test = Profile.objects.get(uniqueID=p.uniqueID)
        return True
    except:
        return False


class ProductUploadFolderParser():
    """
    This class is responsible for parsing through file lists, zip files and folders to establish similarities between
    arbitrary amounts of assets in order to create a dictionary that is verified by the user in order to upload an
    arbitrary number of assets to an arbitrary number of products
    """

    def create(self, validated_data):
        """
        creates the dictionary described above
        :param validated_data:
        :return:
        """
        print("!!!!!!!!!!!!!!!!!!!!!!     ProductUploadFolderSerializer.CREATE Function   !!!!!!!!!!!!!!!!!!!!!")
        from app.imageEditingFunctions.file_name_functions import findFiles, lowestFileCounts, longestSubstringFinder, \
            get_delimiter, get_digits
        from app.core.utility import boto3Upload3
        from app.products.models import Product
        from app.accounts.models import Profile

        context = validated_data[1]
        request = validated_data[0]

        # get the variables passed to us
        upload_file = context.get('file')
        upload_file_folder = splitext(split(upload_file.name)[1])[0]
        upload_file_name = upload_file.name
        pk = context.get('pk')
        zipFlag = context.get('zip')
        if 'product_slug' in context:
            product_slug = context.get('product_slug')
            # pid = self.context.get('pid')
            # username = self.context.get('username')
            product_uniqueID = Product.objects.get(slug=product_slug).uniqueID

        profile = Profile.objects.get(user=pk)
        company = profile.companyProfile
        company_slug = company.slug
        # product = Product.objects.get(uniqueID=product_uniqueID)
        # if a zip flag, let's unzip the folder
        if zipFlag:
            # temporarily write the zips contents to the storage folder under "TEMP"
            # that way we can move stuff afterwards
            # let's creat our key
            key = (company_slug + '/temp/zipfiles/' + str(upload_file_folder) + '/')
            overwriteFlag = False
            if USE_LOCAL_STORAGE:
                outputLocation = join('c:', "xui", "public", "local_storage", key)
                # outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, key))
                if not isdir(outputLocation):
                    makedirs(outputLocation)
                location = normcase(join(outputLocation, upload_file_name))
                if isfile(location):
                    print("overwriting file at:", location)
                    overwriteFlag = True
                with open(location, 'wb+') as f:
                    for chunk in upload_file.chunks():
                        f.write(chunk)
                print("successfully wrote to:", location)
                print("unzipping:", location)
                with zipfile.ZipFile(location, 'r') as zip_ref:
                    zip_ref.extractall(split(location)[0])
                remove(location)
                location = location[:-4]

            # otherwise we are saving it to the cloud
            else:
                # TODO: [BACKEND][Jacob]  convert unzipping logic to s3
                location, zip_key = boto3Upload3(upload_file, company_slug, key, return_key=True)
                loc = location.split('/')

                newBucketKey = split(zip_key)[0]
                # unzip the file while avoiding lambda and writing to server disk
                s3_resource = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY_ID,
                                             aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
                zip_obj = s3_resource.Object(bucket_name=AWS_STORAGE_BUCKET_NAME, key=zip_key)
                buffer = BytesIO(zip_obj.get()["Body"].read())
                print('beginning to unzip')
                z = zipfile.ZipFile(buffer)
                for filename in z.namelist():
                    print('unzipping', str(filename), newBucketKey + '/' + filename)
                    file_info = z.getinfo(filename)
                    print('file_info for', str(filename), ':', file_info)
                    s3_resource.meta.client.upload_fileobj(
                        z.open(filename),
                        Bucket=AWS_STORAGE_BUCKET_NAME,
                        Key=f"{newBucketKey + '/' + filename}"
                    )
                    print('finished uploading:', filename, '\n##################\n\n')

        elif isdir(upload_file_name):
            # TODO: [BACKEND][Jacob]  add in uploading folder logic
            return None
        elif isfile(upload_file_name) and str(upload_file_name)[-4:] != '.zip':
            # we have a file so let's just upload and analyze it
            # TODO: [BACKEND][Jacob]  add in uploading folder logic
            # let's create our key
            key = (company_slug + '/temp/zipfiles/')
            overwriteFlag = False
            if USE_LOCAL_STORAGE:
                outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, key))
                if not isdir(outputLocation):
                    makedirs(outputLocation)
                location = normcase(join(outputLocation, upload_file_name))
                if isfile(location):
                    # TODO: [BACKEND][Jacob]  add in overwriting logic
                    print("overwriting file at:", location)
                    overwriteFlag = True
                with open(location, 'wb+') as f:
                    for chunk in upload_file.chunks():
                        f.write(chunk)
                print("successfully wrote to:", location)
            else:
                # TODO: [BACKEND][Jacob]  convert unzipping logic to s3
                location = boto3Upload3(upload_file, company_slug, key)
        else:
            return None

        # let's generate our dictionary of where we think stuff should go

        # Angel says this stuff isn't used and not needed.
        # output = {}
        # is_flat = False
        # total, folders = findFiles(split(location)[0], folder=True)
        # print('FIRST SWEEP', total, folders)
        # if folders is None:
        #     is_flat = True
        #     total, files = findFiles(split(location)[0], folder=False)
        #     print('SECOND SWEEP', total, files)
        #
        #     if files is None:
        #         if isfile(location):
        #             # go through filename deconstruction logic
        #             pass
        #     else:
        #         # go through filename deconstruction logic
        #         pass

        # else:

        #  <------ else above moved to main code.
        print('getting to analyzing')
        locati = split(location)[0]
        if not USE_LOCAL_STORAGE:
            # we have to adjust the url so that boto3 can process the path
            locati = locati.replace("https://" + AWS_STORAGE_BUCKET_NAME + ".s3.amazonaws.com/", '')
        print('locati', locati)
        structure = lowestFileCounts(locati)
        pprint.pprint(structure)
        relative_depth = len(Path(locati).parts)
        print("'calc'd rel depth")
        depth = len([x for x in structure if x and x[0][1] != locati.replace('\\', '/')])
        print("relative depth, depth:", relative_depth, depth)
        # ultimate goal of the output is to place each image into it's product bucket

        # output = {'ProductName/UPC/SKU':
        #               {'2D': ['/image_1.png', ...],
        #                '360': ['/folder1', ...],
        #                ...
        #                },
        #           'ProductName/UPC/SKU':
        #               {'2D': ['/image_1.png', ...],
        #                '360': ['/folder1', ...],
        #                ...
        #                },
        #           }
        # TODO: [BACKEND][Jacob] return list of products
        output = {}

        listofProducts = []
        dictionaryOfTypes = {'2D': [],
                             '360': [],
                             '3D': [],
                             'Video': [],
                             'Misc': [],
                             }
        depth_counter = 0
        for depth in structure:
            if depth_counter == 0:
                top_level = True
            else:
                top_level = False
            globalCount = 0

            for folder in depth:
                fileCount, folderPath, files = folder
                folderName = split(folderPath)[1]
                if fileCount is None:
                    continue
                else:
                    # let's refine the list:
                    images = []
                    threeD = []
                    video = []
                    misc = []
                    dictionaryOfTypes = {'uniqueID': [],
                                         'name': [],
                                         '2D': [],
                                         '360': [],
                                         '3D': [],
                                         'Video': [],
                                         'Misc': [],
                                         }
                    for file in files:
                        file_type = get_file_type(str(file))
                        if file_type == 1:
                            # this is a photo
                            images.append(file)
                        elif file_type == 3:
                            # this is a video
                            video.append(file)
                        elif file_type == 4:
                            # this is a 3D file
                            threeD.append(file)
                        else:
                            misc.append(file)

                    # let's grab the common parts of all the file names in the files
                    typ_count = 0
                    commonPart = None
                    typList = [images, threeD, video, misc]
                    productEstablished = False
                    for typ in typList:
                        if len(typ) == 0:
                            typ_count += 1
                            continue
                        if not productEstablished:
                            local_file_count = 0
                            for file in typ:
                                if local_file_count == 0:
                                    commonPart = Path(file).stem
                                    local_file_count += 1
                                else:
                                    temp = longestSubstringFinder(commonPart, Path(file).stem)
                                    if temp == "":
                                        continue
                                    else:
                                        commonPart = temp
                                    local_file_count += 1
                            # print("common part:", commonPart)
                            folder_common_part = longestSubstringFinder(folderName, commonPart)
                            # print("folder:", folderName)
                            # print("folder common part:", folder_common_part, "\n")
                            threshold = .65
                            diff = len(folder_common_part) / len(commonPart)
                            folder2DFlag = False
                            folder360Flag = False
                            if folder_common_part != "" and diff >= threshold:
                                # this means that we found a commonality between the folder name and the images so we can be
                                # reasonably sure that this is the correct name for the product
                                spinFlag = False
                                front_digit_list = []
                                rear_digit_list = []
                                for file in typ:
                                    filename = Path(file).stem
                                    fileExt = Path(file).suffix
                                    # reduce the filename to the possible iterable part
                                    extrabit = filename.replace(folder_common_part, '')
                                    delimiter = get_delimiter(extrabit)
                                    # print("file parts:", filename, extrabit, delimiter)
                                    if extrabit[0] == delimiter:
                                        extrabit = extrabit[1:]
                                    rear_digits = get_digits(extrabit)
                                    if len(rear_digits) == 0:
                                        # no digits found in the extrabit
                                        continue
                                    rear_digit_list.append(rear_digits)
                                    if len(rear_digits) != len(extrabit):
                                        front_digits = get_digits(extrabit, from_back=False)
                                        front_digit_list.append(front_digits)
                                        if len(front_digits) > 0 and len(front_digits) == len(rear_digits):
                                            # we are likely dealing with a dual numbering schema aka a spin
                                            spinFlag = True
                                #         print("extrabit", extrabit, "\n",
                                #               "rear_digits", rear_digits, "\n",
                                #               "front_digits", front_digits, "\n",
                                #               "spinFlag", spinFlag)
                                #
                                # print("front_digit_list", front_digit_list, "\n",
                                #       "rear_digit_list", rear_digit_list)

                                rear_digit_sequential = False
                                front_digit_sequential = False

                                if len(rear_digit_list) > 0:
                                    rear_unique_values = {}
                                    for x in rear_digit_list:
                                        if x in rear_unique_values:
                                            rear_unique_values[x] = rear_unique_values[x] + 1
                                        else:
                                            rear_unique_values[x] = 1
                                    rear_digit_sequential = True
                                    common_value = None
                                    for x in rear_unique_values.values():
                                        if common_value is None:
                                            common_value = x
                                            continue
                                        if x == common_value:
                                            continue
                                        else:
                                            rear_digit_sequential = False
                                    # print("rear digits unique values:", rear_unique_values)

                                if len(front_digit_list) > 0:
                                    # front digit likely has duplicates... lets analyze that
                                    front_unique_values = {}
                                    for x in front_digit_list:
                                        if x in front_unique_values:
                                            front_unique_values[x] = front_unique_values[x] + 1
                                        else:
                                            front_unique_values[x] = 1
                                    # front_digit_list_compact = list(dict.fromkeys(front_digit_list))
                                    front_digit_sequential = True
                                    common_value = None
                                    for x in front_unique_values.values():
                                        if common_value is None:
                                            common_value = x
                                            continue
                                        if x == common_value:
                                            continue
                                        else:
                                            front_digit_sequential = False
                                    # print("front digits unique values:", front_unique_values)

                                if rear_digit_sequential and front_digit_sequential:
                                    folder360Flag = True
                                    # print("Is this a likely spin?:", folder360Flag)

                                else:
                                    folder2DFlag = True
                                #     print("Is this likely a bunch of photos?:", folder2DFlag)
                                #
                                # print("front digits sequential?:", front_digit_sequential)
                                # print("rear digits sequential?:", rear_digit_sequential)

                            else:
                                folder2DFlag = True
                                folder_common_part = None

                            # let's establish where this sucker goes by if the common part line up with a
                            # SKU, name, or upccode
                            cp = []
                            if folder_common_part is not None:
                                cp.append(folder_common_part)
                            if commonPart is not None:
                                cp.append(commonPart)
                            namingSchema = None
                            local_count = 0
                            for x in cp:
                                obj = Product.objects.filter(name=x, company=company)
                                if obj.count() > 0:
                                    print("Product returned", obj.count(), "for name and", folder_common_part)
                                    namingSchema = "Name"
                                    if local_count == 0:
                                        output[folder_common_part] = dictionaryOfTypes
                                        output[folder_common_part]['uniqueID'] = \
                                            Product.objects.get(name=x, company=company).uniqueID
                                        output[folder_common_part]['name'] = folder_common_part
                                        commonPart = None
                                    else:
                                        output[commonPart] = dictionaryOfTypes
                                        output[commonPart]['uniqueID'] = \
                                            Product.objects.get(name=x, company=company).uniqueID
                                        output[commonPart]['name'] = commonPart
                                    break

                                else:
                                    obj = Product.objects.filter(SKU=x, company=company)
                                    namingSchema = "SKU"
                                    if obj.count() == 0:
                                        obj = Product.objects.filter(upccode=x, company=company)
                                        if obj.count() == 0:
                                            local_count += 1
                                            folder_common_part = None
                                            continue
                                        else:
                                            print("Product returned", obj.count(), "for upccode and", x)
                                            if local_count == 0:
                                                output[folder_common_part] = dictionaryOfTypes
                                                p = Product.objects.get(upccode=x, company=company)
                                                output[folder_common_part]['uniqueID'] = p.uniqueID
                                                output[folder_common_part]['name'] = p.name
                                                commonPart = None
                                            else:
                                                output[commonPart] = dictionaryOfTypes
                                                p = Product.objects.get(upccode=x, company=company)
                                                output[commonPart]['uniqueID'] = p.uniqueID
                                                output[commonPart]['name'] = p.name
                                            break
                                    else:
                                        print("Product returned", obj.count(), "for SKU and", x)
                                        if local_count == 0:
                                            output[folder_common_part] = dictionaryOfTypes
                                            p = Product.objects.get(SKU=x, company=company)
                                            output[folder_common_part]['uniqueID'] = p.uniqueID
                                            output[folder_common_part]['name'] = p.name
                                            commonPart = None
                                        else:
                                            output[commonPart] = dictionaryOfTypes
                                            p = Product.objects.get(SKU=x, company=company)
                                            output[commonPart]['uniqueID'] = p.uniqueID
                                            output[commonPart]['name'] = p.name
                                        break
                            if obj.count() == 0:
                                print("Product name, sku, nor upccode was found in the filename")
                                commonPart = None
                                folder_common_part = None
                            productEstablished = True
                        # let's create the dictionary
                        if commonPart is None:
                            if folder_common_part is None:
                                if output.get('Unknown File Naming Schema') is None:
                                    output['Unknown File Naming Schema'] = dictionaryOfTypes
                                if typ_count == 0:
                                    if folder2DFlag:
                                        output['Unknown File Naming Schema']['2D'] = \
                                            output['Unknown File Naming Schema'].get('2D') + [typ]
                                    if folder360Flag:
                                        output['Unknown File Naming Schema']['360'] = \
                                            output['Unknown File Naming Schema'].get('360') + [typ]
                                elif typ_count == 1:
                                    output['Unknown File Naming Schema']['Video'] = \
                                        output['Unknown File Naming Schema'].get('Video') + [typ]
                                elif typ_count == 2:
                                    output['Unknown File Naming Schema']['3D'] = \
                                        output['Unknown File Naming Schema'].get('3D') + [typ]
                                elif typ_count == 3:
                                    output['Unknown File Naming Schema']['Misc'] = \
                                        output['Unknown File Naming Schema'].get('Misc') + [typ]
                            else:
                                if str(folder_common_part) not in output:
                                    output[str(folder_common_part)] = dictionaryOfTypes
                                if typ_count == 0:
                                    if folder2DFlag:
                                        output[str(folder_common_part)]['2D'] = \
                                            output[str(folder_common_part)].get('2D') + [typ]
                                    if folder360Flag:
                                        output[str(folder_common_part)]['360'] += [typ]
                                elif typ_count == 1:
                                    output[str(folder_common_part)]['Video'] = \
                                        output[str(folder_common_part)].get('Video') + [typ]
                                elif typ_count == 2:
                                    output[str(folder_common_part)]['3D'] = \
                                        output[str(folder_common_part)].get('3D') + [typ]
                                elif typ_count == 3:
                                    output[str(folder_common_part)]['Misc'] = \
                                        output[str(folder_common_part)].get('Misc') + [typ]
                        else:
                            if output.get(str(commonPart)) is None:
                                output[str(commonPart)] = dictionaryOfTypes
                            if typ_count == 0:
                                if folder2DFlag:
                                    output[str(commonPart)]['2D'] = \
                                        output[str(commonPart)].get('2D') + [typ]
                                if folder360Flag:
                                    output[str(commonPart)]['360'] = \
                                        output[str(commonPart)].get('360') + [typ]
                            elif typ_count == 1:
                                output[str(commonPart)]['Video'] = \
                                    output[str(commonPart)].get('Video') + [typ]
                            elif typ_count == 2:
                                output[str(commonPart)]['3D'] = \
                                    output[str(commonPart)].get('3D') + [typ]
                            elif typ_count == 3:
                                output[str(commonPart)]['Misc'] = \
                                    output[str(commonPart)].get('Misc') + [typ]
                        typ_count += 1
        pprint.pprint(output)
        output["Current XSPACE Location of Assets"] = split(location)[0]
        return output
