/*
 * @Author: your name
 * @Date: 2021-10-09 09:36:54
 * @LastEditTime: 2021-10-11 17:08:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/index.tsx
 */
import React from "react";
import ReactDOM from "react-dom";
import "./index.less";
import { HashRouter, Switch, Route } from "react-router-dom";
import routers from "./router";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
// 引入 redux
import store from "./store";

ReactDOM.render(
  // <React.StrictMode> 关闭严格模式
  <Provider store={store}>
    <HashRouter>
      <Switch>
        {routers.routers.map((v) => (
          <Route key={v.path} path={v.path} exact={v.exact} component={v.component} />
        ))}
      </Switch>
    </HashRouter>
  </Provider>,
  // </React.StrictMode>
  document.getElementById("root")
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
