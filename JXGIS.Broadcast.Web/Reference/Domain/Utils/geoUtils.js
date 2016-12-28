define([], function () {
    jxgis = typeof (jxgis) == 'undefined' ? {} : jxgis;

    var geoTypes = {
        point: 'point',
        multipoint: 'multipoint',
        polyline: 'polyline',
        polygon: 'polygon',
        extent: 'extent',
        geocollection: 'geocollection'
    };

    function toJson(geometry) {
        var type = $.type(geometry);
        switch (type) {
            case 'array':
                var geos = [];
                for (var i in geometry) {
                    var geo = geometry[i].toJson();
                    geo.type = geometry[i].type;
                    geos.push(geo);
                }
                return {
                    type: geoTypes.geocollection,
                    geometry: geos
                };
            case 'object':
                var geo = geometry.toJson();
                geo.type = geometry.type;
                return geo;
            default:
                return null;
        }
    }

    function toGeometry(json) {
        var type = $.type(json);
        if (type == 'string') {
            json = JSON.parse(json);
        }
        switch (json.type) {
            case 'geocollection':
                var geometries = [];
                for (var i in json.geometry) {
                    var g = json.geometry[i]
                    var geometry = esri.geometry.fromJson(g);
                    geometries.push(geometry);
                }
                return geometries;
            default:
                return esri.geometry.fromJson(json);
            }
    }

    jxgis.geoUtils = {
        toJson: toJson,
        toGeometry: toGeometry,
        geoTypes: geoTypes
    };

    return jxgis.geoUtils;
});