module.exports = {
    assetsDir: "assets",
    runtimeCompiler: true,
    productionSourceMap: false,
    css: {
        sourceMap: true
    },
    devServer: {
        port:'8082',
        disableHostCheck: true,
        proxy: {
            "/indicators/getStatisticsData": {
                target: 'http://127.0.0.1:5000',
                changeOrigin: true,
                // pathRewrite: {
                //     "^/data/functionalAreas/getFunctionalAreas": "data/functionalAreas/getFunctionalAreas"
                // }
            },
            "/data": {
                target: 'https://station.geekinsight.com.cn',
                // target: "https://test.station.geekinsight.com.cn", //设置你调用的接口域名和端口号 别忘了加http
                // target: "http://1.13.191.27:8081/data/", //设置你调用的接口域名和端口号 别忘了加http
                // target: "http://82.157.40.36:8081/",
                // target: "http://127.0.0.1:8081/", //设置你调用的接口域名和端口号 别忘了加http
                changeOrigin: true,
                pathRewrite: {
                    "^/data": ""
                }
            },
            "/saasapi": {
                target: "https://station.geekinsight.com.cn/saasapi",
                changeOrigin: true,
                pathRewrite: {
                    "^/saasapi": ""
                }
            },
            "/chat": {
                target: "https://station.geekinsight.com.cn/chat/", //设置你调用的接口域名和端口号 别忘了加http
                // target: "http://1.13.191.27:8081/data/", //设置你调用的接口域名和端口号 别忘了加http
                // target: "http://82.157.40.36:8081/",
                // target: "http://127.0.0.1:8081/", //设置你调用的接口域名和端口号 别忘了加http
                changeOrigin: true,
                pathRewrite: {
                    "^/chat": ""
                }
            }
        } // 设置代理
    },

    chainWebpack: config => {
        config.module
          .rule('svg')
          .use('file-loader')
            .loader('vue-svg-loader')
    },
};