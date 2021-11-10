<template>
    <view>
        <view class="head-line" :style="{ height: titleHeight ? titleHeight + 'px' : 'auto' }">
            <view class="head-left">
                <view class="head-row" :style="{ 'background-color': color }"></view>
                <view class="head-title">{{ title }}</view>
            </view>
            <view style="margin-top: 3px">
                <slot></slot>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    name: "Headslot",
    props: {
        title: {
            type: String,
        },
        color: {
            type: String,
            default: "#79B2F9",
        },
        titleHeight: {
            type: [String, Number],
            default: "",
        },
    },
    methods: {},
};
</script>
<style>
.head-line {
    background-color: #ffffff;
    padding: 10px 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    justify-content: space-between;
}
.head-row {
    width: 2px;
    margin: 2px 5px;
}
.head-left {
    display: flex;
    justify-content: center;
}
.head-title {
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
}
</style>
