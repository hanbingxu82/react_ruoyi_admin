/*
 * @Author: your name
 * @Date: 2021-03-05 16:36:31
 * @LastEditTime: 2021-10-27 11:48:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /blogreact/src/router/router.tsx
 */
import App from "../views/App/App";
import Layout from "../views/Layout";

import Login from "../views/login";

import User from "../views/system/user";
import Post from "../views/system/post";
import Dept from "../views/system/dept";
import Notice from "../views/system/notice";
import OperLog from "views/system/log/operlog";
import LoginInfor from "views/system/log/logininfor";

// import Details from '../views/Details/Details';
// import Details from '../views/Details/Details'
// import Messages from '../views/Messages/Messages';
// import Resumes from '../views/Resumes/Resumes';
// import NoMatch from '../views/NoMatch/NoMatch';

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
    path: "/system/user",
    exact: true,
    component: User,
  },
  {
    path: "/system/post",
    exact: true,
    component: Post,
  },
  {
    path: "/system/dept",
    exact: true,
    component: Dept,
  },
  {
    path: "/system/notice",
    exact: true,
    component: Notice,
  },
  {
    path: "/system/log/operlog",
    exact: true,
    component: OperLog,
  },
  {
    path: "/system/log/logininfor",
    exact: true,
    component: LoginInfor,
  },
];
const threeRouters = [];

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
