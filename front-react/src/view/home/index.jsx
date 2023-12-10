import { useState } from "react";
import PropTypes from "prop-types";
import "./index.css";
import ReactEcharts from "echarts-for-react";
// import echarts from "echarts";
import { option_compare, option_day, option_flow, option_pie } from "./getOpts";
import { useEffect, memo } from "react";
import { Fetch } from "../../common/utils";
import { data_url } from "../../common/port";
import cable from "../../common/actionCable";

PageRight.propTypes = {
  tableData: PropTypes.array.isRequired,
};

function PageRight({ tableData }) {
  console.log("PageRight render===", tableData);
  return (
    <div className="main_right">
      <div className="main_right_top">
        <div className="tn_table">
          <table id="energy_condition_table">
            <thead>
              <tr>
                <th colSpan="4">用能状况</th>
              </tr>
              <tr>
                <th>类型</th>
                <th>标煤系数</th>
                <th>本月用能</th>
                <th>单位</th>
              </tr>
            </thead>
            <tbody className="mytbody">
              {tableData.length ? (
                tableData.map((item, inx) => {
                  return (
                    <tr key={inx}>
                      {item.map((itemList, index) => (
                        <td key={index + inx}>{itemList}</td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <>
                  <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="pie_wrap">
          <ReactEcharts className="pie_charts" option={option_pie} />
        </div>
      </div>
      <div className="daydata_wrap">
        <div className="top_content"></div>
        <div className="">
          <div className="data_text" id="maxdayval">
            本日最大负荷:123<span></span>
          </div>
          <div className="data_text" id="maxdaytime">
            发生时间:123<span></span>
          </div>
          <div className="data_text" id="maxmonthval">
            本月最大负荷:123<span></span>
          </div>
          <div className="data_text" id="maxmonthtime">
            发生时间:123<span></span>
          </div>
          <div className="data_text" id="maxyearval">
            本年最大负荷:123<span></span>
          </div>
          <div className="data_text" id="maxyeartime">
            发生时间:123<span></span>
          </div>
        </div>
      </div>
      <div className="compare_wrap">
        <div className="top_content"></div>
        <div className="head">
          <div className="data_title">用电概况</div>
        </div>
        <div className="content active">
          <div className="data_text" id="nowval">
            当日用量:123<span></span>
          </div>
          <div className="data_text" id="year-on">
            同比:123<span></span>
          </div>
          <div className="data_text" id="chain-ratio">
            环比:123<span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
const MemoizedPageRight = memo(PageRight, (pros, newProp) => {
  return newProp.tableData.length == pros.tableData.length;
});
export default function Page() {
  const [tableData, setTableData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const data = Array.from({ length: 500 }, (r, i) => i + 9);
  const list = [];
  list[0] = [...data];
  list[1] = JSON.parse(JSON.stringify(data.reverse()));
  const [socketData, setSocketData] = useState(list);

  useEffect(() => {
    // const channel = cable.subscriptions.create("CableChannel", {
    //   connected() {
    //     console.log("Connected to ActionCable channel");
    //     // setTimeout(() => {
    //     //   this.perform("receive", { data: socketData });
    //     //   console.log("发送 receive", socketData);
    //     // }, 1000);
    //   },
    //   disconnected() {
    //     console.log("Disconnected from ActionCable channel");
    //   },
    //   received(res) {
    //     console.log("Received data from ActionCable:", res);
    //     const { data } = res;
    //     setSocketData((list) => {
    //       list[0] = [...data];
    //       list[1] = JSON.parse(JSON.stringify(data.reverse()));
    //       return JSON.parse(JSON.stringify(list));
    //     });
    //     // setMessage(data.message);
    //   },
    // });
    // // 在组件卸载时取消订阅
    // return () => {
    //   channel.unsubscribe();
    // };
  }, [setSocketData]); // 仅在组件挂载时运行

  useEffect(() => {
    if (tableData.length) {
      return;
    }
    Fetch({ url: data_url }).then(({ result }) => {
      const { tableData: resData, lineData } = result;
      setTableData(resData);
      setLineData(lineData);
    });
  }, [tableData]);
  console.log(socketData, "socketData");
  return (
    <div className="wrap">
      <MemoizedPageRight tableData={tableData} />
      <div className="main_left">
        <div className="echarts_wrap_top">
          <div className="top_content">
            <div className="top_nav"></div>
          </div>
          <ReactEcharts className="my_flowecharts" option={option_flow} />
        </div>
        <div className="echarts_wrap echarts_wrap_middle">
          <ReactEcharts
            key={socketData[0].length}
            className="my-charts"
            option={option_day(socketData)}
          />
        </div>
        <div className="echarts_wrap echarts_wrap_bottom">
          <div className="nav"></div>
          <ReactEcharts
            className="my-charts"
            option={option_compare(lineData)}
          />
        </div>
      </div>
    </div>
  );
}
