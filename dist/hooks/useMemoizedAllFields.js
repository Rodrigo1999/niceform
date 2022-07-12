"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var utils_1 = require("../utils");
function useMemoizedAllFields(fields, values) {
    var allFields = (0, react_1.useMemo)(function () {
        fields = fields || [];
        if (!fields) {
            fields = Object.entries(values || {}).map(function (e) { return ({ name: e[0] }); });
        }
        return (0, utils_1.getFlatFields)(fields);
    }, [fields, values]);
    return allFields;
}
exports.default = useMemoizedAllFields;
