<template>
    <view>
        <layout title="教材查询" top-space>
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

        <view v-if="books.show">
            <headslot :title="picker.select"></headslot>
            <view class="a-gap-10"></view>
            <layout v-if="books.tips">
                <view class="y-center">
                    <view class="a-dot a-background-grey"></view>
                    <view>{{ books.tips }}</view>
                </view>
            </layout>
            <view v-for="(item, index) in books.list" :key="index">
                <layout>
                    <view class="y-center a-fontsize-15">
                        <view class="a-dot" :style="{ background: item.background }"></view>
                        <view class="text-ellipsis">{{ item.book_name }}</view>
                    </view>
                    <view class="y-center a-fontsize-12 a-lmt a-color-grey">
                        <view>ISBN: {{ item.isbn }}</view>
                        <view class="a-lml">课程代码: {{ item.no }}</view>
                    </view>
                    <view class="y-center a-fontsize-12 a-lmt a-color-grey">
                        <view>作者: {{ item.author || "无" }}</view>
                        <view class="a-lml">出版社: {{ item.publisher || "无" }}</view>
                        <view class="a-lml">出版时间: {{ item.publish_time || "无" }}</view>
                    </view>
                    <view class="y-center a-fontsize-12 a-lmt a-color-grey">
                        <view>课程: {{ item.classname || "无" }}</view>
                        <view class="a-lml">类型: {{ item.type || "无" }}</view>
                        <view class="a-lml">班级订购: {{ item.nums }}</view>
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
        books: {
            list: [],
            tips: "",
            show: false,
        },
    }),
    created: function () {
        uni.$app.onload(() => {
            let [start, end, type] = this.$store.state.curTerm.split("-").map(v => v >> 0);
            if (type === 1) {
                type = 2;
            } else {
                type = 1;
                ++start;
                ++end;
            }
            this.picker.terms = generateTerms(end + 1, start + "-" + end + "-" + type);
            this.initBooks();
        });
    },
    methods: {
        bindPickerChange: function (e) {
            const index = e.detail.value;
            const term = this.picker.terms[index].value;
            const query = "/" + term;
            this.picker.select = this.picker.terms[index].show;
            this.picker.index = index;
            this.getBooksRemote(query);
        },
        initBooks: function () {
            const term = (this.picker.select = this.picker.terms[0].value);
            const query = "/" + term;
            this.getBooksRemote(query);
        },
        getBooksRemote: async function (query) {
            const res = await uni.$app.request({
                load: 2,
                throttle: true,
                url: this.$store.state.url + "/sw/teachBook" + query,
            });
            computeBackground(res.data.info, "book_name");
            this.books.list = res.data.info;
            this.books.tips = this.books.list.length ? "" : "暂无教材信息";
            this.books.show = true;
        },
    },
};
</script>

<style scoped></style>
