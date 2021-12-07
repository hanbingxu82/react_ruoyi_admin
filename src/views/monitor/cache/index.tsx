/*
 * @Author: your name
 * @Date: 2021-12-07 09:38:30
 * @LastEditTime: 2021-12-07 13:58:51
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/views/monitor/cache/index.tsx
 */
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { Row, Col, Card, Spin } from "antd";
import { getCache } from "api/monitor/cache";
import * as echarts from "echarts";
import "./index.less";

function Cache(props: any) {
  const [cache, setCache] = useState<any>([]);
  const commandstats: any = useRef(null);
  const usedmemory: any = useRef(null);
  /**
   * @description: 生命周期初始化
   * @param {*}
   * @return {*}
   */
  useLayoutEffect(() => {
    getCache().then((res: any) => {
      setCache(res.data);
      const commandstatsEcharts = echarts.init(commandstats.current, "macarons");
      commandstatsEcharts.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        series: [
          {
            name: "命令",
            type: "pie",
            roseType: "radius",
            radius: [15, 95],
            center: ["50%", "38%"],
            data: res.data.commandStats,
            animationEasing: "cubicInOut",
            animationDuration: 1000,
          },
        ],
      });
      const usedmemoryEcharts = echarts.init(usedmemory.current, "macarons");
      usedmemoryEcharts.setOption({
        tooltip: {
          formatter: "{b} <br/>{a} : " + res.data.info.used_memory_human,
        },

        series: [
          {
            name: "峰值",
            type: "gauge",
            
            min: 0,
            max: 1000,
            detail: {
              formatter: res.data.info.used_memory_human,
              valueAnimation: true,
              offsetCenter: [0, 100],
            },
            title: {
              offsetCenter: [0, 70],
            },
            data: [
              {
                value: parseFloat(res.data.info.used_memory_human),
                name: "内存消耗",
              },
            ],
          },
        ],
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Row>
        <Col span={24}>
          <Card title="基本信息">
            <div className="ant-table">
              <table cellSpacing="0" style={{ width: "100%" }}>
                <tbody className="ant-table-tbody">
                  <tr>
                    <td>
                      <div>Redis版本</div>
                    </td>
                    <td>{cache.info && <div>{cache.info.redis_version}</div>}</td>
                    <td>
                      <div>运行模式</div>
                    </td>
                    <td>{cache.info && <div>{cache.info.redis_mode === "standalone" ? "单机" : "集群"}</div>}</td>
                    <td>
                      <div>端口</div>
                    </td>
                    <td>{cache.info && <div>{cache.info.tcp_port}</div>}</td>
                    <td>
                      <div>客户端数</div>
                    </td>
                    <td>{cache.info && <div>{cache.info.connected_clients}</div>}</td>
                  </tr>
                  <tr>
                    <td>
                      <div>运行时间(天)</div>
                    </td>
                    <td>{cache.info && <div>{cache.info.uptime_in_days}</div>}</td>
                    <td>
                      <div>使用内存</div>
                    </td>
                    <td>{cache.info && <div>{cache.info.used_memory_human}</div>}</td>
                    <td>
                      <div>使用CPU</div>
                    </td>
                    <td>{cache.info && <div>{parseFloat(cache.info.used_cpu_user_children).toFixed(2)}</div>}</td>
                    <td>
                      <div>内存配置</div>
                    </td>
                    <td>{cache.info && <div>{cache.info.maxmemory_human}</div>}</td>
                  </tr>

                  <tr>
                    <td>
                      <div>AOF是否开启</div>
                    </td>
                    <td>{cache.info && <div>{cache.info.aof_enabled === "0" ? "否" : "是"}</div>}</td>
                    <td>
                      <div>RDB是否成功</div>
                    </td>
                    <td>{cache.info && <div>{cache.info.rdb_last_bgsave_status}</div>}</td>
                    <td>
                      <div>Key数量</div>
                    </td>
                    <td>{cache.dbSize && <div>{cache.dbSize}</div>}</td>
                    <td>
                      <div>网络入口/出口</div>
                    </td>
                    <td>
                      {cache.info && (
                        <div>
                          {cache.info.instantaneous_input_kbps}kps/{cache.info.instantaneous_output_kbps}kps
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
      </Row>
      <Row style={{ paddingTop: "10px" }}>
        <Col span={12} style={{ paddingRight: "20px" }}>
          <Card title="命令统计">
            <div ref={commandstats} style={{ height: 420 }} />
          </Card>
        </Col>
        <Col span={12} style={{ paddingLeft: "20px" }}>
          <Card title="内存信息">
            <div ref={usedmemory} style={{ height: 420 }} />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Cache;
