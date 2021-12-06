/*
 * @Author: your name
 * @Date: 2021-11-30 10:16:33
 * @LastEditTime: 2021-12-06 09:55:05
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/views/monitor/job/jobLog.tsx
 */

import { useState, useEffect, useRef, useContext } from "react";
import "./jobLog.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { Descriptions, Space, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message, DatePicker, Tag } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignBottomOutlined, EyeOutlined } from "@ant-design/icons";
import { listJobLog, delJobLog, exportJobLog, cleanJobLog } from "api/monitor/joblog";
import { getJob } from "api/monitor/job";
import moment from "moment";
import { listType, getType } from "api/system/dict/type";
import { selectDictLabel } from "../../../utils/ruoyi";
import { getDicts } from "../../../api/global";
import { download } from "../../../utils/ruoyi";
import RuoYiPagination from "../../../compoents/RuoYiPagination";
import { Context } from "views/App/App";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const { confirm } = Modal;
const { Option } = Select;
function JobLog(props: any) {
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
    jobName: "",
    jobGroup: "",
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
    sys_normal_disable: [],
    sys_job_group: [],
    sys_common_status: [],
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
      title: "日志编号",
      align: "center",
      dataIndex: "jobLogId",
    },
    {
      title: "任务名称",
      align: "center",
      dataIndex: "jobName",
      ellipsis: true,
    },
    {
      title: "任务组名",
      align: "center",
      dataIndex: "jobGroup",
      ellipsis: true,
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_job_group, text)}</>,
    },
    {
      title: "调用目标字符串",
      align: "center",
      dataIndex: "invokeTarget",
      ellipsis: true,
    },
    {
      title: "日志信息",
      align: "center",
      dataIndex: "jobMessage",
      ellipsis: true,
    },
    {
      title: "执行状态",
      align: "center",
      dataIndex: "status",
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_common_status, text)}</>,
    },
    {
      title: "执行时间",
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
                  showModal("调度日志详细", row);
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
  const [dataFormModel] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("调度日志详细");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [dataForm, setDataForm] = useState({
    jobLogId: "",
    jobName: "",
    jobGroup: "",
    createTime: "",
    invokeTarget: "",
    jobMessage: "",
    status: "",
    exceptionInfo: "",
  });
  const [defaultDictType, setDefaultDictType] = useState("");
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
    // 每次加载就会相当于是点击了tabs栏
    const arr = window.location.href.split("#");
    AppComponent.toClickNavLink(arr[1], "字典数据");
    const jobLogId = props.match ? props.match.params.id : "";
    initComponent.current = false;
    getDicts("sys_normal_disable").then((response) => {
      setDicts((data) => {
        data.sys_normal_disable = response.data;
        return data;
      });
    });
    getDicts("sys_job_group").then((response) => {
      setDicts((data) => {
        data.sys_job_group = response.data;
        return data;
      });
    });
    getDicts("sys_common_status").then((response) => {
      setDicts((data) => {
        data.sys_common_status = response.data;
        return data;
      });
    });
    /**
     * @description: 获取当前的type类型
     * @param {*} jobLogId
     * @return {*}
     */
    if (jobLogId !== "0") {
      getJob(jobLogId).then((response: any) => {
        queryFormRef.setFieldsValue({
          jobName: response.data.jobName,
          jobGroup: response.data.jobGroup,
        });
        onQueryFinish({ jobName: response.data.jobName, jobGroup: response.data.jobGroup });
      });
    } else {
      getList();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * @description: 获取表格信息
   * @param {*}
   * @return {*}
   */
  function getList() {
    setGetLoading(true);
    listJobLog({ ...queryForm }).then((res: any) => {
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
      data.jobName = form.jobName;
      data.jobGroup = form.jobGroup;
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
    queryFormRef.setFieldsValue({
      dictType: defaultDictType,
    });

    onQueryFinish({ dictType: defaultDictType });
  }

  /**
   * @description: 点击增加修改事件
   * @param {*}
   * @return {*}
   */
  function showModal(titleName: string, row: any = { jobLogId: "" }) {
    setVisibleTitle(titleName);
    setDataForm(() => {
      return { ...row };
    });
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
  const delJobLogs = (row: any = { jobLogId: "" }, title?: string) => {
    const jobLogIds = row.jobLogId || selectedRowKeys;
    if (title === "删除") {
      confirm({
        title: "警告",
        icon: <ExclamationCircleOutlined />,
        content: "是否确认删除选中的数据项？",
        centered: true,
        onOk() {
          delJobLog(jobLogIds).then(() => {
            getList();
            message.success("删除成功");
          });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else if (title === "清空") {
      confirm({
        title: "警告",
        icon: <ExclamationCircleOutlined />,
        content: "是否确认清空所有的日志项？",
        centered: true,
        onOk() {
          cleanJobLog().then(() => {
            getList();
            message.success("清空成功");
          });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }
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
      content: "是否确认导出所有数据项？",
      centered: true,
      onOk() {
        exportJobLog(queryForm)
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
    <div className="Data">
      {/* 搜索条件展示区域 */}
      {showQueryForm ? (
        <Form form={queryFormRef} className="queryForm" name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="任务名称" name="jobName">
                <Input placeholder="请输入任务名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="任务组名" name="jobGroup">
                <Select placeholder="请选择任务组名">
                  {dicts.sys_job_group.map((dict: any) => {
                    return (
                      <Option value={dict.dictValue} key={"jobGroup" + dict.dictValue}>
                        {dict.dictLabel}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="执行状态" name="status">
                <Select placeholder="请选择执行状态">
                  {dicts.sys_common_status.map((dict: any) => {
                    return (
                      <Option value={dict.dictValue} key={"sys_common_status" + dict.dictValue}>
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
      <Row style={{ marginBottom: 20 }}>
        <Col style={{ marginRight: 20 }}>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              delJobLogs({}, "删除");
            }}
            disabled={selectedRowKeys.length <= 0}
          >
            删除
          </Button>
        </Col>
        <Col style={{ marginRight: 20 }}>
          <Button
            onClick={() => {
              delJobLogs({}, "清空");
            }}
            icon={<DeleteOutlined />}
          >
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
        <Table style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.jobLogId} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        <RuoYiPagination
          current={queryForm.pageNum}
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        />
      </Row>
      {/* 增加修改表单区域 */}
      <Modal centered width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={dataFormModel} name="dataFormModel" labelCol={{ style: { width: 90 } }} initialValues={{ dictSort: "0", status: "0", listClass: "default" }} autoComplete="off">
          <Descriptions column={2}>
            <Descriptions.Item label="日志序号">{dataForm.jobLogId}</Descriptions.Item>
            <Descriptions.Item label="任务名称">{dataForm.jobName}</Descriptions.Item>
            <Descriptions.Item label="任务分组">{dataForm.jobGroup}</Descriptions.Item>
            <Descriptions.Item label="调用方法">{dataForm.invokeTarget}</Descriptions.Item>
            <Descriptions.Item span={2} label="日志信息">
              {dataForm.jobMessage}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="执行状态">
              {dataForm.status === "0" ? "正常" : "失败"}
            </Descriptions.Item>
            {dataForm.status === "1" && (
              <Descriptions.Item span={2} label="异常信息">
                {dataForm.exceptionInfo}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Form>
      </Modal>
    </div>
  );
}
export default JobLog;
