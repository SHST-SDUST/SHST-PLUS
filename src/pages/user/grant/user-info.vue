<template>
    <view class="a-mt-15">
        <view class="a-x-center">
            <open-data class="avatar a-ml" type="userAvatarUrl"></open-data>
        </view>
        <view class="a-x-center a-lmt">
            <open-data class="a-ml a-color-grey" type="userNickName"></open-data>
        </view>
        <view class="a-x-center">
            <grant-button
                class="a-flex-full"
                class-name="a-btn a-btn-large a-btn-blue a-flex-full"
                text="授权用户信息"
                desc="请求作为新鲜事展示信息"
                @submit="submit"
            ></grant-button>
        </view>
    </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GrantButton from "@/components/grant-button/grant-button.vue";

@Component({
    components: { GrantButton },
})
export default class UserInfo extends Vue {
    protected submit(userInfo: { nickName: string; avatarUrl: string }): void {
        const data = {
            nick_name: userInfo.nickName,
            avatar_url: userInfo.avatarUrl,
        };
        uni.$app
            .request({
                load: 2,
                url: uni.$app.data.url + "/news/my/grantUserInfo",
                method: "POST",
                data,
            })
            .then(() => {
                uni.$app.toast("授权成功", 1000).then(() => {
                    this.nav("", "back");
                });
            });
    }
}
</script>

<style scoped>
.avatar {
    display: block;
    width: 50px;
    height: 50px;
    overflow: hidden;
    border-radius: 50%;
}
</style>
