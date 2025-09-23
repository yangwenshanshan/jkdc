// 实体相关接口
import Mock from "mockjs";
import { URL } from './../../config'
// 银行或非银行列表
Mock.mock(URL + 'unitType/getUnitTypeByIsBank','post',(option)=>{
    let param = JSON.parse(option.body);
    if(param.isBank === 1){
        return {
            code: 200,
            data: [{
                unitTypeId:'1',
                unitType:'开发性金融',
                isBank:'1',
            },{
                unitTypeId:'2',
                unitType:'政策性银行',
                isBank:'1',
            }]
        }
    } else {
        return {
            code: 200,
            data: [{
                unitTypeId:'3',
                unitType:'国有大型商业银行',
                isBank:'2',
            },{
                unitTypeId:'4',
                unitType:'城市商业银行',
                isBank:'2',
            },]
        }
    }
});
// 受罚领域下拉框数据
Mock.mock(URL + 'functionalAreas/getFunctionalAreas','post',(option)=>{
    // let param = JSON.parse(option.body);
    return {
        code: 200,
        data: [{
            functionalAreasId: 'P0001',
            functionalAreasName: '信贷管理',
        },{
            functionalAreasId: 'P0002',
            functionalAreasName: '票据业务',
        },]
    }
});
// 处罚机关下拉框数据
Mock.mock(URL + 'regulator/getPunishmentOrganName','post',(option)=>{
    let param = JSON.parse(option.body);
    return {
        code: 200,
        data: [{
            id:'1',
            punishmentOrgan:'银保监局',
            punishmentOrganName:'浙江银保监局',
            province:'浙江',
            city:'杭州',
        },{
            id:'2',
            punishmentOrgan:'银保监局',
            punishmentOrganName:'浙江银保监局',
            province:'浙江',
            city:'杭州',
        },]
    }
});
// 受罚机构下拉框数据
Mock.mock(URL + 'unitType/getPunishedHead','get',(option)=>{
    let param = JSON.parse(option.body);
    console.log(param);
    return {
        code: 200,
        data: ['国际开发银行', '进出口银行']
    }
});
