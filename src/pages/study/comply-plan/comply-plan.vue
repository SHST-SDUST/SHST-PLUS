<template>
    <view>
        <headslot title="执行计划"></headslot>
        <view class="a-gap-10"></view>
        <view v-for="(item, index) in plans" :key="index">
            <layout>
                <view class="y-center a-fontsize-15">
                    <view class="a-dot" :style="{ background: item.background }"></view>
                    <view class="text-ellipsis">{{ item.name }}</view>
                </view>
                <view class="y-center a-fontsize-12 a-lmt a-color-grey">
                    <view class="text-ellipsis">代码: {{ item.no }}</view>
                    <view class="a-lml">学时: {{ item.period }}</view>
                </view>
                <view class="y-center a-fontsize-12 a-lmt a-color-grey">
                    <view>类型: {{ item.type }}</view>
                    <view class="a-lml">学分: {{ item.credit }}</view>
                    <view class="a-lml">考察: {{ item.examine }}</view>
                </view>
                <view class="y-center a-fontsize-12 a-lmt a-color-grey">
                    <view>学期: {{ item.term }}</view>
                    <view class="a-lml">学院: {{ item.unit }}</view>
                </view>
            </layout>
        </view>
    </view>
</template>

<script>
import headslot from "@/components/headslot/headslot.vue";
import { computeBackground } from "@/vector/pub-fct";
export default {
    components: { headslot },
    filters: {},
    data: () => ({
        tips: "",
        plans: [],
    }),
    computed: {},
    created: function () {
        uni.$app.onload(async () => {
            const res = await uni.$app.request({
                load: 3,
                url: this.$store.state.url + "/sw/complyPlan",
            });
            computeBackground(res.data.info, "name");
            this.plans = res.data.info;
            this.tips = this.plans.length ? "" : "暂无执行计划";
        });
    },
    methods: {},
};
</script>

<style lang="scss" scoped></style>
