require([
     'dijit/registry',
     'esri/map',
     'esri/geometry/Extent',
     'esri/dijit/Scalebar',
     'esri/toolbars/draw',
     'esri/symbols/PictureMarkerSymbol',
     'lib/Utils/geoUtils',
     'lib/Utils/typeUtils',
     'lib/Utils/geolocation',
     'lib/Utils/loaders',
     'lib/symbols',
     'lib/TDTLayer/TDTVecLayer',
     'lib/TDTLayer/TDTAnnoLayer',
     'widgets/feedbackPanel',
     'dojo/domReady!'
],
function (
    registry,
    Map,
    Extent,
    Scalebar,
    Draw,
    PictureMarkerSymbol,
    geoUtils,
    typeUtils,
    geolocation,
    loaders,
    symbols,
    TDTVecLayer,
    TDTAnnoLayer,
    FeedbackPanel
    ) {
    toastr.options.positionClass = 'toast-bottom-full-width';
    var locationSymbol = new esri.symbol.PictureMarkerSymbol('../Imgs/location-red.png', 32, 32);
    locationSymbol.setOffset(0, 16);
    jxgis.symbols.locationSymbol = locationSymbol;

    InitMap();
    InitDate();
    InitNavbar();
    InitWeather();
    InitBBSHPanel();
    InitYHGLPanel();
    InitFBGL();
    InitPublishPanel();
    InitLogout();

    var feedbackPanel = new FeedbackPanel({
    }, $('#feedbackPanel')[0]);
    feedbackPanel.startup();
});

var publish = null;

function InitMap() {
    var extent = new esri.geometry.Extent(_g.extent);
    var map = new esri.Map('map', { logo: false, sliderPosition: 'top-right', extent: extent });

    var tdtVecLayer = new TDTVecLayer();
    var tdtAnnoLayer = new TDTAnnoLayer();
    var drawLayer = new esri.layers.GraphicsLayer({ id: 'drawLayer' });

    map.addLayers([tdtVecLayer, tdtAnnoLayer, drawLayer]);
    var scaleBar = new esri.dijit.Scalebar({ map: map, attachTo: 'bottom-right', scalebarUnit: 'dual' });

    _g.map = map;
    _g.drawLayer = drawLayer;
}

function InitWeather() {
    (function (T, h, i, n, k, P, a, g, e) { g = function () { P = h.createElement(i); a = h.getElementsByTagName(i)[0]; P.src = k; P.async = 1; a.parentNode.insertBefore(P, a) }; T["ThinkPageWeatherWidgetObject"] = n; T[n] || (T[n] = function () { (T[n].q = T[n].q || []).push(arguments) }); T[n].l = +new Date(); if (T.attachEvent) { T.attachEvent("onload", g) } else { T.addEventListener("load", g, false) } }(window, document, "script", "tpwidget", "//widget.thinkpage.cn/widget/chameleon.js"));
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

function InitNavbar() {
    var $navli = $('.bb-navbar li');
    var $navPanel = $('.bb-nav-panel>div');

    $navli.on('click', function () {
        var $this = $(this);
        var aCls = _g.constant.active;
        var tCls = $this.data(_g.constant.target);
        $navli.removeClass(aCls);
        $this.addClass(aCls);
        $navPanel.removeClass(aCls);
        $navPanel.filter('.' + tCls).addClass(aCls);
    });
}


var $searchBtn;
//初始化播报审核面板
function InitBBSHPanel() {
    var aCls = _g.constant.active;

    var $panel = $('.bb-bbsh');
    var $publishBtn = $panel.find('.bb-bbsh-tool-bar .glyphicon-ok').parent();
    var $unpassBtn = $panel.find('.bb-bbsh-tool-bar .glyphicon-remove').parent();;
    $searchBtn = $panel.find('.btn-search');
    var $txtSearch = $panel.find('.txt-search');

    var endDate = new Date();
    var beginDate = new Date();
    beginDate.setDate(beginDate.getDate() - 6);//7天以内

    beginDate = GetDateString(beginDate);
    endDate = GetDateString(endDate);

    var $timeBegin = $panel.find('#bbsh_date_begin').datebox({ onSelect: function (date) { beginDate = GetDateString(date); } }).datebox('setValue', beginDate);
    var $timeEnd = $panel.find('#bbsh_date_end').datebox({ onSelect: function (date) { endDate = GetDateString(date); } }).datebox('setValue', endDate);

    $panel.find('.textbox-text').attr("readonly", "readonly");
    $panel.find('.select-item').on('click', function () {
        $(this).toggleClass(aCls);
    });

    var $dgSH = $panel.find('#dgSH');

    var dgSHConfig = {
        pagination: true,
        fitColumns: true,
        singleSelect: true,
        pageSize: 8,
        pageList: [8],
        pageNumber: 1,
        columns: [
            [
                { title: '', field: '', checkbox: true },
                { title: '概要', field: 'Title', halign: 'center', align: 'center', width: 230 },
                { title: '时间', field: 'Date', halign: 'center', align: 'center', width: 120 }
            ]
        ],
        /*detailview*/
        view: detailview,
        detailFormatter: function (index, row) {
            return '<div class="detail"></div>';
        },
        onExpandRow: function (index, row) {
            var type = row['SourceType'];
            var id = row['SourceID'];
            var $detailPanel = $(this).datagrid('getRowDetail', index).find('div.detail');
            var url = (type == '自动抓取' ? 'CapturedInfoView?ID=' : 'ReportedInfoView?ID=') + id;
            $detailPanel.load(url, function () {
                $dgSH.datagrid('fixDetailRowHeight', index);
            });
        }
    };

    $dgSH.datagrid(dgSHConfig).datagrid('getPager').pagination({ layout: ['first', 'prev', 'next', 'last'] });
    $dgSH.datagrid('loadData', []);

    $publishBtn.on('click', function () {
        var row = $dgSH.datagrid('getSelected');
        if (!row) {
            toastr.error('尚未选中任何数据！');
        } else {
            publish.NewPublish(row);
            $('.bb-publish-panel').addClass(_g.constant.active);
        }
    });

    $searchBtn.on('click', Search).click();

    function Search() {
        dgSHConfig.url = 'GetReviewList';
        var cdts = GetSearchConditions();
        var error = null;
        if (!cdts.status.length) {
            error = '请选择审核状态！';
        } else if (!cdts.sourceType.length) {
            error = '请选择来源类型！';
        } else if (!cdts.catagory.length) {
            error = '请选择类别！';
        }
        if (error) {
            toastr.error(error);
            return;
        }
        dgSHConfig.queryParams = cdts;
        $dgSH.datagrid(dgSHConfig);
    }

    function GetSearchConditions() {
        //获取起始时间
        var eDate = new Date(endDate);
        eDate = GetDateString(new Date(eDate.setDate(eDate.getDate() + 1)));
        var bDate = beginDate;
        //来源类型
        var sourceType = [];
        var sourceTypes = $panel.find('[name=sourcetype] .active');
        for (var i = 0; i < sourceTypes.length; i++) {
            var v = $(sourceTypes[i]).data('value');
            sourceType.push(v);
        }
        //分类
        var catagory = [];
        var catagories = $panel.find('[name=catagory] .active');
        for (var i = 0; i < catagories.length; i++) {
            var v = $(catagories[i]).data('value');
            catagory.push(v);
        }
        //审核状态
        var status = [];
        var statuss = $panel.find('[name=status] .active');
        for (var i = 0; i < statuss.length; i++) {
            var v = $(statuss[i]).data('value');
            status.push(v);
        }
        //关键字
        var keyWord = $.trim($txtSearch.val());
        return {
            beginDate: bDate,
            endDate: eDate,
            sourceType: sourceType,
            catagory: catagory,
            status: status,
            keyWord: keyWord
        };
    }

    $txtSearch.on('keypress', function (evt) {
        if (evt.keyCode == '13') $searchBtn.click();
    });

    $unpassBtn.on('click', function () {
        var row = $dgSH.datagrid('getSelected');
        if (!row) {
            toastr.error('尚未选中任何数据！');
        } else {
            $('.main').addClass(aCls);
            $.messager.confirm('提示', '确定设为“未通过”？', function (r) {
                $('.main').removeClass(aCls);
                if (r) {
                    $.post('UnpassReview', row, function (rt) {
                        if (rt.ErrorMessage) {
                            toastr.error(rt.ErrorMessage);
                        } else {
                            toastr.success('状态成功设置为“未通过”！');
                            Search();
                        }
                    });
                }
            });
        }
    });
}

function GetDateString(date) {
    return date ? (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()) : '';
}

function InitYHGLPanel() {
    var aCls = _g.constant.active;

    var $yhglPanel = $('.bb-yhgl');
    if ($yhglPanel.length) {
        var $title = $yhglPanel.find('.bb-yhgl-title');

        var $btnNew = $yhglPanel.find('.glyphicon-plus').parent();
        var $btnEdit = $yhglPanel.find('.glyphicon-pencil').parent();
        var $btnDelete = $yhglPanel.find('.bb-yhgl-toolbar .glyphicon-remove').parent();

        var $btnSave = $yhglPanel.find('.glyphicon-floppy-saved').parent();
        var $btnCancel = $yhglPanel.find('.glyphicon-remove-sign').parent();
        var $btnClose = $yhglPanel.find('.bb-yhgl-close');

        var dgYHGLConfig = {
            rownumbers: true,
            fitColumns: true,
            singleSelect: true,
            columns: [
                [
                    { title: '', field: '', checkbox: true },
                    { title: '用户名', field: 'UserName', halign: 'center', align: 'center', width: 230 },
                    { title: '创建时间', field: 'CreateTime', halign: 'center', align: 'center', width: 120 }
                ]
            ]
        };

        var $dgYHGL = $yhglPanel.find('#dgYHGL');
        $dgYHGL.datagrid(dgYHGLConfig).datagrid('loadData', []);
        LoadUser();
        function LoadUser() {
            $.post('GetUsers', function (rt) {
                $dgYHGL.datagrid('loadData', rt.Data.Users);
            }, 'json');
        }

        $([$btnCancel[0], $btnClose[0]]).on('click', function () {
            $yhglPanel.find('.bb-yhgl-editpanel').removeClass(aCls);
            Reset();
        });

        $btnNew.on('click', function () {
            EditUser({});
        });

        $btnEdit.on('click', function () {
            var row = $dgYHGL.datagrid('getSelected');
            if (!row)
                toastr.error('尚未选择任何数据！');
            else
                EditUser(row);
        });

        $btnDelete.on('click', function () {
            var row = $dgYHGL.datagrid('getSelected');
            if (!row)
                toastr.error('尚未选择任何数据！');
            else {
                $('.main').addClass(aCls);
                $.messager.confirm('提示', '确定删除该用户？', function (r) {
                    $('.main').removeClass(aCls);
                    if (r) {
                        $.post('DeleteUser', row, function (rt) {
                            if (rt.ErrorMessage) {
                                toastr.error(rt.ErrorMessage);
                            } else {
                                toastr.success('删除成功！');
                                LoadUser();
                            }
                        });
                    }
                });
            }
        });


        $btnSave.on('click', function () {
            $yhglPanel.find('form[name=user_form]').submit();
        });

        function Reset() { $names.val(''); }
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(_g.publicKey);
        var validator = new FormValidator('user_form', [
            {
                name: 'UserName',
                rules: '!callback_blank',
                display: '请输入用户名'
            }, {
                name: 'Password',
                display: '请输入密码',
                rules: '!callback_blank'
            }, {
                name: 'VPassword',
                display: '请确认密码',
                rules: '!callback_blank'
            }], function (errors, event) {
                if (errors.length > 0) {
                    toastr.error(errors[0].display);
                } else if ($names.filter('[name=Password]').val() != $names.filter('[name=VPassword]').val()) {
                    toastr.error('两次输入的密码不一致！');
                } else {
                    //阻止form提交
                    errors.length = 1;

                    var id = $names.filter('[name=ID]').val();
                    var userName = $names.filter('[name=UserName]').val();
                    var password = $names.filter('[name=Password]').val();
                    $.post('SaveUser', {
                        ID: id,
                        UserName: userName,
                        Password: encrypt.encrypt(password)
                    }, function (rt) {
                        if (rt.ErrorMessage) {
                            toastr.error(rt.ErrorMessage);
                        } else {
                            toastr.success('保存成功！');
                            LoadUser();
                            $btnCancel.click();
                        }
                    }, 'json');
                }
            });

        validator.registerCallback('blank', function (value) {
            return $.trim(value) != '';
        });

        var $names = $yhglPanel.find('.bb-yhgl-editpanel input[name]');

        function EditUser(user) {
            $btnClose.parent().addClass(aCls);
            Reset();

            $title.html(user.ID ? '修改用户' : '新增用户');
            for (var i = 0; i < $names.length; i++) {
                var $name = $($names[i]);
                var name = $name.attr('name');
                var v = user[name];
                name && v ? $name.val(v) : $name.val('');
            }
            $title.parent().addClass(aCls);
        }
    }
}

var $btnQuery;
function InitFBGL() {
    var aCls = _g.constant.active;
    var $panel = $('.bb-fbgl');
    var $selectItems = $panel.find('.select-item');
    $selectItems.on('click', function () { $(this).toggleClass(aCls); });

    var $expire = $panel.find('.expire');
    var $feedback = $panel.find('.feedback');
    var $keyword = $panel.find('.keyword');

    $btnQuery = $panel.find('.btn-query');
    var $editBtn = $panel.find('.bb-fbgl-toolbar .glyphicon-pencil').parent();
    var $newBtn = $panel.find('.bb-fbgl-toolbar .glyphicon-plus').parent();
    var $btnDelete = $panel.find('.bb-fbgl-toolbar .glyphicon-remove').parent();

    var endDate = new Date();
    var beginDate = new Date();
    beginDate.setDate(beginDate.getDate() - 7);

    beginDate = beginDate.getFullYear() + '-' + (beginDate.getMonth() + 1) + '-' + (beginDate.getDate() + 1);
    endDate = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + (endDate.getDate() + 1);

    var $timeBegin = $panel.find('#fbgl_date_begin').datebox({ onSelect: function (date) { beginDate = GetDateString(date); } }).datebox('setValue', beginDate);
    var $timeEnd = $panel.find('#fbgl_date_end').datebox({ onSelect: function (date) { endDate = GetDateString(date); } }).datebox('setValue', endDate);

    $panel.find('.textbox-text').attr("readonly", "readonly");



    $keyword.on('keypress', function (evt) {
        if (evt.keyCode == '13') $btnQuery.click();
    });

    var $dgFBGL = $panel.find('#dgFBGL');

    var dgFBGLConfig = {
        rownumbers: true,
        pagination: true,
        fitColumns: true,
        singleSelect: true,
        pageSize: 8,
        pageList: [8],
        pageNumber: 1,
        columns: [
            [
                { title: '', field: '', checkbox: true },
                { title: '标题', field: 'Title', halign: 'center', align: 'center', width: 150 },
                { title: '状态', field: 'Status', halign: 'center', align: 'center', width: 80 },
                { title: '时间', field: 'PublishTime', halign: 'center', align: 'center', width: 120 }
            ]
        ],
    };

    $dgFBGL.datagrid(dgFBGLConfig).datagrid('getPager').pagination({ layout: ['first', 'prev', 'next', 'last'] });
    $dgFBGL.datagrid('loadData', []);

    $editBtn.on('click', function () {
        var row = $dgFBGL.datagrid('getSelected');
        if (!row) {
            toastr.error('请选择要编辑的数据！');

        } else {
            publish.NewPublish(row);
            $('.bb-publish-panel').addClass(_g.constant.active);
        }

    });

    $newBtn.on('click', function () {
        publish.NewPublish({});
        $('.bb-publish-panel').addClass(_g.constant.active);
    });

    $btnQuery.on('click', Search).click();

    $btnDelete.on('click', function () {
        var row = $dgFBGL.datagrid('getSelected');
        if (!row) {
            toastr.error('请选择要删除的数据！');
        } else {
            $('.main').addClass(aCls);
            $.messager.confirm('提示', '确定删除该发布项？', function (r) {
                $('.main').removeClass(aCls);
                if (r) {
                    $.post('DeletePublish', row, function (rt) {
                        if (rt.ErrorMessage) {
                            toastr.error(rt.ErrorMessage);
                        } else {
                            toastr.success('删除成功！');
                            Search();
                        }
                    });
                }
            });
        }
    });

    function Search() {
        var cdts = GetQueryCondition();
        var msg;
        if (!cdts.urgencey.length) {
            msg = '尚未选择任何紧急程度';
        } else if (!cdts.catagory.length) {
            msg = '尚未选择任何分类';
        } else if (!cdts.status.length) {
            msg = '尚未选择任何发布状态';
        }
        if (msg) {
            toastr.error(msg);
        } else {
            dgFBGLConfig.url = 'GetPublishInfoForGrid';
            dgFBGLConfig.queryParams = cdts;
            $dgFBGL.datagrid(dgFBGLConfig);//.datagrid('getPager').pagination({ layout: ['first', 'prev', 'next', 'last'] });
        }
    }

    function GetQueryCondition() {
        var eDate = new Date(endDate);
        eDate = GetDateString(new Date(eDate.setDate(eDate.getDate() + 1)));

        //紧急程度
        var urgencey = [];
        $selectItems.filter('.active[name=urgency]').each(function (i) {
            urgencey.push($(this).data('value'));
        });
        //类别
        var catagory = [];
        $selectItems.filter('.active[name=catagory]').each(function (i) {
            catagory.push($(this).data('value'));
        });
        //发布状态
        var status = [];
        $selectItems.filter('.active[name=status]').each(function (i) {
            status.push($(this).data('value'));
        });

        return {
            urgencey: urgencey,
            catagory: catagory,
            status: status,
            beginDate: beginDate,
            endDate: eDate,
            isExpire: $expire.prop('checked'),
            hasFeedback: $feedback.prop('checked'),
            keyWord: $.trim($keyword.val())
        };
    }
}

function InitPublishPanel() {
    var aCls = _g.constant.active;
    var map = _g.map;
    var drawLayer = _g.drawLayer;
    var current;
    var max = 0;

    var $panel = $('.bb-publish-panel');
    var $title = $panel.find('.bb-publish-title');
    var $publisTypes = $panel.find('.select-item[name=publish-type]');
    var $urgencyLevel = $panel.find('.select-item[name=urgency-level]');
    var $publishStatus = $panel.find('.select-item[name=publish-status]');
    var $showLocationPanelBtn = $panel.find('table .glyphicon-map-marker').parent();


    var $btnSave = $panel.find('.btn-save');

    var $locationPanel = $panel.find('.bb-location-panel');
    var $btnViewFeedback = $panel.find('table .glyphicon-list-alt').parent();

    var $locationSearchBtn = $locationPanel.find('.bb-location-search');
    var $locationSearchPanel = $locationPanel.find('.location-search-panel');

    var $locationSearchTxt = $locationPanel.find('.input-group .form-control');

    var $locationPanelCloseBtn = $locationPanel.find('.glyphicon-remove-sign').parent();
    var $locationPanelOKBtn = $locationPanel.find('.glyphicon-ok-sign').parent();

    var $btnClose = $panel.find('.bb-publish-close');
    var $graphicCount = $locationPanel.find('.graphic-count');
    var $txtGeometry = $panel.find('input[name=Geometry]');
    var $drawItems = $locationPanel.find('.draw-items');

    var today = new Date();
    var exDate = new Date();
    exDate.setDate(today.getDate() + 6);

    today = GetDateString(today);
    exDate = GetDateString(exDate);

    var $publishDate = $panel.find('#publish_date').datebox({ onSelect: function (date) { today = GetDateString(date); } }).datebox('setValue', today);
    var $expirationDate = $panel.find('#expiration_date').datebox({ onSelect: function (date) { exDate = GetDateString(date); } }).datebox('setValue', exDate);

    var editor;
    KindEditor.ready(function (K) {
        editor = K.create('.bb-publish-panel textarea[name=Content]', {
            items: [
                'fontname', 'fontsize', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'link', ],
            width: '200px',
            height: '140px',
            resizeType: 0
        });
    });

    $publisTypes.on('click', radioToggle);
    $urgencyLevel.on('click', radioToggle);
    $publishStatus.on('click', radioToggle);

    $btnViewFeedback.on('click', function () {
        var panel = dijit.registry.byId('feedbackPanel');
        var id = $panel.find('input[name=ID]').val();
        if (id) {
            $.post('GetComment', { id: id }, function (rt) {
                if (rt.ErrorMessage)
                    toastr.error(rt.ErrorMessage);
                else {
                    var data = rt.Data;
                    data.Title = $panel.find('input[name=Title]').val()
                    panel.show(data);
                }
            }, 'json');
        } else {
            toastr.warning('没有反馈信息！');
        }
    });



    function radioToggle() {
        var $this = $(this);
        $this.addClass(aCls).siblings().removeClass(aCls);
        $this.siblings().filter('input,textarea').val($this.data('value'));
    }

    $btnClose.on('click', function () {
        $panel.removeClass(aCls);
        ResetPanel();
        $btnQuery.click();
        $searchBtn.click();
    });

    var firstClick = true;
    var $dg;


    $showLocationPanelBtn.on('click', function () {
        $locationPanel.addClass(_g.constant.active);
    });

    $locationPanelCloseBtn.on('click', function () {
        $locationPanel.removeClass(_g.constant.active);
    });

    var dgConfig = {
        rownumbers: true,
        pagination: true,
        pageNumber: 1,
        pageSize: 5,
        pageList: [5],
        fitColumns: true,
        singleSelect: true,
        columns: [[
            { field: 'name', title: '名称', halign: 'center', align: 'center', width: 150 },
            { field: 'address', title: '地址', halign: 'center', align: 'left', width: 150 }
        ]]
    };

    $btnSave.on('click', function () {
        editor.sync();
        $panel.find('form').submit();
    });

    function GetPublishInfo() {

        var fields = $panel.find('td>input[name],td>textarea[name]');
        var obj = {
            PublishTime: today,
            ExpirationTime: exDate
        };
        for (var i = 0; i < fields.length; i++) {
            var $i = $(fields[i]);
            var name = $i.attr('name');
            if (name)
                obj[name] = $i.val();
        }
        return obj;
    }

    function SavePublish() {
        var obj = GetPublishInfo();
        //obj.Content = encodeURI(obj.Content);
        $.post('SavePublish', {
            json: JSON.stringify(obj)
        }, function (rt) {
            if (rt.ErrorMessage) {
                toastr.error(rt.ErrorMessage);
            } else {
                toastr.success('保存成功！');
                $btnClose.click();

            }
        });
    }


    function SetGraphicsCount(count) {
        $graphicCount.html(count);
    }

    function AddGraphic(geometry, index) {
        var symbol = jxgis.symbols.locationSymbol;
        if (geometry.type == 'polyline') {
            symbol = jxgis.symbols.L_RedSolid
        } else if (geometry.type == 'polygon') {
            symbol = jxgis.symbols.G_RedBlack
        }

        var graphic = new esri.Graphic(geometry, symbol);
        drawLayer.add(graphic);
        var count = _g.drawLayer.graphics.length;
        SetGraphicsCount(count);

        var $drawItem = $('<span class="draw-item">' + index + '&nbsp;&nbsp;' + (geometry.type == 'point' ? '点' : (geometry.type == 'polyline' ? '线' : '面')) + '<span class="glyphicon glyphicon-remove"></span></span>');
        $drawItem.data('graphic', graphic);
        $drawItem.on('click', CenterGraphic);
        $drawItem.find('.glyphicon-remove').on('click', RemoveGraphic);
        $drawItem.appendTo($drawItems);
    }


    function CenterGraphic() {
        var $this = $(this);
        var graphic = $this.data('graphic');
        var extent = esri.graphicsExtent([graphic]);
        map.setExtent(extent, true);
    }

    function RemoveGraphic() {
        var $this = $(this).parent();
        var graphic = $this.data('graphic');
        drawLayer.remove(graphic);
        $this.remove();
        SetGraphicsCount(drawLayer.graphics.length);
    }

    function InitDrawTools() {
        var drawTool = new esri.toolbars.Draw(map, { showTooltips: true });
        var $drawBtns = $locationPanel.find('.draw-point,.draw-polyline,.draw-polygon');
        var $drop = $locationPanel.find('.draw-drop');

        $locationSearchBtn.on('click', function () {
            ResetTools();
            $locationSearchPanel.toggleClass(aCls);
            if (firstClick) {
                //jxgis.loaders.showLoading($('.bb-location-panel'));
                require(['widgets/locationDatagrid'], function (LocationDatagrid) {
                    setTimeout(function () {
                        var opts = {
                            url: 'GetPOI?keyWord=',
                            onClickRow: function (index, row) {
                                var point = new esri.geometry.Point([row.x, row.y], _g.map.spatialReference);
                                _g.map.centerAndZoom(point, 15);
                                max++;
                                AddGraphic(point, max);
                            }
                        };

                        searchPanel = new LocationDatagrid(opts, $locationSearchPanel.find('div')[0]);
                        searchPanel.startup();
                        //jxgis.loaders.hideLoading($('.bb-location-panel'));
                    }, 500);
                });
                firstClick = false;
            }
        });

        drawTool.on('draw-complete', function (evt) {
            max++;
            AddGraphic(evt.geometry, max);
        });

        $drawBtns.on('click', function () {
            var $this = $(this);
            if (!$this.hasClass(aCls)) {
                ResetTools();
                $this.addClass(aCls);
                var type = $this.data('value');
                drawTool.activate(type);
                current = type;
            } else
                ResetTools();
        });

        $drop.on('click', function () {
            drawLayer.clear();
            var $items = $drawItems.find('>span>span').click();
            $txtGeometry.val('');
        });

        function ResetTools() {
            current = null;
            $drawBtns.removeClass(aCls);
            drawTool.deactivate();
        }

        $locationPanelCloseBtn.on('click', function () {
            ResetTools();
        });

        $locationPanelOKBtn.on('click', function () {
            ResetTools();
            json = '';
            if (drawLayer.graphics.length == 1) {
                var json = jxgis.geoUtils.toJson(drawLayer.graphics[0].geometry);
            } else if (drawLayer.graphics.length != 0) {
                var graphics = [];
                for (var i = 0; i < drawLayer.graphics.length; i++) {
                    graphics.push(drawLayer.graphics[i].geometry);
                }
                var json = jxgis.geoUtils.toJson(graphics);
            }

            $txtGeometry.val(JSON.stringify(json));
            $locationPanel.removeClass(_g.constant.active);
        });

    }

    function ResetPanel() {
        var fields = $panel.find('td>input[name],td>textarea[name]');
        for (var i = 0; i < fields.length; i++) {
            var $field = $(fields[i]);
            $field.val('');
        }
        editor.html('');
        $drawItems.find('>span>span').click();
        $panel.find('.select-item').removeClass(aCls);
    }

    InitDrawTools();

    function NewPublish(item) {
        ResetPanel();

        if (item.ID) {
            $title.html('修改发布');
        } else {
            $title.html('新增发布');
        }

        var fields = $panel.find('td>input[name],td>textarea[name]');

        for (var i = 0; i < fields.length; i++) {
            var $field = $(fields[i]);
            var name = $field.attr('name');
            if (name) $field.val(item[name]);
        }
        if (item.Content) {
            if (item.Catagory == '电力') {
                try {
                    var obj = $.parseJSON(item.Content);

                    var startTime = new Date(obj.startTime);
                    var stopTime = new Date(obj.stopTime);

                    startTime = startTime.getFullYear() + '年' + (startTime.getMonth() + 1) + '月' + startTime.getDate() + '日' + (startTime.getHours() < 10 ? '0' + startTime.getHours() : startTime.getHours()) + ':' + (startTime.getMinutes() < 10 ? '0' + startTime.getMinutes() : startTime.getMinutes());
                    stopTime = stopTime.getFullYear() + '年' + (stopTime.getMonth() + 1) + '月' + stopTime.getDate() + '日' + (stopTime.getHours() < 10 ? '0' + stopTime.getHours() : stopTime.getHours()) + ':' + (stopTime.getMinutes() < 10 ? '0' + stopTime.getMinutes() : stopTime.getMinutes());
                    var html = '<span style="font-size:14px;color:red;font-weight:700;">' + obj.typeName + '</span><br/>' +
                    '<span>停电线路：' + obj.lineName + '</span><br/>' +
                    '<span>停电区域：' + obj.scope + '</span><br/>' +
                    '<span>停电时间：' + startTime + '-' + stopTime + '</span><br/>';
                    editor.html(html);
                } catch (e) {
                    editor.html(item.Content);
                }
            }
            else
                editor.html(item.Content);
        }
        else
            editor.html(item.Link);

        if (item.Catagory)
            $publisTypes.filter('[data-value=' + item.Catagory + ']').addClass(aCls);
        if (item.Urgency)
            $urgencyLevel.filter('[data-value=' + item.Urgency + ']').addClass(aCls);
        if (item.Status)
            $publishStatus.filter('[data-value=' + item.Status + ']').addClass(aCls);
        if (item.PublishTime)
            $publishDate.datebox('setValue', item.PublishTime);
        if (item.ExpirationTime)
            $expirationDate.datebox('setValue', item.ExpirationTime);

        if (item.Geometry) {
            var geos = jxgis.geoUtils.toGeometry(item.Geometry);

            if (jxgis.typeUtils.isArray(geos)) {
                for (var i = 0; i < geos.length; i++) {
                    AddGraphic(geos[i], i + 1);
                }
            } else {
                AddGraphic(geos, 1);
            }
        }
    }

    publish = {
        NewPublish: NewPublish
    };

    var validator = new FormValidator('publish_form', [
                    {
                        name: 'Title',
                        rules: '!callback_blank',
                        display: '标题尚未填写'
                    }, {
                        name: 'Catagory',
                        display: '发布类型尚未选择',
                        rules: '!callback_blank'
                    }, {
                        name: 'Urgency',
                        display: '重要程度尚未选择',
                        rules: '!callback_blank'
                    }, {
                        name: 'Content',
                        display: '发布内容尚未填写',
                        rules: '!callback_blank'
                    }, {
                        name: 'Status',
                        display: '发布状态尚未选择',
                        rules: '!callback_blank'
                    }, {
                        name: 'Geometry',
                        display: '位置尚未选择',
                        rules: '!callback_blank'
                    }], function (errors, event) {
                        if (errors.length > 0) {
                            toastr.error(errors[0].display);
                        } else {
                            SavePublish();
                        }
                        //阻止form提交
                        errors.length = 1;
                    });

    validator.registerCallback('blank', function (value) {
        return $.trim(value) != '';
    });

}

function InitLogout() {
    var aCls = _g.constant.active;
    var $btnLogout = $('.bb-login-btn');
    $btnLogout.on('click', function () {
        $('.main').addClass(aCls);
        $.messager.confirm('提示', '确定注销？', function (r) {
            $('.main').removeClass(aCls);
            if (r) {
                $.post('Logout', function (rt) {
                    if (rt.ErrorMessage) {
                        toastr.error(rt.ErrorMessage);
                    } else {
                        window.location.reload();
                    }
                });
            }
        });
    });
}