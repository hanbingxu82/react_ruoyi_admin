/*
 * @Author: your name
 * @Date: 2021-11-05 11:47:51
 * @LastEditTime: 2021-12-09 11:40:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/system/role/authUser.tsx
 */

import { useState, useEffect, useRef, useContext } from "react";
import "./authUser.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { Space, Input, Row, Col, Form, Button, Select, Table, Modal, message } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
// import { allocatedUserList, getData, authUserCancel, addData, updateData, exportData } from "api/system/dict/data";
import { allocatedUserList, authUserCancel, authUserCancelAll, unallocatedUserList, authUserSelectAll } from "api/system/role";
import { selectDictLabel } from "../../../utils/ruoyi";
import { getDicts } from "../../../api/global";
import RuoYiPagination from "../../../compoents/RuoYiPagination";
import { Context } from "views/App/App";

const { confirm } = Modal;
const { Option } = Select;
function AuthUser(props: any) {
  /**
   * @description: 是否第一次加载组件
   * @param {*}
   * @return {*}
   */
  const initComponent = useRef(true);
  const AppComponent = useContext(Context);
  // 搜索条件
  const [queryForm, setQueryForm] = useState({
    pageNum: 1,
    pageSize: 10,
    roleId: "",
    phonenumber: "",
    userName: "",
  });
  const [queryFormModal, setQueryFormModal] = useState({
    pageNum: 1,
    pageSize: 10,
    phonenumber: "",
    userName: "",
  });
  const [queryFormRef] = Form.useForm();
  const [showQueryForm, setShowQueryForm] = useState(true);
  // 字典列表
  const [dicts, setDicts] = useState({
    sys_normal_disable: [],
    typeOptions: [],
  });
  // 加载效果
  const [getLoading, setGetLoading] = useState(false);
  // 表格数据
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  // 表格选中行 KEY 值
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 表格列头对应字段
  const columns: any = [
    {
      title: "用户名称",
      align: "center",
      dataIndex: "userName",
    },
    {
      title: "用户昵称",
      align: "center",
      dataIndex: "nickName",
      ellipsis: true,
    },
    {
      title: "邮箱",
      align: "center",
      dataIndex: "email",
      ellipsis: true,
    },
    {
      title: "手机",
      align: "center",
      dataIndex: "phonenumber",
      ellipsis: true,
    },
    {
      title: "状态",
      align: "center",
      dataIndex: "status",
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_normal_disable, text)}</>,
    },
    {
      title: "创建时间",
      align: "center",
      dataIndex: "createTime",
    },
    {
      title: "操作",
      align: "center",
      dataIndex: "address",
      render: (text: any, row: any) => {
        return (
          <>
            <Space size="middle">
              <a
                onClick={() => {
                  cancelAuthUser(row);
                }}
              >
                <DeleteOutlined />
                取消授权
              </a>
            </Space>
          </>
        );
      },
    },
  ];

  // 表单弹窗
  const [queryFormModalRef] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加字典数据");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [userList, setUserList] = useState([]);
  const [userTotal, setUserTotal] = useState(0);
  // 加载效果
  const [getUserLoading, setGetUserLoading] = useState(false);
  // 表格选中行 KEY 值
  const [selectedRowKeysUser, setSelectedRowKeysUser] = useState([]);
  const columnsUser: any = [
    {
      title: "用户名称",
      align: "center",
      dataIndex: "userName",
    },
    {
      title: "用户昵称",
      align: "center",
      dataIndex: "nickName",
      ellipsis: true,
    },
    {
      title: "邮箱",
      align: "center",
      dataIndex: "email",
      ellipsis: true,
    },
    {
      title: "手机",
      align: "center",
      dataIndex: "phonenumber",
      ellipsis: true,
    },
    {
      title: "状态",
      align: "center",
      dataIndex: "status",
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_normal_disable, text)}</>,
    },
    {
      title: "创建时间",
      align: "center",
      dataIndex: "createTime",
    },
  ];
  // 监听副作用
  useEffect(() => {
    if (initComponent.current) return;
    // 监听queryForm变化
    getUserList();
  }, [queryFormModal]); // eslint-disable-line react-hooks/exhaustive-deps
  // 监听副作用
  useEffect(() => {
    if (initComponent.current) return;
    // 监听queryForm变化
    getList();
  }, [queryForm]); // eslint-disable-line react-hooks/exhaustive-deps
  /**
   * @description: 生命周期初始化
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    // 每次加载就会相当于是点击了tabs栏
    const arr = window.location.href.split("#");
    AppComponent.toClickNavLink(arr[1], "分配用户");

    const roleId = props.match ? props.match.params.id : "";
    initComponent.current = false;
    setQueryForm((data) => {
      data.roleId = roleId;
      return { ...data };
    });
    getDicts("sys_normal_disable").then((response) => {
      setDicts((data) => {
        data.sys_normal_disable = response.data;
        return data;
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * @description: 获取表格信息
   * @param {*}
   * @return {*}
   */
  function getList() {
    setGetLoading(true);
    allocatedUserList({ ...queryForm }).then((res: any) => {
      setGetLoading(false);
      setTableData(res.rows);
      setTotal(res.total);
    });
  }
  function getUserList() {
    setGetUserLoading(true);
    unallocatedUserList(queryFormModal).then((res: any) => {
      setGetUserLoading(false);
      setUserList(res.rows);
      setUserTotal(res.total);
    });
  }
  /**
   * @description: 搜索条件搜索事件
   * @param {any} form
   * @return {*}
   */
  function onQueryFinish(form: any) {
    setQueryForm((data) => {
      data.phonenumber = form.phonenumber;
      data.userName = form.userName;
      return { ...data };
    });
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
  function showModal(titleName: string, row: any = { roleId: "" }) {
    setVisibleTitle(titleName);
    getUserList();
    setVisible(true);
  }
  /**
   * @description: 弹窗 搜索 点击事件
   * @param {*}
   * @return {*}
   */
  const handleOk = (form: any) => {
    setQueryFormModal((data) => {
      data.phonenumber = form.phonenumber;
      data.userName = form.userName;
      return { ...data };
    });
  };
  const handleCancel = () => {
    setVisible(false);
  };
  /**
   * @description: 弹窗 重置 点击事件
   * @param {*}
   * @return {*}
   */
  function onResetModalQuery() {
    queryFormModalRef.resetFields();
    handleOk({});
  }

  /**
   * @description: 点击弹窗确认事件
   * @param {any} form
   * @return {*}
   */
  function handleModalOk(form: any) {
    // form 表单内容
    const roleId = queryForm.roleId;
    const userIds = selectedRowKeysUser.join(",");
    authUserSelectAll({ roleId: roleId, userIds: userIds }).then((res: any) => {
      message.success(res.msg);
      if (res.code === 200) {
        setVisible(false);
        getList();
      }
    });
  }
  /**
   * @description: 点击取消授权事件
   * @param {any} row
   * @return {*}
   */
  const cancelAuthUser = (row: any = { roleId: "" }) => {
    const roleId = queryForm.roleId;
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "确认要取消该用户" + row.userName + "角色吗？",
      centered: true,
      onOk() {
        authUserCancel({ userId: row.userId, roleId }).then(() => {
          getList();
          message.success("取消授权成功");
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  /** 批量取消授权按钮操作 */
  function cancelAuthUserAll() {
    const roleId = queryForm.roleId;
    const userIds = selectedRowKeys.join(",");
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否取消选中用户授权数据项？",
      centered: true,
      onOk() {
        authUserCancelAll({ roleId: roleId, userIds: userIds }).then(() => {
          getList();
          message.success("删除成功");
        });
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
  function onSelectChangeUser(selectedRowKeys: any) {
    setSelectedRowKeysUser(selectedRowKeys);
  }

  const rowSelectionUser = {
    selectedRowKeysUser,
    onChange: onSelectChangeUser,
  };
  return (
    <div className="AuthUser">
      {/* 搜索条件展示区域 */}
      {showQueryForm ? (
        <Form form={queryFormRef} className="queryForm" name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="用户名称" name="userName">
                <Input placeholder="请输入用户名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="手机号码" name="phonenumber">
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
            <Col offset={6} span={6}>
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
      <Row style={{ marginBottom: 20 }}>
        <Col style={{ marginRight: 20 }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              showModal("选择用户");
            }}
          >
            添加用户
          </Button>
        </Col>
        <Col style={{ marginRight: 20 }}>
          <Button icon={<DeleteOutlined />} onClick={cancelAuthUserAll} disabled={selectedRowKeys.length <= 0}>
            批量取消授权
          </Button>
        </Col>
        {/* <Col style={{ marginRight: 20 }}>
          <Button
            icon={<CloseOutlined />}
            onClick={() => {
              props.history.goBack();
            }}
          >
            关闭
          </Button>
        </Col> */}

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
        <Table style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.userId} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        <RuoYiPagination
          current={queryForm.pageNum}
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        />
      </Row>
      {/* 增加修改表单区域 */}
      <Modal centered width="60%" title={visibleTitle} visible={visible} onOk={handleModalOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={queryFormModalRef} name="queryFormModalRef" onFinish={handleOk} labelCol={{ style: { width: 90 } }} autoComplete="off">
          <Row>
            <Col span={8}>
              <Form.Item label="用户名称" name="userName">
                <Input placeholder="请输入用户名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="手机号码" name="phonenumber">
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item style={{ float: "right" }}>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
                <Button style={{ marginLeft: 20 }} onClick={onResetModalQuery} icon={<SyncOutlined />}>
                  重置
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table style={{ width: "100%" }} loading={getUserLoading} pagination={false} rowKey={(record: any) => record.userId} rowSelection={rowSelectionUser} columns={columnsUser} dataSource={userList} />
        <RuoYiPagination
          current={queryForm.pageNum}
          total={userTotal}
          onChange={(page: any, pageSize: any) => {
            setQueryFormModal({ ...queryFormModal, pageNum: page, pageSize });
          }}
        />
      </Modal>
    </div>
  );
}
export default AuthUser;
