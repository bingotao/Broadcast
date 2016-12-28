define(
    'widgets/feedbackPanel',
    [
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dojo/mouse',
        'dojo/on',
        'dojo/text!./templates/feedbackPanel.html'
    ], function (declare, lang, _WidgetBase, _TemplatedMixin, mouse, on, template) {
        var aCls = 'active';
        return declare([_WidgetBase, _TemplatedMixin], {
            templateString: template,
            dgConfig: {
                fitColumns: true,
                singleSelect: true,
                columns: [
                    [
                        { title: '', field: '', checkbox: true },
                        { title: '反馈信息', field: 'Content', halign: 'center', align: 'center', width: 300 }
                    ]
                ],
                /*detailview*/
                view: detailview,
                detailFormatter: function (index, row) {
                    return '<div class="detail"></div>';
                },
                onExpandRow: function (index, row) {
                    var $detailPanel = $(this).datagrid('getRowDetail', index).find('div.detail');
                    var html = '<table>';
                    html += '<tr><th style="width:40%">内容</th><td style="width:60%">' + row.Content + '</td></tr>';
                    html += '<tr><th>时间</th><td>' + row.CreateTime + '</td></tr>';
                    html += '<tr><th>IP</th><td>' + row.IP + '</td></tr>';
                    html += '</table>';
                    $detailPanel.html(html);
                    $(this).datagrid('fixDetailRowHeight', index);
                }
            },
            constructor: function (options, domNode) {

            },
            postCreate: function () {
                on(this.btnClose, 'click', lang.hitch(this, this.hidden));
            },
            hidden: function () {
                $(this.domNode).removeClass(aCls);
            },
            show: function (data) {
                $(this.domNode).addClass(aCls);
                if (data) this.setData(data);
            },
            setData: function (data) {
                var title = data.Title;
                var useful = data.Useful;
                var uncorrect = data.Uncorrect;
                var rows = data.Rows;

                $(this.txtTitle).html(title);
                $(this.txtUseful).html(useful);
                $(this.txtUncorrect).html(uncorrect);

                this.set('data', data);
                var $dg = $(this.dgFeedback);
                var dgConfig = this.dgConfig;
                dgConfig.title = '反馈信息（' + rows.length + '条）';
                setTimeout(function () {
                    $dg.datagrid(dgConfig).datagrid('loadData', rows);
                }, 500);
            }
        });
    });