<template>
    <web-view :src="url"></web-view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class News extends Vue {
    protected url = "";

    created(): void {
        const sid = uni.$app.request.headers.cookie?.split(";")[0].split("=")[1];
        if (process.env.NODE_ENV === "development") {
            this.url = "http://dev.shstplus.touchczy.top/news/index?sid=" + sid;
        } else {
            this.url = "https://shstplus.touchczy.top/news/index?sid=" + sid;
        }
    }
}
</script>

<style></style>
