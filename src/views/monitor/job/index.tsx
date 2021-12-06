/*
 * @Author: your name
 * @Date: 2021-11-24 10:10:10
 * @LastEditTime: 2021-12-03 10:54:13
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/views/monitor/job/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { Dropdown, Menu, Descriptions, Switch, Space, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignBottomOutlined, DoubleRightOutlined, KeyOutlined, BookOutlined, CaretRightOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { listJob, getJob, delJob, addJob, updateJob, exportJob, runJob, changeJobStatus } from "../../../api/monitor/job";
import { selectDictLabel } from "../../../utils/ruoyi";
import { getDicts } from "../../../api/global";
import { download } from "../../../utils/ruoyi";
import RuoYiPagination from "../../../compoents/RuoYiPagination";
import QnnReactCron from "qnn-react-cron";

const { confirm } = Modal;
const { Option } = Select;
function Job(props: any) {
  /**
   * @description: 是否第一次加载组件
   * @param {*}
   * @return {*}
   */
  const initComponent = useRef(true);

  let cronFns: any;
  let [value, setValue] = useState<any>("0,20,14,26 * * * * ? *");
  // 搜索条件
  const [queryForm, setQueryForm] = useState({
    pageNum: 1,
    pageSize: 10,
    jobName: "",
    jobGroup: "",
    status: "",
  });
  const [queryFormRef] = Form.useForm();
  const [showQueryForm, setShowQueryForm] = useState(true);
  // 字典列表
  const [dicts, setDicts]: any = useState({
    sys_job_group: [],
    sys_job_status: [],
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
            oneData(row);
          }}
          key="CaretRightOutlined"
          icon={<CaretRightOutlined />}
        >
          执行一次
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            getData(row);
          }}
          key="KeyOutlined"
          icon={<KeyOutlined />}
        >
          任务详细
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            goJobLog(row.jobId);
          }}
          key="BookOutlined"
          icon={<BookOutlined />}
        >
          调度日志
        </Menu.Item>
      </Menu>
    );
  };
  // 表格列头对应字段
  const columns: any = [
    {
      title: "任务编号",
      align: "center",
      dataIndex: "jobId",
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
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_job_group, text)}</>,
    },
    {
      title: "调用目标字符串",
      align: "center",
      dataIndex: "invokeTarget",
      ellipsis: true,
    },
    {
      title: "cron执行表达式",
      align: "center",
      dataIndex: "cronExpression",
      ellipsis: true,
    },
    {
      title: "状态",
      align: "center",
      dataIndex: "status",
      render: (text: any, row: any) => (
        <Switch
          // key={text + index + switchKey}
          checkedChildren="正常"
          onClick={() => {
            onTableSwitchChange(row);
          }}
          unCheckedChildren="暂停"
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
  const [visibleCron, setVisibleCron] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加角色");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [roleForm, setRoleForm] = useState({
    jobId: "",
    dataScope: "",
  });
  const [openView, setOpenView] = useState(false);
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
    getDicts("sys_job_group").then((response) => {
      console.log(response);
      setDicts((data: any) => {
        data.sys_job_group = response.data;
        return data;
      });
    });
    getDicts("sys_job_status").then((response) => {
      setDicts((data: any) => {
        data.sys_job_status = response.data;
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
    listJob({ ...queryForm }).then((res: any) => {
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
   * @description: 点击增加、修改、分配数据权限事件
   * @param {*}
   * @return {*}
   */
  function showModal(titleName: string, row: any = { jobId: "" }) {
    // setExpandedKeys([]);
    setVisibleTitle(titleName);
    roleFormModel.resetFields();
    setRoleForm((data: any) => {
      data.jobId = "";
      return data;
    });
    if (titleName !== "添加角色") {
      const jobId = row.jobId || selectedRowKeys[0];
      // 调用查询详细接口
      getJob(jobId).then((response: any) => {
        setRoleForm(() => {
          return { ...response.data };
        });
        roleFormModel.setFieldsValue({
          ...response.data,
        });
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
      content: '确认要"' + text + '""' + row.jobName + '"角色吗?',
      centered: true,
      onOk() {
        // 反向更新数据，我在这边采用的是click事件，这个时候点击是不会变更状态的，直接更改row.status 组件不会进行监听
        row.status = row.status === "0" ? "1" : "0";
        changeJobStatus(row.jobId, row.status)
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
  function handleOk() {
    // form 表单内容
    roleFormModel
      .validateFields()
      .then((values) => {
        if (roleForm.jobId !== "") {
          updateJob({ ...roleForm, ...roleFormModel.getFieldsValue() }).then(() => {
            message.success("修改成功");
            setVisible(false);
            getList();
          });
        } else {
          addJob({ ...roleForm, ...roleFormModel.getFieldsValue() }).then(() => {
            message.success("增加成功");
            setVisible(false);
            getList();
          });
        }
      })
      .catch((err) => {
        console.log("校验失败" + err);
      });
  }
  function handleCancel() {
    setRoleForm((data) => {
      data.dataScope = "";
      return { ...data };
    });
    setVisible(false);
  }
  /**
   * @description: 点击删除事件
   * @param {any} row
   * @return {*}
   */
  function delData(row: any = { jobId: "" }) {
    const jobIds = row.jobId || selectedRowKeys;
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认删除选中的数据项？",
      centered: true,
      onOk() {
        delJob(jobIds).then(() => {
          getList();
          message.success("删除成功");
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
  /**
   * @description: 执行一次
   * @param {any} row
   * @return {*}
   */
  function oneData(row: any) {
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,

      content: "确认要立即执行一次" + row.jobName + "任务吗？",
      centered: true,
      onOk() {
        runJob(row.jobId, row.jobGroup).then(() => {
          getList();
          message.success("操作成功");
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
  /**
   * @description: 任务详情
   * @param {any} row
   * @return {*}
   */
  function getData(row: any) {
    getJob(row.jobId).then((response: any) => {
      setRoleForm({ ...response.data });
      setOpenView(true);
    });
  }
  function goJobLog(id: any = "0") {
    props.history.push("/monitor/job-log/" + id);
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
      content: "是否确认导出所有定时任务数据项？",
      centered: true,
      onOk() {
        exportJob(queryForm)
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
    <div className="Role">
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
                <Select allowClear placeholder="请输入任务组名">
                  {dicts.sys_job_group.map((dict: any) => {
                    return (
                      <Option value={dict.dictValue} key={"sys_job_group" + dict.dictLabel}>
                        {dict.dictLabel}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="任务状态" name="status">
                <Select placeholder="请输入任务状态" allowClear>
                  {dicts.sys_job_status.map((dict: any) => {
                    return (
                      <Option value={dict.dictValue} key={"sys_job_status" + dict.dictLabel}>
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
      <Row style={{ marginBottom: 20 }}>
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
        <Col
          style={{ marginRight: 20 }}
          onClick={() => {
            goJobLog("0");
          }}
        >
          <Button icon={<BookOutlined />}>日志</Button>
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
        <Table style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.jobId} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        <RuoYiPagination
          current={queryForm.pageNum}
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        />
      </Row>
      {/* 增加修改表单区域 */}
      <Modal destroyOnClose className="Role-CurdModal" centered width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={roleFormModel} name="roleFormModel" labelCol={{ style: { width: 90 } }} initialValues={{ misfirePolicy: "1", concurrent: "1", status: "0" }} autoComplete="off">
          <Row>
            <Col span={12}>
              <Form.Item label="任务名称" name="jobName" rules={[{ required: true, message: "任务名称不能为空" }]}>
                <Input placeholder="请输入任务名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="任务分组" name="jobGroup" rules={[{ required: true, message: "任务分组不能为空" }]}>
                <Select value={roleForm.dataScope} placeholder="请选择任务分组">
                  {dicts.sys_job_group.map((dict: any) => {
                    return (
                      <Option value={dict.dictValue} key={"sys_job_group" + dict.dictLabel}>
                        {dict.dictLabel}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="调用方法" name="invokeTarget" rules={[{ required: true, message: "调用方法不能为空" }]}>
            <Input placeholder="请输入调用方法" />
          </Form.Item>
          <Form.Item label="corn表达式" name="cronExpression" rules={[{ required: true, message: "corn表达式不能为空" }]}>
            <Input
              addonAfter={
                <div
                  onClick={() => {
                    setVisibleCron(true);
                  }}
                  style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                >
                  <span style={{ marginRight: "4px" }}>生成表达式 </span>
                  <ClockCircleOutlined />
                </div>
              }
              placeholder="请输入corn表达式"
            />
          </Form.Item>
          <Form.Item label="错误策略" name="misfirePolicy">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="1">立即执行</Radio.Button>
              <Radio.Button value="2">执行一次</Radio.Button>
              <Radio.Button value="3">放弃执行</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="是否并发" name="concurrent">
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="0">允许</Radio.Button>
                  <Radio.Button value="1">禁止</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status">
                <Radio.Group>
                  {dicts.sys_job_status.map((dict: any) => {
                    return (
                      <Radio value={dict.dictValue} key={"statusForm" + dict.dictValue}>
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
      {/* corn 表达式弹窗 */}
      <Modal
        footer={null}
        destroyOnClose
        centered
        width="40%"
        onCancel={() => {
          setVisibleCron(false);
        }}
        visible={visibleCron}
        title="Cron表达式生成器"
      >
        <QnnReactCron
          value={""}
          onOk={(value: any) => {
            console.log("cron:", value);
          }}
          getCronFns={(_cronFns: any) => {
            cronFns = _cronFns;
          }}
          footer={[
            <Button
              key="cencel"
              style={{ marginRight: 10 }}
              onClick={() => {
                setValue(null);
              }}
            >
              重置
            </Button>,
            <Button
              key="getValue"
              type="primary"
              onClick={() => {
                roleFormModel.setFieldsValue({
                  ...roleFormModel.getFieldsValue(),
                  cronExpression: cronFns.getValue(),
                });
                setVisibleCron(false);
              }}
            >
              生成
            </Button>,
          ]}
        />
      </Modal>
      {/*  */}
      <Modal
        footer={null}
        destroyOnClose
        centered
        width="40%"
        onCancel={() => {
          setOpenView(false);
        }}
        visible={openView}
        title="任务详情"
      >
        <Descriptions title="User Info">
          <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
          <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
          <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
          <Descriptions.Item label="Remark">empty</Descriptions.Item>
          <Descriptions.Item label="Address">No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China</Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
}
export default Job;
