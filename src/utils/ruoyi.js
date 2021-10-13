/*
 * @Author: your name
 * @Date: 2021-10-09 17:37:13
 * @LastEditTime: 2021-10-13 15:13:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/utils/ruoyi.js
 */
// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
	if (!str || str === "undefined" || str === "null"|| str === undefined || str === null) {
		return "";
	}
	return str;
}

