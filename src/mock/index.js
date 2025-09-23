// 将所有的mock文件引入
import "./penalty"
import "./entity"
import './tool'
import './charts'
import './reports'
import './bank'
import './dictionary'
import './ckeckPoint'
import './lawList'
import { URL } from './../../config'
// 在这里可以做一些通用的配置
import Mock from "mockjs";
// 设置所有ajax请求的超时时间，模拟网络传输耗时
Mock.setup({
    timeout: 0-60
});


Mock.mock(URL + 'notification/getNotificationContent','get',(option)=>{
    console.log(option);
    return {
        code: 200,
        data: [{
            id: '1',
            notification_content: '这是一个动态左右滚动的文字通知。4月6日-4月10日，银保监新增公示罚单XX张；人民银行新增公示罚单XX张',
        },{
            id: '2',
            notification_content: '这是一个动态左右滚动的文字通知。4月6日-4月10日，银保监新增公示罚单XX张；人民银行新增公示罚单XX张',
        },]
    }
});
