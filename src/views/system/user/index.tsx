/*
 * @Author: your name
 * @Date: 2021-10-09 17:04:33
 * @LastEditTime: 2021-10-14 10:05:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/system/user/index.tsx
 */
import React, { useState, useEffect, useRef } from "react";
import "./index.less";
import { listUser, getUser, updateUser, addUser } from "../../../api/system/user";
import { Tree, Input, Row, Col, Form, Button, Select, DatePicker, Tooltip, Table, Space, Switch, Modal, Radio, TreeSelect, message } from "antd";
import { SearchOutlined, SyncOutlined, AppstoreOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { treeselect } from "../../../api/system/dept";
import { getDicts } from "../../../api/global";
import moment from "moment";

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
  // 搜索form 实例
  const [queryForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加用户");
  const [confirmLoading, setConfirmLoading] = useState(false);
  // 用户form字段
  const [userForm, setUserForm] = useState({
    deptId: "",
    userId: "",
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
  const [tableData, setTableData] = useState([]);
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
    console.log(value);
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
   * @description: 弹窗确认点击事件
   * @param {*}
   * @return {*}
   */
  const handleOk = () => {
    // form 表单内容
    // setConfirmLoading(true);
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
  };

  const handleCancel = () => {
    setVisible(false);
  };

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
    listUser({ ...queryParams }).then((res: any) => {
      setTableData(res.rows);
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
   * @description:table 开关选框变更事件
   * @param {*}
   * @return {*}
   */
  const onTableSwitchChange = () => {};
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
            <Col span={2} style={{ marginRight: 20 }}>
              <Button icon={<VerticalAlignTopOutlined />}>导入</Button>
            </Col>
            <Col span={2} style={{ marginRight: 20 }}>
              <Button icon={<VerticalAlignBottomOutlined />}>导出</Button>
            </Col>

            <Col style={{ flex: 1, textAlign: "right" }}>
              <Tooltip title="隐藏搜索">
                <Button style={{ marginRight: 10 }} icon={<SearchOutlined />} shape="circle"></Button>
              </Tooltip>
              <Tooltip title="刷新">
                <Button style={{ marginRight: 10 }} icon={<SyncOutlined />} shape="circle"></Button>
              </Tooltip>
              <Tooltip title="显隐列">
                <Button icon={<AppstoreOutlined />} shape="circle"></Button>
              </Tooltip>
            </Col>
          </Row>
          {/* 表格区域 */}
          <Row>
            <Table pagination={paginationProps} rowKey={(record: any) => record.userId} rowSelection={rowSelection} dataSource={tableData} style={{ width: "100%" }}>
              <Column align="center" title="用户编号" dataIndex="userId" />
              <Column align="center" title="用户名称" dataIndex="userName" />
              <Column align="center" title="用户昵称" dataIndex="nickName" />
              <Column align="center" title="部门" dataIndex={["dept", "deptName"]} />
              <Column align="center" title="手机号码" dataIndex="phonenumber" />
              <Column align="center" title="状态" render={(text, row: any) => <Switch checked={row.status === "0" ? true : false} checkedChildren="开启" onChange={onTableSwitchChange} unCheckedChildren="关闭" defaultChecked={row.status === "0" ? true : false} />} />
              <Column align="center" title="创建时间" dataIndex="createTime" />
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
                      <a>
                        <DeleteOutlined />
                        删除
                      </a>
                      <a>
                        <DoubleRightOutlined />
                        更多
                      </a>
                    </Space>
                  ) : null
                }
              />
            </Table>
          </Row>
          <Modal width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
            <Form form={userFormModel} name="userFormModel" labelCol={{ style: { width: 90 } }} initialValues={{ status: "0" }} autoComplete="off">
              <Row>
                <Col span={11}>
                  <Form.Item label="用户昵称" name="nickName">
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
                    <Form.Item label="用户名称" name="userName">
                      <Input placeholder="请输入用户名称" />
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={2}>
                    <Form.Item label="用户密码" name="password">
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
        </Col>
      </Row>
    </div>
  );
}
export default User;
