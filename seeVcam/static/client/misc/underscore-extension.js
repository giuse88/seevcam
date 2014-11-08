(function (_) {
    'use strict';
    _.compile = function (templ) {
        var compiled = this.template(templ);
        compiled.render = function (ctx) {
            return this(ctx);
        }
        return compiled;
    }
})(window._);
