/*
 * @Author: your name
 * @Date: 2021-10-20 10:37:31
 * @LastEditTime: 2021-10-20 10:37:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/api/system/post.ts
 */
import request from '../../utils/request'

// 查询岗位列表
export function listPost(query: any) {
  return request({
    url: '/system/post/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(postId: string) {
  return request({
    url: '/system/post/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data: any) {
  return request({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data: any) {
  return request({
    url: '/system/post',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delPost(postId: string) {
  return request({
    url: '/system/post/' + postId,
    method: 'delete'
  })
}

// 导出岗位
export function exportPost(query: any) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  })
}