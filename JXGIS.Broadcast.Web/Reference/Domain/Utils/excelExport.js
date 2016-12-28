define([], function () {
    jxgis = typeof (jxgis) == 'undefined' ? {} : jxgis;

    var headerFilter = " .datagrid-view .datagrid-header table";    var bodyFilter = " .datagrid-view .datagrid-body table";    var regexReplace = '<tbody>|</tbody>|<div.*?>|</div>|<span>|</span>|&nbsp;|<span.*?>|field=".*?"|class=".*?"|id=".*?"|datagrid-row-index=".*?"|style="height:.*?"|<td[^/]*none.*?/td>';
    function GetHeaderRange($dg) {
        var options = $dg.datagrid('options');        var columns = options.columns;        var frozenColumns = options.frozenColumns;        var iColumnCount = 0;        var iRowCount = 0;        var cFirstRow = columns[0];        var fcFirstRow = frozenColumns[0];        var range = {};        for (var i = 0; i < cFirstRow.length; i++) {
            var col = cFirstRow[i];            if (col.colspan) {
                iColumnCount += col.colspan;
            } else {
                iColumnCount += 1;
            }
        }        for (var i = 0; i < fcFirstRow.length; i++) {
            var col = fcFirstRow[i];            if (col.colspan) {
                iColumnCount += col.colspan;
            } else {
                iColumnCount += 1;
            }
        }        if (options.rownumbers)            iColumnCount += 1;        range.columnCount = iColumnCount;        for (var i = 0; i < columns.length; i++) {
            var row = columns[i][0];            if (row) {
                if (row.rowspan) {
                    iRowCount += row.rowspan;
                } else {
                    iRowCount += 1;
                }
            }
        }        range.rowCount = iRowCount;        return range;
    };    function GetTable(filter) {
        var $dg = $(filter);        var resultHtml = GetHeaderTable($dg, headerFilter) + GetBodyTable($dg, bodyFilter);        return resultHtml;
    };    function GetHeaderTable($dg, headerFilter) {
        return Formatter($dg, headerFilter);
    };    function GetBodyTable($dg, bodyFilter) {
        return Formatter($dg, bodyFilter);
    };    function GetBodyTableByData(data, filter) {
        var $dg = $(filter);        var options = $dg.datagrid('options');        var fields = [];        function GetFields(cols) {
            for (var i = 0; i < cols.length; i++) {
                for (var j = 0; j < cols[i].length; j++) {
                    var f = cols[i][j];                    if (f.field) {
                        fields.push(f.field);
                    }
                }
            }
        }        GetFields(options.frozenColumns);        GetFields(options.columns);        var rownumbers = options.rownumbers;        var html = '';        for (var i = 0; i < data.length; i++) {
            var row = data[i];            var rowHtml = '';            for (var j = 0; j < fields.length; j++) {
                var f = fields[j];                rowHtml += '<td>' + row[f] + '</td>';
            }            if (rownumbers) {
                rowHtml = '<td>' + (i + 1) + '</td>' + rowHtml;
            }            html += '<tr>' + rowHtml + '</tr>';
        }        return '<table>' + html + '</table>';
    };    function Formatter($dg, filter) {
        var regex = new RegExp(regexReplace, "g");        var resultHtml = "";        var parts = $dg.find(filter);        var parts2 = parts.last().html().replace(regex, "");        if (parts.length > 1) {
            var parts1 = parts.first().html().replace(regex, "");
        }        else {
            var parts1 = null;
        }        parts1 = $(parts1);        parts2 = $(parts2);        for (var i = 0; i < parts2.length; i++) {
            var p1HTML = parts1[i] ? parts1[i].innerHTML : '';            var p2HTML = parts2[i] ? parts2[i].innerHTML : '';            resultHtml += "<tr>" + p1HTML + p2HTML + "</tr>";
        }        return '<table>' + resultHtml + '</table>';
    }
    jxgis.excel = {
        GetTable: GetTable,
        GetHeaderTable: GetHeaderTable,
        GetBodyTable: GetBodyTable,
        GetBodyTableByData: GetBodyTableByData,
        GetHeaderRange: GetHeaderRange
    };

    return jxgis.excel;
});