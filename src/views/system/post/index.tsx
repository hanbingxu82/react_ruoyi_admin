/*
 * @Author: your name
 * @Date: 2021-10-15 13:49:40
 * @LastEditTime: 2021-10-15 13:49:41
 * @LastEditors: Please set LastEditors
 * @Description: 岗位管理页面
 * @FilePath: /use-hooks/src/views/system/post/index.tsx
 */
import React, { useState, useEffect } from "react";
function Post() {
  // 声明一个名为“count”的新状态变量
  const [count, setCount] = useState(0);
  // 类似于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器API更新文档标题
    document.title = `You clicked count times`;
  }, []);
  return <div className="Post"></div>;
}
export default Post;
