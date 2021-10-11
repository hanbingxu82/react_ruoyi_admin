/*
 * @Author: your name
 * @Date: 2021-10-09 17:04:19
 * @LastEditTime: 2021-10-09 17:32:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/system/role/index.tsx
 */
import React, { useState, useEffect } from 'react';
function Role() {
// 声明一个名为“count”的新状态变量
const [count, setCount] = useState(0);
// 类似于 componentDidMount 和 componentDidUpdate:
useEffect(() => {
// 使用浏览器API更新文档标题
document.title = `You clicked count times`;
},[]);
return (
<div className='Role'>
</div>
);
}
export default Role;