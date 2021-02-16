<template>
    <view>

        <layout title="空教室" top-space>
            <view class="text-center a-flex-space-between a-lmt">
                <picker-view class="picker-con" indicator-style="height: 40px;" @change="bindPickerChange">
                    <picker-view-column>
                        <view v-for="(item,index) in query.date" :key="index" class="picker-item">{{item[1]}}</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view v-for="(item,index) in query.time" :key="index" class="picker-item">{{item[0]}}</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view v-for="(item,index) in query.floor" :key="index" class="picker-item">{{item[0]}}</view>
                    </picker-view-column>
                </picker-view>
                <view class="y-center">
                    <view class="a-btn a-btn-blue " @click="loadClassroom">搜索</view>
                </view>
            </view>
        </layout>

        <layout v-if="classrooms.show" :title="classrooms.build + '-' + classrooms.title">
            <view class="y-center a-flex-space-between border-box classroom-row">
                <view class="a-ml-5">教室</view>
                <view>本节课程</view>
                <view>下节课程</view>
            </view>
            <view class="a-hr"></view>
            <view v-for="item in classrooms.rooms" :key="item">
                <view class="y-center border-box classroom-row">
                    <view class="y-center">
                        <view class="a-dot" style="background: #4C98F7"></view>
                        <view>{{classrooms.build + "-" + item}}</view>
                    </view>
                    <view class="y-center">
                        <view class="a-dot" :style="{background: classrooms.now[item] ? '#FF5722' : '#009688'}"></view>
                        <view class="text-ellipsis">{{classrooms.now[item] ? classrooms.now[item].name : "无课"}}</view>
                    </view>
                    <view class="y-center">
                        <view class="a-dot" :style="{background: classrooms.next[item] ? '#FF5722' : '#009688'}"></view>
                        <view class="text-ellipsis">{{classrooms.next[item] ? classrooms.next[item].name : "无课"}}</view>
                    </view>
                </view>
                <view class="a-hr"></view>
            </view>
        </layout>

    </view>
</template>

<script>
    import {formatDate, safeDate} from "@/modules/datetime";
    export default {
        data: () => ({
            classrooms: {
                now: [],
                next: [],
                rooms: [],
                title: "",
                build: "",
                show: false,
            },
            search: {
                date: formatDate("yyyy/MM/dd"),
                time: "0102",
                floor: 1,
                campus: 1,
            },
            query: {
                index: [0, 0, 0],
                date: [],
                time: [],
                floor: []
            }
        }),
        created: function() {
            uni.$app.onload(() => {
                const date = this.getTimeArr();
                const time = [
                    ["12节", "0102", "12节(8:00-9:50)"],
                    ["34节", "0304", "34节(10:10-12:00)"],
                    ["56节", "0506", "56节(14:00-15:50)"],
                    ["78节", "0708", "78节(16:00-17:50)"],
                    ["9X节", "0910", "9X节(19:00-20:50)"],
                ];
                const floor = [
                    ["J1", "1", 1],
                    ["J3", "3", 1],
                    ["J5", "5", 1],
                    ["J7", "7", 1],
                    ["J14", "14", 1],
                    ["S1", "S1", 1],
                ];
                this.query.date = date;
                this.query.time = time;
                this.query.floor = floor;
            })
        },
        methods: {
            loadClassroom:function () {
                uni.setNavigationBarTitle({title: "加载中..."})
                setTimeout(() => this.loadClassroomSetTime(), 300);
            },
            loadClassroomSetTime: async function () {
                let res = await uni.$app.request({
                    load: 2,
                    throttle: true,
                    url: uni.$app.data.url + "/sw/classroom",
                    data: {
                        date: this.search.date,
                        series: this.search.time,
                        build: this.search.floor,
                        campus: this.search.campus,
                    },
                })
                let data = res.data.info;
                this.classrooms.rooms = data.rooms;
                this.classrooms.now = Object.create(null);
                this.classrooms.next = Object.create(null);
                data.now.forEach(v => {
                    const [_, key] = v.classroom.split("-").map(v => v >> 0);
                    this.classrooms.now[key] = v;
                });
                data.next.forEach(v => {
                    const [_, key] = v.classroom.split("-").map(v => v >> 0);
                    this.classrooms.next[key] = v;
                });
                this.classrooms.show = true;
                this.classrooms.title = this.query.time[this.query.index[1]][2];
                this.classrooms.build = this.query.floor[this.query.index[2]][0];
            },
            getTimeArr: function() {
                let weekShow = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
                let date = safeDate();
                let year = date.getFullYear();
                let queryDate = [];
                let week = safeDate().getDay();
                for (let i = 0; i < 7; ++i) {
                    let weekTemp = week + i;
                    let weekStr = formatDate("yyyy/MM/dd", date);
                    queryDate.push([weekStr, weekShow[weekTemp % 7]]);
                    date.addDate(0, 0, 1);
                }
                return queryDate;
            },
            bindPickerChange: function(e) {
                let [dataIndex, timeIndex, floorIndex] = e.detail.value;
                this.query.index = e.detail.value;
                this.search.date = this.query.date[dataIndex][0];
                this.search.time = this.query.time[timeIndex][1];
                this.search.floor = this.query.floor[floorIndex][1];
                this.search.campus = this.query.floor[floorIndex][2];
            }
        }
    }
</script>

<style scoped lang="scss">
    .picker-con{
        width: 77%;
        height: 100px;
    }
    .picker-item{
        line-height: 40px;
    }
    .classroom-row{
        color: $a-font-grey;
        margin: 10px 0;
    }
    .classroom-row > view{
        width: 33.33%;
    }
    .classroom-row .a-dot{
        flex: none;
    }
</style>
