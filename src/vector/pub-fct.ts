import store from "@/store/index";
import { formatDate, dayDiff } from "@/modules/datetime";

/**
 * @param {string} startTime
 * @description 获取当前周次
 */
export function getCurWeek(startTime: string): number {
    console.log(formatDate());
    if (formatDate() < startTime) return 1;
    const week = dayDiff(startTime, formatDate()) / 7 + 1;
    return week;
}

/**
 * 生成学期数组
 */
export const generateTerms = (start = null, peak = null): { show: string; value: string }[] => {
    const year = start || Number(store.state.curTerm.split("-")[1]);
    const limit = peak || store.state.curTerm;
    const years = [];
    for (let i = 1; i <= 4; ++i) {
        const firstTerm = year - i + "-" + (year - i + 1) + "-2";
        const secondTerm = year - i + "-" + (year - i + 1) + "-1";
        if (firstTerm <= limit) {
            years.push({ show: firstTerm, value: firstTerm });
        }
        if (secondTerm <= limit) {
            years.push({ show: secondTerm, value: secondTerm });
        }
    }
    return years;
};

/**
 * 计算dot颜色
 */
export function computeBackground(unit: string): string;
export function computeBackground(unit: Record<string, string>[]): Record<string, string>[];
export function computeBackground(
    unit: string | Record<string, string>[],
    prop = "name"
): string | Record<string, string>[] {
    if (unit instanceof Array) {
        unit.forEach(v => {
            const uniqueNum = Number(
                Array.prototype.reduce.call(v[prop], (pre, cur) => pre + cur.charCodeAt(), 0)
            );
            v.background = store.state.colorList[uniqueNum % store.state.colorN];
        });
        return unit;
    } else {
        const uniqueNum = Number(
            Array.prototype.reduce.call(unit, (pre, cur) => pre + cur.charCodeAt(), 0)
        );
        return store.state.colorList[uniqueNum % store.state.colorN];
    }
}
