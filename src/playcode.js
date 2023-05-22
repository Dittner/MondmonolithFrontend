"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.run = void 0;
var run = function () {
    var arr = [1, 2, 3];
    console.log("before", arr.length);
    var el = arr.splice(0, 1);
    console.log.apply(console, __spreadArray(["after", arr.length, ", el= "], el, false));
};
exports.run = run;
(0, exports.run)();
