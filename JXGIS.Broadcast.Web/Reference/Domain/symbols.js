define([
    'esri/Color',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol'
],
function (
    Color,
    Marker,
    Line,
    Fill
) {
    jxgis = typeof (jxgis) == 'undefined' ? {} : jxgis;
    var C_White = new Color('#FFF');
    var C_Red = new Color('#F14141');
    var C_Green = new Color([0, 255, 255]);


    var L_RedSolid = new Line(Line.STYLE_SOLID, C_Red, 6);

    var L_GreenSolid = new Line(Line.STYLE_SOLID, C_Green, 8);

    var P_RedWhiteCirle = new Marker(Marker.STYLE_CIRCLE, 8, L_RedSolid, C_White);
    var G_RedBlack = new Fill(Fill.STYLE_SOLID, L_RedSolid, new Color([0, 0, 0, 0.3]));
    jxgis.symbols = {
        C_White: C_White,
        C_Red: C_Red,

        P_RedWhiteCirle: P_RedWhiteCirle,
        P_Red: new Marker(Marker.STYLE_CIRCLE, 20, new Line(Line.STYLE_SOLID, new Color([255, 255, 255, 1]), 2), new Color([241, 81, 81, 1])),
        P_Blue: new Marker(Marker.STYLE_CIRCLE, 20, new Line(Line.STYLE_SOLID, new Color([255, 255, 255, 1]), 2), new Color([53, 150, 234, 1])),

        L_RedSolid: L_RedSolid,
        L_GreenSolid: L_GreenSolid,

        G_Red: new Fill(Fill.STYLE_SOLID, new Line(Line.STYLE_SHORTDASH, new Color([241, 81, 81, 0.8]), 2), new Color([241, 81, 81, 0.1])),
        G_RedSolid: new Fill(Fill.STYLE_SOLID, new Line(Line.STYLE_SOLID, new Color([241, 81, 81, 0.8]), 1), new Color([241, 81, 81, 0.1])),
        G_RedSolid2: new Fill(Fill.STYLE_SOLID, new Line(Line.STYLE_SOLID, new Color([241, 81, 81, 0.8]), 1), new Color([241, 81, 81, 0.8])),
        G_RedBlack: G_RedBlack,
        G_BlueSolid: new Fill(Fill.STYLE_SOLID, new Line(Line.STYLE_SOLID, new Color([53, 150, 234, 0.8]), 1), new Color([53, 150, 234, 0.1])),
    };
    return jxgis.symbols;
});