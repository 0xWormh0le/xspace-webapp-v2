import re

image_types = ['.jpg', '.jpeg', '.png', '.tiff',
               '.tif', '.raw', '.dng', '.bmp', '.jfif']
video_types = ['.webm', '.mkv', '.flv', '.flv', '.vob', '.ogv', '.ogg', '.drc', '.gif', '.gifv', '.mng',
               '.avi', '.mov', '.mts', '.m2ts', '.ts', '.qt', '.wmv', '.yuv', '.rm', '.rmvb', '.asf',
               '.amv', '.mp4', '.m4p', '.m4v', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.mpg', '.m2v',
               '.svi', '.3gp', '.3g2', '.mxf', '.roq', '.nsv', '.flv', '.f4v', '.f4p', '.f4a', '.f4b']
threed_types = ['.amf', '.blend', '.dgn', '.dwf', '.dwg', '.dxf', '.flt', '.fvrml', '.hsf', '.iges',
                '.imml', '.ipa', '.ma', '.mb', '.obj', '.ply', '.pov', '.prc', '.step', '.skp', '.stl',
                '.u3d', '.vrml', '.xaml', '.xgl', '.xvl', '.xvrml', '.x3d', '.3d', '.3df', '.3dm',
                        '.3ds', '.3dxml']


def get_file_name(file_path):
    return re.sub('.+/', '', file_path)


def get_file_type(file_name):
    extension = '.' + re.sub(r'.+\.', '', file_name)
    file_type = 'Misc'
    if extension in image_types:
        file_type = '2D'

    if extension in video_types:
        file_type = 'Video'

    if extension in threed_types:
        file_type = '3D'

    return file_type


def get_delimiter(file_name):
    delimiter = ''
    count = 0
    if '_' in file_name:
        delimiter = '_'
        count = file_name.count('_')
    elif '-' in file_name:
        delimiter = '-'
        count = file_name.count('-')

    return (delimiter, count)


def get_delimiter_position(delimiter, file_name):
    position = 'end'
    key = delimiter[0]
    # If the file name starts with a number then the delimiter, it must
    # be at the beginning
    regex = f'[0-9]{{1,5}}{key}'
    if re.match(regex, file_name):
        position = 'beginning'
    return position


def split_file_name(delimiter, file_name):
    common = ''
    sequence = ''

    # Remove the extension
    no_suffix = re.sub(r'\..+', '', file_name)

    delimiter_position = get_delimiter_position(delimiter, no_suffix)

    # Handle delimiter in beginning
    if delimiter_position == 'beginning':
        regex = ''
        # If delimiter was found once ##-file_name
        if delimiter[1] == 1:
            regex = f'[0-9]{{1,5}}{delimiter[0]}'
        # if delimiter was found twice ##-##-file_name
        else:
            regex = f'[0-9]{{1,5}}{delimiter[0]}[0-9]{{1,5}}{delimiter[0]}'
        match = re.match(regex, no_suffix)
        # If statement to handle cases with no match
        # this shouldn't occur, but just in case
        if match:
            sequence = match.group()
            common = re.sub(sequence, '', no_suffix)
    # Handle delimiter at end
    else:
        # If delimiter was found once file_name-##
        regex = ''
        if delimiter[1] == 1:
            regex = f'{delimiter[0]}[0-9]{{1,5}}'
        # If delimiter was found twice file_name-##-##
        else:
            regex = f'{delimiter[0]}[0-9]{{1,5}}{delimiter[0]}[0-9]{{1,5}}'

        match = re.search(regex, no_suffix)
        # If statement to handle cases with no match
        # this shouldn't occur, but just in case
        if match:
            sequence = match.group()
            common = re.sub(sequence, '', no_suffix)
    return (common, sequence)


def recognize_files(file_list):
    result = {
        'common': '',
        'data': {
            '2D': [],
            '360': [],
            '3D': [],
            'Misc': [],
            'Video': [],
            'delimiter': ''
        }
    }

    # Get pattern and delimiter
    first_file = file_list[0]
    first_file_name = get_file_name(first_file)
    delimiter = get_delimiter(first_file_name)
    result['data']['delimiter'] = delimiter[0]
    (common, sequence) = split_file_name(delimiter, first_file_name)
    result['common'] = common

    # Get videos
    videos = [file for file in file_list if get_file_type(file) == 'Video']
    result['data']['Video'] = videos

    # Get 3D
    threed = [file for file in file_list if get_file_type(file) == '3D']
    result['data']['3D'] = threed

    # Handle misc
    misc = [file for file in file_list if get_file_type(file) == 'Misc']
    result['data']['Misc'] = misc

    # Handle 2D
    image = [file for file in file_list if get_file_type(file) == '2D']
    if len(image) <= 8:
        result['data']['2D'] = image
    else:
        result['data']['360'] = image

    return result


def process_folders(folder_list):
    result = {}
    for folder in folder_list:
        # Third item is the list of folders
        processed = recognize_files(folder[2])
        common = processed['common']
        result[common] = processed['data']

    return result
