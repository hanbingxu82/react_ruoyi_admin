/*
 * @Author: your name
 * @Date: 2021-10-09 14:03:48
 * @LastEditTime: 2021-11-19 14:16:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/Layout/index.ts
 */
// import react from "react";
import { connect } from "react-redux";
//从redux中引入一个方法用于将actionCreators中的方法进行绑定 就是用  dispatch({actions暴露方法})
import { bindActionCreators } from "redux";
import actions from "../../store/actions";
function Layout(props: any) {
  const { number } = props;
  const add = () => {
    props.add(1);
  };
  const del = () => {
    props.del(1);
  };
  return (
    <div>
      <div>{number}</div>
      <button onClick={add}>+1</button>
      <button onClick={del}>-1</button>
    </div>
  );
}
const mapStateToProps = (state: any) => ({
  number: state.number,
});
const mapDispatchToProps = (dispatch: any) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Layout);
