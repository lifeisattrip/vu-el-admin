import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/sys/user/list',
    method: 'post',
    data: params
  })
}

// 一般用户权限id
export function getNormalRoleId() {
  return 'user'
}

export function getGroupMap() {
  return request({
    url: '/sysDict/groupMap',
    method: 'get'
  })
}

export function getPositionMap() {
  return request({
    url: '/sysDict/positionMap',
    method: 'get'
  })
}

export function getJobDescMap() {
  return request({
    url: '/sysDict/jobDescMap',
    method: 'get'
  })
}

export function getUserMap() {
  return request({
    url: '/sys/user/userMap',
    method: 'get'
  })
}

export function removeUser(userId) {
  debugger
  const ids = []
  ids.push(userId)
  debugger
  return request({
    url: '/sys/user/remove',
    method: 'post',
    data: ids
  })
}

export function addUser(user) {
  return request({
    url: '/sys/user/save',
    method: 'post',
    data: user
  })
}

export function updateUser(user) {
  return request({
    url: '/sys/user/update',
    method: 'post',
    data: user
  })
}

export function updatePassword(user) {
  return request({
    url: '/sys/user/reset',
    method: 'post',
    data: user
  })
}

