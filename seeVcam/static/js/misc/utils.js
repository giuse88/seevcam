var UTILS = (function(){

    function url_parser(url) {
        var parser = document.createElement('a');
        parser.href = url;
        return parser
    }

    return {
        url_parser : url_parser
    }
}())

