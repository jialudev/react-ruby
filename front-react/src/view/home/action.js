$(function () {
    // 接口地址在yxqurl_config.js,lpurl

    // 声明时间循环调用变量
    var timer;

    $('.date_tab li').click(function () {
        $(this).addClass("current").siblings().removeClass("current");
        // req_lefttop();
    });

    $('.bottom_date_tab li').click(function () {
        $(this).addClass("current").siblings().removeClass("current");
        // req_lefttop();
    });



    $('.month-top li').click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    });

    $('.li-right li').click(function () {
        /*alert(1)*/
        var m = $(this).index();
        $('.blue-bg-2 .con-in').eq(m).addClass("active").siblings().removeClass("active");
        $('.blue-bg-item .con-in').eq(m).addClass("active").siblings().removeClass("active");
    });


    // 能留图月年切换
    $('.echarts_wrap_top .top_content .date_tab li').click(function () {
        if ($("#flowChartDateTab .current").attr("value") == "M") {
            layer.msg("数据量较多，渲染时间较长，请耐心等待！")
        } else if ($("#flowChartDateTab .current").attr("value") == "Y") {
            layer.msg("数据量较多，渲染时间较长，请耐心等待！")
        }

        clearTimeout(energyflow_diagram_dataSetimeout)
        funFlowChart();
    });


    // 用能状况月年切换
    $("#energy_condition_date_tab li").click(function () {
        req_righttop();
    })


    // 用能概况月年切换
    $('#electricity_consumption_tab li').click(function () {
        req_rightbottom()




    });



    // 本月上月电量月年切换
    $('#electricity_comparison_tab li').click(function () {
        // 如果顶头下拉菜单是电
        if ($("#energy_type_secelt option:selected").attr("value") == 1) {
            req_lefttbottom_e()
        } else {
            // 如果顶头下拉菜单是其他能源
            req_lefttbottom_else()
        }
    });

    // 日负荷曲线实时本日切换
    $('#real_time_load_tab li').click(function () {
        req_leftmiddle()
        if ($("#real_time_load_tab .current").attr("value") == 'A') {
            timer = setInterval(() => {
                console.log('click A');
                req_leftmiddle();
            }, 60000);
        } else {
            console.log('click D');
            clearInterval(timer);
        }
    });



    //下拉框
    function selectData() {
        //$('#select').empty();//初始化
        $.ajax({
            type: 'get',
            url: lp_url + '/homepage/energy_type_selected',
            dataType: "json",
            async: false,
            success: function (res) {
                console.log(res)
                var selectVal = [];
                var selectName = [];
                $.each(res.data, function (i, val) {
                    selectVal.push(val.id);
                    selectName.push(val.name);
                });
                $("#energy_type_secelt").empty();
                for (var i = 0; i < selectVal.length; i++) {
                    $("#energy_type_secelt").append("<option value=" + selectVal[i] + ">" + selectName[i] + "</option>")
                }
                $("#select option:eq(0)").attr('selected', 'selected'); //选中第一个
            },

        });
    }
    selectData();


    // 能源类型下拉菜单切换事件
    $("#energy_type_secelt").bind("change", function () {
        req_rightbottom()
        req_leftmiddle()
        if ($("#energy_type_secelt option:selected").attr("value") == 1) {
            req_lefttbottom_e()
        } else {
            // 如果顶头下拉菜单是其他能源
            req_lefttbottom_else()
        }
        req_righttop()

        // 切换能留图请求,先将前一次的递归请求关掉
        clearTimeout(energyflow_diagram_dataSetimeout)
        funFlowChart()
        // 如果是电显示能流图上面的数据
        if ($("#energy_type_secelt option:selected").html() == "电") {
            $(".echarts_wrap_top_title").show();
            $("#echarts_wrap_top_powerP").show();
            $("#echarts_wrap_top_load_factorP").show();
        }
        // 如果不是电影藏
        else {
            $(".echarts_wrap_top_title").hide();
            $("#echarts_wrap_top_powerP").hide();
            $("#echarts_wrap_top_load_factorP").hide();
        }

    })

    // 方法：让单个数字变成多位数
    function PrefixInteger(num, length) {
        return (num / Math.pow(10, length)).toFixed(length).substr(2);
    }
    // 方法：输入年份，月份，将这个月全部的日期放入arr数组内
    function myfulldate(myyear, mymonth) {
        var arr_date = [];
        for (var i = 0; i < 32; i++) {
            var mydate = new Date(myyear, mymonth, i);
            var my_month = mydate.getMonth();
            var my_date_ = mydate.getDate();
            if (my_month == mymonth) {
                arr_date.push(my_date_);
            }
        }
        return arr_date;
    }
    // 方法：年月日……拿到一天的小时：分钟
    function getMymin(myear, mmonth, mday, mhour, mminutes, msecond, len) {
        var arr = [];
        for (var i = 0; i < len; i++) {
            var ts = new Date(myear, mmonth, mday, mhour, mminutes, msecond);
            ts.setMinutes(ts.getMinutes() + i);
            // console.log(ts);
            myhou = ts.getFullYear() +
                "-" +
                ts.getMonth() +
                "-" +
                ts.getDate() +
                "\n" +
                PrefixInteger(ts.getHours(), 2) +
                ":" +
                PrefixInteger(ts.getMinutes(), 2);

            arr.push(myhou);
        }
        return arr;
    }



    // 左边仪表盘echarts ,已注销
    // var mytop_gauge_charts = echarts.init(document.getElementById("top_gauge_charts")); //能流图
    var option_gauge = {
        tooltip: {
            show: true,
            trigger: "item",
            formatter: '{b0}: {c}',
        },
        series: [{
            name: "负荷",
            type: "gauge",
            itemStyle: {
                borderWidth: 2,
            },
            // 刻度长度
            splitLine: {
                length: 22,
            },
            // 指针样式
            emphasis: {
                itemStyle: {
                }
            },
            data: [{
                name: "完成率",
                value: 64.06
            }],
            // 仪表盘轴线相对设置
            axisLine: {
                lineStyle: {
                    width: 20
                }
            },
        }]
    }
    // mytop_gauge_charts.setOption(option_gauge, true);



    //绘图
    $(".draw-line").css('width', $(".in-fo-l").width());
    var myflow_echarts = echarts.init(document.getElementById("flow_echarts")); //能流图
    var myday_echarts = echarts.init(document.getElementById("day_echarts")); //日负荷曲线
    // var mychart5 = echarts.init(document.getElementById("year-line"));
    var mycompare_echarts = echarts.init(document.getElementById("compare_echarts")); //上月本月
    // var mychart6 = echarts.init(document.getElementById("year-year")); //年曲线图
    var mypie_charts = echarts.init(document.getElementById("pie_charts")); //饼图
    /*var mychrat5 = echarts.init(document.getElementById("year-line"));//年曲线图*/
    var option_flow = {
        title: {
            textStyle: {
                color: '#00e74d'
                // color: '#ef4300'

            },
            text: "能流图",
            color: '#00e74d',
            left: '5%',
            // top: '5',
        },
        tooltip: {
            show: true,
            trigger: "item",
            formatter: '{b0}: {c}',
            // formatter: function (values) {
            //     console.log(values)
            // }
        },
        textStyle: {
            color: '#00f0ff'
        },
        draggable: false,
        // text: "能流图",
        // label: {
        //     color: "#fff",
        //     show: false,
        // },
        // color: ['#d87a80', '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#26C0C0'],
        // color: ['#ecbccc', '#005bac', '#e6e6b0', '#7fc8dc', '#c8e4e3', '#ecbccc', '#005bac'],
        // color: pie_color,
        color: ['#00e74d', '#e79200', '#00e74d', '#dae700', '#f3954d', '#93ddc4'],
        series: {
            left: "6%",
            right: "10%",
            // top: "16%",
            // bottom: "20%",
            // 实测数据后调整
            top: "10%",
            // bottom: "10%",
            type: 'sankey',
            // layout: 'none',
            // layoutIterations: "50",
            label: {
                color: "#fff",
                fontSize: 12,
            },
            // orient: "vertical",
            nodeGap: 14,
            layoutIterations: 4000,
            nodeAlign: "right",
            legend: {
                itemGap: 2,
            },
            // itemStyle: {
            //     normal: {
            //         color: ["#fff", "#000"],
            //         borderWidth: 0,
            //         borderColor: '#fff'
            //     },
            //     // opacity: 0,
            // },

            lineStyle: {
                normal: {
                    // color: 'source',
                    color: 'rgba(255, 255, 255, 1)',
                    curveness: 0.5
                }
            },

            data: [{ name: "2期冷轧车间" },
            { name: "1期冷轧车间" },
            { name: "2期照明" }
                , { name: "2期退火炉车间" }
                , { name: "保温炉" }
                , { name: "公辅用电" }
                , { name: "冲压设备" }
                , { name: "冲压车间" }
                , { name: "冷轧机" }
                , { name: "包装线" }
                , { name: "华峰铝业总用电" }
                , { name: "厚剪" }
                , { name: "在线除气" }
                , { name: "拉弯矫" }
                , { name: "热轧机" }
                , { name: "热轧车间" }
                , { name: "照明" }
                , { name: "照明（压延、精整）" }
                , { name: "熔铝炉" }
                , { name: "熔铸车间" }
                , { name: "磨床" }
                , { name: "磨床车间" }
                , { name: "精整车间" }
                , { name: "薄剪" }
                , { name: "退火炉" }
                , { name: "铸造机" }],




            links: [{ dataitems: "67041", source: "1期冷轧车间", target: "厚剪", value: 73 },
            { dataitems: "66671", source: "1期冷轧车间", target: "拉弯矫", value: 13 },
            { dataitems: "52611,52981,53351", source: "1期冷轧车间", target: "薄剪", value: 17 },
            { dataitems: "54091,54461", source: "2期冷轧车间", target: "冷轧机", value: 27 },
            // { dataitems: "60011", source: "2期照明", target: "2期照明", value: 75 },
            { dataitems: "59641,57791,58161,58531,58901,59271,57421", source: "2期退火炉车间", target: "退火炉", value: 27 },
            { dataitems: "51131", source: "公辅用电", target: "公辅用电", value: 62 },
            { dataitems: "72961", source: "冲压车间", target: "冲压设备", value: 70 },
            { dataitems: "60381", source: "包装线", target: "包装线", value: 13 },
            { dataitems: "56311,54461,55201", source: "华峰铝业总用电", target: "1期冷轧车间", value: 42 },
            { dataitems: "56311,54461,55201,73331", source: "华峰铝业总用电", target: "2期冷轧车间", value: 24 },
            { dataitems: "57421", source: "华峰铝业总用电", target: "2期照明", value: 1 },
            { dataitems: "60011", source: "华峰铝业总用电", target: "2期退火炉车间", value: 75 },
            { dataitems: "71111,68891,69261,67781", source: "华峰铝业总用电", target: "公辅用电", value: 13 },
            { dataitems: "63341", source: "华峰铝业总用电", target: "冲压车间", value: 25 },
            { dataitems: "68891", source: "华峰铝业总用电", target: "包装线", value: 15 },
            { dataitems: "62231", source: "华峰铝业总用电", target: "热轧车间", value: 20 },
            { dataitems: "60011", source: "华峰铝业总用电", target: "照明（压延、精整）", value: 75 },
            { dataitems: "52241,54091,51871", source: "华峰铝业总用电", target: "熔铸车间", value: 112 },
            { dataitems: "62971", source: "华峰铝业总用电", target: "磨床车间", value: 79 },
            { dataitems: "66301,60011,63341,57421,67411,62971", source: "华峰铝业总用电", target: "精整车间", value: 26 },
            // { dataitems: "62231", source: "热轧机", target: "热轧机", value: 20 },
            { dataitems: "62231", source: "热轧车间", target: "热轧机", value: 20 },
            { dataitems: "60011", source: "照明（压延、精整）", target: "照明", value: 75 },
            { dataitems: "42621,42991", source: "熔铸车间", target: "保温炉", value: 12 },
            { dataitems: "44841,43731", source: "熔铸车间", target: "在线除气", value: 10 },
            { dataitems: "43361,40771,41141,42251", source: "熔铸车间", target: "熔铝炉", value: 69 },
            { dataitems: "44101,44471", source: "熔铸车间", target: "铸造机", value: 19 },
            { dataitems: "62971", source: "磨床车间", target: "磨床", value: 79 },
            { dataitems: "73701,72221", source: "精整车间", target: "厚剪", value: 17 },
            { dataitems: "74071", source: "精整车间", target: "拉弯矫", value: 18 },
            { dataitems: "68151,71481,68521,71851", source: "精整车间", target: "薄剪", value: 25 },
            { dataitems: "64081,64451,64821,65191,65561,63711,65931", source: "精整车间", target: "退火炉", value: 73 }]


















            // [{
            //     source: '电',
            //     target: '生产部',
            //     value: 6,

            // },

            // {
            //     source: '电',
            //     target: '物品中心',
            //     value: 2
            // },
            // {
            //     source: '电',
            //     target: '研发部',
            //     value: 4
            // },
            // {
            //     source: '电',
            //     target: '销售部',
            //     value: 6
            // },
            // {
            //     source: '电',
            //     target: '综合部',
            //     value: 2
            // },
            // {
            //     source: '生产部',
            //     target: '动力',
            //     value: 2
            // },
            // {
            //     source: '生产部',
            //     target: '空调',
            //     value: 2
            // },
            // {
            //     source: '生产部',
            //     target: '办公用电',
            //     value: 2
            // },
            // {
            //     source: '物品中心',
            //     target: '空调',
            //     value: 2
            // },
            // {
            //     source: '研发部',
            //     target: '空调',
            //     value: 2
            // },
            // {
            //     source: '研发部',
            //     target: '办公用电',
            //     value: 2
            // },
            // {
            //     source: '销售部',
            //     target: '空调',
            //     value: 2
            // },
            // {
            //     source: '销售部',
            //     target: '照明',
            //     value: 2
            // },
            // {
            //     source: '销售部',
            //     target: '办公用电',
            //     value: 2
            // },
            // {
            //     source: '综合部',
            //     target: '空调',
            //     value: 2
            // },
            // ]
        }
    }
    myflow_echarts.setOption(option_flow, true);



    // 设置能留图从左到右的颜色
    var flowEchartColor = [{
        normal: {
            color: ["#00e74d"],
        },
    }, {
        normal: {
            color: ["#dae700"],
        },
    }, {
        normal: {
            color: ["#00e74d"],
        },
    }, {
        normal: {
            color: ["#e79200"],
        },
    }, {
        normal: {
            color: ["#00e4ff"],
        },
    }, {
        normal: {
            color: ["#e79200"],
        },
    }, {
        normal: {
            color: ["#dae700"],
        },
    }, {
        normal: {
            color: ["#4668b1"],
        },
    },]

    //日负荷曲线
    var option_day = {
        title: {
            textStyle: {
                color: '#00e74d'
            },
            text: "日负荷曲线",
            left: '4%',
            // top: "%",
        },
        grid: {
            x: "10%",
            y: "34%",
            x2: "6%",
            y2: "23%",
        },

        //提示框组件
        tooltip: {
            show: true,
            // alwaysShowContent:true,
            triggerOn: 'mousemove',
            // position: ['50%', '50%'],
            trigger: 'axis',
            axisPointer: {
                // type: 'line',
                // snap:true,
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        toolbox: {
            right: "14%",
            y: '1%',
            show: true,
            iconStyle: {
                normal: {
                    borderColor: '#00f0ff', //设置颜色
                }
            },
            feature: {
                dataZoom: {
                    yAxisIndex: "none"
                },
                dataView: {
                    readOnly: false
                },
                magicType: {
                    type: ["line", "bar"]
                },
                restore: {},
                saveAsImage: {},
            },

        },
        //图例
        legend: {
            textStyle: {
                color: '#00f0ff',
            },
            y: '2%',
            data: ['昨日', '今日']
        },
        //横轴
        xAxis: {
            data: (function () {
                var arr = [];
                for (var i = 0; i < 24; i++) {
                    for (var j = 0; j < 6; j++) {
                        for (var k = 0; k < 10; k++) {
                            var mytime = i + ":" + j + k;
                            // console.log(mytime)
                            // console.log(typeof mytime);
                            arr.push(mytime);
                        }
                    }
                }
                // console.log(arr);
                return arr;
            })(),
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#00f0ff'
                }
            },

            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#00f0ff', //左边线的颜色
                    width: '2' //坐标线的宽度
                }
            },
        },
        //纵轴
        yAxis: {

            // min: function (value) {
            //     return value.min - 200;
            // },
            splitLine: {
                show: false
            },
            name: "单位：(kW)",
            min: 0,
            boundaryGap: ['4%', '10%'],
            scale: true,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#00f0ff'
                }
            },

            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#00f0ff', //左边线的颜色
                    width: '2' //坐标线的宽度
                }
            },
        },
        //系列列表。每个系列通过type决定自己的图表类型
        series: [{
            name: "昨日",
            //折线图
            type: "line",
            smooth: true,
            data: [],
            itemStyle: { //改变折线线条颜色
                normal: {
                    // color: "#2ec7c9",
                    // color: pie_color[2],
                    color: "#fbb03b",

                    lineStyle: {
                        // color: "#2ec7c9"
                        // color: pie_color[2],
                        color: "#fbb03b"

                    }
                }
            },
            markPoint: {
                data: [{
                    type: "max",
                    name: "最大值"
                },
                {
                    type: "min",
                    name: "最小值"
                }
                ]
            },
            markLine: {
                data: [{
                    type: "average",
                    name: "平均值"
                }]
            }
        },
        {
            name: "今日",
            //折线图
            type: "line",
            smooth: true,
            data: [0],
            itemStyle: { //改变折线线条颜色
                normal: {
                    // color: "#b6a2de",
                    color: "#29aae1",
                    lineStyle: {
                        // color: "#b6a2de",
                        color: "#29aae1",
                    }
                }
            },
            markPoint: {
                data: [{
                    type: "max",
                    name: "最大值"
                },
                {
                    type: "min",
                    name: "最小值"
                }
                ]
            },
            markLine: {
                data: [{
                    type: "average",
                    name: "平均值"
                }]
            }
        }
        ]
    };
    //使用刚指定的配置项和数据显示图表
    myday_echarts.setOption(option_day);

    //上月本月
    var option_compare = {
        title: {
            text: '用量对比图',
            left: '4%',
            // top: "-2.5%",
            // y: '1%',
            textStyle: {
                color: '#00e74d'
            },
        },
        grid: {
            x: "10%",
            y: "30%",
            x2: "6%",
            y2: "28%",
        },
        // tooltip: {
        //     trigger: 'axis'
        // },
        //提示框组件
        tooltip: {
            confine: true,
            // position: [0, '50%'],
            show: true,
            // alwaysShowContent:true,
            triggerOn: 'mousemove',

            // position: ['50%', '50%'],
            trigger: 'axis',
            axisPointer: {
                // type: 'line',
                // snap:true,
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            // 自定义提示框
            formatter: function (values) {

                var res = '';
                if (values[0]) {
                    res += values[0].name + '<br>';
                } else {
                    res += values.name + '<br>';
                }
                var val = 0;
                for (var j = 1, length = values.length; j < length; j++) {
                    if (values[j].data && (values[j].data !== "-")) {
                        val += values[j].data;
                    }
                }
                if (!val) {
                    val = "-"
                }
                for (var i = 0, length = values.length; i < length; i++) {
                    // 峰谷平是比值
                    if (i == 1 || i == 2 || i == 3) {
                        if (values[i].value && val && (values[i].value !== "-")) {
                            values[i].value = ((values[i].value / val) * 100).toFixed(1) + "%";
                        }
                    }
                    if (i = 0) {
                        res = res + "&nbsp;&nbsp;&nbsp;&nbsp;" + values[2].seriesName.substring(0, 7) + "总：" + val;
                    }

                    res += '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:9px;height:9px;background-color:' + values[i].color + '"></span>' + values[i].seriesName + ':' + values[i].value + '<br>';
                }
                // res = res + '总量：' + val;

                return res;
            }
        },
        legend: {
            textStyle: {
                color: '#00f0ff',
            },
            y: '1%',
            right: "43%",
            data: ['2019-04', '2019-05峰时', '2019-05平时', '2019-05谷时']
        },
        toolbox: {
            iconStyle: {
                normal: {
                    borderColor: '#00f0ff', //设置颜色
                }
            },
            right: "14%",
            y: '1%',
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: "none"
                },
                dataView: {
                    readOnly: false
                },
                magicType: {
                    type: ["line", "bar"]
                },
                restore: {},
                saveAsImage: {},
            },

        },
        calculable: true,
        xAxis: [{
            type: 'category',
            data: (function () { //时间
                var res = [];
                var len = 1;
                while (len < 32) {
                    res.push(len);
                    len++;
                }
                return res;
            })(),
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#00f0ff'
                }
            },
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#00f0ff', //左边线的颜色
                    width: '2' //坐标线的宽度
                }
            },
        }],
        yAxis: [{
            min: 0,
            boundaryGap: ['10%', '10%'],
            splitLine: {
                show: false
            },
            type: 'value',
            name: "单位：(kWh)",
            scale: true,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#00f0ff'
                }
            },

            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#00f0ff', //左边线的颜色
                    width: '2' //坐标线的宽度
                }
            },
        }],
        series: [{
            barMaxWidth: 30,
            name: '2019-04',
            type: 'bar',
            data: [0],
            itemStyle: { //改变折线线条颜色
                normal: {
                    // color: "#2ec7c9",
                    color: "#29aae1",
                    lineStyle: {
                        // color: "#2ec7c9"
                        color: "#29aae1",
                    }
                }
            },
            markPoint: {
                data: [{
                    type: 'max',
                    name: '最大值'
                },
                {
                    type: 'min',
                    name: '最小值'
                }
                ]
            },
            // markLine: {
            //     data: [{
            //         type: 'average',
            //         name: '平均值'
            //     }]
            // }
        },
        {
            barMaxWidth: 30,
            name: '2019-05峰时',
            type: 'bar',
            stack: "总量",
            data: [],
            itemStyle: { //改变折线线条颜色
                normal: {
                    // color: "#516bf0",
                    // color: "rgba(243,151,0,1)",
                    color: "rgba(227,112,57,1)",
                    lineStyle: {
                        // color: "#516bf0",
                        color: "rgba(227,112,57,1)",

                    }
                }
            },


        }, {
            barMaxWidth: 30,
            name: '2019-05平时',
            type: 'bar',
            stack: "总量",
            data: [],
            itemStyle: { //改变折线线条颜色
                normal: {
                    // color: pie_color[6],
                    color: "rgba(236,220,0,1)",
                    lineStyle: {
                        // color: pie_color[6],
                        color: "rgba(236,220,0,1)",
                    }
                }
            }

        }, {
            barMaxWidth: 30,
            name: '2019-05谷时',
            type: 'bar',
            stack: "总量",
            data: [],
            itemStyle: { //改变折线线条颜色
                normal: {
                    // color: pie_color[5],
                    // color: '#b6a2de',
                    color: "rgba(136,193,34,1)",
                    lineStyle: {
                        // color: pie_color[5],
                        // color: '#b6a2de',
                        color: "rgba(136,193,34,1)",
                    }
                }
            }
        },
            // {
            //     barMaxWidth: 0,
            //     name: '2019-05总',
            //     type: 'bar',
            //     barGap: '-100%',
            //     stack: "需量",
            //     data: [1],

            //     itemStyle: { //改变折线线条颜色
            //         normal: {
            //             color: pie_color[5],
            //             // color: "rgba(0,0,0,0)",
            //             lineStyle: {
            //                 color: pie_color[5],
            //                 // color: "rgba(0,0,0,0)",
            //             }
            //         }
            //     },
            //     markPoint: {
            //         data: [{
            //             type: 'max',
            //             name: '最大值'
            //         },
            //         {
            //             type: 'min',
            //             name: '最小值'
            //         }
            //         ]
            //     }
            // }
        ]
    };
    mycompare_echarts.setOption(option_compare);

    //饼图
    var option_pie = {
        title: {
            text: '月综合能耗占比',

            // y: "40px",
            top: "6px",
            // x: 'center',
            left: 'center',
            textStyle: { //设置主标题风格
                color: '#00e74d', //设置主标题字体颜色
            },
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        // 赵总定颜色
        // color: ['#ecbccc', '#005bac', '#e6e6b0', '#7fc8dc', '#fff'],
        // 饼图颜色
        // color: ['#f3b26e', '#07dbff', '#efe96f', '#5db25d', '#dbf4f9', '#f3954d', '#93ddc4', '#ffc485', '#bbd165', '#696491', '#8be87e', '#fd90b0'],
        color: pie_color,
        legend: {
            orient: 'vertical',
            right: '40',
            top: "160",
            textStyle: {
                color: '#00f0ff'
            },
            data: ['模拟A', '模拟B', '模拟C', '模拟D', '模拟E']
        },
        series: [{
            name: '综合能耗折标煤占比（单位:吨标煤）',
            type: 'pie',
            radius: '50%',
            center: ['50%', '56%'],
            label: {
                normal: {
                    formatter: '{d}%',
                    // backgroundColor: '#eee',
                    // borderColor: '#aaa',
                    // borderWidth: 1,
                    // borderRadius: 4,
                    rich: {
                        a: {
                            color: '#999',
                            lineHeight: 22,
                            align: 'center'
                        },
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            fontSize: 16,
                            lineHeight: 33
                        },
                        per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 4],
                            borderRadius: 2
                        }
                    }
                }
            },



            data: [{
                value: 0,
                name: '模拟A'
            },
            {
                value: 0,
                name: '模拟B'
            },
            {
                value: 0,
                name: '模拟C'
            },
            {
                value: 0,
                name: '模拟D'
            },
            {
                value: 0,
                name: '模拟E'
            }
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        },

        ]
    };
    mypie_charts.setOption(option_pie);

    // 用能统计表格数据，综合能耗饼图请求方法
    function req_righttop() {
        //发送数据请求
        $.ajax({
            // url: lp_url + '/homepage/energy_general_summarize/',
            url: lp_url + '/homepage/energy_type_pie_tabledata/',
            type: "get",
            dataType: "json",
            data: {
                dateType: $("#energy_condition_date_tab .current").attr("value"),
            },
            success: function (res) {
                var currentDate = $("#energy_condition_date_tab .current").html();
                console.log(res)
                $("#energy_condition_table thead tr").eq(1).empty();
                $("#energy_condition_table thead tr").eq(1).append("<th>类型</th><th>本" + $("#energy_condition_date_tab .current").html() + "用能</th><th>单位</th><th>折标准煤(吨)</th>");

                // 用能状况表格内数据加载
                $("#energy_condition_table tbody").empty();
                var sumCoalEnergyValue = 0;
                for (var i = 0; i < res.data.length; i++) {
                    // 如果是电,用量数据除以一千,单位写死为MWh
                    if (res.data[i].energyTypeName == "电") {
                        // 根据唐总要求: 电：日 万度 保留两位小数/  月 年  万度  取整数
                        // 7-11根据要求最后一列万吨改成吨,本来除以一万现在除以一千
                        if ($("#energy_condition_date_tab .current").attr("value") == "D") {
                            $("#energy_condition_table tbody").append("<tr style='height:50px;'><td>" + res.data[i].energyTypeName + "</td><td>" + ((res.data[i].energyTypeValue) / 10000).toFixed(2) + "</td><td>万度</td><td style='padding:6px 4px 6px 0;'>" + ((res.data[i].coalEnergyValue) / 1000).toFixed(0) + "&nbsp;&nbsp;&nbsp;当量值<br />" + ((res.data[i].energyValue) / 1000).toFixed(0) + "&nbsp;&nbsp;&nbsp;等价值</td></tr>")
                        } else {
                            $("#energy_condition_table tbody").append("<tr style='height:50px;'><td>" + res.data[i].energyTypeName + "</td><td>" + ((res.data[i].energyTypeValue) / 10000).toFixed(0) + "</td><td>万度</td><td style='padding:6px 4px 6px 0;'>" + ((res.data[i].coalEnergyValue) / 1000).toFixed(0) + "&nbsp;&nbsp;&nbsp;当量值<br />" + ((res.data[i].energyValue) / 1000).toFixed(0) + "&nbsp;&nbsp;&nbsp;等价值</td></tr>")
                        }
                    } else {
                        $("#energy_condition_table tbody").append(" <tr><td>" + res.data[i].energyTypeName + "</td><td>" + res.data[i].energyTypeValue + "</td><td>" + res.data[i].unit + "</td><td style='padding-right:59px'>" + ((res.data[i].coalEnergyValue) / 1000).toFixed(0) + "</td></tr>")
                    }
                    sumCoalEnergyValue += res.data[i].coalEnergyValue;
                }
                $("#energy_condition_table tbody").append(" <tr><td>企业综合能耗</td><td>" + (sumCoalEnergyValue / 1000).toFixed(0) + "</td><td>吨标准煤</td><td style='padding-right:59px'>-</td></tr>")
                var pieval = [];
                var piename = [];
                for (var a = 0; a < res.data.length; a++) {
                    pieval.push(res.data[a].coalEnergyValue);
                    piename.push(res.data[a].energyTypeName);
                }
                option_pie.title.text = $("#energy_condition_date_tab .current").html() + "综合能耗占比"
                option_pie.series.data = [];
                for (var b = 0; b < pieval.length; b++) {
                    option_pie.series.data.push({
                        value: 0,
                        name: ''
                    })
                    option_pie.series[0].data[b].value = (pieval[b] / 1000).toFixed(2);
                    option_pie.series[0].data[b].name = piename[b];
                }
                option_pie.legend.data = piename;
                mypie_charts.setOption(option_pie, true);
            },
            error: function (res) {
                // layer.msg('数据请求失败', {
                //     time: 2000, //2s后自动关闭
                // });
            }
        });
    }







    // 右下角用能概况数据请求
    function req_rightbottom() {
        //发送数据请求
        $.ajax({
            url: lp_url + '/homepage/get_energy_status_data/',
            type: "get",
            dataType: "json",
            data: {
                dateType: $("#electricity_consumption_tab .current").attr("value"),
                energyType: $("#energy_type_secelt option:selected").val(),
            },
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    layer.msg("用能概况没有数据！")

                    // $('#nowval').html("本" + $("#electricity_consumption_tab .current").html() + "用量：<span></span>");
                    $('#nowval span').html("");
                    $('#year-on span').html("");
                    $('#chain-ratio span').html("");
                    return false;
                }
                /*---------用电概况---------*/
                // 日 万度  保留两位小数/月 年  万度  取整数
                if ($("#electricity_consumption_tab .current").attr("value") == "D") {
                    $('#nowval').html("本" + $("#electricity_consumption_tab .current").html() + "用量：<span>" + ((res.data.curEnergyValue) / 10000).toFixed(2) + " 万度</span><p id='compareCurPeak' class='compareCurPFV'>峰时用量占比：</p>");
                } else {
                    $('#nowval').html("本" + $("#electricity_consumption_tab .current").html() + "用量：<span>" + ((res.data.curEnergyValue) / 10000).toFixed(0) + " 万度</span><p id='compareCurPeak' class='compareCurPFV'>峰时用量占比：</p>");
                }

                var upurl = './images/up.png';
                var downurl = './images/down.png';

                // 判断当前日期值为0,同比环比就不计算直接赋值为横杠
                if (res.data.curEnergyValue) {
                    var lastEnergyValue_com = (((res.data.curEnergyValue - res.data.lastEnergyValue) / res.data.curEnergyValue) * 100).toFixed(2);
                    var prevEnergyValue_com = (((res.data.curEnergyValue - res.data.prevEnergyValue) / res.data.curEnergyValue) * 100).toFixed(2);
                    if (!lastEnergyValue_com && (lastEnergyValue_com !== 0) || ($("#electricity_consumption_tab .current").attr("value") == "Y")) {
                        lastEnergyValue_com = "-";
                        $('#tongbi').css('display', 'none');
                    } else {
                        if (lastEnergyValue_com > 0) {
                            $('#tongbi').css('display', 'inline-block');
                            $('#tongbi').attr('src', upurl)
                        } else {
                            $('#tongbi').css('display', 'inline-block');
                            $('#tongbi').attr('src', downurl)
                        }
                    }
                    if (!prevEnergyValue_com && (prevEnergyValue_com !== 0)) {
                        prevEnergyValue_com = "-";
                        $('#huanbi').css('display', 'none');
                    } else {
                        if (prevEnergyValue_com > 0) {
                            $('#huanbi').css('display', 'inline-block');
                            $('#huanbi').attr('src', upurl)
                        } else {
                            $('#huanbi').css('display', 'inline-block');
                            $('#huanbi').attr('src', downurl)
                        }
                    }
                } else {
                    $('#tongbi').css('display', 'none');
                    $('#huanbi').css('display', 'none');
                    var lastEnergyValue_com = "-";
                    var prevEnergyValue_com = "-";
                }
                if (!isNaN(lastEnergyValue_com)) {
                    lastEnergyValue_com = lastEnergyValue_com + " %";
                }
                if (!isNaN(prevEnergyValue_com)) {
                    prevEnergyValue_com = prevEnergyValue_com + " %";
                }
                $('#year-on span').html(lastEnergyValue_com);
                $('#chain-ratio span').html(prevEnergyValue_com);

                // if (!res.data.togeContrast) {
                //     $('#chain-ratio span').html("无");
                // }
                /*---------用电概况---------*/


                // 用能概况中的本日，月，年的峰谷平占比数据渲染，用用量对比图的接口
                req_compareCurPFV();
            },
            error: function (res) {
                // layer.msg('数据请求失败', {
                //     time: 2000, //2s后自动关闭
                // });
            }
        });
    }



    // 之前是多种能源，现在只能查电的
    function req_lefttbottom_e() {
        // 如果是电，要区分峰谷平对比的chart不一样


        option_compare = {
            title: {
                text: '用量对比图',
                left: '4%',
                // top: "-2.5%",
                // y: '1%',
                textStyle: {
                    color: '#00e74d'
                },
            },
            grid: {
                x: "10%",
                y: "30%",
                x2: "6%",
                y2: "28%",
            },
            tooltip: {
                confine: true,
                // position: [0, '50%'],
                show: true,
                // alwaysShowContent:true,
                triggerOn: 'mousemove',

                // position: ['50%', '50%'],
                trigger: 'axis',
                axisPointer: {
                    // type: 'line',
                    // snap:true,
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                // 自定义提示框
                formatter: function (values) {

                    var res = '';
                    if (values[0]) {
                        res += values[0].name + '<br>';
                    } else {
                        res += values.name + '<br>';
                    }
                    var val = 0;
                    for (var j = 1, length = values.length; j < length; j++) {
                        if (values[j].data && (values[j].data !== "-")) {
                            val += values[j].data;
                        }
                    }
                    if (!val) {
                        val = "-"
                    }
                    for (var i = 0, length = values.length; i < length; i++) {
                        // 峰谷平是比值
                        if (i == 1 || i == 2 || i == 3) {
                            if (values[i].value && val && (values[i].value !== "-")) {
                                values[i].value = ((values[i].value / val) * 100).toFixed(1) + "%";
                            }
                        }
                        if (i == 1) {
                            res = res + "&nbsp;  &nbsp;" + values[2].seriesName.substring(0, 7) + "总：" + val + '<br>';
                        }


                        res += '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:9px;height:9px;background-color:' + values[i].color + '"></span>' + values[i].seriesName + '：' + values[i].value + '<br>';
                    }

                    return res;
                }
            },
            legend: {
                textStyle: {
                    color: '#00f0ff',
                },
                y: '1%',
                right: "43%",
                data: ['2019-04', '2019-05峰时', '2019-05平时', '2019-05谷时']
            },
            toolbox: {
                iconStyle: {
                    normal: {
                        borderColor: '#00f0ff', //设置颜色
                    }
                },
                right: "14%",
                y: '1%',
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: "none"
                    },
                    dataView: {
                        readOnly: false
                    },
                    magicType: {
                        type: ["line", "bar"]
                    },
                    restore: {},
                    saveAsImage: {},
                },

            },
            calculable: true,
            xAxis: [{
                type: 'category',
                data: (function () { //时间
                    var res = [];
                    var len = 1;
                    while (len < 32) {
                        res.push(len);
                        len++;
                    }
                    return res;
                })(),
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#00f0ff'
                    }
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#00f0ff', //左边线的颜色
                        width: '2' //坐标线的宽度
                    }
                },
            }],
            yAxis: [{
                min: 0,
                boundaryGap: ['10%', '10%'],
                splitLine: {
                    show: false
                },
                type: 'value',
                name: "单位：(kWh)",
                scale: true,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#00f0ff'
                    }
                },

                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#00f0ff', //左边线的颜色
                        width: '2' //坐标线的宽度
                    }
                },
            }],
            series: [{
                barMaxWidth: 30,
                name: '2019-04',
                type: 'bar',
                data: [0],
                itemStyle: { //改变折线线条颜色
                    normal: {
                        color: "#29aae1",
                        lineStyle: {
                            // color: "#2ec7c9"
                            color: "#29aae1",
                        }
                    }
                },
                markPoint: {
                    data: [{
                        type: 'max',
                        name: '最大值'
                    },
                    {
                        type: 'min',
                        name: '最小值'
                    }
                    ]
                },

            },
            {
                barMaxWidth: 30,
                name: '2019-05峰时',
                type: 'bar',
                stack: "总量",
                data: [],
                itemStyle: { //改变折线线条颜色
                    normal: {
                        // color: "#516bf0",
                        // color: "rgba(243,151,0,1)",
                        color: "rgba(227,112,57,1)",
                        lineStyle: {
                            // color: "#516bf0",
                            color: "rgba(227,112,57,1)",

                        }
                    }
                },


            }, {
                barMaxWidth: 30,
                name: '2019-05平时',
                type: 'bar',
                stack: "总量",
                data: [],
                itemStyle: { //改变折线线条颜色
                    normal: {
                        // color: pie_color[6],
                        color: "rgba(236,220,0,1)",
                        lineStyle: {
                            // color: pie_color[6],
                            color: "rgba(236,220,0,1)",
                        }
                    }
                }

            }, {
                barMaxWidth: 30,
                name: '2019-05谷时',
                type: 'bar',
                stack: "总量",
                data: [],
                itemStyle: { //改变折线线条颜色
                    normal: {
                        // color: pie_color[5],
                        // color: '#b6a2de',
                        color: "rgba(136,193,34,1)",
                        lineStyle: {
                            // color: pie_color[5],
                            // color: '#b6a2de',
                            color: "rgba(136,193,34,1)",
                        }
                    }
                }
            },

            ]
        };
        // option切换结束---------------------------------------
        var nowDate;
        var lastDate
        if ($("#electricity_comparison_tab .current").attr("value") == "M") {
            // nowDate: "'2019-05'",嘉豪要求传这个格式
            // 如果加完是单位数，要在前面加个零
            var curMonth = new Date().getMonth() + 1;
            if (curMonth < 10) {
                curMonth = "0" + curMonth;
            }
            var lastMonth = new Date().getMonth();
            if (lastMonth < 10) {
                lastMonth = "0" + lastMonth;
            }
            // 本月
            nowDate = "'" + new Date().getFullYear() + "-" + curMonth + "'";
            // 上月
            lastDate = "'" + new Date().getFullYear() + "-" + lastMonth + "'";
        } else if ($("#electricity_comparison_tab .current").attr("value") == "Y") {
            // nowDate: "'2019-05'",嘉豪要求传这个格式
            // 本月
            nowDate = "'" + new Date().getFullYear() + "'";
            // 上月
            lastDate = "'" + (new Date().getFullYear() - 1) + "'";
        }
        $.ajax({
            // url: "http://192.168.0.62:8001" + '/homepage/getPeak',
            url: lp_url + '/homepage/getPeak',
            type: "get",
            // dataType: "json",
            data: {
                dateType: $("#electricity_comparison_tab .current").attr("value"),
                // energyType: $("#energy_type_secelt option:selected").val(),
                nowDate: nowDate,
                lastDate: lastDate,
            },
            success: function (res) {
                console.log(res);
                if (!res.data) {
                    layer.msg("用量对比图没有数据！")
                    for (var i = 0; i < option_compare.series.length; i++) {
                        option_compare.series[i].data = [0];
                    }
                    mycompare_echarts.setOption(option_compare, true);
                    return false
                }
                // 判断是年还是月
                if ($("#electricity_comparison_tab .current").attr("value") == "M") {
                    // 用量对比月的时候的x轴数据
                    var basicMonthXDate = [];
                    for (var i = 1; i < 32; i++) {
                        basicMonthXDate.push(i);
                    }
                    // 判断是否有当月数据
                    // 申明新的数据, 存遍历完一月内完整日期的数据
                    var myPeakNow = [];
                    if (res.data.peakNow.length > 0) {
                        var peakNow = res.data.peakNow;
                        for (var i = 0; i < basicMonthXDate.length; i++) {
                            for (var j = 0; j < peakNow.length; j++) {
                                if (basicMonthXDate[i] == parseInt((peakNow[j].logdt).substring(8, 10))) {
                                    myPeakNow[i] = peakNow[j];
                                    break;
                                } else {
                                    myPeakNow[i] = {
                                        bpid: null,
                                        flat: "-",
                                        item: null,
                                        logdt: null,
                                        logdtStr: null,
                                        mp: null,
                                        peak: "-",
                                        rcdt: null,
                                        tm1: null,
                                        tm2: null,
                                        tm3: null,
                                        tm4: null,
                                        top: null,
                                        topoid: null,
                                        topotype: null,
                                        valley: "-",
                                    }
                                }
                            }
                        }

                    }
                    // 上月的数据同样做处理
                    var myPeakLast = [];
                    // 判断上月是否有数据
                    if (res.data.peakLast.length > 0) {
                        var peakLast = res.data.peakLast;
                        for (var i = 0; i < basicMonthXDate.length; i++) {
                            for (var j = 0; j < peakLast.length; j++) {
                                if (basicMonthXDate[i] == parseInt((peakLast[j].logdt).substring(8, 10))) {
                                    myPeakLast[i] = peakLast[j];
                                    break;
                                } else {
                                    myPeakLast[i] = {
                                        bpid: null,
                                        flat: "-",
                                        item: null,
                                        logdt: null,
                                        logdtStr: null,
                                        mp: null,
                                        peak: "-",
                                        rcdt: null,
                                        tm1: null,
                                        tm2: null,
                                        tm3: null,
                                        tm4: null,
                                        top: null,
                                        topoid: null,
                                        topotype: null,
                                        valley: "-",
                                    }
                                }
                            }
                        }
                    }
                    // 当月峰
                    var curPeak = [];
                    // 当月谷
                    var curValley = [];
                    // 当月平
                    var curFlat = [];
                    for (var i = 0; i < myPeakNow.length; i++) {
                        curPeak.push(myPeakNow[i].peak);
                        curValley.push(myPeakNow[i].valley);
                        curFlat.push(myPeakNow[i].flat);
                    }
                    // 上月总用量
                    var lastMonData = [];
                    for (var i = 0; i < myPeakLast.length; i++) {
                        if (myPeakLast[i].logdt) {
                            lastMonData.push(myPeakLast[i].peak + myPeakLast[i].valley + myPeakLast[i].flat);
                        } else {
                            lastMonData.push("-");
                        }
                    }
                    // 本月总电量
                    var nowMonData = [];
                    for (var i = 0; i < myPeakNow.length; i++) {
                        if (myPeakNow[i].logdt) {
                            nowMonData.push(myPeakNow[i].peak + myPeakNow[i].valley + myPeakNow[i].flat);
                        } else {
                            nowMonData.push("-");
                        }
                    }
                    //   将传的参数nowDate和lastDate截取掉引号放入头部的名字中
                    var nowDateSub = nowDate.substring(1, 8);
                    var lastDateSub = lastDate.substring(1, 8);
                    var tempName = [lastDateSub + "总", nowDateSub + '峰时', nowDateSub + '平时', nowDateSub + '谷时']
                    option_compare.legend.data = tempName;
                    for (var i = 0; i < option_compare.series.length; i++) {
                        // option_compare.series[i].name = tempName[i]
                        option_compare.series[i].name = tempName[i]
                    }
                    option_compare.xAxis[0].data = basicMonthXDate;
                    // 上月总量
                    option_compare.series[0].data = lastMonData;
                    // 本月峰平谷
                    option_compare.series[1].data = curPeak;
                    option_compare.series[2].data = curFlat;
                    option_compare.series[3].data = curValley;
                    // 本月总量
                    // option_compare.series[4].data = nowMonData;
                    console.log(option_compare);
                    mycompare_echarts.setOption(option_compare, true);
                } else if ($("#electricity_comparison_tab .current").attr("value") == "Y") {
                    // 用量对比图年的时候的数据
                    var basicYearXDate = [];
                    for (var i = 1; i < 13; i++) {
                        basicYearXDate.push(i);
                    }
                    // 判断是否有当年数据
                    // 申明新的数据, 存遍历完一月内完整日期的数据
                    var myPeakNow = [];
                    if (res.data.peakNow.length > 0) {
                        var peakNow = res.data.peakNow;
                        for (var i = 0; i < basicYearXDate.length; i++) {
                            for (var j = 0; j < peakNow.length; j++) {
                                if (basicYearXDate[i] == parseInt((peakNow[j].logdt).substring(5, 7))) {
                                    myPeakNow[i] = peakNow[j];
                                    break;
                                } else {
                                    myPeakNow[i] = {
                                        bpid: null,
                                        flat: "-",
                                        item: null,
                                        logdt: null,
                                        logdtStr: null,
                                        mp: null,
                                        peak: "-",
                                        rcdt: null,
                                        tm1: null,
                                        tm2: null,
                                        tm3: null,
                                        tm4: null,
                                        top: null,
                                        topoid: null,
                                        topotype: null,
                                        valley: "-",
                                    }
                                }
                            }
                        }
                    }
                    // 上年的数据同样做处理
                    var myPeakLast = [];
                    // 判断上月是否有数据
                    if (res.data.peakLast.length > 0) {
                        var peakLast = res.data.peakLast;
                        for (var i = 0; i < basicYearXDate.length; i++) {
                            for (var j = 0; j < peakLast.length; j++) {
                                if (basicYearXDate[i] == parseInt((peakLast[j].logdt).substring(5, 7))) {
                                    myPeakLast[i] = peakLast[j];
                                    break;
                                } else {
                                    myPeakLast[i] = {
                                        bpid: null,
                                        flat: "-",
                                        item: null,
                                        logdt: null,
                                        logdtStr: null,
                                        mp: null,
                                        peak: "-",
                                        rcdt: null,
                                        tm1: null,
                                        tm2: null,

                                        tm3: null,
                                        tm4: null,
                                        top: null,
                                        topoid: null,
                                        topotype: null,
                                        valley: "-",
                                    }
                                }
                            }
                        }
                    }
                    // 当月峰
                    var curPeak = [];
                    // 当月谷
                    var curValley = [];
                    // 当月平
                    var curFlat = [];
                    for (var i = 0; i < myPeakNow.length; i++) {
                        curPeak.push(myPeakNow[i].peak);
                        curValley.push(myPeakNow[i].valley);
                        curFlat.push(myPeakNow[i].flat);
                    }
                    // 上月总用量
                    var lastMonData = [];
                    for (var i = 0; i < myPeakLast.length; i++) {
                        if (myPeakLast[i].logdt) {
                            lastMonData.push(myPeakLast[i].peak + myPeakLast[i].valley + myPeakLast[i].flat);
                        } else {
                            lastMonData.push("-");
                        }
                    }
                    //   将传的参数nowDate和lastDate截取掉引号放入头部的名字中
                    var nowDateSub = nowDate.substring(1, 5);
                    var lastDateSub = lastDate.substring(1, 5);
                    var tempName = [lastDateSub + "年", nowDateSub + '年峰时', nowDateSub + '年平时', nowDateSub + '年谷时',]
                    option_compare.legend.data = tempName;
                    for (var i = 0; i < option_compare.series.length; i++) {
                        option_compare.series[i].name = tempName[i]
                    }
                    option_compare.xAxis[0].data = basicYearXDate;
                    option_compare.series[0].data = lastMonData;
                    option_compare.series[1].data = curPeak;
                    option_compare.series[2].data = curFlat;
                    option_compare.series[3].data = curValley;
                    mycompare_echarts.setOption(option_compare, true);
                }
            }
        })
    }


    // 用量对比图数据ajax请求，废弃需求更改，对比基础上本月分割成峰谷平叠加值
    function req_lefttbottom_else() {
        option_compare = {
            title: {
                text: '用量对比图',
                left: '4%',
                // top: "-2.5%",
                // y: '1%',
                textStyle: {
                    color: '#00e74d'
                },
            },
            grid: {
                x: "10%",
                y: "30%",
                x2: "6%",
                y2: "28%",
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                textStyle: {
                    color: '#00f0ff',
                },
                y: '1%',
                right: "43%",
                data: ['2018', '2019']
            },
            toolbox: {
                iconStyle: {
                    normal: {
                        borderColor: '#00f0ff', //设置颜色
                    }
                },
                right: "14%",
                y: '1%',
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: "none"
                    },
                    dataView: {
                        readOnly: false
                    },
                    magicType: {
                        type: ["line", "bar"]
                    },
                    restore: {},
                    saveAsImage: {},
                },

            },
            calculable: true,
            xAxis: [{
                type: 'category',
                data: (function () { //时间
                    var res = [];
                    var len = 1;
                    while (len < 32) {
                        res.push(len);
                        len++;
                    }
                    return res;
                })(),
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#00f0ff'
                    }
                },

                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#00f0ff', //左边线的颜色
                        width: '2' //坐标线的宽度
                    }
                },
            }],
            yAxis: [{
                min: 0,
                boundaryGap: ['10%', '10%'],
                splitLine: {
                    show: false
                },
                type: 'value',
                name: "单位：(kWh)",
                scale: true,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#00f0ff'
                    }
                },

                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#00f0ff', //左边线的颜色
                        width: '2' //坐标线的宽度
                    }
                },
            }],
            series: [{
                barMaxWidth: 30,
                name: '2018',
                type: 'bar',
                data: [0],
                itemStyle: { //改变折线线条颜色
                    normal: {
                        color: "#29aae1",
                        lineStyle: {
                            color: "#29aae1",
                        }
                    }
                },
                markPoint: {
                    data: [{
                        type: 'max',
                        name: '最大值'
                    },
                    {
                        type: 'min',
                        name: '最小值'
                    }
                    ]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: '平均值'
                    }]
                }
            },
            {
                barMaxWidth: 30,
                name: '2019',
                type: 'bar',
                data: [],
                itemStyle: { //改变折线线条颜色
                    normal: {
                        color: "#666",
                        lineStyle: {
                            color: "#666",
                        }
                    }
                },
                markPoint: {
                    data: [{
                        type: 'max',
                        name: '最大值'
                    },
                    {
                        type: 'min',
                        name: '最小值'
                    }
                    ]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: '平均值'
                    }]
                }
            }
            ]
        };
        // ---------------------------------
        $.ajax({
            url: lp_url + '/homepage/get_energy_curve_data/',
            type: "get",
            dataType: "json",
            data: {
                dateType: $("#electricity_comparison_tab .current").attr("value"),
                energyType: $("#energy_type_secelt option:selected").val(),
            },
            success: function (res) {
                console.log(res)
                if (!res.data) {
                    layer.msg("用量对比图没有数据！")
                    for (var i = 0; i < option_compare.series.length; i++) {
                        option_compare.series[i].data = [0];
                    }
                    mycompare_echarts.setOption(option_compare, true);
                    return false
                }
                var cusmonthdata = [];
                var cusmonthtime = [];
                var lastmonthdata = [];
                var lastmonthtime = [];
                //上月本月数据
                // 判断如果是本月上月数据
                if (res.data.curMonthEnergy) {
                    for (var j = 0; j < res.data.curMonthEnergy.length; j++) {
                        cusmonthdata.push(res.data.curMonthEnergy[j].value);
                        cusmonthtime.push(res.data.curMonthEnergy[j].date.substring(8, 10));
                    }
                    for (var m = 0; m < res.data.prevMonthEnergy.length; m++) {
                        lastmonthdata.push(res.data.prevMonthEnergy[m].value);
                        lastmonthtime.push(res.data.prevMonthEnergy[m].date.substring(8, 10));
                    }
                    // 如果是月设置echarts头部legend名字
                    // 判断去年电量是否为空
                    if (res.data.prevMonthEnergy[0]) {
                        option_compare.series[0].name = res.data.prevMonthEnergy[0].date.substring(0, 7);
                        option_compare.legend.data[0] = res.data.prevMonthEnergy[0].date.substring(0, 7);
                    } else {
                        option_compare.series[0].name = "-     ";
                        option_compare.legend.data[0] = "-     ";
                    }
                    option_compare.series[1].name = res.data.curMonthEnergy[0].date.substring(0, 7);
                    option_compare.legend.data[1] = res.data.curMonthEnergy[0].date.substring(0, 7);
                } else if (res.data.curYearEnergy) {
                    for (var j = 0; j < res.data.curYearEnergy.length; j++) {
                        cusmonthdata.push(res.data.curYearEnergy[j].value);
                        cusmonthtime.push(res.data.curYearEnergy[j].date.substring(5, 7));
                    }
                    for (var m = 0; m < res.data.prevYearEnergy.length; m++) {
                        lastmonthdata.push(res.data.prevYearEnergy[m].value);
                        lastmonthtime.push(res.data.prevYearEnergy[m].date.substring(5, 7));
                    }
                    // 如果是年设置头部名字
                    // 判断去年电量是否为空
                    if (res.data.prevYearEnergy[0]) {
                        option_compare.series[0].name = res.data.prevYearEnergy[0].date.substring(0, 4) + "年";
                        option_compare.legend.data[0] = res.data.prevYearEnergy[0].date.substring(0, 4) + "年";
                    } else {
                        option_compare.series[0].name = "-     ";
                        option_compare.legend.data[0] = "-     ";
                    }
                    option_compare.series[1].name = res.data.curYearEnergy[0].date.substring(0, 4) + "年";
                    option_compare.legend.data[1] = res.data.curYearEnergy[0].date.substring(0, 4) + "年";
                }
                // 判断哪个时间轴长,哪个长就用哪个做x轴
                // 合并两个时间轴
                var timeX = lastmonthtime.concat(cusmonthtime)
                timeX.distinct();
                var timeX = timeX.distinct();
                timeX = timeX.sort(function (x, y) {
                    return x - y;
                });
                // 以上处理时间x轴的代码基本作废
                // 用量对比月的时候的x轴数据
                var basicMonthXDate = [];
                for (var i = 1; i < 32; i++) {
                    basicMonthXDate.push(i);
                }
                // 用量对比图年的时候的数据
                var basicYearXDate = [];
                for (var i = 1; i < 13; i++) {
                    basicYearXDate.push(i);
                }
                // 判断是月还是年
                // 月的时候basicMonthXDate为x轴，所有数据与basicMonthXDate比较
                if ($("#electricity_comparison_tab .current").attr("value") == "M") {
                    timeX = basicMonthXDate;
                } else if ($("#electricity_comparison_tab .current").attr("value") == "Y") {
                    timeX = basicYearXDate;
                }
                var lastData = [];
                var curData = [];
                for (var i = 0; i < timeX.length; i++) {
                    curData.push("-")
                    lastData.push("-")
                }
                for (var i = 0; i < timeX.length; i++) {
                    for (var j = 0; j < cusmonthtime.length; j++) {
                        if (timeX[i] == parseInt(cusmonthtime[j])) {
                            curData[i] = cusmonthdata[j]
                        }
                    }
                }
                for (var i = 0; i < timeX.length; i++) {
                    for (var j = 0; j < lastmonthtime.length; j++) {
                        if (timeX[i] == parseInt(lastmonthtime[j])) {
                            lastData[i] = lastmonthdata[j]
                        }
                    }
                }
                // 给x轴时间附上单位:日或者月
                if ($("#electricity_comparison_tab .current").attr("value") == "M") {
                    for (var i = 0; i < timeX.length; i++) {
                        timeX[i] = timeX[i] + "日";
                    }
                } else if ($("#electricity_comparison_tab .current").attr("value") == "Y") {
                    for (var i = 0; i < timeX.length; i++) {
                        timeX[i] = timeX[i] + "月";
                    }
                }
                option_compare.series[1].data = curData;
                option_compare.xAxis[0].data = timeX;
                option_compare.series[0].data = lastData;
                mycompare_echarts.setOption(option_compare, true);
            },
            error: function (res) {
                // layer.msg('数据请求失败', {
                //     time: 2000, //2s后自动关闭
                // });
            }
        });
    }

    // 日期对象转字符串
    var formatDate = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second = date.getSeconds();
        second = minute < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    };




    // 右下角本日，本月，本年峰谷平占比用能概况数据请求
    // 调用用能对比图同一个接口
    function req_compareCurPFV() {
        if ($("#electricity_consumption_tab .current").attr("value") == "D") {
            var preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
            preDate = formatDate(preDate).substring(0, 10) + " 00:00:00";
            $.ajax({
                url: lp_url + '/homepage/getpeakNow',
                type: "get",
                // dataType: "json",
                data: {
                    date: preDate,
                },
                success: function (res) {
                    console.log(res)
                    if (res.data && res.status == 0) {
                        var curPeakTotalRatio = ((res.data.peak / (res.data.peak + res.data.flat + res.data.valley)) * 100).toFixed(1) + "%";
                        var curFlatTotalRatio = ((res.data.flat / (res.data.peak + res.data.flat + res.data.valley)) * 100).toFixed(1) + "%";
                        var curValleyTotalRatio = ((res.data.valley / (res.data.peak + res.data.flat + res.data.valley)) * 100).toFixed(1) + "%";
                        $("#compareCurPeak").html("峰时用量占比：" + curPeakTotalRatio);
                        $("#compareCurFlat").html("平时用量占比：" + curFlatTotalRatio);
                        $("#compareCurValley").html("谷时用量占比：" + curValleyTotalRatio);
                    }
                },
                error: function (res) {
                    // layer.msg('数据请求失败', {
                    //     time: 2000, //2s后自动关闭
                    // });
                }
            });
            return false;
        }
        var nowDate;
        var lastDate
        if ($("#electricity_consumption_tab .current").attr("value") == "M") {
            // nowDate: "'2019-05'",嘉豪要求传这个格式
            // 如果加完是单位数，要在前面加个零
            var curMonth = new Date().getMonth() + 1;
            if (curMonth < 10) {
                curMonth = "0" + curMonth;
            }
            var lastMonth = new Date().getMonth();
            if (lastMonth < 10) {
                lastMonth = "0" + lastMonth;
            }
            // 本月
            nowDate = "'" + new Date().getFullYear() + "-" + curMonth + "'";
            // 上月
            lastDate = "'" + new Date().getFullYear() + "-" + lastMonth + "'";
        } else if ($("#electricity_consumption_tab .current").attr("value") == "Y") {
            // nowDate: "'2019-05'",嘉豪要求传这个格式
            // 本月
            nowDate = "'" + new Date().getFullYear() + "'";
            // 上月
            lastDate = "'" + (new Date().getFullYear() - 1) + "'";
        }
        $.ajax({
            // url: "http://192.168.0.62:8001" + '/homepage/getPeak',
            url: lp_url + '/homepage/getPeak',
            type: "get",
            // dataType: "json",
            data: {
                dateType: $("#electricity_consumption_tab .current").attr("value"),
                // energyType: $("#energy_type_secelt option:selected").val(),
                nowDate: nowDate,
                lastDate: lastDate,
            },
            success: function (res) {
                console.log(res)
                if (res.data && (res.status == 0)) {
                    // 用peakNow这个字段的数据处理成当前值
                    if (res.data.peakNow) {
                        var curAllTotal = 0;
                        var curPeakTotal = 0;
                        var curFlatTotal = 0;
                        var curValleyTotal = 0;
                        for (var i = 0; i < res.data.peakNow.length; i++) {
                            // 总量
                            curAllTotal += res.data.peakNow[i].flat + res.data.peakNow[i].peak + res.data.peakNow[i].valley;
                            // 峰
                            curPeakTotal += res.data.peakNow[i].peak;
                            // 谷
                            curValleyTotal += res.data.peakNow[i].valley;
                            // 平
                            curFlatTotal += res.data.peakNow[i].flat;
                        }
                        var curPeakTotalRatio = ((curPeakTotal / curAllTotal) * 100).toFixed(1) + "%";
                        var curFlatTotalRatio = ((curFlatTotal / curAllTotal) * 100).toFixed(1) + "%";
                        var curValleyTotalRatio = ((curValleyTotal / curAllTotal) * 100).toFixed(1) + "%";
                        $("#compareCurPeak").html("峰时用量占比：" + curPeakTotalRatio);
                        $("#compareCurFlat").html("平时用量占比：" + curFlatTotalRatio);
                        $("#compareCurValley").html("谷时用量占比：" + curValleyTotalRatio);
                    }
                }
            },
            error: function (res) {
                // layer.msg('数据请求失败', {
                //     time: 2000, //2s后自动关闭
                // });
            }
        });
    }



    function req_fff() {
        //发送数据请求
        $.ajax({
            url: lp_url + '/homepage/ffff',
            // url: "http://192.168.0.62:8001" + '/homepage/ffff',
            type: "get",
            dataType: "json",
            data: {},
            success: function (res) {
                console.log(res)
                if (res.data) {
                    if (res.data.glys) {
                        var myGlys = ((res.data.glys / res.data.rongliang) * 100).toFixed(2) + " %";
                    } else {
                        var myGlys = "-";
                    }
                    $("#echarts_wrap_top_load_factorP").html("负载率：" + myGlys)
                }
            },
            error: function (res) {
                // layer.msg('数据请求失败', {
                //     time: 2000, //2s后自动关闭
                // });

            }
        });
    }

    // 之前左上角的数据，现在已注销
    // req_fff();


    // fffTimer = setInterval(() => {
    //     funFlowChart();
    // }, 15000);







    // 中间日负荷曲线,负荷概况表格数据ajax请求方法
    function req_leftmiddle() {
        // 处理x轴时间数据
        var nowDate = new Date();


        //发送数据请求
        $.ajax({
            url: lp_url + '/homepage/middle_curve_data/',
            type: "get",
            dataType: "json",
            data: {
                energyType: $("#energy_type_secelt option:selected").val(),
                // dateType: "A",
                dateType: $("#real_time_load_tab .current").attr("value"),
            },
            success: function (res) {
                console.log(res)
                if (res.status == 1) {
                    option_day.series[0].data = [];
                    option_day.series[1].data = [];
                    myday_echarts.setOption(option_day, true);
                    return false;
                }
                if (((!res.data.toDayLoadCurveMinuteData) && (!res.data.yestoryLoadCurveMinuteData)) || (res.status == 1) || ((!res.data.toDayLoadCurveMinuteData.length) && (!res.data.yestoryLoadCurveMinuteData.length))) {
                    option_day.series[0].data = [];
                    option_day.series[1].data = [];
                    myday_echarts.setOption(option_day, true);
                    return false;
                }
                // 渲染日负荷曲线chart数据,
                var toDayLoadxData;
                var toDayLoadCurveMinuteData = [];
                var yestoryLoadCurveMinuteData = [];
                // var toDayLoadCurveMinuteDateX = [];
                // var yestoryLoadCurveMinuteDateX = [];
                // if ((res.data.toDayLoadCurveMinuteData != null) || res.data.toDayLoadCurveMinuteData.length > 0) {
                //     for (var i = 0; i < res.data.toDayLoadCurveMinuteData.length; i++) {
                //         toDayLoadCurveMinuteData.push(res.data.toDayLoadCurveMinuteData[i].value);
                //         toDayLoadCurveMinuteDateX.push(res.data.toDayLoadCurveMinuteData[i].date.substring(10));
                //     }
                // }
                // if ((res.data.yestoryLoadCurveMinuteData != null) || res.data.yestoryLoadCurveMinuteData.length > 0) {
                //     for (var i = 0; i < res.data.yestoryLoadCurveMinuteData.length; i++) {
                //         yestoryLoadCurveMinuteData.push(res.data.yestoryLoadCurveMinuteData[i].value);
                //         yestoryLoadCurveMinuteDateX.push(res.data.yestoryLoadCurveMinuteData[i].date.substring(10));
                //     }
                // }
                // // 判断如果昨天的数据比今天的多，就拿昨天的时间作为x轴
                // if (yestoryLoadCurveMinuteDateX.length > toDayLoadCurveMinuteDateX.length) {
                //     toDayLoadCurveMinuteDateX = yestoryLoadCurveMinuteDateX;
                // }

                // 实时数据x轴时间 获取当前时间的前八个小时的数据数组
                if ($("#real_time_load_tab .current").attr("value") == 'A') {
                    var tempStartTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowDate.getHours(), nowDate.getMinutes() - 1, 0)
                    var startTime = [tempStartTime.getFullYear(), fz(tempStartTime.getMonth() + 1), fz(tempStartTime.getDate())].join("-") + ' ' + [fz(tempStartTime.getHours()), fz(tempStartTime.getMinutes()), '00'].join(':')
                    var tempEndTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowDate.getHours() - 8, nowDate.getMinutes() - 1, 0)
                    var endTime = [tempEndTime.getFullYear(), fz(tempEndTime.getMonth() + 1), fz(tempEndTime.getDate())].join("-") + ' ' + [fz(tempEndTime.getHours()), fz(tempEndTime.getMinutes()), '00'].join(':')
                    toDayLoadxData = getDays(endTime, startTime);
                } else {
                    // 本日数据
                    var tempStartTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowDate.getHours(), nowDate.getMinutes() - 1, 0)
                    var startTime = [tempStartTime.getFullYear(), fz(tempStartTime.getMonth() + 1), fz(tempStartTime.getDate())].join("-") + ' ' + [fz(tempStartTime.getHours()), fz(tempStartTime.getMinutes()), '00'].join(':')
                    var tempEndTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() - 1, nowDate.getHours(), nowDate.getMinutes() - 1, 0)
                    var endTime = [tempEndTime.getFullYear(), fz(tempEndTime.getMonth() + 1), fz(tempEndTime.getDate())].join("-") + ' ' + [fz(tempEndTime.getHours()), fz(tempEndTime.getMinutes()), '00'].join(':')
                    toDayLoadxData = getDays(endTime, startTime);
                }
                // 处理数据传过来多一条的情况 即，时分秒相等
                if (res.data.toDayLoadCurveMinuteData[0].date.substring(11) == res.data.toDayLoadCurveMinuteData[res.data.toDayLoadCurveMinuteData.length - 1].date.substring(11)) {
                    res.data.toDayLoadCurveMinuteData.shift();
                }
                if (res.data.yestoryLoadCurveMinuteData.length > 0) {
                    if (res.data.yestoryLoadCurveMinuteData[0].date.substring(11) == res.data.yestoryLoadCurveMinuteData[res.data.yestoryLoadCurveMinuteData.length - 1].date.substring(11)) {
                        res.data.yestoryLoadCurveMinuteData.shift();
                    }
                }
                // 根据时间判断是否显示
                for (var j = 0, lenX = toDayLoadxData.length; j < lenX; j++) {
                    if ((res.data.toDayLoadCurveMinuteData != null) || res.data.toDayLoadCurveMinuteData.length > 0) {
                        for (var i = 0, len = res.data.toDayLoadCurveMinuteData.length; i < len; i++) {
                            if (res.data.toDayLoadCurveMinuteData[i].date.substring(11) == toDayLoadxData[j].substring(11)) {
                                toDayLoadCurveMinuteData.push(res.data.toDayLoadCurveMinuteData[i].value);
                            }

                        }
                        if (toDayLoadCurveMinuteData.length < (j + 1)) {
                            toDayLoadCurveMinuteData.push('-');
                        }
                    }
                    if ((res.data.yestoryLoadCurveMinuteData != null) || res.data.yestoryLoadCurveMinuteData.length > 0) {
                        for (var i = 0, len = res.data.yestoryLoadCurveMinuteData.length; i < len; i++) {
                            if (res.data.yestoryLoadCurveMinuteData[i].date.substring(11) == toDayLoadxData[j].substring(11)) {
                                yestoryLoadCurveMinuteData.push(res.data.yestoryLoadCurveMinuteData[i].value);
                            }
                        }
                        if (yestoryLoadCurveMinuteData.length < (j + 1)) {
                            yestoryLoadCurveMinuteData.push('-');
                        }
                    }
                }


                var toDayLoadxData2 = toDayLoadxData.map(function (time, index) {
                    return time = time.substring(11);
                })

                option_day.series[0].data = yestoryLoadCurveMinuteData;
                option_day.series[1].data = toDayLoadCurveMinuteData;
                option_day.xAxis.data = toDayLoadxData2;
                // option_day.xAxis.data = toDayLoadCurveMinuteDateX;
                if ($("#energy_type_secelt option:selected")[0].innerText == '电') {
                    option_day.title.text = '日负荷曲线';
                    if (toDayLoadCurveMinuteData[toDayLoadCurveMinuteData.length - 1]) {
                        $('#currentLoadP').text('实时负荷：' + (toDayLoadCurveMinuteData[toDayLoadCurveMinuteData.length - 1]) + " " + res.data.unit);
                        // 同时能流图渲染实时功率
                        $('#echarts_wrap_top_powerP').text('实时功率：' + (toDayLoadCurveMinuteData[toDayLoadCurveMinuteData.length - 1]) + " " + res.data.unit);
                    } else {
                        $('#currentLoadP').text('实时负荷：' + "-");
                        // 同时能流图渲染实时功率
                        $('#echarts_wrap_top_powerP').text('实时功率：' + "-");
                    }
                } else {
                    option_day.title.text = '瞬时流量曲线';
                    if (toDayLoadCurveMinuteData[toDayLoadCurveMinuteData.length - 1]) {
                        $('#currentLoadP').text('瞬时流量：' + (toDayLoadCurveMinuteData[toDayLoadCurveMinuteData.length - 1]) + " " + res.data.unit);
                        // 同时能流图渲染实时功率
                        $('#echarts_wrap_top_powerP').text('实时功率：' + (toDayLoadCurveMinuteData[toDayLoadCurveMinuteData.length - 1]) + " " + res.data.unit);
                    } else {
                        $('#currentLoadP').text('瞬时流量：' + "-");
                        // 同时能流图渲染实时功率
                        $('#echarts_wrap_top_powerP').text('实时功率：' + "-");
                    }
                }
                option_day.yAxis.name = "单位：(" + res.data.unit + ")"
                myday_echarts.setOption(option_day, true);

                // 负荷概况表格数据
                /*---------负荷数据---------*/

                /*本日最大值与发生时间*/
                // 如果是电，就叫负荷，如果是其他就是瞬时流量
                if ($("#energy_type_secelt option:selected").attr("value") == 1) {
                    $("#maxTitle").html("负荷概况");
                    $('#maxdayval').html("日最大负荷：<span class='spanRight'>" + res.data.loadMaxDMY.loadTodayOfMax.max + " " + res.data.unit + "</span>")
                    $('#maxmonthval').html("月最大负荷：<span class='spanRight'>" + res.data.loadMaxDMY.loadCurMonthOfMax.max + " " + res.data.unit + "</span>")
                    $('#maxyearval').html("年最大负荷：<span class='spanRight'>" + res.data.loadMaxDMY.loadCurYearOfMax.max + " " + res.data.unit + "</span>")

                } else {
                    $("#maxTitle").html("瞬时流量概况");
                    $('#maxdayval').html("日最大瞬时流量：<span class='spanRight'>" + res.data.loadMaxDMY.loadTodayOfMax.max + " " + res.data.unit + "</span>")
                    $('#maxmonthval').html("月最大瞬时流量：<span class='spanRight'>" + res.data.loadMaxDMY.loadCurMonthOfMax.max + " " + res.data.unit + "</span>")
                    $('#maxyearval').html("年最大瞬时流量：<span class='spanRight'>" + res.data.loadMaxDMY.loadCurYearOfMax.max + " " + res.data.unit + "</span>")
                }


                $('#maxdaytime span').html(res.data.loadMaxDMY.loadTodayOfMax.maxTime);
                /*本日最大值与发生时间*/
                /*本月最大值与发生时间*/
                $('#maxmonthtime span').html(res.data.loadMaxDMY.loadCurMonthOfMax.maxTime);
                /*本月最大值与发生时间*/
                /*本年最大值与发生时间*/
                $('#maxyeartime span').html(res.data.loadMaxDMY.loadCurYearOfMax.maxTime);
                /*本年最大值与发生时间*/



                // 修改需求，在选择其他能源时，变成瞬时流量
                // /*本日最大值与发生时间*/
                // $('#maxdayval span').html(res.data.loadMaxDMY.loadTodayOfMax.max + " " + res.data.unit);
                // $('#maxdaytime span').html(res.data.loadMaxDMY.loadTodayOfMax.maxTime);
                // /*本日最大值与发生时间*/
                // /*本月最大值与发生时间*/
                // $('#maxmonthval span').html(res.data.loadMaxDMY.loadCurMonthOfMax.max + " " + res.data.unit);
                // $('#maxmonthtime span').html(res.data.loadMaxDMY.loadCurMonthOfMax.maxTime);
                // /*本月最大值与发生时间*/
                // /*本年最大值与发生时间*/
                // $('#maxyearval span').html(res.data.loadMaxDMY.loadCurYearOfMax.max + " " + res.data.unit);
                // $('#maxyeartime span').html(res.data.loadMaxDMY.loadCurYearOfMax.maxTime);
                // /*本年最大值与发生时间*/
                /*---------负荷数据---------*/
            },
            error: function (res) {
                // layer.msg('数据请求失败', {
                //     time: 2000, //2s后自动关闭
                // });
                if ($("#energy_type_secelt option:selected")[0].innerText == '电') {
                    option_day.title.text = '日负荷曲线';
                } else {
                    option_day.title.text = '瞬时流量曲线';
                }
                myday_echarts.setOption(option_day, true);
            }
        });
    }

    // 能留图数据请求接口
    function funFlowChart() {

        $.ajax({
            url: lp_url + '/homepage/energyflow_diagram_data',
            type: "get",
            dataType: "json",
            data: {
                dateType: $("#flowChartDateTab .current").attr("value"),
                energyType: $("#energy_type_secelt option:selected").val(),
            },
            success: function (res) {
                // 判断,请求成功以后10秒再发出请求
                if (res.status == 0) {
                    energyflow_diagram_dataSetimeout = setTimeout(function () { funFlowChart(); }, 10000);
                }
                console.log(res)
                var energyFlowData = res.data.getEnergyFlowDiagram;
                //能流图
                var energyFlowVal = [];
                var energyFlowName = [];
                var energyFlowvalue = [];
                for (var c = 0; c < energyFlowData.length; c++) {
                    energyFlowVal.push(energyFlowData[c].value);
                    energyFlowName.push(energyFlowData[c].source);

                }
                for (var c = 0; c < energyFlowData.length; c++) {

                    energyFlowName.push(energyFlowData[c].target);
                }
                var energyFlowName = energyFlowName.distinct();



                for (var k = 0; k < energyFlowName.length; k++) {
                    energyFlowvalue.push({});
                    energyFlowvalue[k].name = energyFlowName[k];
                }

                // 判断能流图告警是什么颜色,将颜色附在主进线上
                // 能留图告警的四种颜色
                // 一级
                // 绿
                // '#93ddc4'
                // 二级
                // 黄
                // "#eeea41"
                // 三级
                // 橙色
                // "#ff6f02"
                // 四级
                // 红色
                // "#f10000"
                // 计算限制时,第一级不包含限制的
                // 只有是日的才做限制判断，其他全是绿色
                if ($("#flowChartDateTab .current").attr("value") == "D") {
                    var interAlarmColor;
                    if (res.data.inletWireTotal) {
                        // 判断是否设置了限值
                        if (res.data.upperlimit2) {
                            if (res.data.inletWireTotal >= res.data.upperlimit2) {
                                interAlarmColor = "#f10000";
                            } else if (res.data.inletWireTotal < res.data.upperlimit2 && res.data.inletWireTotal >= res.data.upperlimit1) {

                                interAlarmColor = "#ff6f02";

                            } else if (res.data.inletWireTotal < res.data.upperlimit1 && res.data.inletWireTotal >= res.data.upperlimit) {
                                interAlarmColor = "#eeea41";

                            } else if (res.data.inletWireTotal < res.data.upperlimit) {
                                interAlarmColor = '#93ddc4';
                            }
                        }

                    }

                    // 进线判读是哪种告警结束
                    for (var i = 0; i < energyFlowvalue.length; i++) {
                        energyFlowvalue[i].itemStyle = flowEchartColor[i];
                        if (i == 0) {
                            if (interAlarmColor) {
                                energyFlowvalue[i].itemStyle = interAlarmColor;
                            }
                        }
                    }
                } else {
                    // 进线判读是哪种告警结束
                    for (var i = 0; i < energyFlowvalue.length; i++) {
                        energyFlowvalue[i].itemStyle = flowEchartColor[i];
                        if (i == 0) {
                            if (interAlarmColor) {
                                energyFlowvalue[i].itemStyle = '#93ddc4';
                            }
                        }
                    }
                }
                // 能流图居中，隐藏是0的项
                var zeroDataItem = [];
                for (var i = 0; i < energyFlowData.length; i++) {
                    if (energyFlowData[i].value <= 0) {
                        energyFlowData[i].value = 0.00001;
                    }
                    if (energyFlowData[i].value <= 0) {
                        zeroDataItem.push(energyFlowData[i].target)
                    }
                }

                // 循环获取不是零的项
                var notZeroDataItem = [];
                for (var i = 0; i < energyFlowvalue.length; i++) {
                    var equal = false;
                    for (var j = 0; j < zeroDataItem.length; j++) {
                        if (energyFlowvalue[i].name == zeroDataItem[j]) {
                            equal = true;
                        }
                    }
                    if (equal == false) {
                        notZeroDataItem.push(energyFlowvalue[i])
                    }
                }
                // 开始放在energyFlowvalue，处理居中以后用notZeroDataItem
                option_flow.series.data = notZeroDataItem;
                option_flow.series.links = energyFlowData;
                if (interAlarmColor) {
                    option_flow.color[option_flow.color.length - 1] = interAlarmColor;
                }
                option_flow.levels = [{
                    depth: 0,
                    itemStyle: {
                        color: '#f10000'
                    },
                    lineStyle: {
                        color: 'source',
                        opacity: 0.6
                    }
                }]
                myflow_echarts.setOption(option_flow, true);

            },
            error: function (res) {
                // layer.msg('数据请求失败', {
                //     time: 2000, //2s后自动关闭
                // });
            }
        });



    }

    funFlowChart()





    // 页面渲染完调用各个数据接口
    req_rightbottom()
    req_leftmiddle()
    if ($("#real_time_load_tab .current").attr("value") == 'A') {
        timer = setInterval(() => {
            console.log('middleChartAjaxSuccessfully');

            req_leftmiddle();
        }, 60000);
    } else {
        clearInterval(timer);
    }
    req_lefttbottom_e();
    req_righttop()





    Array.prototype.distinct = function () {
        var arr = this,
            i,
            obj = {},
            result = [],
            len = arr.length;
        for (i = 0; i < arr.length; i++) {
            if (!obj[arr[i]]) { //如果能查找到，证明数组元素重复了
                obj[arr[i]] = 1;
                result.push(arr[i]);
            }
        }
        return result;
    };

    // 所有echarts图自适应页面
    // echarts_onresize([mychart, mychart2, mychart3, mychart4, mychart5, mychart6])





    // 获取间隔天数  
    function getDays(day1, day2) {
        // 获取入参字符串形式日期的Date型日期  
        var st = day1.getDate();
        var et = day2.getDate();
        var retArr = [];
        // 获取开始日期的年，月，日  
        var yyyy = st.getFullYear(),
            mm = st.getMonth(),
            dd = st.getDate(),
            hh = st.getHours(),
            MM = st.getMinutes(),
            ss = st.getSeconds()
        // 循环  
        while (st.getTime() != et.getTime()) {
            retArr.push(st.getYMD());
            // 使用dd++进行天数的自增  
            st = new Date(yyyy, mm, dd, hh, ++MM, ss);
        }
        // 将结束日期的天放进数组  
        retArr.push(et.getYMD());
        retArr.splice(0, 1);
        return retArr; // 或可换为return ret;  
    }

    // 给Date对象添加getYMD方法，获取字符串形式的年月日  
    Date.prototype.getYMD = function () {
        // 将结果放在数组中，使用数组的join方法返回连接起来的字符串，并给不足两位的天和月十位上补零  
        return [this.getFullYear(), fz(this.getMonth() + 1), fz(this.getDate())].join("-") + ' ' + [fz(this.getHours()), fz(this.getMinutes()), '00'].join(':');
    }

    // 给String对象添加getDate方法，使字符串形式的日期返回为Date型的日期  
    String.prototype.getDate = function () {
        var strArr = this.split('-');
        var timeArr = strArr[2].substring(3).split(':');
        return new Date(strArr[0], strArr[1] - 1, strArr[2].substring(0, 2), timeArr[0], timeArr[1], timeArr[2]);

    }

    // 给月和天，不足两位的前面补0  
    function fz(num) {
        if (num < 10) {
            num = "0" + num;

        }
        return num
    }
})