"""
a collection of functions that are built to handle file renaming, naming, and file handling
"""
from pathlib import Path
from os import makedirs, walk, listdir, rename, rmdir
from os.path import isdir, isfile, join, split, splitext, exists
import re
from shutil import rmtree
import numpy as np
from natsort import natsorted
from shutil import copy, move, rmtree
from xapi.settings import TEST_LOCAL, LOCAL_STORAGE_LOCATION, USE_LOCAL_STORAGE, AWS_STORAGE_BUCKET_NAME, \
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_CUSTOM_DOMAIN, CLOUDFRONT_DOMAIN
from app.accounts.models import Profile, Company, User
from app.products.models import ProductAsset
from app.products.utility import get_file_type
import boto3
import botocore
import random
import string
import os
from shutil import rmtree
import mimetypes
from re import sub
from app.products.utility import is_profile, is_company, is_asset, is_content_standard, is_product


def get_delimiter(filename):
    # check the delimiter
    image_delimiter_hyphen = str(filename).count("-")
    image_delimiter_underscore = str(filename).count("_")
    image_delimiter = ''
    if image_delimiter_hyphen + image_delimiter_underscore > 0 and image_delimiter_hyphen != image_delimiter_underscore:
        if image_delimiter_hyphen > image_delimiter_underscore:
            image_delimiter = "-"
        else:
            image_delimiter = "_"
    return image_delimiter


def build_filename_number(name, max_tries=999):
    """
    generates the file number sequentially
    :param name:
    :param max_tries:
    :return:
    """

    # TODO: [BACKEND][Jacob] implement S3 logic
    def buildFilename(name, num=0):
        root, ext = splitext(name)
        return '%s%d%s' % (str(root), num, ext) if num else name

    if not exists(name):
        return name
    else:
        for i in range(max_tries):
            test_name = buildFilename(name, i + 1)
            if not exists(test_name):
                return test_name
        return None


def build_filename(contentStandard=None, product_object=None, useDict=False, base=None,
                   prefix=None, suffix=None, delim='_', number=None, ext=None):
    """
    builds a filename either from explicit arguments or from a content standard and a product object
    :param contentStandard:
    :param product_object:
    :param useDict:
    :param base:
    :param prefix:
    :param suffix:
    :param delim:
    :param number:
    :param ext:
    :return:
    """
    if not useDict:
        # let's build the name we are comparing against
        prefix = contentStandard.filename_prefix
        base = contentStandard.filename_base
        delim = contentStandard.filename_delimiter
        suffix = contentStandard.filename_suffix

        product_name = product_object.name
        product_sku = product_object.SKU
        product_upccode = product_object.upccode

        # determine prefix
        if prefix == '$NAME':
            prefix = str(product_name)
        elif prefix == '$SKU':
            prefix = str(product_sku)
        elif prefix == '$UPC':
            prefix = str(product_upccode)
        elif prefix == None:
            prefix = None
        else:
            prefix = str(prefix)

        # determine prefix
        if base == '$NAME':
            base = str(product_name)
        elif base == '$SKU':
            base = str(product_sku)
        elif base == '$UPC':
            base = str(product_upccode)
        else:
            base = str(base)

        # determine suffix
        if suffix == '$NAME':
            suffix = str(product_name)
        elif suffix == '$SKU':
            suffix = str(product_sku)
        elif suffix == '$UPC':
            suffix = str(product_upccode)
        elif suffix == None:
            suffix = None
        else:
            suffix = str(suffix)

    if ext is not None:
        if str(ext)[0] != '.':
            ext = '.' + str(ext)

    # build the name
    if prefix is not None:
        if suffix is not None:
            if number is not None:
                if ext is not None:
                    cs_file_name = str(prefix + delim + base + delim + suffix + delim + number + ext)
                else:
                    cs_file_name = str(prefix + delim + base + delim + suffix + delim + number)
            else:
                if ext is not None:
                    cs_file_name = str(prefix + delim + base + delim + suffix + ext)
                else:
                    cs_file_name = str(prefix + delim + base + delim + suffix)
        else:
            if number is not None:
                if ext is not None:
                    cs_file_name = str(prefix + delim + base + delim + number + ext)
                else:
                    cs_file_name = str(prefix + delim + base + delim + number)
            else:
                if ext is not None:
                    cs_file_name = str(prefix + delim + base + ext)
                else:
                    cs_file_name = str(prefix + delim + base)
    else:
        if suffix is not None:
            if number is not None:
                if ext is not None:
                    cs_file_name = str(base + delim + suffix + delim + number + ext)
                else:
                    cs_file_name = str(base + delim + suffix + delim + number)
            else:
                if ext is not None:
                    cs_file_name = str(base + delim + suffix + ext)
                else:
                    cs_file_name = str(base + delim + suffix)
        else:
            if number is not None:
                if ext is not None:
                    cs_file_name = str(base + delim + number + ext)
                else:
                    cs_file_name = str(base + delim + number)
            else:
                if ext is not None:
                    cs_file_name = str(base + ext)
                else:
                    cs_file_name = str(base)

    return cs_file_name, prefix, base, suffix, delim


def build_key(request=None, file_address=None, file_type=None, product_object=None, profile_object=None,
              company_object=None, productAsset_object=None, contentStandard=None):
    """
    key builder for content standards or regular keys takes a variety of inputs depending on what you have and tries to
     create a key.
     At a minimum you need at least one of the following:
        - file_type
        - file_address
        - productAsset_object
     --- combined with ---
        - company_object
        - profile_object
        - request with 'userid'
        - productAsset_object
        - product_object

    if you're trying to make a content standard key, pass a valid contentStandard object

    :param file_address:
    :param file_type:
    :param request:
    :param product_object:
    :param profile_object:
    :param company_object:
    :param productAsset_object:
    :param contentStandard:
    :return:
    """
    # get the file_type
    objects = [file_type, file_address, productAsset_object]
    count = 0
    for obj in objects:
        if obj is None:
            count += 1
            continue
        else:
            if count == 0:
                try:
                    if int(file_type) > int(5) or int(file_type) <= int(0):
                        count += 1
                        continue
                    else:
                        break
                except:
                    count += 1
                    continue
            if count == 1:
                file_type = get_file_type(file_address)
                if file_type == 0:
                    count += 1
                    continue
                else:
                    break
            if count == 2:
                try:
                    file_type = productAsset_object.assetType
                except:
                    pass
    if file_type is None:
        print("Please pass a valid file type or a valid ProductAsset object")
        return None

    objects = [request, product_object, profile_object, company_object, productAsset_object]
    count = 0
    com = None
    for obj in objects:
        if obj is None:
            count += 1
            continue
        else:
            if count == 0:
                try:
                    userID = request.data['userid']
                    profile = Profile.objects.get(user=userID)
                    com = Company.objects.get(pk=profile.companyProfile.pk).slug
                    break
                except:
                    # didn't work, let's try another way
                    count += 1
                    continue
            if count == 1:
                try:
                    com = product_object.company.slug
                    break
                except:
                    # didn't work, let's try another way
                    count += 1
                    continue
            if count == 2:
                try:
                    com = Company.objects.get(pk=profile_object.companyProfile.pk).slug
                    break
                except:
                    # didn't work, let's try another way
                    count += 1
                    continue
            if count == 3:
                try:
                    com = company_object.slug
                    break
                except:
                    # didn't work, let's try another way
                    count += 1
                    continue
            if count == 4:
                try:
                    com = productAsset_object.company.slug
                    break
                except:
                    # didn't work, let's try another way
                    count += 1
                    continue
    if com is None:
        print("Please pass a valid request, product_object, profile_object, company_object, productAsset_object")
        return None

    # if it is a single image let's give it a "2D" string
    if int(file_type) == int(1):
        typs = "2D"
    # if it is a 360 let's give it a "360" string
    if int(file_type) == int(2):
        typs = "360"
    # if it's a video, let's give it a "Video" string
    elif int(file_type) == int(3):
        typs = "Video"
    # if it's a 3D model, let's give it a "3D" string
    elif int(file_type) == int(4):
        typs = "3D"
    # otherwise it is a miscellaneous asset
    else:
        typs = "Miscellaneous"

    # let's create our key
    if contentStandard is None:
        # we are not building a content standard key, just a regular key
        if product_object is None:
            if productAsset_object is None:
                print("Please pass a valid ProductAsset or Product object")
            else:
                try:
                    key = (com + '/products/' + str(productAsset_object.product.slug) + '/' + typs)
                except:
                    print("Please pass a valid ContentStandard object with either ProductAsset or Product object")
                    return None
        else:
            try:
                key = (com + '/products/' + str(product_object.slug) + '/' + typs)
            except:
                if productAsset_object is None:
                    print("Please pass a valid ProductAsset or Product object")
                else:
                    try:
                        key = (com + '/products/' + str(productAsset_object.slug) + '/' + typs)
                    except:
                        print("Please pass a valid ContentStandard object with either ProductAsset or Product object")
                        return None

    else:
        # we are building a content standard key
        if product_object is None:
            if productAsset_object is None:
                print("Please pass a valid ProductAsset or Product object")
            else:
                try:
                    key = (com + '/products/' + str(productAsset_object.product.slug) + '/' + typs + '/cs/' + str(
                        com) + '/' + str(
                        contentStandard.name))
                except:
                    print("Please pass a valid ContentStandard object with either ProductAsset or Product object")
                    return None
        else:
            try:
                key = (com + '/products/' + str(
                    product_object.product.slug) + '/' + typs + '/cs/')  # "+ str(contentStandard.company_set)) + '/' + str(contentStandard.name))"
            except:
                if productAsset_object is None:
                    print("Please pass a valid ProductAsset or Product object")
                else:
                    try:
                        key = (com + '/products/' + str(productAsset_object.product.slug) + '/' + typs + '/cs/' +
                               str(com) + '/' + str(contentStandard.name))
                    except:
                        print("Please pass a valid ContentStandard object with either ProductAsset or Product object")
                        return None

    return key


def generate_slug(length, typ, obj):
    # TODO: [BACKEND][Jacob] add in more variants
    if typ == 'asset':
        while True:
            random_string = lambda n: ''.join([random.choice(string.ascii_lowercase + string.digits) for i in range(n)])
            random_string_slug = random_string(int(length))
            try:
                # test if this slug exists
                temp_object = ProductAsset.objects.get(product=obj.product, slug=random_string_slug)
            except:
                break
        return random_string_slug


def get_all_s3_objects(s3, **base_kwargs):
    """
    generator that helps us exceed the 1000 max responses
    :param s3:
    :param base_kwargs:
    :return:
    """
    continuation_token = None
    while True:
        list_kwargs = dict(MaxKeys=1000, **base_kwargs)
        if continuation_token:
            list_kwargs['ContinuationToken'] = continuation_token
        response = s3.list_objects_v2(**list_kwargs)
        yield from response.get('Contents', [])
        if not response.get('IsTruncated'):  # At the end of the list?
            break
        continuation_token = response.get('NextContinuationToken')


def get_filenames(s3, directory, folder=False, subd=False):
    if not str(directory).endswith('/'):
        directory = str(directory)+'\\'
    directory = directory.replace('\\', '/')
    if str(directory).startswith('/home/ubuntu/xspace-webapp-v2') or str(directory).startswith('/home/ubuntu/'):
        # print('unix path found')
        # print('unexpected local path detected, adjusting logic to still get result')
        localPathFlag = True
    elif str(directory).startswith('c:/') or str(directory).startswith('C:/'):
        # print('Windows path found')
        # print('unexpected local path detected, adjusting logic to still get result')
        localPathFlag = True
    elif str(directory).startswith('d:/') or str(directory).startswith('D:/'):
        # print('Windows path found')
        # print('unexpected local path detected, adjusting logic to still get result')
        localPathFlag = True
    else:
        localPathFlag = False

    if localPathFlag:
        result = []
        if folder:
            if subd:
                for root, dirs, files in walk(directory):
                    for d in dirs:
                        result.append(str(Path(join(root, d))))
            else:
                # print('at folder non subd')
                if len(listdir(directory)) > 0:
                    result = [f for f in listdir(directory) if isdir(join(directory, f))]
                    count = 0
                    for f in result:
                        result[count] = str(Path(join(directory, f)))
                        count += 1
                # print('at folder non subd complete successful')
        # since we are not searching for a folder, we will assume that files are being searched for
        else:
            if subd:
                result = list(Path(str(directory)).glob('**/*.*'))
            else:
                result = list(Path(str(directory)).glob("*.*"))
        # print('result test')
        if len(result) == 0:
            # print('result test successful with', result)
            return result
        else:
            count = 0
            for r in result:
                result[count] = str(result[count])
                count += 1
            # print('result test successful with', result)
            return result

    print('get_filenames received:', directory)
    filenames = []
    if folder:
        # print('get_filenames folder--subd')
        for result in get_all_s3_objects(s3, Bucket=AWS_STORAGE_BUCKET_NAME, Prefix=directory):
            # print('result:', result)
            # print('result length:', len(result))
            # need to get the 'key' value from the result response while still maintaining the ability to capture
            # the 'CommonPrefixes' piece
            if len(result) > 1:
                for o in result:
                    try:
                        o = o.get('CommonPrefixes')
                        filenames.append(o.get('Prefix'))
                    except:
                        if o == 'Key':
                            if str(result['Key']).endswith('/') or str(result['Key']).endswith('\\'):
                                filenames.append(result['Key'])
                        continue
            else:
                try:
                    o = result.get('CommonPrefixes')
                    filenames.append(o.get('Prefix'))
                except:
                    if result['Key'] is not None:
                        if str(result['Key']).endswith('/') or str(result['Key']).endswith('\\'):
                            filenames.append(result['Key'])
                    continue
        if subd:
            pass
        else:
            # print('get_filenames folder-- not subd')
            length_of_input = Path(directory)
            length_of_input = int((len(length_of_input.parts))-1)
            # print('length of input', length_of_input)
            count = 0
            for result in filenames:
                # print('subd results folder')
                # print('result:', result)
                if str(result).endswith('/') or str(result).endswith('\\'):
                    temp_result = Path(result)
                    temp_result_length = int((len(temp_result.parts))-1)
                    # print('comparing lengths', temp_result_length, length_of_input)
                    if temp_result_length == length_of_input + 1:
                        count += 1
                        continue
                    else:
                        del filenames[count]
                else:
                    del filenames[count]

    else:
        for result in get_all_s3_objects(s3, Bucket=AWS_STORAGE_BUCKET_NAME, Prefix=directory):
            # print('RESULT:', result)
            if len(result) > 0:
                if result.get('Contents') is None:
                    # print('contents is none')
                    if result.get('Key') is not None:
                        if str(result.get('Key')).endswith('/') or str(result.get('Key')).endswith('\\') or\
                                str(result.get('Key')).endswith('.zip'):
                            pass
                        else:
                            filenames.append(result.get('Key'))
                else:
                    for item in result['Contents']:
                        files = item['Key']
                        if str(files).endswith('/') or str(files).endswith('\\') or str(files).endswith('.zip'):
                            pass
                        else:
                            filenames.append(files)

        if subd:
            count = 0
            for result in filenames:
                if str(result).endswith('/') or str(result).endswith('\\'):
                    filenames.pop(count)
                else:
                    count += 1
        else:
            length_of_input = Path(directory)
            length_of_input = int((len(length_of_input.parts)) - 1)
            count = 0
            gcount = 0
            for result in range(len(filenames)):
                gcount += 1
                if str(filenames[count]).endswith('/') or str(filenames[count]).endswith('\\'):
                    filenames.pop(count)
                else:
                    temp_result = Path(filenames[count])
                    temp_result_length = int((len(temp_result.parts)) - 1)
                    if temp_result_length == length_of_input + 1:
                        count += 1
                    else:
                        filenames.pop(count)

    print('filenames', filenames, len(filenames))
    return filenames


def findFiles(directory, ext=None, subd=True, folder=False):
    """
    finds the files in the directories and/or subdirectories that match the type
    :param directory: Directory you want to search
    :param ext: AKA extension of the file. should be input similar to 'png' format
    :param subd: Boolean where True is if you only want to search that directory and its subdirectories
    False gives you the results from only that directory and not its subdirectories
    :param folder: if True, will return the folder paths in the directory, when combined with 'subd=True' all
    subdirectory folder paths will be returned
    :return: returns a list of 'WindowsPaths' or 'PosixPaths' (linux/mac) depending on the OS
    """
    if USE_LOCAL_STORAGE:
        result = []
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
            return None, None
        else:
            return len(result), result
    else:
        # we are using S3 as storage
        """
        response = client.list_objects_v2(
                        Bucket='string',
                        Delimiter='string',
                        EncodingType='url',
                        MaxKeys=123,
                        Prefix='string',
                        ContinuationToken='string',
                        FetchOwner=True|False,
                        StartAfter='string',
                        RequestPayer='requester')
        https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.list_objects_v2
        """
        s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
        if directory.startswith(str('https://' + AWS_S3_CUSTOM_DOMAIN)):
            directory = directory.replace(str('https://' + AWS_S3_CUSTOM_DOMAIN + '/'),  '')
        elif directory.startswith(str('https://' + CLOUDFRONT_DOMAIN)):
            directory = directory.replace(str('https://' + CLOUDFRONT_DOMAIN + '/'), '')
        print('find_files passing onto get_filenames', directory)
        results = get_filenames(s3, directory, folder=folder, subd=subd)
        if ext is None or len(results) == 0:
            result = results
            del results
        else:
            result = []
            for r in results:
                if str(r).endswith(ext):
                    result.append(r)
            del results
        if len(result) > 0:
            return len(result), result
        else:
            return None, None


def delete_file_boto3(pathList, s3_resource=None):
    print('inside delete_boto3 trying to delete:', pathList)
    if not USE_LOCAL_STORAGE:
        if s3_resource is None:
            s3_resource = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY_ID,
                                         aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
    errors = []
    if USE_LOCAL_STORAGE:
        for path in pathList:
            if isfile(path):
                try:
                    os.remove(path)
                except:
                    errors.append(path)
                    continue
            elif isdir(path):
                rmtree(path)
            # check that the directory exists
            else:
                # this isn't a file or folder, so I don't know what you gave us
                continue
    else:
        for path in pathList:
            split_name = str(path).split('/')
            print('split_name', split_name)
            if split_name[2].endswith('.cloudfront.net'):
                # since we know it's a cloudfront distribution then we need to convert it into it's s3 equivalent
                path = split_name[0] + '//' + AWS_S3_CUSTOM_DOMAIN + '/'
                split_name = split_name[3:]
                print('prior key:', split_name)
                path = ''
                for x in split_name:
                    if path.endswith('/'):
                        print("path adjusted from:", path)
                        path = path[:-1]
                        print("to:", path)
                    path += str('/' + str(x))
                path = path[1:]
                print("new s3 equivalent path", path)
            try:
                s3_resource.Object(AWS_STORAGE_BUCKET_NAME, path).delete()
            except:
                errors.append(path)
    if len(errors) == 0:
        success = True
    else:
        success = False
    return success, errors, path


def rename_file_boto3(pathList, cleanup=True, deleteOriginal=True, deleteoriginalfolder=False):
    """
    deconflicting should already be handled. if each of your entries in pathlist have an arbitrary length > 2 then the
     function will iterate through the first two filenames and then iterate through the second two and so on until done

    example:
    in this example I want to move all files out of a folder into a temp location and then back in, but renamed
     (useful when renumbering)
    pathlist = [["/path/to/text.a", "temp_path/to/text.a", "/path/to/text_renumbered.a"],
                ["/path/to/text.b", "temp_path/to/text.b", "/path/to/text_renumbered.b"]]
    rename_Boto3(pathList)
        INSIDE THE FUNCTION
        *** first files are moved to intermediate location ***
        "/path/to/text.a"-> "temp_path/to/text.a"
        "/path/to/text.b"-> "temp_path/to/text.b"
        *** second files are moved to final location ***
        "temp_path/to/text.a"-> "/path/to/text_renumbered.a"
        "temp_path/to/text.b"-> "/path/to/text_renumbered.b"
        *** Database is updated with the final location of the assets ***
        *** intermediate folders are deleted ***

    NOTE: deleting the original folder essentially makes this into a move function

    :param pathList:
    :return:
    """
    if not USE_LOCAL_STORAGE:
        s3_resource = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY_ID,
                                     aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
    for length in range(len(pathList[0])):
        if int((length + 1)) == int(len(pathList[0])):
            break
        if USE_LOCAL_STORAGE:
            for path in pathList:
                # check that the directory exists
                if not isdir(split(path[length + 1])[0]):
                    makedirs(split(path[length + 1])[0])
                move(path[length], path[length + 1])
        else:
            for path in pathList:
                s3_resource.Object(AWS_STORAGE_BUCKET_NAME, path[length + 1]).copy_from(CopySource=path[length])
                if deleteOriginal:
                    s3_resource.Object(AWS_STORAGE_BUCKET_NAME, path[length]).delete()
    # update the database
    for path in pathList:
        productAsset = ProductAsset.objects.get(url=str(path[0]))
        productAsset.url = path[-1]
        productAsset.save()

    if cleanup:
        # delete any intermediate folders that were created

        prefixList = []
        if USE_LOCAL_STORAGE:
            for length in range(len(pathList[0])):
                if length + 1 == len(pathList[0]):
                    break
                for path in pathList:
                    if deleteoriginalfolder and length == 0:
                        prefix = str(split(path[length])[0]) + '/'
                        if prefix in prefixList:
                            continue
                        rmtree(prefix)
                        continue
                    prefix = str(split(path[length])[0]) + '/'
                    if prefix in prefixList:
                        continue
                    rmtree(prefix)
        else:
            bucket = s3_resource.Bucket(AWS_STORAGE_BUCKET_NAME)
            for length in range(len(pathList[0])):
                if length + 1 == len(pathList[0]):
                    break
                for path in pathList:
                    if deleteoriginalfolder and length == 0:
                        prefix = str(split(path[length])[0]) + '/'
                        if prefix in prefixList:
                            continue
                        bucket.objects.filter(Prefix=prefix).delete()
                        prefixList.append(prefix)
                        continue
                    prefix = str(split(path[length])[0]) + '/'
                    if prefix in prefixList:
                        continue
                    bucket.objects.filter(Prefix=prefix).delete()
                    prefixList.append(prefix)


def key_exist(key, s3=None):
    """
    return true if key exists else -> False
    :param s3: boto3.resource instance
    :param key:
    :return:
    """
    if s3 is None:
        s3 = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY_ID,
                            aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

    try:
        s3.Object(AWS_STORAGE_BUCKET_NAME, key).load()
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            # The object does not exist.
            return False
        else:
            # Something else has gone wrong.
            raise
    else:
        # The object does exist.
        return True


def ifnot_create_dir(key, s3=None):
    """
    create folder in storage if it doesn't exist, returns if the folder existed or not
    :param s3:
    :param key:
    :return:
    """
    from botocore.errorfactory import ClientError
    print('ifnot_create_dir received', key)
    originally_existed = False
    if str(key).startswith('/home/ubuntu/xspace-webapp-v2') or str(key).startswith('/home/ubuntu/'):
        # print('unix path found')
        # print('unexpected local path detected, adjusting logic to still get result')
        localPathFlag = True
    elif str(key).startswith('c:/') or str(key).startswith('C:/'):
        # print('Windows path found')
        # print('unexpected local path detected, adjusting logic to still get result')
        localPathFlag = True
    elif str(key).startswith('d:/') or str(key).startswith('D:/'):
        # print('Windows path found')
        # print('unexpected local path detected, adjusting logic to still get result')
        localPathFlag = True
    else:
        localPathFlag = False

    if USE_LOCAL_STORAGE or localPathFlag:
        if not isdir(key):
            makedirs(key)
        else:
            originally_existed = True
    else:
        if not str(key).endswith('/'):
            key += '/'
        print('adjusted key to:', key)
        client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID,
                              aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
        result = client.list_objects(Bucket=AWS_STORAGE_BUCKET_NAME, Prefix=key)
        # print(result)
        if 'Contents' in result:
            print('folder exists')
            originally_existed = True
        else:
            print('folder does not exist')
            originally_existed = False
            # create the folder
            client.put_object(Bucket=AWS_STORAGE_BUCKET_NAME, Key=key)

    return originally_existed


def file_copy(filepath, outputfilepath, delete_original=False, s3=None, return_key=False, rename=None, local_to_server=False):
    """
    copy/move function for local or s3 storage
    :param filepath:
    :param outputfilepath:
    :param delete_original:
    :param s3:
    :return:
    """
    if USE_LOCAL_STORAGE:
        if isfile(outputfilepath):
            ifnot_create_dir(split(outputfilepath)[0])
        else:
            ifnot_create_dir(outputfilepath)
        if delete_original:
            move(filepath, outputfilepath)
        else:
            copy(filepath, outputfilepath)
    else:
        # check if it is a file (isfile and isdir do not work for some reason)
        if str(str(outputfilepath)[-4]) != str('.') and str(str(outputfilepath)[-3:]) != str('.js'):
            # is a folder
            outputfolderpath = str(outputfilepath).replace('\\', '/')
            outputfilepath = str(join(outputfolderpath, split(filepath)[1])).replace('\\', '/')
        else:
            # is a file
            outputfilepath = str(outputfilepath).replace('\\', '/')
            outputfolderpath = str(split(outputfilepath)[0]).replace('\\', '/')

        if s3 is None:
            s3 = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

        if local_to_server:
            # print('local_to_server recieved', filepath, outputfilepath)
            s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
            with open(filepath, "rb") as f:
                s3.upload_fileobj(f, AWS_STORAGE_BUCKET_NAME, outputfilepath)
            changeContentType(outputfilepath)
            if delete_original:
                os.remove(filepath)
        else:
            try:
                print('trying to copy')
                print('outputfilepath', outputfilepath)
                print('filepath', filepath)
                if filepath.startswith(str('https://' + AWS_S3_CUSTOM_DOMAIN)):
                    filepath = filepath.replace(str('https://' + AWS_S3_CUSTOM_DOMAIN + '/'), '')
                elif filepath.startswith('https://'+CLOUDFRONT_DOMAIN):
                    filepath = filepath.replace(str('https://'+CLOUDFRONT_DOMAIN + '/'), '')
                else:
                    # try to build it
                    parts = filepath.split('/')
                    o = ''
                    lo = 0
                    for part in parts:
                        if lo <= 2:
                            lo += 1
                        else:
                            o += str(str(part) + '/')
                            lo += 1
                    filepath = o[:-1]
                print('adjusted filepath', filepath)
                if outputfilepath.startswith(str('https://' + AWS_S3_CUSTOM_DOMAIN)):
                    outputfilepath = outputfilepath.replace(str('https://' + AWS_S3_CUSTOM_DOMAIN + '/'), '')
                elif outputfilepath.startswith('https://'+CLOUDFRONT_DOMAIN):
                    outputfilepath = outputfilepath.replace(str('https://'+CLOUDFRONT_DOMAIN + '/'), '')
                else:
                    # try to build it
                    parts = outputfilepath.split('/')
                    o = ''
                    lo = 0
                    for part in parts:
                        if lo <= 2:
                            lo += 1
                        else:
                            o += str(str(part) + '/')
                            lo += 1
                    outputfilepath = o[:-1]
                s3.Object(AWS_STORAGE_BUCKET_NAME,
                          outputfilepath).copy_from(CopySource={'Bucket': AWS_STORAGE_BUCKET_NAME,
                                                                'Key': filepath})
                print('1')
                changeContentType(outputfilepath)
            except Exception as e:
                print('errored, trying to create folder and then copy... \n', e)
                s3_client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
                if str(outputfolderpath).endswith('/'):
                    s3_client.put_object(Bucket=AWS_STORAGE_BUCKET_NAME, Key=outputfolderpath)
                else:
                    s3_client.put_object(Bucket=AWS_STORAGE_BUCKET_NAME, Key=(outputfolderpath + '/'))
                s3.Object(AWS_STORAGE_BUCKET_NAME, outputfilepath).copy_from(CopySource={'Bucket': AWS_STORAGE_BUCKET_NAME,
                                                                                         'Key': filepath})
                changeContentType(outputfilepath)
            # print('successfully copied to:', outputfilepath)
            if delete_original:
                s3.Object(AWS_STORAGE_BUCKET_NAME, filepath).delete()

        if return_key:
            return ("https://" + AWS_STORAGE_BUCKET_NAME + ".s3.amazonaws.com/" + outputfilepath, outputfilepath)
        else:
            return ("https://" + AWS_STORAGE_BUCKET_NAME + ".s3.amazonaws.com/" + outputfilepath)


def multiple_file_copy(files, delete_original=False, s3=None):
    """
    copy/move function for local or s3 storage
    :param files: list of [[srcfilePath, outfilePath],[srcfilePath,outfilePath]]
    :param delete_original:
    :param s3:
    :return:
    """
    if USE_LOCAL_STORAGE:
        for filepath, outputfilepath in files:
            copy(filepath, outputfilepath)
    else:
        if s3 is None:
            s3 = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY_ID,
                                aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
        for filepath, outputfilepath in files:
            if not isfile(outputfilepath):
                outputfolderpath = str(outputfilepath).replace('\\', '/')
                outputfilepath = str(join(outputfilepath, split(filepath)[1])).replace('\\', '/')
            else:
                outputfolderpath = str(split(outputfilepath)[0]).replace('\\', '/')
            try:
                # print('trying to copy')
                s3.Object(AWS_STORAGE_BUCKET_NAME, outputfilepath).copy_from(
                    CopySource={'Bucket': AWS_STORAGE_BUCKET_NAME,
                                'Key': filepath})
                changeContentType(outputfilepath)
            except:
                # print('errored, trying to create folder and then copy')
                s3_client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID,
                                         aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
                if str(outputfolderpath).endswith('/'):
                    s3_client.put_object(Bucket=AWS_STORAGE_BUCKET_NAME, Key=outputfolderpath)
                else:
                    s3_client.put_object(Bucket=AWS_STORAGE_BUCKET_NAME, Key=(outputfolderpath + '/'))
                s3.Object(AWS_STORAGE_BUCKET_NAME, outputfilepath).copy_from(
                    CopySource={'Bucket': AWS_STORAGE_BUCKET_NAME,
                                'Key': filepath})
                changeContentType(outputfilepath)
            print('successfully copied to:', outputfilepath)
            if delete_original:
                s3.Object(AWS_STORAGE_BUCKET_NAME, filepath).delete()

# deleteAll, retrieveProdName


def changeContentType(key, contentType=None, s3=None):
    """
    Change the content type of a file based on its extension to an AWS recognizable Macie Classic type, which is
    similar to MIME Types but slightly different

    :param key: relative file path within the bucket
    :param contentType: (optional) specified contentType (if known)
    :param s3: resource boto3.resource object
    :return: Boolean
    """
    # print('changeContentType received', key)
    # print('changeContentType received', str(key)[-4],  str(key)[-3])
    if str(key)[-4] != '.' and str(key)[-3] != '.' and str(key)[-5] != '.':
        return False

    _, ext = splitext(str(key))
    # print('changeContentType', ext)

    if contentType is None:
        if ext == ".jpg" or ext == ".jpeg":
            contentType = "image/jpeg"
        elif ext == ".png":
            contentType = "image/png"
        elif ext == ".tif" or ext == ".tiff":
            contentType = "image/tiff"
        elif ext == ".xml":
            contentType = "text/xml"
        elif ext == ".svg":
            contentType = "image/svg+xml"
        elif ext == ".js":
            contentType = "application/javascript"
        elif ext == ".htm" or ext == ".html":
            contentType = "text/html"
        elif ext == ".css":
            contentType = "text/css"
        elif ext == ".lic":
            return True
        else:
            contentType = mimetypes.guess_type(key)[0]

    if s3 is None:
        s3 = boto3.resource("s3", aws_access_key_id=AWS_ACCESS_KEY_ID,
                                aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
    try:
        object = s3.Object(AWS_STORAGE_BUCKET_NAME, key)
        object.copy_from(CopySource={'Bucket': AWS_STORAGE_BUCKET_NAME,
                                     'Key': key},
                         MetadataDirective="REPLACE",
                         ContentType=contentType)
        print("changed content-type to:", contentType, "for", key)
        return True
    except:
        return False


def copyTree(directory, outputdirectory, overwrite=True, folderOnly=False, ext=None, contentsOnly=True, s3=None,
             local_to_server=False):
    """
    Iteratively copies a directory over to another directory
    :param contentsOnly:
    :param s3: boto3.resource instance
    :param directory: directory you want to copy
    :param outputdirectory: directory that everything is being copied to
    :param overwrite: if you don't want to overwrite, place this value to false
    :param folderOnly: only copies the structure, none of the files are copied
    :param ext: if this is claimed, only that specific file type is moved
    :return:
    """
    print('copyTree received', directory, outputdirectory)
    # doing this helps with managing boto3 bloat from recursive file handling functions
    if not USE_LOCAL_STORAGE:
        if s3 is None:
            s3 = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY_ID,
                                aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
        else:
            pass
    else:
        s3 = None

    ifnot_create_dir(str(outputdirectory))

    if not local_to_server:
        if str(outputdirectory) == str(directory):
            # we already have the files here
            return None
    directory = str(directory)
    if contentsOnly:
        outputdirectory = str(outputdirectory)
    else:
        outputdirectory = join(str(outputdirectory), str(split(directory)[1]))
        ifnot_create_dir(str(outputdirectory))
    totalFolders, folders = findFiles(directory, folder=True, subd=False)
    # print('copyTree folders', folders)
    if folders is not None:
        for folder in folders:
            # check that this is actually a folder:
            if isdir(folder) or str(folder).endswith('/') or str(folder).endswith('\\'):
                localdirectory = join(directory, folder)
                localoutputdirectory = str(join(outputdirectory, split(folder)[1])).replace('\\', '/')
                ifnot_create_dir(str(localoutputdirectory))
                copyTree(localdirectory, localoutputdirectory, overwrite=overwrite, folderOnly=folderOnly, ext=ext,
                         s3=s3, local_to_server=local_to_server)
            else:
                continue
    if not folderOnly:
        if ext is None:
            totalFiles, files = findFiles(directory, subd=False)
        else:
            totalFiles, files = findFiles(directory, subd=False, ext=ext)
        print('copyTree files', files)
        if files is not None:
            for file in files:
                filepath = str(file)
                # double check that this is a filepath:
                if not isfile(filepath) or str(filepath).endswith('/') or str(filepath).endswith('\\'):
                    continue
                else:
                    if USE_LOCAL_STORAGE:
                        outputfilepath = join(str(outputdirectory), split(file)[1])
                    else:
                        outputfilepath = join(str(outputdirectory), str(split(file)[1]).replace('\\', '/'))
                    if isfile(outputfilepath):
                        if overwrite:
                            print('copyTree sending forward:', str(filepath), str(outputfilepath))
                            file_copy(str(filepath), str(outputfilepath), local_to_server=local_to_server)
                            print('successfully copied', filepath, 'to', outputfilepath)
                        else:
                            continue
                    else:
                        file_copy(str(filepath), str(outputfilepath), local_to_server=local_to_server)
                        print('successfully copied', filepath, 'to', outputfilepath)


def renumber(folder, chooseFront=False, startingNumber=0, skip=1, subd=False):
    """
    renumber a folder filled with photos with the naming schema "SOMEBITOFINFOHERE_0.EXT" where, in this example,
    the '0' will be renumbered to the desired specs
    :param folder: absolute path to the folder that contains the photos that need renumbered
    :param chooseFront: assuming that all of the photos are already in order, you can choose the photo that is going to
    be designated as the start of the sequence
    :param startingNumber: integer of the number you would like to start on for the renumbering
    :param skip: integer of the number of places you want to skip, for example when skip=1 the output sequence would be
    '1,2,3,4,...' while a skip of 5 would yield '5,10,15,20,...'
    :return: None
    """
    # TODO [BACKEND][Jacob] implement logic
    """
    logic I want to implement:
    get the files->find out what the new file names should be->build the list as:
     [[original/path/text.txt, temp/path/text.txt, original/path/text_RENUMBERED.txt],
      [original/path/text.txt, temp/path/text.txt, original/path/text_RENUMBERED.txt],
      ...]
     pass list to rename_file_boto3
    """

    total, files = findFiles(folder, subd=subd)
    # sort the dang list
    count = 0
    if total is None:
        return None
    for file in files:
        file = '/'.join(str(file).split('\\'))
        files[int(count)] = str(file)
        count += 1
    files = natsorted(files)
    # to avoid naming conflicts we're going to make a temporary folder to put everything in, move it back in to the
    # original folder, and then delete the temp folder as if it was never there
    parent, _ = split(str(folder))
    if USE_LOCAL_STORAGE:
        tempFolder = join(parent, "TEMPRENAMINGFOLDER-DONTDELETE")
        if not isdir(tempFolder):
            makedirs(tempFolder)
        count = startingNumber
        # rename the files into the temporary folder
        for file in files:
            parent, filename = split(str(file))
            name, ext = splitext(str(filename))
            extractedBit = str(name[:(int(name.find("_") + 1))])
            renumberedName = str(extractedBit + str(count) + str(ext))
            # catch some stupid errors
            if ext == '.ini':
                continue
            renumberedName = join(tempFolder, renumberedName)
            # check that the file does not already exist if it does, keep on keeping on
            if isfile(renumberedName):
                continue
            # print(renumberedName)
            rename(str(file), renumberedName)
            count += skip
        # move them all back into the original folder
        total, files = findFiles(tempFolder)
        for file in files:
            parent, filename = split(str(file))
            move(str(file), join(folder, filename))
        # remove the temporary directory
        rmtree(tempFolder, ignore_errors=True)


def Rename(name, folder=None, specificAssets=None, subd=True):
    """
    rename a folder filled with photos or list of specific assets with the naming schema "SOMEBITOFINFOHERE_0.EXT" where, in this example,
    the 'SOMEBITOFINFOHERE' will be renamed to the desired string
    :param folder: absolute path to the folder that contains the photos that need renamed
    :param name: new name as a string that you want to rename the photos to
    :return: None
    """
    # TODO [BACKEND][Jacob] implement S3 logic
    # TODO: [BACKEND][Jacob] implement prefix/base/suffix logic
    if folder is None:
        if specificAssets is None:
            return None
        else:
            total = len(specificAssets)
            files = specificAssets
    else:
        total, files = findFiles(folder, subd=subd)
        folder = '/'.join(str(folder).split('\\'))
        # sort the dang list
    count = 0
    for file in files:
        file = '/'.join(str(file).split('\\'))
        file = str(file)
        files[int(count)] = str(file.replace(str(folder), ''))[1:]
        count += 1
    files = natsorted(files)
    # to avoid naming conflicts we're going to make a temporary folder to put everything in, move it back in to the
    # original folder, and then delete the temp folder as if it was never there
    parent, _ = split(str(folder))

    if USE_LOCAL_STORAGE:
        tempFolder = join(parent, "TEMPRENAMINGFOLDER-DONTDELETE")
        if not isdir(tempFolder):
            makedirs(tempFolder)
        # print(files)
        count = 0
        # rename the files into the temporary folder
        for file in files:

            parent, filename = split(str(file))
            if not isdir(join(tempFolder, parent)):
                makedirs(join(tempFolder, parent))
            fname, ext = splitext(str(filename))
            extractedBit = str(fname[(int(fname.find("_") + 1)):])
            renamedName = str(name + "_" + str(extractedBit + str(ext)))
            # catch some stupid errors
            if ext == '.ini':
                continue
            renamedName = join(tempFolder, join(parent, renamedName))
            renamedName = '/'.join(str(renamedName).split('\\'))
            # check that the file does not already exist if it does, keep on keeping on
            if isfile(renamedName):
                continue
            target = join(folder, str(file))
            target = '/'.join(str(target).split('\\'))
            rename(target, renamedName)
            count += 1
        # move them all back into the original folder
        total, files = findFiles(tempFolder)
        tempFolder = '/'.join(str(tempFolder).split('\\'))
        # sort the dang list again otherwise errors tend to get thrown
        count = 0
        for file in files:
            file = '/'.join(str(file).split('\\'))
            file = str(file)
            files[int(count)] = str(file.replace(str(tempFolder), ''))[1:]
            count += 1
        files = natsorted(files)
        for file in files:
            move(join(tempFolder, str(file)), join(folder, str(file)))
        # remove the temporary directory
        rmtree(tempFolder)
    else:
        pass


def lowestFileCounts(targetDirectory, structure=True):
    """
    targetDirectory: directory you want to search
    returns: list of number of files in each of the lowest subdirectories
    """
    print('lowestFileCounts - received (targetDirectory):', targetDirectory)
    outList = []
    relative_depth = len(Path(targetDirectory).parts)
    print('lowestFileCounts - relativeDepth:', relative_depth)
    totalfolders, folders = findFiles(str(targetDirectory), subd=True, folder=True)
    print('lowestFileCounts - folders:', folders)
    totalfiles, files = findFiles(str(targetDirectory), subd=False)
    print('lowestFileCounts - files:', files)
    if folders is None and files is None:
        print('lowestFileCounts - first if:', outList)
        return outList
    elif folders is None:
        ret = [[totalfiles, targetDirectory.replace('\\', '/'), files]]
        return [ret] if structure else ret
    else:
        if structure:
            if files is not None:
                outList.append([[totalfiles, targetDirectory.replace('\\', '/'), files]])
            depth = 0
            for folder in folders:
                folder = Path(folder)
                local_depth = len(folder.parts)
                if local_depth > depth:
                    depth = local_depth
            depth -= relative_depth
            print('DEPTH', depth)
            for d in range(1, depth + 1):
                local_outList = []
                for folder in folders:
                    folder = Path(folder)
                    local_depth = len(folder.parts)
                    if local_depth == d + relative_depth:
                        totalfiles, files = findFiles(str(folder), subd=False)
                        # print(folder, files)
                        local_outList.append([totalfiles, str(folder).replace('\\', '/'), files])
                outList.append(local_outList)
            return outList
        else:
            if files is not None:
                outList.append([totalfiles, targetDirectory.replace('\\', '/'), files])
            for folder in folders:
                totalfiles, files = findFiles(str(folder), subd=False)
                if files is None:
                    continue
                else:
                    outList.append([totalfiles, str(folder).replace('\\', '/'), files])
            return outList


def longestSubstringFinder(string1, string2):
    answer = ""
    len1, len2 = len(string1), len(string2)
    for i in range(len1):
        match = ""
        for j in range(len2):
            if (i + j < len1 and string1[i + j] == string2[j]):
                match += string2[j]
            else:
                if (len(match) > len(answer)): answer = match
                match = ""
    return answer


def get_digits(string1, from_back=True):
    # print('get_digits received', string1, from_back)
    if not from_back:
        string1 = string1[::-1]
    string1 = list(string1)
    count = 0
    for x in string1:
        if str(x).isdigit():
            count += 1
            continue
        else:
            if count == 0:
                string1 = string1[1:]
            else:
                break
        count += 1
    string1 = ''.join(string1)
    string1 = string1[count:]
    if not from_back:
        string1 = string1[::-1]
    return string1
