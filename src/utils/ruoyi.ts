/*
 * @Author: your name
 * @Date: 2021-10-09 17:37:13
 * @LastEditTime: 2021-11-24 09:30:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/utils/ruoyi.js
 */
const baseURL = process.env.REACT_APP_BASE_API;

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str: any) {
  if (!str || str === "undefined" || str === "null" || str === undefined || str === null) {
    return "";
  }
  return str;
}
// 通用下载方法
export function download(fileName: string) {
  window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 通用解析字典方法
// 回显数据字典
export function selectDictLabel(datas: any, value: string) {
  var actions: any[] = [];
  Object.keys(datas).some((key) => {
    if (datas[key].dictValue === "" + value) {
      actions.push(datas[key].dictLabel);
      return true;
    } else {
      return false;
    }
  });
  return actions.join("");
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data: any, id: any, parentId?: any, children?: any) {
  let config = {
    id: id || "id",
    parentId: parentId || "parentId",
    childrenList: children || "children",
  };

  var childrenListMap: any = {};
  var nodeIds: any = {};
  var tree: any = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o: { [x: string]: any }) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}

var document: any = window.document;
// 展开/全屏
export function requestFullScreen(element: any) {
  var requestMethod = element.requestFullscreen || element.webkitRequestFullscreen || element.msRequestFullscreen || element.mozRequestFullScreen;
  if (requestMethod) {
    requestMethod.call(element);
  }
}
// 退出/全屏
export function exitFullScreen() {
  var exitMethod = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen;
  if (exitMethod) {
    exitMethod.call(document);
  }
}
// 判断是否全屏
export function isFullscreenElement() {
  var isFull = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || document.mozFullScreenElement;
  return !!isFull;
}
// 日期格式化
export function parseTime(time: string | number | Date, pattern?: string) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === "string") {
      time = time.replace(new RegExp(/-/gm), "/");
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result: string | any[], key: string) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}
