<template>
    <view>
        <c-card title="课表">
            <c-time-table-header
                :week="week"
                @previous="pre"
                @next="next"
                @refresh="refresh"
            ></c-time-table-header>
            <view class="a-hr"></view>
            <c-time-table-body :start="start" :week="week" :table="tables"></c-time-table-body>
        </c-card>
    </view>
</template>

<script lang="ts">
import storage from "@/modules/storage";
import { Component, Vue } from "vue-property-decorator";
import { fetchTimeTable, TableCache, tableDispose } from "@/models/table-item";
// import { CTimeTableHeader, CTimeTableBody, CCard } from "shst-campus";
import CTimeTableHeader from "@/components/shst-campus/c-time-table-header/c-time-table-header.vue";
import CTimeTableBody from "@/components/shst-campus/c-time-table-body/c-time-table-body.vue";
import CCard from "@/components/shst-campus/c-card/c-card.vue";
import { DefinedTableItem } from "@/components/shst-campus/types/time-table";

@Component({
    components: { CTimeTableHeader, CTimeTableBody, CCard },
})
export default class TimeTable extends Vue {
    protected ad = 0;
    protected tables: DefinedTableItem[] = [];
    protected week = uni.$app.data.curWeek;
    protected start = uni.$app.data.curTermStart;
    protected created(): void {
        uni.$app.onload(() => {
            this.week = uni.$app.data.curWeek;
            this.start = uni.$app.data.curTermStart;
            this.ad = this.$store.state.initData.adSelect.table;
            this.getCache(this.week);
        });
        uni.$app.eventBus.on("RefreshTable", this.refresh);
    }

    private getCache(week: number): void {
        const tableCache = <TableCache>storage.get("tables") || {};
        if (tableCache.term === this.$store.state.curTerm) {
            console.log("GET TABLE FROM CACHE");
            const tables = tableDispose(tableCache.classes || [], false, this.week);
            this.tables = tables;
            this.week = week;
        } else {
            this.getRemoteTable(week);
        }
    }
    private async getRemoteTable(week: number | null = null) {
        let urlTemp = "";
        if (typeof week === "number") urlTemp += "/" + week;
        const res = await fetchTimeTable(
            uni.$app.data.url + "/sw/table" + urlTemp,
            this.$store.state.curWeek,
            this.$store.state.curTerm
        );
        console.log("GET TABLE FROM REMOTE WEEK " + week);
        const tables = tableDispose(res.data.info, false, this.week);
        this.tables = tables;
        this.week = res.data.week;
        storage.setPromise("tables", {
            term: this.$store.state.curTerm,
            classes: res.data.info,
        });
    }

    pre(week: number): void {
        uni.$app.throttle(500, () => {
            if (week <= 1) return void 0;
            --week;
            this.week = week;
            this.getCache(week);
        });
    }
    next(week: number): void {
        uni.$app.throttle(500, () => {
            ++week;
            this.week = week;
            this.getCache(week);
        });
    }
    refresh(week: number): void {
        uni.$app.throttle(500, () => {
            storage.set("table", { term: this.$store.state.curTerm, classTable: [] });
            this.getRemoteTable(Number(week));
        });
    }
}
</script>

<style scoped lang="scss">
.table-top {
    display: flex;
    padding: 5px;
    justify-content: space-between;
    height: 30px;
}

.week {
    align-self: center;
}

.table-container {
    min-height: 130px;
    margin: 0 1.5px;
    /* text-align: center; */
    word-break: break-all;
    color: #fff;
    padding: 3px;
    background: #fff;
    font-size: 12px;
    border-radius: 2px;
    position: relative;
    overflow: hidden;
}

.triangle {
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: 13px solid rgba(255, 255, 255, 0.8);
    border-left: 13px solid transparent;
}

.timetablehr {
    margin: 3px 0;
    background-color: #eee !important;
    height: 1px;
    border: none;
}

.week-unit {
    text-align: center;
    padding: 5px 0 1px 0;
    font-size: 10px;
    width: 100%;
}

.week-unit > view {
    padding: 3px 0;
    font-size: 8px;
}

.today {
    border-bottom: 3px solid #eee;
}

.none {
    border: none;
    font-size: 8px;
}
.popup {
    width: 200px;
    color: $a-font-grey;
}
.popup > view > view {
    margin: 5px 0;
}
</style>
