define([], function () {
    jxgis = typeof (jxgis) == 'undefined' ? {} : jxgis;

    var types = {
        date: 'date',
        string: 'string',
        'function': 'function',
        bool: 'boolean',
        regexp: 'regexp',
        number: 'number',
        'undefined': 'undefined',
        object: 'object',
        'null': 'null',
        array: 'array'
    };

    function isDate(v) { return $.type(v) === types.data; }
    function isString(v) { return $.type(v) === types.string; }
    function isFunction(v) { return $.type(v) === types.function; }
    function isBool(v) { return $.type(v) === types.bool; }
    function isRegexp(v) { return $.type(v) === types.regexp; }
    function isNumber(v) { return $.type(v) === types.number; }
    function isUndefined(v) { return $.type(v) === types.undefined; }
    function isObject(v) { return $.type(v) === types.object; }
    function isNull(v) { return $.type(v) === types.null; }
    function isArray(v) { return $.type(v) === types.array; }
    function type(v) { return $.type(v); }

    jxgis.typeUtils = {
        types: types,
        isDate: isDate,
        isString: isString,
        isFunction: isFunction,
        isBool: isBool,
        isRegexp: isRegexp,
        isNumber: isNumber,
        isUndefined: isUndefined,
        isObject: isObject,
        isNull: isNull,
        isArray: isArray
    };

    return jxgis.typeUtils;
});