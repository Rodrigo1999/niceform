"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var has = Object.prototype.hasOwnProperty;
function find(iter, tar, key) {
    for (var _i = 0, _a = iter.keys(); _i < _a.length; _i++) {
        key = _a[_i];
        if (dequal(key, tar))
            return key;
    }
}
function dequal(foo, bar) {
    var ctor, len, tmp;
    if (foo === bar)
        return true;
    if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
        if (ctor === Date)
            return foo.getTime() === bar.getTime();
        if (ctor === RegExp)
            return foo.toString() === bar.toString();
        if (ctor === Array) {
            if ((len = foo.length) === bar.length) {
                while (len-- && dequal(foo[len], bar[len]))
                    ;
            }
            return len === -1;
        }
        if (ctor === Set) {
            if (foo.size !== bar.size) {
                return false;
            }
            for (var _i = 0, foo_1 = foo; _i < foo_1.length; _i++) {
                len = foo_1[_i];
                tmp = len;
                if (tmp && typeof tmp === 'object') {
                    tmp = find(bar, tmp);
                    if (!tmp)
                        return false;
                }
                if (!bar.has(tmp))
                    return false;
            }
            return true;
        }
        if (ctor === Map) {
            if (foo.size !== bar.size) {
                return false;
            }
            for (var _a = 0, foo_2 = foo; _a < foo_2.length; _a++) {
                len = foo_2[_a];
                tmp = len[0];
                if (tmp && typeof tmp === 'object') {
                    tmp = find(bar, tmp);
                    if (!tmp)
                        return false;
                }
                if (!dequal(len[1], bar.get(tmp))) {
                    return false;
                }
            }
            return true;
        }
        if (ctor === ArrayBuffer) {
            foo = new Uint8Array(foo);
            bar = new Uint8Array(bar);
        }
        else if (ctor === DataView) {
            if ((len = foo.byteLength) === bar.byteLength) {
                while (len-- && foo.getInt8(len) === bar.getInt8(len))
                    ;
            }
            return len === -1;
        }
        if (ArrayBuffer.isView(foo)) {
            if ((len = foo.byteLength) === bar.byteLength) {
                while (len-- && foo[len] === bar[len])
                    ;
            }
            return len === -1;
        }
        if (!ctor || typeof foo === 'object') {
            len = 0;
            for (ctor in foo) {
                if (has.call(foo, ctor) && ++len && !has.call(bar, ctor))
                    return false;
                if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor]))
                    return false;
            }
            return Object.keys(bar).length === len;
        }
    }
    return foo !== foo && bar !== bar;
}
exports.default = dequal;
