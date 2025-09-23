import axios from 'axios'
import { URL } from '../../config'

export function downDocumentLaw(val, fn) {
    axios({
        method: 'post',
        url: `${URL}uploadFinancialRegulationsData/zipDownload`,
        params: { urlList: val },
        responseType: 'blob',
    })
        .then((res) => {
            let blob = new Blob([res.data], {
                type: 'application/zip',
            })
            let href = window.URL.createObjectURL(blob) //创建新的URL表示指定的blob对象
            const a = document.createElement('a') //创建a标签
            a.style.display = 'none'
            a.href = href // 指定下载'链接
            a.download = '金融法规' //指定下载文件名
            a.click() //触发下载
            setTimeout(() => {
                fn()
            }, 3000)
            URL.revokeObjectURL(a.href) //释放URL对象
            document.body.removeChild(a) //释放标签
        })
        .catch((err) => {
            // this.$message.error('文件下载失败')
        })
}



export function exportData(data, privateUrl, type, fn, fileName) {
    axios({
        method: 'POST',
        url: `${URL}${privateUrl}`,
        data,
        responseType: 'arraybuffer',
    }).then((res) => {
        let blob = new Blob([res.data], {
            type
        })
        let href = window.URL.createObjectURL(blob) //创建新的URL表示指定的blob对象
        const a = document.createElement('a') //创建a标签
        a.style.display = 'none'
        a.href = href // 指定下载'链接
        a.download = fileName
        a.click() //触发下载
        setTimeout(() => {
            fn()
        }, 5000)
        window.URL.revokeObjectURL(a.href) //释放URL对象
        if (document.body.contains(a)) {
            document.body.removeChild(a) //释放标签
        }
    })
}