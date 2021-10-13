/*
 * @Author: your name
 * @Date: 2021-10-11 09:30:58
 * @LastEditTime: 2021-10-13 09:06:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/login/index.tsx
 */

import { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, Row, Col } from "antd";
import "./index.less";
import { connect } from "react-redux";
//从redux中引入一个方法用于将actionCreators中的方法进行绑定 就是用  dispatch({actions暴露方法})
import { bindActionCreators } from "redux";
import actions from "../../store/actions";
import { login, getCodeImg } from "../../api/login/login";
import bgUrl from "../../assets/images/loginbg.png";
interface Ilogin {
  username: string;
  password: string;
  code: string;
  uuid: string;
}
let uuid = "";
const Login = (props: any) => {
  const [codeUrl, setCodeUrl] = useState("");

  /**
   * @description: 副作用
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    getCodeUrl();
  }, []);
  /**
   * @description: 获取验证码函数方法
   * @param {*}
   * @return {*}
   */
  const getCodeUrl = () => {
    getCodeImg().then((res: any) => {
      uuid = res.uuid;
      setCodeUrl("data:image/gif;base64," + res.img);
    });
  };

  /**
   * @description: 校验成功 登录方法
   * @param {any} values
   * @return {*}
   */
  const onFinish = (values: Ilogin) => {
    values.uuid = uuid;
    login(values.username, values.password, values.code, values.uuid)
      .then((res: any) => {
        // 存token 查用户信息 跳转首页
        window.localStorage.setItem("ruoyi_token", res.token);
        // 调用 redux 方法
        props.getInfo(props);
        // getInfo().then((userRes: any) => {
        //   // 存入角色信息
        //   window.localStorage.setItem("ruoyi_role", JSON.stringify(userRes.roles));
        //   window.localStorage.setItem("ruoyi_user", JSON.stringify(userRes.user));
        //   props.history.replace("/index");
        // });
      })
      .catch((err) => {
        // 如果reject 那么就重新刷新验证码
        getCodeUrl();
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="Login">
      <img className="loginbg" src={bgUrl} alt="" />
      <div className="loginbox">
        <div className="logintitle">若依管理系统</div>
        <Form name="basic" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名!" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码!" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item label="验证码" name="code" rules={[{ required: true, message: "请输入验证码!" }]}>
            <Row>
              <Col span={14}>
                <Input />
              </Col>
              <Col span={10}>
                <div className="codeImg">
                  <img onClick={getCodeUrl} src={codeUrl} alt="验证码" />
                </div>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 6, span: 18 }}>
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
          {/* <Form.Item wrapperCol={{ offset: 6, span: 18 }}> */}
          <div className="submitbox">
            <Button className="submitbtn" type="primary" htmlType="submit">
              登录
            </Button>
          </div>

          {/* </Form.Item> */}
        </Form>
      </div>
    </div>
  );
};
const mapDispatchToProps = (dispatch: any) => bindActionCreators(actions, dispatch);

export default connect((state: any) => state, mapDispatchToProps)(Login);
