/*
 * @Author: your name
 * @Date: 2021-10-27 09:51:19
 * @LastEditTime: 2021-11-23 16:12:39
 * @LastEditors: Please set LastEditors
 * @Description: 操作日志
 * @FilePath: /use-hooks/src/views/system/log/operlog/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "compoents/HeaderBar";

import { Space, Input, Row, Col, Form, Button, Select, Table, Modal, Descriptions, message, DatePicker } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, DeleteOutlined, EyeOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { list, delOperlog, cleanOperlog, exportOperlog } from "api/system/log/operlog";
import { selectDictLabel } from "utils/ruoyi";
import { getDicts } from "api/global";
import { download } from "utils/ruoyi";
import moment from "moment";
import RuoYiPagination from "compoents/RuoYiPagination";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const { confirm } = Modal;
const { Option } = Select;
function OperLog() {
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
    title: "",
    operName: "",
    businessType: "",
    status: "",
    params: {
      beginTime: "",
      endTime: "",
    },
  });
  const [queryFormRef] = Form.useForm();
  const [showQueryForm, setShowQueryForm] = useState(true);
  // 字典列表
  const [dicts, setDicts] = useState({
    sys_common_status: [],
    sys_oper_type: [],
  });
  // 加载效果
  const [getLoading, setGetLoading] = useState(false);
  // 表格数据
  const [tableData, setTableData]: any[] = useState([]);
  const [total, setTotal] = useState(0);
  // 表格选中行 KEY 值
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 表格列头对应字段
  const columns: any = [
    {
      title: "日志编号",
      align: "center",
      dataIndex: "operId",
    },
    {
      title: "系统模块",
      align: "center",
      dataIndex: "title",
    },
    {
      title: "操作类型",
      align: "center",
      dataIndex: "businessType",
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_oper_type, text)}</>,
    },
    {
      title: "请求方式",
      align: "center",
      dataIndex: "requestMethod",
    },
    {
      title: "操作人员",
      align: "center",
      dataIndex: "operName",
    },
    {
      title: "操作地址",
      align: "center",
      dataIndex: "operIp",
    },
    {
      title: "操作地点",
      align: "center",
      dataIndex: "operLocation",
    },

    {
      title: "操作状态",
      align: "center",
      dataIndex: "status",
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_common_status, text)}</>,
    },
    {
      title: "操作时间",
      align: "center",
      dataIndex: "operTime",
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
                  showModal("操作日志详细", row);
                }}
              >
                <EyeOutlined />
                详细
              </a>
            </Space>
          </>
        );
      },
    },
  ];
  // 表单弹窗
  //   const [operLogFormModel] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加公告");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [operLogForm, setOperLogForm] = useState({
    operId: "",
    title: "",
    operName: "",
    operIp: "",
    operLocation: "",
    operUrl: "",
    requestMethod: "",
    method: "",
    operParam: "",
    jsonResult: "",
    status: 0,
    operTime: "",
    errorMsg: "",
    businessType: "",
    noticeContent: "",
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
    getDicts("sys_common_status").then((response) => {
      setDicts((data) => {
        data.sys_common_status = response.data;
        return data;
      });
    });
    getDicts("sys_oper_type").then((response) => {
      setDicts((data) => {
        data.sys_oper_type = response.data;
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
    list({ ...queryForm }).then((res: any) => {
      setGetLoading(false);
      setTableData([...res.rows]);
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
      data.status = form.status;
      data.title = form.title;
      data.operName = form.operName;
      data.businessType = form.businessType;

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
   * @description: 点击增加修改事件
   * @param {*}
   * @return {*}
   */
  function showModal(titleName: string, row: any = { title: "" }) {
    setVisibleTitle(titleName);
    setOperLogForm(() => {
      return {
        operId: "",
        title: "",
        operName: "",
        operIp: "",
        operLocation: "",
        operUrl: "",
        requestMethod: "",
        method: "",
        operParam: "",
        jsonResult: "",
        status: 0,
        operTime: "",
        errorMsg: "",
        businessType: "",
        noticeContent: "",
      };
    });
    if (titleName === "操作日志详细") {
      setOperLogForm({ ...row });
    }
    setVisible(true);
  }
  /**
   * @description: 弹窗确认点击事件
   * @param {*}
   * @return {*}
   */
  const handleOk = () => {
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  /**
   * @description: 点击删除事件
   * @param {any} row
   * @return {*}
   */
  const delData = (row: any = { operId: "" }) => {
    const operIds = row.operId || selectedRowKeys;
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认删除选中的数据项？",
      centered: true,
      onOk() {
        delOperlog(operIds).then(() => {
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
   * @description: 点击清空事件
   * @param {any} row
   * @return {*}
   */
  const clearData = () => {
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认清空所有数据项？",
      centered: true,
      onOk() {
        cleanOperlog().then(() => {
          getList();
          message.success("清空成功");
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
      content: "是否确认导出所有操作日志数据项？",
      centered: true,
      onOk() {
        exportOperlog(queryForm)
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
  return (
    <div className="OperLog">
      {/* 搜索条件展示区域 */}
      {showQueryForm ? (
        <Form form={queryFormRef} className="queryForm" name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="系统模块" name="title">
                <Input placeholder="请输入系统模块" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="操作人员" name="operName">
                <Input placeholder="请输入操作人员" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="类型" name="businessType">
                <Select placeholder="请选择类型" allowClear>
                  {dicts.sys_oper_type.map((dict: any) => {
                    return (
                      <Option value={dict.dictValue} key={"businessTypeQueryForm" + dict.dictValue}>
                        {dict.dictLabel}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status">
                <Select placeholder="请选择状态" allowClear>
                  {dicts.sys_common_status.map((dict: any) => {
                    return (
                      <Option value={dict.dictValue} key={"statusQueryForm" + dict.dictValue}>
                        {dict.dictLabel}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item label="操作时间" name="time">
                <RangePicker format={dateFormat} />
              </Form.Item>
            </Col>
            <Col offset={12} span={6}>
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
            icon={<DeleteOutlined />}
            onClick={() => {
              delData();
            }}
            disabled={selectedRowKeys.length <= 0}
          >
            删除
          </Button>
        </Col>
        <Col style={{ marginRight: 20 }}>
          <Button icon={<DeleteOutlined />} onClick={clearData}>
            清空
          </Button>
        </Col>
        <Col style={{ marginRight: 20 }}>
          <Button icon={<VerticalAlignBottomOutlined />} onClick={handleExport}>
            导出
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
        <Table style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.operId} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        <RuoYiPagination   current={queryForm.pageNum} 
          
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        />
      </Row>
      {/* 增加修改表单区域 */}
      <Modal destroyOnClose centered width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Descriptions column={2}>
          <Descriptions.Item label="操作模块">
            {operLogForm.title}/{selectDictLabel(dicts.sys_oper_type, operLogForm.businessType)}
          </Descriptions.Item>
          <Descriptions.Item label="请求地址">{operLogForm.operUrl}</Descriptions.Item>
          <Descriptions.Item label="登录信息">
            {operLogForm.operName}/{operLogForm.operIp}/{operLogForm.operLocation}
          </Descriptions.Item>
          <Descriptions.Item label="请求方式">{operLogForm.requestMethod}</Descriptions.Item>
          <Descriptions.Item span={2} label="操作方法">
            {operLogForm.method}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="请求参数">
            {operLogForm.operParam}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="返回参数">
            {operLogForm.jsonResult}
          </Descriptions.Item>
          <Descriptions.Item label="操作状态">{operLogForm.status === 0 ? "正常" : "失败"}</Descriptions.Item>
          <Descriptions.Item label="操作时间">{operLogForm.operTime}</Descriptions.Item>
          {operLogForm.status === 1 && (
            <Descriptions.Item span={2} label="异常信息">
              {operLogForm.operTime}
            </Descriptions.Item>
          )}
        </Descriptions>
        ,
      </Modal>
    </div>
  );
}
export default OperLog;
