import request from '@/utils/request'

export function removeSysRoleGroup(id) {
  const ids = [id]
  return request({
    url: '/api/sysRoleGroup/remove',
    method: 'post',
    data: { ids: ids }
  })
}

export function addSysRoleGroup(data) {
  return request({
    url: '/api/sysRoleGroup/add',
    method: 'post',
    data: data
  })
}

export function updateSysRoleGroup(data) {
  return request({
    url: '/api/sysRoleGroup/update',
    method: 'post',
    data: data
  })
}

export function listSysRoleGroup(data) {
  return request({
    url: '/api/sysRoleGroup/list',
    method: 'post',
    data: data
  })
}

export function detailSysRoleGroup(id) {
  return request({
    url: '/api/sysRoleGroup/detail',
    method: 'post',
    data: { id: id }
  })
}

export function getRoleNameMap() {
  return request({
    url: '/api/sysRoleGroup/RoleNameMap',
    method: 'get'
  })
}
