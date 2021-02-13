<template>
    <view>

        <layout title="查课表">
            
            <!-- section 周次与操作 -->
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
            <!-- section 周次与操作 -->
            
            <!-- section 日期 -->
            <view class="a-hr timetablehr"></view>
            <view class="a-flex">
                <view v-for="item in 7" :key="item" class="week-unit">
                    <view>{{date[item].n}}</view>
                    <view :class="date[item].s">{{date[item].d ? date[item].d : "00/00"}}</view>
                </view>
            </view>
            <view class="a-hr timetablehr"></view>
            <!-- section 日期 -->
            
            <!-- section 课表主体 -->
            <view v-for="item in 5" :key="item">
                <view class="a-flex">
                    <view v-for="inner in 7" :key="inner" class="a-flex-full a-flex">
                        <view
                            class="table-container a-flex-full"
                            @click="popupDetail(inner, item)"
                            v-if="computedTables[inner] && computedTables[inner][item]"
                            :style="{'background': computedTables[inner][item].background}"
                        >
                            <view>{{computedTables[inner][item].name}}</view>
                            <view>{{computedTables[inner][item].classroom | charsFilter}}</view>
                            <view>{{computedTables[inner][item].teacher}}</view>
                            <view>{{computedTables[inner][item].weeks_raw}}</view>
                            <view class="triangle" v-if="tables[inner][item].length > 1"></view>
                        </view>
                        <view v-else class="table-container"></view>
                    </view>
                </view>
                <view class="a-hr timetablehr"></view>
            </view>
            <!-- section 课表主体 -->
        </layout>
        
        <!-- section 自定义配色 -->
        <!--<view class="a-hide" :class="{'a-show':today > '2020-03-26'}">
            <layout>
                <view class="y-center">
                    <view class="a-dot"></view>
                    <navigator url="/pages/home/auxiliary/webview?url=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F9L3kFI0jdHajnPm83jRbwA"
                        open-type="navigate" class="a-link" hover-class="none">自定义课表配色</navigator>
                </view>
            </layout>
        </view> -->
        <!-- section 自定义配色 -->

        <!-- section 广告 -->
        <layout v-if="adShow">
            <!-- #ifdef MP-WEIXIN -->
            <advertise :ad-select="adSelect" @error="adShow = false"></advertise>
            <!-- #endif -->
            <!-- #ifdef MP-QQ -->
            <advertise :ad-select="adSelect" @error="adShow = false"></advertise>
            <!-- #endif -->
        </layout>
        <!-- section 广告 -->

        <!-- section 课表详细信息弹窗 -->
        <popup
            v-if="detail.popup"
            @close="detail.popup = false"
        >
            <view class="popup">
                <view
                    v-for="(item, index) in detail.content" :key="index"
                    :class="{'a-lmt': index}"
                >
                    <view class="y-center">
                        <view class="a-dot" :style="{'background': item.background}"></view>
                        <view>{{item.name}}</view>
                    </view>
                    <view class="a-flex-space-between">
                        <view>教室</view>
                        <view>{{item.classroom}}</view>
                    </view>
                    <view class="a-flex-space-between">
                        <view>讲师</view>
                        <view>{{item.teacher}}</view>
                    </view>
                    <view class="a-flex-space-between">
                        <view>本周</view>
                        <view>{{item.cur_week ? "是" : "否"}}</view>
                    </view>
                    <view class="a-flex-space-between">
                        <view>周次</view>
                        <view>{{item.weeks_raw}}</view>
                    </view>
                </view>
            </view>
        </popup>
        <!-- section 课表详细信息弹窗 -->

    </view>
</template>

<script>
    import storage from "@/modules/storage.js";
    import popup from "@/components/popup/popup.vue";
    import { tableDispose } from "@/vector/pub-fct.js";
    import advertise from "@/components/advertise/advertise.vue";
    import { formatDate, extDate, safeDate } from "@/modules/datetime.js";
    export default {
        components:{ advertise, popup },
        data: () => ({
                week: 1,
                date: [],
                tables: [],
                adShow: true,
                today: formatDate(),
                adSelect: 0,
                detail: {
                    popup: false,
                    content: []
                }
        }),
        created: function(e) {
            uni.$app.onload(() => {
                this.week = this.$store.state.curWeek;
                this.getDate();
                this.getCache(this.week);
                this.adSelect = this.$store.state.initData.adSelect.table;
            })
            uni.$app.eventBus.on("RefreshTable", this.refresh);
        },
        beforeDestroy: function(){
            uni.$app.eventBus.off("RefreshTable", this.refresh);
        },
        computed: {
            computedTables: function() {
                const tables = [];
                this.tables.forEach((column, columnIndex) => {
                    if(!column) return void 0;
                    if(!tables[columnIndex]) tables[columnIndex] = [];
                    column.forEach((units, lineIndex) => {
                        if(!units) return void 0;
                        units.forEach(unit => {
                            if(!tables[columnIndex][lineIndex]) tables[columnIndex][lineIndex] = unit;
                            else if(unit.cur_week) tables[columnIndex][lineIndex] = unit;
                        })
                    })
                })
                return tables;
            }
        },
        filters: {
            charsFilter: str => str.replace(/[室]/g, ""),
        },
        methods: {
            getCache: function(week) {
                let tableCache = storage.get("tables") || {};
                // if (tableCache.term === this.$store.state.curTerm) {
                    console.log("GET TABLE FROM CACHE");
                    let showTableArr = tableDispose(tableCache.classes, false, this.week);
                    this.tables = showTableArr;
                    this.week = week;
                    this.getDate();
                // } else {
                    // this.getRemoteTable(week);
                // }
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
            },
            popupDetail: function(inner, item){
                this.detail.popup = true;
                this.detail.content = this.tables[inner][item];
            }
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

    .triangle{
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
    .popup{
        width: 200px;
        color: $a-font-grey;
    }
    .popup > view > view{
        margin: 5px 0;
    }
</style>
