/*
 * @Author: your name
 * @Date: 2021-03-05 16:36:31
 * @LastEditTime: 2021-11-30 10:31:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /blogreact/src/router/router.tsx
 */

import App from "../views/App/App";
import Layout from "../views/Layout";
import Login from "../views/login";
import DictData from "views/system/dict/data";
import AuthUser from "views/system/role/authUser";
import UserProfile from "views/system/profile";
import JobLog from "views/monitor/job/jobLog";

/**
 * @description: 一级路由
 * @param {*}
 * @return {*}
 */
const routers = [
  {
    path: "/login",
    exact: false,
    component: Login,
  },
  {
    path: "/",
    exact: false,
    component: App,
  },
  // {
  //   path:'/Details',
  //   exact: false,// 严格匹配
  //   component: Details
  // },
  // {
  //   path:'/Messages',
  //   exact: false,
  //   component: Messages
  // },
  // {
  //   path:'/Resumes',
  //   exact: false,
  //   component: Resumes
  // },
  // {
  //   path: '',
  //   exact: false,
  //   component: NoMatch
  // }
];
/**
 * @description: 二级路由
 * @param {*}
 * @return {*}
 */
const subRouters = [
  {
    path: "/index/layout",
    exact: true,
    meta: {
      title: "首页",
    },
    component: Layout,
  },
  {
    path: "/system/dict-data/:id",
    meta: {
      title: "字典数据",
    },
    exact: true,
    component: DictData,
  },
  {
    path: "/system/role-auth/:id",
    meta: {
      title: "分配用户",
    },
    exact: true,
    component: AuthUser,
  },
  {
    path: "/user/profile",
    meta: {
      title: "个人中心",
    },
    exact: true,
    component: UserProfile,
  },
  {
    path: "/monitor/job-log",
    meta: {
      title: "调度日志",
    },
    exact: true,
    component: JobLog,
  },
];

/**
 * @description: 导出obj
 * @param {*}
 * @return {*}
 */
const obj = {
  routers,
  subRouters,
};
export default obj;
