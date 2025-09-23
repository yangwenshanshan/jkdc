// 图表相关接口
import Mock from "mockjs";
import { URL } from './../../config'

Mock.mock(URL + 'auxiliaryTools/getListingTool', 'post', options => {
   return {
       code: 200,
       data: [
           {
               toolId:'1',
               toolName:'签发空头支票企业清单',
               updateType: '持续更新',
               toolType: '1',
               explain1:'签发空头支票一定程度反映出出票企业财务管理不健全，甚至是恶意骗取财务的道德风险。清单收录了人民银行历年来针对签发空头支票行为作出处罚的企业名称、受罚时间、受罚情况。',
               usage1:'清单可分享给业务人员使用，作为KYC和业务审查的辅助工具。',
           },
           {
               toolId:'2',
               toolName:'上市商业银行总行部门设置清单',
               updateType: '年度更新',
               toolType: '2',
               explain1:'清单收录了上市商业银行的治理层委员会设置、高管层委员会设置、总行职能部门设置等信息，并提供同维度横向对比。',
               usage1:'管理人员可以了解银行同业的组织架构设置情况，对比本行和同业的共性和差异，借鉴管理思路。',
           },
           {
               toolId:'3',
               toolName:'职能领域常用法规清单',
               updateType: '持续更新',
               toolType: '3',
               explain1:'提供银行各职能领域的常用法规清单列表（持续更新），以及相应的法规文件包下载。',
               usage1:'管理人员可以快速查询各职能领域中的常用法规。',
           },
           {
               toolId:'4',
               toolName:'合规释义清单',
               updateType: '持续更新',
               toolType: '4',
               explain1:'总结整理监管机构针对银行业务或管理中的各类专业名词，以及相关的释义和出处。',
               usage1:'快速查找与了解监管监管对专业名词的释义，在合规评审、合规培训等场景中引用。',
           },
           {
               toolId:'5',
               toolName:'监管检查关注点清单',
               updateType: '持续更新',
               toolType: '5',
               explain1:'清单收录了银保监会2010年至今重要监管检查项目的检查要点，并按照职能领域提供跨年度横向对比。',
               usage1:'管理人员可以了解历年监管检查关注重点以及变化，据此明确本行的管理和监督重点。',
           },
       ]
   }
});

Mock.mock(URL + 'billViolationEnterprise/getBillViolationEnterpriseList','post', options => {
    options.jsonBody = JSON.parse(options.body);
    return {
        code: 200,
        data: {
            content: [{
                id: "b01",
                punishedUnit: "沈阳捷诚重钢结构安装有限公司",
                illegalActivities: "签发空头支票",
                province: "辽宁",
                city: "沈阳",
                punishTime: "2020/2/26",
                punishmentOrganName: "人民银行沈阳分行营业管理部",
                punishContent: "罚款1000元",
                punishNumber: "沈银营支付罚字[2020]2号",
            },{
                id: "b01",
                punishedUnit: "沈阳捷诚重钢结构安装有限公司",
                illegalActivities: "签发空头支票",
                province: "辽宁",
                city: "沈阳",
                punishTime: "2020/2/26",
                punishmentOrganName: "人民银行沈阳分行营业管理部",
                punishContent: "罚款1000元",
                punishNumber: "沈银营支付罚字[2020]2号",
            },],
            totalElements: 100, // 总条数
            number: options.jsonBody.page, // 当前页数
            size: options.jsonBody.size, // 每页条数
        }
    }
});

Mock.mock(URL + 'auxiliaryTools/getListingToolByToolId', 'post', options => {
    return {
        code: 200,
        data: {
            toolId:'1',
            toolName:'签发空头支票企业清单',
            updateType: '持续更新',
            toolType: '1',
            explain1:'签发空头支票一定程度反映出出票企业财务管理不健全，甚至是恶意骗取财务的道德风险。清单收录了人民银行历年来针对签发空头支票行为作出处罚的企业名称、受罚时间、受罚情况。',
            usage1:'清单可分享给业务人员使用，作为KYC和业务审查的辅助工具。',
        }
    }
});
