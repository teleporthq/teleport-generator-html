"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var pretty = require("pretty");
var teleport_lib_js_1 = require("teleport-lib-js");
var html_1 = require("../renderers/html");
var component_1 = require("../renderers/component");
function findNextIndexedKeyInObject(object, key) {
    if (!object[key])
        return key;
    var i = 1;
    while (object[key + "_" + i] !== undefined) {
        i++;
    }
    return key + "_" + i;
}
var HtmlComponentGenerator = /** @class */ (function (_super) {
    __extends(HtmlComponentGenerator, _super);
    function HtmlComponentGenerator(generator) {
        var _this = _super.call(this, generator) || this;
        _this.project = null;
        return _this;
    }
    HtmlComponentGenerator.prototype.processStyles = function (componentContent, styles, parentsArray) {
        var _this = this;
        var content = JSON.parse(JSON.stringify(componentContent));
        var parents = parentsArray.slice();
        if (content.style) {
            var stylePath = parents.length > 0 ? parents.join(' > ') + " >" : '';
            var styleName = findNextIndexedKeyInObject(styles, content.name || content.type);
            styles[stylePath + " ." + styleName] = content.style;
            content.style = [styleName];
            // @todo: handle platform
        }
        var htmlTag;
        var mapping = this.generator.target.map(content.source, content.type);
        if (mapping)
            htmlTag = mapping.type;
        parents.push(htmlTag);
        // if has children, do the same for children
        if (content.children && content.children.length > 0) {
            if (typeof content.children !== "string") {
                content.children = content.children.map(function (child) {
                    if (child.source === 'components') {
                        child = _this.project.components["" + child.type].content;
                    }
                    var childStyledResults = _this.processStyles(child, styles, parents);
                    styles = __assign({}, styles, childStyledResults.styles);
                    return childStyledResults.content;
                });
            }
        }
        return { styles: styles, content: content };
    };
    HtmlComponentGenerator.prototype.renderComponentHTML = function (content) {
        var _this = this;
        var source = content.source, type = content.type, props = __rest(content
        // retrieve the target type from the lib
        , ["source", "type"]);
        // retrieve the target type from the lib
        var mapping = null;
        var mappedType = type;
        if (source !== 'components' && source !== 'pages') {
            mapping = this.generator.target.map(source, type);
            if (mapping)
                mappedType = mapping.type;
        }
        var styleNames = null;
        if (props.style)
            styleNames = props.style;
        delete props.style;
        // there are cases when no children are passed via structure, so the deconstruction will fail
        var children = null;
        if (props.children)
            children = props.children;
        // remove the children from props
        delete props.children;
        var childrenTags = [];
        if (children && children.length > 0) {
            if (typeof children === "string")
                childrenTags = children;
            else
                childrenTags = children.map(function (child) { return _this.renderComponentHTML(child); });
        }
        if (Array.isArray(childrenTags)) {
            childrenTags = childrenTags.join('');
        }
        styleNames = styleNames ? styleNames.join(' ') : null;
        var name = props.name, componentProps = props.props, otherProps = __rest(props, ["name", "props"]); // this is to cover img uri props; aka static props
        var mappedProps = __assign({}, componentProps, otherProps);
        if (mapping && typeof mapping.props === 'function') {
            mappedProps = mapping.props(mappedProps);
        }
        return html_1.default(mappedType, childrenTags, styleNames, mappedProps);
    };
    // tslint:disable-next-line:no-shadowed-variable
    HtmlComponentGenerator.prototype.generate = function (component, project) {
        var name = component.name;
        var content = component.content;
        this.project = project;
        var stylingResults = this.processStyles(content, {}, []);
        var styles = stylingResults.styles;
        content = stylingResults.content;
        var html = this.renderComponentHTML(content);
        var props = (component.editableProps ? Object.keys(component.editableProps) : null);
        var result = new teleport_lib_js_1.FileSet();
        result.addFile(_.upperFirst(component.name) + ".html", pretty(component_1.default(name, html, styles, props)));
        return result;
    };
    return HtmlComponentGenerator;
}(teleport_lib_js_1.ComponentGenerator));
exports.default = HtmlComponentGenerator;
//# sourceMappingURL=component.js.map