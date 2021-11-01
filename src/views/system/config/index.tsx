/*
 * @Author: your name
 * @Date: 2021-10-28 10:00:34
 * @LastEditTime: 2021-11-01 14:44:38
 * @LastEditors: Please set LastEditors
 * @Description: 参数设置
 * @FilePath: /use-hooks/src/views/system/config/index.tsx
 */

import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { Space, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message, DatePicker } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { listConfig, getConfig, delConfig, addConfig, updateConfig, exportConfig, refreshCache } from "api/system/config";
import { selectDictLabel } from "../../../utils/ruoyi";
import { getDicts } from "../../../api/global";
import { download } from "../../../utils/ruoyi";
import moment from "moment";
import RuoYiPagination from "../../../compoents/RuoYiPagination";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const { confirm } = Modal;
const { Option } = Select;
function Config() {
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
    configName: "",
    configKey: "",
    configType: "",
    params: {
      beginTime: "",
      endTime: "",
    },
  });
  const [queryFormRef] = Form.useForm();
  const [showQueryForm, setShowQueryForm] = useState(true);
  // 字典列表
  const [dicts, setDicts] = useState({
    sys_yes_no: [],
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
      title: "参数主键",
      align: "center",
      dataIndex: "configId",
    },
    {
      title: "参数名称",
      align: "center",
      dataIndex: "configName",
      ellipsis: true,
    },
    {
      title: "参数键名",
      align: "center",
      dataIndex: "configKey",
      ellipsis: true,
    },
    {
      title: "参数键值",
      align: "center",
      dataIndex: "configValue",
    },
    {
      title: "系统内置",
      align: "center",
      dataIndex: "configType",
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_yes_no, text)}</>,
    },
    {
      title: "备注",
      align: "center",
      dataIndex: "remark",
      ellipsis: true,
    },
    {
      title: "创建时间",
      align: "center",
      dataIndex: "createTime",
    },
    {
      title: "操作",
      // align:'center',
      dataIndex: "address",
      render: (text: any, row: any) => {
        return (
          <>
            <Space size="middle">
              <a
                onClick={() => {
                  showModal("修改参数", row);
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
  const [configFormModel] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加参数");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [configForm, setConfigForm] = useState({
    configId: "",
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
    getDicts("sys_yes_no").then((response) => {
      setDicts((data) => {
        data.sys_yes_no = response.data;
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
    listConfig({ ...queryForm }).then((res: any) => {
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
      data.configName = form.configName;
      data.configKey = form.configKey;
      data.configType = form.configType;
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
  function showModal(titleName: string, row: any = { configId: "" }) {
    setVisibleTitle(titleName);
    configFormModel.resetFields();
    setConfigForm(() => {
      return {
        configId: "",
      };
    });
    if (titleName === "修改参数") {
      const configId = row.configId || selectedRowKeys[0];
      // 调用查询详细接口
      getConfig(configId).then((response: any) => {
        console.log(response);
        setConfigForm({ ...response.data });
        configFormModel.setFieldsValue({
          ...response.data,
        });
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
    configFormModel
      .validateFields()
      .then((values) => {
        if (configForm.configId !== "") {
          updateConfig({ ...configForm, ...configFormModel.getFieldsValue() }).then(() => {
            message.success("修改成功");
            // setConfirmLoading(false);
            setVisible(false);
            getList();
          });
        } else {
          addConfig({ ...configFormModel.getFieldsValue() }).then(() => {
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
  const delData = (row: any = { configId: "" }) => {
    const configIds = row.configId || selectedRowKeys;
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认删除选中的数据项？",
      centered: true,
      onOk() {
        delConfig(configIds).then(() => {
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
      content: "是否确认导出所有参数数据项？",
      centered: true,
      onOk() {
        exportConfig(queryForm)
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
  /**
   * @description: 清除缓存函数
   * @param {*}
   * @return {*}
   */
  function clearCache() {
    refreshCache().then(() => {
      message.success("刷新成功");
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
    <div className="Config">
      {/* 搜索条件展示区域 */}
      {showQueryForm ? (
        <Form form={queryFormRef} className="queryForm" name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="参数名称" name="configName">
                <Input placeholder="请输入参数名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="参数键名" name="configKey">
                <Input placeholder="请输入参数键名" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="系统内置" name="configType">
                <Select placeholder="请选择系统内置">
                  {dicts.sys_yes_no.map((dict: any) => {
                    return (
                      <Option value={dict.dictValue} key={"configId" + dict.dictValue}>
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
            <Col span={6} offset={18}>
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
              showModal("添加参数");
            }}
          >
            新增
          </Button>
        </Col>
        <Col style={{ marginRight: 20 }}>
          <Button
            disabled={selectedRowKeys.length !== 1}
            onClick={() => {
              showModal("修改参数");
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
        <Col style={{ marginRight: 20 }}>
          <Button icon={<VerticalAlignBottomOutlined />} onClick={handleExport}>
            导出
          </Button>
        </Col>
        <Col style={{ marginRight: 20 }}>
          <Button icon={<SyncOutlined />} onClick={clearCache}>
            刷新缓存
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
        <Table style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.configId} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        <RuoYiPagination
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        />
      </Row>
      {/* 增加修改表单区域 */}
      <Modal centered width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={configFormModel} name="configFormModel" labelCol={{ style: { width: 90 } }} initialValues={{ configType: "Y" }} autoComplete="off">
          <Form.Item label="参数名称" name="configName" rules={[{ required: true, message: "参数名称不能为空" }]}>
            <Input placeholder="请输入参数名称" />
          </Form.Item>
          <Form.Item label="参数键名" name="configKey" rules={[{ required: true, message: "参数键名不能为空" }]}>
            <Input placeholder="请输入参数键名" />
          </Form.Item>
          <Form.Item label="参数键值" name="configValue" rules={[{ required: true, message: "参数键值不能为空" }]}>
            <Input placeholder="请输入参数键值" />
          </Form.Item>
          <Form.Item label="系统内置" name="configType">
            <Radio.Group>
              {dicts.sys_yes_no.map((dict: any) => {
                return (
                  <Radio value={dict.dictValue} key={"configType" + dict.dictValue}>
                    {dict.dictLabel}
                  </Radio>
                );
              })}
            </Radio.Group>
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
export default Config;
