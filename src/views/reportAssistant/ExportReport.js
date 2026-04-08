import JSZip from 'jszip'
import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
import dayjs from 'dayjs'
import {
    B01, B02, B03, B04, B05, B06, B07, B08, B09, B10, B11, B12, B13, B14, B15, B16, B17, B18, B19, B20, B21, B22, B23, B24, B25, B26, B27, B28,
    getAvailableDomainList,
    getReportDescription,
    getAnalysisReportDetail
} from './apis'


export const ExportReport = async ({ nameList, logicList, paramsList }) => {
    const zip = new JSZip()

    for (let i = 0; i < nameList.length; i++) {
        const name = nameList[i]
        const logics = logicList[i]
        const params = paramsList[i]
        const file = await getAnalysisReport(logics, params, name === '多家对比分析')
        zip.file(`报告-数据统计-${name}-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.xlsx`, file)
        const detailFile = await getDetailReport(params)
        zip.file(`报告-数据明细-${name}-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.xlsx`, detailFile)
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
        FileSaver.saveAs(content, `处罚报告及数据-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.zip`);
    });

}

let indexMap = {}
let domainList = ['B17', 'B18', 'B19', 'B12', 'B13', 'B14', 'B15']
let indexList = []
let domainObjList = []

export const getAnalysisReport = async (logics, params, isMulti = false) => {
    // 重置四个全局变量
    indexMap = {}
    domainList = ['B17', 'B18', 'B19', 'B12', 'B13', 'B14', 'B15']
    indexList = []
    domainObjList = []
    // 重置结束

    indexList = logics.filter(item => item.manual_id)
    indexMap = indexList.reduce((prev, cur) => {
        prev[cur.manual_id] = cur.name
        return prev
    }, {})
    indexList = indexList.map(item => item.manual_id)
    domainList = domainList.filter(item => indexList.includes(item))
    indexList = indexList.filter(item => !domainList.includes(item))
    if (!isMulti && domainList.length > 0) {
        const { data } = await getAvailableDomainList(params).run()
        data.sort((a, b) => b.reason_amount - a.reason_amount)
        domainObjList = data.slice(0, 5)
    }

    const workbook = new ExcelJS.Workbook()
    const sheet1 = workbook.addWorksheet('数据说明')
    await getAnalysisDescription(sheet1, params)

    for (let i = 0; i < indexList.length; i++) {
        const item = indexList[i];
        const sheet = workbook.addWorksheet(indexMap[item])
        console.log(item)
        await eval(`getSheet${item}`)(sheet, params)
    }
    for (let i = 0; i < domainObjList.length; i++) {
        const item = domainObjList[i]
        const paramsCom = {
            ...params,
            domain: item.domain_id
        }
        const sheet = workbook.addWorksheet(`典型领域_${item.domain_name}`)
        await getDomainList(sheet, paramsCom)
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

}

const getReturnCell = (sheet) => {
    const linkCell = sheet.getCell('A1');
    linkCell.value = {
        formula: 'HYPERLINK("#数据说明!A1", "返回目录")',
        result: '返回目录'
    };
    linkCell.font = {
        name: 'Arial',
        color: { argb: 'FF0000FF' },  // 蓝色
        underline: true,
        italic: true,
        size: 14
    };
    linkCell.alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getRow(1).height = 34
    sheet.getColumn('A').width = 20
}

const topHeaderStyle = {
    font: { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3373CA' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
        top: { style: 'thin', color: { argb: 'FF3373CA' } },
        left: { style: 'thin', color: { argb: 'FF3373CA' } },
        bottom: { style: 'thin', color: { argb: 'FF3373CA' } },
        right: { style: 'thin', color: { argb: 'FF3373CA' } }
    }
}
const normalHeaderStyle = {
    font: { name: 'Arial', size: 12, bold: false, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF429DDA' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
        top: { style: 'thin', color: { argb: 'FF3373CA' } },
        left: { style: 'thin', color: { argb: 'FF3373CA' } },
        bottom: { style: 'thin', color: { argb: 'FF3373CA' } },
        right: { style: 'thin', color: { argb: 'FF3373CA' } }
    }
}
const dataCellStyle = {
    font: { name: 'Arial', size: 12, bold: false, color: { argb: 'FF000000' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
        top: { style: 'thin', color: { argb: 'FF3373CA' } },
        left: { style: 'thin', color: { argb: 'FF3373CA' } },
        bottom: { style: 'thin', color: { argb: 'FF3373CA' } },
        right: { style: 'thin', color: { argb: 'FF3373CA' } }
    }
}

const createTableWithColumns = (sheet, columns, data, startRow = 2, startCol = 2) => {
    // 存储所有表头行的数据
    const headerRows = [];
    // 存储最终的叶子列（包含key的列）
    const leafColumns = [];
    // 合并范围
    const mergeRanges = [];

    // 递归处理列结构
    function processColumns(columns, currentDepth = 0, currentStartCol = startCol, parentPath = '') {
        let currentColIndex = currentStartCol;

        // 确保当前深度的行数组存在
        if (!headerRows[currentDepth]) {
            headerRows[currentDepth] = [];
        }

        columns.forEach(col => {
            const children = col.children || [];
            const hasChildren = children.length > 0;
            const isLeaf = !hasChildren && col.key !== undefined;

            // 计算当前列跨越的列数
            let colSpan = 1;
            if (hasChildren) {
                // 递归处理子列，并获取子列的总跨度
                const endCol = processColumns(children, currentDepth + 1, currentColIndex, parentPath + col.header + '|');
                colSpan = endCol - currentColIndex;
            }

            // 记录当前列的表头信息
            headerRows[currentDepth].push({
                value: col.header,
                startCol: currentColIndex,
                endCol: currentColIndex + colSpan - 1,
                style: currentDepth === 0 ? topHeaderStyle : normalHeaderStyle
            });

            // 记录合并范围（如果跨越多列）
            if (colSpan > 1) {
                mergeRanges.push({
                    start: { row: startRow + currentDepth, col: currentColIndex },
                    end: { row: startRow + currentDepth, col: currentColIndex + colSpan - 1 }
                });
            }

            // 如果是叶子节点，记录到leafColumns中
            if (isLeaf) {
                leafColumns.push({
                    key: col.key,
                    width: col.width,
                    header: col.header,
                    colIndex: currentColIndex
                });
            }

            currentColIndex += colSpan;
        });

        return currentColIndex;
    }

    // 开始处理列结构
    processColumns(columns);

    // 计算实际使用的总列数（基于叶子节点数量）
    const totalLeafCols = leafColumns.length;
    // 计算结束列位置
    const endCol = startCol + totalLeafCols - 1;

    // 设置列宽
    leafColumns.forEach(leafCol => {
        const colIndex = leafCol.colIndex;
        if (colIndex <= totalLeafCols + startCol - 1) {
            const col = sheet.getColumn(colIndex);
            if (col) {
                col.width = leafCol.width || 20;
            }
        }
    });

    // 先创建所有表头行（确保行存在）
    for (let depth = 0; depth < headerRows.length; depth++) {
        const rowIndex = startRow + depth;
        let row = sheet.getRow(rowIndex);

        // 如果行不存在，创建新行并用空值填充（从startCol开始考虑）
        if (!row) {
            // 创建足够长的空行，确保覆盖所有列
            const emptyRow = new Array(endCol).fill('');
            row = sheet.addRow(emptyRow);
        }

        // 设置行高
        row.height = 34;
    }

    // 填充表头数据
    headerRows.forEach((rowData, depth) => {
        const rowIndex = startRow + depth;
        const row = sheet.getRow(rowIndex);

        // 清空该行从startCol到endCol的单元格
        for (let col = startCol; col <= endCol; col++) {
            const cell = row.getCell(col);
            cell.value = '';
        }

        // 填充表头数据
        rowData.forEach(header => {
            const startColIndex = header.startCol;
            const endColIndex = Math.min(header.endCol, endCol); // 确保不超出结束列

            // 只在起始列设置值
            const startCell = row.getCell(startColIndex);
            startCell.value = header.value;
            startCell.style = header.style;

            // 为合并范围内的其他单元格设置样式（但不设置值）
            for (let col = startColIndex + 1; col <= endColIndex; col++) {
                const cell = row.getCell(col);
                cell.style = header.style;
            }
        });
    });

    // 合并表头单元格
    mergeRanges.forEach(range => {
        // 确保合并范围在有效范围内
        if (range.start.col <= endCol && range.end.col <= endCol) {
            try {
                sheet.mergeCells(
                    range.start.row, range.start.col,
                    range.end.row, range.end.col
                );

                // 确保合并后的单元格样式正确
                const cell = sheet.getCell(range.start.row, range.start.col);
                const depth = range.start.row - startRow;
                cell.style = depth === 0 ? topHeaderStyle : normalHeaderStyle;
            } catch (error) {
                console.warn('合并单元格失败:', error.message);
            }
        }
    });

    // 添加数据行
    data.forEach(item => {
        const rowData = new Array(startCol - 1).fill(''); // 填充startCol之前的空单元格

        // 添加实际数据
        const actualData = leafColumns.map(col => {
            // 支持嵌套属性的访问，如 'user.name'
            if (col.key && col.key.includes('.')) {
                const keys = col.key.split('.');
                let value = item;
                for (const key of keys) {
                    value = value ? value[key] : '';
                }
                return value || '';
            }
            return item[col.key] || '';
        });

        rowData.push(...actualData);

        const row = sheet.addRow(rowData);

        // 应用数据单元格样式（只对数据列应用样式）
        row.eachCell((cell, colNumber) => {
            if (colNumber >= startCol) {
                cell.style = dataCellStyle;
            }
        });
    });

    getReturnCell(sheet);
}

const getAnalysisDescription = async (sheet, params, showList = true) => {
    sheet.getColumn('A').width = 50
    sheet.getColumn('B').width = 80
    const { data } = await getReportDescription(params).run()
    const first = sheet.addRow([`本次数据于 ${dayjs().format('YYYY-MM-DD HH:mm:ss')} 导出`, ""])
    first.getCell(1).style = topHeaderStyle
    first.getCell(2).style = topHeaderStyle
    const second = sheet.addRow(["本次导出数据的数据筛选条件如下：", ""])
    second.getCell(1).style = normalHeaderStyle
    second.getCell(2).style = normalHeaderStyle

    for (const key in data) {
        if (key !== "领域") {
            const val = data[key]
            const r = sheet.addRow([`${key}:`, val.toString()])
            r.getCell(1).style = {
                font: { name: 'Arial' }
            }
            r.getCell(2).style = {
                font: { name: 'Arial', size: 14, bold: true, color: { argb: 'FF0070C0' } }
            }
        }
    }

    if (showList) {
        sheet.addRow([])
        const r1 = sheet.addRow(["统计指标目录"])
        r1.getCell(1).style = {
            font: { name: 'Arial' }
        }


        const r2 = sheet.addRow(["序号", "表名"])
        r2.getCell(1).style = {
            font: { name: 'Arial' }
        }
        r2.getCell(2).style = {
            font: { name: 'Arial' }
        }

        indexList.forEach((item, index) => {
            const row = sheet.addRow([`${index + 1}`, ''])
            row.getCell(1).style = {
                font: { name: 'Arial' }
            }
            const cell = row.getCell(2)
            const name = indexMap[item]
            cell.value = {
                formula: `HYPERLINK("#'${name}'!A1", "${name}")`,
                result: name
            };
            cell.font = {
                name: 'Arial',
                color: { argb: 'FF0000FF' },  // 蓝色
                underline: true,
            };
        })

        domainObjList.forEach((item, index) => {
            const row = sheet.addRow([`${indexList.length + index + 1}`, ''])
            const cell = row.getCell(2)
            const name = `典型领域_${item.domain_name}`
            cell.value = {
                formula: `HYPERLINK("#'${name}'!A1", "${name}")`,
                result: name
            };
            cell.font = {
                name: 'Arial',
                color: { argb: 'FF0000FF' },  // 蓝色
                underline: true,
            };
        })
    }

}

const getSheetB01 = async (sheet, params) => {
    const { data } = await B01(params).run()
    createTableWithColumns(sheet,
        [
            {
                header: indexMap['B01'],
                children: [
                    {
                        header: "监管机构类型",
                        key: "regulator_type",
                    },
                    {
                        header: "罚单数（张）",
                        key: "ticket_count",
                    },
                    {
                        header: "案由数（个）",
                        key: "reason_count",
                    },
                    {
                        header: "罚没金额（万元）",
                        key: "total_amount",
                    },
                ]
            },
        ],
        data
    )
}

const getSheetB02 = async (sheet, params) => {
    const { data } = await B02(params).run()
    const columns = [
        {
            header: indexMap['B02'],
            children: [
                {
                    header: "",
                    children: [
                        {
                            header: "时段",
                            key: "period",
                            width: 15
                        }
                    ]
                },
                {
                    header: "金监局",
                    children: [
                        {
                            header: "罚单数（张）",
                            key: "ticket_count_jinjianju",
                        },
                        {
                            header: "案由数（个）",
                            key: "reason_count_jinjianju",
                        },
                        {
                            header: "罚没金额（万元）",
                            key: "total_amount_jinjianju",
                            width: 25
                        },
                    ]
                },
                {
                    header: "人民银行",
                    children: [
                        {
                            header: "罚单数（张）",
                            key: "ticket_count_renminyinhang",
                        },
                        {
                            header: "案由数（个）",
                            key: "reason_count_renminyinhang",
                        },
                        {
                            header: "罚没金额（万元）",
                            key: "total_amount_renminyinhang",
                            width: 25
                        },
                    ]
                },
                {
                    header: "外管局",
                    children: [
                        {
                            header: "罚单数（张）",
                            key: "ticket_count_waiguanju",
                        },
                        {
                            header: "案由数（个）",
                            key: "reason_count_waiguanju",
                        },
                        {
                            header: "罚没金额（万元）",
                            key: "total_amount_waiguanju",
                            width: 25
                        },
                    ]
                },
                {
                    header: "合计",
                    children: [
                        {
                            header: "罚单数（张）",
                            key: "ticket_count_total",
                        },
                        {
                            header: "案由数（个）",
                            key: "reason_count_total",
                        },
                        {
                            header: "罚没金额（万元）",
                            key: "total_amount_total",
                            width: 25
                        },
                    ]
                },
            ]
        },
    ]
    const arr = []
    data.forEach(item => {
        arr.push({
            period: item.period,
            ticket_count_total: item.total.ticket_count,
            reason_count_total: item.total.reason_count,
            total_amount_total: item.total.total_amount.toFixed(2),
            ticket_count_jinjianju: item.jinjianju.ticket_count,
            reason_count_jinjianju: item.jinjianju.reason_count,
            total_amount_jinjianju: item.jinjianju.total_amount.toFixed(2),
            ticket_count_waiguanju: item.waiguanju.ticket_count,
            reason_count_waiguanju: item.waiguanju.reason_count,
            total_amount_waiguanju: item.waiguanju.total_amount.toFixed(2),
            ticket_count_renminyinhang: item.renminyinhang.ticket_count,
            reason_count_renminyinhang: item.renminyinhang.reason_count,
            total_amount_renminyinhang: item.renminyinhang.total_amount.toFixed(2),
            ticket_count_total: item.total.ticket_count,
            reason_count_total: item.total.reason_count,
            total_amount_total: item.total.total_amount.toFixed(2),
        })
    })
    createTableWithColumns(sheet, columns, arr)
}

const getSheetB03 = async (sheet, params) => {
    const { data } = await B03(params).run()
    createTableWithColumns(sheet, [
        {
            header: indexMap['B03'],
            children: [
                {
                    header: "银行类型",
                    key: "financial_institution_type",
                },
                {
                    header: "受罚机构数",
                    key: "institution_count",
                },
                {
                    header: "受罚个人数",
                    key: "individual_count",
                }
            ]
        },
    ], data)
}

const getSheetB28 = async (sheet, params) => {
    const { data } = await B28(params).run()
    createTableWithColumns(sheet, [
        {
            header: indexMap['B28'],
            children: [
                {
                    header: "银行类型",
                    key: "institution_name",
                },
                {
                    header: "受罚机构数",
                    key: "institution_penalized_count",
                },
                {
                    header: "受罚个人数",
                    key: "individual_penalized_count",
                }
            ]
        },
    ], data)
}

const getSheetB04 = async (sheet, params) => {
    const { data } = await B04(params).run()
    createTableWithColumns(sheet, [
        {
            header: indexMap['B04'],
            children: [
                {
                    header: "时段",
                    key: "period",
                },
                {
                    header: "受罚机构数",
                    key: "institution_count",
                },
                {
                    header: "受罚个人数",
                    key: "individual_count",
                },
            ]
        },
    ], data)
}

const getSheetB05 = async (sheet, params) => {
    const { data } = await B05(params).run()
    createTableWithColumns(sheet, [
        {
            header: indexMap['B05'],
            children: [
                {
                    header: "监管机构类型",
                    key: "head_office",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count",
                    type: "bar"
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount",
                    type: "bar"
                },
            ]
        },
    ], data)
}

const getSheetB06 = async (sheet, params) => {
    const { data } = await B06(params).run()
    createTableWithColumns(sheet, [
        {
            header: indexMap['B06'],
            children: [
                {
                    header: "省/市",
                    key: "area_name",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount",
                },
            ]
        },
    ], data)
}

const getSheetB07 = async (sheet, params) => {
    const { data } = await B07(params).run()
    createTableWithColumns(sheet, [
        {
            header: indexMap['B07'],
            children: [
                {
                    header: "银行类型",
                    key: "institution_type_name",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount",
                },
            ]
        },
    ], data)
}

const getSheetB10 = async (sheet, params) => {
    const { data } = await B10(params).run()
    createTableWithColumns(sheet, [
        {
            header: indexMap['B10'],
            children: [
                {
                    header: "领域名称",
                    key: "domain_name",
                },
                {
                    header: "案由数（个）",
                    key: "reason_count",
                },
                {
                    header: "案由金额（万元）",
                    key: "total_amount",
                },
            ]
        },
    ], data)
}

const getSheetB11 = async (sheet, params) => {
    const { data } = await B11(params).run()
    createTableWithColumns(sheet, [
        {
            header: indexMap['B11'],
            children: [
                {
                    header: "名次",
                    key: "rank",
                },
                {
                    header: "处罚机构",
                    key: "regulator_name",
                },
                {
                    header: "处罚文号",
                    key: "document_number",
                    width: 40,
                },
                {
                    header: "受罚机构名称",
                    key: "institution_name",
                    width: 40,
                },
                {
                    header: "违规事实",
                    key: "reason_content",
                    width: 100,
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount",
                },
            ]
        },
    ], data)
}

const getSheetB20 = async (sheet, params) => {
    const { data } = await B20(params).run()
    createTableWithColumns(sheet, [
        {
            header: indexMap['B20'],
            children: [
                {
                    header: "名次",
                    key: "rank",
                },
                {
                    header: "银行名称",
                    key: "bank_name",
                    width: 40,
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count",
                },
                {
                    header: "案由数（个）",
                    key: "reason_count",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount",
                },
            ]
        },
    ], data)
}

const getSheetB21 = async (sheet, params) => {
    const { data } = await B21(params).run()
    const columns1 = [
        {
            header: "名次",
            key: "rank",
        },
        {
            header: "银行名称",
            key: "bank_name",
            width: 40,
        },
        {
            header: "罚单数（张）",
            key: "ticket_count",
        },
    ]
    const columns2 = [
        {
            header: "名次",
            key: "rank",
        },
        {
            header: "银行名称",
            key: "bank_name",
            width: 40,
        },
        {
            header: "罚没金额（万元）",
            key: "total_amount",
        },
    ]
    const datas1 = data.ticket_count_ranking
    const datas2 = data.total_amount_ranking

    createTableWithColumns(sheet, columns1, datas1, 2, 2)
    createTableWithColumns(sheet, columns2, datas2, 2 + datas1.length + 4, 2)
}

const getSheetB22 = async (sheet, params) => {
    const dealDatas = (originArr) => {
        let arr = []
        const _keys = Object.keys(originArr)
        _keys.forEach((key) => {
            const val = originArr[key]
            if (val.financial_institutions.length > arr.length) {
                arr = val.financial_institutions
            }
        })
        arr = arr.map((item) => ({
            bank_name: item.financial_institution_name,
        }))
        _keys.forEach((key, keyIndex) => {
            const _orig = originArr[key].financial_institutions
            _orig.forEach((item, index) => {
                const _prev = originArr?.[_keys?.[keyIndex - 1]]?.financial_institutions?.[index]
                const isUp = (_prev === undefined || typeof item.rank !== 'number') ? false : item.rank < _prev.rank
                const isDown = (_prev === undefined || typeof item.rank !== 'number') ? false : item.rank > _prev.rank
                arr[index][`${key}_rank`] = `${item.rank} ${isUp ? '↑' : isDown ? '↓' : ''}`
                arr[index][`${key}_value`] = item.ticket_count ?? item.total_amount
            })
        })
        return arr
    }
    const dimensionOrigin = [
        {
            header: "",
            children: [
                {
                    header: "银行名称",
                    key: "bank_name",
                    width: 40,
                }
            ]
        }
    ]

    const { data } = await B22(params).run()
    const arr1 = []
    const arr2 = []
    for (const key in data.ticket_count_ranking_trend) {
        const val = data.ticket_count_ranking_trend[key]
        arr1.push({
            header: val.date_description,
            children: [
                {
                    header: "罚单数（张）",
                    key: `${key}_value`,
                },
                {
                    header: "罚单数名次",
                    key: `${key}_rank`,
                },
            ]
        })
        arr2.push({
            header: val.date_description,
            children: [
                {
                    header: "罚没金额（万元）",
                    key: `${key}_value`,
                },
                {
                    header: "罚没金额名次",
                    key: `${key}_rank`,
                },
            ]
        })
    }
    const columns1 = [...dimensionOrigin, ...arr1]
    const columns2 = [...dimensionOrigin, ...arr2]

    const datas1 = dealDatas(data.ticket_count_ranking_trend)
    const datas2 = dealDatas(data.total_amount_ranking_trend)

    createTableWithColumns(sheet, columns1, datas1, 2, 2)
    createTableWithColumns(sheet, columns2, datas2, 2 + datas1.length + 5, 2)
}

const getSheetB23 = async (sheet, params) => {
    const { data } = await B23(params).run()
    const columns1 = [
        {
            header: '',
            children: [
                {
                    header: "银行名称",
                    key: "bank_name",
                    width: 40,
                }
            ]
        }, {
            header: '第一名',
            children: [
                {
                    header: "省/市",
                    key: "area_name_1",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count_1",
                },
            ]
        }, {
            header: '第二名',
            children: [
                {
                    header: "省/市",
                    key: "area_name_2",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count_2",
                },
            ]
        }, {
            header: '第三名',
            children: [
                {
                    header: "省/市",
                    key: "area_name_3",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count_3",
                },
            ]
        }, {
            header: '第四名',
            children: [
                {
                    header: "省/市",
                    key: "area_name_4",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count_4",
                },
            ]
        }, {
            header: '第五名',
            children: [
                {
                    header: "省/市",
                    key: "area_name_5",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count_5",
                },
            ]
        },
    ]
    const columns2 = [
        {
            header: '',
            children: [
                {
                    header: "银行名称",
                    key: "bank_name",
                    width: 40,
                }
            ]
        }, {
            header: '第一名',
            children: [
                {
                    header: "省/市",
                    key: "area_name_1",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount_1",
                },
            ]
        }, {
            header: '第二名',
            children: [
                {
                    header: "省/市",
                    key: "area_name_2",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount_2",
                },
            ]
        }, {
            header: '第三名',
            children: [
                {
                    header: "省/市",
                    key: "area_name_3",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount_3",
                },
            ]
        }, {
            header: '第四名',
            children: [
                {
                    header: "省/市",
                    key: "area_name_4",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount_4",
                },
            ]
        }, {
            header: '第五名',
            children: [
                {
                    header: "省/市",
                    key: "area_name_5",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount_5",
                },
            ]
        },
    ]

    const datas1 = data.ticket_count_ranking.map(item => {
        return {
            bank_name: item.institution_name,
            area_name_1: item.areas?.[0]?.area_short_name,
            area_name_2: item.areas?.[1]?.area_short_name,
            area_name_3: item.areas?.[2]?.area_short_name,
            area_name_4: item.areas?.[3]?.area_short_name,
            area_name_5: item.areas?.[4]?.area_short_name,
            ticket_count_1: item.areas?.[0]?.ticket_count,
            ticket_count_2: item.areas?.[1]?.ticket_count,
            ticket_count_3: item.areas?.[2]?.ticket_count,
            ticket_count_4: item.areas?.[3]?.ticket_count,
            ticket_count_5: item.areas?.[4]?.ticket_count,
        }
    })
    const datas2 = data.total_amount_ranking.map(item => {
        return {
            bank_name: item.institution_name,
            area_name_1: item.areas?.[0]?.area_short_name,
            area_name_2: item.areas?.[1]?.area_short_name,
            area_name_3: item.areas?.[2]?.area_short_name,
            area_name_4: item.areas?.[3]?.area_short_name,
            area_name_5: item.areas?.[4]?.area_short_name,
            total_amount_1: item.areas?.[0]?.total_amount,
            total_amount_2: item.areas?.[1]?.total_amount,
            total_amount_3: item.areas?.[2]?.total_amount,
            total_amount_4: item.areas?.[3]?.total_amount,
            total_amount_5: item.areas?.[4]?.total_amount,
        }
    })

    createTableWithColumns(sheet, columns1, datas1, 2, 2)
    createTableWithColumns(sheet, columns2, datas2, 2 + datas1.length + 5, 2)
}

const getSheetB24 = async (sheet, params) => {
    const dealDatas = (originArr) => {
        let _x = []
        const _keys = Object.keys(originArr)
        _keys.forEach((key) => {
            const val = originArr[key]
            if (val.areas.length > _x.length) {
                _x = val.areas
            }
        })
        const arr = _x.map((item) => ({
            area_short_name: item.area_short_name,
        }))
        _keys.forEach((key) => {
            const _orig = originArr[key].areas
            arr.forEach((item, index) => {
                const findItem = _orig.find((i) => i.area_short_name === item.area_short_name)
                arr[index][`count_${key}`] = findItem?.value ?? '-'
                arr[index][`rank_${key}`] = findItem?.ranking ?? '-'
            })
        })
        return arr
    }

    const { data } = await B24(params).run()
    const columnsOrigin = [
        {
            header: "",
            children: [{
                header: "省/市",
                key: "area_short_name",
            }]
        }
    ]
    const counts = data.ticket_count_ranking
    const _keys = Object.keys(counts)
    const arr1 = []
    const arr2 = []
    _keys.forEach((key) => {
        arr1.push({
            header: key,
            key: `${key}_name`,
            children: [
                {
                    header: '罚单数（张）',
                    key: `count_${key}`,
                },
                {
                    header: '名次',
                    key: `rank_${key}`,
                }
            ]
        })
        arr2.push({
            header: key,
            key: `${key}_name`,
            children: [
                {
                    header: '罚没金额（万元）',
                    key: `count_${key}`,
                },
                {
                    header: '名次',
                    key: `rank_${key}`,
                }
            ]
        })
    })
    const columns1 = [...columnsOrigin, ...arr1]
    const columns2 = [...columnsOrigin, ...arr2]

    const datas1 = dealDatas(counts)
    const datas2 = dealDatas(data.total_amount_ranking)

    createTableWithColumns(sheet, columns1, datas1, 2, 2)
    createTableWithColumns(sheet, columns2, datas2, 2 + datas1.length + 5, 2)
}

const getSheetB25 = async (sheet, params) => {
    const { data } = await B25(params).run()
    const columns1 = [
        {
            header: '',
            children: [
                {
                    header: "银行名称",
                    key: "bank_name",
                    width: 40,
                }
            ]
        }, {
            header: '第一名',
            children: [
                {
                    header: "领域名称",
                    key: "domains_1",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count_1",
                },
            ]
        }, {
            header: '第二名',
            children: [
                {
                    header: "领域名称",
                    key: "domains_2",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count_2",
                },
            ]
        }, {
            header: '第三名',
            children: [
                {
                    header: "领域名称",
                    key: "domains_3",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count_3",
                },
            ]
        }, {
            header: '第四名',
            children: [
                {
                    header: "领域名称",
                    key: "domains_4",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count_4",
                },
            ]
        }, {
            header: '第五名',
            children: [
                {
                    header: "领域名称",
                    key: "domains_5",
                },
                {
                    header: "罚单数（张）",
                    key: "ticket_count_5",
                },
            ]
        },
    ]
    const columns2 = [
        {
            header: '',
            children: [
                {
                    header: "银行名称",
                    key: "bank_name",
                    width: 40,
                }
            ]
        }, {
            header: '第一名',
            children: [
                {
                    header: "领域名称",
                    key: "domains_1",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount_1",
                },
            ]
        }, {
            header: '第二名',
            children: [
                {
                    header: "领域名称",
                    key: "domains_2",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount_2",
                },
            ]
        }, {
            header: '第三名',
            children: [
                {
                    header: "领域名称",
                    key: "domains_3",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount_3",
                },
            ]
        }, {
            header: '第四名',
            children: [
                {
                    header: "领域名称",
                    key: "domains_4",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount_4",
                },
            ]
        }, {
            header: '第五名',
            children: [
                {
                    header: "领域名称",
                    key: "domains_5",
                },
                {
                    header: "罚没金额（万元）",
                    key: "total_amount_5",
                },
            ]
        },
    ]

    const datas1 = data.reason_count_ranking.map(item => {
        return {
            bank_name: item.institution_name,
            domains_1: item.top5_domains?.[0]?.domain_name,
            domains_2: item.top5_domains?.[1]?.domain_name,
            domains_3: item.top5_domains?.[2]?.domain_name,
            domains_4: item.top5_domains?.[3]?.domain_name,
            domains_5: item.top5_domains?.[4]?.domain_name,
            ticket_count_1: item.top5_domains?.[0]?.reason_count,
            ticket_count_2: item.top5_domains?.[1]?.reason_count,
            ticket_count_3: item.top5_domains?.[2]?.reason_count,
            ticket_count_4: item.top5_domains?.[3]?.reason_count,
            ticket_count_5: item.top5_domains?.[4]?.reason_count,
        }
    })
    const datas2 = data.reason_amount_ranking.map(item => {
        return {
            bank_name: item.institution_name,
            domains_1: item.top5_domains?.[0]?.domain_name,
            domains_2: item.top5_domains?.[1]?.domain_name,
            domains_3: item.top5_domains?.[2]?.domain_name,
            domains_4: item.top5_domains?.[3]?.domain_name,
            domains_5: item.top5_domains?.[4]?.domain_name,
            total_amount_1: item.top5_domains?.[0]?.reason_amount,
            total_amount_2: item.top5_domains?.[1]?.reason_amount,
            total_amount_3: item.top5_domains?.[2]?.reason_amount,
            total_amount_4: item.top5_domains?.[3]?.reason_amount,
            total_amount_5: item.top5_domains?.[4]?.reason_amount,
        }
    })

    createTableWithColumns(sheet, columns1, datas1, 2, 2)
    createTableWithColumns(sheet, columns2, datas2, 2 + datas1.length + 5, 2)
}

const getSheetB26 = async (sheet, params) => {
    const { data } = await B26(params).run()
    const dimensionOrigin = [
        {
            header: "",
            children: [
                {
                    header: "银行名称",
                    key: "bank_name",
                },
            ]
        },
    ]
    const countItems = data.reason_count_ranking.map(item => item.domain_name) || []
    const countBanks = data.reason_count_ranking?.[0]?.bank_rankings.map(item => item.institution_name) || []
    const totalItems = data.reason_amount_ranking.map(item => item.domain_name) || []
    const totalBanks = data.reason_amount_ranking?.[0]?.bank_rankings.map(item => item.institution_name) || []
    const arr1 = []
    const arr2 = []
    countItems.forEach(item => {
        arr1.push({
            key: `domain_name_${item}`,
            header: item,
            children: [
                {
                    key: `count_${item}`,
                    header: '案由数（个）',
                },
                {
                    key: `rank_${item}`,
                    header: '名次',
                    minWidth: 10,
                }
            ]
        })
    })
    totalItems.forEach(item => {
        arr2.push({
            key: `domain_name_${item}`,
            header: item,
            children: [
                {
                    key: `count_${item}`,
                    header: '案由金额（万元）',
                },
                {
                    key: `rank_${item}`,
                    header: '名次',
                    minWidth: 10,
                }
            ]
        })
    })
    const columns1 = [...dimensionOrigin, ...arr1]
    const columns2 = [...dimensionOrigin, ...arr2]

    const datas1 = countBanks.map(bank => {
        const obj = {
            bank_name: bank,
        }
        data.reason_count_ranking.forEach(item => {
            const x = item.bank_rankings?.find(ranking => ranking.institution_name === bank)
            if (x) {
                obj[`count_${item.domain_name}`] = x.value
                obj[`rank_${item.domain_name}`] = x.ranking
            }
        })
        return obj
    })
    const datas2 = totalBanks.map(bank => {
        const obj = {
            bank_name: bank,
        }
        data.reason_amount_ranking.forEach(item => {
            const x = item.bank_rankings?.find(ranking => ranking.institution_name === bank)
            if (x) {
                obj[`count_${item.domain_name}`] = x.value
                obj[`rank_${item.domain_name}`] = x.ranking
            }
        })
        return obj
    })

    createTableWithColumns(sheet, columns1, datas1, 2, 2)
    createTableWithColumns(sheet, columns2, datas2, 2 + datas1.length + 5, 2)
}

const getSheetB27 = async (sheet, params) => {
    const { data } = await B27(params).run()
    const columnss = data.reason_count_ranking.map(item => {
        return [{
            header: item.institution_name,
            key: 'bank_name',
            children: [
                {
                    header: '名次',
                    key: 'ranking',
                    width: 10
                },
                {
                    header: '问题类型',
                    key: 'problem_type_name',
                    width: 50
                },
                {
                    header: '案由数（个）',
                    key: 'reason_count',
                },
                {
                    header: '案由金额（万元）',
                    key: 'reason_amount',
                },
            ]
        }]
    })

    const datas1 = data.reason_count_ranking.map(item => {
        return item.top10_problem_types
    })
    const datas2 = data.reason_amount_ranking.map(item => {
        return item.top10_problem_types
    })

    let startRow = 2
    columnss.forEach((item, index) => {
        createTableWithColumns(sheet, [
            {
                header: "按案由数",
                children: item
            }
        ], datas1[index], startRow, 2)
        startRow += datas1[index].length + 4
    })
    startRow += 4
    columnss.forEach((item, index) => {
        createTableWithColumns(sheet, [
            {
                header: "按案由金额",
                children: item
            }
        ], datas2[index], startRow, 2)
        startRow += datas2[index].length + 4
    })
}

const getDomainDataB17 = async (params) => {
    const { data } = await B17(params).run()
    const columns = [{
        header: indexMap["B17"],
        children: [
            {
                header: "监管机构类型",
                key: "regulator_type_name",
                width: 40
            },
            {
                header: "罚单数（张）",
                key: "ticket_count",
            },
            {
                header: "案由数（个）",
                key: "reason_count",
            },
            {
                header: "案由金额（万元）",
                key: "total_amount",
            },
        ]
    }]
    const datas = data
    return {
        columns,
        datas
    }
}
const getDomainDataB18 = async (params) => {
    const { data } = await B18(params).run()
    const columns = [{
        header: indexMap["B18"],
        children: [
            {
                header: "省/市",
                key: "area_name",
                width: 40
            },
            {
                header: "罚单数（张）",
                key: "ticket_count",
                type: "bar"
            },
            {
                header: "案由数（个）",
                key: "reason_count",
                type: "bar"
            },
            {
                header: "案由金额（万元）",
                key: "total_amount",
                type: "line"
            },
        ]
    }]
    const datas = data
    return {
        columns,
        datas
    }
}
const getDomainDataB19 = async (params) => {
    const { data } = await B19(params).run()
    const columns = [{
        header: indexMap["B19"],
        children: [
            {
                header: "银行类型",
                key: "bank_type_name",
                width: 40
            },
            {
                header: "罚单数（张）",
                key: "ticket_count",
            },
            {
                header: "案由数（个）",
                key: "reason_count",
            },
            {
                header: "案由金额（万元）",
                key: "total_amount",
            },
        ]
    }]
    const datas = data
    return {
        columns,
        datas
    }
}
const getDomainDataB12 = async (params) => {
    const { data } = await B12(params).run()
    const columns = [{
        header: indexMap["B12"],
        children: [
            {
                header: "子领域",
                key: "sub_domain_name",
                width: 40
            },
            {
                header: "案由数（个）",
                key: "reason_count",
            },
            {
                header: "案由金额（万元）",
                key: "total_amount",
            },
        ]
    }]
    const datas = data
    return {
        columns,
        datas
    }
}
const getDomainDataB13 = async (params) => {
    const { data } = await B13(params).run()
    const columns = [{
        header: indexMap["B13"],
        children: [
            {
                header: "时段",
                key: "period",
                width: 40
            },
            {
                header: "案由数（个）",
                key: "reason_count",
            },
            {
                header: "案由金额（万元）",
                key: "total_amount",
            },
        ]
    }]
    const datas = data
    return {
        columns,
        datas
    }
}
const getDomainDataB14 = async (params) => {
    const { data } = await B14(params).run()
    const columns = [{
        header: indexMap["B14"],
        children: [
            {
                header: "典型问题类型",
                key: "problem_type_name",
                width: 40
            },
            {
                header: "案由数（个）",
                key: "reason_count",
            },
            {
                header: "案由金额（万元）",
                key: "total_amount",
            },
        ]
    }]
    const datas = data
    return {
        columns,
        datas
    }
}
const getDomainDataB15 = async (params) => {
    const { data } = await B15(params).run()
    const columns = [
        {
            header: "时段",
            key: "time_period",
            width: 40
        },
        {
            header: "案由数（个）",
            key: "reason_count",
        },
        {
            header: "案由金额（万元）",
            key: "total_amount",
        },
    ]

    return data.map((item, index) => {
        return {
            columns: [{
                header: `问题类型${index + 1}：${item.problem_type_name}`,
                children: columns
            }],
            datas: item.trend_data
        }
    })
}

const getDomainList = async (sheet, params) => {
    let startRow = 2
    for (let i = 0; i < domainList.length; i++) {
        const item = domainList[i];
        if (item !== 'B15') {
            const { columns, datas } = await eval(`getDomainData${item}`)({ ...params, domain_name: item })
            createTableWithColumns(sheet, columns, datas, startRow, 2)
            startRow += datas.length + 5
        } else {
            const arr = await getDomainDataB15({ ...params, domain_name: item })
            arr.forEach(item => {
                createTableWithColumns(sheet, item.columns, item.datas, startRow, 2)
                startRow += item.datas.length + 5
            })
        }
    }
}

export const getDetailReport = async (params) => {
    const paramsCom = {
        ...params,
        domain: undefined
    }
    const workbook = new ExcelJS.Workbook()
    const sheet1 = workbook.addWorksheet('数据说明')
    getAnalysisDescription(sheet1, paramsCom, false)

    const { data } = await getAnalysisReportDetail(paramsCom).run()
    const sheet = workbook.addWorksheet('数据明细')
    const columns = [
        {
            header: "罚单 ID",
            key: "manual_id",
        },
        {
            header: "处罚日期",
            key: "date_issued",
        },
        {
            header: "公示日期",
            key: "date_published",
        },
        {
            header: "受罚领域",
            key: "domain",
            width: 40
        },
        {
            header: "问题类型",
            key: "problem_type",
            width: 40
        },
        {
            header: "被罚实体类型",
            key: "penalized_entity",
        },
        {
            header: "罚单分类/双罚",
            key: "category",
        },
        {
            header: "受罚个人",
            key: "individual_name",
        },
        {
            header: "职位",
            key: "individual_position",
        },
        {
            header: "受罚机构/时任机构",
            key: "institution_name",
            width: 40
        },
        {
            header: "受罚机构负责人",
            key: "institution_manager",
        },
        {
            header: "违规事实（案由）",
            key: "reason_content",
            width: 40
        },
        {
            header: "处罚内容",
            key: "penalty_content",
            width: 40
        },
        {
            header: "处罚依据",
            key: "penalty_basis",
            width: 40
        },
        {
            header: "处罚机关",
            key: "regulator_name",
            width: 40
        },
        {
            header: "处罚文号",
            key: "document_number",
            width: 40
        },
        {
            header: "罚单计数",
            key: "ticket_count",
        },
        {
            header: "机构罚没(单位:万元)",
            key: "institution_fine",
        },
        {
            header: "个⼈罚款(单位:万元)",
            key: "individual_fine",
        },
        {
            header: "合计罚没(单位:万元)",
            key: "total_fine",
        },
    ]

    createTableWithColumns(sheet, columns, data, 2, 2)

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
}

export const exportTicketReport = async (params) => {

}