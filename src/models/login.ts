import { PromiseFulfilled } from "@/modules/request";

export const login = (
    account: string,
    password: string,
    code: string
): Promise<
    PromiseFulfilled<{
        status: number;
        msg: string;
    }>
> => {
    return uni.$app.request({
        load: 3,
        // #ifdef MP-WEIXIN
        url: uni.$app.data.url + "/auth/login/1",
        // #endif
        // #ifdef MP-QQ
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-dupe-keys
        url: uni.$app.data.url + "/auth/login/2",
        // #endif
        method: "POST",
        throttle: true,
        data: {
            account,
            password,
            code,
        },
    });
};

export const getVerifyCode = (): Promise<
    PromiseFulfilled<{
        img: string;
    }>
> => {
    return uni.$app.request<{ img: string }>({
        url: uni.$app.data.url + "/auth/getVerifyCode",
    });
};
