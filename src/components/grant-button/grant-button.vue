<template>
    <view class="a-flex a-lmt">
        <view v-if="compatibleUserInfo" :class="className" @click="getUserInfoProfile">
            {{ text }}
        </view>
        <button v-else :class="className" open-type="getUserInfo" @getuserinfo="getUserInfo">
            {{ text }}
        </button>
    </view>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component
export default class GrantButton extends Vue {
    @Prop({ type: String, required: true })
    text!: string;
    @Prop({ type: String, required: true })
    desc!: string;
    @Prop({ type: String, default: "" })
    className!: boolean;
    protected compatibleUserInfo = true;

    created(): void {
        if (!uni.getUserProfile) this.compatibleUserInfo = false;
    }

    getUserInfo(event: {
        detail: { errMsg: string; userInfo: { nickName: string; avatarUrl: string } };
    }): void {
        if (!event.detail.errMsg.toLowerCase().includes("ok")) {
            uni.$app.toast("授权失败");
            return void 0;
        }
        this.$emit("submit", event.detail.userInfo);
    }
    getUserInfoProfile(): void {
        uni.getUserProfile({
            desc: this.desc,
            success: res => {
                this.$emit("submit", res.userInfo);
            },
            fail: () => {
                uni.$app.toast("授权失败");
            },
        });
    }
}
</script>

<style></style>
