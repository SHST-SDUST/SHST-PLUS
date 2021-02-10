import util from "@/modules/datetime";

/**
 * 统一处理课表功能
 */
function tableDispose(info, oneDay = false) {
    
}

function getCurWeek(startTime) {
    console.log(util.formatDate());
    if (util.formatDate() < startTime) return 1;
    var week = (util.dayDiff(startTime, util.formatDate()) / 7) >> 0 + 1;
    return week;
}

export {getCurWeek, tableDispose}

export default {getCurWeek, tableDispose}
