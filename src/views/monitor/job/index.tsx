/*
 * @Author: your name
 * @Date: 2021-11-24 10:10:10
 * @LastEditTime: 2021-11-26 09:31:50
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/views/monitor/job/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { Dropdown, Menu, Tree, Checkbox, Switch, InputNumber, Space, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message, DatePicker } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignBottomOutlined, DoubleRightOutlined, KeyOutlined, SmileOutlined, BookOutlined, CaretRightOutlined, EyeOutlined } from "@ant-design/icons";
import { listJob, getJob, delJob, addJob, updateJob, exportJob, changeJobStatus } from "../../../api/monitor/job";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "api/system/menu";
import { treeselect as deptTreeselect, roleDeptTreeselect } from "api/system/dept";
import { selectDictLabel } from "../../../utils/ruoyi";
import { getDicts } from "../../../api/global";
import { download } from "../../../utils/ruoyi";
import moment from "moment";
import RuoYiPagination from "../../../compoents/RuoYiPagination";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import QnnReactCron from "qnn-react-cron";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const { confirm } = Modal;
const { Option } = Select;
function Role(props: any) {
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
    sys_job_group: [],
    sys_job_status: [],
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
          icon={<CaretRightOutlined />}
        >
          执行一次
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            dataPermissions(row);
          }}
          key="KeyOutlined"
          icon={<KeyOutlined />}
        >
          任务详细
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            systemUser(row);
          }}
          key="SmileOutlined"
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
    jobId: "",
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
    getDicts("sys_job_group").then((response) => {
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
    props.history.push("/system/role-auth/" + row.jobId);
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
      content: '确认要"' + text + '""' + row.roleName + '"角色吗?',
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
  const handleOk = () => {
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
  };
  const handleCancel = () => {
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
  const delData = (row: any = { jobId: "" }) => {
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
              <Form.Item label="任务名称" name="roleName">
                <Input placeholder="请输入任务名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="任务组名" name="status">
                <Select allowClear placeholder="请输入任务组名">
                  {dicts.sys_job_group.map((dict: any) => {
                    return (
                      <Option value={dict.value} key={"sys_job_group" + dict.label}>
                        {dict.label}
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
                      <Option value={dict.value} key={"sys_job_status" + dict.label}>
                        {dict.label}
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
        <Col style={{ marginRight: 20 }} onClick={handleExport}>
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
        <QnnReactCron
          value={value}
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
                setValue(cronFns.getValue());
              }}
            >
              生成
            </Button>,
          ]}
        />
        <Form form={roleFormModel} name="roleFormModel" labelCol={{ style: { width: 90 } }} initialValues={{ status: "0", roleSort: 0 }} autoComplete="off">
          <Form.Item label="角色名称" name="roleName" rules={[{ required: true, message: "角色名称不能为空" }]}>
            <Input disabled={visibleTitle === "分配数据权限"} placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item label="权限字符" name="roleKey" rules={[{ required: true, message: "权限字符不能为空" }]}>
            <Input disabled={visibleTitle === "分配数据权限"} placeholder="请输入权限字符" />
          </Form.Item>
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
          <Form.Item label="用户性别" name="dataScope">
            <Select value={roleForm.dataScope} placeholder="请选择用户性别">
              {dicts.dataScopeOptions.map((dict: any) => {
                return (
                  <Option value={dict.value} key={"dataScope" + dict.label}>
                    {dict.label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Row>
            <Col span={24}>
              <Form.Item label="备注" name="remark">
                <Input.TextArea placeholder="请输入内容" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
export default Role;
