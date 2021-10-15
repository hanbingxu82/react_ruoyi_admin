/*
 * @Author: your name
 * @Date: 2021-10-15 10:36:00
 * @LastEditTime: 2021-10-15 11:33:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/compoents/ColTransfer/index.ts
 */
import React, { useState } from "react";
import { Transfer } from "antd";
import "./index.less";

let mockData: any[];

const ColTransfer = (props: any) => {
  mockData = [...props.columns];
  console.log(props)
  const initialTargetKeys = mockData.filter((item) => !item.visible).map((item) => item.key);
  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    // 禁用
    for (var item in mockData) {
      const key = mockData[item].key;
      mockData[item].visible = !nextTargetKeys.includes(key);
    }
    props.setColumns(mockData)
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };
  return <Transfer className="ColTransfer" dataSource={mockData} titles={["显示", "隐藏"]} targetKeys={targetKeys} selectedKeys={selectedKeys} onChange={onChange} onSelectChange={onSelectChange} render={(item) => item.title} />;
};

export default ColTransfer;
