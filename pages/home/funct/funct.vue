<template>
    <view>

        <layout title="学习" color="#FF6347" inherit-color>
            <view class="y-center a-flex-space-around">
                <view class="y-center">
                    <view class="icon" @click="jump('/pages/study/time-table/time-table', 1)">
                        <i class="iconfont icon-kebiao"></i>
                        <view>查课表</view>
                    </view>
                </view>
                <view class="y-center">
                    <view class="icon"  @click="jump('/pages/study/classroom/classroom', 1)">
                        <i class="iconfont icon-classroom"></i>
                        <view>查教室</view>
                    </view>
                </view>
            </view>
        </layout>
    </view>
</template>

<script>
    import {formatDate} from "@/modules/datetime";
    import advertise from "@/components/advertise/advertise.vue";
    export default {
        components:{ advertise },
        data: () => ({
            adShow: true,
            now: formatDate(),
            adSelect: 0
        }),
        created: function(){
            uni.$app.onload(() => {
                this.adSelect = this.$store.state.initData.adSelect;
            })
        },
        methods: {
            jump: async function(path, check) {
                if (check === 1 && this.$store.state.user !== 1) {
                    let [err, choice] = await uni.showModal({
                        title: "提示",
                        content: "该功能需要绑定强智教务系统，是否前去绑定",
                    })
                    if (choice.confirm) {
                        this.nav("/pages/home/auxiliary/login");
                    }
                    return void 0;
                }
                this.nav(path);
            }
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
