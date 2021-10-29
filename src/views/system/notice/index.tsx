/*
 * @Author: your name
 * @Date: 2021-10-25 13:47:29
 * @LastEditTime: 2021-10-29 16:05:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/system/notice/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { Space, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from "../../../api/system/notice";
import { selectDictLabel } from "../../../utils/ruoyi";
import { getDicts } from "../../../api/global";
import RuoYiPagination from "../../../compoents/RuoYiPagination";
import Editor from "../../../compoents/Editor";

const { confirm } = Modal;
const { Option } = Select;
function Notice() {
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
    noticeTitle: "",
    createBy: "",
    noticeType: "",
  });
  const [queryFormRef] = Form.useForm();
  const [showQueryForm, setShowQueryForm] = useState(true);
  // 字典列表
  const [dicts, setDicts] = useState({
    sys_notice_status: [],
    sys_notice_type: [],
  });
  // 加载效果
  const [getLoading, setGetLoading] = useState(false);
  // 表格数据
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  // 表格选中行 KEY 值
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 表格列头对应字段
  const columns = [
    {
      title: "公告标题",
      dataIndex: "noticeTitle",
    },
    {
      title: "公告类型",
      dataIndex: "noticeType",
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_notice_type, text)}</>,
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_notice_status, text)}</>,
    },
    {
      title: "创建者",
      dataIndex: "createBy",
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
                  showModal("修改公告", row);
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
            </Space>
          </>
        );
      },
    },
  ];
  // 表单弹窗
  const [noticeFormModel] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加公告");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [noticeForm, setNoticeForm] = useState({
    noticeId: "",
    noticeContent: "",
  });
  /**
   * @description: 生命周期初始化
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    initComponent.current = false;
    getDicts("sys_notice_status").then((response) => {
      setDicts((data) => {
        data.sys_notice_status = response.data;
        return data;
      });
    });
    getDicts("sys_notice_type").then((response) => {
      setDicts((data) => {
        data.sys_notice_type = response.data;
        return data;
      });
    });
    getList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // 监听副作用
  useEffect(() => {
    if (initComponent.current) return;
    // 监听queryParams变化
    getList();
  }, [queryForm]); // eslint-disable-line react-hooks/exhaustive-deps
  /**
   * @description: 获取表格信息
   * @param {*}
   * @return {*}
   */
  function getList() {
    setGetLoading(true);
    listNotice({ ...queryForm }).then((res: any) => {
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
      data.noticeTitle = form.noticeTitle;
      data.createBy = form.createBy;
      data.noticeType = form.noticeType;
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
  function showModal(titleName: string, row: any = { noticeId: "" }) {
    setVisibleTitle(titleName);
    noticeFormModel.resetFields();
    setNoticeForm(() => {
      return {
        noticeId: "",
        noticeContent: "",
      };
    });
    if (titleName === "修改公告") {
      const noticeId = row.noticeId || selectedRowKeys[0];
      // 调用查询详细接口
      getNotice(noticeId).then((response: any) => {
        noticeFormModel.setFieldsValue({
          ...response.data,
        });
        setNoticeForm({ ...response.data });
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
    noticeFormModel
      .validateFields()
      .then((values) => {
        if (noticeForm.noticeId !== "") {
          updateNotice({ ...noticeForm, ...noticeFormModel.getFieldsValue() }).then(() => {
            message.success("修改成功");
            // setConfirmLoading(false);
            setVisible(false);
            getList();
          });
        } else {
          addNotice({ ...noticeFormModel.getFieldsValue() }).then(() => {
            message.success("增加成功");
            setVisible(false);
            // setConfirmLoading(false);
            getList();
          });
        }
      })
      .catch((err) => {
        console.log("校验失败", err);
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
  const delData = (row: any = { noticeId: "" }) => {
    const noticeIds = row.noticeId || selectedRowKeys;
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认删除选中的数据项？",
      centered: true,
      onOk() {
        delNotice(noticeIds).then(() => {
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
              <Form.Item label="公告标题" name="noticeTitle">
                <Input placeholder="请输入公告标题" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="操作人员" name="createBy">
                <Input placeholder="请输入操作人员" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="类型" name="noticeType">
                <Select placeholder="请选择类型" allowClear>
                  {dicts.sys_notice_type.map((dict: any) => {
                    return (
                      <Option value={dict.dictValue} key={"noticeTypeQueryForm" + dict.dictValue}>
                        {dict.dictLabel}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
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
              showModal("添加公告");
            }}
          >
            新增
          </Button>
        </Col>
        <Col  style={{ marginRight: 20 }}>
          <Button
            disabled={selectedRowKeys.length !== 1}
            onClick={() => {
              showModal("修改公告");
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
        <Table style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.noticeId} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        <RuoYiPagination
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        />
      </Row>
      {/* 增加修改表单区域 */}
      <Modal destroyOnClose centered width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={noticeFormModel} name="noticeFormModel" labelCol={{ style: { width: 90 } }} initialValues={{ status: "0", postSort: 0 }} autoComplete="off">
          <Row>
            <Col span={12}>
              <Form.Item label="公告标题" name="noticeTitle" rules={[{ required: true, message: "公告标题不能为空" }]}>
                <Input placeholder="请输入公告标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="公告类型" name="noticeType" rules={[{ required: true, message: "公告类型不能为空" }]}>
                <Select placeholder="请选择公告类型" allowClear>
                  {dicts.sys_notice_type.map((dict: any) => {
                    return (
                      <Option value={dict.dictValue} key={"noticeType" + dict.dictValue}>
                        {dict.dictLabel}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="状态" name="status">
            <Radio.Group>
              {dicts.sys_notice_status.map((dict: any) => {
                return (
                  <Radio value={dict.dictValue} key={"status" + dict.dictValue}>
                    {dict.dictLabel}
                  </Radio>
                );
              })}
            </Radio.Group>
          </Form.Item>
          <Row>
            <Col span={24}>
              <Form.Item label="内容" name="noticeContent">
                <Editor
                  value={noticeForm.noticeContent}
                  onChange={(noticeContent: any) => {
                    setNoticeForm((data) => {
                      data.noticeContent = noticeContent;
                      return { ...data };
                    });
                  }}
                ></Editor>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
export default Notice;
