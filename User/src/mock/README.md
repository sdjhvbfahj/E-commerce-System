# `src/mock` — 假数据层

> 这个目录把整个用户端 Demo 的「后端」全部接管了。**不需要启动任何服务、不依赖任何外网接口**，
> `npm run dev` 起来就是一套完整可点的电商站点（界面参考黑马「小兔鲜儿」课程项目，品牌与配色已整体替换为 621 电商）。

## 一、怎么用

`src/apis/*.ts` 里的所有接口函数已经把请求发到这里：

```ts
// src/apis/home.ts
import httpInstance from '@/mock'          // ← 原来是 '@/utils/http'

export function getBannerAPI(distributionSite = '1') {
  return httpInstance({ url: '/home/banner', method: 'GET', params: { distributionSite } })
}
```

调用方式和以前一模一样，返回的也是 `{ result: ... }`，所以 **页面 / store / composables 一行都不用改**。

## 二、目录结构

```
src/mock/
├── index.ts            出口：默认导出假请求器（等价于 axios 实例），以及 mockPay / resetDb
├── client.ts           请求器实现：路由匹配 → 模拟延迟 → 执行处理器 → 返回 { result }
├── routes.ts           路由表：把 method + 路径 映射到处理器（静态路径优先）
├── db.ts               有状态的「服务端」：购物车 / 地址 / 订单（自动持久化到 localStorage）
├── types.ts            公共类型 + 业务错误工具（fail / isMockError）
├── utils/
│   ├── image.ts        离线假图生成器（内联 SVG，永不裂图）
│   └── helper.ts       延迟、分页、金额、稳定洗牌等小工具
├── data/               纯数据（无副作用，除了 products 在加载时构建一次）
│   ├── catalog.ts      商品原始表：10 个一级分类 / 23 个二级分类 / 138 件商品
│   ├── ids.ts          分类、商品 id 的统一规则
│   ├── products.ts     由 catalog 自动补全出图片、SKU、详情、销量等
│   ├── categories.ts   导航分类、分类页、二级分类筛选与分页列表
│   ├── home.ts         首页新鲜好物、人气推荐、商品楼层
│   ├── banners.ts      首页 / 分类页轮播图
│   ├── pages.ts        帮助中心 / 关于我们 / 品牌专区 / 专题活动
│   └── seed.ts         用户信息、收货地址、历史订单的初始数据
└── handlers/           接口处理器（一个文件对应一组业务）
    ├── goods.ts        首页 / 分类 / 商品详情
    ├── member.ts       购物车 / 地址 / 订单 / 假支付
    ├── page.ts         帮助中心 / 关于我们 / 品牌专区 / 专题活动
    └── user.ts         登录 / 注册
```

## 三、假数据是怎么来的

`data/catalog.ts` 里只维护最核心的三样东西：**分类名、商品名 + 价格、一句卖点**。
其余全部自动生成，所以数据量大、页面饱满，但源码依然好读：

| 自动生成 | 说明 |
| --- | --- |
| 商品主图 / 详情长图 | `utils/image.ts` 现场画内联 SVG（渐变 + 商品名），完全离线；**少数重点商品用真实照片**，见下 |
| 规格与 SKU | 按分类的规格模板做笛卡尔积，例如服饰 = 颜色 3 种 × 尺码 4 种 = 12 个 SKU |
| 缺货 SKU | 每个 SKU ≥ 4 的商品会留一个 `inventory: 0`，用来演示详情页规格的**禁用态** |
| 品牌 | 每个一级分类对应一个品牌（品牌名 / 英文名 / logo / 一句话介绍） |
| 销量、评价数、上架时间 | 稳定伪随机（同一件商品每次刷新数值一致），用于三种排序 |

### 真实图片

大部分商品用生成的 SVG 假图，**少数重点商品用真实照片**（放在 `src/assets/images/goods/`，
来源与授权见该目录的 `README.md` / `ATTRIBUTION.json`）。
映射关系在 `data/products.ts` 的 `REAL_PICTURES` 里，加一行「商品名 → 图片」即可增删：

```ts
const REAL_PICTURES: Record<string, string> = {
    '智利进口车厘子2斤': cherriesPhoto,
    '纯棉基础款圆领T恤': tshirtPhoto,
    // ...
};
```

有真实照片的商品，`picture` 和 `mainPictures[0]` 用照片，其余多图仍然是生成的假图。

## 四、有状态的接口

购物车、地址、订单是「会变的」，所以在 `db.ts` 里维护了一份内存数据，并同步写入
`localStorage`（key：`xtx-mock-db-v1`）。**刷新页面数据不丢**。

- 加入 / 删除 / 改数量 / 改选中 → 都会真的改到这份数据上
- 提交订单 → 生成一笔新订单，并把下单的商品从购物车移除
- 支付页点「支付宝」→ 调用 `POST /member/order/:id/pay` 模拟回调，订单变成「待发货」

想恢复演示数据，在浏览器控制台执行：

```js
__resetMockDb()
```

## 五、接口清单

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/home/banner` | 轮播图（`distributionSite=1` 首页 / `2` 分类页） |
| GET | `/home/new` | 新鲜好物（4 件） |
| GET | `/home/hot` | 人气推荐（4 件） |
| GET | `/home/goods` | 首页商品楼层（5 个楼层，每层 8 件商品） |
| GET | `/home/category/head` | 左侧导航分类（10 个一级分类 + 弹层推荐） |
| GET | `/category` | 分类页（一级分类下的二级分类及推荐商品） |
| GET | `/category/sub/filter` | 二级分类筛选/面包屑数据 |
| POST | `/category/goods/temporary` | 二级分类商品列表（支持三种排序 + 分页） |
| GET | `/goods` | 商品详情（含 `specs` / `skus`，支持 SKU 联动） |
| GET | `/goods/hot` | 热销榜（`type=1` 24 小时榜 / `2` 周榜） |
| GET | `/goods/relevant` | 猜你喜欢 |
| POST | `/login` | 登录（任意账号，密码 ≥ 6 位） |
| POST | `/register` | 注册（同样不校验，返回 `isNewUser: true`） |
| GET/POST/DELETE | `/member/cart` | 购物车列表 / 加入 / 删除 |
| POST | `/member/cart/merge` | 合并购物车 |
| PUT | `/member/cart/selected` | 全选 / 取消全选 |
| PUT | `/member/cart/:skuId` | 修改单个商品的数量与选中态 |
| GET | `/member/order/pre` | 结算页数据（地址 + 已选商品 + 金额明细） |
| GET/POST | `/member/order` | 订单列表 / 提交订单 |
| GET | `/member/order/:id` | 订单详情 |
| POST | `/member/order/:id/pay` | **（假接口）** 模拟支付回调 |
| GET | `/member/address` | 收货地址列表（会员中心 - 地址管理） |
| POST/PUT/DELETE | `/member/address(/:id)` | 新增 / 修改 / 删除收货地址 |
| GET | `/help` | 帮助中心（6 个栏目 + 问答 + 友情链接） |
| GET | `/about` | 关于我们（品牌故事 / 数据 / 价值观 / 发展历程） |
| GET | `/brand` | 品牌专区（10 个品牌 + 代表商品） |
| GET | `/topic` | 专题活动（6 个专题 + 商品） |

> `/help`、`/about`、`/brand`、`/topic`、`/member/address`、`/register` 这 6 个是**本项目自拟的接口**，
> 原项目里对应的页面是死链（footer 和顶栏上点不动），补齐后整站就没有死链了。

## 六、想换回真实接口怎么办

1. 把 `src/apis/*.ts` 里的 `import httpInstance from '@/mock'` 改回自己的请求实例；
2. 或者只改 `src/mock/client.ts`，让 `mockRequest` 内部转发到真实 axios 实例。

页面代码、数据结构、字段名都是按真实接口对齐的，切换成本很低。

> 小提示：`index.html` 里的 iconfont 字体是外链，离线时图标会退化成文字，不影响功能。
