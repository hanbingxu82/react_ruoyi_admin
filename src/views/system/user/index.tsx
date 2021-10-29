/*
 * @Author: your name
 * @Date: 2021-10-09 17:04:33
 * @LastEditTime: 2021-10-29 16:05:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/system/user/index.tsx
 */
import React, { useState, useEffect, useRef } from "react";
import "./index.less";
import { listUser, getUser, updateUser, addUser, delUser, resetUserPwd, importTemplate, importFile, exportUser, getAuthRole, updateAuthRole, changeUserStatus } from "../../../api/system/user";
import { Descriptions, Checkbox, Upload, Tree, Dropdown, Menu, Input, Row, Col, Form, Button, Select, DatePicker, Tooltip, Table, Space, Switch, Modal, Radio, TreeSelect, message } from "antd";
import { InboxOutlined, KeyOutlined, SmileOutlined, ExclamationCircleOutlined, SearchOutlined, SyncOutlined, AppstoreOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { treeselect } from "../../../api/system/dept";
import { getDicts } from "../../../api/global";
import { download } from "../../../utils/ruoyi";
import moment from "moment";

import ColTransfer from "../../../compoents/ColTransfer";
import HeaderBar from "../../../compoents/HeaderBar";

const { Dragger } = Upload;
const { confirm } = Modal;
const { Option } = Select;
const { Search } = Input;
const { Column } = Table;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const dataList: any[] = [];
const getParentKey = (id: any, tree: string | any[]): any => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: { id: any }) => item.id === id)) {
        parentKey = node.id;
      } else if (getParentKey(id, node.children)) {
        parentKey = getParentKey(id, node.children);
      }
    }
  }
  return parentKey;
};

function User() {
  /**
   * @description: 是否第一次加载组件
   * @param {*}
   * @return {*}
   */
  const initComponent = useRef(true);
  /**
   * @description: 搜索条件
   * @param {*}
   * @return {*}
   */
  const [queryParams, setQueryParams] = useState({
    pageNum: 1,
    pageSize: 10,
    deptId: "",
    userName: "",
    phonenumber: "",
    status: "",
    params: {
      beginTime: "",
      endTime: "",
    },
  });
  const [getLoading,setGetLoading] = useState(false)
  const [fileList, setFileList] = useState<any[]>([]);
  // 搜索form 实例
  const [queryForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleUpload, setVisibleUpload] = useState(false);
  const [visibleRole, setVisibleRole] = useState(false);
  const [visibleColTransfer, setVisibleColTransfer] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加用户");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [userForm, setUserForm] = useState({
    deptId: "",
    userId: "",
    userName: "",
    nickName: "",
  });
  const [userFormModel] = Form.useForm();
  const [dicts, setDicts] = useState({
    sys_normal_disable: [],
    sys_user_sex: [],
    postOptions: [],
    roleOptions: [],
  });

  const [treeList, setTreeList] = useState([]);
  const [total, setTotal] = useState(0);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const [roleTableData, setRoleTableData] = useState([]);
  const [roleTotal, setRoleTotal] = useState(0);
  const [roleQueryParams, setRoleQueryParams] = useState({
    pageNum: 1,
    pageSize: 10,
    roleKey: [],
    userId: "",
  });
  const [switchKey, setSwitchKey] = useState(1000);
  const passwordValue = useRef("");
  const isSaveUserData = useRef<any>(null);

  const [columns, setColumns] = useState([
    { key: 0, title: `用户编号`, visible: true },
    { key: 1, title: `用户名称`, visible: true },
    { key: 2, title: `用户昵称`, visible: true },
    { key: 3, title: `部门`, visible: true },
    { key: 4, title: `手机号码`, visible: true },
    { key: 5, title: `状态`, visible: true },
    { key: 6, title: `创建时间`, visible: true },
  ]);

  // 判断 搜索条件框是否隐藏
  const [showQueryForm, setShowQueryForm] = useState(true);

  // 上传参数
  const uploadProps = {
    name: "file",
    multiple: false,
    fileList,
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file: any) => {
      const arr = [file];
      setFileList(arr);
      return false;
    },
    onDrop(e: any) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  const onChange = (e: { target: { value: any } }): any => {
    const { value } = e.target;
    const expandedKeys: any = dataList
      .map((item) => {
        if (item.label.indexOf(value) > -1) {
          return getParentKey(item.id, treeList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  const loop = (data: any) =>
    data.map((item: { title?: any; children: any; key?: any; label: string; id: any }) => {
      const index = item.label.indexOf(searchValue);
      const beforeStr = item.label.substr(0, index);
      const afterStr = item.label.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.label}</span>
        );
      if (item.children) {
        return { title, key: item.id, children: loop(item.children) };
      }

      return {
        title,
        key: item.id,
      };
    });

  // 监听副作用
  useEffect(() => {
    if (initComponent.current) return;
    // 监听queryParams变化
    getList();
  }, [queryParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // 副作用生命周期
  useEffect(() => {
    initComponent.current = false;
    getDicts("sys_normal_disable").then((response) => {
      setDicts((data) => {
        data.sys_normal_disable = response.data;
        return data;
      });
    });
    getDicts("sys_user_sex").then((response) => {
      setDicts((data) => {
        data.sys_user_sex = response.data;
        return data;
      });
    });
    getList();
    getOtherList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * @description: 点击增加修改事件
   * @param {*}
   * @return {*}
   */
  const showModal = (titleName: string, row: any = { userId: "" }) => {
    setVisibleTitle(titleName);
    userFormModel.resetFields();
    setUserForm(() => {
      return {
        deptId: "",
        userId: "",
        userName: "",
        nickName: "",
      };
    });
    if (titleName === "修改用户") {
      const userId = row.userId || selectedRowKeys[0];
      // 调用查询详细接口
      getUser(userId).then((response: any) => {
        setUserForm((data: any) => {
          return { ...data, ...response.data, postId: response.postId, roleId: response.roleId };
        });
        // 变更字典
        setDicts((data) => {
          data.postOptions = response.posts;
          data.roleOptions = response.roles;
          return { ...data };
        });
        userFormModel.setFieldsValue({
          ...response.data,
          postIds: response.postIds,
          roleIds: response.roleIds,
        });
      });
    } else {
      // 新增用户操作
      getUser("").then((response: any) => {
        setDicts((data) => {
          data.postOptions = response.posts;
          data.roleOptions = response.roles;
          return { ...data };
        });
      });
    }
    setVisible(true);
  };
  /**
   * @description: 点击删除事件
   * @param {any} row
   * @return {*}
   */
  const delData = (row: any = { userId: "" }) => {
    const userIds = row.userId || selectedRowKeys;
    console.log(userIds);
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认删除选中的数据项？",
      centered: true,
      onOk() {
        delUser(userIds).then(() => {
          getList();
          message.success("删除成功");
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  /**
   * @description: 弹窗确认点击事件
   * @param {*}
   * @return {*}
   */
  const handleOk = () => {
    // form 表单内容
    // setConfirmLoading(true);
    userFormModel
      .validateFields()
      .then((values) => {
        if (userForm.userId !== "") {
          updateUser({ ...userForm, ...userFormModel.getFieldsValue() }).then(() => {
            message.success("修改成功");
            // setConfirmLoading(false);
            setVisible(false);
            getList();
          });
        } else {
          addUser({ ...userFormModel.getFieldsValue() }).then(() => {
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

  const handleCancel = () => {
    setVisible(false);
  };
  /**
   * @description: 上传弹窗点击事件
   * @param {*}
   * @return {*}
   */
  function handleOkUpload() {
    let formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file);
    });
    importFile(formData, isSaveUserData.current.state.checked ? 1 : 0).then((res: any) => {
      message.success(res.msg);
      setVisibleUpload(false);
    });
  }
  function handleCancelUpload() {
    setVisibleUpload(false);
  }

  // 上传按钮，下载模板
  function getImportTemplate() {
    importTemplate().then((response: any) => {
      download(response.msg);
    });
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
        exportUser(queryParams)
          .then((response: any) => {
            download(response.msg);
          })
          .catch(() => {});
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
  /**
   * @description: 分配角色 弹窗单击确认函数
   * @param {*}
   * @return {*}
   */
  function handleOkRole() {
    const userId = userForm.userId;
    const roleIds = roleQueryParams.roleKey.join(",");
    updateAuthRole({ userId: userId, roleIds: roleIds }).then(() => {
      message.success("授权成功");
      setVisibleRole(false);
    });
  }
  /**
   * @description: 分配角色 弹窗单击取消函数
   * @param {*}
   * @return {*}
   */
  function handleCancelRole() {
    setVisibleRole(false);
  }
  /**
   * @description: 分配角色点击事件
   * @param {*}
   * @return {*}
   */
  function distributionRole(row: any) {
    const userId = row.userId;
    let roleKey = [];
    if (userId) {
      getAuthRole(userId).then((response: any) => {
        setRoleTableData(response.roles);
        setRoleTotal(response.roles.length);
        roleKey = response.roles
          .filter((item: { flag: any }) => {
            return item.flag;
          })
          .map((item: { roleId: any }) => item.roleId);
        setRoleQueryParams({ pageSize: 10, pageNum: 1, roleKey, userId });
        setUserForm(() => {
          return { ...response.user };
        });
        setVisibleRole(true);
      });
    }
  }
  /**
   * @description: 获取其他数据
   * @param {*}
   * @return {*}
   */
  const getOtherList = () => {
    treeselect().then((res: any) => {
      const cal = function (data: any[]) {
        data.forEach((i: any) => {
          dataList.push(i);
          if (i.children) {
            cal(i.children);
          }
        });
      };
      cal(res.data);
      const expandedKeys: any = dataList.map((item) => {
        return getParentKey(item.id, res.data);
      });
      setExpandedKeys(expandedKeys);
      setTreeList(res.data);
    });
  };
  /**
   * @description: 获取表格信息
   * @param {*}
   * @return {*}
   */
  const getList = () => {
    setGetLoading(true)
    listUser({ ...queryParams }).then((res: any) => {
      setGetLoading(false)
      setTableData(res.rows);
      setSwitchKey(switchKey + 1);
      setTotal(res.total);
    });
  };

  /**
   * @description: selectTree变更事件
   * @param {any} value
   * @return {*}
   */
  const onSelectTreeChange = (value: any) => {
    setUserForm((data) => {
      data.deptId = value;
      return { ...data };
    });
  };
  /**
   * @description: 表格复选框选择事件
   * @param {any} selectedRowKeys
   * @return {*}
   */
  const onSelectChange = (selectedRowKeys: any) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  /**
   * @description: 分配角色表格复选框选择事件
   * @param {any} selectedRowKeys
   * @return {*}
   */
  const onRoleSelectChange = (selectedRowKeys: any) => {
    setRoleQueryParams({ ...roleQueryParams, roleKey: selectedRowKeys });
  };
  const rowRoleSelection = {
    defaultSelectedRowKeys: roleQueryParams.roleKey,
    selectedRowKeys: roleQueryParams.roleKey,
    onChange: onRoleSelectChange,
  };
  /**
   * @description:table 开关选框变更事件
   * @param {*}
   * @return {*}
   */
  const onTableSwitchChange = (row: any) => {
    let text = row.status !== "0" ? "启用" : "停用";
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: '确认要"' + text + '""' + row.userName + '"用户吗?',
      centered: true,
      onOk() {
        // 反向更新数据，我在这边采用的是click事件，这个时候点击是不会变更状态的，直接更改row.status 组件不会进行监听
        row.status = row.status === "0" ? "1" : "0";
        changeUserStatus(row.userId, row.status).then(() => {
          message.success(text + "成功");
          getList();
        });
      },
      onCancel() {
        // 无需任何操作
        // row.status = row.status === "0" ? "1" : "0";
        // getList();
      },
    });
  };
  /**
   * @description: 搜索条件搜索事件
   * @param {any} form
   * @return {*}
   */
  const onQueryFinish = (form: any) => {
    setQueryParams((data) => {
      data.phonenumber = form.phonenumber;
      data.userName = form.userName;
      data.status = form.status;
      if (form.time) {
        data.params.beginTime = moment(form.time[0]).format("YYYY-MM-DD");
        data.params.endTime = moment(form.time[1]).format("YYYY-MM-DD");
      } else {
        data.params.beginTime = "";
        data.params.endTime = "";
      }
      return { ...data };
    });
  };
  /**
   * @description: 搜索条件重置事件
   * @param {*}
   * @return {*}
   */
  const onResetQuery = () => {
    queryForm.resetFields();
    onQueryFinish({});
  };
  // 回调函数，切换下一页
  const changePage = (current: any) => {
    const params = {
      pageNum: current,
      pageSize: queryParams.pageSize,
    };
    setQueryParams((data: any) => ({ ...data, ...params }));
  };

  // 回调函数,每页显示多少条
  const changePageSize = (pageSize: number, current?: any) => {
    // 将当前改变的每页条数存到state中
    setQueryParams((data) => {
      data.pageSize = pageSize;
      return data;
    });
  };
  // 表格分页属性
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: () => `共${total}条`,
    pageSize: queryParams.pageSize,
    current: queryParams.pageNum,
    total: total,
    onShowSizeChange: (current: any, pageSize: any) => changePageSize(pageSize, current),
    onChange: (current: any) => changePage(current),
  };

  // 回调函数，切换下一页
  const changePageRole = (current: any) => {
    const params = {
      pageNum: current,
      pageSize: roleQueryParams.pageSize,
    };
    setRoleQueryParams((data: any) => ({ ...data, ...params }));
  };

  // 回调函数,每页显示多少条
  const changePageSizeRole = (pageSize: number, current?: any) => {
    // 将当前改变的每页条数存到state中
    setRoleQueryParams((data) => {
      data.pageSize = pageSize;
      return data;
    });
  };
  // 表格分页属性
  const paginationPropsRole = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: () => `共${roleTotal}条`,
    pageSize: roleQueryParams.pageSize,
    current: roleQueryParams.pageNum,
    total: roleTotal,
    onShowSizeChange: (current: any, pageSize: any) => changePageSizeRole(pageSize, current),
    onChange: (current: any) => changePageRole(current),
  };
  /**
   * @description: tree 树点击事件
   * @param {*}
   * @return {*}
   */
  const onTreeClick = (selectedKeys: any, e: any) => {
    setQueryParams((data) => {
      data.deptId = selectedKeys[0];
      return { ...data };
    });
  };
  /**
   * @description: 单击重置密码事件
   * @param {*}
   * @return {*}
   */
  const resetPassword = (row: any) => {
    passwordValue.current = "";
    confirm({
      title: "提示",
      icon: null,
      centered: true,
      content: (
        <div>
          <div>请输入"{row.userName}"新密码</div>
          <Input
            defaultValue={passwordValue.current}
            onChange={(e: any) => {
              const { value } = e.target;
              passwordValue.current = value;
            }}
          ></Input>
        </div>
      ),
      onOk(close) {
        if (passwordValue.current.length >= 5 && passwordValue.current.length <= 20) {
          resetUserPwd(row.userId, passwordValue.current).then((response) => {
            message.success("修改成功，新密码是：" + passwordValue.current);
            close();
          });
        } else {
          message.error("密码长度需在5-20之间！");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const menu = function (row: any) {
    return (
      <Menu>
        <Menu.Item
          onClick={() => {
            resetPassword(row);
          }}
          key="KeyOutlined"
          icon={<KeyOutlined />}
        >
          重置密码
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            distributionRole(row);
          }}
          key="SmileOutlined"
          icon={<SmileOutlined />}
        >
          分配角色
        </Menu.Item>
      </Menu>
    );
  };
  return (
    <div className="User">
      <Row>
        {/* 左侧树条件区域 */}
        <Col span={6}>
          <Search style={{ marginBottom: 8 }} placeholder="请输入部门名称" onChange={onChange} />
          {treeList.length && <Tree onSelect={onTreeClick} onExpand={onExpand} expandedKeys={expandedKeys} autoExpandParent={autoExpandParent} treeData={loop(treeList)} />}
        </Col>
        {/* 右侧内容展示区域 */}
        <Col span={17} offset={1}>
          {showQueryForm ? (
            <Form form={queryForm} name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
              <Row>
                <Col span={8}>
                  <Form.Item label="用户名称" name="userName">
                    <Input placeholder="请输入用户名称" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="手机号码" name="phonenumber">
                    <Input placeholder="请输入用户名称" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="状态" name="status">
                    <Select placeholder="请输入状态" allowClear>
                      <Option value="0">启用</Option>
                      <Option value="1">停用</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="创建时间" name="time">
                    <RangePicker format={dateFormat} />
                  </Form.Item>
                </Col>
                <Col span={8} offset={8}>
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
            <Col  style={{ marginRight: 20 }}>
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
            <Col  style={{ marginRight: 20 }}>
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
            <Col  style={{ marginRight: 20 }}>
              <Button icon={<DeleteOutlined />} onClick={delData} disabled={selectedRowKeys.length <= 0}>
                删除
              </Button>
            </Col>
            <Col
              span={2}
              style={{ marginRight: 20 }}
              onClick={() => {
                setVisibleUpload(true);
              }}
            >
              <Button icon={<VerticalAlignTopOutlined />}>导入</Button>
            </Col>
            <Col  style={{ marginRight: 20 }} onClick={handleExport}>
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
              <Tooltip title="显隐列">
                <Button
                 style={{marginRight: 10 }}
                  onClick={() => {
                    setVisibleColTransfer(true);
                  }}
                  icon={<AppstoreOutlined />}
                  shape="circle"
                ></Button>
              </Tooltip>
            </Col>
          </Row>
          {/* 表格区域 */}
          <Row>
            <Table scroll={{ x: "100%" }} loading={getLoading} pagination={paginationProps} rowKey={(record: any) => record.userId} rowSelection={rowSelection} dataSource={tableData} style={{ width: "100%" }}>
              {columns[0].visible ? <Column align="center" title="用户编号" dataIndex="userId" /> : null}
              {columns[1].visible ? <Column align="center" title="用户名称" dataIndex="userName" /> : null}
              {columns[2].visible ? <Column align="center" title="用户昵称" dataIndex="nickName" /> : null}
              {columns[3].visible ? <Column align="center" title="部门" dataIndex={["dept", "deptName"]} /> : null}
              {columns[4].visible ? <Column align="center" title="部门" dataIndex={["dept", "deptName"]} /> : null}
              {columns[5].visible ? (
                <Column
                  align="center"
                  title="状态"
                  render={(text, row: any, index) => (
                    <Switch
                      // key={text + index + switchKey}
                      checkedChildren="开启"
                      onClick={() => {
                        onTableSwitchChange(row);
                      }}
                      unCheckedChildren="关闭"
                      checked={row.status === "0" ? true : false}
                      // defaultChecked={row.status === "0" ? true : false}
                    />
                  )}
                />
              ) : null}
              {columns[6].visible ? <Column align="center" title="创建时间" dataIndex="createTime" /> : null}
              <Column
                align="center"
                title="操作"
                render={(text, row: any) =>
                  row.userId !== 1 ? (
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
                          delData(row);
                        }}
                      >
                        <DeleteOutlined />
                        删除
                      </a>
                      <Dropdown overlay={menu(row)}>
                        <a>
                          <DoubleRightOutlined />
                          更多
                        </a>
                      </Dropdown>
                    </Space>
                  ) : null
                }
              />
            </Table>
          </Row>
          {/* 增加修改表单区域 */}
          <Modal centered width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
            <Form form={userFormModel} name="userFormModel" labelCol={{ style: { width: 90 } }} initialValues={{ status: "0" }} autoComplete="off">
              <Row>
                <Col span={11}>
                  <Form.Item label="用户昵称" name="nickName" rules={[{ required: true, message: "用户昵称不能为空" }]}>
                    <Input placeholder="请输入用户昵称" />
                  </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item label="归属部门" name="deptId">
                    {/* <Input placeholder="请输入归属部门" /> */}
                    <TreeSelect onChange={onSelectTreeChange} value={userForm.deptId} fieldNames={{ label: "label", value: "id", children: "children" }} style={{ width: "100%" }} dropdownStyle={{ maxHeight: 400, overflow: "auto" }} treeData={treeList} placeholder="请选择归属部门" treeDefaultExpandAll />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item label="手机号码" name="phonenumber">
                    <Input placeholder="请输入手机号码" />
                  </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item label="邮箱" name="email">
                    <Input placeholder="请输入邮箱" />
                  </Form.Item>
                </Col>
              </Row>
              {userForm.userId === "" ? (
                <Row>
                  <Col span={11}>
                    <Form.Item
                      label="用户名称"
                      name="userName"
                      rules={[
                        { required: true, message: "用户名称不能为空" },
                        { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间" },
                      ]}
                    >
                      <Input placeholder="请输入用户名称" />
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={2}>
                    <Form.Item
                      label="用户密码"
                      name="password"
                      rules={[
                        { required: true, message: "用户密码不能为空" },
                        { min: 5, max: 20, message: "用户名称长度必须介于 5 和 20 之间" },
                      ]}
                    >
                      <Input.Password placeholder="请输入用户密码" />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null}
              <Row>
                <Col span={11}>
                  <Form.Item label="用户性别" name="sex">
                    <Select placeholder="请选择用户性别">
                      {dicts.sys_user_sex.map((dict: any) => {
                        return (
                          <Option value={dict.dictValue} key={"sex" + dict.dictValue}>
                            {dict.dictLabel}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item label="状态" name="status">
                    <Radio.Group>
                      {dicts.sys_normal_disable.map((dict: any) => {
                        return (
                          <Radio value={dict.dictValue} key={"status" + dict.dictValue}>
                            {dict.dictLabel}
                          </Radio>
                        );
                      })}
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item label="岗位" name="postIds">
                    <Select placeholder="请选择岗位" mode="multiple">
                      {dicts.postOptions.map((dict: any) => {
                        return (
                          <Option value={dict.postId} key={"postId" + dict.postId}>
                            {dict.postName}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item label="角色" name="roleIds">
                    <Select placeholder="请选择角色" mode="multiple">
                      {dicts.roleOptions.map((dict: any) => {
                        return (
                          <Option value={dict.roleId} key={"roleId" + dict.roleId}>
                            {dict.roleName}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="内容" name="remark">
                    <Input.TextArea placeholder="请输入内容" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
          {/* 导入区域 */}
          <Modal destroyOnClose centered width="40%" title="用户导入" visible={visibleUpload} onOk={handleOkUpload} onCancel={handleCancelUpload}>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                将文件拖拽到此处，或 <a>点击上传</a>{" "}
              </p>
            </Dragger>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Checkbox ref={isSaveUserData} defaultChecked={false}>
                是否更新已经存在的用户数据
              </Checkbox>
              <p>
                仅允许导入xls、xlsx格式文件。 <a onClick={getImportTemplate}>下载模板</a>
              </p>
            </div>
          </Modal>
          {/* 分配角色区域 */}
          <Modal destroyOnClose centered width="60%" title="分配角色" visible={visibleRole} onOk={handleOkRole} onCancel={handleCancelRole}>
            <div>
              <Descriptions title="基本信息">
                <Descriptions.Item label="用户昵称">{userForm.nickName}</Descriptions.Item>
                <Descriptions.Item label="登录账号">{userForm.userName}</Descriptions.Item>
              </Descriptions>
            </div>
            <Descriptions title="基本信息"></Descriptions>
            <Table pagination={paginationPropsRole} rowKey={(record: any) => record.roleId} rowSelection={rowRoleSelection} dataSource={roleTableData} style={{ width: "100%" }}>
              <Column align="center" title="角色编号" dataIndex="roleId" />
              <Column align="center" title="角色名称" dataIndex="roleName" />
              <Column align="center" title="权限字符" dataIndex="roleKey" />
              <Column align="center" title="创建时间" dataIndex="createTime" />
            </Table>
          </Modal>
          <Modal
            destroyOnClose
            centered
            width="40%"
            title="显示/隐藏"
            visible={visibleColTransfer}
            onOk={() => {
              setVisibleColTransfer(false);
            }}
            onCancel={() => {
              setVisibleColTransfer(false);
            }}
          >
            <ColTransfer
              columns={columns}
              setColumns={(data: any) => {
                console.log(data);
                setColumns([...data]);
              }}
            ></ColTransfer>
          </Modal>
        </Col>
      </Row>
    </div>
  );
}
export default User;
