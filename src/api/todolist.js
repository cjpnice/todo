import request from '@/utils/request'

export function addTodoList(data) {
  return request({
    url: 'todoList/addTodoList',
    method: 'post',
    data
  })
}

export function selectAllTodoList(data) {
  return request({
    url: 'todoList/selectAllTodoList',
    method: 'post',
    data
  })
}
export function selectFinishedTodoList(data) {
  return request({
    url: 'todoList/selectFinishedTodoList',
    method: 'post',
    data
  })
}
export function selectUnfinishedTodoList(data) {
  return request({
    url: 'todoList/selectUnfinishedTodoList',
    method: 'post',
    data
  })
}

export function updateTodoList(data) {
  return request({
    url: 'todoList/updateTodoList',
    method: 'post',
    data
  })
}