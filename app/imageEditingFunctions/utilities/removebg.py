import requests
import logging
import zipfile
from os.path import join
from io import BytesIO
import io
from PIL import Image

from app.core.utility import boto3Upload3
from app.imageEditingFunctions.file_name_functions import ifnot_create_dir
from xapi.settings import USE_LOCAL_STORAGE, AWS_S3_CUSTOM_DOMAIN, CLOUDFRONT_DOMAIN

API_ENDPOINT = "https://api.remove.bg/v1.0/removebg"


class RemoveBg:

    def __init__(self, api_key, error_log_file, use_zip=True, zip_output_directory=None, return_path=False,
                 return_byteArray=False, return_composite=False):
        self.__api_key = api_key
        self.use_zip = use_zip
        self.zip_output_directory = zip_output_directory
        self.return_path = return_path
        self.return_byteArray = return_byteArray
        self.return_composite = return_composite
        # logging.basicConfig(filename=error_log_file)

    def remove_background_from_img_file(self, img_file_path, size="auto"):
        """
        Removes the background given an image file and outputs the file as the original file name with "no_bg.png"
        appended to it.
        :param img_file_path: the path to the image file
        :param size: the size of the output image (regular = 0.25 MP, hd = 4 MP, 4k = up to 10 MP)
        """
        # Open image file to send information post request and send the post request
        img_file = open(img_file_path, 'rb')
        if self.use_zip:
            response = requests.post(
                API_ENDPOINT,
                files={'image_file': img_file},
                data={'size': size},
                format={'zip'},
                headers={'X-Api-Key': self.__api_key})
        else:
            response = requests.post(
                API_ENDPOINT,
                files={'image_file': img_file},
                data={'size': size},
                headers={'X-Api-Key': self.__api_key})

        return self.__output_file__(response, img_file.name + "_no_bg.png")

        # if not self.use_zip:
        #     # Close original file
        #     img_file.close()

    def remove_background_from_img_url(self, img_url, size="auto", new_file_name="no-bg.png"):
        """
        Removes the background given an image URL and outputs the file as the given new file name.
        :param img_url: the URL to the image
        :param size: the size of the output image (regular = 0.25 MP, hd = 4 MP, 4k = up to 10 MP)
        :param new_file_name: the new file name of the image with the background removed
        """
        if self.use_zip:
            response = requests.post(
                API_ENDPOINT,
                data={
                    'image_url': img_url,
                    'size': size,
                    'format': 'zip'
                },
                headers={'X-Api-Key': self.__api_key}
            )
        else:
            response = requests.post(
                API_ENDPOINT,
                data={
                    'image_url': img_url,
                    'size': size
                },
                headers={'X-Api-Key': self.__api_key}
            )
        return (self.__output_file__(response, new_file_name))

    def remove_background_from_base64_img(self, base64_img, size="auto", new_file_name="no-bg.png"):
        """
        Removes the background given a base64 image string and outputs the file as the given new file name.
        :param base64_img: the base64 image string
        :param size: the size of the output image (regular = 0.25 MP, hd = 4 MP, 4k = up to 10 MP)
        :param new_file_name: the new file name of the image with the background removed
        """
        # img_file = base64_img
        print('rmbg received image base64')
        if self.use_zip:
            print('sending request')
            response = requests.post(
                API_ENDPOINT,
                data={
                    'image_file_b64': base64_img,
                    'size': size,
                    'format': 'zip'
                },
                headers={'X-Api-Key': self.__api_key}
            )
        else:
            response = requests.post(
                API_ENDPOINT,
                data={
                    'image_file_b64': base64_img,
                    'size': size
                },
                headers={'X-Api-Key': self.__api_key}
            )
        print('rmbg response', response)
        return (self.__output_file__(response, new_file_name))

    def __output_file__(self, response, new_file_name):
        # If successful, write out the file
        print('rmbg output received', response)
        if response.status_code == requests.codes.ok:
            print(1)
            if USE_LOCAL_STORAGE:
                if self.use_zip:
                    if self.zip_output_directory is None:
                        error_reason = 'missing zip_output_directory'
                        logging.error("Unable to save %s due to %s", new_file_name, error_reason)
                    with open(self.zip_output_directory + 'temp01.zip', 'wb') as removed_bg_file:
                        removed_bg_file.write(response.content)
                    with zipfile.ZipFile(self.zip_output_directory + 'temp01.zip', 'r') as zip_ref:
                        zip_ref.extractall(self.zip_output_directory)

                else:
                    with open(new_file_name, 'wb') as removed_bg_file:
                        removed_bg_file.write(response.content)
            else:
                if self.use_zip:
                    adjustment = 1
                    company_slug = str(self.zip_output_directory).split('/')[3]
                    print('company_slug', company_slug)
                    while True:
                        # iterate through possible file names
                        print('self.zip_output_directory', self.zip_output_directory)
                        output_location = self.zip_output_directory + str(adjustment)
                        exists = ifnot_create_dir(output_location)
                        if exists:
                            # if the folder existed prior to us trying to do anything, then it is likely that it is already filled
                            # with stuff, so let's make a new one
                            if adjustment == '':
                                adjustment = 1
                            else:
                                adjustment += 1
                        else:
                            # adjust the entry within the product asset to account for the new path
                            break

                    with zipfile.ZipFile(BytesIO(response.content)) as thezip:
                        # print('thezip', thezip)
                        # print('thezip.infolist()', thezip.infolist())
                        output_file_locations = []
                        output_file_bytes = []
                        for zipinfo in thezip.infolist():
                            # print('zipinfo', zipinfo)
                            with thezip.open(zipinfo) as thefile:
                                # get individual image
                                print('zipinfo.filename, thefile', zipinfo.filename, thefile)
                                bytesArray = thefile.read()
                                output_file_bytes.append(io.BytesIO(bytesArray))
                                img = Image.open(io.BytesIO(bytesArray))
                                print(1)
                                IMG_FORMAT = img.format
                                print(2)
                                in_mem_file = io.BytesIO()
                                print(3)
                                if img.format is None:
                                    print('io setup and prepping PIL save with format as:', IMG_FORMAT)
                                    img.save(in_mem_file, format=IMG_FORMAT)
                                else:
                                    print('io setup and prepping PIL save with format as:', img.format)
                                    img.save(in_mem_file, format=img.format)
                                print(4, output_location)
                                if str(output_location).startswith('https://' + AWS_S3_CUSTOM_DOMAIN):
                                    key = str(output_location).replace('https://' + AWS_S3_CUSTOM_DOMAIN + '/', '')
                                elif str(output_location).startswith('https://' + CLOUDFRONT_DOMAIN):
                                    key = str(output_location).replace('https://' + CLOUDFRONT_DOMAIN + '/', '')
                                else:
                                    # just create it
                                    key = str(company_slug)+'/temp/maskfiles/'+str(adjustment)
                                print(5)
                                try:
                                    in_mem_file.seek(0)
                                except Exception as e:
                                    print('error',  e)
                                print('5a', company_slug, key)
                                location = boto3Upload3(in_mem_file, company_slug, key, is_bytes=True,
                                                        fileName=str(zipinfo.filename))
                                print(6)
                                output_file_locations.append(location)

            out = []
            if self.return_path:
                if USE_LOCAL_STORAGE:
                    if self.use_zip:
                        out.append([join(self.zip_output_directory, 'color.jpg'), join(self.zip_output_directory,
                                                                                       'alpha.png')])
                    else:
                        out.append(new_file_name)
                else:
                    if self.use_zip:
                        out.append([output_file_locations[0], output_file_locations[1]])
                    else:
                        out.append(new_file_name)
            if self.return_byteArray:
                if USE_LOCAL_STORAGE:
                    if self.use_zip:
                        with open(str(join(self.zip_output_directory, 'color.jpg')), 'rb') as f:
                            color_img = BytesIO(f.read())
                        with open(str(join(self.zip_output_directory, 'alpha.png')), 'rb') as f:
                            alpha_img = BytesIO(f.read())
                        out.append([color_img, alpha_img])
                    else:
                        with open(str(new_file_name, 'rb')) as f:
                            img = BytesIO(f.read())
                        out.append(img)
                else:
                    out.append([output_file_bytes[0], output_file_bytes[1]])

            if self.return_composite:
                if self.use_zip:
                    print("not implemented yet")
                    # with open(str(join(self.zip_output_directory, 'color.jpg')), 'rb') as f:
                    #     color_img = BytesIO(f.read())
                    # with open(str(join(self.zip_output_directory, 'alpha.png')), 'rb') as f:
                    #     alpha_img = BytesIO(f.read())
                    # img = Image.open(file_bytes)
                    # img = np.array(img)
                else:
                    with open(str(new_file_name, 'rb')) as f:
                        img = BytesIO(f.read())
                    out.append(img)
            return out
        # Otherwise, print out the error
        else:
            print('[ERROR]', response.json()["errors"][0]["title"].lower())
            error_reason = response.json()["errors"][0]["title"].lower()
            logging.error("Unable to save %s due to %s", new_file_name, error_reason)
