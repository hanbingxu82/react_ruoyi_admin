/*
 * @Author: your name
 * @Date: 2021-10-09 09:36:54
 * @LastEditTime: 2021-11-22 10:52:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/views/App/App.tsx
 */
import "./App.less";
import React, { useEffect, useState, useRef } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import HeaderScroll from "compoents/HeaderScroll";
import { MenuUnfoldOutlined, MenuFoldOutlined, AppstoreOutlined, SettingOutlined, UserOutlined, CaretDownOutlined, FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import routers from "../../router";
import { Route, NavLink } from "react-router-dom";
import { connect } from "react-redux";
//从redux中引入一个方法用于将actionCreators中的方法进行绑定 就是用  dispatch({actions暴露方法})
import { bindActionCreators } from "redux";
import actions from "../../store/actions";
import SvgIcon from "compoents/SvgIcon";
import { requestFullScreen, exitFullScreen, isFullscreenElement } from "utils/ruoyi";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
function App(props: any) {
  /**
   * @description: 是否第一次加载组件
   * @param {*}
   * @return {*}
   */
  const initComponent = useRef(true);
  const [panes, setPanes] = useState<any>([{ title: "首页", key: "/index/layout" }]);
  const [activeKey, setActiveKey] = useState<any>("0");
  const [collapsed, setCollapsed] = useState(false);

  const [fullScreen, setFullScreen] = useState(false);
  const [originResizeFunc, setOriginResizeFunc] = useState<any>(null);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState("");
  const [isOpen, setIsOpen] = useState<any>([]);

  useEffect(() => {
    if (initComponent.current) return;
    /**
     * @description: 判断是否为 hash 模式  路由高亮判断
     * @param {*} test
     * @return {*}
     */
    if (/#/.test(window.location.href)) {
      const arr = window.location.href.split("#");
      let pathObj = props.routerMenu.filter((item: any) => {
        return item.path === arr[1];
      });
      if (pathObj.length > 0) {
        let open = pathObj[0].path.split("/") || [];
        open.forEach((element: any, index: number) => {
          open[index] = "/" + open[index];
        });
        setIsOpen([...open]);
        setDefaultSelectedKeys(pathObj[0].path);
        add({ title: pathObj[0].meta.title, key: pathObj[0].path });
      } else {
        pathObj = routers.subRouters.filter((item: any) => {
          return item.path === arr[1];
        });
        if (pathObj.length > 0) {
          let open = pathObj[0].path.split("/") || [];
          open.forEach((element: any, index: number) => {
            open[index] = "/" + open[index];
          });
          setIsOpen([...open]);

          setDefaultSelectedKeys(pathObj[0].path);
          if (pathObj[0].path !== "/index/layout") {
            add({ title: pathObj[0].meta.title, key: pathObj[0].path });
          }
        }
      }
    }
  }, [props.routerMenu]); // eslint-disable-line react-hooks/exhaustive-deps
  // 生命周期执行副作用
  useEffect(() => {
    initComponent.current = false;
    props.getMenu();
    setActiveKey(panes[0].key);
    // 监听esc退出全屏
    if (window.addEventListener) {
      window.addEventListener("resize", onEscCancelFull, false);
    } else {
      setOriginResizeFunc(window.onresize);
      window.onresize = onEscCancelFull;
    }
    return () => {
      if (window.removeEventListener) {
        window.removeEventListener("resize", onEscCancelFull, false);
      } else {
        window.onresize = originResizeFunc;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  function onEscCancelFull() {
    setFullScreen(isFullscreenElement());
  }
  // 变换展开模式
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  const onHeaderMenuChange = (key: any) => {
    setActiveKey(key);
  };
  function add(obj: any) {
    const activeKey = obj.key;
    setActiveKey(activeKey);
    setPanes((data: any) => {
      data.push({ title: obj.title, key: activeKey });
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
    if (activeKeyStr) {
      setActiveKey(activeKeyStr);
      props.history.push(activeKeyStr);
    }
    setPanes((data: any) => {
      data = arr;
      return [...data];
    });
  }
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
  // navLink点击事件
  function toClickNavLink(link: any, title: any) {
    const isYes = panes.some((item: any) => {
      return item.key === link;
    });
    if (!isYes) {
      add({ title, key: link });
    } else {
      setActiveKey(link);
    }
  }
  // menu 下选菜单
  const menu = (
    <Menu>
      <Menu.Item key="PersonalCenter">
        <NavLink
          onClick={() => {
            toClickNavLink("/user/profile", "个人中心");
          }}
          style={{ textDecoration: "none" }}
          to={"/user/profile"}
        >
          个人中心
        </NavLink>
      </Menu.Item>
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

          <Menu theme="dark" mode="inline" key={"defaultSelectedKeys" + defaultSelectedKeys} defaultOpenKeys={isOpen} defaultSelectedKeys={[defaultSelectedKeys]}>
            <Menu.Item key="/index/layout" icon={<AppstoreOutlined />}>
              <NavLink
                onClick={() => {
                  toClickNavLink("/index/layout", "首页");
                }}
                style={{ textDecoration: "none" }}
                to="/index/layout"
              >
                首页
              </NavLink>
            </Menu.Item>
            {props.sidebarRoutes.map((item: any) => {
              if (!item.hidden) {
                return (
                  <SubMenu key={item.path} title={item.meta.title} icon={<SvgIcon style={{ marginRight: "10px" }} iconClass={item.meta.icon}></SvgIcon>}>
                    {item.children.map((e: any) => {
                      if (!e.hidden) {
                        if (e.children) {
                          return (
                            <SubMenu key={"/" + e.path} title={e.meta.title}>
                              {e.children.map((i: any) => {
                                return (
                                  <Menu.Item key={item.path + "/" + e.path + "/" + i.path}>
                                    <NavLink
                                      onClick={() => {
                                        console.log();
                                        toClickNavLink(item.path + "/" + e.path + "/" + i.path, i.meta.title);
                                      }}
                                      style={{ textDecoration: "none" }}
                                      to={item.path + "/" + e.path + "/" + i.path}
                                    >
                                      {i.meta.title}
                                    </NavLink>
                                  </Menu.Item>
                                );
                              })}
                            </SubMenu>
                          );
                        } else {
                          return (
                            <Menu.Item key={item.path + "/" + e.path}>
                              <NavLink
                                onClick={() => {
                                  toClickNavLink(item.path + "/" + e.path, e.meta.title);
                                }}
                                style={{ textDecoration: "none" }}
                                to={item.path + "/" + e.path}
                              >
                                {e.meta.title}
                              </NavLink>
                            </Menu.Item>
                          );
                        }
                      }
                      return null;
                    })}
                  </SubMenu>
                );
              }
              return null;
            })}
            {/* <SubMenu key="sub2" icon={<SettingOutlined />} title="系统管理">
              <Menu.Item key="2">
                <NavLink style={{ textDecoration: "none" }} to="/system/user">
                  用户管理
                </NavLink>
              </Menu.Item>
              <Menu.Item key="3">
                <NavLink style={{ textDecoration: "none" }} to="/system/role">
                  角色管理
                </NavLink>
              </Menu.Item>
              <Menu.Item key="4">
                <NavLink style={{ textDecoration: "none" }} to="/system/menu">
                  菜单管理
                </NavLink>
              </Menu.Item>
              <Menu.Item key="5">
                <NavLink style={{ textDecoration: "none" }} to="/system/post">
                  岗位管理
                </NavLink>
              </Menu.Item>
              <Menu.Item key="6">
                <NavLink style={{ textDecoration: "none" }} to="/system/dept">
                  部门管理
                </NavLink>
              </Menu.Item>
              <Menu.Item key="7">
                <NavLink style={{ textDecoration: "none" }} to="/system/dict">
                  字典管理
                </NavLink>
              </Menu.Item>
              <Menu.Item key="8">
                <NavLink style={{ textDecoration: "none" }} to="/system/config">
                  参数设置
                </NavLink>
              </Menu.Item>
              <Menu.Item key="9">
                <NavLink style={{ textDecoration: "none" }} to="/system/notice">
                  公告管理
                </NavLink>
              </Menu.Item>
              <SubMenu key="10" title="日志管理">
                <Menu.Item key="10-1">
                  <NavLink style={{ textDecoration: "none" }} to="/system/log/operlog">
                    操作日志
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="10-2">
                  <NavLink style={{ textDecoration: "none" }} to="/system/log/logininfor">
                    登录日志
                  </NavLink>
                </Menu.Item>
              </SubMenu>
            </SubMenu> */}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <div>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: "trigger",
                onClick: toggle,
              })}
              <div className="rightheader">
                {fullScreen ? (
                  <FullscreenExitOutlined
                    onClick={() => {
                      exitFullScreen();
                    }}
                    style={{ fontSize: "24px", marginRight: "10px" }}
                  />
                ) : (
                  <FullscreenOutlined
                    onClick={() => {
                      requestFullScreen(document.body);
                    }}
                    style={{ fontSize: "24px", marginRight: "10px" }}
                  />
                )}

                <Dropdown overlay={menu} placement="bottomCenter" arrow trigger={["click"]}>
                  <div>
                    <Avatar shape="square" icon={<UserOutlined />} />
                    <CaretDownOutlined className="righticondown" />
                  </div>
                </Dropdown>
              </div>
            </div>
            <HeaderScroll {...props} add={add} remove={remove} onHeaderMenuChange={onHeaderMenuChange} activeKey={activeKey} panes={panes}></HeaderScroll>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "12px 24px",
              padding: 24,
              minHeight: 280,
              overflowY: "auto",
            }}
          >
            {routers.subRouters.map((v) => (
              <Route key={v.path} path={v.path} exact={v.exact} component={v.component} />
            ))}
            {props.routerMenu.map((v: any) => {
              return <Route key={v.path} path={v.path} exact={v.exact} component={v.component} />;
            })}
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
