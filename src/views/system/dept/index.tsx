/*
 * @Author: your name
 * @Date: 2021-10-22 10:27:17
 * @LastEditTime: 2021-11-01 14:44:50
 * @LastEditors: Please set LastEditors
 * @Description: 部门管理
 * @FilePath: /use-hooks/src/views/system/dept/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { TreeSelect, InputNumber, Space, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "../../../api/system/dept";
import { selectDictLabel } from "../../../utils/ruoyi";
import { getDicts } from "../../../api/global";
import { handleTree } from "../../../utils/ruoyi";
// import RuoYiPagination from "../../../compoents/RuoYiPagination";

const { confirm } = Modal;
const { Option } = Select;
function Dept() {
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
      title: "部门名称",
      // align: "center",
      dataIndex: "deptName",
    },
    {
      title: "排序",
      align: "center",
      dataIndex: "orderNum",
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
      align:'center',
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
  const [deptFormModel] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加部门");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [deptForm, setDeptForm] = useState({
    deptId: "",
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
    listDept({ ...queryForm }).then((res: any) => {
      setGetLoading(false);
      setTableData(handleTree(res.data, "deptId"));
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
  function showModal(titleName: string, row: any = { deptId: "" }) {
    setVisibleTitle(titleName);
    deptFormModel.resetFields();
    setDeptForm(() => {
      return {
        deptId: "",
        parentId: "",
      };
    });
    const deptId = row.deptId;
    if (titleName === "修改部门") {
      // 调用查询详细接口
      getDept(deptId).then((response: any) => {
        setDeptForm({ ...response.data });
        deptFormModel.setFieldsValue({
          ...response.data,
        });
      });
      listDeptExcludeChild(row.deptId).then((response) => {
        setDicts({ ...dicts, deptOptions: handleTree(response.data, "deptId") });
      });
    } else {
      deptFormModel.setFieldsValue({
        parentId: deptId,
      });
      listDept().then((response) => {
        setDicts({ ...dicts, deptOptions: handleTree(response.data, "deptId") });
      });
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
    deptFormModel
      .validateFields()
      .then((values) => {
        console.log(values);
        if (deptForm.deptId !== "") {
          updateDept({ ...deptForm, ...deptFormModel.getFieldsValue() }).then(() => {
            message.success("修改成功");
            // setConfirmLoading(false);
            setVisible(false);
            getList();
          });
        } else {
          addDept({ ...deptFormModel.getFieldsValue() }).then(() => {
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
  const delData = (row: any = { deptId: "" }) => {
    const deptIds = row.deptId;
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认删除选中的数据项？",
      centered: true,
      onOk() {
        delDept(deptIds).then(() => {
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
    setDeptForm((data) => {
      data.parentId = value;
      return { ...data };
    });
  }
  return (
    <div className="Dept">
      {/* 搜索条件展示区域 */}
      {showQueryForm ? (
        <Form form={queryFormRef} className="queryForm" name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="部门名称" name="deptName">
                <Input placeholder="请输入部门名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status">
                <Select placeholder="请选择状态" allowClear>
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
        {<Table key={new Date().getTime()} defaultExpandAllRows dataSource={tableData} style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.deptId} columns={columns} />}
        {/* <RuoYiPagination   current={queryForm.pageNum} 
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        /> */}
      </Row>
      {/* 增加修改表单区域 */}
      <Modal centered width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={deptFormModel} name="deptFormModel" labelCol={{ style: { width: 90 } }} initialValues={{ status: "0", deptSort: 0 }} autoComplete="off">
          {deptForm.parentId > "0" || deptForm.parentId === "" ? (
            <Row>
              <Col span={24}>
                <Form.Item label="上级部门" name="parentId" rules={[{ required: true, message: "上级部门不能为空" }]}>
                  <TreeSelect placeholder="请选择上级部门" style={{ width: "100%" }} fieldNames={{ label: "deptName", value: "deptId", children: "children" }} onChange={onSelectTreeChange} value={deptForm.parentId} dropdownStyle={{ maxHeight: 400, overflow: "auto" }} treeData={dicts.deptOptions} treeDefaultExpandAll />
                </Form.Item>
              </Col>
            </Row>
          ) : null}

          <Row>
            <Col span={12}>
              <Form.Item label="部门名称" name="deptName" rules={[{ required: true, message: "部门名称不能为空" }]}>
                <Input placeholder="请输入部门名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="显示排序" name="orderNum" rules={[{ required: true, message: "显示排序不能为空" }]}>
                <InputNumber placeholder="请输入显示排序" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="负责人" name="leader">
                <Input placeholder="请输入负责人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" name="phone">
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="邮箱" name="email">
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="部门状态" name="status">
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
        </Form>
      </Modal>
    </div>
  );
}
export default Dept;
