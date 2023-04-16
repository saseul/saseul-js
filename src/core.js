;(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.SASEUL = factory();
    }
}(this, function () {
    /* start source */
    var SASEUL = SASEUL || function () {
        return {};
    }();
    /* end source */

    return SASEUL;
}));