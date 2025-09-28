function concurRequest (urls, maxNum) {
  if (urls.length === 0) {
    return Promise.resolve([])
  }
  return new Promise(resolve => {
    const result = []
    let nextIndex = 0
    let finishCount = 0
    async function _request () {
      if (nextIndex >= urls.length) {
        return
      }
      const i = nextIndex
      const url = urls[nextIndex++]
      const resp = await fetch(url)
      result[i] = resp
      finishCount++
      if (finishCount === urls.length) {
        resolve(result)
        return
      }
      _request()
    }
    
    for (let index = 0; index < maxNum; index++) {
      _request()
    }
  })
}