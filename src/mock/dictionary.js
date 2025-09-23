//合规词典相关接口
import Mock from "mockjs";
import { URL } from './../../config'

Mock.mock(URL + 'complianceDictionary/getComplianceDictionaryList', 'get', (option) => {
    return {
        code: 200,
        data: {
            content: [{
                functionalAreasId: '',//职能领域id
                functionalAreasName: '电子商务',//职能领域名称
                complianceEntryId: '1',//合规词条id
                complianceEntry: '电子银行业务',////合规词条
                lawsSource: '《电子银行业务管理办法》第二条',//合规出处
                complianceInterpretation: '电子银行业务，是指商业银行等银行业金融机构利用面向社会公众开放的通讯通道或开放型公众网络，以及银行为特定自助服务设施或客户建立的专用网络，向客户提供的银行服务。 电子银行业务包括利用计算机和互联网开展的银行业务（以下简称网上银行业务），利用电话等声讯设备和电信网络开展的银行业务（以下简称电话银行业务），利用移动电话和无线网络开展的银行业务（以下简称手机银行业务），以及其他利用电子服务设备和网络，由客户通过自助服务方式完成金融交易的银行业务。',
            },
            {
                functionalAreasId: '',//职能领域id
                functionalAreasName: '电子商务',//职能领域名称
                complianceEntryId: '2',//合规词条id
                complianceEntry: '电子银行业务',////合规词条
                lawsSource: '《电子银行业务管理办法》第二条',//合规出处
                complianceInterpretation: '电子银行业务，是指商业银行等银行业金融机构利用面向社会公众开放的通讯通道或开放型公众网络，以及银行为特定自助服务设施或客户建立的专用网络，向客户提供的银行服务。 电子银行业务包括利用计算机和互联网开展的银行业务（以下简称网上银行业务），利用电话等声讯设备和电信网络开展的银行业务（以下简称电话银行业务），利用移动电话和无线网络开展的银行业务（以下简称手机银行业务），以及其他利用电子服务设备和网络，由客户通过自助服务方式完成金融交易的银行业务。',
            },
            {
                functionalAreasId: '',//职能领域id
                functionalAreasName: '电子商务',//职能领域名称
                complianceEntryId: '3',//合规词条id
                complianceEntry: '电子银行业务',////合规词条
                lawsSource: '《电子银行业务管理办法》第二条',//合规出处
                complianceInterpretation: '电子银行业务，是指商业银行等银行业金融机构利用面向社会公众开放的通讯通道或开放型公众网络，以及银行为特定自助服务设施或客户建立的专用网络，向客户提供的银行服务。 电子银行业务包括利用计算机和互联网开展的银行业务（以下简称网上银行业务），利用电话等声讯设备和电信网络开展的银行业务（以下简称电话银行业务），利用移动电话和无线网络开展的银行业务（以下简称手机银行业务），以及其他利用电子服务设备和网络，由客户通过自助服务方式完成金融交易的银行业务。',
            },
            {
                functionalAreasId: '',//职能领域id
                functionalAreasName: '电子商务',//职能领域名称
                complianceEntryId: '4',//合规词条id
                complianceEntry: '电子银行业务',////合规词条
                lawsSource: '《电子银行业务管理办法》第二条',//合规出处
                complianceInterpretation: '电子银行业务，是指商业银行等银行业金融机构利用面向社会公众开放的通讯通道或开放型公众网络，以及银行为特定自助服务设施或客户建立的专用网络，向客户提供的银行服务。 电子银行业务包括利用计算机和互联网开展的银行业务（以下简称网上银行业务），利用电话等声讯设备和电信网络开展的银行业务（以下简称电话银行业务），利用移动电话和无线网络开展的银行业务（以下简称手机银行业务），以及其他利用电子服务设备和网络，由客户通过自助服务方式完成金融交易的银行业务。',
            },
            ],
            keyword: '电子',
            page: 1,//当前页数
            size: 2,//每页期望数据数
            totalPages: 2,//数据总页数
            totalElements: 4//数据总条数			

        }
    }
})