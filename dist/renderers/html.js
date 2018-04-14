"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function html(tag, childrenTags, classNames, props) {
    var stylesString = '';
    if (classNames) {
        stylesString = "class=\"" + classNames + "\"";
    }
    var propsArray = [];
    if (props) {
        Object.keys(props).map(function (propName) {
            var propValue = props[propName];
            propsArray.push(propName + "=" + JSON.stringify(propValue));
        });
    }
    var propsString = (propsArray.length ? ' ' + propsArray.join(' ') : '');
    if (childrenTags && childrenTags.length > 0) {
        return "<" + tag + " " + stylesString + " " + propsString + ">" + childrenTags + "</" + tag + ">";
    }
    else {
        return "<" + tag + " " + stylesString + " " + propsString + "/>";
    }
}
exports.default = html;
//# sourceMappingURL=html.js.map