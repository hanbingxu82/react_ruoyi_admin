/*
 * @Author: your name
 * @Date: 2021-10-09 17:37:13
 * @LastEditTime: 2021-10-14 15:21:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/utils/ruoyi.js
 */
const baseURL = process.env.REACT_APP_BASE_API

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str:any) {
	if (!str || str === "undefined" || str === "null"|| str === undefined || str === null) {
		return "";
	}
	return str;
}
// 通用下载方法
export function download(fileName:string) {
	window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}