define(
    'widgets/detailWindow',
    [
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dojo/mouse',
        'dojo/on',
        'dojo/text!./templates/detailWindow.html'
    ], function (declare, lang, _WidgetBase, _TemplatedMixin, mouse, on, template) {
        var aCls = 'active';

        return declare([_WidgetBase, _TemplatedMixin], {
            templateString: template,
            useful: 0,
            uncorrect: 0,
            constructor: function (options, domNode) {
                this.set('_onUsefulClick', options.onUsefulClick);
                this.set('_onUncorrectClick', options.onUncorrectClick);

                this.set('_onCancelClick', options.onCancelClick);
                this.set('_onSubmitClick', options.onSubmitClick);
            },
            postCreate: function () {
                this.own(
                    on(this.btnClose, 'click', lang.hitch(this, this.hidden)),
                    on(this.btnCorrect, 'click', lang.hitch(this, this.toggleEditPanel)),

                    on(this.btnUseful, 'click', lang.hitch(this, this.usefulClick)),
                    on(this.btnUncorrect, 'click', lang.hitch(this, this.uncorrectClick)),

                    on(this.btnCancel, 'click', lang.hitch(this, this.onCancelClick)),
                    on(this.btnSubmit, 'click', lang.hitch(this, this.submitClick))
                );
            },
            hidden: function () {
                var $btnCorrect = $(this.btnCorrect);
                if ($btnCorrect.hasClass(aCls)) $btnCorrect.click();
                $(this.domNode).removeClass(aCls);
            },
            show: function () {
                var $btnCorrect = $(this.btnCorrect);
                if ($btnCorrect.hasClass(aCls)) $btnCorrect.click();
                $(this.domNode).addClass(aCls);
            },
            toggleEditPanel: function () {
                if (!store.get(this.pk + '_submit') || _g.debug) {
                    $(this.btnCorrect).toggleClass(aCls);
                    $(this.editPanel).toggleClass(aCls);
                } else {
                    toastr.warning('您已评论过了哦^_^');
                }
            },
            getComment: function () {
                return $.trim($(this.txtEdit).val());
            },
            setDetail: function (detail) {
                this.set('detail', detail);

                this.set('useful', detail.Useful);
                this.set('uncorrect', detail.Uncorrect);

                this.set('pk', detail.ID);
                this.set('title', detail.Title);
                this.set('content', detail.Content);
                this.set('time', detail.PublishTime);

                $(this.txtTitle).html(detail.Title);
                $(this.txtDetail).html(detail.Content);
                $(this.txtTime).html(detail.PublishTime);

                $(this.usefulCount).html(detail.Useful);
                $(this.uncorrectCount).html(detail.Uncorrect);

                $(this.txtEdit).val('');
            },
            usefulClick: function () {
                if (!store.get(this.pk) || _g.debug) {
                    this.useful += 1;
                    this.detail.Useful += 1;
                    $(this.usefulCount).html(this.useful);
                    store.set(this.pk, 1);
                    toastr.success('评价成功！');
                    this._onUsefulClick ? this._onUsefulClick(this.pk, 1, null) : null;
                } else {
                    toastr.warning('您已评论过了哦^_^');
                }
            },
            uncorrectClick: function () {
                if (!store.get(this.pk) || _g.debug) {
                    this.uncorrect += 1;
                    this.detail.Uncorrect += 1;
                    $(this.uncorrectCount).html(this.uncorrect);
                    store.set(this.pk, 1);
                    toastr.success('评价成功！');
                    this._onUncorrectClick ? this._onUncorrectClick(this.pk, 0, null) : null;
                } else {
                    toastr.warning('您已评论过了哦^_^');
                }
            },
            onCancelClick: function () {
                this.toggleEditPanel();
                this._onCancelClick ? this._onCancelClick() : null;
            },
            submitClick: function () {
                var comment = this.getComment();
                if (comment) {
                    this.toggleEditPanel();
                    this._onSubmitClick ? this._onSubmitClick(this.pk, null, comment) : null;
                    toastr.success('评价成功！');
                    store.set(this.pk + '_submit', 1);
                }
                else
                    toastr.warning('还未填写任何内容哦^_^');
            }
        });
    });