import sys
import urllib.request
import os
from PIL import Image, ImageDraw

def generate_icons(url):
    logo_path = 'public/app_logo_dynamic.png'
    try:
        urllib.request.urlretrieve(url, logo_path)
        img = Image.open(logo_path).convert('RGBA')
        img.save('public/image copy 3.png')

        res_dir = 'android/app/src/main/res'
        sizes = {
            'mipmap-mdpi': (48, 108),
            'mipmap-hdpi': (72, 162),
            'mipmap-xhdpi': (96, 216),
            'mipmap-xxhdpi': (144, 324),
            'mipmap-xxxhdpi': (192, 432)
        }

        for folder, (size, fg_size) in sizes.items():
            target_folder = os.path.join(res_dir, folder)
            os.makedirs(target_folder, exist_ok=True)
            
            # 1. Square/rounded ic_launcher.png
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            resized.save(os.path.join(target_folder, 'ic_launcher.png'), 'PNG')
            
            # 2. Round icon ic_launcher_round.png
            mask = Image.new('L', (size, size), 0)
            draw = ImageDraw.Draw(mask)
            draw.ellipse((0, 0, size, size), fill=255)
            round_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
            round_img.paste(resized, (0, 0), mask=mask)
            round_img.save(os.path.join(target_folder, 'ic_launcher_round.png'), 'PNG')
            
            # 3. Adaptive Foreground ic_launcher_foreground.png
            fg_canvas = Image.new('RGBA', (fg_size, fg_size), (0, 0, 0, 0))
            inner_size = int(fg_size * 0.72)
            inner_img = img.resize((inner_size, inner_size), Image.Resampling.LANCZOS)
            offset = (fg_size - inner_size) // 2
            fg_canvas.paste(inner_img, (offset, offset))
            fg_canvas.save(os.path.join(target_folder, 'ic_launcher_foreground.png'), 'PNG')

        print('[Branding Sync] Successfully updated all Android launcher icons!')
    except Exception as e:
        print('[Branding Sync] Error updating icons:', e)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        generate_icons(sys.argv[1])
    else:
        print('No logo URL provided')
