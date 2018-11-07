/**
 * 设置显示时间2
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
