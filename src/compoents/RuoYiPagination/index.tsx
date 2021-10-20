/*
 * @Author: your name
 * @Date: 2021-10-20 11:00:02
 * @LastEditTime: 2021-10-20 14:17:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/compoents/RuoYiPagination/index.tsx
 */
import React, { useEffect } from "react";
import "./index.less";
import { Pagination } from "antd";
function RuoYiPagination(props: any) {
  useEffect(() => {}, []);
  return (
    <div className="RuoYiPagination">
      <Pagination
        total={props.total}
        onChange={(page, pageSize) => {
          props.onChange(page, pageSize);
        }}
        showSizeChanger
        showQuickJumper
      />
    </div>
  );
}
export default RuoYiPagination;
