/*
 * @Author: your name
 * @Date: 2021-10-09 09:36:54
 * @LastEditTime: 2021-10-12 08:41:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/App/App.tsx
 */
import "./App.less";
import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, AppstoreOutlined, SettingOutlined, UserOutlined, CaretDownOutlined } from "@ant-design/icons";
import routers from "../../router";
import { Route, NavLink } from "react-router-dom";
import { connect } from "react-redux";
//从redux中引入一个方法用于将actionCreators中的方法进行绑定 就是用  dispatch({actions暴露方法})
import { bindActionCreators } from "redux";
import actions from "../../store/actions";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
function App(props: any) {
  const [collapsed, setCollapsed] = useState(false);
  // 变换展开模式
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  /**
   * @description: 退出方法
   * @param {*} void
   * @return {*}
   */
  const clickLogOut = (): void => {
    // logout().then(() => {
    //   // 如果退出成功那么就调用 三个删除 localstorage
    //   window.localStorage.removeItem("ruoyi_token");
    //   window.localStorage.removeItem("ruoyi_role");
    //   window.localStorage.removeItem("ruoyi_user");
    //   // 跳转回登录页面
    //   props.history.replace('/login')
    // })
    props.getLogout(props);
  };

  // menu 下选菜单
  const menu = (
    <Menu>
      <Menu.Item key="PersonalCenter">个人中心</Menu.Item>
      <Menu.Item key="LogOut" onClick={clickLogOut}>
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="App">
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo">
            <img src="/logopng.png" alt="" /> <span>若依管理系统</span>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<AppstoreOutlined />}>
              <NavLink style={{ textDecoration: "none" }} to="/index/layout">
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
            <div className="rightheader">
              <Dropdown overlay={menu} placement="bottomCenter" arrow trigger={["click"]}>
                <div>
                  <Avatar shape="square" icon={<UserOutlined />} />
                  <CaretDownOutlined className="righticondown" />
                </div>
              </Dropdown>
            </div>
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
const mapDispatchToProps = (dispatch: any) => bindActionCreators(actions, dispatch);
export default connect(
  (state: any) => state,
  (dispatch: any) => mapDispatchToProps
)(App);
