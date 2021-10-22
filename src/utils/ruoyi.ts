/*
 * @Author: your name
 * @Date: 2021-10-09 17:37:13
 * @LastEditTime: 2021-10-22 14:03:43
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
