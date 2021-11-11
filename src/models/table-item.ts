import store from "@/store/index";
import { safeDate } from "@/modules/datetime";
import { computeBackground } from "@/vector/pub-fct";
import { PromiseResponse } from "@/modules/request";
import { DefinedTableItem } from "@/components/shst-campus/types/time-table";

/**
 * 统一处理课表功能
 */
export type RemoteTableInfo = Array<{
    day: number;
    serial: number;
    name: string;
    weeks: string[];
    teacher: string;
    weeks_raw: string;
    classroom: string;
}>;
export type ClassItem = DefinedTableItem & { weeks: string[]; cur_week: boolean };
export function tableDispose(
    info: RemoteTableInfo,
    today = false,
    week: null | number = null
): Array<ClassItem> {
    const tables: Array<ClassItem> = [];
    const curWeek = week || store.state.curWeek;
    const curDay = safeDate().getDay() || 7;
    const judgeCurWeekTable = (weeks: string[], curWeek: number) => {
        const decideCurWeek = (str: string): boolean => {
            const [start, end] = str.split("-").map(v => Number(v) >> 0);
            for (let i = start; i <= end; ++i) {
                if (curWeek === i) return true;
            }
            return false;
        };
        for (let i = 0, n = weeks.length; i < n; ++i) {
            const str = weeks[i];
            if (/^\d+-\d+$/.test(str)) {
                if (decideCurWeek(str)) return true;
            } else if (/^\d+-\d+\/[12]$/.test(str)) {
                const type = Number(str.slice(-1));
                if (type % 2 !== curWeek % 2) continue;
                if (decideCurWeek(str.replace(/\/\d/, ""))) return true;
            } else if (/^\d+$/.test(str)) {
                if (Number(str) >> 0 === curWeek) return true;
            }
        }
        return false;
    };
    info.forEach(value => {
        if (!value) return void 0;
        const unit: ClassItem = Object.create(null);
        const day = value.day + 1;
        const serial = value.serial + 1;
        if (today && day !== curDay) return void 0;
        unit.week = day;
        unit.serial = serial;
        unit.className = value.name;
        unit.weeks = value.weeks;
        unit.background = "#CCC";
        unit.teacher = value.teacher;
        unit.ext = value.weeks_raw;
        unit.classRoom = value.classroom;
        unit.cur_week = judgeCurWeekTable(value.weeks, curWeek);
        unit.curWeek = unit.cur_week;
        if (today && !unit.curWeek) return void 0;
        if (unit.cur_week) unit.background = computeBackground(value.name);
        tables.push(unit);
    });
    return tables;
}

export const fetchTimeTable = (
    url: string,
    week: number | string,
    term: string
): PromiseResponse<{ info: RemoteTableInfo; week: number }> => {
    return uni.$app.request({
        load: 2,
        url,
        data: { week, term },
    });
};
