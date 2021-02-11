import store from "@/store/index";
import {toast} from "@/modules/toast";
import {extend} from  "@/modules/copy";
import request from "@/modules/request";
import storage from "@/modules/storage";
import {methods} from "@/vector/mixins";
import {data} from "@/modules/global-data";
import eventBus from "@/modules/event-bus";
import {extDate} from "@/modules/datetime";
import {getCurWeek} from  "@/vector/pub-fct";
import {checkUpdate} from  "@/modules/update";
import {throttleGenerater} from "@/modules/operate-limit";

function disposeApp($app){
    extDate(); //拓展Date原型
    checkUpdate(); // 检查更新
    uni.$app = $app.$scope;
    $app.$scope.toast = toast;
    $app.$scope.extend = extend;
    $app.data = $app.globalData;
    $app.$scope.data = $app.data;
    $app.$scope.eventBus = eventBus;
    $app.$scope.extend($app.data, data);
    $app.$scope.extend($app.$scope, request);
    $app.data.colorN = $app.data.colorList.length;
    $app.$scope.reInitApp = initAppData.bind($app);
    $app.$scope.throttle = new throttleGenerater();
    $app.data.curWeek = getCurWeek($app.data.curTermStart);
    $app.$scope.onload = (funct, ...args) => {
        if(store.state.openid) funct(...args);
        else $app.$scope.eventBus.once("LoginEvent", funct);
    }
}

function initAppData(){
    let $app = this;
    let user = storage.get("user") || {};
    uni.login({
        // #ifdef MP-WEIXIN
        provider: "weixin",
        // #endif
        // #ifdef MP-QQ
        provider: "qq",
        // #endif
    }).then((data) => {
        let [err,res] = data;
        if(err) return Promise.reject(err);
        return $app.$scope.request({
            load: 3,
            title: "登录中",
            // #ifdef MP-WEIXIN
            url: $app.data.url + "/auth/wx",
            // #endif
            // #ifdef MP-QQ
            url: $app.data.url + "/auth/QQ",
            // #endif
            method: "POST",
            data: {
                code: res.code,
                user: user.account ? 1 : 0,
                account: user.account || null,
                password: user.password || null
            }
        })
    }).then((res) => {
        /* 判断是否正常初始化 */
        const response = res.data;
        if (!response || !response.initData || !response.initData.curTerm) return Promise.reject("DATA INIT FAIL");

        /* 初始化全局信息 */
        store.commit("setInitData", response.initData);

        /* 自定义配色 */
        if($app.data.initData.custom){
            let custom = $app.data.initData.custom;
            if(custom.color_list) store.commit("setColorList", {colorList: JSON.parse(custom.color_list)});
        }

        /* OPENID 用户使用信息 1 已注册用户  2 未注册用户*/
        console.log("SetOpenid:", response.openid);
        console.log("Status:", response.status === 1 ? "User Login" : "New user");
        store.commit("setUserStatus", response);
        response.status === 3 && response.msg && toast(response.msg, 500).then(() => methods.nav("/pages/home/login/login"));

        /* dot */
        const notify = response.initData.tips;
        const point = storage.get("point");
        if (point !== notify) uni.showTabBarRedDot({ index: 2 });

        /* 处理弹出式公告 */
        const popup = response.initData.popup;
        const popupCache = storage.get("popup");
        if(popupCache !== popup.serial && popup.popup) {
            uni.showModal({
                title: "公告",
                confirmText: popup.path ? "立即查看" : "确认",
                cancelText: "下次查看",
                content: popup.popup,
                success: (res) => {
                    if(res.confirm) {
                        storage.setPromise("popup", popup.serial);
                        // #ifdef MP-WEIXIN
                        if(popup.path) methods.nav(popup.path, "webview");
                        // #endif
                        // #ifndef MP-WEIXIN
                        if(popup.path) methods.copy(popup.path);
                        // #endif
                    }
                }
            })
        }

        /* resolve */
        return Promise.resolve(res);
    }).then((res) => {
        $app.$scope.eventBus.commit("LoginEvent", res);
    }).catch((err) => {
        console.log(err);
        uni.showModal({
            title: "警告",
            content: "数据初始化失败,点击确定重新初始化数据",
            showCancel: false,
            success: (res) => initAppData.apply($app)
        })
    })
}

/**
 * APP启动事件
 */
function onLaunch() {
    disposeApp(this);
    initAppData.apply(this);
}

export default {onLaunch, toast}
