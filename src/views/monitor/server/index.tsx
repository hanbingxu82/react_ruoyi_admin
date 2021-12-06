/*
 * @Author: your name
 * @Date: 2021-12-06 10:25:05
 * @LastEditTime: 2021-12-06 13:40:26
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/views/monitor/server/index.tsx
 */
import { useState, useEffect, useRef } from "react";
import { Row, Col, Card } from "antd";
import { getServer } from "api/monitor/server";

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
    getServer().then((response) => {
      setServer(response.data);
    });
  }
  return (
    <>
      <Row>
        <Col span={12} style={{ paddingRight: "30px" }}>
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
        <Col span={12} style={{ paddingLeft: "30px" }}>
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
    </>
  );
}

export default Server;
