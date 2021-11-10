import Vue from "vue";
import Vuex from "vuex";
import { data } from "@/modules/global-data";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: data,
    getters: {},
    mutations: {
        /* 初始化状态的处理 */
        setInitData: function (state, payload) {
            state.initData = payload;
            state.point = payload.tips;
            state.curWeek = payload.curWeek;
            state.curTerm = payload.curTerm;
            state.curTermStart = payload.termStart;
        },
        setUserStatus: function (state, payload) {
            state.openid = payload.openid;
            state.user = payload.status === 1 ? 1 : 0;
        },
        setColorList: function (state, payload) {
            state.colorN = payload.colorN;
            state.colorList = payload.colorList;
        },
        /* 登录注销的处理 */
        login: state => (state.user = 1),
        logout: state => (state.user = 0),
        clearOpenid: state => (state.openid = ""),
    },
    actions: {},
});

export default store;
