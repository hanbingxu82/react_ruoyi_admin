/*
 * @Author: your name
 * @Date: 2021-10-11 09:30:58
 * @LastEditTime: 2021-10-11 10:35:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/login/index.tsx
 */

import react, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, Row, Col } from "antd";
import "./index.less";

import { login, getInfo, getCodeImg } from "../../api/login/login";
import bgUrl from "../../assets/images/loginbg.png";

const Login = () => {
  const [codeUrl, setCodeUrl] = useState("");
  /**
   * @description: 副作用
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    getCodeUrl();
  }, []);
  const getCodeUrl = () => {
    getCodeImg().then((res: any) => {
      setCodeUrl("data:image/gif;base64," + res.img);
    });
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
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

export default Login;
