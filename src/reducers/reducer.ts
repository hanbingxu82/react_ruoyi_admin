/*
 * @Author: your name
 * @Date: 2021-10-11 16:25:10
 * @LastEditTime: 2021-11-11 14:03:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/reducers/reducer.js
 */

const defaultState = {
  number: 0,
  sidebarRoutes: [],
  rewriteRoutes: [],
};
const reducer = (state = { ...defaultState }, action: any) => {
  switch (action.type) {
    case "ADD":
      return { ...state, number: (state.number += action.number) };
    case "DEL":
      return { ...state, number: (state.number -= action.number) };
    case "MENU":
      console.log(action);
      return { ...state, sidebarRoutes: action.sidebarRoutes, rewriteRoutes: action.rewriteRoutes };
    default:
      return state;
  }
};

export default reducer;
