import store from "@/store/index";
import {formatDate, dayDiff, safeDate} from "@/modules/datetime";

/**
 * 统一处理课表功能
 */
function tableDispose(info, today = false) {
    const tables = [];
    const curWeek = store.state.curWeek;
    const curDay = safeDate().getDay() || 7;
    info.forEach(value => {
        if(!value) return void 0;
        const unit = Object.create(null);
        const day = value.day;
        const serial = value.serial;
        if(today && day !== curDay) return void 0;
        unit.day = day;
        unit.serial = serial;
        unit.name = value.name;
        unit.teacher = value.teacher;
        unit.weeks_raw = value.weeks_raw;
        unit.classroom = value.classroom;
        unit.cur_week = false;
        unit.background = "#AAA";
        const decideCurWeek = (str) => {
            const [start, end] = str.split("-");
            for(let i=start; i<=end; ++i){
                if(curWeek === i) return unit.cur_week = true;
            }
            return false;
        }
        value.weeks.forEach(str => {
            if(unit.cur_week) return void 0;
            if(/\d+-\d+/.test(str)){
                if(decideCurWeek(str)) return void 0;
            }else if(/\d+-\d+\/[12]/.test(str)){
                const type = str.slice(-1);
                if(type & 1 !== curWeek & 1) return void 0;
                if(decideCurWeek(str.replace(/\/\d/, ""))) return void 0;
            }else if(/\d+/.test(str)){
                if(str >> 0 === curWeek) unit.cur_week = true;
            }
        })
        if(unit.cur_week){
            const uniqueNum = Array.prototype.reduce.call(value.name, (pre, cur) => pre+cur.charCodeAt(), 0);
            unit.background = store.state.colorList[uniqueNum % store.state.colorN];
        }
        if(!tables[day]) tables[day] = [];
        if(!tables[day][serial]) tables[day][serial] = [];
        tables[day][serial].push(unit);
    })
    console.log(tables);
    if(today) return tables[curDay];
    else return tables;
}

/**
 * @param {string} startTime
 * @description 获取当前周次
 */
function getCurWeek(startTime) {
    console.log(formatDate());
    if(formatDate() < startTime) return 1;
    return (dayDiff(startTime, formatDate()) / 7) >> 0 + 1;
}

export {getCurWeek, tableDispose}

export default {getCurWeek, tableDispose}
