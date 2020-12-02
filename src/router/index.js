import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
// 修改title
function changeTitle(title) {
  document.title = title;
}
const routes = [
  {
    path: '/',
    alias: '/login_guide',
    name: 'login_guide',
    meta: {
      title: '引导页',
    },
    component: () =>
      import(/* webpackChunkName: "login_pack" */ '../views/login/guide.vue'),
  },
  {
    path: '/login_guide',
    name: 'login_guide',
    meta: {
      title: '引导页',
    },
    component: () =>
      import(/* webpackChunkName: "login_pack" */ '../views/login/guide.vue'),
  },
  {
    path: '/login_login',
    name: 'login_login',
    meta: {
      title: '登录',
    },
    component: () =>
      import(/* webpackChunkName: "login_pack" */ '../views/login/login.vue'),
  },
  {
    path: '/login_register',
    name: 'login_register',
    meta: {
      title: '注册',
    },
    component: () =>
      import(
        /* webpackChunkName: "login_pack" */ '../views/login/register.vue'
      ),
  },
  {
    path: '/login_findPassword',
    name: 'login_findPassword',
    meta: {
      title: '找回密码',
    },
    component: () =>
      import(
        /* webpackChunkName: "login_pack" */ '../views/login/findPassword.vue'
      ),
  },
  {
    path: '/certif_step1',
    name: 'certif_step1',
    meta: {
      title: '认证中心',
    },
    component: () =>
      import(/* webpackChunkName: "certif_pack" */ '../views/certif/step1.vue'),
  },
  {
    path: '/certif_step2',
    name: 'certif_step2',
    meta: {
      title: '认证中心',
    },
    component: () =>
      import(/* webpackChunkName: "certif_pack" */ '../views/certif/step2.vue'),
  },
  {
    path: '/certif_bank',
    name: 'certif_bank',
    meta: {
      title: '认证中心',
    },
    component: () =>
      import(/* webpackChunkName: "certif_pack" */ '../views/certif/bank.vue'),
  },
  {
    path: '/payback_list',
    name: 'payback_list',
    meta: {
      title: '认证中心',
    },
    component: () =>
      import(
        /* webpackChunkName: "payback_pack" */ '../views/payback/list.vue'
      ),
  },
  {
    path: '/home',
    name: 'homePage',
    meta: {
      title: '账无忧',
    },
    component: () =>
      import(/* webpackChunkName: "bebt_home" */ '../views/home/index.vue'),
  },
  {
    path: '/person_info',
    name: 'personInfoPage',
    meta: {
      title: '个人中心',
    },
    component: () =>
      import(
        /* webpackChunkName: "person_info" */ '../views/personInfo/index.vue'
      ),
  },
  // {
  //   path: '/',
  //   alias: '/register',
  //   name: 'register',
  //   meta: {
  //     title: '登录',
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "register" */ '../views/Register.vue'),
  // },
  // {
  //   path: '/home',
  //   name: 'home',
  //   meta: {
  //     title: '债惠',
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "debt_list" */ '../views/Home.vue'),
  // },
  // {
  //   path: '/debt_detail',
  //   name: 'debt_detail',
  //   meta: {
  //     title: '负债详情',
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "debt_list" */ '../views/DebtDetail.vue'),
  // },
  // {
  //   path: '/add_new_debt',
  //   name: 'add_new_debt',
  //   meta: {
  //     title: '添加负债信息',
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "new_debt" */ '../views/AddDebt.vue'),
  // },
  // {
  //   path: '/upload_debt_pic',
  //   name: 'upload_debt_pic',
  //   meta: {
  //     title: '上传合同照片',
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "new_debt" */ '../views/AddDebtPic.vue'),
  // },
  // {
  //   path: '/personal_info',
  //   name: 'personal_info',
  //   meta: {
  //     title: '个人信息',
  //     // keepAlive: true,
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "person_info" */ '../views/PersonalInfo.vue'),
  // },
  // {
  //   path: '/personal_certify',
  //   name: 'personal_certify',
  //   meta: {
  //     title: '实名认证',
  //     // keepAlive: true,
  //   },
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "person_info" */ '../views/PersonalCertify.vue'
  //     ),
  // },
  // {
  //   path: '/agreement1',
  //   name: 'agreement1',
  //   meta: {
  //     title: '用户协议',
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "agreement" */ '../views/Agreement1.vue'),
  // },
  // {
  //   path: '/agreement2',
  //   name: 'agreement2',
  //   meta: {
  //     title: '隐私协议',
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "agreement" */ '../views/Agreement2.vue'),
  // },
  // {
  //   path: '/agreement3',
  //   name: 'agreement3',
  //   meta: {
  //     title: '服务委托协议书',
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "agreement3" */ '../views/Agreement3.vue'),
  // },
  // {
  //   path: '/success',
  //   name: 'success',
  //   meta: {
  //     title: '提交成功',
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "success" */ '../views/Success.vue'),
  // },
  {
    path: '*',
    name: 'register',
    meta: {
      title: '登录',
    },
    component: () =>
      import(/* webpackChunkName: "register" */ '../views/Register.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});
router.beforeEach((to, from, next) => {
  // 路由变化，修改title
  const { meta } = to;
  if (meta && meta.title) {
    changeTitle(meta.title);
  }
  next();
});
export default router;
