<template>
    <view>
        <layout title="学习" color="#FF6347" inherit-color>
            <view class="y-center a-flex-space-around">
                <view class="icon" @click="jump('/pages/study/time-table/time-table', 1)">
                    <i class="iconfont icon-kebiao"></i>
                    <view>查课表</view>
                </view>
                <view class="icon" @click="jump('/pages/study/classroom/classroom', 1)">
                    <i class="iconfont icon-classroom"></i>
                    <view>查教室</view>
                </view>
                <view class="icon" @click="jump('/pages/study/grade/grade', 1)">
                    <i class="iconfont icon-grade"></i>
                    <view>查成绩</view>
                </view>
                <view class="icon" @click="jump('/pages/study/exam/exam', 1)">
                    <i class="iconfont icon-biji-copy"></i>
                    <view>考试安排</view>
                </view>
            </view>
        </layout>
        <layout title="信息" color="#3CB371" inherit-color>
            <view class="y-center a-flex-space-around">
                <view class="icon" @click="jump('/pages/study/comply-plan/comply-plan', 1)">
                    <i class="iconfont icon-jihua"></i>
                    <view>执行计划</view>
                </view>
                <view
                    class="icon"
                    @click="jump('/pages/study/credit-situation/credit-situation', 1)"
                >
                    <i class="iconfont icon-mc-wcqk"></i>
                    <view>完成情况</view>
                </view>
                <view class="icon" @click="jump('/pages/study/teach-book/teach-book', 1)">
                    <i class="iconfont icon-jiaofu-1"></i>
                    <view>教材信息</view>
                </view>
                <view class="icon" @click="jump('/pages/study/notice/notice', 1)">
                    <i class="iconfont icon-gonggao1"></i>
                    <view>校内公告</view>
                </view>
            </view>
        </layout>
    </view>
</template>

<script lang="ts">
import { formatDate } from "@/modules/datetime";
import { CCard } from "shst-campus";
import { Component, Vue } from "vue-property-decorator";
import { confirm } from "@/modules/toast";

@Component({
    components: { CCard },
})
export default class Funct extends Vue {
    public now: string = formatDate();

    public async jump(path: string, check: number): Promise<void> {
        if (check === 1 && this.$store.state.user !== 1) {
            const choice = await confirm("提示", "该功能需要绑定强智教务系统，是否前去绑定");
            if (choice) {
                this.nav("/pages/home/auxiliary/login?status=E");
            }
            return void 0;
        }
        this.nav(path);
    }
}
</script>

<style>
.icon {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px 0;
}

.icon view {
    color: #000000;
}

.iconfont {
    font-size: 27px;
    color: inherit !important;
    margin: 10px 0;
}
</style>
