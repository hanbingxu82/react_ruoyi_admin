/*
 * @Author: your name
 * @Date: 2021-10-29 15:17:12
 * @LastEditTime: 2021-11-01 14:45:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/system/dict/type.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "compoents/HeaderBar";
import { NavLink } from "react-router-dom";
import { Space, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message, DatePicker } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { listType, getType, delType, addType, updateType, exportType, refreshCache } from "api/system/dict/type";
import { selectDictLabel } from "utils/ruoyi";
import { getDicts } from "api/global";
import { download } from "utils/ruoyi";
import moment from "moment";
import RuoYiPagination from "compoents/RuoYiPagination";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const { confirm } = Modal;
const { Option } = Select;
function Dict() {
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
    dictName: "",
    dictType: "",
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
  });
  // 加载效果
  const [getLoading, setGetLoading] = useState(false);
  // 表格数据
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  // 表格选中行 KEY 值
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 表格列头对应字段
  const columns:any = [
    {
      title: "字典编号",
      align:'center',
dataIndex: "dictId",
    },
    {
      title: "字典名称",
      align:'center',
dataIndex: "dictName",
      ellipsis: true,
    },
    {
      title: "字典类型",
      align:'center',
dataIndex: "dictType",
      ellipsis: true,
      render: (text: any, row: any) => (
        <>
          <NavLink style={{ textDecoration: "none" }} to={"/system/dict-data/" + row.dictId}>
            {text}
          </NavLink>
        </>
      ),
    },
    {
      title: "状态",
      align:'center',
dataIndex: "status",
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_normal_disable, text)}</>,
    },
    {
      title: "备注",
      align:'center',
dataIndex: "remark",
      ellipsis: true,
    },
    {
      title: "创建时间",
      align:'center',
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
    dictId: "",
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
    listType({ ...queryForm }).then((res: any) => {
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
      data.dictName = form.dictName;
      data.dictType = form.dictType;
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
   * @description: 点击增加修改事件
   * @param {*}
   * @return {*}
   */
  function showModal(titleName: string, row: any = { dictId: "" }) {
    setVisibleTitle(titleName);
    configFormModel.resetFields();
    setConfigForm(() => {
      return {
        dictId: "",
      };
    });
    if (titleName === "修改参数") {
      const dictId = row.dictId || selectedRowKeys[0];
      // 调用查询详细接口
      getType(dictId).then((response: any) => {
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
        if (configForm.dictId !== "") {
          updateType({ ...configForm, ...configFormModel.getFieldsValue() }).then(() => {
            message.success("修改成功");
            // setConfirmLoading(false);
            setVisible(false);
            getList();
          });
        } else {
          addType({ ...configFormModel.getFieldsValue() }).then(() => {
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
  const delData = (row: any = { dictId: "" }) => {
    const dictIds = row.dictId || selectedRowKeys;
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认删除选中的数据项？",
      centered: true,
      onOk() {
        delType(dictIds).then(() => {
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
        exportType(queryForm)
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
    <div className="Dict">
      {/* 搜索条件展示区域 */}
      {showQueryForm ? (
        <Form form={queryFormRef} className="queryForm" name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="字典名称" name="dictName">
                <Input placeholder="请输入字典名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="字典类型" name="dictType">
                <Input placeholder="请输入字典类型" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status">
                <Select placeholder="请选择状态">
                  {dicts.sys_normal_disable.map((dict: any) => {
                    return (
                      <Option value={dict.dictValue} key={"dictId" + dict.dictValue}>
                        {dict.dictLabel}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="创建时间" name="time">
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
        <Table style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.dictId} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        <RuoYiPagination
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        />
      </Row>
      {/* 增加修改表单区域 */}
      <Modal centered width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={configFormModel} name="configFormModel" labelCol={{ style: { width: 90 } }} initialValues={{ status: "0" }} autoComplete="off">
          <Form.Item label="字典名称" name="dictName" rules={[{ required: true, message: "字典名称不能为空" }]}>
            <Input placeholder="请输入字典名称" />
          </Form.Item>
          <Form.Item label="字典类型" name="dictType" rules={[{ required: true, message: "字典类型不能为空" }]}>
            <Input placeholder="请输入字典类型" />
          </Form.Item>
          <Form.Item label="状态" name="status">
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
export default Dict;
