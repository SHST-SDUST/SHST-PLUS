<template>
    <view>
        <layout :top-space="true">
            <view class="swiper-con">
                <swiper :indicator-dots="true" :interval="5000" :duration="1000" autoplay circular>
                    <swiper-item
                        v-for="item in swiper"
                        :key="item.img"
                        class="x-center y-center"
                        @click="articleJump(item.url)"
                    >
                        <image class="x-full" mode="aspectFill" :src="item.img" lazy-load></image>
                    </swiper-item>
                    <swiper-item v-if="ad.show" class="x-center y-center">
                        <!-- #ifdef MP-WEIXIN -->
                        <advertise
                            class="x-full"
                            :ad-select="adSelect"
                            @error="ad.show = false"
                        ></advertise>
                        <!-- #endif -->
                        <!-- #ifdef MP-QQ -->
                        <advertise
                            class="x-full"
                            :ad-select="adSelect"
                            @error="ad.show = false"
                        ></advertise>
                        <!-- #endif -->
                    </swiper-item>
                </swiper>
            </view>
        </layout>

        <layout :top-space="true" :title="today">
            <view slot="headslot">
                <view class="y-center">
                    <view class="iconfont icon-shuaxin icon refresh" @click="refresh"></view>
                    <button open-type="share" class="iconfont icon-fenxiang icon btn"></button>
                </view>
            </view>
            <weather />
        </layout>

        <layout title="系统公告">
            <view class="article-con text-ellipsis" @click="articleJump(article.url)">
                <i class="iconfont icon-gonggao icon"></i>
                <rich-text class="a-link" :nodes="article.name"></rich-text>
            </view>
            <navigator
                url="/pages/user/announce/announce"
                open-type="navigate"
                class="article-con text-ellipsis"
                hover-class="none"
            >
                <i class="iconfont icon-gonggao icon"></i>
                <text class="a-link">更多公告...</text>
            </navigator>
        </layout>

        <layout title="今日课程">
            <view v-for="(item, index) in table.list" :key="index">
                <view class="unit-table">
                    <view class="y-center a-mr a-mt">
                        <view class="a-dot" :style="{ 'background': item.background }"></view>
                        <view class="a-lmr">
                            第{{ 2 * item.serial - 1 }}{{ 2 * item.serial }}节
                        </view>
                        <view>{{ item.teacher }}</view>
                        <view class="a-ml">{{ item.ext }}</view>
                    </view>
                    <view class="y-center a-lmt a-mb">
                        <view class="a-ml a-lmr">{{ item.className }}</view>
                        <view>{{ item.classRoom }}</view>
                    </view>
                </view>
            </view>
            <view v-if="table.tips" class="unit-table" @click="bindSW">
                <view class="y-center a-mt a-mr">
                    <view class="a-dot" style="background: #eee"></view>
                    <view>{{ table.tips }}</view>
                </view>
                <view class="a-lmt a-mb a-ml a-mr">{{ table.info }}</view>
            </view>
        </layout>
        <layout title="每日一句">
            <sentence />
        </layout>
    </view>
</template>

<script lang="ts">
import storage from "@/modules/storage";
import { formatDate } from "@/modules/datetime";
import { ClassItem, fetchTimeTable, TableCache, tableDispose } from "@/models/table-item";
import weather from "@/components/weather/weather.vue";
import sentence from "@/components/sentence/sentence.vue";
import advertise from "@/components/advertise/advertise.vue";
import { Component, Vue } from "vue-property-decorator";
import { DefinedTableItem } from "@/components/shst-campus/types/time-table";
@Component({
    components: { weather, sentence, advertise },
})
export default class Tips extends Vue {
    protected swiper: { img: string; url: string }[] = [];
    protected table: { list: DefinedTableItem[]; tips: string; info: string } = {
        list: [],
        tips: "数据加载中",
        info: "数据加载中",
    };
    protected article = {
        name: "",
        url: "",
    };
    protected ad = {
        show: false,
        select: 0,
    };
    protected today = formatDate("yyyy-MM-dd K");

    protected created(): void {
        uni.$app.onload(() => {
            this.swiper = this.$store.state.initData.ads;
            this.article.name = this.$store.state.initData.articleName;
            this.article.url = this.$store.state.initData.articleUrl;
            this.ad.select = this.$store.state.initData.adSelect.tips;
            this.ad.show = false;
            this.getTable();
            if (!this.$store.state.user) {
                this.table.tips = "点我前去绑定教务系统账号";
                this.table.info = "绑定强智教务系统就可以使用山科小站咯";
            }
        });
        uni.$app.eventBus.on("RefreshTable", this.getRemoteTable);
    }

    protected beforeDestroy(): void {
        uni.$app.eventBus.off("RefreshTable", this.getRemoteTable);
    }

    protected getTable(): void {
        const tableCache = <TableCache>storage.get("tables") || {};
        if (tableCache.term === this.$store.state.curTerm) {
            console.log("GET TABLE FROM CACHE");
            const tables = tableDispose(tableCache.classes || [], true);
            this.tipsDispose(tables);
        } else {
            this.getRemoteTable();
        }
    }
    protected async getRemoteTable(load = 1): Promise<void> {
        console.log("GET TABLE FROM REMOTE");
        const res = await fetchTimeTable(
            this.$store.state.url + "/sw/table",
            this.$store.state.curWeek,
            this.$store.state.curTerm,
            load
        );
        if (res.data.status) {
            const tables = tableDispose(res.data.info, true);
            this.tipsDispose(tables);
            storage.setPromise("tables", {
                term: this.$store.state.curTerm,
                classes: res.data.info,
            });
        } else {
            uni.$app.toast("课表加载失败了");
            this.table.tips = "加载失败";
            this.table.info = "加载失败了，重新登录试一下";
        }
    }

    protected tipsDispose(info: ClassItem[]): void {
        if (!this.$store.state.user) return void 0;
        this.table.list = info ? info.sort((a, b) => a.serial - b.serial) : [];
        this.table.tips = this.table.list.length ? "" : "No Class Today";
        this.table.info = this.table.list.length ? "" : "今天没有课，快去自习室学习吧";
    }

    protected refresh(): void {
        storage.set("table", { term: this.$store.state.curTerm, classes: [] });
        this.getRemoteTable(2);
    }

    protected articleJump(url: string): void {
        // #ifdef MP-WEIXIN
        this.nav(url, "webview");
        // #endif
        // #ifndef MP-WEIXIN
        this.copy(url);
        // #endif
    }

    protected bindSW(): void {
        !this.$store.state.user && this.nav("/pages/home/login/login");
    }
}
</script>

<style scoped>
.article-con {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eeeeee;
}

.icon {
    padding: 0 5px;
    align-self: flex-end;
    color: #aaa;
    margin-right: 5px;
}

.unit-todo,
.unit-table {
    border-bottom: 1px solid #eeeeee;
    padding: 5px;
    color: #555555;
}

.refresh {
    font-size: 15px;
    padding-bottom: 1px;
    padding-right: 4px;
}

.set-status {
    color: #555555;
    border: 1px solid #eeeeee;
    padding: 7px;
    border-radius: 20px;
}

.swiper-con {
    height: 170px;
    border-radius: 3px;
    overflow: hidden;
    box-sizing: border-box;
}
.swiper-con > swiper {
    height: inherit;
}
</style>
