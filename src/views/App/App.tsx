/*
 * @Author: your name
 * @Date: 2021-10-09 09:36:54
 * @LastEditTime: 2021-10-09 17:41:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/App/App.tsx
 */
import "./App.less";
import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import routers from "../../router";
import { Route, NavLink } from "react-router-dom";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
function App() {
  const [collapsed, setCollapsed] = useState(false);
  // 变换展开模式
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className="App">
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo">
            <img src="/logopng.png" alt="" /> <span>若依管理系统</span>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<AppstoreOutlined />}>
              <NavLink style={{ textDecoration: "none" }} to="/layout/index">
                首页
              </NavLink>
            </Menu.Item>
            <SubMenu key="sub2" icon={<SettingOutlined />} title="系统管理">
              <Menu.Item key="5">
                <NavLink style={{ textDecoration: "none" }} to="/system/user">
                  用户管理
                </NavLink>
              </Menu.Item>
              <Menu.Item key="6">
                <NavLink style={{ textDecoration: "none" }} to="/system/role">
                  角色管理
                </NavLink>
              </Menu.Item>
              <SubMenu key="sub3" title="日志管理">
                <Menu.Item key="7">操作日志</Menu.Item>
                <Menu.Item key="8">登录日志</Menu.Item>
              </SubMenu>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: "trigger",
              onClick: toggle,
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
            }}
          >
            {routers.subRouters.map((v) => (
              <Route key={v.path} path={v.path} exact={v.exact} component={v.component} />
            ))}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
