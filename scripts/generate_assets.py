from optparse import OptionParser
import pathlib
import shutil
import os
import sys
# Because of this relative path, this script only works when run
# from the current directory
sys.path.append('taxman-engine/Scripts')
from generate_sprite_sheet import generate_sprite_sheet


def generate_sprite_sheets_from_directories(source_path, target_path):
    source_directories = []
    for file in os.listdir(source_path):
        dir_path = os.path.join(source_path, file)
        if os.path.isdir(dir_path):
            for sub_file in os.listdir(dir_path):
                if pathlib.Path(sub_file).suffix == '.png':
                    source_directories.append(dir_path)
                    break

    for dir_path in source_directories:
        generate_sprite_sheet(dir_path, target_path)


def copy_asset_files(source_path, target_path):
    for file in os.listdir(source_path):
        file_path = os.path.join(source_path, file)
        if not os.path.isfile(file_path):
            continue
        shutil.copy(file_path, target_path)


def main():
    usage = f'usage: {sys.argv[0]} [options] <source_dir> <target_dir>'
    parser = OptionParser(usage=usage)

    (options, args) = parser.parse_args()
    if len(args) < 2:
        parser.print_help()
        return -1

    source_dir = args[0]
    target_dir = args[1]
    print(f'update assets from {source_dir} to {target_dir}')

    generate_sprite_sheets_from_directories(source_dir, target_dir)
    copy_asset_files(source_dir, target_dir)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(e)
