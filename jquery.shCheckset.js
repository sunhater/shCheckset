/*!
 * jQuery shCheckset v1.1
 * http://jquery.sunhater.com/shCheckset
 * 2014-01-24
 *
 * Copyright (c) 2010-2014 Pavel Tzonkov <sunhater@sunhater.com>
 * Dual licensed under the MIT and GPL licenses.
 */

(function($) {
    var scrollbarWidth = 0;

    $.fn.shCheckset = function(settings) {

        var c = {
            namespace: 'shcs',
            search: false,
            uniform: true,
            labels: {
                search: "Search..."
            },
            widthOffset: 0
        },

        addOption = function(select, value, text) {
            try {
                select.add(new Option(text, value), null);
            } catch(e) {
                select.add(new Option(text, value));
            }
        };

        $.extend(c, settings);

        if (!scrollbarWidth) {
            var div = $('<div></div>')
                .css({width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000})
                .prependTo('body').append('<div></div>').find('div').css({width: '100%', height: 200});
            scrollbarWidth = 100 - div.width();
            div.parent().remove();
        }

        this.each(function() {
            var t = this;

            if (!$(t).is('select') || !t.length)
                return;

            $(t).after('<div class="' + c.namespace + '"></div>');

            var div = $(t).next().get(0),
                name = $(t).attr('name'),
                outerCSS = {
                    width: t.style.width ? t.style.width : $(t).outerWidth() + 'px',
                    height: t.style.height ? t.style.height : $(t).outerHeight() + 'px'
                };

            if (!name) name = c.namespace + '[]';
            else if (name.substr(name.length - 2, 2) != "[]")
                name += "[]";

            $(div).html((c.search ? '<input type="text" placeholder="' + c.labels.search + '" />' : "") + '<div></div>');

            var search = $(div).find('input[type="text"]'),
                maxWidth = 0, i = 0,
                lc = $(div).find('div');

            lc.css({
                overflow: "auto",
                height: parseInt(outerCSS.height) - search.outerHeight(true)
                    - parseInt(lc.css('marginTop')) - parseInt(lc.css('marginBottom'))
                    - parseInt(lc.css('paddingTop')) - parseInt(lc.css('paddingBottom'))
                    - parseInt(lc.css('borderTopWidth')) - parseInt(lc.css('borderBottomWidth'))
                    + 'px'
            });

            $(t).find('option').each(function() {
                var label, checkbox, w, cid, t = this;

                do {
                    cid = c.namespace + '_' + name.substr(0, name.length - 2) + '_' + i++;
                } while ($('#' + cid).get(0));

                $(div).find('div').append('<label></label>');
                label = $(div).find('label').last();
                label.attr('for', cid).html('<input type="checkbox" /><span>' + t.text + '</span>').css({
                    whitespace: "nowrap",
                    'float': "left"
                });

                checkbox = label.find('input').first();
                checkbox.attr({
                    name: name,
                    id: cid,
                    value: t.value,
                    checked: t.selected
                });

                if (t.selected)
                    label.addClass('checked');

                if (c.uniform && $.uniform)
                    checkbox.uniform();

                w = label.outerWidth(true);
                if (maxWidth < w)
                    maxWidth = w;
            });

            $(div).find('label[for]').css({
                display: "block",
                whiteSpace: "nowrap",
                'float': "none"
            }).find('label').detach();

            $(div).find('input[type="checkbox"]').click(function() {
                var th = this,
                    label = $(th).parents('label[for]').first(),
                    value = $(th).val();

                $(t).find('option[value="' + value + '"]').get(0).selected = th.checked;

                if (th.checked)
                    label.addClass('checked');
                else
                    label.removeClass('checked');

                if (document.selection)
                    document.selection.empty();
                else if (window.getSelection)
                    window.getSelection().removeAllRanges();
            });

            if (!t.style.width)
                outerCSS.width = maxWidth + scrollbarWidth + c.widthOffset + parseInt(lc.css('marginLeft')) + parseInt(lc.css('marginRight')) + parseInt(lc.css('paddingLeft')) + parseInt(lc.css('paddingRight')) + parseInt(lc.css('borderLeftWidth')) + parseInt(lc.css('borderRightWidth'));

            $(div).css(outerCSS);

            search.attr({
                spellcheck: false

            }).css({
                width: parseInt(outerCSS.width) - parseInt(search.css('borderRightWidth')) - parseInt(search.css('borderLeftWidth')) - parseInt(search.css('paddingRight')) - parseInt(search.css('paddingLeft')) - parseInt(search.css('marginRight')) - parseInt(search.css('marginLeft')) + 'px'

            }).focus(function() {
                lc.addClass('focus');

            }).blur(function() {
                lc.removeClass('focus');

            }).keyup(function() {
                var search = $(this).val(),
                    lastSpace = (search.substr(search.length - 1, 1) == " ");

                search = search.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/g, " ");

                $(this).val(search + (lastSpace ? " " : ""));

                $(div).find('label').each(function(i) {
                    $(this).css('display', (search.length && ($(this).find('span').text().toLowerCase().indexOf(search.toLowerCase()) == -1)) ? 'none' : 'block');
                });
            });
            $(t).detach();
        });
    };
})(jQuery);
