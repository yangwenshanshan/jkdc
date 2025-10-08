import axios from 'axios'
import Vue from "vue";
import { URL } from "../../../config";
import app from '../../main'

let isRefreshing = false
let requests = []
const eventBus = new Vue()
const inter = axios.create({
  baseURL: '',
})
inter.interceptors.request.use(
  (config) => {
    if (!['auth/login'].includes(config.url)) {
      let tokenData = localStorage.getItem("tokenData");
      if (tokenData && tokenData != undefined) {
        tokenData = JSON.parse(tokenData);
        config.headers = { Authorization: `Bearer ${tokenData.access_token}`, }
      }
    }
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.parse(`${new Date()}`),
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

inter.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (!axios.isCancel(error)) {
      return Promise.reject(error)
    }
  },
)
export class RequestManager {
  constructor() {
    this.requestQueue = []
    this.cancelSource = {}
    this.maxConcurrentRequests = 5
    this.currentRequests = 0
  }

  cancelRequest (key) {
    const index = this.requestQueue.findIndex(el => el.key === key)
    if (index >= 0) {
      this.requestQueue.splice(index, 1)
    } else {
      if (this.cancelSource[key]) {
        this.cancelSource[key].cancel()
        delete this.cancelSource[key]
      }
    }
  }

  async addRequest(info) {
    this.requestQueue.push(info);
    this.processQueue();
  }

  async processQueue() {
    while (this.currentRequests < this.maxConcurrentRequests && this.requestQueue.length > 0) {
      const axiosInfo = this.requestQueue.shift();
      this.currentRequests++;

      try {
        const source = axios.CancelToken.source()
        this.cancelSource[axiosInfo.key] = source
        const config = {
          ...axiosInfo.config,
          cancelToken: source.token,
        }
        try {
          const response = await this.fetchRequest(axiosInfo.url, axiosInfo.method, config);
          delete this.cancelSource[axiosInfo.key]
          eventBus.$emit(`${axiosInfo.key}_success`, response)
        } catch (error) {
          if (!error.response || error.response.status !== 401) {
            eventBus.$emit(`${axiosInfo.key}_error`, error);
          }
          if (!isRefreshing) {
            isRefreshing = true
            await refreshToken()
            const resp = await inter(error.config)
            eventBus.$emit(`${axiosInfo.key}_success`, resp)
            requests.forEach(async (el) => {
              const resp = await inter(el.config)
              eventBus.$emit(`${el.key}_success`, resp)
            })
          } else {
            requests.push({
              key: axiosInfo.key,
              config: error.config
            })
          }
        }

      } catch (error) {
        eventBus.$emit(`${axiosInfo.key}_error`, error);
      }

      this.currentRequests--;
    }
  }

  fetchRequest(url, method, config) {
    if (method.toLocaleLowerCase() === 'post') {
      return inter.post(url, config.data, {
        ...config
      })
    }
    if (method.toLocaleLowerCase() === 'get') {
      return inter.get(url, {
        ...config
      })
    }
  }
}
function refreshToken () {
  return new Promise((resolve, reject) => {
    let tokenData = localStorage.getItem("tokenData");
    try {
      tokenData = JSON.parse(tokenData)
      axios({
        url: `${URL}/auth/refresh`,
        method: "POST",
        data: {
          refresh_token: tokenData.refresh_token,
          mode: "json"
        }
      }).then((res) => {
        localStorage.setItem("tokenData", JSON.stringify(res.data.data));
        resolve(res.data.data)
      }).catch(() => {
        localStorage.removeItem("user");
        app.$message.error("登录状态过期");
        app.$router.replace("/login");
        reject('token刷新失败')
      })
    } catch(_) {}
  })
}
const requestManager = new RequestManager();
const http = {
  get: (url, config) => {
    const _t = Date.parse(`${new Date()}`)
    const key = `${url}_get_${_t}`
    return {
      key,
      run: () => new Promise((resolve, reject) => {
        requestManager.addRequest({
          url, method: 'get', key, config
        })
        eventBus.$on(`${key}_success`, (response) => {
          eventBus.$off(`${key}_success`)
          resolve(response)
        })
        eventBus.$on(`${key}_error`, (response) => {
          eventBus.$off(`${key}_error`)
          reject(response)
        })
      })
    }
  },
  post: (url, data, config) => {
    const _t = Date.parse(`${new Date()}`)
    const key = `${url}_get_${_t}`
    return {
      key,
      run: () => new Promise((resolve, reject) => {
        requestManager.addRequest({url, method: 'post', key, data, config})
        eventBus.$on(`${key}_success`, (response) => {
          eventBus.$off(`${key}_success`)
          resolve(response)
        })
        eventBus.$on(`${key}_error`, (response) => {
          eventBus.$off(`${key}_error`)
          reject(response)
        })
      })
    }
  },
  cancel (key) {
    requestManager.cancelRequest(key)
  }
}

export default http