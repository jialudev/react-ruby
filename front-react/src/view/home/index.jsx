// import { useState } from 'react'
import './index.css'
import ReactEcharts from "echarts-for-react"
// import echarts from "echarts";
import { option_compare, option_day, option_flow, option_pie } from './getOpts'
export default function Page() {
    // const [count, setCount] = useState(0)

    return (

        <div className="wrap">
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
                            </tbody>
                        </table>
                    </div>
                    <div className="pie_wrap">

                        <ReactEcharts className="pie_charts" option={option_pie} />
                        {/* <div className="pie_charts" id="pie_charts"></div> */}
                    </div>
                </div>
                <div className="daydata_wrap">
                    <div className="top_content"></div>
                    <div className="">
                        <div className="data_text" id="maxdayval">本日最大负荷:&nbsp<span></span></div>
                        <div className="data_text" id="maxdaytime">发生时间:&nbsp<span></span></div>
                        <div className="data_text" id="maxmonthval">本月最大负荷:&nbsp<span></span></div>
                        <div className="data_text" id="maxmonthtime">发生时间:&nbsp<span></span></div>
                        <div className="data_text" id="maxyearval">本年最大负荷:&nbsp<span></span></div>
                        <div className="data_text" id="maxyeartime">发生时间:&nbsp<span></span></div>
                    </div>
                </div>
                <div className="compare_wrap">
                    <div className="top_content"></div>
                    <div className="head">
                        <div className="data_title">用电概况</div>

                    </div>
                    <div className="content active">
                        <div className="data_text" id="nowval">当日用量:&nbsp<span></span></div>
                        <div className="data_text" id="year-on">同比:&nbsp<span></span></div>
                        <div className="data_text" id="chain-ratio">环比:&nbsp<span></span></div>
                    </div>
                </div>

            </div>
            <div className="main_left">
                <div className="echarts_wrap_top">
                    <div className="top_content">
                        <div className="top_nav">

                            <ul className="date_tab">
                                <li className="year" value="Y">年</li>
                                <li className="month current" value="M">月</li>
                            </ul>
                            <select name="" id="energy_type_secelt" className="energyTypeSecelt">
                                <option value="">电</option>
                            </select>

                            <p>
                                能源类型
                            </p>
                        </div>
                    </div>
                    <ReactEcharts className="my_flowecharts" option={option_flow} />
                </div>
                <div className="echarts_wrap echarts_wrap_middle">
                    <ReactEcharts className="my-charts" option={option_day} />
                </div>
                <div className="echarts_wrap echarts_wrap_bottom">
                    <div className="nav">
                        <ul className="bottom_date_tab date_tab" id="electricity_comparison_tab">
                            <li className="year" value="Y">年</li>
                            <li className="month current" value="M">月</li>
                        </ul>
                    </div>

                    <ReactEcharts className="my-charts" option={option_compare} />
                </div>


            </div>
        </div>
    )
}


