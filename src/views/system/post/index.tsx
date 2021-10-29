/*
 * @Author: your name
 * @Date: 2021-10-15 13:49:40
 * @LastEditTime: 2021-10-22 10:10:21
 * @LastEditors: Please set LastEditors
 * @Description: 岗位管理页面
 * @FilePath: /use-hooks/src/views/system/post/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import "./index.less";

import HeaderBar from "../../../compoents/HeaderBar";

import { InputNumber, Space, Input, Row, Col, Form, Button, Select, Table, Modal, Radio, message } from "antd";
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { listPost, getPost, delPost, addPost, updatePost, exportPost } from "../../../api/system/post";
import { selectDictLabel } from "../../../utils/ruoyi";
import { getDicts } from "../../../api/global";
import { download } from "../../../utils/ruoyi";
import RuoYiPagination from "../../../compoents/RuoYiPagination";

const { confirm } = Modal;
const { Option } = Select;
function Post() {
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
    postName: "",
    postCode: "",
    status: "",
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
  const columns = [
    {
      title: "岗位编号",
      dataIndex: "postId",
    },
    {
      title: "岗位编码",
      dataIndex: "postCode",
    },
    {
      title: "岗位名称",
      dataIndex: "postName",
    },
    {
      title: "岗位排序",
      dataIndex: "postSort",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text: any, row: any) => <>{selectDictLabel(dicts.sys_normal_disable, text)}</>,
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
                  showModal("修改岗位", row);
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
  const [postFormModel] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [visibleTitle, setVisibleTitle] = useState("添加岗位");
  const [confirmLoading] = useState(false);
  // 用户form字段
  const [postForm, setPostForm] = useState({
    postId: "",
  });
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
    listPost({ ...queryForm }).then((res: any) => {
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
      data.postName = form.postName;
      data.postCode = form.postCode;
      data.status = form.status;
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
  function showModal(titleName: string, row: any = { postId: "" }) {
    setVisibleTitle(titleName);
    postFormModel.resetFields();
    setPostForm(() => {
      return {
        postId: "",
      };
    });
    if (titleName === "修改岗位") {
      const postId = row.postId || selectedRowKeys[0];
      // 调用查询详细接口
      getPost(postId).then((response: any) => {
        console.log(response);
        setPostForm({ ...response.data });
        postFormModel.setFieldsValue({
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
    postFormModel
      .validateFields()
      .then((values) => {
        if (postForm.postId !== "") {
          updatePost({ ...postForm, ...postFormModel.getFieldsValue() }).then(() => {
            message.success("修改成功");
            // setConfirmLoading(false);
            setVisible(false);
            getList();
          });
        } else {
          addPost({ ...postFormModel.getFieldsValue() }).then(() => {
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
  const delData = (row: any = { postId: "" }) => {
    const postIds = row.postId || selectedRowKeys;
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认删除选中的数据项？",
      centered: true,
      onOk() {
        delPost(postIds).then(() => {
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
      content: "是否确认导出所有岗位数据项？",
      centered: true,
      onOk() {
        exportPost(queryForm)
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
    <div className="Post">
      {/* 搜索条件展示区域 */}
      {showQueryForm ? (
        <Form form={queryFormRef} className="queryForm" name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onQueryFinish} autoComplete="off">
          <Row>
            <Col span={6}>
              <Form.Item label="岗位编码" name="postCode">
                <Input placeholder="请输入岗位编码" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="岗位名称" name="postName">
                <Input placeholder="请输入岗位名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="岗位状态" name="status">
                <Select placeholder="请输入岗位状态" allowClear>
                  <Option value="0">启用</Option>
                  <Option value="1">停用</Option>
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
              showModal("添加岗位");
            }}
          >
            新增
          </Button>
        </Col>
        <Col  style={{ marginRight: 20 }}>
          <Button
            disabled={selectedRowKeys.length !== 1}
            onClick={() => {
              showModal("修改岗位");
            }}
            icon={<EditOutlined />}
          >
            修改
          </Button>
        </Col>
        <Col  style={{ marginRight: 20 }}>
          <Button icon={<DeleteOutlined />} disabled={selectedRowKeys.length <= 0}>
            删除
          </Button>
        </Col>
        <Col  style={{ marginRight: 20 }} onClick={handleExport}>
          <Button icon={<VerticalAlignBottomOutlined />}>导出</Button>
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
        <Table style={{ width: "100%" }} loading={getLoading} pagination={false} rowKey={(record: any) => record.postId} rowSelection={rowSelection} columns={columns} dataSource={tableData} />
        <RuoYiPagination
          total={total}
          onChange={(page: any, pageSize: any) => {
            setQueryForm({ ...queryForm, pageNum: page, pageSize });
          }}
        />
      </Row>
      {/* 增加修改表单区域 */}
      <Modal centered width="40%" title={visibleTitle} visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={postFormModel} name="postFormModel" labelCol={{ style: { width: 90 } }} initialValues={{ status: "0", postSort: 0 }} autoComplete="off">
          <Form.Item label="岗位名称" name="postName" rules={[{ required: true, message: "岗位名称不能为空" }]}>
            <Input placeholder="请输入岗位名称" />
          </Form.Item>
          <Form.Item label="岗位编码" name="postCode" rules={[{ required: true, message: "岗位编码不能为空" }]}>
            <Input placeholder="请输入岗位编码" />
          </Form.Item>
          <Form.Item label="岗位顺序" name="postSort" rules={[{ required: true, message: "岗位编码不能为空" }]}>
            <InputNumber placeholder="请输入岗位顺序" />
          </Form.Item>
          <Form.Item label="岗位状态" name="status">
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
