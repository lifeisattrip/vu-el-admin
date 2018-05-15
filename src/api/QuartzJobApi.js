import request from '@/utils/request'

export function removeQuartzJob(id) {
  const ids = [id]
  return request({
    url: '/api/quartzJob/remove',
    method: 'post',
    data: { ids: ids }
  })
}

export function addQuartzJob(data) {
  return request({
    url: '/api/quartzJob/add',
    method: 'post',
    data: data
  })
}

export function updateQuartzJob(data) {
  return request({
    url: '/api/quartzJob/update',
    method: 'post',
    data: data
  })
}

export function listQuartzJob(data) {
  return request({
    url: '/api/quartzJob/list',
    method: 'post',
    data: data
  })
}

export function detailQuartzJob(id) {
  return request({
    url: '/api/quartzJob/detail',
    method: 'post',
    data: { id: id }
  })
}

export function runQuartzJob(id) {
  const ids = [id]
  return request({
    url: '/api/quartzJob/run',
    method: 'post',
    data: { ids: ids }
  })
}

export function enableQuartzJob(id) {
  const ids = [id]
  return request({
    url: '/api/quartzJob/enable',
    method: 'post',
    data: { ids: ids }
  })
}

export function disableQuartzJob(id) {
  const ids = [id]
  return request({
    url: '/api/quartzJob/disable',
    method: 'post',
    data: { ids: ids }
  })
}

export function getTaskStatusMap() {
  return request({
    url: '/api/quartzJob/TaskStatusMap',
    method: 'get'
  })
}

