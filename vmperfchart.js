/**
 * 设置显示时间
 */
var setPerfChartDate = function(theDate) {
    $('#vmperfdatetime').datetimebox('setValue',theDate);
};
var vmPerfChartMoveDatePrePre = function() {
    vmPerfChartMoveDate(-30);
};
var vmPerfChartMoveDatePre = function() {
    vmPerfChartMoveDate(-15);
};
var vmPerfChartMoveDatePos = function() {
    vmPerfChartMoveDate(15);
};
var vmPerfChartMoveDatePosPos = function() {
    vmPerfChartMoveDate(30);
};


	String.prototype.replaceAll = function(s1,s2){
　　		return this.replace(new RegExp(s1,"gm"),s2);
　　	}
/**
 * 画图显示图表
 */
var drawPerfChart = function(iaasId,vmId,dateTime) {
	$.ajax({
		type:"POST",
        url:"${ctx}/applyorder.VMPerfChartAction$queryData.json",
        data:{
    		'vmId':vmId,
    		'iaasId':iaasId,
    		'dateTime':dateTime
    	},
        dataType:"json",
        success:function(data, textStatus){
        	drawVMCpuPerfChart("#cpuRatioChartDiv" + "/" + data.cpuJson)
        	drawVMMemoryPerfChart("#memoryRatioChartDiv" + "/" + data.memoryJson)
            drawVMIFPerfChart("#nifChartDiv" + "/" + data.nifJson)
            drawVMVBDPerfChart("#vbdChartDiv" + "/" + data.vbdJson)
        }
    });
};

/**
 * 画虚拟机cpu使用率图
 */
var drawVMCpuPerfChart = function(para) {
	var data = para.split("/");
	var text = 'CPU使用率(%)' ;
	if(data[1] == "[]"){
		text = '没有相应数据';
	}
    var theData = eval(data[1]);
    var plotData = new Array();
    var maxValue = 0;
    for (var i=0;i<theData.length;i++) {
        var oneData = theData[i];
        var monitorDateLong = oneData.monitorDateLong;
        var usageRate = oneData.cpuUsageRatePercent;
        plotData.push([monitorDateLong,usageRate]);
        if (usageRate>maxValue) {
        	maxValue = usageRate;
        }
    }
    var myseries;
    if (maxValue>50) {
    	myseries = {
            name: '',
            data: plotData,
            color: '#FF0000',
            threshold: 50,
            negativeColor: Highcharts.getOptions().colors[0]
        };
    } else {
    	myseries = {
            name: '',
            data: plotData,
        };
    }

    Highcharts.setOptions({ 
        global: {useUTC: false} 
    });
    $(data[0]).highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: text
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
        	max: 100,
        	min: 0,
            title: {
                text: ''
            },
            labels: {
                formatter: function() {
                    return this.value ;
                }
            },
            allowDecimals: false
        },
        tooltip: {
            formatter: function() {
                return Highcharts.dateFormat('%Y-%m-%e %H:%M:%S',this.x)+'<br><b>'+this.y+'%</b>';
            }
        },
        legend: {
            enabled: false
        },
        series: [myseries]
    });
	
}
    
/**
 * 画虚拟机内存使用情况图
 */  
var drawVMMemoryPerfChart = function(para) {
	var data = para.split("/");
	var text = '内存使用情况(G)' ;
	if(data[1] == "[]"){
		text = '没有相应数据';
	}
	var theData = eval(data[1]);
    var memoryActualPlotData = new Array();
    var memoryFreePlotData = new Array();
    var memoryUsedPlotData = new Array();
    for (var i=0;i<theData.length;i++) {
        var oneData = theData[i];
        var monitorDateLong = oneData.monitorDateLong;
        var memoryActual = oneData.memoryActual;
        var memoryFree = oneData.memoryFree;
        var memoryUsed = Number((memoryActual - memoryFree).toFixed(2));
        memoryActualPlotData.push([monitorDateLong,memoryActual]);
        memoryFreePlotData.push([monitorDateLong,memoryFree]);
        memoryUsedPlotData.push([monitorDateLong,memoryUsed]);
    }
    Highcharts.setOptions({ 
        global: {useUTC: false} 
    });
    $(data[0]).highcharts({
        chart: {
            type: 'area'
        },
        title: {
            text: text
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                formatter: function() {
                    return this.value ;
                }
            },
            allowDecimals: false,
            min: 0
        },
        tooltip: {
            formatter: function() {
                return this.series.name + '<br>' + Highcharts.dateFormat('%Y-%m-%e %H:%M:%S',this.x)+'<br><b>'+this.y+'G</b>';
            }
        },
        legend: {
            useHTML:true
        },
        series: [{
            name: '总内存',
            data: memoryActualPlotData
        },{
            name: '使用内存',
            data: memoryUsedPlotData
        }]
    });
}
    
/**
 * 画虚拟机网络IO图
 */    
var drawVMIFPerfChart = function(para) {
	var data = para.split("/");
	var text ='网络I/0传输速度(KBps)' ;
	if(data[1] == "[]"){
		text = "没有相应数据"
	}
	var myseries = eval(data[1])
    Highcharts.setOptions({ 
        global: {useUTC: false} ,
        lang: {numericSymbols:null}
    });
    $(data[0]).highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: text
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
        	minRange: 10,
            title: {
                text: ''
            },
            labels: {
                formatter: function() {
                    return this.value ;
                }
            },
            allowDecimals: false,
            min: 0
        },
        tooltip: {
            formatter: function() {
//			                if (this.y>1024) {
//			                    return this.series.name + '<br>' + Highcharts.dateFormat('%Y-%m-%e %H:%M:%S',this.x)+'<br><b>'+(this.y/1024).toFixed(2)+'(MBps)</b>';
//			                } else {
                    return this.series.name + '<br>' + Highcharts.dateFormat('%Y-%m-%e %H:%M:%S',this.x)+'<br><b>'+this.y+'(KBps)</b>';
//			                }
            }
        },
        series: myseries
    });
}

/**
 * 画虚拟机负载图
 */
var drawVMVBDPerfChart = function(para) {
	var data = para.split("/");
	var text = '存储I/O读写速度(KBps)' ;
	if(data[1] == "[]"){
		text = '没有相应数据';
	}
	var myseries = eval(data[1])
    Highcharts.setOptions({ 
        global: {useUTC: false} ,
        lang: {numericSymbols:null}
    });
    $(data[0]).highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: text
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
        	minRange: 10,
            title: {
                text: ''
            },
            labels: {
                formatter: function() {
                    return this.value ;
                }
            },
            allowDecimals: false,
            min: 0
        },
        tooltip: {
            formatter: function() {
//			                if (this.y>1024) {
//			                    return Highcharts.dateFormat('%Y-%m-%e %H:%M:%S',this.x)+'<br><b>'+(this.y/1024).toFixed(2)+'(MBps)</b>';
//			                } else {
                    return this.series.name + '<br>' + Highcharts.dateFormat('%Y-%m-%e %H:%M:%S',this.x)+'<br><b>'+this.y+'(KBps)</b>';
//			                }
            }
        },
        series: myseries
    });
	
}
