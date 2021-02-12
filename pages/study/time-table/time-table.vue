<template>
    <view>

        <layout title="查课表">
            <view class="table-top">
                <view class="week a-lml">第{{week}}周</view>
                <view class="y-center">
                    <navigator class="a-btn a-btn-white a-btn-square a-lml y-center" url="edit">
                        <view class="iconfont icon-jia"></view>
                    </navigator>
                    <view class="a-btn a-btn-white a-btn-square a-lml y-center" @click="refresh(week)">
                        <view class="iconfont icon-shuaxin1"></view>
                    </view>
                    <view class="a-btn a-btn-white a-btn-square a-lml y-center" @click="pre(week)">
                        <view class="iconfont icon-arrow-lift"></view>
                    </view>
                    <view class="a-btn a-btn-white a-btn-square a-lml y-center" @click="next(week)">
                        <view class="iconfont icon-arrow-right"></view>
                    </view>
                </view>
            </view>
            <view class="a-hr timetablehr"></view>
            <view class="a-flex">
                <view v-for="item in 7" :key="item" class="week-unit">
                    <view>{{date[item].n}}</view>
                    <view :class="date[item].s">{{date[item].d ? date[item].d : "00/00"}}</view>
                </view>
            </view>
            <view class="a-hr timetablehr"></view>
            <view v-for="item in 5" :key="item">
                <view class="a-flex">
                    <view v-for="inner in 7" :key="inner" class="a-flex-full a-flex">
                        <view v-if="tables[inner] && tables[inner][item]" class="timetable-hide a-flex-full"
                            :style="{'background':tables[inner][item].background}">
                            <view v-for="(classes, classIndex) in tables[inner][item].table" :key="classIndex">
                                <view>{{classes.name}}</view>
                                <view>{{classes.classroom}}</view>
                                <view>{{classes.teacher}}</view>
                                <view>{{classes.cur_week ? "" : "[非本周]"}}</view>
                                <view>{{classes.weeks_raw}}</view>
                                <view v-if="classIndex !== tables[inner][item].table.length-1">---</view>
                            </view>
                        </view>
                        <view v-else class="timetable-hide"></view>
                    </view>
                </view>
                <view class="a-hr timetablehr"></view>
            </view>
        </layout>

<!--        <view class="a-hide" :class="{'a-show':today > '2020-03-26'}">
            <layout>
                <view class="y-center">
                    <view class="a-dot"></view>
                    <navigator url="/pages/home/auxiliary/webview?url=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F9L3kFI0jdHajnPm83jRbwA"
                        open-type="navigate" class="a-link" hover-class="none">自定义课表配色</navigator>
                </view>
            </layout>
        </view> -->

        <layout v-if="adShow">
            <!-- #ifdef MP-WEIXIN -->
            <advertise :ad-select="adSelect" @error="adShow = false"></advertise>
            <!-- #endif -->
            <!-- #ifdef MP-QQ -->
            <advertise :ad-select="adSelect" @error="adShow = false"></advertise>
            <!-- #endif -->
        </layout>

    </view>
</template>

<script>
    import storage from "@/modules/storage.js";
    import { tableDispose } from "@/vector/pub-fct.js";
    import advertise from "@/components/advertise/advertise.vue";
    import { formatDate, extDate, safeDate } from "@/modules/datetime.js";
    export default {
        components:{ advertise },
        data: () => ({
                week: 1,
                date: [],
                tables: [],
                adShow: true,
                today: formatDate(),
                adSelect: 0
        }),
        created: function(e) {
            uni.$app.onload(() => {
                this.week = this.$store.state.curWeek;
                this.getDate();
                this.getCache(this.$store.state.curWeek);
                this.adSelect = this.$store.state.initData.adSelect.table;
            })
            uni.$app.eventBus.on("RefreshTable", this.refresh);
        },
        beforeDestroy: function(){
            uni.$app.eventBus.off("RefreshTable", this.refresh);
        },
        methods: {
            getCache: function(week) {
                let tableCache = storage.get("tables") || {};
                if (tableCache.term === this.$store.state.curTerm) {
                    console.log("GET TABLE FROM CACHE");
                    let showTableArr = tableDispose(tableCache.classes, false, this.week);
                    this.tables = showTableArr;
                    this.week = week;
                    this.getDate();
                } else {
                    this.getRemoteTable(week);
                }
            },
            getRemoteTable: async function(week = null) {
                let urlTemp = "";
                if (typeof(week) === "number") urlTemp += ("/" + week);
                let res = await uni.$app.request({
                    load: 2,
                    url: this.$store.state.url + "/sw/table" + urlTemp,
                    data: {
                        week: this.$store.state.curWeek,
                        term: this.$store.state.curTerm
                    },
                })
                console.log("GET TABLE FROM REMOTE WEEK " + week);
                let showTableArr = tableDispose(res.data.info, false, this.week);
                this.tables = showTableArr;
                this.week = res.data.week
                storage.setPromise("tables", {
                    term: this.$store.state.curTerm,
                    classes: res.data.info
                });
                this.getDate();
            },
            pre: function(week) {
                uni.$app.throttle(500, () => {
                    if (week <= 1) return void 0;
                    --week;
                    this.week = week;
                    this.getCache(week);
                })
            },
            next: function(week) {
                uni.$app.throttle(500, () => {
                    ++week;
                    this.week = week;
                    this.getCache(week);
                })
            },
            refresh: function(week) {
                uni.$app.throttle(500, () => {
                    storage.set("table", {term: this.$store.state.curTerm, classTable: []});
                    this.getRemoteTable(Number(week));
                })
            },
            getDate: function() {
                let today = safeDate();
                let curWeekDate = safeDate(this.$store.state.curTermStart);
                curWeekDate.addDate(0, 0, this.week * 7 - 8);
                let allWeekDay = [];
                let week = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
                for (let i = 0; i < 7; ++i) {
                    curWeekDate.addDate(0, 0, 1);
                    allWeekDay.push({
                        n: week[i],
                        d: formatDate("MM/dd", curWeekDate),
                        s: curWeekDate.getDay() === today.getDay() ? "today" : "none"
                    });
                }
                this.date = allWeekDay;
            }
        }
    }
</script>

<style scoped>
    .table-top {
        display: flex;
        padding: 5px;
        justify-content: space-between;
        height: 30px;
    }

    .week {
        align-self: center;
    }

    .timetable-hide {
        min-height: 130px;
        margin: 0 1.5px;
        /* text-align: center; */
        word-break: break-all;
        color: #fff;
        padding: 3px;
        background: #fff;
        font-size: 12px;
        border-radius: 2px;
    }

    .timetable-hide > view{
        margin-bottom: 3px;
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
</style>
