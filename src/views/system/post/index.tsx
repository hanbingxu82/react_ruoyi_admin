/*
 * @Author: your name
 * @Date: 2021-10-15 13:49:40
 * @LastEditTime: 2021-10-18 14:06:35
 * @LastEditors: Please set LastEditors
 * @Description: 岗位管理页面
 * @FilePath: /use-hooks/src/views/system/post/index.tsx
 */
import { useState, useEffect } from "react";
import "./index.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { Space, Input, Row, Col, Form, Button, Select, DatePicker, Table, Modal, Radio, message } from "antd";
import { InboxOutlined, KeyOutlined, SmileOutlined, ExclamationCircleOutlined, SearchOutlined, SyncOutlined, AppstoreOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { selectDictLabel } from "../../../utils/ruoyi";

// import moment from "moment";
// const { Dragger } = Upload;
const { confirm } = Modal;
const { Option } = Select;
// const { Search } = Input;
// const { Column } = Table;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
function Post() {
  // 搜索条件
  const [queryForm, setQueryForm] = useState({});
  const [queryFormRef] = Form.useForm();
  const [showQueryForm, setShowQueryForm] = useState(true);
  // 表格列头对应字段
  const columns = [
    {
      title: "岗位编号",
      dataIndex: "postId",
    },
    {
      title: "岗位编码",
      dataIndex: "postCode",
    },
    {
      title: "岗位名称",
      dataIndex: "postName",
    },
    {
      title: "岗位排序",
      dataIndex: "postSort",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text: any, row: any) => <>{/*selectDictLabel()*/}</>,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
    },
    {
      title: "操作",
      // dataIndex: "address",
      render: (text: any, row: any) => {
        return (
          <>
            <Space size="middle">
              <a
                onClick={() => {
                  showModal("修改用户", row);
                }}
              >
                <EditOutlined />
                修改
              </a>
              <a
                onClick={() => {
                  // delData(row);
                }}
              >
                <DeleteOutlined />
                删除
              </a>
              {/* <Dropdown overlay={menu(row)}>
                <a>
                  <DoubleRightOutlined />
                  更多
                </a>
              </Dropdown> */}
            </Space>
          </>
        );
      },
    },
  ];
  // 表格数据
  const [tableData, setTableData] = useState([]);
  // 表格选中行 KEY 值
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  useEffect(() => {}, []);
  /**
   * @description: 获取表格信息
   * @param {*}
   * @return {*}
   */
  const getList = () => {
    // setGetLoading(true);
    // listUser({ ...queryParams }).then((res: any) => {
    //   setGetLoading(false);
    //   setTableData(res.rows);
    //   setSwitchKey(switchKey + 1);
    //   setTotal(res.total);
    // });
  };
  /**
   * @description: 搜索条件搜索事件
   * @param {any} form
   * @return {*}
   */
  function onQueryFinish(form: any) {
    // setQueryParams((data) => {
    //   data.phonenumber = form.phonenumber;
    //   data.userName = form.userName;
    //   data.status = form.status;
    //   if (form.time) {
    //     data.params.beginTime = moment(form.time[0]).format("YYYY-MM-DD");
    //     data.params.endTime = moment(form.time[1]).format("YYYY-MM-DD");
    //   } else {
    //     data.params.beginTime = "";
    //     data.params.endTime = "";
    //   }
    //   return { ...data };
    // });
  }
  /**
   * @description: 搜索条件重置事件
   * @param {*}
   * @return {*}
   */
  function onResetQuery() {
    queryFormRef.resetFields();
    onQueryFinish({});
  }
  /**
   * @description: 点击增加修改事件
   * @param {*}
   * @return {*}
   */
  function showModal(titleName: string, row: any = { userId: "" }) {
    // setVisibleTitle(titleName);
    // userFormModel.resetFields();
    // setUserForm(() => {
    //   return {
    //     deptId: "",
    //     userId: "",
    //     userName: "",
    //     nickName: "",
    //   };
    // });
    // if (titleName === "修改用户") {
    //   const userId = row.userId || selectedRowKeys[0];
    //   // 调用查询详细接口
    //   getUser(userId).then((response: any) => {
    //     setUserForm((data: any) => {
    //       return { ...data, ...response.data, postId: response.postId, roleId: response.roleId };
    //     });
    //     // 变更字典
    //     setDicts((data) => {
    //       data.postOptions = response.posts;
    //       data.roleOptions = response.roles;
    //       return { ...data };
    //     });
    //     userFormModel.setFieldsValue({
    //       ...response.data,
    //       postIds: response.postIds,
    //       roleIds: response.roleIds,
    //     });
    //   });
    // } else {
    //   // 新增用户操作
    //   getUser("").then((response: any) => {
    //     setDicts((data) => {
    //       data.postOptions = response.posts;
    //       data.roleOptions = response.roles;
    //       return { ...data };
    //     });
    //   });
    // }
    // setVisible(true);
  }
  /**
   * @description: 导出函数
   * @param {*}
   * @return {*}
   */
  function handleExport() {
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认导出所有用户数据项？",
      centered: true,
      onOk() {
        // exportUser(queryParams)
        //   .then((response: any) => {
        //     download(response.msg);
        //   })
        //   .catch(() => {});
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
  function onSelectChange(selectedRowKeys: any) {
    setSelectedRowKeys(selectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className="Post">
      {/* 搜索条件展示区域 */}
      {showQueryForm ? (
        <Form form={queryFormRef} name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="用户名称" name="userName">
                <Input placeholder="请输入用户名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="手机号码" name="phonenumber">
                <Input placeholder="请输入用户名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status">
                <Select placeholder="请输入状态" allowClear>
                  <Option value="0">启用</Option>
                  <Option value="1">停用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="创建时间" name="time">
                <RangePicker format={dateFormat} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6} offset={18}>
              <Form.Item style={{ float: "right" }}>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
                <Button style={{ marginLeft: 20 }} onClick={onResetQuery} icon={<SyncOutlined />}>
                  重置
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : null}
      {/* 搜索条区域 */}
      <Row>
        <Col span={2} style={{ marginRight: 20 }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              showModal("添加用户");
            }}
          >
            新增
          </Button>
        </Col>
        <Col span={2} style={{ marginRight: 20 }}>
          <Button
            disabled={selectedRowKeys.length !== 1}
            onClick={() => {
              showModal("修改用户");
            }}
            icon={<EditOutlined />}
          >
            修改
          </Button>
        </Col>
        <Col span={2} style={{ marginRight: 20 }}>
          <Button icon={<DeleteOutlined />} disabled={selectedRowKeys.length <= 0}>
            删除
          </Button>
        </Col>
        <Col span={2} style={{ marginRight: 20 }} onClick={handleExport}>
          <Button icon={<VerticalAlignBottomOutlined />}>导出</Button>
        </Col>
        <Col style={{ flex: 1, textAlign: "right" }}>
          <HeaderBar
            onSeachShow={() => {
              setShowQueryForm(!showQueryForm);
            }}
            onGetList={() => {
              getList();
            }}
          ></HeaderBar>
        </Col>
      </Row>
      {/* 表格区域 */}
      <Row>
        <Table style={{width:'100%'}} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
      </Row>
    </div>
  );
}
export default Post;
