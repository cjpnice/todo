import request from '@/utils/request'

export function addUser(data) {
  return request({
    url: 'user/register',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: 'user/login',
    method: 'post',
    data
  })
}