﻿define([], function () {
    jxgis = typeof (jxgis) == 'undefined' ? {} : jxgis;

    var headerFilter = " .datagrid-view .datagrid-header table";
    function GetHeaderRange($dg) {
        var options = $dg.datagrid('options');
            var col = cFirstRow[i];
                iColumnCount += col.colspan;
            } else {
                iColumnCount += 1;
            }
        }
            var col = fcFirstRow[i];
                iColumnCount += col.colspan;
            } else {
                iColumnCount += 1;
            }
        }
            var row = columns[i][0];
                if (row.rowspan) {
                    iRowCount += row.rowspan;
                } else {
                    iRowCount += 1;
                }
            }
        }
    };
        var $dg = $(filter);
    };
        return Formatter($dg, headerFilter);
    };
        return Formatter($dg, bodyFilter);
    };
        var $dg = $(filter);
            for (var i = 0; i < cols.length; i++) {
                for (var j = 0; j < cols[i].length; j++) {
                    var f = cols[i][j];
                        fields.push(f.field);
                    }
                }
            }
        }
            var row = data[i];
                var f = fields[j];
            }
                rowHtml = '<td>' + (i + 1) + '</td>' + rowHtml;
            }
        }
    };
        var regex = new RegExp(regexReplace, "g");
            var parts1 = parts.first().html().replace(regex, "");
        }
            var parts1 = null;
        }
            var p1HTML = parts1[i] ? parts1[i].innerHTML : '';
        }
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