// createRouter: 创建路由实例
// createWebHistory: 创建history模式的路由
import { createRouter, createWebHistory } from 'vue-router'

// 路由懒加载
const Layout = () => import('@/views/Layout/index.vue');
const Login = () => import('@/views/Login/index.vue');
const Home = () => import('@/views/Home/index.vue');
const Category = () => import('@/views/Category/index.vue');
const SubCategory = () => import('@/views/SubCategory/index.vue');
const Detail = () => import('@/views/Detail/index.vue');
const Cart = () => import('@/views/Cart/index.vue');
const Checkout = () => import('@/views/Checkout/index.vue');
const Pay = () => import('@/views/Pay/index.vue');
const PayBack = () => import('@/views/Pay/components/PayBack.vue');
const Member = () => import('@/views/Member/index.vue');
const MemberInfo = () => import('@/views/Member/components/MemberInfo.vue');
const MemberOrder = () => import('@/views/Member/components/MemberOrder.vue');
const MemberAddress = () => import('@/views/Member/components/MemberAddress.vue');
const Help = () => import('@/views/Help/index.vue');
const About = () => import('@/views/About/index.vue');
const AppDownload = () => import('@/views/AppDownload/index.vue');
const Brand = () => import('@/views/Brand/index.vue');
const Topic = () => import('@/views/Topic/index.vue');
const Register = () => import('@/views/Register/index.vue');
const NotFound = () => import('@/views/NotFound/index.vue');

const router = createRouter({
  history: createWebHistory(),
  // 配置path和component对应关系的位置
  routes: [
    // 首页页面路由
    {
      name: 'Layout',
      path: '/',
      component: Layout,
      children: [
        {
          name: 'Home',
          path: '',
          component: Home
        },
        // 分类商品页面
        {
          name: 'Category',
          path: 'category/:id',
          component: Category
        },
        // 二级分类商品页面
        {
          name: 'SubCategory',
          path: 'category/sub/:id',
          component: SubCategory
        },
        // 详情页
        {
          name: 'Detail',
          path: 'detail/:id',
          component: Detail
        },
        // 购物车页面
        {
          name: 'Cart',
          path: 'cart',
          component: Cart
        },
        // 支付页面
        {
          name: 'Checkout',
          path: 'checkout',
          component: Checkout
        },
        // 订单页面
        {
          name: 'Pay',
          path: 'pay/:id',
          component: Pay
        },
        // 订单支付完成页面
        {
          name: 'PayBack',
          path: 'paycallback',
          component: PayBack
        },
        // 会员中心页面
        {
          name: 'Member',
          path: 'member',
          component: Member,
          children: [
            // 直接访问 /member 时默认展示个人中心
            {
              path: '',
              redirect: { name: 'MemberInfo' }
            },
            // 个人信息页面
            {
              name: 'MemberInfo',
              path: 'memberInfo',
              component: MemberInfo,
            },
            // 个人订单页面
            {
              name: 'MemberOrder',
              path: 'memberOrder',
              component: MemberOrder,
            },
            // 地址管理页面
            {
              name: 'MemberAddress',
              path: 'memberAddress',
              component: MemberAddress,
            }
          ]
        },
        // 帮助中心
        {
          name: 'Help',
          path: 'help',
          component: Help
        },
        // 关于我们
        {
          name: 'About',
          path: 'about',
          component: About
        },
        // 手机版下载
        {
          name: 'AppDownload',
          path: 'app',
          component: AppDownload
        },
        // 品牌专区
        {
          name: 'Brand',
          path: 'brand',
          component: Brand
        },
        // 专题活动
        {
          name: 'Topic',
          path: 'topic',
          component: Topic
        },
        // 404（放在最后兜底，未匹配到的地址都会落到这里）
        {
          name: 'NotFound',
          path: ':pathMatch(.*)*',
          component: NotFound
        }
      ]
    },
    // 注册页面路由
    {
      name: 'Register',
      path: '/register',
      component: Register
    },
    // 登陆页面路由
    {
      name: 'Login',
      path: '/login',
      component: Login
    }
  ],
  // 定制路由滚动行为
  scrollBehavior() {
    return {
      // 每次路由跳转都会回到顶部
      top: 0
    }
  }
});

export default router
