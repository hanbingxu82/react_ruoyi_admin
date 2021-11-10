/*
 * @Author: your name
 * @Date: 2021-11-08 11:20:22
 * @LastEditTime: 2021-11-10 15:09:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/system/menu/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "compoents/HeaderBar";

import { Popover, TreeSelect, InputNumber, Space, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "api/system/menu";
import { selectDictLabel } from "utils/ruoyi";
import { getDicts } from "api/global";
import { handleTree } from "utils/ruoyi";
import SvgIcon from "compoents/SvgIcon";
import IconSelect from "compoents/IconSelect";
// import RuoYiPagination from "compoents/RuoYiPagination";

const { confirm } = Modal;
const { Option } = Select;
function Menu() {
  /**
   * @description: 是否第一次加载组件
   * @param {*}
   * @return {*}
   */
  const initComponent = useRef(true);
  // 搜索条件
  const [queryForm, setQueryForm] = useState({
    // pageNum: 1,
    // pageSize: 10,
    deptName: "",
    status: "",
  });
  const [queryFormRef] = Form.useForm();
  const [showQueryForm, setShowQueryForm] = useState(true);
  // 字典列表
  const [dicts, setDicts] = useState({
    sys_normal_disable: [],
    deptOptions: [],
  });
  // 加载效果
  const [getLoading, setGetLoading] = useState(false);
  // 表格数据
  const [tableData, setTableData] = useState([]);
  //   const [total, setTotal] = useState(0);
  // 表格列头对应字段
  const columns: any = [
    {
      title: "菜单名称",
      // align: "center",
      dataIndex: "menuName",
    },
    {
      title: "图标",
      align: "center",
      width: 80,
      dataIndex: "icon",
      render: (text: any, row: any) => {
        return (
          <>
            <SvgIcon iconClass={text}></SvgIcon>
          </>
        );
      },
    },
    {
      title: "排序",
      align: "center",
      width: 80,
      dataIndex: "orderNum",
    },
    {
      title: "权限标识",

      align: "center",

      dataIndex: "perms",
      ellipsis: true,
    },
    {
      title: "组件路径",
      align: "center",

      dataIndex: "component",
      ellipsis: true,
    },
    {
      title: "状态",
      align: "center",
      width: 120,
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
      render: (text: any, row: any) => {
        return (
          <>
            <Space size="middle">
              <a
                onClick={() => {
                  showModal("修改部门", row);
                }}
              >
                <EditOutlined />
                修改
              </a>
              <a
                onClick={() => {
                  showModal("新增部门", row);
                }}
              >
                <PlusOutlined />
                新增
              </a>
              <a
                onClick={() => {
                  delData(row);
                }}
              >
                <DeleteOutlined />
                删除
              </a>
            </Space>
          </>
        );
      },
    },
  ];
  // 表单弹窗
  const [menuFormModel] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加部门");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [menuForm, setMenuForm] = useState({
    icon: "",
    menuId: "",
    menuType: "M",
    parentId: "",
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
    listMenu({ ...queryForm }).then((res: any) => {
      setGetLoading(false);
      setTableData(handleTree(res.data, "menuId"));
      //   setTotal(res.total);
    });
  }
  /**
   * @description: 搜索条件搜索事件
   * @param {any} form
   * @return {*}
   */
  function onQueryFinish(form: any) {
    setQueryForm((data) => {
      data.deptName = form.deptName;
      data.status = form.status;
      // if (form.time) {
      //   data.params.beginTime = moment(form.time[0]).format("YYYY-MM-DD");
      //   data.params.endTime = moment(form.time[1]).format("YYYY-MM-DD");
      // } else {
      //   data.params.beginTime = "";
      //   data.params.endTime = "";
      // }
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
  function showModal(titleName: string, row: any = { menuId: "" }) {
    setVisibleTitle(titleName);
    menuFormModel.resetFields();
    setMenuForm(() => {
      return {
        icon: "",
        menuId: "",
        menuType: "M",
        parentId: "",
      };
    });
    const menuId = row.menuId;
    if (titleName === "修改部门") {
      // 调用查询详细接口
      getMenu(menuId).then((response: any) => {
        setMenuForm({ ...response.data });
        menuFormModel.setFieldsValue({
          ...response.data,
        });
      });
    } else {
      menuFormModel.setFieldsValue({
        parentId: menuId,
      });
      //   listMenu().then((response) => {
      //     setDicts({ ...dicts, deptOptions: handleTree(response.data, "menuId") });
      //   });
    }
    setVisible(true);
  }
  /**
   * @description: 弹窗确认点击事件
   * @param {*}
   * @return {*}
   */
  const handleOk = () => {
    // form 表单内容
    menuFormModel
      .validateFields()
      .then((values) => {
        console.log(values);
        if (menuForm.menuId !== "") {
          updateMenu({ ...menuForm, ...menuFormModel.getFieldsValue() }).then(() => {
            message.success("修改成功");
            // setConfirmLoading(false);
            setVisible(false);
            getList();
          });
        } else {
          addMenu({ ...menuFormModel.getFieldsValue() }).then(() => {
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
   * @description: 点击删除事件
   * @param {any} row
   * @return {*}
   */
  const delData = (row: any = { menuId: "" }) => {
    const menuIds = row.menuId;
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认删除选中的数据项？",
      centered: true,
      onOk() {
        delMenu(menuIds).then(() => {
          getList();
          message.success("删除成功");
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  function onSelectTreeChange(value: string) {
    setMenuForm((data) => {
      data.parentId = value;
      return { ...data };
    });
  }
  function selected(name: string) {
    const obj = menuFormModel.getFieldsValue();
    obj.icon = name;
    menuFormModel.setFieldsValue({ ...obj });
    setMenuForm((data) => {
      data.icon = name;
      return { ...data };
    });
  }
  function menuTypeChange(e: any) {
    setMenuForm((data: any) => {
      data.menuType = e.target.value;
      return { ...data };
    });
  }
  return (
    <div className="Menu">
      {/* 搜索条件展示区域 */}
      {showQueryForm ? (
        <Form form={queryFormRef} className="queryForm" name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="菜单名称" name="deptName">
                <Input placeholder="请输入菜单名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="菜单状态" name="status">
                <Select placeholder="请选择菜单状态" allowClear>
                  <Option value="0">正常</Option>
                  <Option value="1">停用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} offset={6}>
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
              showModal("添加部门");
            }}
          >
            新增
          </Button>
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
        {<Table key={new Date().getTime()} defaultExpandAllRows dataSource={tableData} style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.menuId} columns={columns} />}
        {/* <RuoYiPagination
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        /> */}
      </Row>
      {/* 增加修改表单区域 */}
      <Modal centered width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={menuFormModel} name="menuFormModel" labelCol={{ style: { width: 90 } }} initialValues={{ menuType: "M", status: "0", deptSort: 0 }} autoComplete="off">
          <Form.Item label="上级菜单" name="parentId" rules={[{ required: true, message: "上级菜单不能为空" }]}>
            <TreeSelect placeholder="请选择上级菜单" style={{ width: "100%" }} fieldNames={{ label: "deptName", value: "menuId", children: "children" }} onChange={onSelectTreeChange} value={menuForm.parentId} dropdownStyle={{ maxHeight: 400, overflow: "auto" }} treeData={dicts.deptOptions} treeDefaultExpandAll />
          </Form.Item>
          <Form.Item label="菜单类型" name="menuType">
            <Radio.Group onChange={menuTypeChange}>
              <Radio value="M">目录</Radio>
              <Radio value="C">菜单</Radio>
              <Radio value="F">按钮</Radio>
            </Radio.Group>
          </Form.Item>
          {menuForm.menuType !== "F" ? (
            <Form.Item label="菜单类型" name="icon">
              <Popover placement="bottom" content={<IconSelect selected={selected} />} trigger="click">
                <Input value={menuForm.icon} readOnly placeholder="请输入菜单名称" suffix={menuForm.icon ? <SvgIcon iconClass={menuForm.icon} style={{ height: "32px", width: "16px" }} /> : null} />
              </Popover>
            </Form.Item>
          ) : null}

          <Row>
            <Col span={12}>
              <Form.Item label="菜单名称" name="menuName" rules={[{ required: true, message: "菜单名称不能为空" }]}>
                <Input placeholder="请输入菜单名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="显示排序" name="orderNum" rules={[{ required: true, message: "显示排序不能为空" }]}>
                <InputNumber placeholder="请输入显示排序" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {menuForm.menuType !== "F" ? (
              <Col span={12}>
                <Form.Item label="是否外链" name="isFrame">
                  <Radio.Group>
                    <Radio value="0">是</Radio>
                    <Radio value="1">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            ) : null}
            {menuForm.menuType !== "F" ? (
              <Col span={12}>
                <Form.Item label="路由地址" name="path">
                  <Input placeholder="请输入路由地址" />
                </Form.Item>
              </Col>
            ) : null}
          </Row>
          <Row>
            {menuForm.menuType !== "M" ? (
              <Col span={12}>
                <Form.Item label="权限字符" name="perms">
                  <Input placeholder="请输入权限字符" />
                </Form.Item>
              </Col>
            ) : null}
            {menuForm.menuType === "C" ? (
              <Col span={12}>
                <Form.Item label="组件路径" name="component">
                  <Input placeholder="请输入组件路径" />
                </Form.Item>
              </Col>
            ) : null}
          </Row>

          <Row>
            {menuForm.menuType !== "F" ? (
              <Col span={12}>
                <Form.Item label="显示状态" name="visible">
                  <Radio.Group>
                    <Radio value="0">显示</Radio>
                    <Radio value="1">隐藏</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            ) : null}
            {menuForm.menuType !== "F" ? (
              <Col span={12}>
                <Form.Item label="菜单状态" name="status">
                  <Radio.Group>
                    <Radio value="0">正常</Radio>
                    <Radio value="1">停用</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            ) : null}
          </Row>

          <Row>
            {menuForm.menuType === "C" ? (
              <Col span={12}>
                <Form.Item label="是否缓存" name="isCache">
                  <Radio.Group>
                    <Radio value="0">是</Radio>
                    <Radio value="1">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            ) : null}
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
export default Menu;
