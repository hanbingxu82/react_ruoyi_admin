/*
 * @Author: your name
 * @Date: 2021-11-24 09:06:19
 * @LastEditTime: 2021-11-24 09:18:15
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/api/monitor/online.ts
 */
import request from "utils/request";

// 查询在线用户列表
export function list(query: any) {
  return request({
    url: "/monitor/online/list",
    method: "get",
    params: query,
  });
}

// 强退用户
export function forceLogout(tokenId: string) {
  return request({
    url: "/monitor/online/" + tokenId,
    method: "delete",
  });
}
