//上市银行相关接口
import Mock from "mockjs";
import { URL } from './../../config'

Mock.mock(URL + 'listedBank/getListedBankOrganization', 'get', (option) => {
    return {
        code: 200,
        data: {
            content: [{
                listedBankId: '001',//上市银行id
                unitType: '国有大型银行',//机构类型
                organization: '公司金融业务部',//z组织部门名称
                functionalAreasName: '对公客户管理',//职能领域名称
                OrganizationChart: 'xxx.pdf',//组织架构图
            }, {
                listedBankId: '002',
                unitType: '国有大型银行',
                organization: '公司金融业务部',
                functionalAreasName: '对公客户管理',
                OrganizationChart: 'xxx.pdf',
            },
            {
                listedBankId: '003',
                unitType: '国有大型银行',
                organization: '公司金融业务部',
                functionalAreasName: '对公客户管理',
                OrganizationChart: 'xxx.pdf',
            },
            {
                listedBankId: '004',
                unitType: '国有大型银行',
                organization: '公司金融业务部',
                functionalAreasName: '对公客户管理',
                OrganizationChart: 'xxx.pdf',
            },
            {
                listedBankId: '005',
                unitType: '国有大型银行',
                organization: '公司金融业务部',
                functionalAreasName: '对公客户管理',
                OrganizationChart: 'xxx.pdf',
            },
            {
                listedBankId: '006',
                unitType: '国有大型银行',
                organization: '公司金融业务部',
                functionalAreasName: '对公客户管理',
                OrganizationChart: 'xxx.pdf',
            },
            {
                listedBankId: '007',
                unitType: '国有大型银行',
                organization: '公司金融业务部',
                functionalAreasName: '对公客户管理',
                OrganizationChart: 'xxx.pdf',
            },
            {
                listedBankId: '008',
                unitType: '国有大型银行',
                organization: '公司金融业务部',
                functionalAreasName: '对公客户管理',
                OrganizationChart: 'xxx.pdf',
            },
            {
                listedBankId: '009',
                unitType: '国有大型银行',
                organization: '公司金融业务部',
                functionalAreasName: '对公客户管理',
                OrganizationChart: 'xxx.pdf',
            },
            {
                listedBankId: '010',
                unitType: '国有大型银行',
                organization: '公司金融业务部',
                functionalAreasName: '对公客户管理',
                OrganizationChart: 'xxx.pdf',
            },
            {
                listedBankId: '011',
                unitType: '国有大型银行',
                organization: '公司金融业务部',
                functionalAreasName: '对公客户管理',
                OrganizationChart: 'xxx.pdf',
            },
            {
                listedBankId: '012',
                unitType: '国有大型银行',
                organization: '公司金融业务部',
                functionalAreasName: '对公客户管理',
                OrganizationChart: 'xxx.pdf',
            },
            ],
            totalPages: 2,
            totalElements: 3,
        }
    }
})