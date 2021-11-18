/*
 * @Author: your name
 * @Date: 2021-11-18 10:13:57
 * @LastEditTime: 2021-11-18 10:40:26
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/utils/asyncComponent.ts
 */
import React, { Component } from "react";

export const asyncComponent = (fn: { (): Promise<any>; (): Promise<any> }) => {
  // return 一个组件
  return class MyComponent extends React.Component<any, any> {
    constructor(props: {} | Readonly<{}>) {
      super(props);
      this.state = {
        C: null,
      };
    }
    // 调用组件时会渲染当渲染完成后会执行componentDidMount这时候会调用fn
    componentDidMount() {
      debugger
      // fn是一个异步的promise调用这时给组件进行复制重新渲染
      fn().then((module: { default: any }) => {
        // console.log(mod);
        this.setState({
          C: module.default,
          // module.default就是页面引进的真正要加载的组件
        });
      });
    }
    render() {
      let { C } = this.state;
      return (
        <div>
          {C ? <C {...this.props}></C> : null}
          {/*{...this.props}是为了解决当前组件C没有Route所携带的信息无法跳转  但是如果想要必须接受,在App.js中route将信息传给Login,而Login就是此时类asyncComponent return的组件 所以进行结构赋值*/}
        </div>
      );
    }
  };
};
