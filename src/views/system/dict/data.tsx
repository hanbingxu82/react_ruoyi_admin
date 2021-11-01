/*
 * @Author: your name
 * @Date: 2021-10-29 15:17:04
 * @LastEditTime: 2021-11-01 16:45:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/system/dict/data.tsx
 */

import { useState, useEffect, useRef } from "react";
import "./data.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { InputNumber, Space, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message, DatePicker, Tag } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { listData, getData, delData, addData, updateData, exportData } from "api/system/dict/data";
import { listType, getType } from "api/system/dict/type";
import { selectDictLabel } from "../../../utils/ruoyi";
import { getDicts } from "../../../api/global";
import { download } from "../../../utils/ruoyi";
import RuoYiPagination from "../../../compoents/RuoYiPagination";

const { confirm } = Modal;
const { Option } = Select;
function Post(props: any) {
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
    dictType: "",
    dictLabel: "",
    status: "",
  });
  const [queryFormRef] = Form.useForm();
  const [showQueryForm, setShowQueryForm] = useState(true);
  // 字典列表
  const [dicts, setDicts] = useState({
    sys_normal_disable: [],
    typeOptions: [],
    listClassOptions: [
      {
        value: "default",
        label: "默认",
      },
      {
        value: "primary",
        label: "主要",
      },
      {
        value: "success",
        label: "成功",
      },
      {
        value: "info",
        label: "信息",
      },
      {
        value: "warning",
        label: "警告",
      },
      {
        value: "danger",
        label: "危险",
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
  // 表格列头对应字段
  const columns: any = [
    {
      title: "字典编码",
      align: "center",
      dataIndex: "dictCode",
    },
    {
      title: "字典标签",
      align: "center",
      dataIndex: "dictLabel",
      ellipsis: true,
      render: (text: any, row: any) => {
        if (row.listClass === "primary") {
          return <Tag color={"processing"}>{row.dictLabel}</Tag>;
        } else if (row.listClass === "success") {
          return <Tag color={"success"}>{row.dictLabel}</Tag>;
        } else if (row.listClass === "info" || row.listClass === "default") {
          return <Tag color={"default"}>{row.dictLabel}</Tag>;
        } else if (row.listClass === "warning") {
          return <Tag color={"warning"}>{row.dictLabel}</Tag>;
        } else if (row.listClass === "danger") {
          return <Tag color={"error"}>{row.dictLabel}</Tag>;
        } else {
          return row.dictLabel;
        }
      },
    },
    {
      title: "字典键值",
      align: "center",
      dataIndex: "dictValue",
      ellipsis: true,
    },
    {
      title: "字典排序",
      align: "center",
      dataIndex: "dictSort",
    },
    {
      title: "状态",
      align: "center",
      dataIndex: "status",
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_normal_disable, text)}</>,
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
      align: "center",
      dataIndex: "address",
      render: (text: any, row: any) => {
        return (
          <>
            <Space size="middle">
              <a
                onClick={() => {
                  showModal("修改字典数据", row);
                }}
              >
                <EditOutlined />
                修改
              </a>
              <a
                onClick={() => {
                  delDatas(row);
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
  const [dataFormModel] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加字典数据");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [dataForm, setDataForm] = useState({
    dictCode: "",
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
    const dictId = props.match ? props.match.params.id : "";
    initComponent.current = false;
    getDicts("sys_normal_disable").then((response) => {
      setDicts((data) => {
        data.sys_normal_disable = response.data;
        return data;
      });
    });
    /**
     * @description: 获取当前的type类型
     * @param {*} dictId
     * @return {*}
     */
    getType(dictId).then((response: any) => {
      // setQueryForm((data: any) => {
      //   data.dictType = response.data.dictType;
      //   return data;
      // });
      setDefaultDictType(response.data.dictType);
      queryFormRef.setFieldsValue({
        dictType: response.data.dictType,
      });
      onQueryFinish({ dictType: response.data.dictType });
    });
    listType().then((response: any) => {
      setDicts((data) => {
        data.typeOptions = response.rows;
        return data;
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * @description: 获取表格信息
   * @param {*}
   * @return {*}
   */
  function getList() {
    setGetLoading(true);
    listData({ ...queryForm }).then((res: any) => {
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
      data.dictType = form.dictType;
      data.dictLabel = form.dictLabel;
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
    queryFormRef.setFieldsValue({
      dictType: defaultDictType,
    });
    
    onQueryFinish({dictType: defaultDictType});
  }

  /**
   * @description: 点击增加修改事件
   * @param {*}
   * @return {*}
   */
  function showModal(titleName: string, row: any = { dictCode: "" }) {
    setVisibleTitle(titleName);
    dataFormModel.resetFields();
    dataFormModel.setFieldsValue({
      dictType:queryForm.dictType
    });
    setDataForm(() => {
      return {
        dictCode: "",
      };
    });

    if (titleName === "修改字典数据") {
      const dictCode = row.dictCode || selectedRowKeys[0];
      // 调用查询详细接口
      getData(dictCode).then((response: any) => {
        setDataForm({ ...response.data });
        dataFormModel.setFieldsValue({
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
    dataFormModel
      .validateFields()
      .then((values) => {
        if (dataForm.dictCode !== "") {
          updateData({ ...dataForm, ...dataFormModel.getFieldsValue() }).then(() => {
            message.success("修改成功");
            // setConfirmLoading(false);
            setVisible(false);
            getList();
          });
        } else {
          addData({ ...dataFormModel.getFieldsValue() }).then(() => {
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
  const delDatas = (row: any = { dictCode: "" }) => {
    const dictCodes = row.dictCode || selectedRowKeys;
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认删除选中的数据项？",
      centered: true,
      onOk() {
        delData(dictCodes).then(() => {
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
        exportData(queryForm)
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
    <div className="Dict">
      {/* 搜索条件展示区域 */}
      {showQueryForm ? (
        <Form form={queryFormRef} className="queryForm" name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="字典名称" name="dictType">
                <Select placeholder="请选择字典名称">
                  {dicts.typeOptions.map((dict: any) => {
                    return (
                      <Option value={dict.dictType} key={"dictCode" + dict.dictId}>
                        {dict.dictName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="字典标签" name="dictLabel">
                <Input placeholder="请输入字典标签" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status">
                <Select placeholder="请选择状态">
                  {dicts.sys_normal_disable.map((dict: any) => {
                    return (
                      <Option value={dict.dictValue} key={"dictCode" + dict.dictValue}>
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
        <Col style={{ marginRight: 20 }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              showModal("添加字典数据");
            }}
          >
            新增
          </Button>
        </Col>
        <Col style={{ marginRight: 20 }}>
          <Button
            disabled={selectedRowKeys.length !== 1}
            onClick={() => {
              showModal("修改字典数据");
            }}
            icon={<EditOutlined />}
          >
            修改
          </Button>
        </Col>
        <Col style={{ marginRight: 20 }}>
          <Button icon={<DeleteOutlined />} onClick={delDatas} disabled={selectedRowKeys.length <= 0}>
            删除
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
        <Table style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.dictCode} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        <RuoYiPagination
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        />
      </Row>
      {/* 增加修改表单区域 */}
      <Modal centered width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={dataFormModel} name="dataFormModel" labelCol={{ style: { width: 90 } }} initialValues={{dictSort:'0', status: "0", listClass: "default" }} autoComplete="off">
          <Form.Item label="字典类型" name="dictType" >
            <Input disabled placeholder="请输入字典类型" />
          </Form.Item>
          <Form.Item label="数据标签" name="dictLabel" rules={[{ required: true, message: "数据标签不能为空" }]}>
            <Input placeholder="请输入数据标签" />
          </Form.Item>
          <Form.Item label="数据键值" name="dictValue" rules={[{ required: true, message: "数据键值不能为空" }]}>
            <Input placeholder="请输入数据键值" />
          </Form.Item>
          <Form.Item label="样式属性" name="cssClass" >
            <Input placeholder="请输入样式属性" />
          </Form.Item>
          <Form.Item label="显示排序" name="dictSort" rules={[{ required: true, message: "显示排序不能为空" }]}>
            <InputNumber placeholder="请输入显示排序" />
          </Form.Item>
          <Form.Item label="回显样式" name="listClass" >
            <Select placeholder="请选择回显样式">
              {dicts.listClassOptions.map((dict: any) => {
                return (
                  <Option value={dict.value} key={"listClassOptions" + dict.value}>
                    {dict.label}
                  </Option>
                );
              })}
            </Select>
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
export default Post;
