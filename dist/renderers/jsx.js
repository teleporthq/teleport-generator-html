"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function html(tag, childrenJSX, styles) {
    var stylesString = '';
    if (styles) {
        stylesString = "class=\"" + styles + "\"";
    }
    if (childrenJSX && childrenJSX.length > 0) {
        return "<" + tag + " " + stylesString + ">" + childrenJSX + "</" + tag + ">";
    }
    else {
        return "<" + tag + " " + stylesString + "/>";
    }
}
exports.default = html;
//# sourceMappingURL=jsx.js.map