/*
 * @Author: your name
 * @Date: 2021-10-27 09:51:01
 * @LastEditTime: 2021-11-01 14:45:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/system/log/logininfor/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "compoents/HeaderBar";

import { Input, Row, Col, Form, Button, Select, Table, Modal, Descriptions, message, DatePicker } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, DeleteOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { list, delLogininfor, cleanLogininfor, exportLogininfor } from "api/system/log/logininfor";
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
    ipaddr: "",
    userName: "",
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
      title: "访问编号",
      align: "center",
      dataIndex: "infoId",
    },
    {
      title: "用户名称",
      align: "center",
      dataIndex: "userName",
    },
    {
      title: "登录地址",
      align: "center",
      dataIndex: "ipaddr",
    },
    {
      title: "登录地点",
      align: "center",
      dataIndex: "loginLocation",
    },
    {
      title: "浏览器",
      align: "center",
      dataIndex: "browser",
    },
    {
      title: "操作系统",
      align: "center",
      dataIndex: "os",
    },

    {
      title: "登录状态",
      align: "center",
      dataIndex: "status",
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_common_status, text)}</>,
    },
    {
      title: "操作信息",
      align: "center",
      dataIndex: "msg",
    },

    {
      title: "登录日期",
      align: "center",
      dataIndex: "loginTime",
    },
  ];
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
      data.ipaddr = form.ipaddr;
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
        delLogininfor(operIds).then(() => {
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
        cleanLogininfor().then(() => {
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
        exportLogininfor(queryForm)
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
    <div className="LoginInfor">
      {/* 搜索条件展示区域 */}
      {showQueryForm ? (
        <Form form={queryFormRef} className="queryForm" name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="登录地址" name="ipaddr">
                <Input placeholder="请输入登录地址" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="用户名称" name="userName">
                <Input placeholder="请输入用户名称" />
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
        <Table style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.infoId} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        <RuoYiPagination
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        />
      </Row>
    </div>
  );
}
export default OperLog;
