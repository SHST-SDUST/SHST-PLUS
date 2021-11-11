<template>
    <view>
        <view class="x-center">
            <image
                class="img"
                src="http://dev.shst.touchczy.top/public/static/img/SDUST.jpg"
            ></image>
        </view>

        <view>
            <view class="input-con">
                <view class="input-view y-center x-full">
                    <i class="iconfont icon-account"></i>
                    <input
                        v-model="account.name"
                        class="a-input x-full"
                        name="account"
                        placeholder="账号"
                        type="number"
                    />
                </view>
                <view class="input-view y-center x-full a-lmt">
                    <i class="iconfont icon-password"></i>
                    <input
                        v-model="account.password"
                        class="a-input x-full"
                        name="password"
                        placeholder="密码"
                        :password="info.hidePassword"
                    />
                    <switch @change="info.hidePassword = !info.hidePassword"></switch>
                </view>
                <view class="input-view y-center x-full a-lmt">
                    <i class="iconfont icon-tupian"></i>
                    <input
                        v-model="account.code"
                        class="a-input x-full"
                        name="code"
                        placeholder="验证码"
                    />
                    <image
                        :src="'data:image/jpg;base64,' + info.codeImgBase64"
                        class="verify-code"
                        @click="getVerifyCode"
                    ></image>
                </view>
            </view>
            <view class="a-flex a-lmt">
                <view class="a-btn a-btn-blue a-btn-large a-lmt a-flex-full" @click="enter()">
                    登录
                </view>
            </view>
        </view>
        <view class="tips a-flex-space-between">
            <view>请输入强智系统账号密码</view>
        </view>
        <view class="status a-lmt">{{ info.status }}</view>
        <view v-if="info.resetApp" class="status a-lmt" @click="reStartApp()">
            初始化信息失败 点我重载小程序
        </view>

        <view class="prompt">
            <view>提示：</view>
            <view>1. 账号密码与强智教务系统账号密码保持一致。</view>
            <view>
                <text decode>
                    2. 长时间未操作小程序会断开链接，如果一直出现External
                    Error或者信息初始化失败请&nbsp;&nbsp;
                </text>
                <text decode class="l-lml a-link" @click="reStartApp()">点我重载小程序</text>
                <text>。</text>
            </view>
            <view>
                3.
                由于强智教务系统只对本科生开放，研究生暂时无法登录，目前仅青岛校区与济南校区可用。
            </view>
            <view>4. 山科小站系个人业余开发项目，所提供的数据仅供参考，一切以教务系统为准。</view>
        </view>
    </view>
</template>

<script lang="ts">
import storage from "@/modules/storage";
import { confirm } from "@/modules/toast";
import { Component, Vue } from "vue-property-decorator";
import { getVerifyCode, login } from "@/models/login";

@Component
export default class Login extends Vue {
    protected account = {
        name: "",
        password: "",
        code: "",
    };
    protected info = {
        codeImgBase64: "",
        status: "",
        resetApp: false,
        hidePassword: true,
    };
    protected created(): void {
        uni.$app.onload(() => {
            storage.getPromise<{ account: string; password: string }>("user").then(res => {
                if (res && res.account && res.password) {
                    this.account.name = res.account;
                    this.account.password = res.password;
                }
            });
            this.getVerifyCode();
        });
    }
    async enter(): Promise<void> {
        if (this.account.name.length == 0 || this.account.password.length == 0) {
            uni.$app.toast("用户名和密码不能为空");
            return void 0;
        }
        if (this.account.code.length != 4) {
            uni.$app.toast("验证码必须为4位");
            return void 0;
        }
        const res = await login(this.account.name, this.account.password, this.account.code);
        if (res.data.status === 1) {
            storage
                .setPromise("user", {
                    account: this.account.name,
                    password: this.account.password,
                })
                .then(() => {
                    this.$store.commit("login");
                    this.nav("/pages/home/tips/tips", "tab");
                });
        } else if (res.data.status === 2) {
            this.info.status = res.data.msg;
            uni.$app.toast(res.data.msg);
        } else if (res.data.status === 3) {
            this.info.resetApp = true;
            uni.$app.toast(res.data.msg);
        }
    }
    async reStartApp(): Promise<void> {
        const choice = await confirm("提示", "确定要重载小程序吗？");
        if (choice) {
            this.$store.commit("clearOpenid");
            uni.$app.reInitApp();
            this.nav("/pages/home/tips/tips", "tab");
        }
    }
    getVerifyCode(): void {
        uni.$app.throttle(500, async () => {
            const res = await getVerifyCode();
            this.info.codeImgBase64 = res.data.img;
            this.account.code = res.data.code;
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onShareAppMessage(): void {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onShareTimeline(): void {}
}
</script>

<style>
page {
    background: #ffffff;
}
.img {
    width: 230px;
    height: 80px;
    margin: 20px 0 30px 0;
}
.input-con {
    margin-top: 23px;
}
.input-view {
    border-bottom: 1px solid #eee;
    margin-top: 5px;
}
.tips {
    margin: 10px 0 0 3px;
    font-size: 13px;
    color: #79b2f9;
}
.input-view i {
    color: #aaa;
    margin: 0 4px 0 8px;
    align-self: center;
}
.a-input {
    border: none;
    margin: 7px 0;
}
.status {
    color: red;
    font-size: 13px;
    margin-left: 3px;
}
.prompt {
    margin: 20px 0 0 3px;
    font-size: 13px;
    color: #666;
    line-height: 27px;
}
switch {
    zoom: 0.8;
}

.verify-code {
    height: 22px;
    width: 62px;
}
</style>
