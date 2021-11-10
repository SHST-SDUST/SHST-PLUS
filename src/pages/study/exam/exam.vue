<template>
    <view>
        <layout title="考试查询" top-space>
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

        <view v-if="exam.show">
            <headslot :title="picker.select"></headslot>
            <view class="a-gap-10"></view>
            <layout v-if="exam.tips">
                <view class="y-center">
                    <view class="a-dot a-background-grey"></view>
                    <view>{{ exam.tips }}</view>
                </view>
            </layout>
            <view v-for="(item, index) in exam.list" :key="index">
                <layout>
                    <view class="y-center a-fontsize-15">
                        <view class="a-dot" :style="{ background: item.background }"></view>
                        <view class="text-ellipsis">{{ item.name }}</view>
                    </view>
                    <view class="y-center a-fontsize-12 a-lmt a-color-grey">
                        <view class="text-ellipsis">课程代码: {{ item.no }}</view>
                        <view class="a-lml">教室: {{ item.classroom }}</view>
                        <view class="a-lml">位置: {{ item.location || "无" }}</view>
                    </view>
                    <view class="y-center a-fontsize-12 a-lmt a-color-grey">
                        <view>{{ item.time }}</view>
                    </view>
                </layout>
            </view>
        </view>
    </view>
</template>

<script>
import headslot from "@/components/headslot/headslot.vue";
import { generateTerms, computeBackground } from "@/vector/pub-fct";
export default {
    components: { headslot },
    data: () => ({
        picker: {
            index: 0,
            select: "",
            terms: [{ show: "请稍后", value: "" }],
        },
        exam: {
            list: [],
            tips: "",
            show: false,
        },
    }),
    created: function () {
        uni.$app.onload(() => {
            this.picker.terms = generateTerms();
            this.initExams();
        });
    },
    methods: {
        bindPickerChange: function (e) {
            const index = e.detail.value;
            const term = this.picker.terms[index].value;
            const query = "/" + term;
            this.picker.select = this.picker.terms[index].show;
            this.picker.index = index;
            this.getExamsRemote(query);
        },
        initExams: function () {
            const term = (this.picker.select = this.$store.state.curTerm);
            const query = "/" + term;
            this.getExamsRemote(query);
        },
        getExamsRemote: async function (query) {
            const res = await uni.$app.request({
                load: 2,
                throttle: true,
                url: this.$store.state.url + "/sw/exam" + query,
            });
            computeBackground(res.data.info, "name");
            this.exam.list = res.data.info;
            this.exam.tips = this.exam.list.length ? "" : "暂无考试信息";
            this.exam.show = true;
        },
    },
};
</script>

<style scoped></style>
