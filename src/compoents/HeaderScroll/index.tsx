/*
 * @Author: your name
 * @Date: 2021-11-11 17:29:36
 * @LastEditTime: 2021-12-08 08:51:34
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/compoents/HeaderScroll/index.tsx
 */
import React, { useState, useEffect, useRef } from "react";
import { Tabs, Button, Menu, Dropdown } from "antd";
import { ReloadOutlined, CloseOutlined, CloseCircleOutlined, SwapLeftOutlined, SwapRightOutlined, CloseSquareOutlined } from "@ant-design/icons";

import "./index.less";

const { TabPane } = Tabs;

function HeaderScroll(props: any) {
  // 类似于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps
  const onChange = (activeKey: any) => {
    props.onHeaderMenuChange(activeKey);
  };
  const onEdit = (targetKey: any, action: any) => {
    if (action === "add") {
      props.add();
    } else if (action === "remove") {
      props.remove(targetKey);
    }
  };
  const menu = function (tabDetail: any) {
    return (
      <Menu>
        <Menu.Item key="ReloadOutlined" icon={<ReloadOutlined />}>
          刷新页面
        </Menu.Item>
        <Menu.Item key="CloseOutlined" icon={<CloseOutlined />}>
          关闭当前
        </Menu.Item>
        <Menu.Item key="CloseCircleOutlined" icon={<CloseCircleOutlined />}>
          关闭其他
        </Menu.Item>
        <Menu.Item key="SwapLeftOutlined" icon={<SwapLeftOutlined />}>
          关闭左侧
        </Menu.Item>
        <Menu.Item key="SwapRightOutlined" icon={<SwapRightOutlined />}>
          关闭右侧
        </Menu.Item>
        <Menu.Item key="CloseSquareOutlined" icon={<CloseSquareOutlined />}>
          全部关闭
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div className="HeaderScroll">
      {/* <div style={{ marginBottom: 16 }}>
        <Button onClick={add}>ADD</Button>
      </div> */}
      <Tabs
        size="small"
        onTabClick={(key) => {
          props.history.push(key);
        }}
        key={new Date().getTime()}
        hideAdd
        onChange={onChange}
        activeKey={props.activeKey}
        type="editable-card"
        onEdit={onEdit}
      >
        {props.panes.map((pane: { title: React.ReactNode; key: string | number | null | undefined; content: React.ReactNode }) => (
          <TabPane
            closeIcon={pane.key === "/index/layout"}
            tab={
              <Dropdown overlay={menu(pane)} trigger={["contextMenu"]}>
                <div>{pane.title}</div>
              </Dropdown>
            }
            key={pane.key}
          ></TabPane>
        ))}
      </Tabs>
    </div>
  );
}
export default HeaderScroll;
