const plugins = [];

if (process.env.UNI_OPT_TREESHAKINGNG) {
    plugins.push(
        require("@dcloudio/vue-cli-plugin-uni-optimize/packages/babel-plugin-uni-api/index.js")
    );
}

if (
    (process.env.UNI_PLATFORM === "app-plus" && process.env.UNI_USING_V8) ||
    (process.env.UNI_PLATFORM === "h5" && process.env.UNI_H5_BROWSER === "builtin")
) {
    const path = require("path");

    const isWin = /^win/.test(process.platform);

    const normalizePath = path => (isWin ? path.replace(/\\/g, "/") : path);

    const input = normalizePath(process.env.UNI_INPUT_DIR);
    try {
        plugins.push([
            require("@dcloudio/vue-cli-plugin-hbuilderx/packages/babel-plugin-console"),
            {
                file(file) {
                    file = normalizePath(file);
                    if (file.indexOf(input) === 0) {
                        return path.relative(input, file);
                    }
                    return false;
                },
            },
        ]);
    } catch (err) {
        console.log(`babel`, err);
    }
}

process.UNI_LIBRARIES = ["shst-campus"];
plugins.push([
    require("uniapp-import-loader/dist/babel-plugin-dynamic-import"),
    {
        libraryName: "shst-campus",
        libraryPath: "lib",
    },
    // import { CCard } from "shst-campus";
    // => import CCard from "shst-campus/lib/c-card/c-card";
]);

module.exports = {
    presets: [
        [
            "@vue/app",
            {
                modules: "commonjs",
                useBuiltIns: process.env.UNI_PLATFORM === "h5" ? "usage" : "entry",
            },
        ],
    ],
    plugins,
};
