<template>
    <view>
        <layout title="修读情况">
            <view>
                <view class="unit y-center text-center a-lmt a-lmb">
                    <view>性质</view>
                    <view>要求</view>
                    <view>已修</view>
                    <view>未修</view>
                    <view>修读</view>
                </view>
                <view class="a-hr"></view>
            </view>
            <view v-for="(item, index) in list.credit" :key="index">
                <view class="unit y-center text-center a-lmt a-lmb">
                    <view>{{ item.type }}</view>
                    <view>{{ item.need }}</view>
                    <view>{{ item.finish }}</view>
                    <view>{{ item.undo }}</view>
                    <view>{{ item.doing }}</view>
                </view>
                <view class="a-hr"></view>
            </view>
        </layout>

        <layout title="公选模块">
            <view>
                <view class="unit y-center text-center a-lmt a-lmb">
                    <view>模块</view>
                    <view>要求</view>
                    <view>已修</view>
                    <view>未修</view>
                    <view>修读</view>
                </view>
                <view class="a-hr"></view>
            </view>
            <view v-for="(item, index) in list.typed" :key="index">
                <view class="unit y-center text-center a-lmt a-lmb">
                    <view>{{ item.type }}</view>
                    <view>{{ item.need }}</view>
                    <view>{{ item.finish }}</view>
                    <view>{{ item.undo }}</view>
                    <view>{{ item.doing }}</view>
                </view>
                <view class="a-hr"></view>
            </view>
        </layout>

        <layout title="修读详情">
            <view v-for="(item, index) in list.detail" :key="index">
                <view class="y-center a-lmt a-flex-none">
                    <view class="a-dot" :style="{ background: item.background }"></view>
                    <view class="text-ellipsis">{{ item.name }}</view>
                </view>
                <view class="y-center a-lmt a-lmb">
                    <view>代码: {{ item.no }}</view>
                    <view class="a-lml">学分: {{ item.credit }}</view>
                    <view class="a-lml">成绩: {{ item.grade }}</view>
                    <view class="a-lml">类型: {{ item.type }}</view>
                </view>
                <view class="a-hr"></view>
            </view>
        </layout>
    </view>
</template>

<script>
import { computeBackground } from "@/vector/pub-fct";
export default {
    components: {},
    filters: {},
    data: () => ({
        list: {
            credit: [],
            typed: [],
            detail: [],
        },
    }),
    computed: {},
    created: function () {
        uni.$app.onload(async () => {
            const res = await uni.$app.request({
                load: 3,
                url: this.$store.state.url + "/sw/CreditSituation",
            });
            computeBackground(res.data.info.detail, "name");
            this.list = res.data.info;
        });
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
.unit > view {
    flex: 1;
}
</style>
