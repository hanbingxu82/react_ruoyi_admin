/*
 * @Author: your name
 * @Date: 2021-11-11 17:29:36
 * @LastEditTime: 2021-11-16 16:49:22
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/compoents/HeaderScroll/index.tsx
 */
import React, { useState, useEffect, useRef } from "react";
import { Tabs, Button } from "antd";
import "./index.less";

const { TabPane } = Tabs;
function HeaderScroll(props:any) {
  // 声明一个名为“count”的新状态变量 11
  const [activeKey, setActiveKey] = useState<any>("0");
  const [panes, setPanes] = useState<any>([{ title: "首页", key: "/index/layout" }]);
  const newTabIndex = useRef(0);

  // 类似于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    setActiveKey(panes[0].key);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const onChange = (activeKey: any) => {
    setActiveKey(activeKey);
  };

  const onEdit = (targetKey: any, action: any) => {
    console.log(targetKey, action);
    //   [action](targetKey);
    if (action === "add") {
      add();
    } else if (action === "remove") {
      debugger;
      remove(targetKey);
    }
  };
  function add() {
    newTabIndex.current++;

    const activeKey = `newTab${newTabIndex.current}`;
    setActiveKey(activeKey);
    setPanes((data: any) => {
      data.push({ title: "New Tab", content: "New Tab Pane", key: activeKey });
      return [...data];
    });
  }
  function remove(targetKey: any) {
    let lastIndex = 0;
    let activeKeyStr = "";
    panes.forEach((pane: { key: any }, i: number) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const arr = panes.filter((pane: { key: any }) => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKeyStr = panes[lastIndex].key;
      } else {
        activeKeyStr = panes[0].key;
      }
    }

    setActiveKey(activeKeyStr);
    setPanes((data: any) => {
      data = arr;
      return [...data];
    });
  }
  return (
    <div className="HeaderScroll">
      {/* <div style={{ marginBottom: 16 }}>
        <Button onClick={add}>ADD</Button>
      </div> */}
      <Tabs size="small" key={new Date().getTime()} hideAdd onChange={onChange} activeKey={activeKey} type="editable-card" onEdit={onEdit}>
        {panes.map((pane: { title: React.ReactNode; key: string | number | null | undefined; content: React.ReactNode }) => (
          <TabPane tab={pane.title} key={pane.key}></TabPane>
        ))}
      </Tabs>
    </div>
  );
}
export default HeaderScroll;
