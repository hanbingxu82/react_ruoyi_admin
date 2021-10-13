/*
 * @Author: your name
 * @Date: 2021-10-13 15:14:08
 * @LastEditTime: 2021-10-13 15:15:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/api/global.ts
 */
import request from "../utils/request";
// 根据字典类型查询字典数据信息
export function getDicts(dictType: string) {
  return request({
    url: "/system/dict/data/type/" + dictType,
    method: "get",
  });
}
