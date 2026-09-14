# 真实商品图片

这里放的是**少数重点商品**的真实照片，其余商品仍然使用 `src/mock/utils/image.ts` 现场生成的
离线 SVG 假图。两者在页面上混用，所以只有这几个商品「看起来像真的」。

## 图片清单

| 文件 | 用在哪个商品 | 原始尺寸 | 授权 |
| --- | --- | --- | --- |
| `cherries.jpg` | 智利进口车厘子2斤 | 960×901 | Public domain |
| `tshirt.jpg` | 纯棉基础款圆领T恤 | 960×1280 | CC BY-SA 4.0 |
| `earbuds.jpg` | 真无线蓝牙耳机 | 960×960 | CC BY 2.0 |
| `headphones.jpg` | 头戴式降噪耳机 | 1280×853 | CC BY-SA 3.0 |
| `pan-nonstick.jpg` | 麦饭石不粘炒锅 | 960×960 | CC BY-SA 4.0 |
| `tableware.jpg` | 日式陶瓷餐具套装 | 960×720 | CC BY-SA 4.0 |
| `yoga-mat.jpg` | 加厚防滑瑜伽垫 | 960×1430 | CC BY 4.0 |

- 全部来自 **Wikimedia Commons**（可自由使用，署名信息见 `ATTRIBUTION.json`）
- 下载后统一**居中裁成正方形**（800×800，JPEG 质量 82），因为页面里的图片容器都是定宽定高的正方形，
  不裁的话照片会被拉伸变形
- 授权信息由脚本从 Commons API 自动抓取，写在 `ATTRIBUTION.json` 里

## 怎么换成自己的图片

1. 把新图片丢进这个目录（建议先裁成正方形）；
2. 打开 `src/mock/data/products.ts`，改这一处映射即可：

```ts
const REAL_PICTURES: Record<string, string> = {
    '智利进口车厘子2斤': cherriesPhoto,
    '纯棉基础款圆领T恤': tshirtPhoto,
    // 在这里加：'商品名': 你的图片变量（记得在文件顶部 import）
};
```

也可以直接把值改成网络图片地址或 `/public` 下的路径，不必是 `import` 进来的文件。

## 备注

- `earbuds.jpg` 是 Google Pixel Buds 实拍图，盒子上能看到品牌 logo。如果是正式对外展示，
  建议换成没有品牌露出、或者你自己拍的商品图。
