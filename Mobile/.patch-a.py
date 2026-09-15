import io

def patch(path, pairs):
    p = 'D:/The_Code/HTML/E-commerce_System/Mobile/src/' + path
    s = io.open(p, encoding='utf-8').read()
    for old, new in pairs:
        if old not in s:
            raise SystemExit(f'  !! 未匹配 {path}: {old[:80]!r}')
        s = s.replace(old, new, 1)
    io.open(p, 'w', encoding='utf-8').write(s)
    print('patched', path)


# ==========================================================================
# 1) 圆角整体收小（用户要求：能不要就不要，要也只留一点点）
#    只动「卡片 / 图片 / 方块」这类容器；按钮和搜索框仍是胶囊（那是有意为之的形态）
# ==========================================================================
patch('uni.scss', [
    ('''// ---------- 圆角 / 阴影 ----------
$radiusXs: 8rpx;
$radiusSm: 12rpx;
$radiusMd: 20rpx;
$radiusLg: 28rpx;''',
     '''// ---------- 圆角 / 阴影 ----------
// 2026-09-15：整体改成「几乎没有圆角」的硬朗风格，只保留一点点过渡
$radiusXs: 4rpx;
$radiusSm: 6rpx;
$radiusMd: 8rpx;
$radiusLg: 12rpx;'''),
])

# ==========================================================================
# 2) 公共类：新增「小圆点 + 名称 + 小圆点 + 长横线」的装饰标题
# ==========================================================================
patch('styles/common.scss', [
    ('''// ---------- 分组标题 ----------
.m-title {
    @include section-title;
}''',
     '''// ---------- 分组标题 ----------
.m-title {
    @include section-title;
}

// ---------- 装饰标题：• 名称 • ——————（分类页 / 购物车页共用） ----------
.m-deco {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.m-deco__dot {
    width: 10rpx;
    height: 10rpx;
    border-radius: 50%;
    background: $brandColor;
    flex-shrink: 0;
}

.m-deco__name {
    font-size: $fsMd;
    font-weight: 600;
    color: $inkColor;
    flex-shrink: 0;
    letter-spacing: 1rpx;
}

.m-deco__line {
    flex: 1;
    min-width: 40rpx;
    height: 2rpx;
    margin-left: 8rpx;
    background: $lineColor;
}

// ---------- 回到顶部（首页右下角悬浮按钮） ----------
.m-backtop {
    position: fixed;
    right: $pagePadding;
    bottom: calc(var(--window-bottom, 0px) + 40rpx);
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 6rpx 20rpx rgba(35, 40, 56, 0.16);
}

.m-backtop__arrow {
    width: 22rpx;
    height: 22rpx;
    border-top: 4rpx solid $inkColor2;
    border-left: 4rpx solid $inkColor2;
    transform: rotate(45deg) translate(3rpx, 3rpx);
}'''),
])

# ==========================================================================
# 3) MCounter：修「减不掉的那个 1」——加号那一竖因为父级没有 position:relative，
#    绝对定位跑到了整张卡片中间（细竖线看起来就像数字 1，还压住数量）
# ==========================================================================
patch('components/MCounter.vue', [
    ('''    .m-counter__btn {
        width: 60rpx;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;''',
     '''    .m-counter__btn {
        /* 必须定位：里面的加号竖线是绝对定位的，父级不定位就会跑到卡片中间去 */
        position: relative;
        width: 60rpx;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;'''),
])

# ==========================================================================
# 4) 商品卡：名称固定两行高、价格不挤掉销量、圆角收小
# ==========================================================================
patch('components/MGoodsCard.vue', [
    ('''    .g-card__name {
        font-size: $fsBase;
        line-height: 1.4;
        color: $inkColor;
        max-height: 76rpx;
    }''',
     '''    .g-card__name {
        display: flex;
        align-items: flex-start;
        font-size: $fsBase;
        line-height: 1.4;
        color: $inkColor;
        /* 固定两行高度：名称一行/两行的卡片高度才会一致 */
        height: 76rpx;
        overflow: hidden;
    }'''),
    ('''    .g-card__foot {
        margin-top: $gapSm;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: $gapSm;
    }''',
     '''    .g-card__foot {
        margin-top: $gapSm;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8rpx;
        /* 单行内解决：价格过长自己省略，销量永远留在右下角 */
        overflow: hidden;
    }

    .g-card__price {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }'''),
    ('''    .g-card__sales {
        color: $inkColor3;
        font-size: $fsXs;
        flex-shrink: 0;
    }''',
     '''    .g-card__sales {
        color: $inkColor3;
        font-size: $fsXs;
        flex-shrink: 0;
        white-space: nowrap;
    }'''),
    ('''                <text class="m-price">
                    <text class="m-price__symbol">¥</text>
                    <text class="m-price__num">{{ item.price }}</text>
                </text>''',
     '''                <text class="m-price g-card__price">
                    <text class="m-price__symbol">¥</text>
                    <text class="m-price__num">{{ item.price }}</text>
                </text>'''),
    # 横向卡片里的图片也收一下圆角
    ('''            .g-card__pic {
                width: 200rpx;
                height: 200rpx;
                border-radius: $radiusSm;''',
     '''            .g-card__pic {
                width: 200rpx;
                height: 200rpx;
                border-radius: $radiusXs;'''),
])

print('基础改动完成')
