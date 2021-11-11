/*
 * @Author: your name
 * @Date: 2021-10-11 17:23:34
 * @LastEditTime: 2021-11-11 16:10:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/store/actions.ts
 */
import { getInfo, logout } from "../api/login/login";
import { getRouters } from "api/menu";
import cookie from "react-cookies";
import App from "views/App/App";

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
  /**
   * @description: 用于实现登出效果
   * @param {any} props
   * @return {*}
   */
  getMenu() {
    // 向后端请求路由数据
    return (dispatch: any) => {
      getRouters().then((res: any) => {
        const sdata = JSON.parse(JSON.stringify(res.data));
        const rdata = JSON.parse(JSON.stringify(res.data));
        const sidebarRoutes = filterAsyncRouter(sdata);
        const rewriteRoutes = filterAsyncRouter(rdata, false, true);
        rewriteRoutes.push({ path: "*", redirect: "/404", hidden: true });
        // 动作的发送
        const action = {
          type: "MENU",
          sidebarRoutes,
          rewriteRoutes,
        };
        dispatch(action);
      });
    };
  },
};

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: any, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route: any) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === "Layout") {
        route.component = App;
      }
      // else if (route.component === "ParentView") {
      //   route.component = ParentView;
      // } else if (route.component === "InnerLink") {
      //   route.component = InnerLink;
      // }
      else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

function filterChildren(childrenMap: any, lastRouter: any = false) {
  var children: any = [];
  childrenMap.forEach((el: any, index: any) => {
    if (el.children && el.children.length) {
      if (el.component === "ParentView") {
        el.children.forEach((c: any) => {
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + "/" + el.path;
    }
    children = children.concat(el);
  });
  return children;
}

export const loadView = (view: any) => {
  // 路由懒加载
  return (resolve: any) => require(`views/${view}`);
};
export default actions;
