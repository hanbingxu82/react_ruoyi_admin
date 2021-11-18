/*
 * @Author: your name
 * @Date: 2021-10-11 16:25:10
 * @LastEditTime: 2021-11-18 09:50:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/reducers/reducer.js
 */

const defaultState = {
  number: 0,
  sidebarRoutes: [],
  rewriteRoutes: [],
  routerMenu: [],
};
const reducer = (state = { ...defaultState }, action: any) => {
  switch (action.type) {
    case "ADD":
      return { ...state, number: (state.number += action.number) };
    case "DEL":
      return { ...state, number: (state.number -= action.number) };
    case "MENU":
      return { ...state, sidebarRoutes: action.sidebarRoutes, rewriteRoutes: action.rewriteRoutes, routerMenu: action.routerMenu };
    default:
      return state;
  }
};

export default reducer;
