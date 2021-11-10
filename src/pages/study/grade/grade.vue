<template>
    <view>
        <layout title="查成绩" top-space>
            <view class="a-flex-space-between a-pb-5 a-pt-5">
                <view>请选择学期</view>
                <picker
                    :value="picker.index"
                    :range="picker.terms"
                    class="a-link"
                    range-key="show"
                    @change="bindPickerChange"
                >
                    <view>{{ picker.terms[picker.index].show }}</view>
                </picker>
            </view>
        </layout>

        <view v-if="grade.show">
            <headslot :title="picker.select">
                <view class="y-center a-flex-warp a-fontsize-13">
                    <view class="y-center">
                        <view class="a-dot a-background-blue"></view>
                        <view>学分:{{ grade.credit }}</view>
                    </view>
                    <view class="y-center">
                        <view class="a-dot a-background-purple"></view>
                        <view>绩点:{{ grade.gpa }}</view>
                    </view>
                    <view class="y-center a-mr-5">
                        <view class="a-dot a-background-light-orange"></view>
                        <view>加权:{{ grade.weighted }}</view>
                    </view>
                </view>
            </headslot>
            <view class="a-gap-10"></view>
            <layout v-if="grade.tips">
                <view class="y-center">
                    <view class="a-dot a-background-grey"></view>
                    <view>{{ grade.tips }}</view>
                </view>
            </layout>
            <view v-for="(item, index) in grade.list" :key="index">
                <layout>
                    <view class="y-center a-fontsize-15">
                        <view class="a-dot" :style="{ background: item.background }"></view>
                        <view class="text-ellipsis">{{ item.name }}</view>
                    </view>
                    <view class="y-center a-fontsize-12 a-lmt a-color-grey">
                        <view class="text-ellipsis">课程代码: {{ item.no }}</view>
                        <view class="a-lml">类型: {{ item.type }}</view>
                    </view>
                    <view class="y-center a-fontsize-12 a-lmt a-color-grey">
                        <view>成绩: {{ item.grade }}</view>
                        <view class="a-lml">补考: {{ item.makeup || "无" }}</view>
                        <view class="a-lml">重修: {{ item.rebuild || "无" }}</view>
                        <view class="a-lml">绩点: {{ item.gpa }}</view>
                        <view class="a-lml">学分: {{ item.credit }}</view>
                    </view>
                </layout>
            </view>

            <layout v-if="ad.show">
                <!-- #ifdef MP-WEIXIN -->
                <advertise
                    :ad-select="ad.select"
                    :compatible="6"
                    @error="ad.show = false"
                ></advertise>
                <!-- #endif -->
                <!-- #ifdef MP-QQ -->
                <advertise :ad-select="ad.select" @error="ad.show = false"></advertise>
                <!-- #endif -->
            </layout>
        </view>
    </view>
</template>

<script>
import { generateTerms, computeBackground } from "@/vector/pub-fct";
import headslot from "@/components/headslot/headslot.vue";
import advertise from "@/components/advertise/advertise.vue";
export default {
    components: { headslot, advertise },
    data: () => ({
        picker: {
            index: 1,
            select: "",
            terms: [{}, { show: "请稍后", value: "" }],
        },
        grade: {
            credit: 0,
            gpa: 0,
            weighted: 0,
            list: [],
            show: false,
            tips: "",
        },
        ad: {
            show: false,
            select: 0,
        },
    }),
    created: function () {
        uni.$app.onload(() => {
            this.ad.select = this.$store.state.initData.adSelect.grade;
            const terms = generateTerms();
            terms.unshift({ show: "全部学期", value: "" });
            this.picker.terms = terms;
            this.initGrade();
        });
    },
    methods: {
        bindPickerChange: function (e) {
            const index = e.detail.value;
            console.log(this.picker.terms[index].value);
            const stuYear = this.picker.terms[index].value;
            const query = stuYear === "" ? "" : "/" + stuYear;
            this.picker.select = this.picker.terms[index].show;
            this.picker.index = index;
            this.getGradeRemote(query);
        },
        initGrade: function () {
            const stuYear = (this.picker.select = this.$store.state.curTerm);
            const query = stuYear === "" ? "" : "/" + stuYear;
            this.getGradeRemote(query);
        },
        getGradeRemote: async function (query) {
            const res = await uni.$app.request({
                load: 2,
                throttle: true,
                url: this.$store.state.url + "/sw/grade" + query,
            });
            let creditTmp = 0;
            let gpaTmp = 0;
            let weightedTmp = 0;
            let counter = 0;
            res.data.info.forEach(v => {
                v.background = computeBackground(v.name);
                if (v.type === "公选") return void 0;
                creditTmp += parseFloat(v.credit);
                gpaTmp += parseFloat(v.gpa);
                weightedTmp += parseFloat(v.gpa) * parseFloat(v.credit);
                ++counter;
            });
            this.grade.credit = creditTmp;
            this.grade.gpa = (gpaTmp / counter).toFixed(2);
            this.grade.weighted = (weightedTmp / creditTmp).toFixed(2);
            this.grade.list = res.data.info;
            this.grade.tips = this.grade.list.length ? "" : "暂无成绩信息";
            this.ad.show = this.grade.list.length >= 3 ? true : false;
            this.grade.show = true;
        },
    },
};
</script>

<style scoped></style>
