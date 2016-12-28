define(
    'widgets/locationDatagrid',
    [
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dojo/mouse',
        'dojo/on',
        'dojo/text!./templates/locationDatagrid.html'
    ], function (declare, lang, _WidgetBase, _TemplatedMixin, mouse, on, template) {
        var aCls = 'active';
        return declare([_WidgetBase, _TemplatedMixin], {
            templateString: template,
            dgConfig: {
                rownumbers: true,
                pagination: true,
                pageNumber: 1,
                pageSize: 5,
                pageList: [5],
                fitColumns: true,
                singleSelect: true,
                columns: [
                    [
                        {
                            field: 'name', title: '名称', halign: 'center', align: 'center', width: 300
                        }
                    ]]
            },
            constructor: function (options, domNode) {
                this.url = options.url;
                this.dgConfig.onClickRow = options.onClickRow;
            },
            postCreate: function () {
                var $dg = $(this.dgSearch).datagrid(this.dgConfig);
                this.$dg = $dg;
                $dg.datagrid('getPager').pagination({ layout: ['first', 'prev', 'next', 'last'] });
                $dg.datagrid('loadData', []);
                on(this.btnSearch, 'click', lang.hitch(this, this.search));
                var thisObj = this;
                $(this.searchText).on('keypress', function (evt) {
                    if (evt.keyCode == '13') thisObj.search();
                });
            },
            search: function () {
                var keyWord = this.getKeyWord();
                if (keyWord) {
                    this.dgConfig.url = this.url + keyWord;
                    this.$dg.datagrid(this.dgConfig).datagrid('getPager').pagination({ layout: ['first', 'prev', 'next', 'last'] });
                } else {
                    toastr.error('请输入关键字！');
                }
            },
            getKeyWord: function () {
                return $.trim($(this.searchText).val());
            }
        });
    });