/*
 * @Author: your name
 * @Date: 2021-11-11 13:51:46
 * @LastEditTime: 2021-11-11 13:51:59
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/api/menu.ts
 */
import request from "../utils/request";

// 获取路由
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}