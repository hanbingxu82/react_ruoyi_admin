/*
 * @Author: your name
 * @Date: 2021-10-11 16:25:10
 * @LastEditTime: 2021-10-11 17:54:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/reducers/reducer.js
 */

const defaultState = {
  number: 0,
};

export default (state = { ...defaultState }, action: any) => {
  switch (action.type) {
    case "ADD":
      return { ...state, number: (state.number += action.number) };
    case "DEL":
      return { ...state, number: (state.number -= action.number) };
    default:
      console.log(action)
      return state;
  }
};
