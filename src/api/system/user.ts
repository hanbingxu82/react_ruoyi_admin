/*
 * @Author: your name
 * @Date: 2021-10-09 17:35:06
 * @LastEditTime: 2021-11-22 16:55:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/api/system/user.ts
 */
import request from "../../utils/request";

import { praseStrEmpty } from "../../utils/ruoyi";

// 查询用户列表
export function listUser(query: any) {
  return request({
    url: "/system/user/list",
    method: "get",
    params: query,
  });
}

// 查询用户详细
export function getUser(userId: any) {
  return request({
    url: "/system/user/" + praseStrEmpty(userId),
    method: "get",
  });
}

// 新增用户
export function addUser(data: any) {
  return request({
    url: "/system/user",
    method: "post",
    data: data,
  });
}

// 修改用户
export function updateUser(data: any) {
  return request({
    url: "/system/user",
    method: "put",
    data: data,
  });
}

// 删除用户
export function delUser(userId: string) {
  return request({
    url: "/system/user/" + userId,
    method: "delete",
  });
}

// 导出用户
export function exportUser(query: any) {
  return request({
    url: "/system/user/export",
    method: "get",
    params: query,
  });
}

// 用户密码重置
export function resetUserPwd(userId: any, password: any) {
  const data = {
    userId,
    password,
  };
  return request({
    url: "/system/user/resetPwd",
    method: "put",
    data: data,
  });
}

// 用户状态修改
export function changeUserStatus(userId: any, status: any) {
  const data = {
    userId,
    status,
  };
  return request({
    url: "/system/user/changeStatus",
    method: "put",
    data: data,
  });
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: "/system/user/profile",
    method: "get",
  });
}

// 修改用户个人信息
export function updateUserProfile(data: any) {
  return request({
    url: "/system/user/profile",
    method: "put",
    data: data,
  });
}

// 用户密码重置
export function updateUserPwd(oldPassword?: any, newPassword?: any) {
  const data = {
    oldPassword,
    newPassword,
  };
  return request({
    url: "/system/user/profile/updatePwd",
    method: "put",
    params: data,
  });
}

// 用户头像上传
export function uploadAvatar(data: any) {
  return request({
    url: "/system/user/profile/avatar",
    method: "post",
    data: data,
  });
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: "/system/user/importTemplate",
    method: "get",
  });
}

// 查询授权角色
export function getAuthRole(userId: string) {
  return request({
    url: "/system/user/authRole/" + userId,
    method: "get",
  });
}

// 保存授权角色
export function updateAuthRole(data: any) {
  return request({
    url: "/system/user/authRole",
    method: "put",
    params: data,
  });
}

// 导出上传
export function importFile(data: any, updateSupport: number) {
  return request({
    url: "/system/user/importData?updateSupport=" + updateSupport,
    method: "post",
    data,
  });
}
