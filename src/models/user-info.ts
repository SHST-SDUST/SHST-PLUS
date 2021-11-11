import { PromiseResponse } from "@/modules/request";

export const fetchUserInfo = (): PromiseResponse<{
    info: {
        account: string;
        name: string;
        academy: string;
    };
}> => {
    return uni.$app.request({
        load: 1,
        throttle: true,
        url: uni.$app.data.url + "/sw/userInfo",
    });
};
