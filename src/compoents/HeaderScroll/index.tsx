/*
 * @Author: your name
 * @Date: 2021-11-11 17:29:36
 * @LastEditTime: 2021-12-07 16:43:13
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/compoents/HeaderScroll/index.tsx
 */
import React, { useState, useEffect, useRef } from "react";
import { Tabs, Button, Menu, Dropdown } from "antd";

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
    console.log(tabDetail)
    return (
      <Menu>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3rd menu item</Menu.Item>
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
