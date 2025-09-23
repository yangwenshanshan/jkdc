// 罚单相关接口
import Mock from "mockjs";
import { URL } from './../../config'
Mock.mock(URL + 'penalty/getPenaltyList','post',(option)=>{
    option.jsonBody = JSON.parse(option.body);
    console.log(option);
    let list = [];
    for(let i = 0; i < 5; i++){
        list.push({
            'punishCode': 'G' + parseInt(Math.random() * 100),
            'punishedIndividual': '来煜标',
            'position': '职位',
            'punishedUnit': '浙江杭州余杭农村银行',
            'principal': '李四',
            'reason': '重大事项决策机制不规范重大事项决策机制不规范重大事项决策机制不规范重大事项决策机制不规范重大事项决策机制不规范重大事项决策机制不规范',
            'gist': '《中华人民共和国监督管理法》第四十八条',
            'punishContent': '浙银保监罚决字【2020】警告并处罚款人民币20万元',
            'punishTime': '2020/4/11',
            'punishmentOrgan': '浙江银保监局',
            'punishNumber': '浙银保监罚决字[2020]26号',
            'publicityTime': '2020/4/12',
            'fineUnit': '20',
            'fineIndividual': '20',
            'fineAll': '40',
        })
    }
    return {
        code: 200,
        data: {
            //在数组中随机填充1-5个对象
            content: list,
            totalElements: 100, // 总条数
            number: option.jsonBody.page, // 当前页数
            size: option.jsonBody.size, // 每页条数
        }
    }
});

Mock.mock(URL + 'reason/getProblemPoint', 'post', options => {
    return {
        code: 200,
        data: [{
            problemPointId: 'IR004',
            problemPoint: '拆分授信',
            number: parseInt(Math.random() * 20),
        },{
            problemPointId: 'IR005',
            problemPoint: '未严格落实授信审批条件',
            number: parseInt(Math.random() * 20),
        },]
    }
});
Mock.mock(URL + 'problemPoint/getProblemPoint', 'post', options => {
    console.log(options);
    return {
        code: 200,
        data: [
            {
                functionalAreasId: 'P0001-1',
                functionalAreasName: '信贷管理',
                superiorFunctionalAreasId: 'P0001',
                problemPointList: [
                    {
                        problemPointId:'IR004',
                        problemPoint:'拆分授信',
                        functionalAreasId1:'BD19',
                        functionalAreasName1:'信贷管理',
                        functionalAreasId2:'BD19-12',
                        functionalAreasName2:'2	授信',
                    },{
                        problemPointId:'IR005',
                        problemPoint:'拆分授信1',
                        functionalAreasId1:'BD19',
                        functionalAreasName1:'信贷管理',
                        functionalAreasId2:'BD19-12',
                        functionalAreasName2:'2	授信',
                    },{
                        problemPointId:'IR006',
                        problemPoint:'拆分授信2',
                        functionalAreasId1:'BD19',
                        functionalAreasName1:'信贷管理',
                        functionalAreasId2:'BD19-12',
                        functionalAreasName2:'2	授信',
                    },
                ]
            },
            {
                functionalAreasId: 'P0001-2',
                functionalAreasName: '信贷管理',
                superiorFunctionalAreasId: 'P0001',
                problemPointList: [
                    {
                        problemPointId:'IR004',
                        problemPoint:'拆分授信',
                        functionalAreasId1:'BD19',
                        functionalAreasName1:'信贷管理',
                        functionalAreasId2:'BD19-12',
                        functionalAreasName2:'2	授信',
                    }
                ]
            },
        ]
    }
});
