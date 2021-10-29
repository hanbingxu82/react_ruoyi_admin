/*
 * @Author: your name
 * @Date: 2021-10-29 10:51:38
 * @LastEditTime: 2021-10-29 10:51:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/api/system/config.ts
 */
import request from 'utils/request'

// 查询参数列表
export function listConfig(query: any) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  })
}

// 查询参数详细
export function getConfig(configId: string) {
  return request({
    url: '/system/config/' + configId,
    method: 'get'
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey: string) {
  return request({
    url: '/system/config/configKey/' + configKey,
    method: 'get'
  })
}

// 新增参数配置
export function addConfig(data: any) {
  return request({
    url: '/system/config',
    method: 'post',
    data: data
  })
}

// 修改参数配置
export function updateConfig(data: any) {
  return request({
    url: '/system/config',
    method: 'put',
    data: data
  })
}

// 删除参数配置
export function delConfig(configId: string) {
  return request({
    url: '/system/config/' + configId,
    method: 'delete'
  })
}

// 刷新参数缓存
export function refreshCache() {
  return request({
    url: '/system/config/refreshCache',
    method: 'delete'
  })
}

// 导出参数
export function exportConfig(query: any) {
  return request({
    url: '/system/config/export',
    method: 'get',
    params: query
  })
}