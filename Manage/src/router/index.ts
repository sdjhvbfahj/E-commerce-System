// createRouter: 创建路由实例
// createWebHistory: 创建history模式的路由
import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore.ts'
import { usePermissionStore } from '@/stores/permissionStore.ts'

// 路由懒加载
const Layout = () => import('@/layout/index.vue')
const Login = () => import('@/views/Login/index.vue')
const Dashboard = () => import('@/views/Dashboard/index.vue')
const NotFound = () => import('@/views/NotFound/index.vue')
const Forbidden = () => import('@/views/Forbidden/index.vue')

const GoodsList = () => import('@/views/Goods/GoodsList.vue')
const GoodsEdit = () => import('@/views/Goods/GoodsEdit.vue')
const CategoryBrand = () => import('@/views/Goods/CategoryBrand.vue')

const StockList = () => import('@/views/Stock/StockList.vue')
const StockFlow = () => import('@/views/Stock/StockFlow.vue')

const OrderList = () => import('@/views/Order/OrderList.vue')
const OrderDetail = () => import('@/views/Order/OrderDetail.vue')
const RefundList = () => import('@/views/Order/RefundList.vue')

const CmsBanner = () => import('@/views/Cms/CmsBanner.vue')
const CmsRecommend = () => import('@/views/Cms/CmsRecommend.vue')

const MemberList = () => import('@/views/Member/MemberList.vue')

const AdminUser = () => import('@/views/Rbac/AdminUser.vue')
const RolePermission = () => import('@/views/Rbac/RolePermission.vue')
const OperationLog = () => import('@/views/Rbac/OperationLog.vue')

const router = createRouter({
  history: createWebHistory(),
  // 配置path和component对应关系的位置
  routes: [
    // 登录页（不需要登录态）
    {
      name: 'Login',
      path: '/login',
      component: Login,
      meta: { title: '登录' },
    },
    // 管理端主布局
    {
      name: 'Layout',
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        // 数据概览
        {
          name: 'Dashboard',
          path: 'dashboard',
          component: Dashboard,
          meta: { title: '数据概览', permission: 'dashboard:view' },
        },
        // 商品管理
        {
          name: 'GoodsList',
          path: 'goods/list',
          component: GoodsList,
          meta: { title: '商品列表', permission: 'goods:list', active: '/goods/list' },
        },
        {
          name: 'GoodsCreate',
          path: 'goods/edit',
          component: GoodsEdit,
          meta: { title: '新增商品', permission: 'goods:create', active: '/goods/list' },
        },
        {
          name: 'GoodsEdit',
          path: 'goods/edit/:id',
          component: GoodsEdit,
          meta: { title: '编辑商品', permission: 'goods:detail', active: '/goods/list' },
        },
        {
          name: 'CategoryBrand',
          path: 'goods/category',
          component: CategoryBrand,
          meta: { title: '分类与品牌', permission: 'category:update', active: '/goods/category' },
        },
        // 库存管理
        {
          name: 'StockList',
          path: 'stock/index',
          component: StockList,
          meta: { title: '库存管理', permission: 'stock:list', active: '/stock/index' },
        },
        {
          name: 'StockFlow',
          path: 'stock/flow',
          component: StockFlow,
          meta: { title: '库存流水', permission: 'stock:flow', active: '/stock/flow' },
        },
        // 订单中心
        {
          name: 'OrderList',
          path: 'order/list',
          component: OrderList,
          meta: { title: '订单列表', permission: 'order:list', active: '/order/list' },
        },
        {
          name: 'OrderDetail',
          path: 'order/detail/:id',
          component: OrderDetail,
          meta: { title: '订单详情', permission: 'order:detail', active: '/order/list' },
        },
        {
          name: 'RefundList',
          path: 'order/refund',
          component: RefundList,
          meta: { title: '退款管理', permission: 'refund:list', active: '/order/refund' },
        },
        // 内容运营
        {
          name: 'CmsBanner',
          path: 'cms/banner',
          component: CmsBanner,
          meta: { title: '轮播图管理', permission: 'cms:list', active: '/cms/banner' },
        },
        {
          name: 'CmsRecommend',
          path: 'cms/recommend',
          component: CmsRecommend,
          meta: { title: '推荐位与热榜', permission: 'cms:list', active: '/cms/recommend' },
        },
        // 会员中心
        {
          name: 'MemberList',
          path: 'member/list',
          component: MemberList,
          meta: { title: '会员列表', permission: 'member:list', active: '/member/list' },
        },
        // 权限中心
        {
          name: 'AdminUser',
          path: 'rbac/user',
          component: AdminUser,
          meta: { title: '账号管理', permission: 'admin:list', active: '/rbac/user' },
        },
        {
          name: 'RolePermission',
          path: 'rbac/role',
          component: RolePermission,
          meta: { title: '角色权限', permission: 'role:list', active: '/rbac/role' },
        },
        {
          name: 'OperationLog',
          path: 'rbac/log',
          component: OperationLog,
          meta: { title: '操作日志', permission: 'log:list', active: '/rbac/log' },
        },
      ],
    },
    // 无权限页面
    {
      name: 'Forbidden',
      path: '/403',
      component: Forbidden,
      meta: { title: '无权限' },
    },
    // 404（放在最后兜底）
    {
      name: 'NotFound',
      path: '/:pathMatch(.*)*',
      component: NotFound,
      meta: { title: '页面不存在' },
    },
  ],
});

// 全局前置守卫：登录态 + 菜单权限
router.beforeEach((to) => {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  // 登录后按「账号 + 权限码」签名生成左侧菜单；签名变了（换账号登录、权限变更）就重建，
  // 避免 A 账号退出后 B 账号登录还看到 A 的菜单
  const menuKey = userStore.isLogin
    ? `${userStore.adminInfo.username}:${[...userStore.permissions].sort().join(',')}`
    : '';
  if (userStore.isLogin && permissionStore.menusKey !== menuKey) {
    permissionStore.buildMenus(userStore.permissions);
    permissionStore.menusKey = menuKey;
  }

  // 已登录访问登录页 -> 直接回概览
  if (to.name === 'Login' && userStore.isLogin) {
    return { path: '/dashboard' };
  }

  // 未登录 -> 一律去登录页（记录来路，登录后跳回）
  if (to.name !== 'Login' && !userStore.isLogin) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }

  // 已登录但越权访问 -> 403 提示
  const permission = to.meta.permission as string | undefined;
  if (permission && !userStore.hasPermission(permission)) {
    ElMessage({ message: `没有「${to.meta.title}」的访问权限，请联系管理员`, type: 'warning' });
    return { path: '/403' };
  }

  return true;
});

// 路由后置守卫：更新页面标题
router.afterEach((to) => {
  const title = (to.meta.title as string) || '';
  document.title = title ? `${title} · 621电商运营管理端` : '621电商运营管理端';
});

export default router;
