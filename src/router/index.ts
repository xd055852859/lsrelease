import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login.vue"),
    children: [],
  },
  {
    path: "/:codeName",
    name: "home",
    component: () => import("@/views/home.vue"),
    children: [
      {
        path: "computer",
        name: "computer",
        component: () => import("@/views/computer/index.vue"),
        redirect: { name: "computerhome" },
        children: [
          {
            path: "home",
            name: "computerhome",
            component: () => import("@/views/computer/home.vue"),
            children: [],
          },
          {
            path: "invest",
            name: "computerinvest",
            component: () => import("@/views/computer/invest/index.vue"),
            children: [],
            meta: {
              keepAlive: true,
            },
          },
          {
            path: "investForm/:investKey?",
            name: "computerinvestForm",
            component: () => import("@/views/computer/invest/form.vue"),
            children: [],
            props: true,
          },
          {
            path: "investInfo/:investKey",
            name: "computerinvestInfo",
            component: () => import("@/views/computer/invest/info.vue"),
            children: [],
            props: true,
          },
          {
            path: "product",
            name: "computerproduct",
            component: () => import("@/views/computer/product/index.vue"),
            children: [],
            meta: {
              keepAlive: true,
            },
          },
          {
            path: "productForm/:productKey?",
            name: "computerproductForm",
            component: () => import("@/views/computer/product/form.vue"),
            children: [],
            props: true,
          },
          {
            path: "productInfo/:productKey",
            name: "computerproductInfo",
            component: () => import("@/views/computer/product/info.vue"),
            children: [],
            props: true,
          },
          {
            path: "news",
            name: "computernews",
            component: () => import("@/views/computer/news/index.vue"),
            children: [],
            meta: {
              keepAlive: true,
            },
          },
          {
            path: "policy",
            name: "computerpolicy",
            component: () => import("@/views/computer/policy/index.vue"),
            children: [],
            meta: {
              keepAlive: true,
            },
          },
          {
            path: "newsInfo/:newsKey",
            name: "computernewsInfo",
            component: () => import("@/views/computer/news/info.vue"),
            children: [],
            props: true,
          },
          {
            path: "userCenter",
            name: "computeruserCenter",
            component: () => import("@/views/computer/userCenter.vue"),
            children: [],
            meta: {
              keepAlive: true,
            },
          },
        ],
      },
      {
        path: "phone",
        name: "phone",
        component: () => import("@/views/phone/index.vue"),
        redirect: { name: "phonehome" },
        children: [   {
          path: "home",
          name: "phonehome",
          component: () => import("@/views/phone/home.vue"),
          children: [],
        },
        {
          path: "invest",
          name: "phoneinvest",
          component: () => import("@/views/phone/invest/index.vue"),
          children: [],
          meta: {
            keepAlive: true,
          },
        },
        {
          path: "investForm/:investKey?",
          name: "phoneinvestForm",
          component: () => import("@/views/phone/invest/form.vue"),
          children: [],
          props: true,
        },
        {
          path: "investInfo/:investKey",
          name: "phoneinvestInfo",
          component: () => import("@/views/phone/invest/info.vue"),
          children: [],
          props: true,
        },
        {
          path: "product",
          name: "phoneproduct",
          component: () => import("@/views/phone/product/index.vue"),
          children: [],
          meta: {
            keepAlive: true,
          },
        },
        {
          path: "productForm/:productKey?",
          name: "phoneproductForm",
          component: () => import("@/views/phone/product/form.vue"),
          children: [],
          props: true,
        },
        {
          path: "productInfo/:productKey",
          name: "phoneproductInfo",
          component: () => import("@/views/phone/product/info.vue"),
          children: [],
          props: true,
        },
        {
          path: "news",
          name: "phonenews",
          component: () => import("@/views/phone/news/index.vue"),
          children: [],
          meta: {
            keepAlive: true,
          },
        },
        {
          path: "policy",
          name: "phonepolicy",
          component: () => import("@/views/phone/policy/index.vue"),
          children: [],
          meta: {
            keepAlive: true,
          },
        },
        {
          path: "newsInfo/:newsKey",
          name: "phonenewsInfo",
          component: () => import("@/views/phone/news/info.vue"),
          children: [],
          props: true,
        },
        {
          path: "userCenter",
          name: "phoneuserCenter",
          component: () => import("@/views/phone/userCenter.vue"),
          children: [],
          meta: {
            keepAlive: true,
          },
        },],
      },
    ],
    props: true,
  },
  // {
  //   path: "/phone",
  //   name: "phone",
  //   component: () => import("@/views/phone/home.vue"),
  //   redirect: "/phone/resource",
  //   children: [
  //     {
  //       path: "news",
  //       name: "phoneNews",
  //       component: () => import("@/views/phone/news.vue"),
  //       children: [],
  //     },
  //     {
  //       path: "circle",
  //       name: "phoneCircle",
  //       component: () => import("@/views/phone/circle.vue"),
  //       children: [],
  //     },
  //     {
  //       path: "resource",
  //       name: "phoneResource",
  //       component: () => import("@/views/phone/resource.vue"),
  //       children: [],
  //     },
  //     {
  //       path: "environment",
  //       name: "phoneEnvironment",
  //       component: () => import("@/views/phone/environment.vue"),
  //       children: [],
  //     },
  //     {
  //       path: "userCenter",
  //       name: "phoneUserCenter",
  //       component: () => import("@/views/phone/userCenter.vue"),
  //       children: [],
  //     },
  //     {
  //       path: "resourceList/:id",
  //       name: "phoneResourceList",
  //       component: () => import("@/views/phone/resourceList.vue"),
  //       children: [],
  //     },
  //   ],
  // },

  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test.vue"),
    children: [],
  },
];
const routerHistory = createWebHistory();
const router = createRouter({
  history: routerHistory,
  routes,
});
//全局前置守卫
// 全局导航守卫
export default router;
