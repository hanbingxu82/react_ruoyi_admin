/*
 * @Author: your name
 * @Date: 2021-12-06 10:39:48
 * @LastEditTime: 2021-12-06 10:39:48
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/api/monitor/server.ts
 */
import request from "utils/request";

// 查询服务器详细
export function getServer() {
  return request({
    url: "/monitor/server",
    method: "get",
  });
}
