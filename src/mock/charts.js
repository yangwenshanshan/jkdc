// 图表相关接口
import Mock from "mockjs";
import { URL } from './../../config'
Mock.mock(URL + 'indicators/getIndicators',(option)=>{
    let list = [];
    let indicatorsNames = [
        '【单时段】某个银行的罚单数量',
        '【多时段】某个银行的罚单数量',
        '【同比变化】某个银行罚单数量',
        '【环比变化】某个银行罚单数量',
        '【单时段】某个全国性经营银行罚单数省分布',
        '【单时段】某个地区性经营银行的罚单数分支机构分布',
        '【单时段】某个银行各受罚领域罚单数和占比',
    ];
    let indicatorsMeanings = [
        '某月/某季度/某年度，监管机构针对某个银行的罚单数量（一个罚单号为一张罚单）',
        '多月份/多季度/多年度，监管机构针对某个银行的罚单数量（一个罚单号为一张罚单）',
        '"当期罚单数与往年同期罚单数的增减变化\n月度同比：当月-往年相同月份\n季度同比：当季-往年相同季度',
        '"相邻时间段的罚单数增减变化\n月度环比：本月-上月\n季度环比：本季度-上季度\n年度环比：本年-去年',
        '某月/某季度/某年度，某个全国性经营银行罚单数省分布',
        '某月/某季度/某年度，某个地区性经营银行或者某个全国性银行的省分行罚单数按分支机构分布',
        '某月/某季度/某年度，某个银行各受罚领域的罚单数以及占比情况',
    ];

    let scope = [
        '银行总体',
        '属地-省份',
        '银行群体-国有大行',
        '银行群体-国有大行',
        '银行群体-股份制银行',
        '银行群体-政策性银行',
        '银行群体-政策性银行',
        '银行群体-城商行',
        '银行群体-民营银行',
        '银行群体-外资银行',
        '银行群体-农商行',
        '银行群体-农村金融机构（不含农商行）',
        '银行群体-村镇银行',
        '个体银行',
        '属地-省份',
        '银行总体',
    ];
    let measurement = [
        '罚单数',
        '罚没金额',
        '受罚对象数',
        '问题点出现次数',
    ];
    let chartType = ['A1', 'A2', 'A3', 'B1', 'B2', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'G1', 'G2', 'G3', 'H1', 'H2', 'H3', 'H4', 'H5', 'I1', 'I2', 'I3', 'J1', 'J2', 'J3', 'J4', 'J5', 'K1', 'K2', 'K3', 'L1', 'L2', 'M1', 'N1', 'N2', 'N3', 'O1', 'O2', 'O3', 'O4', 'P1', 'P2', 'P3', 'R1', 'R2', 'S1', 'S2', 'S3',];
    for (let i = 0; i < 60; i++){
        list.push({
            indicatorsId: 'VI0' + i,
            scope: scope[parseInt(Math.random() * 16)],
            measurement: measurement[parseInt(Math.random() * 4)],
            icon: '图标' + parseInt(Math.random() * 6 + 1) + '号',
            used: '总览',
            indicatorsName: indicatorsNames[parseInt(Math.random() * 6)],
            indicatorsMeaning: indicatorsMeanings[parseInt(Math.random() * 6)],
            databaseName: '罚单数据库',
            screening: '行业：银行监管机构：⾦监局”/人民银行/外管局时段口径：公示日期/处罚日期',
            calculationMethod: '统计受罚机构和受罚个人的数量对于罚单类型为机构+个人的，分别计算其中的机构数和个人数',
            available: '1号/2号/4号',
            forbidden: '3号/5号/6号/7号/8号/9号',
            displayData: '顶部文字：银行总体表头：时段、受罚机构数、受罚个人数',
            chartTitle: '银行总体受罚对象数量',
            unit: '个',
            chartDescription: '分组柱状图横轴：时段纵轴：个数图例：机构和个人用不同颜色',
            chartClassification: chartType[i],
            explanatoryText: '文字模板：（时段1），（监管机构）针对（行业）的罚单中包含（XX个）机构、（XX个）责任人。（时段2），（监管机构）针对（行业）的罚单中包含（XX个）机构、（XX个）责任人。',
            explanatoryTextExample: '2020年1季度，⾦监局”针对银行的罚单中包含500个机构，460个责任人。2020年2季度，⾦监局”针对银行的罚单中包含800个机构，750个责任人。',
            status: '1',
        });
    }
    return {
        code: 200,
        data: list
    }
});
