import request from '@/utils/request'

export function updateSysRoleResource(roleId, resIds) {
  return request({
    url: '/api/sysRoleResource/update',
    method: 'post',
    data: { roleId: roleId, resIds: resIds }
  })
}

export function listSysRoleResource(roleId) {
  return request({
    url: '/api/sysRoleResource/list',
    method: 'post',
    data: { roleId: roleId }
  })
}
