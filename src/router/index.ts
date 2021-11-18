/*
 * @Author: your name
 * @Date: 2021-03-05 16:36:31
 * @LastEditTime: 2021-11-18 16:31:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /blogreact/src/router/router.tsx
 */

import App from "../views/App/App";
import Layout from "../views/Layout";
import Login from "../views/login";
import DictData from "views/system/dict/data";
import AuthUser from "views/system/role/authUser";

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
    component: Layout,
  },
  {
    path: "/system/dict-data/:id",
    exact: true,
    component: DictData,
  },
  {
    path: "/system/role-auth/:id",
    exact: true,
    component: AuthUser,
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
