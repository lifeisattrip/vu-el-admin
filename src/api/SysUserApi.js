import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/api/sysUser/list',
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
    url: '/api/sysUser/userMap',
    method: 'get'
  })
}

export function removeUser(userId) {
  const ids = []
  ids.push(userId)
  return request({
    url: '/api/sysUser/remove',
    method: 'post',
    data: ids
  })
}

export function addUser(user) {
  return request({
    url: '/api/sysUser/save',
    method: 'post',
    data: user
  })
}

export function updateUser(user) {
  return request({
    url: '/api/sysUser/update',
    method: 'post',
    data: user
  })
}

export function updatePassword(user) {
  return request({
    url: '/api/sysUser/reset',
    method: 'post',
    data: user
  })
}

export function getRoleGroupNameMap() {
  return request({
    url: '/api/sysUser/RoleGroupNameMap',
    method: 'get'
  })
}
