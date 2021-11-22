/*
 * @Author: your name
 * @Date: 2021-11-19 13:49:29
 * @LastEditTime: 2021-11-22 11:55:25
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/views/system/profile/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { Card, Avatar, Divider, Space, Tabs, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message } from "antd";
import { PhoneOutlined, MailOutlined, ApartmentOutlined, TeamOutlined, FieldTimeOutlined, ExclamationCircleOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined, EditOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { listPost, getPost, delPost, addPost, updatePost, exportPost } from "../../../api/system/post";
import { selectDictLabel } from "../../../utils/ruoyi";
import { getDicts } from "../../../api/global";
import { download } from "../../../utils/ruoyi";
import RuoYiPagination from "../../../compoents/RuoYiPagination";

const { TabPane } = Tabs;
const { confirm } = Modal;
const { Option } = Select;
const { Meta } = Card;
function Post() {
  /**
   * @description: 是否第一次加载组件
   * @param {*}
   * @return {*}
   */
  const initComponent = useRef(true);
  // 搜索条件
  const [queryForm, setQueryForm] = useState({
    pageNum: 1,
    pageSize: 10,
    postName: "",
    postCode: "",
    status: "",
  });
  const [queryFormRef] = Form.useForm();
  const [showQueryForm, setShowQueryForm] = useState(true);
  // 字典列表
  const [dicts, setDicts] = useState({
    sys_normal_disable: [],
  });
  // 加载效果
  const [getLoading, setGetLoading] = useState(false);

  // 表单弹窗
  const [postFormModel] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加岗位");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [postForm, setPostForm] = useState({
    postId: "",
  });
  // 监听副作用
  useEffect(() => {
    if (initComponent.current) return;
    // 监听queryParams变化
    getList();
  }, [queryForm]); // eslint-disable-line react-hooks/exhaustive-deps
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
    setGetLoading(true);
    listPost({ ...queryForm }).then((res: any) => {
      setGetLoading(false);
    });
  }

  /**
   * @description: 弹窗确认点击事件
   * @param {*}
   * @return {*}
   */
  const handleOk = () => {
    // form 表单内容
    postFormModel
      .validateFields()
      .then((values) => {
        if (postForm.postId !== "") {
          updatePost({ ...postForm, ...postFormModel.getFieldsValue() }).then(() => {
            message.success("修改成功");
            // setConfirmLoading(false);
            setVisible(false);
            getList();
          });
        } else {
          addPost({ ...postFormModel.getFieldsValue() }).then(() => {
            message.success("增加成功");
            setVisible(false);
            // setConfirmLoading(false);
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
                Content of Tab Pane 1<p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </TabPane>
              <TabPane tab="修改密码" key="2">
                Content of Tab Pane 2<p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default Post;
