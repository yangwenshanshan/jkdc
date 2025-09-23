import { URL } from "../../config"
import app from "../main"

export function useChatOpensearch(sessionId) {
  function getHeaders () {
    const headers = {
      "Content-Type": "application/json"
    }

    let tokenData = localStorage.getItem("tokenData")
    if (tokenData && tokenData != undefined) {
      tokenData = JSON.parse(tokenData);
      headers["Authorization"] = `Bearer ${tokenData.access_token}`
    }

    return headers
  }

  // 发送一个消息
  const sendQuestion = async (question, cb) => {
    let result
    let buffers = new Uint8Array([])
    const textDecoder = new TextDecoder()

    const parseTrunkData = (chunkBuffer) => {
      const nextBuffers = new Uint8Array(buffers.length + chunkBuffer.length)
      nextBuffers.set(buffers)
      nextBuffers.set(chunkBuffer, buffers.length)
      buffers = nextBuffers

      const text = textDecoder.decode(buffers)
      const items = text.replace().replace(/data:\[done\]\s*$/,"").split(/data:/)

      items.forEach((item) => {
        try {
          result = JSON.parse(item)
          cb(result)
        } catch(_) {}
      })
    }

    const run = () => fetch(`${URL}/opensearch/multi-search`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        "question": {
          "text": question,
          "type": "TEXT",
          "session": sessionId
        },
        "options": {
          "retrieve": {
            "doc": {
              "filter": "",
              "top_n": 5,
              "sf": "",
              "dense_weight": "0.7",
              "formula": "",
              "operator": "AND"
            },
            "entry": {
              "sf": ""
            },
            "image": {
              "sf": "",
              "dense_weight": "0.7"
            },
            "qp": {
              "query_extend": false,
              "query_extend_num": 5
            },
            "return_hits": false
          },
          "chat": {
            "stream": true,
            "prompt_config": {
              "attitude": "normal",
              "rule": "detailed",
              "noanswer": "sorry",
              "language": "Chinese",
              "role": false,
              "role_name": "AI小助手",
              "out_format": "text"
            },
            "csi_level": "strict",
            "history_max": "",
            "link": "false"
          }
        }
      })
    })

    return run().then((res) => {
      if (res.status === 401) {
        return refreshToken(run)
      }
      return res
    }).then(async (ai) => {
      const reader = ai.body.getReader()

      while (1) {
        const res = await reader.read()
        if (res.value) {
          parseTrunkData(res.value)
        }

        if (res.done) {
          break
        }
      }
      return result
    })
  }

  function refreshToken(cb) {
    let tokenData = localStorage.getItem("tokenData")
    if (tokenData && tokenData != undefined) {
      tokenData = JSON.parse(tokenData)
    }

    return fetch(`${URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refresh_token: tokenData?.refresh_token,
        mode: "json"
      })
    }).then((res) => {
      //读取res.body
      return res.json().then((data) => {
        localStorage.setItem("tokenData", JSON.stringify(data.data));
        return cb()
      })
    }).catch((err) => {
      localStorage.removeItem("user");
      app.$message.error("登录状态过期");
      app.$router.replace("/login");
    })
  }

  return {
    sendQuestion
  }
}