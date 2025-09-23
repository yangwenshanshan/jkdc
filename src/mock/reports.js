// 信息报告相关接口
import Mock from "mockjs";
import { URL } from './../../config'

Mock.mock(URL + 'report/getListedBank','post',(option)=>{
    console.log(option);
    return {
        code: 200,
        data: [{
            listedBankId: '1',
            listedBankName: '工商银行',
            address: 'SH',
            unitTypeId: '1',
            unitType: '机构类型',
            timeSH: '2020-02-01',
            timeHK: '2020-02-01',
            timeSZ: '2020-02-01',
        },{
            listedBankId: '2',
            listedBankName: '中信银行',
            address: 'SH',
            unitTypeId: '1',
            unitType: '机构类型',
            timeSH: '2020-02-01',
            timeHK: '2020-02-01',
            timeSZ: '2020-02-01',
        },{
            listedBankId: '3',
            listedBankName: '建设银行',
            address: 'SH',
            unitTypeId: '1',
            unitType: '机构类型',
            timeSH: '2020-02-01',
            timeHK: '2020-02-01',
            timeSZ: '2020-02-01',
        },]
    }
});
Mock.mock(URL + 'report/getReportList','post',(option)=>{
    option.jsonBody = JSON.parse(option.body);
    console.log(option);
    return {
        code: 200,
        data: {
            content: [{
                id: 'b01',
                moduleId: 'module1',
                module: '极客报告',
                typeId: 'type1',
                type: '银保监',
                reportName: '银监会第一季度报告',
                publicityTime: '2020/5/2',
                illustration: '1号',
                fileAddress: 'xxx.pdf',
            },{
                id: 'b02',
                moduleId: 'module1',
                module: '极客报告',
                typeId: 'type1',
                type: '银保监',
                reportName: '银监会第一季度报告',
                publicityTime: '2020/5/2',
                illustration: '1号',
                fileAddress: 'xxx.pdf',
            },],
            totalElements: 100, // 总条数
            number: option.jsonBody.page, // 当前页数
            size: option.jsonBody.size, // 每页条数
        }
    }
});
