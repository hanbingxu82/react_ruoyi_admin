/*
 * @Author: your name
 * @Date: 2021-10-25 16:16:49
 * @LastEditTime: 2021-10-25 16:16:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/api/system/notice.ts
 */
import request from '../../utils/request'

// 查询公告列表
export function listNotice(query: any) {
  return request({
    url: '/system/notice/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getNotice(noticeId: string) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addNotice(data: any) {
  return request({
    url: '/system/notice',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateNotice(data: any) {
  return request({
    url: '/system/notice',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delNotice(noticeId: string) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'delete'
  })
}