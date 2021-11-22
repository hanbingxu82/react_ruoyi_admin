/*
 * @Author: your name
 * @Date: 2021-11-19 13:49:29
 * @LastEditTime: 2021-11-22 14:57:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/views/system/profile/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { Card, Avatar, Divider, Tabs, Input, Row, Col, Form, Button, Select, Modal, Radio, message } from "antd";
import { PhoneOutlined, MailOutlined, TeamOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { listPost, addPost, updatePost } from "../../../api/system/post";
import { getDicts } from "../../../api/global";

const { TabPane } = Tabs;
const { Meta } = Card;
function Post() {
  /**
   * @description: 是否第一次加载组件
   * @param {*}
   * @return {*}
   */
  const initComponent = useRef(true);

  // 字典列表
  const [dicts, setDicts] = useState({
    sys_normal_disable: [],
  });

  // 表单弹窗
  const [formModel1] = Form.useForm();
  const [formModel2] = Form.useForm();

  // 用户form字段
  const [form, setPostForm] = useState({
    postId: "",
  });

  /**
   * @description: 生命周期初始化
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    initComponent.current = false;
    getDicts("sys_normal_disable").then((response) => {
      setDicts((data) => {
        data.sys_normal_disable = response.data;
        return data;
      });
    });
    getList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * @description: 获取表格信息
   * @param {*}
   * @return {*}
   */
  function getList() {
    listPost({}).then((res: any) => {});
  }

  /**
   * @description: 弹窗确认点击事件
   * @param {*}
   * @return {*}
   */
  const handleOk = () => {
    // form 表单内容
    formModel1
      .validateFields()
      .then((values) => {
        if (form.postId !== "") {
          updatePost({ ...form, ...formModel1.getFieldsValue() }).then(() => {
            message.success("修改成功");

            getList();
          });
        } else {
          addPost({ ...formModel1.getFieldsValue() }).then(() => {
            message.success("增加成功");

            getList();
          });
        }
      })
      .catch((err) => {
        console.log("校验失败" + err);
      });
  };
  function callback(key: any) {
    console.log(key);
  }
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div className="Profile">
      <Row>
        <Col span={8}>
          <Card style={{ width: "100%" }}>
            <Meta avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />} title="Card title" description="This is the description" />
          </Card>
          <Card style={{ marginTop: 10 }}>
            <div className="card_sb">
              <div>
                <PhoneOutlined />
                <span style={{ marginLeft: 5 }}>电话</span>
              </div>

              <div>{"电话"}</div>
            </div>
            <Divider />
            <div className="card_sb">
              <div>
                <MailOutlined />
                <span style={{ marginLeft: 5 }}>邮箱</span>
              </div>

              <div>{"邮箱"}</div>
            </div>
            <Divider />
            <div className="card_sb">
              <div>
                <TeamOutlined />
                <span style={{ marginLeft: 5 }}>所属角色</span>
              </div>
              <div>{"所属角色"}</div>
            </div>
            <Divider />
            <div className="card_sb">
              <div>
                <FieldTimeOutlined />
                <span style={{ marginLeft: 5 }}>创建时间</span>
              </div>
              <div>{"创建时间"}</div>
            </div>
            <Divider />
          </Card>
        </Col>
        <Col span={16}>
          <Card style={{ marginLeft: 10 }} className="card_body">
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="基本资料" key="1">
                <Form form={formModel1} name="formModel1" labelCol={{ style: { width: 90 } }} initialValues={{ status: "0", deptSort: 0 }} autoComplete="off">
                  <Form.Item label="用户昵称" name="deptName" rules={[{ required: true, message: "用户昵称不能为空" }]}>
                    <Input placeholder="请输入用户昵称" />
                  </Form.Item>

                  <Form.Item label="手机号码" name="orderNum" rules={[{ required: true, message: "手机号码不能为空" }]}>
                    <Input placeholder="请输入手机号码" />
                  </Form.Item>

                  <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                      { required: true, message: "邮箱不能为空" },
                      {
                        type: "email",
                        message: "请输入正确的email格式",
                      },
                    ]}
                  >
                    <Input placeholder="请输入邮箱" />
                  </Form.Item>
                  <Form.Item label="性别" name="status">
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
                <Form form={formModel2} name="formModel2" labelCol={{ style: { width: 90 } }} onFinish={onFinish} initialValues={{}} autoComplete="off" scrollToFirstError>
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
                    <Input />
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
                    <Input.Password />
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
                    <Input.Password />
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
export default Post;
