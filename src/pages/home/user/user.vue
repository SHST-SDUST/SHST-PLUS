<template>
    <view>
        <layout>
            <view class="x-center">
                <image
                    class="img"
                    src="http://dev.shst.touchczy.top/public/static/img/SDUST.jpg"
                ></image>
            </view>

            <view class="user-info-con">
                <view class="unit-info top">
                    <view>学号</view>
                    <view>{{ user.account }}</view>
                </view>
                <view class="unit-info">
                    <view>姓名</view>
                    <view>{{ user.name }}</view>
                </view>
                <view class="unit-info">
                    <view>学院</view>
                    <view>{{ user.academy }}</view>
                </view>
                <!-- #ifdef MP-WEIXIN -->
                <view class="a-hide" :class="{ 'a-show': today > '2020-09-01' }">
                    <view class="unit-info" @click="copy('722942376')">
                        <view>QQ群</view>
                        <view>722942376</view>
                    </view>
                </view>
                <!-- #endif -->
                <!-- #ifdef MP-QQ -->
                <button open-type="openGroupProfile" class="unit-info" group-id="722942376">
                    <view>QQ群</view>
                    <view>722942376</view>
                </button>
                <!-- #endif -->
                <view class="unit-info" @click="jumpUpdate('/pages/user/announce/announce')">
                    <view class="a-flex">
                        <view>公告</view>
                        <view
                            :style="{ 'background': 'green', 'display': point }"
                            class="point"
                        ></view>
                    </view>
                    <view class="iconfont icon-arrow-right"></view>
                </view>
                <!-- #ifdef MP-WEIXIN -->
                <view class="unit-info" @click="nav('/pages/user/reward/reward')">
                    <view class="a-flex">赞赏</view>
                    <view class="iconfont icon-arrow-right"></view>
                </view>
                <!-- #endif -->
                <!-- #ifdef MP-QQ -->
                <view class="unit-info" @click="nav('/pages/user/reward/reward-list')">
                    <view class="a-flex">
                        <view>赞赏</view>
                    </view>
                    <view class="iconfont icon-arrow-right"></view>
                </view>
                <!-- #endif -->
                <view class="unit-info" @click="nav('/pages/user/about/about')">
                    <view>关于</view>
                    <view class="iconfont icon-arrow-right"></view>
                </view>
                <view
                    class="a-btn a-btn-orange a-btn-large btn-full"
                    @click="nav('/pages/home/login/login?status=1')"
                >
                    注销
                </view>
            </view>
        </layout>
    </view>
</template>

<script>
import util from "@/modules/datetime";
import storage from "@/modules/storage";
export default {
    data: () => ({
        user: {
            academy: "游客",
            name: "游客",
            account: "游客",
        },
        point: "none",
        today: util.formatDate(),
    }),
    created: function () {
        uni.$app.onload(async () => {
            storage.getPromise("point").then(data => {
                if (data !== this.$store.state.point) this.point = "block";
            });
            if (this.$store.state.user === 0) return void 0;
            const user = await storage.getPromise("user-info");
            if (user && user.account) {
                console.log("GET USERINFO FROM CACHE");
                this.user = user;
            } else {
                console.log("GET USERINFO FROM REMOTE");
                const res = await uni.$app.request({
                    load: 1,
                    throttle: true,
                    url: this.$store.state.url + "/sw/userInfo",
                });
                storage.setPromise("user-info", res.data.info);
                this.user = res.data.info;
            }
        });
    },
    methods: {
        jumpUpdate: function (url) {
            this.point = "none";
            if (uni.hideTabBarRedDot) uni.hideTabBarRedDot({ index: 2 });
            this.nav(url);
        },
    },
};
</script>

<style scoped>
.img {
    width: 230px;
    height: 80px;
    margin: 20px 0 30px 0;
}
.user-info-con {
    padding: 10px;
}

.user-info-con > .top {
    border-top: 1px solid #eee;
}

.unit-info {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
}

.point {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    align-self: center;
    margin-left: 8px;
}

.btn-full {
    width: 100%;
    margin: 18px 0 0 0;
    box-sizing: border-box;
}
</style>
