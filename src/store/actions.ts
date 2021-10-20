/*
 * @Author: your name
 * @Date: 2021-10-11 17:23:34
 * @LastEditTime: 2021-10-20 10:29:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/store/actions.ts
 */
import { getInfo, logout } from "../api/login/login";
import cookie from "react-cookies";

const actions = {
  add: (num: number) => {
    return { type: "ADD", number: num };
  },
  del(num: number) {
    return { type: "DEL", number: num };
  },
  /**
   * @description: 用于实现登录功能后 获取用户信息
   * @param {any} props 跳转路由
   * @return {*}
   */
  getInfo(props: any) {
    return (dispatch: any) => {
      getInfo().then((userRes: any) => {
        // 动作的创建
        const action = {
          type: "getInfo",
        };
        window.localStorage.setItem("ruoyi_role", JSON.stringify(userRes.roles));
        cookie.save("Admin-Token", window.localStorage.getItem("ruoyi_token") as string);
        window.localStorage.setItem("ruoyi_user", JSON.stringify(userRes.user));
        props.history.replace("/index/layout");
        // 动作的发送
        dispatch(action);
      });
    };
  },
  /**
   * @description: 用于实现登出效果
   * @param {any} props
   * @return {*}
   */
  getLogout(props: any) {
    return (dispatch: any) => {
      logout().then(() => {
        // 动作的创建
        const action = {
          type: "getLogout",
        };
        // 如果退出成功那么就调用 三个删除 localstorage
        window.localStorage.removeItem("ruoyi_token");
        window.localStorage.removeItem("ruoyi_role");
        window.localStorage.removeItem("ruoyi_user");
        cookie.remove("Admin-Token");
        // 跳转回登录页面
        props.history.replace("/login");
        
        // 动作的发送
        dispatch(action);
      });
    };
  },
};

export default actions;
