/*
 * @Author: your name
 * @Date: 2021-11-08 15:36:41
 * @LastEditTime: 2021-11-08 15:57:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/compoents/SvgIcon/index.tsx
 */
import React, { useEffect } from "react";
import "./index.less";
import { isExternal } from "utils/validate";

function SvgIcon(props: any) {
  const { iconClass, className } = props;
  useEffect(() => {}, []);

  function isExternals() {
    return isExternal(iconClass);
  }
  function iconName() {
    return `#icon-${iconClass}`;
  }
  function svgClass() {
    if (className) {
      return "svg-icon " + className;
    } else {
      return "svg-icon";
    }
  }
  function styleExternalIcon() {
    return {
      mask: `url(${iconClass}) no-repeat 50% 50%`,
      "-webkit-mask": `url(${iconClass}) no-repeat 50% 50%`,
    };
  }
  return (
    <div className="SvgIcon">
      {isExternals() ? (
        <div style={styleExternalIcon()} className="svg-external-icon svg-icon" />
      ) : (
        <svg className={svgClass()} aria-hidden="true">
          <use xlinkHref={iconName()} />
        </svg>
      )}
    </div>
  );
}
export default SvgIcon;
