/*
 * @Author: your name
 * @Date: 2021-10-09 17:04:33
 * @LastEditTime: 2021-10-11 09:21:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/system/user/index.tsx
 */
import React, { useState, useEffect } from "react";
import "./index.less";
import { listUser } from "../../../api/system/user";

function User() {
  // 声明一个名为“count”的新状态变量
//   const [count, setCount] = useState(0);
  // 类似于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器API更新文档标题
    // document.title = `You clicked count times`;
    listUser({}).then((res) => {
      console.log(res);
    });
  }, []);
  return <div className="User">123123</div>;
}
export default User;
