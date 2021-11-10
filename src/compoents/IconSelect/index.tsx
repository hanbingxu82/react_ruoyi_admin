/*
 * @Author: your name
 * @Date: 2021-11-10 11:30:31
 * @LastEditTime: 2021-11-10 14:04:25
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/compoents/IconSelect/index.tsx
 */
import { Tooltip, Button, Input } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import "./index.less";
import icons from "./requireIcons.js";
import SvgIcon from "compoents/SvgIcon";
import { useState } from "react";

const { Search } = Input;

const IconSelect = (props: any) => {
  console.log(icons);
  const [iconList, setIconList] = useState(icons || []);
  function filterIcons(e:any) {
    setIconList(() => [...icons]);
    if (e.target.value) {
      setIconList(() => {
        const arr = iconList.filter((item: string | string[]) => item.includes(e.target.value));
        return [...arr];
      });
    }
  }
  function selectedIcon(name: any) {
    props.selected(name);
    document.body.click();
  }
  return (
    <div className="icon-body" style={{ width: "460px" }}>
      <Search style={{ position: "relative" }} placeholder="请输入图标名称" allowClear onInput={(e) => {filterIcons(e)}} onSearch={(e) => {filterIcons(e)}} />
      <div className="icon-list">
        {iconList.map((item: any, index: any) => {
          return (
            <div
              key={index}
              onClick={() => {
                selectedIcon(item);
              }}
            >
              <SvgIcon iconClass={item} style={{ height: "30px", width: "16px" }}></SvgIcon>
              <span>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconSelect;
