;(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = exports = factory(
            require("./src/core"),
            require("./src/util"),
            require("./src/enc"),
            require("./src/sign"),
            require("./src/rpc"),
            require("./src/smart-contract"),
        );
    } else if (typeof define === "function" && define.amd) {
        define(["./src/core", "./src/util", "./src/enc", "./src/sign", "./src/rpc", "./src/smart-contract"], factory);
    } else {
        root.SASEUL = factory(root.SASEUL);
    }
}(this, function (SASEUL) {

    return SASEUL;

}));