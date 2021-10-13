/*
 * @Author: your name
 * @Date: 2021-10-09 17:04:33
 * @LastEditTime: 2021-10-13 11:43:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/system/user/index.tsx
 */
import React, { useState, useEffect, useRef } from "react";
import "./index.less";
import { listUser } from "../../../api/system/user";
import { Tree, Input, Row, Col, Form, Button, Select, DatePicker, Tooltip, Table, Space, Switch } from "antd";
import { SearchOutlined, SyncOutlined, AppstoreOutlined, PlusOutlined, DeleteOutlined, EditOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { treeselect } from "../../../api/system/dept";

const { Option } = Select;
const { Search } = Input;
const { Column } = Table;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const dataList: any[] = [];
const getParentKey = (id: any, tree: string | any[]): any => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: { id: any }) => item.id === id)) {
        parentKey = node.id;
      } else if (getParentKey(id, node.children)) {
        parentKey = getParentKey(id, node.children);
      }
    }
  }
  console.log(parentKey);
  return parentKey;
};

function User() {
  const initComponent = useRef(true);
  const [queryParams, setQueryParams] = useState({
    pageNum: 1,
    pageSize: 10,
  });
  const [treeList, setTreeList] = useState([]);
  const [total, setTotal] = useState(0);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableData, setTableData] = useState([]);
  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  const onChange = (e: { target: { value: any } }): any => {
    const { value } = e.target;
    const expandedKeys: any = dataList
      .map((item) => {
        if (item.label.indexOf(value) > -1) {
          return getParentKey(item.id, treeList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
      console.log(value)
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  const loop = (data: any) =>
    data.map((item: { title?: any; children: any; key?: any; label: string; id: any }) => {
      const index = item.label.indexOf(searchValue);
      const beforeStr = item.label.substr(0, index);
      const afterStr = item.label.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.label}</span>
        );
      if (item.children) {
        return { title, key: item.id, children: loop(item.children) };
      }

      return {
        title,
        key: item.id,
      };
    });

  // 监听副作用
  useEffect(() => {
    if (initComponent.current) return;
    // 监听queryParams变化
    getList();
  }, [queryParams.pageNum, queryParams.pageSize]); // eslint-disable-line react-hooks/exhaustive-deps
  // 副作用生命周期
  useEffect(() => {
    initComponent.current = false;
    getList();
    getOtherList();
  }, []);
  /**
   * @description: 获取其他数据
   * @param {*}
   * @return {*}
   */
  const getOtherList = () => {
    treeselect().then((res: any) => {
      const cal = function (data: any[]) {
        data.forEach((i: any) => {
          dataList.push(i);
          if (i.children) {
            cal(i.children);
          }
        });
      };
      cal(res.data);
      const expandedKeys: any = dataList.map((item) => {
        return getParentKey(item.id, res.data);
      });
      setExpandedKeys(expandedKeys);
      setTreeList(res.data);
    });
  };
  /**
   * @description: 获取表格信息
   * @param {*}
   * @return {*}
   */
  const getList = () => {
    listUser({ ...queryParams }).then((res: any) => {
      setTableData(res.rows);
      setTotal(res.total);
    });
  };

  /**
   * @description: 表格复选框选择事件
   * @param {any} selectedRowKeys
   * @return {*}
   */
  const onSelectChange = (selectedRowKeys: any) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  /**
   * @description:
   * @param {*}
   * @return {*}
   */
  const onTableSwitchChange = () => {};
  const onFinish = (data: any) => {
    console.log(data);
  };
  const onFinishFailed = (data: any) => {
    console.log(data);
  };
  // 回调函数，切换下一页
  const changePage = (current: any) => {
    const params = {
      pageNum: current,
      pageSize: queryParams.pageSize,
    };
    setQueryParams((data: any) => ({ ...data, ...params }));
  };

  // 回调函数,每页显示多少条
  const changePageSize = (pageSize: number, current?: any) => {
    // 将当前改变的每页条数存到state中
    setQueryParams((data) => {
      data.pageSize = pageSize;
      return data;
    });
  };
  // 表格分页属性
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: () => `共${total}条`,
    pageSize: queryParams.pageSize,
    current: queryParams.pageNum,
    total: total,
    onShowSizeChange: (current: any, pageSize: any) => changePageSize(pageSize, current),
    onChange: (current: any) => changePage(current),
  };
  return (
    <div className="User">
      <Row>
        {/* 左侧树条件区域 */}
        <Col span={6}>
          <Search style={{ marginBottom: 8 }} placeholder="请输入部门名称" onChange={onChange} />
          {treeList.length && <Tree onExpand={onExpand} expandedKeys={expandedKeys} autoExpandParent treeData={loop(treeList)} />}
        </Col>
        {/* 右侧内容展示区域 */}
        <Col span={17} offset={1}>
          <Form name="queryForm" labelCol={{ style: { width: 90 } }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
            <Row>
              <Col span={8}>
                <Form.Item label="用户名称" name="username">
                  <Input placeholder="请输入用户名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="手机号码" name="password">
                  <Input placeholder="请输入用户名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="状态" name="状态">
                  <Select placeholder="请输入状态" allowClear>
                    <Option value="male">启用</Option>
                    <Option value="female">停用</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="创建时间" name="创建时间">
                  <RangePicker format={dateFormat} />
                </Form.Item>
              </Col>
              <Col span={8} offset={8}>
                <Form.Item style={{ float: "right" }}>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                  <Button style={{ marginLeft: 20 }} icon={<SyncOutlined />}>
                    重置
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {/* 搜索条区域 */}
          <Row>
            <Col span={2} style={{ marginRight: 20 }}>
              <Button icon={<PlusOutlined />} type="primary">
                新增
              </Button>
            </Col>
            <Col span={2} style={{ marginRight: 20 }}>
              <Button icon={<EditOutlined />}>修改</Button>
            </Col>
            <Col span={2} style={{ marginRight: 20 }}>
              <Button icon={<DeleteOutlined />}>删除</Button>
            </Col>
            <Col span={2} style={{ marginRight: 20 }}>
              <Button icon={<VerticalAlignTopOutlined />}>导入</Button>
            </Col>
            <Col span={2} style={{ marginRight: 20 }}>
              <Button icon={<VerticalAlignBottomOutlined />}>导出</Button>
            </Col>

            <Col style={{ flex: 1, textAlign: "right" }}>
              <Tooltip title="隐藏搜索">
                <Button style={{ marginRight: 10 }} icon={<SearchOutlined />} shape="circle"></Button>
              </Tooltip>
              <Tooltip title="刷新">
                <Button style={{ marginRight: 10 }} icon={<SyncOutlined />} shape="circle"></Button>
              </Tooltip>
              <Tooltip title="显隐列">
                <Button icon={<AppstoreOutlined />} shape="circle"></Button>
              </Tooltip>
            </Col>
          </Row>
          {/* 表格区域 */}
          <Row>
            <Table pagination={paginationProps} rowKey={(record: any) => record.userId} rowSelection={rowSelection} dataSource={tableData} style={{ width: "100%" }}>
              <Column align="center" title="用户编号" dataIndex="userId" />
              <Column align="center" title="用户名称" dataIndex="userName" />
              <Column align="center" title="用户昵称" dataIndex="nickName" />
              <Column align="center" title="部门" dataIndex={["dept", "deptName"]} />
              <Column align="center" title="手机号码" dataIndex="phonenumber" />
              <Column align="center" title="状态" render={(text, row: any) => <Switch checkedChildren="开启" onChange={onTableSwitchChange} unCheckedChildren="关闭" defaultChecked={row.status === "0" ? true : false} />} />
              <Column align="center" title="创建时间" dataIndex="createTime" />
              <Column
                align="center"
                title="操作"
                render={(text, row: any) => (
                  <Space size="middle">
                    <a href="/">Invite </a>
                    <a href="/">Delete</a>
                  </Space>
                )}
              />
            </Table>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
export default User;
