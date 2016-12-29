var baseUrl = _g.base + '/Broadcast/';
require([
     'dijit/registry',
     'esri/map', 'esri/graphic',
     'esri/geometry/Extent',
     'esri/geometry/Circle',
     'esri/dijit/Scalebar',
     'esri/layers/GraphicsLayer',
     'esri/toolbars/draw',
     'esri/symbols/PictureMarkerSymbol',
     'lib/Utils/geoUtils',
     'lib/Utils/geolocation',
     'lib/Utils/loaders',
     'lib/Utils/typeUtils',
     'lib/symbols',
     'lib/TDTLayer/TDTVecLayer',
     'lib/TDTLayer/TDTVecAnnoLayer',
     'lib/TDTLayer/TDTImgLayer',
     'lib/TDTLayer/TDTImgAnnoLayer',
     'esri/layers/ArcGISTiledMapServiceLayer',
     'widgets/detailWindow',
     'dojo/domReady!'
],
function (
    registry,
    Map, Graphic,
    Extent,
    Circle,
    Scalebar,
    GraphicsLayer,
    Draw,
    PictureMarkerSymbol,
    geoUtils,
    geolocation,
    loaders,
    typeUtils,
    symbols,
    TDTVecLayer,
    TDTVecAnnoLayer,
    TDTImgLayer,
    TDTImgAnnoLayer,
    ArcGISTiledMapServiceLayer,
    DetailWindow
    ) {
    toastr.options.positionClass = 'toast-bottom-full-width';
    InitEventsSymbols();

    InitMap();
    InitDate();
    InitBroadcastPanel();

    InitWeather();
    InitReportPanel();
    InitValidate();
    InitLogin();

    var detailWindow = new DetailWindow({
        onUsefulClick: SubmitComment,
        onUncorrectClick: SubmitComment,
        onSubmitClick: SubmitComment,

    }, $('#itemDetail')[0]);
    detailWindow.startup();
});

function InitEventsSymbols() {
    var evtSymbols = {};

    var catagory = ['电力', '自来水', '天然气', '自行车', '公交', '交通限行', '土地资讯', '其他'];
    var urgency = ['一般', '重要', '紧急', '非常紧急'];
    for (var i = 0; i < catagory.length; i++) {
        var c = catagory[i];
        for (var j = 0; j < urgency.length; j++) {
            var u = urgency[j];
            var name = c + '_' + u;

            var s = new esri.symbol.PictureMarkerSymbol('../Imgs/' + name + '.png', 30, 36);
            s.setOffset(2, 16);
            evtSymbols[c + '_' + u] = s;
        }
    }
    jxgis.symbols.evtSymbols = evtSymbols;
    var locationSymbol = new esri.symbol.PictureMarkerSymbol('../Imgs/location-violet.png', 32, 32);
    locationSymbol.setOffset(0, 16);
    jxgis.symbols.locationSymbol = locationSymbol;
}


function InitMapTools() {
    var $home = $('.map-tools .glyphicon-home');
    var $fullsreen = $('.map-tools .glyphicon-fullscreen');
    var map = _g.map;

    $fullsreen.on('click', function () {
        var extent = new esri.geometry.Extent(_g.extent);
        _g.map.setExtent(extent, true);
    });

    $home.on('click', function () {
        toastr.info('正在获取位置，请稍后...');
        jxgis.geolocation.get(function (rt) {
            x = rt.coords.longitude;
            y = rt.coords.latitude;
            var point = new esri.geometry.Point(x, y, map.spatialReference);
            map.centerAt(point);

            var g1 = new esri.Graphic(new esri.geometry.Circle(point, {
                radius: 100
            }), jxgis.symbols.G_BlueSolid, {
                on: true
            });
            var g2 = new esri.Graphic(point, jxgis.symbols.P_Blue, {
            });
            _g.drawLayer.add(g1);
            _g.drawLayer.add(g2);

            toastr.success('已成功定位！');
        }, function (er) {
            toastr.error(er.message);
        });
    });
}

function SubmitComment(id, useful, comment) {
    $.post(baseUrl + 'CommentPublish', {
        ID: id,
        Useful: useful,
        Content: comment
    }, function (r) {
        if (r.ErrorMessage)
            toastr.error(r.ErrorMessage);
    });
}

function InitMap() {
    var extent = new esri.geometry.Extent(_g.extent);
    var map = new esri.Map('map', {
        logo: false, slider: false, sliderPosition: 'top-right', extent: extent
    });
    var tdtVecLayer = new TDTVecLayer();
    var tdtVecAnnoLayer = new TDTVecAnnoLayer();

    var tdtImgLayer = new TDTImgLayer({ visible: false });
    var tdtImgAnnoLayer = new TDTImgAnnoLayer({ visible: false });

    //var tdtImgLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://10.73.1.171:9001/JXPDServerCore/rest/services/MyJXPDMapService1/MapServer", { visible: false });
    //var tdtImgAnnoLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://10.73.1.171:9001/JXPDServerCore/rest/services/MyJXPDMapService2/MapServer", { visible: false });

    var drawLayer = new esri.layers.GraphicsLayer({
        id: 'drawLayer'
    });

    var $layerToggle = $('.map-tools .glyphicon-globe');

    $layerToggle.on('click', function () {
        $layerToggle.toggleClass('active');

        var has = $layerToggle.hasClass('active');
        tdtVecLayer.setVisibility(!has);
        tdtVecAnnoLayer.setVisibility(!has);
        tdtImgLayer.setVisibility(has);
        tdtImgAnnoLayer.setVisibility(has);
    });

    var eventLayer = new esri.layers.GraphicsLayer({
        id: 'eventLayer'
    });

    drawLayer.on('graphic-add', function (evt) {
        if (evt.graphic.attributes.on)
            $(evt.graphic.getNode()).attr('flash', 'on');
    });

    map.on('extent-change', function () {
        setTimeout(function () {
            for (var i = 0; i < drawLayer.graphics.length; i++) {
                var g = drawLayer.graphics[i];
                if (g.attributes.on)
                    $(g.getNode()).attr('flash', 'on');
            }
        }, 1000);

    });

    map.addLayers([tdtVecLayer, tdtVecAnnoLayer, tdtImgLayer, tdtImgAnnoLayer, drawLayer, eventLayer]);
    var scaleBar = new esri.dijit.Scalebar({
        map: map, attachTo: 'bottom-right', scalebarUnit: 'dual'
    });

    _g.map = map;
    _g.drawLayer = drawLayer;
    _g.eventLayer = eventLayer;

    InitMapTools();
}

function InitWeather() {
    (function (T, h, i, n, k, P, a, g, e) {
        g = function () {
            P = h.createElement(i); a = h.getElementsByTagName(i)[0]; P.src = k; P.async = 1; a.parentNode.insertBefore(P, a)
        }; T["ThinkPageWeatherWidgetObject"] = n; T[n] || (T[n] = function () {
            (T[n].q = T[n].q || []).push(arguments)
        }); T[n].l = +new Date(); if (T.attachEvent) { T.attachEvent("onload", g) } else {
            T.addEventListener("load", g, false)
        }
    }(window, document, "script", "tpwidget", "//widget.thinkpage.cn/widget/chameleon.js"));
    tpwidget('init', {
        "flavor": "bubble",
        "location": "WTMYGTZ7WZMY",
        "geolocation": "disabled",
        "position": "top-left",
        "margin": "10px 10px",
        "language": "zh-chs",
        "unit": "c",
        "theme": "chameleon",
        "uid": "U869D9CEA3",
        "hash": "a52c4c30236ec2348bef7da8548e3fb3"
    });
    tpwidget('show');
}

function InitDate() {
    var date = new Date();
    var timeString = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 星期';
    var day = '一';
    switch (date.getDay()) {
        case 1: day = "一"; break;
        case 2: day = "二"; break;
        case 3: day = "三"; break;
        case 4: day = "四"; break;
        case 5: day = "五"; break;
        case 6: day = "六"; break;
        case 7: day = "日"; break;
    }
    timeString += day;
    $('.bb-title-time').html(timeString);
}



function InitBroadcastPanel() {
    var $broadcastPanel = $('.bb-broadcast-panel');
    var $navli = $('.bb-navbar li');
    var $navPanel = $('.bb-nav-panel>div');
    var $btnPanelToggle = $('.bb-ssbb-toggle');
    var $btnPause = $broadcastPanel.find('.bb-ssbb-pause');
    var $panel = $('#panel');

    var playCls = 'glyphicon-play';
    var pauseCls = 'glyphicon-pause';


    var aCls = _g.constant.active;
    var fCls = 'focus';

    var bPanelOn = false;
    var on = false;
    var bPause = false;

    $navli.on('click', function () {
        var $this = $(this);
        var tCls = $this.data(_g.constant.target);
        $navli.removeClass(aCls);
        $this.addClass(aCls);
        $navPanel.removeClass(aCls);
        var $target = $navPanel.filter('.' + tCls).addClass(aCls);

        if (tCls == 'bb-wtsb') {
            $broadcastPanel.addClass(aCls);
        } else if (bPanelOn) {
            $broadcastPanel.addClass(aCls);
        } else {
            $broadcastPanel.removeClass(aCls);
        }
    });

    var visibleCount = 1;


    $.post(baseUrl + 'GetPublish', function (rt) {
        InitPanel(rt);
    }, 'json');

    function GetLevel(level) {
        var l = '';
        switch (level) {
            case '一般':
                l = 'level1';
                break;
            case '重要':
                l = 'level2';
                break;
            case '紧急':
                l = 'level3';
                break;
            case '非常紧急':
                l = 'level4';
                break;
        }
        return l;
    }

    function GetCatagory(catagory) {
        var c = {
        };
        switch (catagory) {
            case '电力':
                c = {
                    cls: 'icon-power'
                };
                break;
            case '自来水':
                c = {
                    cls: 'icon-water '
                };
                break;
            case '天然气':
                c = {
                    cls: 'icon-gas'
                };
                break;
            case '自行车':
                c = {
                    cls: 'icon-bicycle'
                };
                break;
            case '公交':
                c = {
                    cls: 'icon-bus'
                };
                break;
            case '交通限行':
                c = {
                    cls: 'icon-trafficlimits'
                };
                break;
            case '土地资讯':
                c = {
                    cls: 'icon-landinfomations'
                };
                break;
            case '其他':
                c = {
                    cls: 'icon-others'
                };
                break;
        }
        return c;
    }

    function InitPanel(items) {
        var $detailPanel = $('.bb-item-details');

        var eventLayer = _g.eventLayer;
        eventLayer.clear();
        eventLayer.on('click', function (evt) {
            $items.removeClass(aCls);
            $('#' + evt.graphic.attributes.ID).addClass(aCls);
            ShowEventInfo(evt.graphic.attributes);
        });

        var $itemContainer = $('.bb-items');
        for (var i in items) {
            var item = items[i];
            var level = GetLevel(item.Urgency);
            var catagory = GetCatagory(item.Catagory);
            var $item = $('<div id="' + item.ID + '" class="bb-item clearfix"><span class="bb-item-icon' + ' ' + level + ' ' + ' ' + catagory.cls + ' ' + '"></span><span class="bb-item-title">' + item.Title + '</span><span class="bb-item-time">' + item.PublishTime + '</span></div>');
            $item.data('value', item);
            $item.appendTo($itemContainer);
            $item.on('click', function () {
                $items.removeClass(aCls);
                var $this = $(this);
                $this.addClass(aCls);
                var v = $this.data('value');
                var graphics = ShowEventInfo(v);
                _g.map.setExtent(esri.graphicsExtent(graphics), true);
            });

            var geos = jxgis.geoUtils.toGeometry(item.Geometry);
            if (jxgis.typeUtils.isArray(geos)) {
                for (var j in geos) {
                    var geo = geos[j];
                    var p = GetCenterPoint(geo);
                    var g = new esri.Graphic(p, jxgis.symbols.evtSymbols[item.Catagory + '_' + item.Urgency], item);
                    eventLayer.add(g);
                }
            } else {
                var p = GetCenterPoint(geos);
                var g = new esri.Graphic(p, jxgis.symbols.evtSymbols[item.Catagory + '_' + item.Urgency], item);
                eventLayer.add(g);
            }
        }

        var currentItem;
        var detailPanel = dijit.byId('itemDetail');

        function ShowDetailPanel(item) {
            detailPanel.setDetail(item);
            detailPanel.show();
        }

        function ShowEventInfo(attrs) {
            _g.drawLayer.clear();
            var geos = jxgis.geoUtils.toGeometry(attrs.Geometry);
            var graphics = [];

            if (jxgis.typeUtils.isArray(geos)) {
                for (var j in geos) {
                    var geo = geos[j];
                    if (geo.type == 'point') {
                        var g1 = new esri.Graphic(new esri.geometry.Circle(geo, {
                            radius: 100
                        }), jxgis.symbols.G_RedSolid, {
                            on: true
                        });
                        //var g2 = new esri.Graphic(new esri.geometry.Circle(geo, { radius: 20 }), jxgis.symbols.G_RedSolid2);
                        var g2 = new esri.Graphic(geo, jxgis.symbols.P_Red, {
                        });
                        _g.drawLayer.add(g1);
                        graphics.push(g1);
                        _g.drawLayer.add(g2);
                        graphics.push(g2);
                    }
                    else {
                        var g = new esri.Graphic(geo, GetSymbol(geo), {
                            on: true
                        });
                        _g.drawLayer.add(g);
                        graphics.push(g);
                    }
                }
            } else {
                if (geos.type == 'point') {
                    var g1 = new esri.Graphic(new esri.geometry.Circle(geos, {
                        radius: 100
                    }), jxgis.symbols.G_RedSolid, {
                        on: true
                    });
                    //var g2 = new esri.Graphic(new esri.geometry.Circle(geos, { radius: 20 }), jxgis.symbols.G_RedSolid2);
                    var g2 = new esri.Graphic(geos, jxgis.symbols.P_Red, {
                    });
                    _g.drawLayer.add(g1);
                    graphics.push(g1);
                    _g.drawLayer.add(g2);
                    graphics.push(g2);
                }
                else {
                    var g = new esri.Graphic(geos, GetSymbol(geos), {
                        on: true
                    });
                    _g.drawLayer.add(g);
                    graphics.push(g);
                }
            }

            ShowDetailPanel(attrs);
            return graphics;
        }

        function GetSymbol(geo) {
            switch (geo.type) {
                case 'point':
                    return jxgis.symbols.P_Red;
                case 'polyline':
                    return jxgis.symbols.L_RedSolid;
                case 'polygon':
                    return jxgis.symbols.G_Red;
            }
        }

        function GetCenterPoint(geo) {
            switch (geo.type) {
                case 'point':
                    return geo;
                    break;
                case 'polyline':
                    var path = geo.paths[0];
                    var index = parseInt(path.length / 2);

                    if (path.length % 2 == 0) {
                        var x = (path[index][0] + path[index - 1][0]) / 2;
                        var y = (path[index][1] + path[index - 1][1]) / 2;
                        return esri.geometry.Point(x, y, _g.map.spatialReference);

                    } else {
                        var x = path[index][0];
                        var y = path[index][1];
                        return esri.geometry.Point(x, y, _g.map.spatialReference);
                    }
                    break;
                case 'polygon':
                    return geo.getCentroid();
                    break;
            }

        }


        $btnPanelToggle.on('click', function () {
            var $this = $(this);
            if (bPanelOn) {
                $broadcastPanel.removeClass(aCls);
                $this.removeClass(aCls);
                visibleCount = 1;
                $detailPanel.removeClass('on');
            } else {
                $broadcastPanel.addClass(aCls);
                $this.addClass(aCls);
                visibleCount = 10;
                $detailPanel.addClass('on');
            }
            bPanelOn = !bPanelOn;
            Reset();
        });

        var $items = $itemContainer.find('.bb-item');

        $('.bb-nav-panel').hover(function () {
            on = true;
        }, function () {
            on = false;
        });

        $items.first().addClass(fCls);
        var totalCount = $items.length;
        var moveCount = 0;
        var canMoveCount = totalCount - visibleCount > 0 ? totalCount - visibleCount : 0;

        $btnPause.on('click', function () {
            Reset();
            $btnPause.toggleClass(aCls).find('>span').toggleClass(playCls).toggleClass(pauseCls);
            if (!$btnPause.hasClass(aCls)) {
                $panel.css({
                    'overflow': 'hidden'
                });
                bPause = false;
            } else {
                $panel.css({
                    'overflow': 'auto'
                });
                $items.removeClass(fCls);
                bPause = true;
            }
            $panel.parent().toggleClass('active2');
        });

        setInterval(function () {
            if (!on && !bPause) moveItem();
        }, 3000);

        function Reset() {
            $panel.scrollTop(0);
            canMoveCount = totalCount - visibleCount > 0 ? totalCount - visibleCount : 0;
            moveCount = 0;
            $itemContainer.css('margin-top', 0);
            $items.removeClass(fCls).first().addClass(fCls);
        }

        function moveItem() {
            if (canMoveCount <= moveCount) {
                moveCount = 0;
                $itemContainer.css('margin-top', 0);
                $items.removeClass(fCls);
                $($items.get(moveCount)).addClass(fCls);
            } else {
                $itemContainer.animate({
                    marginTop: '-=44px'
                }, 300, function () {
                    $items.removeClass(fCls);
                    $($items.get(moveCount)).addClass(fCls);
                });
                moveCount++;
            }
        }
    }
}

function InitReportPanel() {
    var $drawBtn = $('.draw-point');
    $drawBtn.data('on', false);
    var $drop = $('.bb-location-drop');
    var $currentLocation = $('.bb-location-current');
    var $searchBtn = $('.bb-location-search');
    var $searchPanel = $('.location-search-panel');
    var $txtLocation = $('form input[name=Geometry]');
    var $submit = $('.bb-wtsb-submit-btn');
    var $dg;

    var map = _g.map;
    var drawLayer = _g.drawLayer;
    var drawTool = new esri.toolbars.Draw(map, {
        showTooltips: true
    });

    var aCls = 'active';
    var firstClick = true;
    esri.bundle.toolbars.draw.addPoint = '点击添加位置';

    $submit.on('click', function () {
        $('form[name=report]').submit();
    });

    $drop.on('click', function () {
        drawLayer.clear();
        $txtLocation.val('');
    });

    drawTool.on('draw-complete', function (evt) {
        drawLayer.clear();
        var geometry = evt.geometry;
        var graphic = new esri.Graphic(geometry, jxgis.symbols.locationSymbol, {});
        $txtLocation.val(JSON.stringify(jxgis.geoUtils.toJson(geometry)));
        drawLayer.add(graphic);
        $drawBtn.click();
    });

    $drawBtn.on('click', function () {
        var $this = $(this);
        $this.toggleClass(aCls);
        if ($this.hasClass(aCls)) {
            drawTool.activate(esri.toolbars.Draw.POINT);
            $drawBtn.data('on', true);
        } else {
            drawTool.deactivate();
            $drawBtn.data('on', false);
        }
    });

    if (jxgis.geolocation.isSupport) {
        $currentLocation.on('click', function () {
            if ($drawBtn.data('on')) {
                $drawBtn.click();
            }

            var $loading = jxgis.loaders.showLoading($('.bb-wtsb'), null, '正在获取位置，请稍候...');
            jxgis.geolocation.get(function (rt) {
                $loading.hideLoading();
                x = rt.coords.longitude;
                y = rt.coords.latitude;
                var point = new esri.geometry.Point(x, y, map.spatialReference);
                var g = new esri.Graphic(point, jxgis.symbols.locationSymbol, {
                });
                map.centerAt(point);
                drawLayer.clear();

                var g1 = new esri.Graphic(new esri.geometry.Circle(point, {
                    radius: 100
                }), jxgis.symbols.G_BlueSolid, {
                    on: true
                });
                var g2 = new esri.Graphic(point, jxgis.symbols.P_Blue, {
                });
                drawLayer.add(g1);
                drawLayer.add(g2);

                toastr.success('已成功定位！');
                $txtLocation.val(JSON.stringify(jxgis.geoUtils.toJson(point)));
            }, function (er) {
                $loading.hideLoading();
                toastr.error(er.message);
            });
        });
    } else {
        $currentLocation.remove();
    }

    var searchPanel = null;
    $searchBtn.on('click', function () {
        if ($drawBtn.data('on')) {
            $drawBtn.click();
        }
        $searchPanel.toggleClass(_g.constant.active);
        if (firstClick) {
            //jxgis.loaders.showLoading($('.bb-broadcast-content'));
            require(['widgets/locationDatagrid'], function (LocationDatagrid) {
                setTimeout(function () {
                    var opts = {
                        url: baseUrl + 'GetPOI?keyWord=',
                        onClickRow: function (index, row) {
                            drawLayer.clear();
                            var point = new esri.geometry.Point([row.x, row.y], _g.map.spatialReference);
                            var graphic = new esri.Graphic(point, jxgis.symbols.locationSymbol, {});
                            $txtLocation.val(JSON.stringify(jxgis.geoUtils.toJson(point)));
                            _g.map.centerAndZoom(point, 15);
                            drawLayer.add(graphic);
                        }
                    };

                    searchPanel = new LocationDatagrid(opts, $searchPanel.find('div')[0]);
                    searchPanel.startup();
                    //jxgis.loaders.hideLoading($('.bb-broadcast-content'));
                }, 500);
            });
            firstClick = false;
        }
    });
}

function InitValidate() {
    var validator = new FormValidator('report', [{
        name: 'Title',
        rules: '!callback_blank',
        display: '标题尚未填写'
    }, {
        name: 'Content',
        display: '描述尚未填写',
        rules: '!callback_blank'
    }, {
        name: 'Geometry',
        display: '位置尚未选择',
        rules: 'required'
    }], function (errors, event) {
        if (errors.length > 0) {
            toastr.error(errors[0].display);
        } else {
            if (ValidateReportRule()) {
                var obj = GetReportData();
                $.post(baseUrl + 'Report', obj, function (rt) {
                    var obj = rt;
                    if (obj.ErrorMessage) {
                        toastr.error('提交过于频繁，请稍后再试！');
                    } else {
                        toastr.success('提交成功！感谢您的反馈，我们会抓紧时间进行审核！');
                        ResetForm();
                    }
                });
            } else {
                toastr.error('提交过于频繁，请稍后重试！');
            }
        }
        //阻止form提交
        errors.length = 1;
    });

    validator.registerCallback('blank', function (value) {
        if ($.trim(value) != '') {
            return true;
        }
        return false;
    })
}

function GetReportData() {
    var $form = $('form[name=report]');
    return {
        Title: $form.find('input[name=Title]').val(),
        Content: $form.find('textarea[name=Content]').val(),
        Geometry: $form.find('input[name=Geometry]').val(),
        ContactInfo: $form.find('input[name=ContactInfo]').val(),
    };
}

function ResetForm() {
    _g.drawLayer.clear();
    var $form = $('form[name=report]');
    $form.find('input[name=Title]').val('');
    $form.find('textarea[name=Content]').val('');
    $form.find('input[name=Geometry]').val('');
    $form.find('input[name=ContactInfo]').val('');
}

function ValidateReportRule() {
    if (_g.debug) return true;
    var key = 'reportTime';
    var time = store.get(key);
    if (time) {
        time = new Date(time);
        var now = new Date();
        if (now - time > 180000) {
            store.set(key, now);
        } else {
            return false;
        }
    } else {
        store.set(key, new Date());
    }
    return true;
}

function InitLogin() {
    var aCls = _g.constant.active;
    var $btnShowLogin = $('.bb-login-btn');
    var $login = $('.login');
    var $username = $login.find('input[name=UserName]');
    var $password = $login.find('input[name=Password]');
    var $btnClose = $login.find('.login-content>.glyphicon-remove-sign');
    var $btnLogin = $login.find('.bb-comment-btn');


    var $input = $([$username[0], $password[0]]);
    $input.on('focus', addClass);
    $input.on('blur', removeClass);
    $input.on('keypress', function (evt) {
        if (evt.keyCode == '13') $btnLogin.click();
    });

    $login.find('.group .glyphicon').on('click', function () {
        $(this).parent().find('input').val('').focus();
    });

    function addClass() {
        $(this).parent().addClass(_g.constant.active);
    }

    function removeClass() {
        $(this).parent().removeClass(_g.constant.active);
    }

    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(_g.publicKey);

    $btnShowLogin.on('click', function () {
        $('.main').addClass(aCls);
        $login.addClass(aCls);
        $username.val('').focus();
        $password.val('');
    });

    var validator = new FormValidator('login', [{
        name: 'UserName',
        rules: '!callback_blank',
        display: '用户名尚未填写！'
    }, {
        name: 'Password',
        display: '密码尚未填写！',
        rules: '!callback_blank'
    }
    ], function (errors, event) {
        if (errors.length > 0) {
            toastr.error(errors[0].display);
        } else {
            $.post(baseUrl + 'Login', {
                UserName: $username.val(),
                Password: encrypt.encrypt($password.val())
            }, function (rt) {
                if (rt.ErrorMessage) {
                    toastr.error(rt.ErrorMessage);
                } else {
                    window.location = baseUrl + rt.Data.Link;
                }
            }, 'json');
        }
        errors.length = 1;
    });

    validator.registerCallback('blank', function (value) {
        return $.trim(value) != '';
    });

    $btnClose.on('click', function () {
        $login.removeClass(aCls);
        $('.main').removeClass(aCls);
    });

    $btnLogin.on('click', function () {
        $login.find('form[name=login]').submit();
    });
}