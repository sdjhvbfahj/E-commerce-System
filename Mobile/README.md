# 621 电商 · 移动端（uni-app）

用户端移动版原型，一套代码编译 **H5 / 微信小程序 / Android·iOS App**。数据、品牌、设计变量与
`../User`（PC 用户端）、`../Manage`（运营管理端）完全同源，方便三端对照演示。

- 技术栈：**uni-app（Vue 3 + Vite 5） + TypeScript + Pinia + Sass**
- 组件：**自研轻量组件**（`src/components/M*.vue`，easycom 自动注册），不引第三方 UI 库
- 设计基准：`750rpx`，设计变量见 `src/uni.scss`（uni-app 会全局注入，无需 import）
- 假数据：**完整复用 `User/src/mock`**，仅把存储层从 `localStorage` 换成 `uni.getStorageSync`，
  所以 H5 与 App 都能跑

> ⚠️ 关于组件库：需求里提到「uni-app + Element Plus」，但 Element Plus 是**桌面端**组件库
> （依赖原生 DOM，只有表格/弹窗这类 PC 交互件），uni-app 非 H5 端没有 DOM，无法加载；
> 即使在 H5 下，`<view>/<scroll-view>` 的标签体系也与 Element Plus 不兼容。
> 因此按架构文档 6.3.1 的选型（Vant / uview-plus 或自研轻量组件）改为**自研轻量组件**：
> 好处是配色、圆角、阴影全部沿用 `#ef5f2a` 品牌 token，风格和 PC 端一致，也不会有「套模板感」。

## 启动

```bash
npm install

npm run dev:h5          # H5 预览，默认 http://localhost:5176
npm run dev:app         # 生成 App 调试包（需配合 HBuilderX 真机运行）
npm run dev:mp-weixin   # 生成微信小程序包（用微信开发者工具导入 dist/dev/mp-weixin）
npm run build:h5        # H5 生产构建 → dist/build/h5
npm run build:app       # App 资源构建 → dist/build/app
npm run build:mp-weixin # 小程序生产构建 → dist/build/mp-weixin
npm run type-check      # vue-tsc 类型检查
```

### 跑微信小程序

1. `npm run dev:mp-weixin`（产物在 `dist/dev/mp-weixin`，会持续编译）
2. 打开**微信开发者工具** → 导入项目 → 目录选 `dist/dev/mp-weixin`
3. AppID 可选「测试号」（`src/manifest.json` 里的 `mp-weixin.appid` 留空即可）；
   要用自己的小程序就把它填上，并打开「不校验合法域名」（假数据不发请求，一般不需要）

> 用 HBuilderX 也可以：把项目当 CLI 工程打开 → 运行 → 运行到小程序模拟器 → 微信开发者工具。

#### 小程序端专门做过的三处适配

| 问题 | 原因 | 处理 |
|---|---|---|
| 图片位置一片白 | 假图是运行时生成的 SVG，`<image>` 只认 **base64** 形式的 data URI，URL 编码（`data:image/svg+xml;charset=utf-8,%3Csvg…`）在小程序里加载不出来 | `mock/utils/image.ts` 改成输出 `data:image/svg+xml;base64,…`，并自己实现了 UTF-8 → base64 编码（小程序没有 `btoa`） |
| 顶部导航栏压住内容 / 搜索框钻到胶囊底下 | 小程序右上角是原生胶囊按钮，导航栏高度不能按 H5/App 的 44px 写死 | `utils/nav.ts` 用 `uni.getMenuButtonBoundingClientRect()` 反推导航栏高度与右侧避让宽度（用 `#ifdef MP-WEIXIN` 条件编译，不影响 H5/App） |
| 吸底结算条被 tabBar 挡住 | —— | `bottom: var(--window-bottom, 0)`：小程序原生 tabBar 在 webview 之外，取 0 正好落在 tabBar 之上 |

### 真机 / 模拟器上跑 Android

1. `npm run build:app`（或 `npm run dev:app`）生成 `dist/build/app`
2. 打开 **HBuilderX** → 文件 → 导入 → 选择 `dist/build/app`
3. 手机开 USB 调试后「运行 → 运行到手机或模拟器 → 运行到 Android App 基座」
4. 要出安装包：看下面的「打包成 App」

> 目前 `manifest.json` 的 `appid` 是空的（H5 与调试基座不需要），
> **云打包前必须用 HBuilderX 生成一个 DCloud appid 填进去**
> （HBuilderX 打开 `src/manifest.json` → 基础配置 → AppID 右侧「重新获取」，需登录 DCloud 账号）。

## 打包成 App（HBuilderX）

### 1. 应用图标（已备好，不用再找图）

图标放在 **`unpackage/res/icons/`**，`src/manifest.json` 的 `app-plus.distribute.icons` 已配好全部槽位：

| 平台 | 尺寸 |
|---|---|
| Android | 48 / 72 / 96 / 144 / 192（mdpi ~ xxxhdpi） |
| iOS | 20 / 29 / 40 / 58 / 60 / 76 / 80 / 87 / 120 / 152 / 167 / 180 + App Store **1024** |

主视觉是**品牌渐变底 + 白色「621」**（和 App 内首页 logo、TabBar 同一套色），
已按 iOS 要求去掉透明通道，全部是 RGB PNG；另附 `round-512.png` 圆形版（只在需要圆形头像/宣传图时使用，不参与打包）。

改设计就重跑生成脚本（依赖 Pillow）：

```bash
python scripts/generate-app-icon.py     # 会重新生成全部尺寸 + 一张尺寸预览图
```

> HBuilderX 里也可以走可视化流程：打开 manifest.json → App图标配置 → 上传 1024 图标 → 「自动生成所有图标并替换」，
> 生成结果同样是写进 `unpackage/res/icons/`，和现在这套完全兼容。

### 2. 打包（两种方式都行）

**方式一：HBuilderX 直接打开项目（推荐）**

1. HBuilderX → 文件 → 打开目录 → 选 `Mobile`（CLI 工程，HBuilderX 会自动识别）
2. 菜单「发行 → 原生 App-云打包」
3. 勾选 Android（iOS 需苹果证书）；测试阶段 Android 可勾「使用 DCloud 老版证书」
4. 打包完成后下载 APK，装到手机上桌面图标就是新生成的图标

**方式二：CLI 构建 + HBuilderX 导入产物**

```bash
npm run build:app     # 构建后会自动把图标复制到 dist/build/app/unpackage/res/icons
```

HBuilderX → 导入 → 选 `dist/build/app` → 运行 / 发行。
（`scripts/copy-app-icons.mjs` 就是为这种方式准备的：CLI 产物目录下也必须有图标文件，
manifest 里 `unpackage/res/icons/...` 的相对路径才找得到。）

### 3. 还没做的

- **启动图（splash）**：现在用默认白屏。要自定义启动图（Anroid/iOS 各一套尺寸）说一声，我按规格生成。
- **iOS 打包**：需要苹果开发者证书（.p12 + .mobileprovision），这个得你自己准备。
- 小程序不需要这套图标（小程序头像/图标在微信公众平台里配）。


### ⚠️ 为什么依赖锁在 `3.0.0-5010420260703001`（HBuilderX 5.14 线）

真机/模拟器上运行会弹「**本应用使用 HBuilderX 5.24 或对应的 cli 版本编译，而手机端 SDK 版本是 5.14**」，
原因是**编译端 CLI 比设备上的运行基座（HBuilderX 自带 SDK）新**：

- 本机 HBuilderX 的实际版本是 **5.14**（安装目录名是旧的 `HBuilderX.5.07.2026041006`，
  但 `base/version.txt` 里写着 `hbuilderx_version=5.14`，Android 基座 `5.14.100385`）；
- 最初依赖是 5.24 线（`3.0.0-5020420260813003`），编译产物为 5.24，于是出现版本不匹配提示。

两种解法，本仓库采用第一种（不需要动 HBuilderX）：

| 方案 | 做法 | 说明 |
|---|---|---|
| **CLI 降到与设备基座同版本**（已采用） | 6 个 `@dcloudio/*` 依赖统一写 `3.0.0-5010420260703001` | 两条线的 peer 依赖完全一致（`vite@5.2.8`、`@dcloudio/types@3.4.31`），只需改版本号后 `npm install` 重新构建 |
| 升级 HBuilderX | 装 5.24+ 的 HBuilderX，让基座也变成 5.24 | 需重新下载安装，体积较大 |

> 这类提示本身只是「版本提醒」，点「忽略」也能跑（本项目未使用原生插件）；
> 但两边对齐后不会再弹，也更稳妥。


## 页面（MB-P01 ~ P12 + 2 个支撑页）

| 页面 ID | 名称 | 路径 | 主要交互 |
|---|---|---|---|
| MB-P01 | 首页 | `pages/home/index` | 搜索入口、金刚区分类、轮播、新鲜好物/人气推荐/分类楼层、猜你喜欢触底加载、下拉刷新 |
| MB-P02 | 分类 | `pages/category/index` | 左一级 + 右二级宫格与热门商品，左侧吸顶 |
| MB-P03 | 商品详情 | `pages/goods/index` | 图集、价格与折扣、服务标签、**底部规格弹层**（不可达组合置灰）、图文详情、参数、24h 热榜、底部操作栏（客服/购物车/加购/立即购买） |
| MB-P04 | 购物车 | `pages/cart/index` | 卡片列表、**左滑删除**、步进器、全选、底部结算条（未登录提示去登录） |
| MB-P05 | 结算 | `pages/checkout/index` | 地址卡片、商品清单、配送时间、支付方式、留言、金额明细、提交订单（防重复提交） |
| MB-P06 | 支付结果 | `pages/pay/result` | 成功/失败图标、金额、订单号、查订单/继续逛 |
| MB-P07 | 我的 | `pages/mine/index` | 用户信息头、订单九宫格（带角标数量）、地址/客服/重置演示数据、猜你喜欢 |
| MB-P08 | 订单列表 | `pages/order/list` | 状态页签、订单卡片、立即付款、再次购买、触底加载 |
| MB-P09 | 订单详情 | `pages/order/detail` | 状态头（待付款倒计时）、物流时间轴、收货信息、商品、金额、按状态显示操作 |
| MB-P10 | 地址编辑 | `pages/address/edit` | 表单 + `picker mode="region"` 省市区 + 标签 + 默认开关 |
| MB-P11 | 登录 | `pages/login/index` | 账号密码、显示密码、演示账号一键填入、登录回跳 |
| MB-P12 | 搜索 | `pages/search/index` | 搜索历史（本地存储）、热词、相关分类快捷入口、结果列表分页 |
| — | 商品列表 | `pages/goods/list` | 二级分类商品列表（支撑页）：兄弟分类切换、综合/销量/人气排序、触底加载 |
| — | 地址列表 | `pages/address/list` | 地址管理 + 从结算页进入时的「选择地址」模式（支撑页） |

TabBar 四项：首页 / 分类 / 购物车 / 我的（图标为自绘 PNG，选中态用主色 `#ef5f2a`）。

## 目录结构（与用户端命名保持一致）

```
Mobile/src
├── apis/        直接复用用户端的接口模块（home / category / subCategory / detail / cart / checkout / pay / order / user / search）
├── components/  MNavBar / MGoodsCard / MSectionHead / MCounter / MEmpty / MLoadMore / MSkuPopup
├── constants/   order.ts（订单状态文案 + 可执行操作，页面里不写魔法数字）
├── mock/        用户端整套假数据（data + handlers + client），存储层改为跨端 storage
├── pages/       14 个页面（见上表）
├── static/      tabbar 图标、通用小图标、logo/favicon
├── stores/      userStore（登录态，跨端持久化）/ cartStore（登录走后端购物车、未登录走本地）/ categoryStore
├── styles/      common.scss（全局基础样式与 .m-* 公共类）
├── utils/       storage（跨端存储）/ format（金额·日期·脱敏）/ auth（登录校验·Toast）/ nav / countdown
├── uni.scss     设计变量（颜色 / 圆角 / 字号 / 间距 / mixin），全局自动注入
├── pages.json   页面与 TabBar 配置（含 easycom：`^M(.*)` → `@/components/M$1.vue`）
├── manifest.json 应用配置（App 权限、H5 配置）
└── main.ts      uni-app Vue3 入口（createSSRApp + Pinia）
```

## 与用户端（PC）的差异

| 项 | PC 用户端 | 移动端 |
|---|---|---|
| 路由 | vue-router（`src/router`） | `pages.json` 页面路由 |
| 组件库 | Element Plus | 自研轻量组件（无第三方 UI 库） |
| 规格选择 | 页面内联 SKU 面板 | **底部弹出弹层** |
| 购物车 | 表格 + 底部结算条 | 卡片 + **左滑删除** + 底部结算条 |
| 订单 | 状态 Tab + 分页 | 状态 Tab + **触底加载** |
| 持久化 | `pinia-plugin-persistedstate` + localStorage | 自研 `utils/storage`（`uni.setStorageSync`） |
| 登录 | 账密 + 注册 | 账密（与 PC 一致，未接微信授权） |

## 演示说明

- 登录：**任意账号 + 6 位以上密码**即可（假接口不做真实校验），登录页有「快速体验」一键填入。
- 「我的 → 重置演示数据」：清空本地购物车/订单/登录态，回到初始状态。
- 假数据持久化 key：`eshop621-mock-db-v1`（购物车/地址/订单）、`eshop621-mobile-user`（登录态）、
  `eshop621-mobile-cart`（未登录时的本地购物车）。
- **未做的部分**（演示环境限制，需要后端支持）：微信一键登录 / 验证码登录、JSAPI 支付、
  分享卡片、扫码、取消订单、确认收货、评价；提交订单后的「支付」由假接口直接置为成功。
