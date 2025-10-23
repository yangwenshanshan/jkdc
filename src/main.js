import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import qs from "qs";
import "normalize.css";
import clamp from "clamp-js";
Vue.prototype.$clamp = clamp;
import "./assets/font/iconfont";
import "./assets/font/iconfont.css";

import ElementUI from "element-ui";
import "./assets/css/element-variables.scss";

import "./assets/css/common.scss";

import { URL, URLSaas, URLChat } from "../config";
import th from "element-ui/src/locale/lang/th";

if (process.env.NODE_ENV === "development") {
    // require('./mock/index')
}
Vue.prototype.validForbid = function(value) {
    value = value.replace(/[|]/g, "").replace(/\s/g, "");
    return value;
};
Vue.config.productionTip = false;
Vue.use(ElementUI);

import CellPopover from "./views/reportAssistant/components/CellPopover.vue";
Vue.component("CellPopover", CellPopover);

Vue.prototype.request = function(path, data, method = "post", responseType) {
    let params = data;
    let loading,
        timer,
        ts = this;
    if (!params._hideLoading) {
        timer = setTimeout(function() {
            loading = ts.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.5)"
            });
        }, 2000);
    }
    const apiPath = path.startsWith('/') ? path : '/' + path;
    return new Promise((resolve, reject) => {
        let config = {
            method: method,
            url: apiPath.includes('indicators') ? apiPath : URL + apiPath,
            withCredentials: true,
            responseType: responseType
        };
        try {
            if (!['auth/login'].includes(path)) {
                let tokenData = localStorage.getItem("tokenData");
                if (tokenData && tokenData != undefined) {
                    tokenData = JSON.parse(tokenData);
                    config.headers = { Authorization: `Bearer ${tokenData.access_token}`, }
                }
            }
        } catch (error) {

        }
        if (method.toLocaleUpperCase() === "GET") {
            if (data) {
                config.params = data;
            }
        } else {
            config.data = params;
        }
        axios(config)
            .then(res => {
                if (res.data.code === 401) {
                    localStorage.removeItem("user");
                    if (this.$route.path !== "/login") {
                        this.$message.error("登录状态过期");
                        this.$router.replace("/login");
                    }
                    return false;
                } else {
                    resolve(res.data);
                }
            })
            .catch((err) => {
                try {
                    if (err.response.status === 401) {
                        if (['auth/login'].includes(path)) {
                            reject('用户名不存在或密码不匹配')
                            return
                        }

                        return refreshToken(
                            () => {
                                let tokenData = localStorage.getItem("tokenData");
                                if (config.headers) {
                                    tokenData = JSON.parse(tokenData);
                                    config.headers.Authorization = `Bearer ${tokenData.access_token}`
                                }
                                return axios(config).then((res) => resolve(res.data))
                            },
                            () => reject('用户名不存在或密码不匹配')
                        )
                    }

                    const errMsg = err.response.data.errors
                    if (errMsg && errMsg[0]) {
                        reject(errMsg[0].message);
                    } else {
                        reject(err);
                    }
                } catch(err) {

                }

            })
            .finally(() => {
                if (timer !== undefined) {
                    if (loading) {
                        // 已显示加载中
                        loading.close();
                    } else {
                        clearTimeout(timer);
                    }
                }
            });
    });
};
Vue.prototype.requestSaas = function(path, data, method = "post", responseType) {
    let params = data;
    let loading,
        timer,
        ts = this;
    if (!params._hideLoading) {
        timer = setTimeout(function() {
            loading = ts.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.5)"
            });
        }, 2000);
    }
    const apiPath = path.startsWith('/') ? path : '/' + path;
    return new Promise((resolve, reject) => {
        let config = {
            method: method,
            url: URLSaas + apiPath,
            withCredentials: true,
            responseType: responseType
        };
        try {
            if (!['auth/login'].includes(path)) {
                let tokenData = localStorage.getItem("tokenData");
                if (tokenData && tokenData != undefined) {
                    tokenData = JSON.parse(tokenData);
                    config.headers = { Authorization: `Bearer ${tokenData.access_token}`, }
                }
            }
        } catch (error) {

        }
        if (method.toLocaleUpperCase() === "GET") {
            if (data) {
                config.params = data;
            }
        } else {
            config.data = params;
        }
        axios(config)
            .then(res => {
                if (res.data.code === 401) {
                    localStorage.removeItem("user");
                    if (this.$route.path !== "/login") {
                        this.$message.error("登录状态过期");
                        this.$router.replace("/login");
                    }
                    return false;
                } else {
                    resolve(res.data);
                }
            })
            .catch((err) => {
                const errMsg = err.response.data.errors
                if (errMsg && errMsg[0]) {
                    if (err.response.status === 401) {
                        return refreshToken(
                            () => {
                                let tokenData = localStorage.getItem("tokenData");
                                if (config.headers) {
                                    tokenData = JSON.parse(tokenData);
                                    config.headers.Authorization = `Bearer ${tokenData.access_token}`
                                }
                                return axios(config).then((res) => resolve(res.data))
                            },
                            () => reject(err)
                        )
                    }

                    reject(errMsg[0].message);
                } else {
                    reject(err);
                }
            })
            .finally(() => {
                if (timer !== undefined) {
                    if (loading) {
                        // 已显示加载中
                        loading.close();
                    } else {
                        clearTimeout(timer);
                    }
                }
            });
    });
};

Vue.prototype.requestChat = function(path, data, method = "post", responseType) {
    let params = data;
    let loading,
        timer,
        ts = this;
    if (!params._hideLoading) {
        timer = setTimeout(function() {
            loading = ts.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.5)"
            });
        }, 2000);
    }
    const apiPath = path.startsWith('/') ? path : '/' + path;
    return new Promise((resolve, reject) => {
        let config = {
            method: method,
            url: URLChat + apiPath,
            withCredentials: true,
            responseType: responseType
        };
        try {
            if (!['auth/login'].includes(path)) {
                let tokenData = localStorage.getItem("tokenData");
                if (tokenData && tokenData != undefined) {
                    tokenData = JSON.parse(tokenData);
                    config.headers = { Authorization: `Bearer ${tokenData.access_token}`, }
                }
            }
        } catch (error) {

        }
        if (method.toLocaleUpperCase() === "GET") {
            if (data) {
                config.params = data;
            }
        } else {
            config.data = params;
        }
        axios(config)
            .then(res => {
                if (res.data.code === 401) {
                    localStorage.removeItem("user");
                    if (this.$route.path !== "/login") {
                        this.$message.error("登录状态过期");
                        this.$router.replace("/login");
                    }
                    return false;
                } else {
                    resolve(res.data);
                }
            })
            .catch((err) => {
                const errMsg = err.response.data.errors
                if (errMsg && errMsg[0]) {
                    if (err.response.status === 401) {
                        return refreshToken(
                            () => {
                                let tokenData = localStorage.getItem("tokenData");
                                if (config.headers) {
                                    tokenData = JSON.parse(tokenData);
                                    config.headers.Authorization = `Bearer ${tokenData.access_token}`
                                }
                                return axios(config).then((res) => resolve(res.data))
                            },
                            () => reject(err)
                        )
                    }
                    reject(errMsg[0].message);
                } else {
                    reject(err);
                }
            })
            .finally(() => {
                if (timer !== undefined) {
                    if (loading) {
                        // 已显示加载中
                        loading.close();
                    } else {
                        clearTimeout(timer);
                    }
                }
            });
    });
};

const app = new Vue({
    router,
    render: h => h(App)
}).$mount("#app");

const refreshCallback = []
function refreshToken(success, fail) {
    return new Promise((resolve, reject) => {
      refreshCallback.push([() => resolve(void 0), (err) => reject(err)])

      if (refreshCallback.length === 1) {
        let tokenData = localStorage.getItem("tokenData");
        try {
            tokenData = JSON.parse(tokenData)
        } catch(_) {}

        axios({
            url: `${URL}/auth/refresh`,
            method: "POST",
            data: {
                refresh_token: tokenData.refresh_token,
                mode: "json"
            }
        }).then((res) => {
            localStorage.setItem("tokenData", JSON.stringify(res.data.data));
            while (refreshCallback.length) {
                const callback = refreshCallback.shift()
                callback[0]()
            }
        }).catch((err) => {
            localStorage.removeItem("user");
            app.$message.error("登录状态过期");
            app.$router.replace("/login");
            while (refreshCallback.length) {
                const callback = refreshCallback.shift()
                callback[1](err)
            }
        })
      }
    }).then(success, fail)
  }

export default app;