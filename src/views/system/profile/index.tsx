/*
 * @Author: your name
 * @Date: 2021-11-19 13:49:29
 * @LastEditTime: 2021-11-23 11:19:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/views/system/profile/index.tsx
 */
import React, { useState, useEffect, useRef } from "react";
import "./index.less";

import { Card, Avatar, Divider, Tabs, Input, Row, Col, Form, Button, Radio, message } from "antd";
import { PhoneOutlined, MailOutlined, TeamOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { getUserProfile, updateUserProfile, updateUserPwd } from "api/system/user";
import profile from "assets/images/profile.jpg";
import UploadImgCrop from "compoents/UploadImgCrop";
import { connect } from "react-redux";
//从redux中引入一个方法用于将actionCreators中的方法进行绑定 就是用  dispatch({actions暴露方法})
import { bindActionCreators } from "redux";
import actions from "store/actions";

const { TabPane } = Tabs;
const { Meta } = Card;
function ProFile(props: any) {
  /**
   * @description: 是否第一次加载组件
   * @param {*}
   * @return {*}
   */
  const initComponent = useRef(true);
  const UploadImgCropRef: any = React.createRef();

  // 表单弹窗
  const [formModel1] = Form.useForm();
  const [formModel2] = Form.useForm();

  // 用户user字段
  const [user, setUser] = useState({
    userName: "",
    avatar: "",
    phonenumber: "",
    email: "",
    roleGroup: "",
    postGroup: "",
    dept: {
      deptName: "",
    },
    createTime: "",
  });
  /**
   * @description: 生命周期初始化
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    initComponent.current = false;
    getList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * @description: 获取表格信息
   * @param {*}
   * @return {*}
   */
  function getList() {
    getUserProfile().then((res: any) => {
      formModel1.setFieldsValue({
        nickName: res.data.nickName,
        phonenumber: res.data.phonenumber,
        email: res.data.email,
        sex: res.data.sex,
      });
      setUser({
        ...res.data,
        roleGroup: res.roleGroup,
        postGroup: res.postGroup,
      });
    });
  }

  function callback(key: any) {
    console.log(key);
  }
  /**
   * @description: 修改基本资料事件
   * @param {any} values
   * @return {*}
   */
  const onDetail = (values: any) => {
    formModel1
      .validateFields()
      .then((values) => {
        updateUserProfile({ ...user, ...values }).then((response) => {
          message.success("修改成功");
        });
      })
      .catch((err) => {
        console.log("校验失败" + err);
      });
  };
  /**
   * @description: 重置密码点击按钮事件
   * @param {*}
   * @return {*}
   */
  const onRequest = (values: any) => {
    formModel2
      .validateFields()
      .then((values) => {
        updateUserPwd(values.oldPassword, values.newPassword).then((response) => {
          message.success("修改成功");
        });
      })
      .catch((err) => {
        console.log("校验失败" + err);
      });
  };

  return (
    <div className="Profile">
      <div className="UploadImgCropRef_div">
        <UploadImgCrop
          ref={UploadImgCropRef}
          size={1}
          importAfterMethods={(url: string) => {
            setUser({ ...user, avatar: url });
            props.setUserInfoAvatar(url);
          }}
        ></UploadImgCrop>
      </div>
      <Row>
        <Col span={8}>
          <Card style={{ width: "100%" }}>
            <Meta
              avatar={
                <span
                  className="Avatar_span"
                  onClick={() => {
                    // 手动触发下子组件的点击事件
                    UploadImgCropRef.current.click();
                  }}
                >
                  <Avatar src={user.avatar || profile} />
                </span>
              }
              title={user.userName}
              description={user.dept.deptName + " / " + user.postGroup}
            />
          </Card>
          <Card style={{ marginTop: 10 }}>
            <div className="card_sb">
              <div>
                <PhoneOutlined />
                <span style={{ marginLeft: 5 }}>电话</span>
              </div>

              <div>{user.phonenumber}</div>
            </div>
            <Divider />
            <div className="card_sb">
              <div>
                <MailOutlined />
                <span style={{ marginLeft: 5 }}>邮箱</span>
              </div>

              <div>{user.email}</div>
            </div>
            <Divider />
            <div className="card_sb">
              <div>
                <TeamOutlined />
                <span style={{ marginLeft: 5 }}>所属角色</span>
              </div>
              <div>{user.roleGroup}</div>
            </div>
            <Divider />
            <div className="card_sb">
              <div>
                <FieldTimeOutlined />
                <span style={{ marginLeft: 5 }}>创建时间</span>
              </div>
              <div>{user.createTime}</div>
            </div>
            <Divider />
          </Card>
        </Col>
        <Col span={16}>
          <Card style={{ marginLeft: 10 }} className="card_body">
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="基本资料" key="1">
                <Form form={formModel1} name="formModel1" labelCol={{ style: { width: 90 } }} onFinish={onDetail} initialValues={{ sex: "0" }} autoComplete="off">
                  <Form.Item label="用户昵称" name="nickName" rules={[{ required: true, message: "用户昵称不能为空" }]}>
                    <Input placeholder="请输入用户昵称" />
                  </Form.Item>
                  <Form.Item label="手机号码" name="phonenumber" rules={[{ required: true, message: "手机号码不能为空" }]}>
                    <Input placeholder="请输入手机号码" />
                  </Form.Item>
                  <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                      { required: true, message: "邮箱不能为空" },
                      {
                        type: "email",
                        message: "请输入正确的邮箱格式",
                      },
                    ]}
                  >
                    <Input placeholder="请输入邮箱" />
                  </Form.Item>
                  <Form.Item label="性别" name="sex">
                    <Radio.Group>
                      <Radio value="0">男</Radio>
                      <Radio value="1">女</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      保存
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="修改密码" key="2">
                <Form form={formModel2} name="formModel2" labelCol={{ style: { width: 90 } }} onFinish={onRequest} initialValues={{}} autoComplete="off" scrollToFirstError>
                  <Form.Item
                    name="oldPassword"
                    label="旧密码"
                    rules={[
                      {
                        required: true,
                        message: "旧密码不能为空!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="请输入旧密码" />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="新密码"
                    rules={[
                      {
                        required: true,
                        message: "新密码不能为空!",
                      },
                      {
                        type: "string",
                        min: 6,
                        max: 20,
                        message: "请输入6-20位密码!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password placeholder="请输入新密码" />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="确认密码"
                    dependencies={["newPassword"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "确认密码不能为空!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("newPassword") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("两次输入的密码不一致!"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="请确认密码" />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      保存
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
const mapDispatchToProps = (dispatch: any) => bindActionCreators(actions, dispatch);
export default connect(
  (state: any) => state,
  (dispatch: any) => mapDispatchToProps
)(ProFile);
