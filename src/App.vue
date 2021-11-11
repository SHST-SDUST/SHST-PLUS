<script lang="ts">
import dispose from "@/vector/dispose";
import log from "@/modules/realtime-log";

export default {
    globalData: {
        url: "https://www.example.com/",
    },
    onPageNotFound: (): void => {
        //处理404
        uni.reLaunch({
            url: "pages/system/not-found",
        });
    },
    onLaunch: function (): void {
        console.log("APP INIT ");
        dispose.onLaunch.apply(this); //启动加载事件
    },
    onError: (err: string): void => {
        // 避免无限递归调用
        try {
            log.error(err);
            console.log(err);
            dispose.toast("Internal Error");
        } catch (e) {
            console.log(e);
        }
    },
};
</script>

<style lang="scss">
@import "@/vector/resources/iconfont.css";
@import "@/vector/resources/asse.mini.css";
@import "@/components/shst-campus/styles/asse.css";
@import "@/components/shst-campus/styles/iconfont.css";
@import "@/components/shst-campus/styles/asse-style.scss";
button:after {
    border: none;
}
button {
    background: #fff;
    border: none;
    box-sizing: unset;
    padding: 0;
    margin: 0;
    color: inherit;
    font-size: inherit;
    line-height: unset;
    height: auto;
}
</style>
