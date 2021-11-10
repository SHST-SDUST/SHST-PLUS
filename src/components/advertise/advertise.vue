<template>
    <view>
        <!-- #ifdef MP-WEIXIN -->
        <!-- Funct -->
        <ad
            v-if="computedAdSelect === 1"
            unit-id="adunit-b82100ae7bddf4ad"
            class="adapt"
            @error="adError"
        ></ad>
        <!-- Native-Card-Video -->
        <ad-custom
            v-if="computedAdSelect === 2"
            class="adapt"
            unit-id="adunit-b9b2fd0e829c7388"
            @error="internalAdSelector = 9"
        ></ad-custom>
        <!-- Native-Banner -->
        <ad-custom
            v-if="computedAdSelect === 3"
            class="adapt"
            unit-id="adunit-8fcb99da029141d0"
            @error="internalAdSelector = 1"
        ></ad-custom>
        <!-- Native-Banner-Video -->
        <ad-custom
            v-if="computedAdSelect === 4"
            class="adapt"
            unit-id="adunit-281c97c91ba73fd7"
            @error="internalAdSelector = 3"
        ></ad-custom>
        <!-- Table -->
        <ad
            v-if="computedAdSelect === 5"
            unit-id="adunit-ce81890e6ff0b2a7"
            class="adapt"
            @error="adError"
        ></ad>
        <!-- Grade -->
        <ad
            v-if="computedAdSelect === 6"
            unit-id="adunit-31c347091893cf0c"
            class="adapt"
            @error="adError"
        ></ad>
        <!-- Video -->
        <ad
            v-if="computedAdSelect === 7"
            unit-id="adunit-d4a5485ea69b2794"
            ad-type="video"
            class="adapt"
            @error="adError"
        ></ad>
        <!-- Games -->
        <ad
            v-if="computedAdSelect === 8"
            unit-id="adunit-a0ca2792308b3673"
            ad-type="grid"
            grid-count="8"
            class="adapt"
            @error="adError"
        ></ad>
        <!-- Native-Card -->
        <ad-custom
            v-if="computedAdSelect === 9"
            class="adapt"
            unit-id="adunit-bbfcda67d60b25ac"
            @error="internalAdSelector = 1"
        ></ad-custom>
        <!-- #endif -->

        <!-- #ifdef MP-QQ -->
        <!-- Funct -->
        <ad
            v-if="internalAdSelector === 1"
            unit-id="001b7e7e765436c6351d8a6d693437d2"
            class="adapt"
            @error="adError"
        ></ad>
        <!-- Table -->
        <ad
            v-if="internalAdSelector === 2"
            unit-id="98766bd6a7f4cc14e978058a3a365551"
            class="adapt"
            @error="adError"
        ></ad>
        <!-- Grade -->
        <ad
            v-if="internalAdSelector === 3"
            unit-id="e40bef6dbe8ecaf7104fe126bfc34e56"
            class="adapt"
            @error="adError"
        ></ad>
        <!-- Card -->
        <ad
            v-if="internalAdSelector === 4"
            unit-id="e72775802b219a19e3709c61ab8ea055"
            type="card"
            class="adapt"
            @error="adError"
        ></ad>
        <!-- Feeds -->
        <ad
            v-if="internalAdSelector === 5"
            unit-id="df3806828cb2062f590597248d46fbb1"
            type="feeds"
            class="adapt"
            @error="adError"
        ></ad>
        <!-- #endif -->
    </view>
</template>

<script>
export default {
    name: "Advertise",
    props: {
        adSelect: {
            // 选择广告
            type: Number,
            default: 0,
        },
        compatible: {
            // 兼容
            type: Number,
            default: 1,
        },
    },
    data: function () {
        return {
            internalAdSelector: this.adSelect,
        };
    },
    computed: {
        // #ifdef MP-WEIXIN
        computedAdSelect: function () {
            /* 广告信息 */
            const sdkVersion = ~~uni.getSystemInfoSync().SDKVersion.replace(/\./g, "");
            if (sdkVersion < 299 && /[9234]/.test(this.internalAdSelector)) return this.compatible;
            else return this.internalAdSelector;
        },
        // #endif
    },
    created: function () {
        if (!this.adSelect) this.$emit("error");
    },
    methods: {
        adError: function () {
            this.$emit("error");
        },
    },
};
</script>

<style scoped>
.adapt {
    box-sizing: border-box;
}
</style>
