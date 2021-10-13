/*
 * @Author: your name
 * @Date: 2021-10-13 10:05:43
 * @LastEditTime: 2021-10-13 10:05:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/api/system/dept.ts
 */
import request from '../../utils/request'
// 查询部门列表
export function listDept(query: any) {
    return request({
      url: '/system/dept/list',
      method: 'get',
      params: query
    })
  }
  
  // 查询部门列表（排除节点）
  export function listDeptExcludeChild(deptId: string) {
    return request({
      url: '/system/dept/list/exclude/' + deptId,
      method: 'get'
    })
  }
  
  // 查询部门详细
  export function getDept(deptId: string) {
    return request({
      url: '/system/dept/' + deptId,
      method: 'get'
    })
  }
  
  // 查询部门下拉树结构
  export function treeselect() {
    return request({
      url: '/system/dept/treeselect',
      method: 'get'
    })
  }
  
  // 根据角色ID查询部门树结构
  export function roleDeptTreeselect(roleId: string) {
    return request({
      url: '/system/dept/roleDeptTreeselect/' + roleId,
      method: 'get'
    })
  }
  
  // 新增部门
  export function addDept(data: any) {
    return request({
      url: '/system/dept',
      method: 'post',
      data: data
    })
  }
  
  // 修改部门
  export function updateDept(data: any) {
    return request({
      url: '/system/dept',
      method: 'put',
      data: data
    })
  }
  
  // 删除部门
  export function delDept(deptId: string) {
    return request({
      url: '/system/dept/' + deptId,
      method: 'delete'
    })
  }