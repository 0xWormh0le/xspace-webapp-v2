# -*- coding: utf-8 -*-

# in priority

# -*- coding: utf-8 -*-

import logging
import os
import sys
import time
from os import listdir, rename, walk, makedirs
from os.path import join, isdir, isfile, split, splitext, normcase
from pathlib import Path
from queue import Queue
from shutil import copy
from threading import Thread
from app.imageEditingFunctions.file_name_functions import findFiles, \
    copyTree, multiple_file_copy, file_copy  # deleteAll
import re
from app.products.utility import get_file_type

import cv2
from jinja2 import Environment, FileSystemLoader
from natsort import natsorted
from .manipulateImage import placeOnWhite
from .file_name_functions import ifnot_create_dir, generate_slug
from xapi.settings import TEST_LOCAL, LOCAL_STORAGE_LOCATION, USE_LOCAL_STORAGE, AWS_STORAGE_BUCKET_NAME, \
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, CLOUDFRONT_DOMAIN, AWS_S3_CUSTOM_DOMAIN
from django.utils import timezone

# ############################################################
# the following variables need to be claimed
THIS_DIR = os.path.dirname(os.path.abspath(__file__))

# Initiate HTML Jinja2 EnV
j2_env = Environment(loader=FileSystemLoader(THIS_DIR), trim_blocks=True)

root = os.path.dirname(os.path.abspath(__file__))

# Config for 360 Bundles
licenseFile = "license.lic"
configFilePath = "coolXML.xml"
imgRotatorFolder = str("/templates/imagerotator")

# Template Variables
templatePath = '/'.join(str(join(os.path.dirname(os.path.abspath(__file__)),
                                 str("templates/imagerotator"))).split('\\'))


# ############################################################


class ConfigurationObject360():
    """
    class to create a spin
    """

    def __init__(self, productFolderName, rootPaths, templateDir, licenseFilePath, configFilePath, productAsset,
                 layers, arbitraryList):
        self.productFolderName = productFolderName
        self.rootPaths = rootPaths
        self.configFilePath = configFilePath
        self.templateDir = templateDir
        self.imageRotatePathFolder = 'imagerotator'
        self.licenseFilePath = licenseFilePath
        self.threeSixtyFolder = ''
        self.threeSixtyAssetsFolder = ''
        self.threeSixtyProductNameFolder = ''
        self.threeSixtyImgRotateFolder = ''
        self.threeSixtyRootImagesFolder = ''
        self.threeSixtyRootHighResImagesFolder = ''
        self.layers = layers
        self.productAsset = productAsset
        self.arbitraryList = arbitraryList

    def generate360HTMLFile(self):
        """
        generates the html file for the spin
        :return:
        """
        if USE_LOCAL_STORAGE:
            threeSixtyViewTemplate = j2_env.get_template(str(join(join(os.path.dirname(os.path.abspath(__file__)),
                                                                       "templates"),
                                                                  "360CompileTemplate.html")).replace('\\', '/'))
        else:
            rel_path = "templates" + '/' + "360CompileTemplate.html"
            threeSixtyViewTemplate = j2_env.get_template(rel_path)
        newFile = j2_env.get_template(threeSixtyViewTemplate).render(title=self.productFolderName,
                                                                     imageRotatorPath=self.imageRotatePathFolder,
                                                                     licenseFilePath=self.licenseFilePath,
                                                                     configFilePath=self.configFilePath)
        if USE_LOCAL_STORAGE:
            new360FileName = self.productFolderName + ".html"
            self.productAsset.html = new360FileName
        else:
            print(root, self.productFolderName + ".html")
            print('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            print(self.productFolderName, self.rootPaths ,self.configFilePath, self.templateDir,
                  self.imageRotatePathFolder, self.licenseFilePath, self.threeSixtyFolder, self.threeSixtyAssetsFolder,
                  self.threeSixtyProductNameFolder, self.threeSixtyImgRotateFolder, self.threeSixtyRootImagesFolder,
                  self.threeSixtyRootHighResImagesFolder, self.layers, self.productAsset, self.arbitraryList)
            new360FileName = str(join(root, self.productFolderName + ".html")).replace('\\', '/')
            serverside_new360FileName = self.threeSixtyFolder + '/' + self.productFolderName + ".html"
            print('new360FileName', new360FileName)
            self.productAsset.html = serverside_new360FileName

        # print("NEW 360 FILE NAME: ", new360FileName)
        with open(new360FileName, "w+") as fh:
            fh.write(newFile)

        if USE_LOCAL_STORAGE:
            file_copy(new360FileName, self.threeSixtyFolder)
        else:
            file_copy(new360FileName, self.threeSixtyFolder, local_to_server=True)
        if USE_LOCAL_STORAGE:
            try:
                os.remove(join(root, new360FileName))
            except:
                os.unlink(join(root, new360FileName))
        else:
            try:
                os.remove(new360FileName)
            except:
                os.unlink(new360FileName)

    def generate360XML(self, targetFolder, destinationFolder):
        """
        generates the 360 spin's xml files and builds the structure by copying files over from the template and
        img source
        :param targetFolder:
        :param destinationFolder:
        :return:
        """
        print('made it here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        # print("Generating XML File...")
        newPath = destinationFolder.replace(os.sep, '/')

        # Create 360 Directories
        self.threeSixtyFolder = '/'.join(str(join(str(newPath), "360")).split('\\'))
        self.threeSixtyAssetsFolder = '/'.join(str(join(str(self.threeSixtyFolder), "360_assets")).split('\\'))
        self.threeSixtyImgRotateFolder = '/'.join(str(join(str(self.threeSixtyFolder), "imagerotator")).split('\\'))
        self.threeSixtyProductNameFolder = '/'.join(str(join(str(self.threeSixtyAssetsFolder),
                                                             str(self.productFolderName))).split('\\'))
        self.threeSixtyRootImagesFolder = '/'.join(str(join(str(self.threeSixtyProductNameFolder), "images")).split('\\'))
        self.threeSixtyRootHighResImagesFolder = '/'.join(str(join(str(self.threeSixtyRootImagesFolder),
                                                                   "highres")).split('\\'))

        directoryList = [str(self.threeSixtyFolder), str(self.threeSixtyAssetsFolder),
                         str(self.threeSixtyProductNameFolder), str(self.threeSixtyImgRotateFolder),
                         str(self.threeSixtyRootImagesFolder), str(self.threeSixtyRootHighResImagesFolder)]

        # If Folders don't exist, create, else do nothing.
        for d in directoryList:
            ifnot_create_dir(d)
        print('made it here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!2')
        # Copy Master HTML and CSS Files for ImageRotator
        # print("Copying over folder: "+targetFolder+" -> " + destinationFolder)
        try:
            templateDir = str(join(str(os.path.dirname(os.path.abspath(__file__))),
                                   self.templateDir)).replace('\\', '/')
            print("templateDir:", templateDir)
            copyTree(templateDir, self.threeSixtyImgRotateFolder, local_to_server=True)
            self.productAsset.imagerotator = str(join(join(join(self.threeSixtyImgRotateFolder, 'html'),
                                                           'js'),
                                                      'imagerotator.js')).replace('\\', '/')
            self.productAsset.jquery = str(join(join(join(self.threeSixtyImgRotateFolder, 'html'),
                                                     'js'),
                                                'jquery-1.12.4.min.js')).replace('\\', '/')
            self.productAsset.css = str(join(join(join(self.threeSixtyImgRotateFolder, 'html'),
                                                  'css'),
                                             'basic.css')).replace('\\', '/')
            self.productAsset.save()
        except FileExistsError:
            print('errrrrrrrors')
            pass
        # print('made it here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!3')
        # print(str(Path(str(join(join(os.path.dirname(os.path.abspath(__file__)),
        #                        "templates"),
        #                   "360XMLTemplate.xml")).replace('\\', '/'))))
        # print('\n\n\n\n\n')
        # print(str(Path(str(join(join(os.path.dirname(os.path.abspath(__file__)),
        #                              "templates"),
        #                         "360XMLTemplate.xml")).replace('\\', '/'))))
        if USE_LOCAL_STORAGE:
            threeSixtyViewTemplate = j2_env.get_template(str(Path(str(join(join(os.path.dirname(os.path.abspath(__file__)),
                                                                                "templates"),
                                                                           "360XMLTemplate.xml")).replace('\\', '/'))))
            licenseFileTemplate = str(join(join(os.path.dirname(os.path.abspath(__file__)),
                                                "templates"),
                                           "license.lic")).replace('\\', '/')
        else:
            rel_path = "templates"+'/'+"360XMLTemplate.xml"
            threeSixtyViewTemplate = j2_env.get_template(rel_path)
            licenseFileTemplate = "templates"+'/'+"license.lic"

        if not self.arbitraryList:
            if self.layers > 1:
                total, spinFolders = findFiles(targetFolder, folder=True, subd=False)
                # check that each folder has the same number of images, and purify the list of images
                tipf = 0
                img_path_list = []
                for f in spinFolders:
                    _, images = findFiles(f)
                    count = 0
                    for i in images:
                        if get_file_type(i) != 1:
                            del images[count:count + 1]
                        count += 1
                    if tipf == 0:
                        tipf = len(images)
                        img_path_list.append(images)
                    else:
                        if int(tipf) != len(images):
                            print("Not the same number of images in each of the spin layer directories:", tipf, len(images))
                            return None
            else:
                _, img_path_list = findFiles(targetFolder, subd=False)
                count = 0
                for i in img_path_list:
                    if get_file_type(i) != 1:
                        del img_path_list[count:count + 1]
                    count += 1
                img_path_list = [img_path_list]

            if len(img_path_list) is None or len(img_path_list) == 0:
                print("Noimages found in:", targetFolder)
                return None
        else:
            print('using arbitrary list')
            img_path_list = self.rootPaths

        print('img_path_list', img_path_list)

        # let's get the relative paths
        relative_img_path_list = []
        images = []
        # print('targetFolder', targetFolder)

        if isinstance(targetFolder, list):
            targetFolder = targetFolder[0]

        if not USE_LOCAL_STORAGE:
            if not targetFolder.startswith("https://" + AWS_S3_CUSTOM_DOMAIN):
                if targetFolder.endswith('/'):
                    targetFolder = "https://" + AWS_S3_CUSTOM_DOMAIN + '/' + targetFolder
                else:
                    targetFolder = "https://" + AWS_S3_CUSTOM_DOMAIN + '/' + targetFolder + '/'
        for i in img_path_list:
            if isinstance(i, list):
                for j in i:
                    images.append(str(j).replace(targetFolder, ''))
            else:
                images.append(str(i).replace(targetFolder, ''))

        relative_img_path_list.append(images)
        print('relative_img_path_list1', relative_img_path_list)

        count = 0
        for spin_layer in relative_img_path_list:
            if isinstance(spin_layer, list):
                relative_img_path_list[count] = natsorted(spin_layer)
                count += 1
            else:
                relative_img_path_list = natsorted(spin_layer)
        print('relative_img_path_list2', relative_img_path_list)

        lsorted = []
        hsorted = []

        # let's grab the individual image names themselves, but in order
        # hsorted stands for "high resolution sorted images"
        # lsorted stands for "low resolution sorted images"
        if USE_LOCAL_STORAGE:
            for spin_layer in relative_img_path_list:
                if isinstance(spin_layer, list):
                    for h in spin_layer:
                        hsorted.append(str(os.path.split(h)[1]))
                else:
                    hsorted.append(str(os.path.split(spin_layer)[1]))
        else:
            for spin_layer in relative_img_path_list:
                if isinstance(spin_layer, list):
                    for h in spin_layer:
                        hsorted.append(split(h)[1])
                else:
                    hsorted.append(split(spin_layer)[1])
        print('hsorted', hsorted, '\n\n')
        # print('relative_img_path_list3', relative_img_path_list)
        # Copy target images from source to images folders within the 360
        files = []
        rel_img_path_list = []
        if not USE_LOCAL_STORAGE:
            count = 0
            for img in img_path_list:
                if isinstance(img, list):
                    rel_img_path_list.append([])
                    for i in img:
                        if str(i).startswith('https:'):
                            rel_img_path_list[count].append(str(i).replace('https://'+AWS_S3_CUSTOM_DOMAIN + '/', ''))
                    count += 1
                else:
                    if str(img).startswith('https:'):
                        rel_img_path_list.append(str(img).replace('https://' + AWS_S3_CUSTOM_DOMAIN + '/', ''))
                    count += 1

        for spin_layer in rel_img_path_list:
            if isinstance(i, list):
                for i in spin_layer:
                    files.append([i, self.threeSixtyRootImagesFolder])
                    files.append([i, self.threeSixtyRootHighResImagesFolder])
            else:
                files.append([spin_layer, self.threeSixtyRootImagesFolder])
                files.append([spin_layer, self.threeSixtyRootHighResImagesFolder])
        print('img_path_list', rel_img_path_list)
        print('files', files)
        multiple_file_copy(files)

        # TODO: [BACKEND][Jacob] add in reducing image size for 360 by default since we keep the high_res ones already

        lsorted = hsorted
        # name where the base image is, we default to the first in the list for now
        if isinstance(img_path_list[0], list):
            firstPreloaderImage = str("images/" + str(os.path.split(img_path_list[0][0])[1]))
            print('firstPreloaderImage', firstPreloaderImage)
            self.productAsset.baseImage = img_path_list[0][0]
        else:
            firstPreloaderImage = str("images/" + str(os.path.split(img_path_list[0])[1]))
            print('firstPreloaderImage', firstPreloaderImage)
            self.productAsset.baseImage = img_path_list[0]

        print('self.productAsset.baseImage', self.productAsset.baseImage)
        productImgList = []
        count = 0
        for x in lsorted:
            productImgList.append([lsorted[count], hsorted[count]])
            count += 1
        print('productImgList', productImgList)
        newFile = j2_env.get_template(threeSixtyViewTemplate).render(preloaderImagePath=firstPreloaderImage,
                                                                     prodImgList=productImgList,
                                                                     rowCount=self.layers)
        new360FileName = str(self.productFolderName + ".xml")
        new360FileName = str(join(THIS_DIR, new360FileName)).replace('\\', '/')
        basename360Assets = os.path.basename(os.path.normpath(self.threeSixtyAssetsFolder))

        print('setting config FilePath to:', self.configFilePath, '\nfrom arguments:', basename360Assets, '\n',
              self.productFolderName, '\n', new360FileName)
        if USE_LOCAL_STORAGE:
            self.configFilePath = '/'.join(str(join(join(str(basename360Assets), self.productFolderName),
                                                    new360FileName)).split('\\'))
            self.productAsset.xml = self.configFilePath
        else:
            self.configFilePath = basename360Assets + '/' + self.productFolderName + '/' + self.productFolderName + ".xml"
            self.productAsset.xml = self.threeSixtyProductNameFolder + '/' + str(self.productFolderName + ".xml")
        with open(new360FileName, "w") as fh:
            fh.write(newFile)
            print(newFile)

        file_copy(str(join(THIS_DIR, new360FileName)).replace('\\', '/'),
                  self.threeSixtyProductNameFolder, local_to_server=True)
        try:
            os.remove(join(root, new360FileName))
        except:
            os.unlink(join(root, new360FileName))
        try:
            # Copy License File to Location
            if USE_LOCAL_STORAGE:
                file_copy(licenseFileTemplate, self.threeSixtyFolder)
            file_copy(str(join(THIS_DIR, licenseFileTemplate)).replace('\\', '/'), self.threeSixtyFolder,
                      local_to_server=True)
        except FileExistsError:
            pass
        # print("---------------------------------")

    def saveProductAsset(self):
        """
        Helper function to save the ProductAsset Object
        :return:
        """
        self.productAsset.save()


def compile3DIntModel(rootPaths, templateDir, licenseFilePath, configFilePath, productAsset, layers, arbitraryList):
    for layer in range(layers):
        # let's make the original 360 and then update the xml file and folder structure with the added layers
        pass

def compile360Bundle(params):
    """
    compile a 360, assumes files are already uploaded to storage location
    absolute path string that points to the where the files are that are being compiled
    :param params: targetDirectory: absolute path string that points to the where the files are that are being compiled,
                                    if a list, then the images that are in the list will be made into a 360 in the
                                    order that they are listed
                   resultDirectory: absolute path string that points to where the files are being compiled;
                                    if not given default is the original path, and will deconflict on the fly
                   ProductAsset: ProductAsset object that is having this 360 added on, should already have the
                                        Product, company and other admin data already applied
                   productAssetList: arbitrary list of product asset images to make a 360, they should follow the same
                                     numbering schema else the function will defualt to putting them all in the same row
                   flatten: force the 360 to a single layers despite the numbering schema
    :return:
    """
    print('compile360Bundle received:', params)
    from .file_name_functions import get_delimiter, get_digits
    from app.products.utility import is_asset

    try:
        targetDirectory = [params.get['targetDirectory']]
    except:
        targetDirectory = [params['targetDirectory']]
    try:
        resultDirectory = params.get['resultDirectory']
    except:
        resultDirectory = params['resultDirectory']
    try:
        productAsset = params.get['productAsset']
    except:
        productAsset = params['productAsset']
    try:
        productAssetList = params.get['productAssetList']
    except:
        productAssetList = params['productAssetList']
    try:
        flatten = params.get['flatten']
    except:
        flatten = params['flatten']
    try:
        mediaUploadFlag = params.get['mediaUploadFlag']
    except:
        mediaUploadFlag = params['mediaUploadFlag']
    adjustment = ''
    if productAsset is None:
        print("Please pass a 360 Product Asset object")
        return None

    if not is_asset(productAsset):
        print("Please pass a valid 360 Product Asset object, that has already been created in the database")
        return None

    if flatten is None:
        flatten = False
    print('established params')
    print('targetDirectory', targetDirectory)
    if resultDirectory is None:
        while True:
            originalResultDirectory = resultDirectory
            if len(targetDirectory) == 1:
                resultDirectory = str(join(targetDirectory[0], productAsset.slug + str(adjustment))).replace('\\', '/')
            else:
                from app.products.models import Product
                product = Product.objects.get(uniqueID=productAsset.product.uniqueID).url
                resultDirectory = str(join(join(product.getURL(), "360"),
                                           productAsset.slug + str(adjustment))).replace('\\', '/')
            exists = ifnot_create_dir(resultDirectory)
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
    else:
        ifnot_create_dir(resultDirectory)

    if len(targetDirectory) == 1 and not mediaUploadFlag:
        targetDirectory = targetDirectory[0]
        # grab the different levels of the spin
        folder_count, spin_layers = findFiles(targetDirectory, folder=True, subd=False)
        spinPaths = []
        print(spin_layers)
        if folder_count == 0 or folder_count is None:
            # dealing with a single layer 360
            layers = int(1)
            spinPaths = [targetDirectory]
        else:
            # dealing with multiple layer spin:
            if flatten:
                layers = int(1)
            else:
                layers = int(folder_count)
            for path in spin_layers:
                spinPaths.append(path)
        arbitraryList = False
    else:
        print('in the file name analyzer')
        spinPaths = productAssetList
        # let's figure out what numbering schema we are using, if dual and sequential numbers
        # then we know that we have a 3D integrated model on our hands otherwise it is flat
        hyphen_delimiter = str(spinPaths[0]).rfind("-")
        underscore_delimiter = str(spinPaths[0]).rfind("_")
        opposite_delimiter = None
        if hyphen_delimiter > underscore_delimiter:
            delimiter = str(spinPaths[0])[hyphen_delimiter]
            test_delimiter = get_delimiter(str(spinPaths[0]))
            if test_delimiter != delimiter:
                opposite_delimiter = str(spinPaths[0])[underscore_delimiter]
        else:
            delimiter = str(spinPaths[0])[underscore_delimiter]
            test_delimiter = get_delimiter(str(spinPaths[0]))
            if test_delimiter != delimiter:
                opposite_delimiter = str(spinPaths[0])[hyphen_delimiter]

        del hyphen_delimiter
        del underscore_delimiter

        singleRow = False
        dualNamingSchema = False
        flatten = False
        if re.match(rf'.*{delimiter}\d+{delimiter}\d+\.*', Path(spinPaths[0]).name, re.IGNORECASE):
            namingConventionRegex = re.compile(rf'{delimiter}\d+{delimiter}\d+\.', re.IGNORECASE)
            dualNamingSchema = True
            print("dual naming convention")

        elif re.match(rf'.*{delimiter}\d+\.', Path(spinPaths[0]).name, re.IGNORECASE):
            namingConventionRegex = re.compile(rf'{delimiter}\d+\.', re.IGNORECASE)
            print("single naming convention")
            singleRow = True

        elif opposite_delimiter is not None:
            if re.match(rf'.*{opposite_delimiter}\d+{delimiter}\d+\.*', Path(spinPaths[0]).name, re.IGNORECASE):
                namingConventionRegex = re.compile(rf'{delimiter}\d+{delimiter}\d+\.', re.IGNORECASE)
                dualNamingSchema = True
                print("dual naming convention with opposite delimiter at the front")

            elif re.match(rf'.*{opposite_delimiter}\d+\.*', Path(spinPaths[0]).name, re.IGNORECASE):
                namingConventionRegex = re.compile(rf'{delimiter}\d+{delimiter}\d+\.', re.IGNORECASE)
                print("single naming convention with opposite delimiter at the front")
                singleRow = True
        else:
            layers = 1
            singleRow = True
            print("could not find a numbering schema, defaulting to single row 360")

        if not singleRow:
            rear_digit_list = []
            if dualNamingSchema:
                front_digit_list = []
            for path in spinPaths:
                extrabit = namingConventionRegex.search(str(split(path)[1])).group()
                # print("file parts:", path, extrabit, delimiter)
                # print(namingConventionRegex)
                if extrabit[0] == delimiter:
                    extrabit = extrabit[1:]
                rear_digits = get_digits(extrabit)
                if len(rear_digits) == 0:
                    # no digits found in the extrabit
                    continue
                rear_digit_list.append(rear_digits)
                if dualNamingSchema:
                    front_digits = get_digits(extrabit, from_back=False)
                    front_digit_list.append(front_digits)
            if dualNamingSchema:
                print(front_digit_list)
                front_digit_list_compact = list(dict.fromkeys(front_digit_list))
                if flatten:
                    layers = int(1)
                else:
                    layers = int(len(front_digit_list_compact))
            del front_digit_list
        else:
            layers = int(1)
        print('layers', layers)
        arbitraryList = True

    if not USE_LOCAL_STORAGE:
        # make the spin paths absolute
        if not spinPaths[0].startswith('https://' + AWS_S3_CUSTOM_DOMAIN):
            count = 0
            for p in spinPaths:
                spinPaths[count] = "https://" + AWS_S3_CUSTOM_DOMAIN + '/' + p
                count += 1
            print('changed spin_paths', spinPaths)
    prodFolderName = productAsset.product.name

    if int(layers) >= int(1):
        # initiate the 360/3Dint creator
        testConfig = ConfigurationObject360(prodFolderName, spinPaths, templatePath, licenseFile, configFilePath,
                                            productAsset, layers, arbitraryList)

        # create the xml file and structure the spin folder, copying files where they need to go
        testConfig.generate360XML(targetDirectory, resultDirectory)

        # create the html file
        testConfig.generate360HTMLFile()

        # save the adjusted ProductAsset so that the database is updated
        testConfig.saveProductAsset()


def multiCompile360Bundlru(productAssetList, resultDirectory=None):
    """
    function that can compile multiple 360's from different areas or a single 360 from a list of images.
    Please note that the images should already be in order if doing the latter.
    :param productAssetList: should be structured as such:

    if compiling multiple 360s:
    [[[360ProductAsset],ResultDirectory],[[360ProductAsset],[ResultDirectory]], ...]

    if compiling 360s from a set of images:
    [[[2DProductAsset, 2DProductAsset1, 2DProductAsset2, 2DProductAsset3, ...],ResultDirectory],
     [[2DProductAsset, 2DProductAsset1, 2DProductAsset2, 2DProductAsset3, ...],ResultDirectory],
     ...]

    you can even combine them in any order:
    [[[2DProductAsset, 2DProductAsset1, 2DProductAsset2, 2DProductAsset3, ...],ResultDirectory],
     [[360ProductAsset],ResultDirectory],[[360ProductAsset],[ResultDirectory]],
     [[2DProductAsset, 2DProductAsset1, 2DProductAsset2, 2DProductAsset3, ...],ResultDirectory],
     ...]

    :param resultDirectory: where the 360 folders should be compiled, if 'None' files will be compiled in a temporary
    folder then moved to the target directory and use the productasset slug to differentiate it from the others
    :return:
    """
    for i in productAssetList:
        target, resultDirectory = i
        if len(target) > 1:
            from app.products.models import ProductAsset
            # we have a list of images, so let's create the new product asset that everything is going inside of
            productAsset = ProductAsset.objects.get(id=target[0].id)
            product_slug = productAsset.product.slug
            com = productAsset.product.company.slug

            new_productAsset = ProductAsset()
            new_productAsset.product = productAsset.product
            new_productAsset.company = productAsset.product.company
            new_productAsset.slug = generate_slug(3, typ='asset', obj=productAsset)
            key = (com + '/products/' + product_slug + '/360/' + new_productAsset.slug)
            # make url
            if USE_LOCAL_STORAGE:
                outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, key))
                if not isdir(outputLocation):
                    makedirs(outputLocation)
                location = normcase(join(outputLocation, productAsset.product.name))
            else:
                location = key
            new_productAsset.url = location
            new_productAsset.file_name = productAsset.product.name

            # check to see that all backgrounds have been removed
            count = 0
            for j in target:
                if j.verified_background_removed == True:
                    count += 1
            if count == len(target):
                new_productAsset.verified_background_removed = True
            else:
                new_productAsset.verified_background_removed = False

            new_productAsset.lastmodified = timezone.now()
            new_productAsset.save()
            resultDirectory = key

            params = {'targetDirectory': target,
                      'resultDirectory': resultDirectory,
                      'productAsset': new_productAsset}
            compile360Bundle(params)
        else:
            # TODO: [BACKEND][Jacob] finish logic for multiple 360 compile
            print("Program cannot process multiple 360s at this time")
            pass


def rename360(productAsset, newName, outputdir=None, delete=False, overwrite=True, move54Pack=True):
    # TODO: [BACKEND][Jacob] finish this logic for renaming 360s
    folderPath = productAsset.url
    total, folders = findFiles(folderPath, subd=True, folder=True)
    if outputdir is None:
        outputdir = join(split(folderPath)[0], newName)
    else:
        outputdir = join(outputdir, newName)
    if not isdir(outputdir):
        os.makedirs(outputdir)
    _, evalFiles = findFiles(folderPath, subd=True, ext='png')
    evalFile = str(evalFiles[0].name)
    key = str(evalFile[:(int(evalFile.find("_")))])
    for folder in folders:
        if 'highres' in str(split(str(folder))[1]):
            total, files = findFiles(str(folder))
            # print('Copying files over')
            for file in files:
                fileName = str(file.name)
                newPath = join(outputdir, fileName)
                copy(str(file), newPath)
                xmlFlag = False
                if key in fileName:
                    if splitext(fileName)[1] == '.xml':
                        xmlFlag = True
                    if not xmlFlag:
                        renamedName = fileName.replace(key, newName)
                        # print(renamedName)
                        renamedPath = join(split(newPath)[0], renamedName)
                        if overwrite:
                            try:
                                rename(newPath, renamedPath)
                            except FileExistsError:
                                try:
                                    os.remove(renamedPath)
                                    rename(newPath, renamedPath)
                                except FileExistsError:
                                    os.unlink(renamedPath)
                                    rename(newPath, renamedPath)
                        else:
                            if isfile(renamedPath):
                                print('File already exists', str(file))
                            os.remove(newPath)

    # run through 360 compiler
    params = [split(folderPath)[0], split(outputdir)[0]]
    newlocation = compile360Bundle(newName, params)
    total, files = findFiles(newlocation, subd=False, ext='png')
    for file in files:
        try:
            os.remove(str(file))
        except:
            os.unlink(str(file))

    if move54Pack:
        total, files = findFiles(folderPath, subd=False)
        for file in files:
            newFileName = '/'.join(str(join(str(newlocation), str(file.name))).split('\\'))
            copy(str(file), newFileName)
            shinyBrightNewName = newFileName.replace(key, newName)
            # print(shinyBrightNewName)
            try:
                rename(newFileName, shinyBrightNewName)
            except:
                continue
    try:
        deleteAll(join(params[0], newName))
    except:
        pass


def renameBatch360BasedOnDictionary(inputDirectory, newNameList=None, dictionaryList=None):
    """
    renames a batch of already compiled 360's to a new name based on a dictionary or list
    dictionary should be structured as {originalName1: NewName1, originalName2: newName2}
    list should be structured as [[originalName1, newName1], [originalName2, newName2]]
    :param inputDirectory: absolute path string to folder that contains all of the 360's as immedaite subdirectories
    :param newNameList: list of names
    :param dictionaryList: dictionary list of names
    :return:
    """
    # TODO: [BACKEND][Jacob] finish the rename360 function then integrate into this logic
    total, folders = findFiles(inputDirectory, subd=False, folder=True)
    count = 0
    if dictionaryList is not None:
        for folder in folders:
            count += 1
            # print(folder.name)
            foundFlag = False
            count = 0
            for d in dictionaryList:
                for key in d.keys():
                    # print(key, str(folder.name))
                    if str(folder.name) in str(key):
                        # print(folder.name, ' is in first dictionary')
                        foundFlag = True
                        break
                    else:
                        count += 1
                if foundFlag:
                    data = d.get(key, "")
                    # print(data)
                    rename360(folder, data)
                    break
                else:
                    continue
                # print('###', '\n')
    elif newNameList is not None:
        # create a dictionary based on the list given
        dictionary = {}
        for item in newNameList:
            dictionary[item[0]] = item[1]
        for folder in folders:
            count += 1
            # print(folder.name)
            foundFlag = False
            count = 0
            for d in dictionaryList:
                for key in dictionary.keys():
                    # print(key, str(folder.name))
                    if str(folder.name) in str(key):
                        # print(folder.name, ' is in first dictionary')
                        foundFlag = True
                        break
                    else:
                        count += 1
                if foundFlag:
                    data = d.get(key, "")
                    # print(data)
                    rename360(str(folder), data)
                    break
                else:
                    continue
                # print('###', '\n')
    else:
        return None


def prep360(listOfAssetPaths, outputLocation, product_object, primary_key):
    """
    helper function to prep the params for compile360
    :param listOfAssetPaths:
    :return:
    """
    from app.products.models import ProductAsset
    spin_list = []
    print('listOfAssetPaths', listOfAssetPaths, outputLocation)
    for asset_path in listOfAssetPaths:
        if USE_LOCAL_STORAGE:
            fc_loc = file_copy(str(asset_path), outputLocation, delete_original=True)
            # TODO: [BACKEND][Jacob] add in overwrite protection
            print("successfully wrote to:", outputLocation)
            # otherwise we are saving it to the cloud
        else:
            # move the asset to the new location
            if asset_path[0].startswith(str('https://'+CLOUDFRONT_DOMAIN)):

                asset_path[0] = asset_path[0].replace(str('https://'+CLOUDFRONT_DOMAIN), str('https://' + AWS_S3_CUSTOM_DOMAIN))
            fc_loc, fc_key = file_copy(str(asset_path[0]), outputLocation, delete_original=False, return_key=True)
            # TODO: [BACKEND][Jacob] known bug: verify that the cloudfront location is correct
            loc = fc_loc.split('/')
            print(loc, fc_loc)
            newlocation = loc[0] + '//d27vruithpdhv2.cloudfront.net'
            c = 0
            for l in loc:
                if c < 3:
                    c += 1
                else:
                    newlocation = str(str(newlocation) + str('/') + str(l))
            print(newlocation)
            spin_list.append(fc_key)
    # create the blank product asset for the 360
    print(1)
    new_asset = ProductAsset()
    print(2)
    new_asset.product = product_object
    print(3)
    new_asset.file_name = str(primary_key)
    print(4)
    if USE_LOCAL_STORAGE:
        # record the local storage area
        new_asset.url = outputLocation
    else:
        # use cloudfront location
        new_asset.url = str(newlocation)
        print(5)
    new_asset.lastmodified = timezone.now()
    print(6)
    new_asset.deletedon = ''
    print(7)
    new_asset.assetType = int(2)
    print(8)
    new_asset.original = True
    new_asset.is_thumbnail = False
    print(9)
    new_asset.save()
    print(10)
    if USE_LOCAL_STORAGE:
        return new_asset, spin_list, outputLocation
    else:
        return new_asset, spin_list, fc_key
