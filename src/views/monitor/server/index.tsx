/*
 * @Author: your name
 * @Date: 2021-12-06 10:25:05
 * @LastEditTime: 2021-12-06 15:10:16
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/views/monitor/server/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Spin } from "antd";
import { getServer } from "api/monitor/server";
import ReactDOM from "react-dom";
import "./index.less";

function Server(props: any) {
  const [server, setServer] = useState<any>({});
  /**
   * @description: 生命周期初始化
   * @param {*}
   * @return {*}
   */
  useEffect(() => {
    getList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * @description: 获取表格信息
   * @param {*}
   * @return {*}
   */
  function getList() {
    showLoading();
    getServer().then((response) => {
      setServer(response.data);
      hideLoading();
    });
  }
  // 当前正在请求的数量
  let requestCount = 0;
  // 显示loading
  function showLoading() {
    if (requestCount === 0) {
      var dom = document.createElement("div");
      dom.setAttribute("id", "loading");
      document.body.appendChild(dom);
      ReactDOM.render(<Spin tip="加载中..." size="large" />, dom);
    }
    requestCount++;
  }

  // 隐藏loading
  function hideLoading() {
    requestCount--;
    if (requestCount === 0) {
      document.body.removeChild(document.getElementById("loading") as HTMLElement);
    }
  }
  return (
    <>
      <Row>
        <Col span={12} style={{ paddingRight: "20px" }}>
          <Card title="CPU">
            <div className="ant-table">
              <table cellSpacing="0" style={{ width: "100%" }}>
                <thead className="ant-table-thead">
                  <tr>
                    <th style={{ background: "#fff" }}>属性</th>
                    <th style={{ background: "#fff" }}>值</th>
                  </tr>
                </thead>
                <tbody className="ant-table-tbody">
                  <tr>
                    <td>
                      <div>核心数</div>
                    </td>
                    <td>{server.cpu && <div>{server.cpu.cpuNum}</div>}</td>
                  </tr>
                  <tr>
                    <td>
                      <div>用户使用率</div>
                    </td>
                    <td>{server.cpu && <div>{server.cpu.used}%</div>}</td>
                  </tr>
                  <tr>
                    <td>
                      <div>系统使用率</div>
                    </td>
                    <td>{server.cpu && <div>{server.cpu.sys}%</div>}</td>
                  </tr>
                  <tr>
                    <td>
                      <div>当前空闲率</div>
                    </td>
                    <td>{server.cpu && <div>{server.cpu.free}%</div>}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
        <Col span={12} style={{ paddingLeft: "20px" }}>
          <Card title="内存">
            <div className="ant-table">
              <table cellSpacing="0" style={{ width: "100%" }}>
                <thead className="ant-table-thead">
                  <tr>
                    <th style={{ background: "#fff" }}>属性</th>
                    <th style={{ background: "#fff" }}>内存</th>
                    <th style={{ background: "#fff" }}>JVM</th>
                  </tr>
                </thead>
                <tbody className="ant-table-tbody">
                  <tr>
                    <td>
                      <div>总内存</div>
                    </td>
                    <td>{server.mem && <div>{server.mem.total}G</div>}</td>
                    <td>{server.jvm && <div>{server.jvm.total}M</div>}</td>
                  </tr>
                  <tr>
                    <td>
                      <div>已用内存</div>
                    </td>
                    <td>{server.mem && <div>{server.mem.used}G</div>}</td>
                    <td>{server.jvm && <div>{server.jvm.used}M</div>}</td>
                  </tr>
                  <tr>
                    <td>
                      <div>剩余内存</div>
                    </td>
                    <td>{server.mem && <div>{server.mem.free}G</div>}</td>
                    <td>{server.jvm && <div>{server.jvm.free}M</div>}</td>
                  </tr>
                  <tr>
                    <td>
                      <div>使用率</div>
                    </td>
                    <td>{server.mem && <div style={{ color: server.mem.usage > 80 ? "red" : "" }}>{server.mem.usage}%</div>}</td>
                    <td>{server.jvm && <div style={{ color: server.jvm.usage > 80 ? "red" : "" }}>{server.jvm.usage}%</div>}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Col span={24}>
          <Card title="服务器信息">
            <div className="ant-table">
              <table cellSpacing="0" style={{ width: "100%" }}>
                <tbody className="ant-table-tbody">
                  <tr>
                    <td>
                      <div>服务器名称</div>
                    </td>
                    <td>{server.sys && <div>{server.sys.computerName}</div>}</td>
                    <td>
                      <div>操作系统</div>
                    </td>
                    <td>{server.sys && <div>{server.sys.osName}</div>}</td>
                  </tr>
                  <tr>
                    <td>
                      <div>服务器IP</div>
                    </td>
                    <td>{server.sys && <div>{server.sys.computerIp}</div>}</td>
                    <td>
                      <div>系统架构</div>
                    </td>
                    <td>{server.sys && <div>{server.sys.osArch}</div>}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Col span={24}>
          <Card title="Java虚拟机信息">
            <div className="ant-table">
              <table cellSpacing="0" style={{ width: "100%" }}>
                <tbody className="ant-table-tbody">
                  <tr>
                    <td>
                      <div>Java名称</div>
                    </td>
                    <td>{server.jvm && <div>{server.jvm.name}</div>}</td>
                    <td>
                      <div>Java版本</div>
                    </td>
                    <td>{server.jvm && <div>{server.jvm.version}</div>}</td>
                  </tr>
                  <tr>
                    <td>
                      <div>启动时间</div>
                    </td>
                    <td>{server.jvm && <div>{server.jvm.startTime}</div>}</td>
                    <td>
                      <div>运行时长</div>
                    </td>
                    <td>{server.jvm && <div>{server.jvm.runTime}</div>}</td>
                  </tr>
                  <tr>
                    <td colSpan={1}>
                      <div>安装路径</div>
                    </td>
                    <td colSpan={3}>{server.jvm && <div>{server.jvm.home}</div>}</td>
                  </tr>
                  <tr>
                    <td colSpan={1}>
                      <div>项目路径</div>
                    </td>
                    <td colSpan={3}>{server.sys && <div>{server.sys.userDir}</div>}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Col span={24}>
          <Card title="磁盘状态">
            <div className="ant-table">
              <table cellSpacing="0" style={{ width: "100%" }}>
                <thead className="ant-table-thead">
                  <tr>
                    <th style={{ background: "#fff" }}>
                      <div>盘符路径</div>
                    </th>
                    <th style={{ background: "#fff" }}>
                      <div>文件系统</div>
                    </th>
                    <th style={{ background: "#fff" }}>
                      <div>盘符类型</div>
                    </th>
                    <th style={{ background: "#fff" }}>
                      <div>总大小</div>
                    </th>
                    <th style={{ background: "#fff" }}>
                      <div>可用大小</div>
                    </th>
                    <th style={{ background: "#fff" }}>
                      <div>已用大小</div>
                    </th>
                    <th style={{ background: "#fff" }}>
                      <div>已用百分比</div>
                    </th>
                  </tr>
                </thead>
                {server.sysFiles && (
                  <tbody className="ant-table-tbody">
                    {server.sysFiles.map((sysFile: any, index: any) => {
                      return (
                        <tr key={"sysFile" + index}>
                          <td>
                            <div style={{ maxWidth: 200 }}>{sysFile.dirName}</div>
                          </td>
                          <td>
                            <div style={{ maxWidth: 200 }}>{sysFile.sysTypeName}</div>
                          </td>
                          <td>
                            <div style={{ maxWidth: 200 }}>{sysFile.typeName}</div>
                          </td>
                          <td>
                            <div style={{ maxWidth: 200 }}>{sysFile.total}</div>
                          </td>
                          <td>
                            <div style={{ maxWidth: 200 }}>{sysFile.free}</div>
                          </td>
                          <td>
                            <div style={{ maxWidth: 200 }}>{sysFile.used}</div>
                          </td>
                          <td>
                            <div style={{ maxWidth: 200, color: server.mem.usage > 80 ? "red" : "" }}>{sysFile.usage}%</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Server;
