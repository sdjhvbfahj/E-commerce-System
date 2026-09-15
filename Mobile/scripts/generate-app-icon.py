# -*- coding: utf-8 -*-
"""
621电商 · App 图标生成器
- 主视觉：品牌渐变底 + 白色「621」+ 两枚半透明高光圆（和假数据配图同一套语言）
- 输出：HBuilderX 打包所需的全部尺寸，放到 unpackage/res/icons/（HBuilderX 的默认图标目录）
- iOS 要求图标不含透明通道，所以统一存成 RGB 的 PNG
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = r'D:/The_Code/HTML/E-commerce_System/Mobile/unpackage/res/icons'
PREVIEW_DIR = r'C:/Users/赵国燕/AppData/Local/Temp/mob/icon-preview'
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(PREVIEW_DIR, exist_ok=True)

MASTER = 1024          # 最终主图尺寸
SS = 2                 # 超采样倍数（先生成 2048 再缩，边缘更顺）
N = MASTER * SS

FONT_PATH = r'C:/Windows/Fonts/arialbd.ttf'
CN_FONT_PATH = r'C:/Windows/Fonts/msyhbd.ttc'

# 品牌渐变（比页面上的 $brandGradient 略深一点，图标小尺寸下更立得住）
STOPS = [
    (0.00, (255, 154, 92)),    # #ff9a5c
    (0.45, (239, 95, 42)),     # #ef5f2a
    (1.00, (221, 63, 18)),     # #dd3f12
]


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient_color(t):
    t = min(max(t, 0.0), 1.0)
    for i in range(len(STOPS) - 1):
        p0, c0 = STOPS[i]
        p1, c1 = STOPS[i + 1]
        if p0 <= t <= p1:
            return lerp(c0, c1, (t - p0) / (p1 - p0))
    return STOPS[-1][1]


def build_background():
    """用一张 256x256 的小图算斜向渐变，再放大到 N（避免逐像素跑 400 万次）"""
    small = 256
    img = Image.new('RGB', (small, small))
    px = img.load()
    for y in range(small):
        for x in range(small):
            t = (x + y) / (2 * (small - 1))          # 135° 斜向
            px[x, y] = gradient_color(t)
    return img.resize((N, N), Image.BICUBIC)


def add_glow(img):
    """两枚半透明高光圆：和 mock 假图的视觉语言保持一致"""
    overlay = Image.new('RGBA', (N, N), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    r1 = round(N * 0.30)
    cx1, cy1 = round(N * 0.86), round(N * 0.14)
    d.ellipse((cx1 - r1, cy1 - r1, cx1 + r1, cy1 + r1), fill=(255, 255, 255, 26))
    r2 = round(N * 0.24)
    cx2, cy2 = round(N * 0.10), round(N * 0.92)
    d.ellipse((cx2 - r2, cy2 - r2, cx2 + r2, cy2 + r2), fill=(255, 255, 255, 20))
    return Image.alpha_composite(img.convert('RGBA'), overlay)


def draw_text(img, text='621', digit_height_ratio=0.42, tracking_ratio=0.02):
    """把数字排成一排：自己控制字距，比默认排版更紧凑、更「标」"""
    overlay = Image.new('RGBA', (N, N), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)

    target_h = N * digit_height_ratio
    size = 100
    font = ImageFont.truetype(FONT_PATH, size)
    bbox = font.getbbox(text)
    glyph_h = bbox[3] - bbox[1]
    size = max(10, round(size * target_h / glyph_h))
    font = ImageFont.truetype(FONT_PATH, size)

    widths = [font.getbbox(ch)[2] - font.getbbox(ch)[0] for ch in text]
    tracking = round(N * tracking_ratio)
    total_w = sum(widths) + tracking * (len(text) - 1)

    # 数字的视觉中心比文本框中心略高，这里手动校正
    bbox = font.getbbox(text)
    text_h = bbox[3] - bbox[1]
    x = (N - total_w) / 2
    y = (N - text_h) / 2 - bbox[1] - N * 0.012

    # 轻微投影，避免小尺寸下发糊
    shadow = Image.new('RGBA', (N, N), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sx = x
    for ch, w in zip(text, widths):
        sd.text((sx, y + round(N * 0.012)), ch, font=font, fill=(140, 40, 10, 70))
        sx += w + tracking
    img = Image.alpha_composite(img, shadow)

    for ch, w in zip(text, widths):
        d.text((x, y), ch, font=font, fill=(255, 255, 255, 255))
        x += w + tracking
    return Image.alpha_composite(img, overlay)


def build_master():
    img = build_background()
    img = add_glow(img)
    img = draw_text(img)
    return img.convert('RGB').resize((MASTER, MASTER), Image.LANCZOS)


def save(img, size, name=None):
    path = os.path.join(OUT_DIR, name or f'{size}x{size}.png')
    img.resize((size, size), Image.LANCZOS).convert('RGB').save(path, 'PNG', optimize=True)
    return path


master = build_master()

# Android（mdpi~xxxhdpi）+ iOS（含 iPad 各种槽位）+ 主图
SIZES = [20, 29, 40, 48, 58, 60, 72, 76, 80, 87, 96, 120, 144, 152, 167, 180, 192, 512, 1024]
for s in SIZES:
    save(master, s)
print('已生成尺寸:', SIZES)

# 额外：圆形版（应用商店宣传 / 公众号头像等场景用得上，不参与打包）
def save_round(size):
    img = master.resize((size, size), Image.LANCZOS).convert('RGBA')
    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    out = Image.new('RGB', (size, size), (255, 255, 255))
    out.paste(img, (0, 0), mask)
    out.save(os.path.join(OUT_DIR, f'round-{size}.png'), 'PNG')
    return os.path.join(OUT_DIR, f'round-{size}.png')


save_round(512)

# 预览图：把常用尺寸排一张，方便肉眼验收
def build_preview():
    """预览图：常用尺寸 + 圆角/圆形效果，都用中文字体标注"""
    cn = ImageFont.truetype(CN_FONT_PATH, 18)
    cn_small = ImageFont.truetype(CN_FONT_PATH, 15)

    W, H = 1120, 600
    canvas = Image.new('RGB', (W, H), (245, 246, 248))
    d = ImageDraw.Draw(canvas)
    d.text((40, 24), '621电商 · App 图标', fill=(35, 40, 56), font=ImageFont.truetype(CN_FONT_PATH, 24))
    d.text((40, 62), '主图 1024（云打包上传用）+ Android / iOS 常用尺寸', fill=(120, 126, 140), font=cn_small)

    # 主图
    canvas.paste(master.resize((240, 240), Image.LANCZOS), (40, 110))
    d.text((40, 362), '1024 x 1024（主图）', fill=(90, 96, 114), font=cn_small)

    # 缩小后的一排
    x = 320
    for s2, label in [(192, '192 xxxhdpi'), (144, '144 xxhdpi'), (120, '120 iOS'), (96, '96 xhdpi'), (72, '72 hdpi'), (48, '48 mdpi')]:
        y = 110 + (192 - s2) // 2
        canvas.paste(master.resize((s2, s2), Image.LANCZOS), (x, y))
        d.text((x, 320), label, fill=(120, 126, 140), font=cn_small)
        x += s2 + 20

    # 圆角 / 圆形
    r = 130
    icon = master.resize((r, r), Image.LANCZOS)
    mask = Image.new('L', (r, r), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, r - 1, r - 1), radius=int(r * 0.225), fill=255)
    tile = Image.new('RGB', (r, r), (245, 246, 248))
    tile.paste(icon, (0, 0), mask)
    canvas.paste(tile, (40, 420))
    d.text((40, 562), 'iOS 圆角（系统自动裁）', fill=(120, 126, 140), font=cn_small)

    cmask = Image.new('L', (r, r), 0)
    ImageDraw.Draw(cmask).ellipse((0, 0, r - 1, r - 1), fill=255)
    circle = Image.new('RGB', (r, r), (245, 246, 248))
    circle.paste(icon, (0, 0), cmask)
    canvas.paste(circle, (210, 420))
    d.text((210, 562), 'Android 圆形启动器效果', fill=(120, 126, 140), font=cn_small)

    path = os.path.join(PREVIEW_DIR, 'app-icon-preview.png')
    canvas.save(path)
    return path


print('预览图:', build_preview())
print('输出目录:', OUT_DIR)
print(sorted(os.listdir(OUT_DIR)))
