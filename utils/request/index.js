import axios from 'axios'

const http = axios.create({
  // 请求超时时间
  baseURL: '/dlWokerSever',
  timeout: 10000,
  transformRequest: [function(data) {
    data = JSON.stringify(data)
    return data
  }],
  // 在传递给 then/catch 前，修改响应数据
  transformResponse: [function(data) {
    if (typeof data === 'string' && data.startsWith('{')) {
      data = JSON.parse(data)
    }
    return data
  }]
})

// post请求头
http.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
http.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'


export default http
