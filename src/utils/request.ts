/*
 * @Author: your name
 * @Date: 2021-10-09 17:17:06
 * @LastEditTime: 2021-10-12 10:02:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/utils/request.ts
 */
import axios from "axios";
// import { Notification, MessageBox, Message } from "element-ui";
// import store from '@/store'
// import { getToken } from '@/utils/auth'
import errorCode from "./errorCode";
// import router from '@/router'
import React from "react";

import { createHashHistory } from "history";
import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const customHash = createHashHistory();
const { confirm } = Modal;

function getToken() {
  return window.localStorage.getItem("ruoyi_token");
}

(axios as any).defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: "http://localhost:8080/",
  // 超时
  timeout: 20000,
});
// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    // const isToken = (config.headers || {}).isToken === false
    const isToken = false;
    if (getToken() && !isToken) {
      (config as any).headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get 请求新增时间戳
    if (config.method === "get") {
      config.params ? (config.params.gt = new Date().getTime()) : (config.params = { gt: new Date().getTime() });
    }
    // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = config.url + "?";
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof value !== "undefined") {
          if (typeof value === "object") {
            for (const key of Object.keys(value)) {
              let params = propName + "[" + key + "]";
              var subPart = encodeURIComponent(params) + "=";
              url += subPart + encodeURIComponent(value[key]) + "&";
            }
          } else {
            url += part + encodeURIComponent(value) + "&";
          }
        }
      }
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    return config;
  },
  (error: any) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res: { data: { code: any; msg: any } }) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = (errorCode as any)[code] || res.data.msg || errorCode["default"];
    if (code === 401) {
      confirm({
        title: "系统提示",
        content: "登录状态已过期，您可以继续留在该页面，或者重新登录?",
        icon: React.createElement(ExclamationCircleOutlined),
        okText: "确认",
        centered: true,
        cancelText: "取消",
        onOk() {
          // 跳转路由首页
          customHash.push("/login");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
      return Promise.reject();
    } else if (code === 500) {
      message.error(msg);
      //   Message({
      //     message: msg,
      //     type: "error",
      //   });
      // return Promise.reject(new Error(msg));
      return Promise.reject(msg);
    } else if (code !== 200) {
      message.error(msg);
      //   Notification.error({
      //     title: msg,
      //   });
      return Promise.reject("error");
    } else {
      return res.data;
    }
  },
  (error: any) => {
    console.log("err" + error);
    let { message } = error;
    if (message === "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    message.error(message);
    // Message({
    //   message: message,
    //   type: "error",
    //   duration: 5 * 1000,
    // });
    return Promise.reject(error);
  }
);

export default service;
