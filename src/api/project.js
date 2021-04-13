import request from '@utils/request'

export function projectList(params) {
  return request({
    url: '/projectList',
    method: 'get',
    params
  })
}
