/*
 * @Author: your name
 * @Date: 2021-11-11 11:26:30
 * @LastEditTime: 2021-11-24 09:32:27
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/views/monitor/online/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import { InputNumber, Space, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { list, forceLogout } from "api/monitor/online";
import RuoYiPagination from "compoents/RuoYiPagination";
import { parseTime } from "utils/ruoyi";

const { confirm } = Modal;
const { Option } = Select;
function Online() {
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
  });
  const [queryFormRef] = Form.useForm();
  const [showQueryForm, setShowQueryForm] = useState(true);
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
      title: "序号",
      align: "center",
      dataIndex: "tokenId",
      render: (text: any, row: any, index: number) => <>{(queryForm.pageNum - 1) * queryForm.pageSize + index + 1}</>,
    },
    {
      title: "会话编号",
      align: "center",
      dataIndex: "tokenId",
      ellipsis: true,
    },
    {
      title: "登录名称",
      align: "center",
      dataIndex: "userName",
      ellipsis: true,
    },
    {
      title: "部门名称",
      align: "center",
      dataIndex: "deptName",
      ellipsis: true,
    },
    {
      title: "主机",
      align: "center",
      dataIndex: "ipaddr",
      ellipsis: true,
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
      title: "登录时间",
      align: "center",
      dataIndex: "loginTime",
      render: (text: any) => {
        return <span>{parseTime(text)}</span>;
      },
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
                  delData(row);
                }}
              >
                <DeleteOutlined />
                强退
              </a>
            </Space>
          </>
        );
      },
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
      data.ipaddr = form.ipaddr;
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
   * @description: 点击删除事件
   * @param {any} row
   * @return {*}
   */
  const delData = (row: any = { tokenId: "" }) => {
    const tokenIds = row.tokenId || selectedRowKeys;
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认强退选中的数据项？",
      centered: true,
      onOk() {
        forceLogout(tokenIds).then(() => {
          getList();
          message.success("删除成功");
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
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
      {/* 表格区域 */}
      <Row>
        <Table style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.tokenId} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        <RuoYiPagination
          current={queryForm.pageNum}
          total={total}
          onChange={(page: any, pageSize: any) => {
            console.log(page);
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        />
      </Row>
    </div>
  );
}
export default Online;
