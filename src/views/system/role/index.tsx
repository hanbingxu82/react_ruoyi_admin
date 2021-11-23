/*
 * @Author: your name
 * @Date: 2021-10-09 17:04:19
 * @LastEditTime: 2021-11-05 14:12:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/system/role/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { Dropdown, Menu, Tree, Checkbox, Switch, InputNumber, Space, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message, DatePicker } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignBottomOutlined, DoubleRightOutlined, KeyOutlined, SmileOutlined } from "@ant-design/icons";
import { listRole, getRole, delRole, addRole, updateRole, exportRole, dataScope, changeRoleStatus } from "../../../api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "api/system/menu";
import { treeselect as deptTreeselect, roleDeptTreeselect } from "api/system/dept";
import { selectDictLabel } from "../../../utils/ruoyi";
import { getDicts } from "../../../api/global";
import { download } from "../../../utils/ruoyi";
import moment from "moment";
import RuoYiPagination from "../../../compoents/RuoYiPagination";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const { confirm } = Modal;
const { Option } = Select;
function Role(props:any) {
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
    roleKey: "",
    roleName: "",
    status: "",
    params: {
      beginTime: "",
      endTime: "",
    },
  });
  const [queryFormRef] = Form.useForm();
  const [showQueryForm, setShowQueryForm] = useState(true);
  // 字典列表
  const [dicts, setDicts]: any = useState({
    sys_normal_disable: [],
    menuOptions: [],
    menuOptionsAll: [],
    deptOptions: [],
    deptOptionsAll: [],
    // 数据范围选项
    dataScopeOptions: [
      {
        value: "1",
        label: "全部数据权限",
      },
      {
        value: "2",
        label: "自定数据权限",
      },
      {
        value: "3",
        label: "本部门数据权限",
      },
      {
        value: "4",
        label: "本部门及以下数据权限",
      },
      {
        value: "5",
        label: "仅本人数据权限",
      },
    ],
  });
  // 加载效果
  const [getLoading, setGetLoading] = useState(false);
  // 表格数据
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  // 表格选中行 KEY 值
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const menu = function (row: any) {
    return (
      <Menu>
        <Menu.Item
          onClick={() => {
            dataPermissions(row);
          }}
          key="KeyOutlined"
          icon={<KeyOutlined />}
        >
          数据权限
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            systemUser(row);
          }}
          key="SmileOutlined"
          icon={<SmileOutlined />}
        >
          分配用户
        </Menu.Item>
      </Menu>
    );
  };
  // 表格列头对应字段
  const columns: any = [
    {
      title: "角色编号",
      align: "center",
      dataIndex: "roleId",
    },
    {
      title: "角色名称",
      align: "center",
      dataIndex: "roleName",
    },
    {
      title: "权限字符",
      align: "center",
      dataIndex: "roleKey",
    },
    {
      title: "显示顺序",
      align: "center",
      dataIndex: "roleSort",
    },
    {
      title: "状态",
      align: "center",
      dataIndex: "status",
      render: (text: any, row: any) => (
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
      ),
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
                  showModal("修改角色", row);
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
          </>
        );
      },
    },
  ];
  // 表单弹窗
  const [roleFormModel] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加角色");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [roleForm, setRoleForm] = useState({
    roleId: "",
    dataScope: "",
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    menuIds: [],
    deptIds: [],
  });
  // 监听副作用
  useEffect(() => {
    if (initComponent.current) return;
    // 监听queryParams变化
    getList();
  }, [queryForm]); // eslint-disable-line react-hooks/exhaustive-deps
  //   // 监听副作用
  //   useEffect(() => {
  //     if (!visible) return;
  //     // 监听queryParams变化
  //   }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps
  /**
   * @description: 生命周期初始化
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    initComponent.current = false;
    getDicts("sys_normal_disable").then((response) => {
      setDicts((data: any) => {
        data.sys_normal_disable = response.data;
        return data;
      });
    });
    getMenuTreeselect();
    getDeptTreeselect();
    getList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * @description: 获取表格信息
   * @param {*}
   * @return {*}
   */
  function getList() {
    setGetLoading(true);
    listRole({ ...queryForm }).then((res: any) => {
      setGetLoading(false);
      setTableData(res.rows);
      setTotal(res.total);
    });
  }
  /**
   * @description: 搜索条件搜索事件
   * @param {any} form
   * @return {*}
   */
  function onQueryFinish(form: any) {
    setQueryForm((data) => {
      data.roleKey = form.roleKey;
      data.roleName = form.roleName;
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
   * @description: 数据权限点击事件
   * @param {*}
   * @return {*}
   */
  function dataPermissions(row: any) {
    showModal("分配数据权限", row);
  }
  /**
   * @description: 分配用户事件
   * @param {*}
   * @return {*}
   */
  function systemUser(row: any) {
    //  跳转路由页面
    props.history.push("/system/role-auth/"+row.roleId);
  }
  /**
   * @description: 点击增加、修改、分配数据权限事件
   * @param {*}
   * @return {*}
   */
  function showModal(titleName: string, row: any = { roleId: "" }) {
    // setExpandedKeys([]);
    setVisibleTitle(titleName);
    roleFormModel.resetFields();
    setRoleForm((data: any) => {
      data.roleId = "";
      return data;
    });
    if (titleName !== "添加角色") {
      const roleId = row.roleId || selectedRowKeys[0];
      // 调用查询详细接口
      getRole(roleId).then((response: any) => {
        setRoleForm(() => {
          return { ...response.data };
        });
        roleFormModel.setFieldsValue({
          ...response.data,
        });
        if (titleName === "分配数据权限") {
          const roleDeptTreeselect = getRoleDeptTreeselect(roleId);
          roleDeptTreeselect.then((res) => {
            let checkedKeys = res.checkedKeys;
            setCheckedKeys([...checkedKeys]);
          });
        } else {
          const roleMenu = getRoleMenuTreeselect(roleId);
          roleMenu.then((res) => {
            let checkedKeys = res.checkedKeys;
            setCheckedKeys([...checkedKeys]);
          });
        }
      });
    }
    setVisible(true);
  }
  /**
   * @description: 变更表格 开关状态
   * @param {any} row
   * @return {*}
   */
  function onTableSwitchChange(row: any) {
    let text = row.status !== "0" ? "启用" : "停用";
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: '确认要"' + text + '""' + row.roleName + '"角色吗?',
      centered: true,
      onOk() {
        // 反向更新数据，我在这边采用的是click事件，这个时候点击是不会变更状态的，直接更改row.status 组件不会进行监听
        row.status = row.status === "0" ? "1" : "0";
        changeRoleStatus(row.roleId, row.status)
          .then(() => {
            message.success(text + "成功");
            getList();
          })
          .catch((err) => {
            getList();
          });
      },
      onCancel() {
        // 无需任何操作
        // row.status = row.status === "0" ? "1" : "0";
        // getList();
      },
    });
  }
  /**
   * @description: 弹窗确认点击事件
   * @param {*}
   * @return {*}
   */
  const handleOk = () => {
    // form 表单内容
    roleFormModel
      .validateFields()
      .then((values) => {
        if (visibleTitle !== "分配数据权限") {
          if (roleForm.roleId !== "") {
            updateRole({ ...roleForm, ...roleFormModel.getFieldsValue(), menuIds: checkedKeys }).then(() => {
              message.success("修改成功");
              setVisible(false);
              getList();
            });
          } else {
            addRole({ ...roleForm, ...roleFormModel.getFieldsValue(), menuIds: checkedKeys }).then(() => {
              message.success("增加成功");
              setVisible(false);
              // setConfirmLoading(false);
              getList();
            });
          }
        } else {
          dataScope({ ...roleForm, ...roleFormModel.getFieldsValue(), deptIds: checkedKeys }).then(() => {
            message.success("修改成功");
            setVisible(false);
            getList();
          });
        }
      })
      .catch((err) => {
        console.log("校验失败" + err);
      });
  };
  const handleCancel = () => {
    setExpandedKeys([]);
    setCheckedKeys([]);
    setRoleForm((data) => {
      data.dataScope = "";
      return { ...data };
    });
    setVisible(false);
  };
  /**
   * @description: 点击删除事件
   * @param {any} row
   * @return {*}
   */
  const delData = (row: any = { roleId: "" }) => {
    const roleIds = row.roleId || selectedRowKeys;
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认删除选中的数据项？",
      centered: true,
      onOk() {
        delRole(roleIds).then(() => {
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
   * @description: 导出函数
   * @param {*}
   * @return {*}
   */
  function handleExport() {
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认导出所有角色数据项？",
      centered: true,
      onOk() {
        exportRole(queryForm)
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
  function onSelectChange(selectedRowKeys: any) {
    setSelectedRowKeys(selectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // 树权限（展开/折叠）
  function handleCheckedTreeExpand(value: CheckboxChangeEvent, type: string) {
    if (type === "menu") {
      if (value.target.checked) {
        setExpandedKeys(dicts.menuOptionsAll);
      } else {
        setExpandedKeys([]);
      }
    } else if (type === "dept") {
      if (value.target.checked) {
        setExpandedKeys(dicts.deptOptionsAll);
      } else {
        setExpandedKeys([]);
      }
    }
  }
  // 树权限（全选/全不选）
  function handleCheckedTreeNodeAll(value: CheckboxChangeEvent, type: string) {
    if (type === "menu") {
      if (value.target.checked) {
        setCheckedKeys(dicts.menuOptionsAll);
      } else {
        setCheckedKeys([]);
      }
    } else if (type === "dept") {
      if (value.target.checked) {
        setCheckedKeys(dicts.deptOptionsAll);
      } else {
        setCheckedKeys([]);
      }
    }
  }
  // 树权限（父子联动）
  function handleCheckedTreeConnect(value: CheckboxChangeEvent, type: string) {
    console.log(type);
    if (type === "menu") {
      setRoleForm((data: any) => {
        data.menuCheckStrictly = value.target.checked;
        return { ...data };
      });
    } else if (type === "dept") {
      setRoleForm((data: any) => {
        data.deptCheckStrictly = value.target.checked;
        return { ...data };
      });
    }
  }
  /** 查询菜单树结构 */
  function getMenuTreeselect() {
    menuTreeselect().then((response: any) => {
      const menuOptionsAll: any[] = [];
      function callback(item: any) {
        item.forEach((e: any) => {
          if (e.children) {
            callback(e.children);
          }
          menuOptionsAll.push(e.id);
        });
      }
      callback(response.data);
      setDicts((data: any) => {
        data.menuOptionsAll = menuOptionsAll;
        data.menuOptions = response.data;
        return data;
      });
    });
  }
  /** 查询部门树结构 */
  function getDeptTreeselect() {
    deptTreeselect().then((response) => {
      const deptOptionsAll: any[] = [];
      function callback(item: any) {
        item.forEach((e: any) => {
          if (e.children) {
            callback(e.children);
          }
          deptOptionsAll.push(e.id);
        });
      }
      callback(response.data);
      setDicts((data: any) => {
        data.deptOptionsAll = deptOptionsAll;
        data.deptOptions = response.data;
        return data;
      });
    });
  }
  /** 根据角色ID查询菜单树结构 */
  function getRoleMenuTreeselect(roleId: string) {
    return roleMenuTreeselect(roleId).then((response: any) => {
      setDicts((data: any) => {
        data.menuOptions = response.menus;
        return { ...data };
      });
      return response;
    });
  }
  /** 根据角色ID查询部门树结构 */
  function getRoleDeptTreeselect(roleId: string) {
    return roleDeptTreeselect(roleId).then((response: any) => {
      setDicts((data: any) => {
        data.deptOptions = response.depts;
        return { ...data };
      });
      return response;
    });
  }
  function dataScopeChange(e: any) {
    console.log(e);
    setRoleForm((data: any) => {
      data.dataScope = e;
      return { ...data };
    });
  }
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand = (expandedKeysValue: any) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: any) => {
    if (Array.isArray(checkedKeysValue)) {
      setCheckedKeys(checkedKeysValue);
    } else {
      setCheckedKeys(checkedKeysValue.checked);
    }
  };

  const onSelect = (selectedKeysValue: any, info: any) => {
    console.log("onSelect", info);
    setSelectedKeys(selectedKeysValue);
  };
  return (
    <div className="Role">
      {/* 搜索条件展示区域 */}
      {showQueryForm ? (
        <Form form={queryFormRef} className="queryForm" name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="角色名称" name="roleName">
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="权限字符" name="roleKey">
                <Input placeholder="请输入权限字符" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="角色状态" name="status">
                <Select placeholder="请输入角色状态" allowClear>
                  <Option value="0">启用</Option>
                  <Option value="1">停用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="操作时间" name="time">
                <RangePicker format={dateFormat} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col offset={18} span={6}>
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
        <Col style={{ marginRight: 20 }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              showModal("添加角色");
            }}
          >
            新增
          </Button>
        </Col>
        <Col style={{ marginRight: 20 }}>
          <Button
            disabled={selectedRowKeys.length !== 1}
            onClick={() => {
              showModal("修改角色");
            }}
            icon={<EditOutlined />}
          >
            修改
          </Button>
        </Col>
        <Col style={{ marginRight: 20 }}>
          <Button icon={<DeleteOutlined />} onClick={delData} disabled={selectedRowKeys.length <= 0}>
            删除
          </Button>
        </Col>
        <Col style={{ marginRight: 20 }} onClick={handleExport}>
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
        <Table style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.roleId} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        <RuoYiPagination   current={queryForm.pageNum} 
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        />
      </Row>
      {/* 增加修改表单区域 */}
      <Modal destroyOnClose className="Role-CurdModal" centered width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={roleFormModel} name="roleFormModel" labelCol={{ style: { width: 90 } }} initialValues={{ status: "0", roleSort: 0 }} autoComplete="off">
          <Form.Item label="角色名称" name="roleName" rules={[{ required: true, message: "角色名称不能为空" }]}>
            <Input disabled={visibleTitle === "分配数据权限"} placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item label="权限字符" name="roleKey" rules={[{ required: true, message: "权限字符不能为空" }]}>
            <Input disabled={visibleTitle === "分配数据权限"} placeholder="请输入权限字符" />
          </Form.Item>
          {visibleTitle !== "分配数据权限" && (
            <Form.Item label="角色顺序" name="roleSort" rules={[{ required: true, message: "角色顺序不能为空" }]}>
              <InputNumber placeholder="请输入角色顺序" />
            </Form.Item>
          )}
          {visibleTitle !== "分配数据权限" && (
            <Form.Item label="角色状态" name="status">
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
          )}
          {visibleTitle === "分配数据权限" && (
            <Form.Item label="用户性别" name="dataScope">
              <Select value={roleForm.dataScope} placeholder="请选择用户性别" onChange={dataScopeChange}>
                {dicts.dataScopeOptions.map((dict: any) => {
                  return (
                    <Option value={dict.value} key={"dataScope" + dict.label}>
                      {dict.label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          )}
          {roleForm.dataScope !== "2" && visibleTitle === "分配数据权限" ? null : (
            <Form.Item label="菜单权限">
              <Checkbox
                onChange={(event) => {
                  handleCheckedTreeExpand(event, visibleTitle !== "分配数据权限" ? "menu" : "dept");
                }}
              >
                展开/折叠
              </Checkbox>
              <Checkbox
                onChange={(event) => {
                  handleCheckedTreeNodeAll(event, visibleTitle !== "分配数据权限" ? "menu" : "dept");
                }}
              >
                全选/全不选
              </Checkbox>
              <Checkbox
                onChange={(event) => {
                  handleCheckedTreeConnect(event, visibleTitle !== "分配数据权限" ? "menu" : "dept");
                }}
                checked={visibleTitle === "分配数据权限" ? roleForm.deptCheckStrictly : roleForm.menuCheckStrictly}
              >
                父子联动
              </Checkbox>
              {visibleTitle === "分配数据权限" ? (
                <Tree checkStrictly={!roleForm.deptCheckStrictly} fieldNames={{ title: "label", key: "id", children: "children" }} checkable onExpand={onExpand} expandedKeys={expandedKeys} autoExpandParent={autoExpandParent} onCheck={onCheck} checkedKeys={checkedKeys} onSelect={onSelect} selectedKeys={selectedKeys} treeData={dicts.deptOptions} />
              ) : (
                <Tree checkStrictly={!roleForm.menuCheckStrictly} fieldNames={{ title: "label", key: "id", children: "children" }} checkable onExpand={onExpand} expandedKeys={expandedKeys} autoExpandParent={autoExpandParent} onCheck={onCheck} checkedKeys={checkedKeys} onSelect={onSelect} selectedKeys={selectedKeys} treeData={dicts.menuOptions} />
              )}
            </Form.Item>
          )}

          {visibleTitle !== "分配数据权限" ? (
            <Row>
              <Col span={24}>
                <Form.Item label="备注" name="remark">
                  <Input.TextArea placeholder="请输入内容" />
                </Form.Item>
              </Col>
            </Row>
          ) : null}
        </Form>
      </Modal>
    </div>
  );
}
export default Role;
