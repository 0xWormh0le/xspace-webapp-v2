import cv2
from PIL import Image, ImageOps, ImageEnhance, ImageChops, ImageFilter
import numpy as np
from xapi.settings import TEST_LOCAL, LOCAL_STORAGE_LOCATION, USE_LOCAL_STORAGE, AWS_STORAGE_BUCKET_NAME, \
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BASE_DIR, BG_REMOVE_KEY
from io import BytesIO
from .file_name_functions import ifnot_create_dir, file_copy
import requests
from .utilities.removebg import RemoveBg
from os.path import join, normcase, split, splitext
import base64
from django.utils import timezone


def load_image(imageAddress, return_bytes=True):
    """
    load and return an image as a byte string
    :param image: image object as an bytes object
    :return:
    """
    # let's generate the information about the image
    if USE_LOCAL_STORAGE:
        with open(str(imageAddress), 'rb') as f:
            file_bytes = BytesIO(f.read())
    else:
        # TODO: [BACKEND][Jacob] verify that this works on S3
        response = requests.get(imageAddress)
        if return_bytes:
            file_bytes = BytesIO(response.content).read()
        else:
            file_bytes = response.content
    return file_bytes


def detect_blob(image):
    """
    takes a thresholded opencv image array and returns the blob
    :param image: opencv image array
    :return: blob
    """
    # Set up the detector with default parameters
    # Find the largest contour and extract it
    try:
        contours, hierarchy = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    except:
        try:
            _, maskedImg = cv2.threshold(image[:, :, 3], 1, 255, cv2.THRESH_BINARY)
            contours, hierarchy = cv2.findContours(maskedImg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        except:
            return None
    maxContour = 0
    maxContourData = []
    for contour in contours:
        contourSize = cv2.contourArea(contour)
        if contourSize > maxContour:
            maxContour = contourSize
            maxContourData = contour
    if maxContourData == []:
        return None

    # Create a mask from the largest contour
    maskedImg = np.zeros_like(image)
    filled = cv2.fillPoly(maskedImg, [maxContourData], 255)
    output = cv2.bitwise_and(filled, image)
    return output


def get_background_type(img, asset_channels=None):
    # let's determine the background
    # Background identifiers: 1 = transparent; 2 = white; 3 = black; 4 = unknown; 5 = custom
    # get background color by sampling the corner of the image
    img = img[0:10, 0:10]
    if asset_channels is None:
        try:
            asset_channels = img.shape[2]
        except:
            asset_channels = 1
    img = cv2.mean(img)
    background_color = img[:3]
    if int(asset_channels) >= int(3):
        # dealing with an 3+ channel image
        if int(asset_channels) == int(4) and int(img[-1]) == int(0):
            asset_background_type = int(1)
            background_color = 'transparent'
        elif int(sum(img[:]) / len(img)) == int(255):
            asset_background_type = int(2)
        elif int(sum(img[:]) / len(img)) == int(0):
            asset_background_type = int(3)
        else:
            # we don't know the background type
            asset_background_type = int(4)
    else:
        # dealing with a single channel image
        if int(sum(img[:]) / len(img)) == int(255):
            asset_background_type = int(2)
        elif int(sum(img[:]) / len(img)) == int(0):
            asset_background_type = int(3)
        else:
            # we don't know the background type
            asset_background_type = int(4)
    return asset_background_type, background_color


def crop_group_alpha(img):
    """
    crop the transparency away from a background removed image
    :param img: opencv img array
    :return: opencv img array
    """

    y, x = img[:, :].nonzero()  # get the nonzero alpha coordinates
    minx = np.min(x)
    miny = np.min(y)
    maxx = np.max(x)
    maxy = np.max(y)
    crop_img = img[miny:maxy, minx:maxx]
    return crop_img, minx, miny, maxx, maxy


def center_on_canvas(img, height, width, background='replicate_border'):
    '''
    PIL image array: centers an image on a new canvas of a given size, image needs to be smaller
    than the canvas if it isn't the image returns 'None'
    '''
    # convert to opencv image array
    img = np.array(img)

    yImg, xImg, _ = img.shape
    dataType = img.dtype

    result = np.zeros((width, height, 4), dtype=dataType)

    yCanvas, xCanvas, _ = result.shape
    if xCanvas < xImg | yCanvas < yImg:
        return None
    xc = xCanvas / 2
    yc = yCanvas / 2
    xu = xc - (xImg / 2)
    yu = yc - (yImg / 2)
    xl = xc + (xImg / 2)
    yl = yc + (yImg / 2)

    # pin to bottom right
    result[int(yu):int(yl), int(xu):int(xl)] = img

    # convert to PIL image array
    result = Image.fromarray(result)

    return result


def overlay_image_alpha(img, img_overlay, pos, alpha_mask):
    """
    Overlay an img 'img_overlay' on top of another img 'img' at the position specified by
    pos and blend using alpha_mask.

    Alpha mask must contain values within the range [0, 1] and be the
    same size as img_overlay.
    """

    x, y = pos

    # Image ranges
    y1, y2 = max(0, y), min(img.shape[0], y + img_overlay.shape[0])
    x1, x2 = max(0, x), min(img.shape[1], x + img_overlay.shape[1])

    # Overlay ranges
    y1o, y2o = max(0, -y), min(img_overlay.shape[0], img.shape[0] - y)
    x1o, x2o = max(0, -x), min(img_overlay.shape[1], img.shape[1] - x)

    # Exit if nothing to do
    if y1 >= y2 or x1 >= x2 or y1o >= y2o or x1o >= x2o:
        return

    channels = img.shape[2]

    alpha = alpha_mask[y1o:y2o, x1o:x2o]
    alpha_inv = 1.0 - alpha

    for c in range(channels):
        img[y1:y2, x1:x2, c] = (alpha * img_overlay[y1o:y2o, x1o:x2o, c] +
                                alpha_inv * img[y1:y2, x1:x2, c])
    return img


def exif_color_space(img):
    exif = img._getexif() or {}
    if exif.get(0xA001) == 1 or exif.get(0x0001) == 'R98':
        print('This image uses sRGB color space')
        return "sRGB"
    elif exif.get(0xA001) == 2 or exif.get(0x0001) == 'R03':
        print('This image uses Adobe RGB color space')
        return "AdobeRGB"
    elif exif.get(0xA001) is None and exif.get(0x0001) is None:
        print('Empty EXIF tags ColorSpace and InteropIndex')
        return "sRGB"
    else:
        print('This image uses UNKNOWN color space (%s, %s)' %
              (exif.get(0xA001), exif.get(0x0001)))
        return "sRGB"


def placeOnWhite(img):
    height, width, _ = img.shape
    bg = np.zeros_like(img, np.uint8)
    bg[:, :, :] = 255
    alpha = np.zeros_like(img)
    try:
        alpha[:, :, 0] = img[:, :, 3]
        alpha[:, :, 1] = img[:, :, 3]
        alpha[:, :, 2] = img[:, :, 3]
        img = img.astype(float)
        bg = bg.astype(float)
        alpha = alpha.astype(float) / 255
        img = cv2.multiply(alpha, img)
        bg = cv2.multiply(1.0 - alpha, bg)
        outImage = cv2.add(img, bg)
    except IndexError:
        outImage = np.zeros([height, width, 4], np.uint8)
        outImage[:, :, 0] = img[:, :, 0]
        outImage[:, :, 1] = img[:, :, 1]
        outImage[:, :, 2] = img[:, :, 2]
        outImage[:, :, 3] += 255
    return outImage


class ManipulateImage:
    """
    class to edit individual images
    """

    def __init__(self, image, productAsset=None, mask=None):
        """
        manipulate an image by passing the image (not the image path) and then a dictionary with one of the specified
         code words with a parameter. Parameters will be conducted in order.

        Example:
                a = ManipulateImage([0,0,1])
                params = {"crop": {"leftBorder": 1,
                                   "rightBorder": 2,
                                   "topBorder": 3,
                                   "bottomBorder": 4},
                          "resize": {"percentage": 40%}
                          "flip": "mirror"
                          "rotate": 35
                          }
                a = a.manipulate(params)

        :param image: image array
        """
        # print("made it here")
        self.image = image
        try:
            # print("made it here aa")
            self.width, self.height = self.image.size
            # print("made it here ab")
        except TypeError:
            # print("made it here ba")
            self.width, self.height = self.image.shape[:2]
            # print("made it here bb")
        # print("made it here2")
        self.channels = None
        self.commandList = ["crop", "resize", "flip", "rotate", "greyscale", "blur", "saturate", "sharpen", "invert",
                            "contrast", "mask", "add_border", "square"]
        self.productAsset = productAsset
        # print("made it here3")
        if self.productAsset is None:
            self.mask = None
        else:
            if self.productAsset.mask_url == '':
                # print("made it here4 true")
                if mask is None:
                    self.mask = None
                else:
                    self.mask = mask
            else:
                # we want to load in the mask so that any dimensional  changes we make to the images are reflected on the
                # mask
                print("made it here4 false")
                self.mask = Image.open(BytesIO(load_image(str(self.productAsset.mask_url))))
        print("made it here5")
        self.product_coordinates_in_image = None
        # print("made it here6")

    def manipulate(self, data):
        """
        Example:
            a = ManipulateImage(PIL_IMG_ARRAY)
                params = {"crop": {"leftBorder": 1,
                                    "rightBorder": 2,
                                    "topBorder": 3,
                                    "bottomBorder": 4},
                          "resize": {"percentage": 40%}
                          "flip": "mirror"
                          "rotate": 35
                          }
                a = a.manipulate(params)
        :param data: dictionary of params
        :return:
        """
        if data is None:
            print("no params given to 'manipulate' function")
            return None
        else:
            print('manipulate received', data)
            for key in data:
                print('key', key)
                if key == "crop":
                    self.image, self.mask = self.crop_image(data[key])
                elif key == "resize":
                    self.image = self.resize_image(data[key])
                elif key == "flip":
                    self.image = self.flip_image(data[key])
                elif key == "rotate":
                    self.image = self.rotate_image(data[key])
                elif key == "greyscale":
                    self.image = self.greyscale_image()
                elif key == "blur":
                    self.image = self.blur_image(data[key])
                elif key == "saturate":
                    self.image = self.saturate_image(data[key])
                elif key == "sharpen":
                    self.image = self.sharpen_image(data[key])
                elif key == "invert":
                    self.image = self.invert_image()
                elif key == "contrast":
                    self.image = self.contrast_image(data[key])
                elif key == "mask":
                    self.image, self.product_coordinates_in_image = self.mask_image()
                elif key == "add_border":
                    self.image = self.add_border_image(data[key])
                elif key == "square":
                    self.image = self.square_image(data[key])
                elif key == "place_on_canvas":
                    self.image = self.place_on_canvas(data[key])
                elif key == "replace_background":
                    self.image = self.replace_background(data[key])
                elif key == "remove_background":
                    print('removing background')
                    self.image = self.remove_background()
                elif key == "rename":
                    print("Feature 'rename' coming soon")
                elif key == "color_correct":
                    print("Feature 'color_correct' coming soon. Use the color_correction.py file til then.")
                elif key is None:
                    continue
                else:
                    print("Specified command->", str(key), "<-was not in the list of available commands. \n"
                                                           "Please use one of the following commands:\n",
                          self.commandList)

            return self.image, self.mask

    def crop_image(self, param):
        """
        Takes a dictionary to crop an image to a area
        :param param: dictionary structured as {"leftBorder": COL_NUM,
                                                "rightBorder": COL_NUM,
                                                "topBorder": ROW_NUM,
                                                "bottomBorder": ROW_NUM
                                                }
        :return: image array
        """
        left = param.get('leftBorder')
        upper = param.get('topBorder')
        right = param.get('rightBorder')
        lower = param.get('bottomBorder')
        box = (left, upper, right, lower)
        if all(i is not None for i in box):
            try:
                return self.image.crop(box), self.mask.crop(box)
            except:
                img = self.image[upper:lower, left:right]
                if self.mask is not None:
                    mask = self.mask[upper:lower, left:right]
                return Image.fromarray(img)

    def resize_image(self, param):
        """
        Can take a percentage or width/height
        :param param: dictionary either laid out as {"percentage": 40} or {"width": 100, "height": 100}
                        or {'top': 5, 'bottom': 5, 'left': 5, 'right': 5}
                      (optional) - {"image": IMG_ARRAY}
        :return: image array
        """
        if param.get('image') is not None:
            image = param.get('image')
        else:
            image = self.image
        print('manipulateImage resize', image)
        percentage = param.get('percentage')
        if percentage is not None:
            width, height = image.size
            width = int(width * (percentage / 100.0))
            height = int(height * (percentage / 100.0))
        else:
            width = param.get('width')
            height = param.get('height')
        size = (int(width), int(height))
        if all(i is not None for i in size):
            if self.mask is not None:
                self.mask.resize(size, resample=Image.LANCZOS)
            return image.resize(size, resample=Image.LANCZOS)

    def flip_image(self, param):
        """
        Flip an image vertically ("top_bottom") or horizontally("mirror")
        :param param: Flip an image vertically ("top_bottom") or horizontally("mirror")
        :return:
        """
        if param.get("mirror"):
            self.image = self.image.transpose(Image.FLIP_LEFT_RIGHT)
            if self.mask is not None:
                self.mask = self.mask.transpose(Image.FLIP_LEFT_RIGHT)
        if param.get("top_bottom"):
            self.image = self.image.transpose(Image.FLIP_TOP_BOTTOM)
            if self.mask is not None:
                self.mask = self.mask.transpose(Image.FLIP_TOP_BOTTOM)
        return self.image

    def rotate_image(self, degree):
        """
        Rotate an image a specified degree
        :param degree: amount to rotate
        :return:
        """
        if self.mask is not None:
            self.mask = self.mask.rotate(degree)
        return self.image.rotate(degree)

    def greyscale_image(self):
        """
        Change an image to greyscale
        :return: image array
        """
        return ImageOps.grayscale(self.image)

    def blur_image(self, amount=1, method="guassian"):
        """
        blur an image
        :param amount: amount you want to blur (0 = None)
        :param method: type of blur: "guassian", "box", "median", "mode"
        :return:
        """
        if method == "guassian":
            if self.mask is not None:
                self.mask = self.mask.filter(ImageFilter.GaussianBlur(radius=amount))
            return self.image.filter(ImageFilter.GaussianBlur(radius=amount))

        if method == "box":
            if self.mask is not None:
                self.mask = self.mask.filter(ImageFilter.BoxBlur(radius=amount))
            return self.image.filter(ImageFilter.BoxBlur(radius=amount))

        if method == "median":
            if self.mask is not None:
                self.mask = self.mask.filter(ImageFilter.MedianFilter(size=amount))
            return self.image.filter(ImageFilter.MedianFilter(size=amount))

        if method == "mode":
            if self.mask is not None:
                self.mask = self.mask.filter(ImageFilter.ModeFilter(size=amount))
            return self.image.filter(ImageFilter.ModeFilter(size=amount))

    def saturate_image(self, amount=1.1):
        """
        Saturate/desaturate an image (1.0 = no change)
        :param amount: amount you want to saturate
        :return: image array
        """
        enhanced = ImageEnhance.Color(self.image)
        return enhanced.enhance(amount)

    def sharpen_image(self, amount=1.1):
        """
        Adjust Sharpness
        :param amount: amount you want to sharpen
        :return: image array
        """
        enhanced = ImageEnhance.Sharpness(self.image)
        return enhanced.enhance(amount)

    def contrast_image(self, amount=1.1):
        """
        Adjust Contrast
        :param amount: amount you want to contrast
        :return: image array
        """
        enhanced = ImageEnhance.Contrast(self.image)
        return enhanced.enhance(amount)

    def invert_image(self):
        """
        invert an image
        :return: image array
        """
        return ImageChops.invert(self.image)

    def mask_image(self):
        """
        if the image has the background removed, make a mask.
        :return: img_array, and location of the product in the image
        """
        if self.mask is None:
            maskedImg = np.array(self.image)
            try:
                _, maskedImg = cv2.threshold(maskedImg[:, :, 3], 1, 255, cv2.THRESH_BINARY)
            except IndexError as e:
                print("[WARN]  -- Error with data for image\n", e)
                return None
            except TypeError as e:
                print("[WARN]  -- Error with data type for image\n", e)
                return None
            # print(str(file))
            maskedImg = detect_blob(maskedImg)
            if maskedImg is None:
                print("[WARN]  -- Error with data type for image")
                return None
        else:
            maskedImg = self.mask
        y, x = maskedImg[:, :].nonzero()  # get the nonzero alpha coordinates
        minx = np.min(x)
        miny = np.min(y)
        maxx = np.max(x)
        maxy = np.max(y)
        if (maxy - miny) == maskedImg.shape[0] and \
                (maxx - minx) == maskedImg.shape[1]:
            print("[Warn] -- Size error with image")
            return None

        # convert back to PIL due to how the rest of the app works with pillow and not OpenCV
        maskedImg = Image.fromarray(maskedImg)

        return maskedImg, [minx, miny, maxx, maxy]

    def add_border_image(self, params):
        """
        add a border based
        :param params: {"method": "add" or "layer,  # 'add' adds the border to the outside of the image causing the
                                                     image to become wider. 'layer' adds a border without affecting the
                                                     size of the image. defualt is 'add'
                        "size": int(thickness)
                        "color": [r, g, b] or 'transparent' or 'replicate_border'
        :return:
        """
        # easier to do in OpenCV
        img = np.array(self.image)
        if len(params.get('size')) == 1:
            top, bottom, left, right = [params.get('size')] * 4
        elif len(params.get('size')) == 2:
            top = params.get('size')['height']
            bottom = params.get('size')['height']
            left = params.get('size')['width']
            right = params.get('size')['width']
        if params.get('color') is None or params.get('color') == 'replicate_border':
            # default to 'replicate_border'
            img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_REPLICATE)
            if self.mask is not None:
                self.mask = img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_REPLICATE)
        if params.get('color') is not None:
            if params.get('color') == 'transparent':
                color = [0, 0, 0, 0]
            else:
                color = params.get('color')
            img = cv2.copyMakeBorder(img, int(top), int(bottom), int(left), int(right), cv2.BORDER_CONSTANT,
                                     value=color)
            if self.mask is not None:
                self.mask = img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_REPLICATE)

        # convert back to PIL
        img = Image.fromarray(img)
        if self.mask is not None:
            self.mask = Image.fromarray(self.mask)
        # adjust the size if needed
        if params.get("method") == "add" or params.get("method") is None:
            return img
        else:
            if self.mask is not None:
                self.mask = self.resize_image({"width": self.width, "height": self.height, "image": self.mask})
            return self.resize_image({"width": self.width, "height": self.height, "image": img})

    def square_image(self, params):
        """
        squares an image based on the longest side
        :return: image array
        """
        if params.get('fill_color') is not None:
            fill_color = params.get('fill_color')
            if fill_color == 'replicate_border':
                # use opencv as it already has a method to replicate the border
                img = np.array(self.image)

                height, width, channels = img.shape
                height += 2
                width += 2

                value = [int(0), int(0), int(0), int(0)]
                padded = cv2.copyMakeBorder(img, 1, 1, 1, 1, cv2.BORDER_CONSTANT, None, value)
                rows, cols, _ = padded.shape

                if height > width:
                    desiredRows = height
                    desiredCols = height

                else:
                    desiredRows = width
                    desiredCols = width

                rows2 = (desiredRows - rows) / 2
                if rows2 == 0:
                    rows2 = 1
                cols2 = (desiredCols - cols) / 2
                if cols2 == 0:
                    cols2 = 1

                # Initialize arguments for the filter
                top = int(rows2)
                bottom = int(rows2)
                left = int(cols2)
                right = int(cols2)

                # print(top, bottom, left, right)
                img = cv2.copyMakeBorder(padded, top, bottom, left, right, borderType=cv2.BORDER_REPLICATE)

                # convert back to PIL and return
                return Image.fromarray(img)
            else:
                fill_color = params.get('fill_color')
                if len(fill_color) == 3:
                    fill_color = (fill_color[0], fill_color[1], fill_color[2])
                elif len(fill_color) == 4:
                    fill_color = (fill_color[0], fill_color[1], fill_color[2], fill_color[3])
                elif len(fill_color) == 1:
                    fill_color = (fill_color[0])
            if len(fill_color) > 4:
                # bad param default to white
                fill_color = (255, 255, 255, 255)
        else:
            # let's just use white as the background
            fill_color = (255, 255, 255, 255)
        size = max(self.width, self.height)
        img = np.array(self.image)
        if self.mask is not None:
            mask_img = np.array(self.mask)
            mask_fill_color = (0, 0, 0, 0)
            try:
                mask_channels = mask_img.shape[2]
            except:
                mask_channels = 1

            if mask_channels == 4:
                new_mask = Image.new('RGBA', (size, size), mask_fill_color)
            elif mask_channels == 3:
                new_mask = Image.new('RGB', (size, size), mask_fill_color[:3])
            elif mask_channels == 2:
                new_mask = Image.new('LA', (size, size), mask_fill_color[:2])
            else:
                new_mask = Image.new('L', (size, size), mask_fill_color[:2])

            self.mask = new_mask.paste(self.mask, (int((size - self.width) / 2), int((size - self.height) / 2)))

        try:
            channels = img.shape[2]
        except:
            channels = 1

        del img

        if channels == 4:
            new_im = Image.new('RGBA', (size, size), fill_color)
        elif channels == 3:
            new_im = Image.new('RGB', (size, size), fill_color[:3])
        elif channels == 2:
            new_im = Image.new('LA', (size, size), fill_color[:2])
        else:
            new_im = Image.new('L', (size, size), fill_color[:2])

        new_im.paste(self.image, (int((size - self.width) / 2), int((size - self.height) / 2)))
        return new_im

    def place_on_canvas(self, params):
        img = np.array(self.image)
        canvas_height = params.get('height')
        canvas_width = params.get('width')
        try:
            img_channels = img.shape[2]
        except:
            img_channels = 1

        if img_channels == 3:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
        else:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)

        canvas = np.ones_like([canvas_width, canvas_height, img_channels])
        if img.max() > float(1):
            # convert the mask to scale between 0-1
            max_orig_pixel_value = img.max()
            img = cv2.normalize(img, None, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32F)

        else:
            img = img.astype(float)
            max_orig_pixel_value = img.max()
        canvas = canvas.astype(float)
        alpha_mask = np.ones_like(img[:, :])
        pos = (int(self.width / 2), int(self.width / 2))  # x, y
        img = overlay_image_alpha(canvas, img, pos, alpha_mask)
        img = cv2.normalize(img, None, alpha=0, beta=max_orig_pixel_value, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8UC4)
        img = Image.fromarray(img)
        if self.mask is not None:
            try:
                img_channels = self.mask.shape[2]
            except:
                img_channels = 1

            if img_channels == 3:
                self.mask = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
            else:
                self.mask = cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)
            if self.mask.max() > float(1):
                # convert the mask to scale between 0-1
                max_orig_pixel_value = img.max()
                self.mask = cv2.normalize(self.mask, None, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32F)
            else:
                max_orig_pixel_value = img.max()
                self.mask = self.mask.astype(float)
            alpha_mask = np.ones_like(img[:, :])
            pos = (int(self.width / 2), int(self.width / 2))  # x, y
            self.mask = overlay_image_alpha(canvas, img, pos, alpha_mask)
            self.mask = cv2.normalize(self.mask, None, alpha=0, beta=max_orig_pixel_value, norm_type=cv2.NORM_MINMAX,
                                      dtype=cv2.CV_8UC4)
            if img_channels == 3:
                self.mask = Image.fromarray(self.mask)
            elif img_channels == 1:
                self.mask = Image.fromarray(self.mask, 'L')

        return img

    def replace_background(self, params):
        """
        place an image on a new background
        :param params: (opt) 'background_color' = color of the background can pass str('transparent') else pass a RGB
              color as a list e.g. [255,255,255] default = [255, 255, 255]
            (opt) 'existing_background' = existing background color to replace can pass str('transparent') else pass a
              RGB color as a list e.g. [255,255,255] default = will sample the upper left corner of the image and use
              that color as the background
            (opt) 'mask' = mask as an array; default = None; should be a one channel mask
        :return: altered image
        """

        # read in the image as an array that opencv can work with
        img = np.array(self.image)

        img_height, img_width = img.shape[:2]

        try:
            img_channels = img.shape[2]
        except:
            img_channels = 1

        transparent_flag = False
        if params.get('background_color') is None:
            _, background_color = get_background_type(img)
            background_color = [int(background_color[0]), int(background_color[1]), int(background_color[2])]

        elif params.get('background_color') == 'transparent':
            background_color = [255, 255, 255, 0]
            transparent_flag = True

        else:
            background_color = params.get('background_color')

        # grab info for the 'existing_background' param
        existing_transparent_flag = False
        if self.mask is None:
            if params.get('existing_background') is None:
                _, existing_background_color = get_background_type(img)
            elif params.get('existing_background') == 'transparent':
                existing_transparent_flag = True
            else:
                existing_background_color = params.get('existing_background')
        else:
            params['existing_background'] = 'transparent'
            existing_transparent_flag = True

        print("background_color set as:", background_color,
              "\nexisting_background_color set as:", existing_background_color)

        if img_channels < 4 and transparent_flag:
            # we need to add an alpha channel
            if img_channels < 3:
                # we need to prop this guy on up to a 3 channel image
                img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
            img = cv2.cvtColor(img, cv2.BGR2BGRA)

        # create and color the background
        background = np.ones_like(img)
        for i in range(img_channels):
            background[:, :, i] *= background_color[i]

        # convert to float for more accurate calcs
        background = background.astype(float)

        if self.mask is None:
            if params.get('mask') is None:
                mask = None
            else:
                mask = params.get('mask')
        else:
            mask = self.mask

        # if we know the previous background and don't have a mask, we can go ahead and try to replace the background
        # !!!!!!!!!!! WARNING NOT AS ACCURATE AS HAVING A MASK !!!!!!!!!!!!!!!
        if params.get('existing_background') is None and mask is None:
            if existing_transparent_flag:
                # go to the fourth channel to get our maskfsda
                if self.mask is None:
                    mask = img[:, :, 3]
                else:
                    try:
                        mask_channels = mask.shape[2]
                    except:
                        mask_channels = 1
                    if mask_channels > 1:
                        mask = np.array(self.mask)
                        mask = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
                    else:
                        mask = np.array(self.mask)

            else:
                existing_background_color = np.uint8([[existing_background_color]])
                existing_background_color = cv2.cvtColor(existing_background_color, cv2.COLOR_BGR2HSV)
                # create strict tolerances for upper and lower bounds that we can exploit later ;)
                upper_v = existing_background_color[0][0][2] + 5
                if upper_v > 255:
                    upper_v = 255
                lower_v = existing_background_color[0][0][2] - 5
                if lower_v < 0:
                    lower_v = 0

                upper = np.array([existing_background_color[0][0][0], existing_background_color[0][0][1], upper_v])
                lower = np.array([existing_background_color[0][0][0], existing_background_color[0][0][1], lower_v])

                # convert to hsv because ... COLOR ... read a book you dumb dumb, you shouldn't be asking questions ;)
                hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

                # grab the pixels that meet this tolerance
                mask = cv2.inRange(hsv, lower, upper)

                thresh = mask > 0
                mask = np.zeros_like(background, np.uint8)

                # output is a one channel mask
                mask[thresh] = 255
                _, mask = cv2.threshold(mask, 1, 255, cv2.THRESH_BINARY)
                mask = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
                mask = detect_blob(mask)
                mask = cv2.bitwise_not(mask)

        if params.get('mask') or mask is not None:
            if params.get('mask'):
                mask = np.array(params.get('mask'))

            img = img.astype(float)

            # check to see if the mask size matches the image size
            mask_height, mask_width = mask.shape[:2]
            try:
                mask_channels = mask.shape[2]
            except:
                mask_channels = 1
            if mask.max() > float(1):
                # convert the mask to scale between 0-1
                mask = cv2.normalize(mask, None, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_64F)
            else:
                mask = mask.astype(float)

            if mask_height > img_height or mask_width > img_width:
                print("input mask size does not match input image size\n Mask Size:", mask_height, mask_width,
                      "\n Image Size:", img_height, img_width)
                return self.image

            if int(mask_channels) == int(1):
                if int(img_channels) > 1:
                    for i in range(img_channels):
                        img[:, :, i] = cv2.multiply(mask, img[:, :, i])
                        background[:, :, i] = cv2.multiply(1.0 - mask, background[:, :, i])

                else:
                    img = cv2.multiply(mask, img)
                    background = cv2.multiply(1.0 - mask, background)
            elif int(mask_channels) == int(3):
                # print("made it here")
                if int(img_channels) == int(mask_channels):
                    img = cv2.multiply(mask, img)
                    background = cv2.multiply(1.0 - mask, background)
                elif int(img_channels) == 4:
                    img[:, :, :3] = cv2.multiply(mask, img[:, :, :3])
                    background[:, :, :3] = cv2.multiply(1.0 - mask, background[:, :, :3])
                else:
                    # the mask is larger channelwise than the image so we'll convert it to greyscale and multiply it through
                    mask = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
                    if img_channels == 1:
                        img = cv2.multiply(mask, img)
                        background = cv2.multiply(1.0 - mask, background)
                    else:
                        for i in range(img_channels):
                            img[:, :, i] = cv2.multiply(mask, img[:, :, i])
                            background[:, :, i] = cv2.multiply(1.0 - mask, background[:, :, i])
            else:
                # this mask has 4 channels
                if int(img_channels) == int(mask_channels):
                    img = cv2.multiply(mask, img)
                    background = cv2.multiply(1.0 - mask, background)
                elif int(img_channels) == 3:
                    for i in range(img_channels):
                        img[:, :, i] = cv2.multiply(mask[:, :, i], img[:, :, i])
                        background[:, :, i] = cv2.multiply(1.0 - mask[:, :, i], background[:, :, i])
                else:
                    mask = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
                    if img_channels == 1:
                        img = cv2.multiply(mask, img)
                        background = cv2.multiply(1.0 - mask, background)
                    else:
                        for i in range(img_channels):
                            img[:, :, i] = cv2.multiply(mask, img[:, :, i])
                            background[:, :, i] = cv2.multiply(1.0 - mask, background[:, :, i])
        else:
            # we didn't make any adjustments
            print("did not adjust:", self.image)
            return self.image
        # return the result
        img = cv2.add(img, background)
        img = img.astype('uint8')
        img = Image.fromarray(img)

        return img

    def color_correct(self):
        # color_corrector = params.get(['color_correction_class'])
        # color_corrector.apply
        pass

    def remove_background(self):
        # TODO add in mask asset creation logic, currently the mask is not being tracked by the database within this function
        from app.products.models import Product, ProductAsset
        from app.accounts.models import Company
        from app.core.utility import boto3Upload3
        # print('inside remove_background')
        if self.productAsset is None:
            print("pass a valid ProductAsset Object to the 'remove_background' function so  that the mask can be"
                  " associated with the image in the future")
            return None
        # print('retrieving product slug')
        product_slug = Product.objects.get(id=self.productAsset.product.id).slug
        # print('retrieving company slug')
        company_slug = Company.objects.get(id=self.productAsset.company.id).slug
        if USE_LOCAL_STORAGE:
            zip_outputdir = join(join(BASE_DIR, 'app/imageEditingFunctions/zip_temp'), self.productAsset.slug)
        else:
            key = (company_slug + '/temp/maskfiles/' + self.productAsset.slug)
            zip_outputdir = "https://" + AWS_STORAGE_BUCKET_NAME + ".s3.amazonaws.com/" + key
        ifnot_create_dir(zip_outputdir)
        print('beginning removebg')
        try:
            rmbg = RemoveBg(BG_REMOVE_KEY, "error.log", use_zip=True, zip_output_directory=zip_outputdir, return_path=True,
                            return_byteArray=False)

            print('rmbg set up')
            res = rmbg.remove_background_from_img_url(str(self.productAsset.url))

            print('background removed image received')
            print('result', res)
            paths = res[0]
            color_path, alpha_path = paths
            # all product asset masks are stored inside the product folder under masks with the asset type and company slug
            # in place to help with collisions
            key = (company_slug + '/products/' + product_slug + '/masks/2D/' + company_slug)
            overwriteFlag = False
            if USE_LOCAL_STORAGE:
                location = normcase(join(LOCAL_STORAGE_LOCATION, key))
            else:
                location = "https://" + AWS_STORAGE_BUCKET_NAME + ".s3.amazonaws.com/" + key
            mask_url_location = location + '/' + splitext(split(self.productAsset.url)[1])[0] + '.png'
            ifnot_create_dir(str(location))
            print('beginning mask copy')
            file_copy(alpha_path, mask_url_location, delete_original=True)
            print('finished mask copy')
            if self.productAsset.mask_url is None or self.productAsset.mask_url == 'null' or\
                    self.productAsset.mask_url == '':
                # create mask asset
                print('new mask')
                maskAsset = ProductAsset()
                maskAsset.file_name = self.productAsset.file_name
                maskAsset.lastmodified = timezone.now()
                maskAsset.asset_height = int(self.height)
                maskAsset.asset_width = int(self.width)
                maskAsset.asset_channels = 1
                maskAsset.asset_background_type = 3
                maskAsset.assetType = 1
                maskAsset.product_id = self.productAsset.product.id
                maskAsset.company_id = self.productAsset.company.id
                maskAsset.original = False
                maskAsset.is_mask = True
                maskAsset.is_thumbnail = False
                maskAsset.url = mask_url_location
                maskAsset.save()
                print('new mask successfully saved')
                # newMaskFlag = True
            else:
                print('existing mask')
                maskAsset = ProductAsset.objects.get(url=self.productAsset.mask_url)
                maskAsset.url = mask_url_location
                maskAsset.is_mask = True
                maskAsset.save()
                print('existing mask successfully saved')

            self.productAsset.mask_url = mask_url_location
            self.productAsset.verified_background_removed = True
            self.productAsset.save()
            print('productAsset successfully saved')
            # now that the image is saved in the correct location with the respective productAsset fields generated, let's
            # continue with our manipulateImage function by claiming the new mask and returning the image with the
            # background removed

            print('loading color img')
            color_img = load_image(str(color_path))
            color_img = Image.open(BytesIO(color_img))
            print('loading mask img')
            alpha_img = load_image(str(mask_url_location))
            alpha_img = Image.open(BytesIO(alpha_img))
            print('loaded images')

            self.mask = alpha_img

            # split, add and merge
            print('color_img', color_img.size)
            print('alpha_img', color_img.size)
            color_img = np.array(color_img)
            alpha_img = np.array(alpha_img)
            print(1)
            print(alpha_img.shape)
            b, g, r = cv2.split(color_img)
            aa = cv2.split(alpha_img)
            print(2)
            print('b', b)
            print('g', g)
            print('r', r)
            print('aa', aa[0])
            rgba = [b, g, r, aa[0]]
            print(3)
            rgba = cv2.merge(rgba)
            print(4)
            Image.fromarray(rgba, 'RGBA')
            print('finished background removal without fault')
        except Exception as e:
            print('errored out on', e)
        return rgba


class ManipulateImages:
    """
    class containing functions to edit several images from a list
    """

    def __init__(self, imageList):
        """
        manipulate an image by passing the image array list (not the image paths) and then a dictionary with one of the
         specified code words with a parameter

        Example:
                a = ManipulateImages([0,0,1])
                params = {"centerCrop"
                          "resize": {"percentage": 40%}
                          "flip": "mirror"
                          "rotate": 35
                          }
                a = a.manipulate(params)

        :param image: image array
        """
        self.images = imageList
        self.refImage = self.images[0]
        self.refheight, self.refwidth = self.refImage.shape[:2]

    def manipulate(self, data):
        """
        Example:
            a = ManipulateImage(IMG_ARRAY)
                params = {"crop": {"leftBorder": 1,
                                    "rightBorder": 2,
                                    "topBorder": 3,
                                    "bottomBorder": 4},
                          "resize": {"percentage": 40%}
                          "flip": "mirror"
                          "rotate": 35
                          }
                a = a.manipulate(params)
        :param data: dictionary of params
        :return:
        """
        if data is None:
            print("no params given to 'manipulate' function")
            return None
        else:
            for key in data:
                if key == "spin_auto_center_crop":
                    self.images = self.auto_center_crop_360(data[key])
        return self.images

    def auto_center_crop_360(self, params):
        """
        take a list of image arrays and automatically center and crop them to the center of the canvas
        :param params: dictionary structured as {"returnMask": False,
                                                 "background_color": 'replicate_border',
                                                 "size": 2000,  # can be list [width, height]
                                                 "square": True,
                                                 "product%": .9  # scale 0-1 (default=.9) amount product takes up of
                                                  the final frame
                                                 }
        :return:
        """
        # do we want to return the masks?
        if params.get('returnMask') is not None or params.get('returnMask') is not False:
            returnMaskBool = True
            maskList = []
        else:
            # default to not returning the masks
            returnMaskBool = False

        # establish background color
        if params.get('background_color') is not None:
            background_color = params.get('background_color')  # can pass '
        else:
            # default to replicating the border
            background_color = 'replicate_border'

        # do we want to square the image?
        if params.get('square') is not None or params.get('square') is not False:
            squareBool = True
        else:
            squareBool = False

        # what size of the final frame do we want the product to take up
        if params.get('product') is not None:
            productPercent = params.get('product')
        else:
            # default to .9 if nothing is given
            productPercent = 0.9

        if float(productPercent) > float(1):
            productPercent = 1.0

        # what size do we want?
        if params.get('size') is not None:
            size = params.get('size')
            if size == 'original':
                if squareBool:
                    newWidth = max(self.refwidth, self.refheight)
                    newHeight = max(self.refwidth, self.refheight)
                else:
                    newWidth = self.refwidth
                    newHeight = self.refheight
            elif len(size) > 1:
                if squareBool:
                    newWidth = max(size[0], size[1])
                    newHeight = max(size[0], size[1])
                else:
                    newWidth = size[0]
                    newHeight = size[1]
            else:
                # only one size parameter was passed so we'll grab it
                newWidth = size[0]
                newHeight = size[0]
        else:
            # default to 'original'
            if squareBool:
                newWidth = max(self.refwidth, self.refheight)
                newHeight = max(self.refwidth, self.refheight)
            else:
                newWidth = self.refwidth
                newHeight = self.refheight

        groupAlpha = np.zeros((self.refheight, self.refwidth), dtype="uint8")

        for image in self.images:
            maskedImg = np.array(image)
            try:
                _, maskedImg = cv2.threshold(maskedImg[:, :, 3], 1, 255, cv2.THRESH_BINARY)
            except IndexError as e:
                print("[WARN]  -- Error with data for image\n", e)
                return None
            except TypeError as e:
                print("[WARN]  -- Error with data type for image\n", e)
                return None
            # print(str(file))
            maskedImg = detect_blob(maskedImg)
            if maskedImg is None:
                print("[WARN]  -- Error with data type for image")
                return None
            y, x = maskedImg[:, :].nonzero()  # get the nonzero alpha coordinates
            minx = np.min(x)
            miny = np.min(y)
            maxx = np.max(x)
            maxy = np.max(y)
            if (maxy - miny) == maskedImg.shape[0] and \
                    (maxx - minx) == maskedImg.shape[1]:
                print("[Warn] -- Size error with image")
                return None

            # convert back to PIL due to how the rest of the app works with pillow and not OpenCV
            maskedImg = Image.fromarray(maskedImg)
            if returnMaskBool:
                maskList.append(maskedImg)
            try:
                groupAlpha = cv2.add(groupAlpha, maskedImg)
            except:
                print("[WARN] sizes of images in the list are different")
                return None

        # find the center of rotation
        cropGroupAlpha, minx, miny, maxx, maxy = crop_group_alpha(groupAlpha)

        count = 0
        if squareBool:
            local_params = {"crop": {"leftBorder": minx,
                                     "rightBorder": maxx,
                                     "topBorder": miny,
                                     "bottomBorder": maxy},
                            "square": background_color,
                            "resize": {"width": int(newWidth * productPercent),
                                       "height": int(newHeight * productPercent)},
                            "add_border": {"method": "add",
                                           "size": {"height": int(newHeight * (1 - productPercent)),
                                                    "width": int(newHeight * (1 - productPercent))},
                                           "color": background_color,
                                           }
                            }
        else:
            local_params = {"crop": {"leftBorder": minx,
                                     "rightBorder": maxx,
                                     "topBorder": miny,
                                     "bottomBorder": maxy},
                            "resize": {"width": int(newWidth * productPercent),
                                       "height": int(newHeight * productPercent)},
                            "add_border": {"method": "add",
                                           "size": {"height": int(newHeight * (1 - productPercent)),
                                                    "width": int(newHeight * (1 - productPercent))},
                                           "color": background_color,
                                           }
                            }
        for image in self.images:
            a = ManipulateImage(image)
            self.images[count] = a.manipulate(local_params)
            count += 1

        if returnMaskBool:
            return self.images, maskList
        else:
            return self.images
