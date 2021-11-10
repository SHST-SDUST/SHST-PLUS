import Vue from "vue";
import store from "./store";
import App from "./App.vue";
import mixin from "./vector/mixins";
import layout from "@/components/layout/layout.vue";

Vue.config.productionTip = false;

mixin.run();
Vue.component("layout", layout);

Vue.prototype.$store = store;

const app = new Vue({
    ...App,
    store,
});
app.$mount();
