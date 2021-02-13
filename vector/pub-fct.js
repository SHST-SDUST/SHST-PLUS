import store from "@/store/index";
import {formatDate, dayDiff, safeDate} from "@/modules/datetime";

/**
 * 统一处理课表功能
 */
const tableDispose = (info, today = false, week = null) => {
    const tables = [];
    const curWeek = week || store.state.curWeek;
    const curDay = safeDate().getDay() || 7;
    const judgeCurWeekTable = (weeks, curWeek) => {
        const decideCurWeek = (str) => {
            let [start, end] = str.split("-").map(v => v >> 0);
            for(let i=start; i<=end; ++i){
                if(curWeek === i) return true;
            }
            return false;
        }
        for(let i=0, n=weeks.length; i<n; ++i){
            const str = weeks[i];
            if(/^\d+-\d+$/.test(str)){
                if(decideCurWeek(str)) return true;
            }else if(/^\d+-\d+\/[12]$/.test(str)){
                const type = str.slice(-1);
                if((type & 1) !== (curWeek & 1)) continue;
                if(decideCurWeek(str.replace(/\/\d/, ""))) return true;
            }else if(/^\d+$/.test(str)){
                if(str >> 0 === curWeek) return true;
            }
        }
        return false;
    }
    info.forEach(value => {
        if(!value) return void 0;
        const unit = Object.create(null);
        const day = value.day;
        const serial = value.serial;
        if(today && day !== curDay) return void 0;
        unit.day = day;
        unit.serial = serial;
        unit.name = value.name;
        unit.weeks = value.weeks;
        unit.background = "#CCC";
        unit.teacher = value.teacher;
        unit.weeks_raw = value.weeks_raw;
        unit.classroom = value.classroom;
        unit.cur_week = judgeCurWeekTable(value.weeks, curWeek);
        if(unit.cur_week){
            const uniqueNum = Array.prototype.reduce.call(value.name, (pre, cur) => pre+cur.charCodeAt(), 0);
            unit.background = store.state.colorList[uniqueNum % store.state.colorN];
        }
        if(!tables[day]) tables[day] = [];
        if(!tables[day][serial]) tables[day][serial] = [];
        tables[day][serial].push(unit);
    })
    if(today) return tables[curDay];
    else return tables;
}


/**
 * @param {string} startTime
 * @description 获取当前周次
 */
const getCurWeek = (startTime) => {
    console.log(formatDate());
    if(formatDate() < startTime) return 1;
    return (dayDiff(startTime, formatDate()) / 7) >> 0 + 1;
}

export {getCurWeek, tableDispose}

export default {getCurWeek, tableDispose}
