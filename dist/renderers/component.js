"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var renderDependency = function (libraryName, types) {
    return "import { " + types.join(', ') + " } from '" + libraryName + "'";
};
function component(name, html, styles, props) {
    var propsString = '';
    if (props && props.length > 0) {
        propsString = "const { " + props.join(', ') + " } = this.props";
    }
    var stylesString = '';
    if (styles) {
        var styleNames = Object.keys(styles);
        if (styleNames && styleNames.length) {
            var stylesArray_1 = [];
            styleNames.map(function (styleName) {
                var styleLinesArray = JSON.stringify(styles[styleName], null, 4).split('\n');
                // filter out the empty lines
                styleLinesArray = styleLinesArray.filter(function (styleLine) { return styleLine.length; });
                // add the first line in the same line as the name; it will be the opening "{" of the definition
                stylesArray_1.push(styleName + " " + styleLinesArray[0]);
                // add the rest of the lines, except the last
                // tslint:disable-next-line:max-line-length
                styleLinesArray.slice(1, styleLinesArray.length - 1).map(function (stylePropertyString) { stylesArray_1.push(stylePropertyString.replace(',', '') + ";"); });
                // add the last line, as it needs an extra coma at the end
                stylesArray_1.push(styleLinesArray[styleLinesArray.length - 1] + " ");
            });
            //add each attribute on a new line, and remove double quotes
            stylesString = stylesArray_1.join('\n  ').replace(/"/g, '');
        }
    }
    return "\n    <!doctype html>\n    <html lang=\"en\">\n    <head>\n      <meta charset=\"utf-8\">\n      <title>" + _.upperFirst(name) + "</title>   \n    </head>\n    <style>" + stylesString + "</style>\n    <body>\n      " + html + "\n    </body>\n    </html>\n  ";
}
exports.default = component;
//# sourceMappingURL=component.js.map