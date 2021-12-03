/*
 * @Author: your name
 * @Date: 2021-12-02 20:13:08
 * @LastEditTime: 2021-12-02 20:13:08
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/api/monitor/joblog.ts
 */
import request from "utils/request";


// 查询调度日志列表
export function listJobLog(query: any) {
  return request({
    url: '/monitor/jobLog/list',
    method: 'get',
    params: query
  })
}

// 删除调度日志
export function delJobLog(jobLogId: string) {
  return request({
    url: '/monitor/jobLog/' + jobLogId,
    method: 'delete'
  })
}

// 清空调度日志
export function cleanJobLog() {
  return request({
    url: '/monitor/jobLog/clean',
    method: 'delete'
  })
}

// 导出调度日志
export function exportJobLog(query: any) {
  return request({
    url: '/monitor/jobLog/export',
    method: 'get',
    params: query
  })
}