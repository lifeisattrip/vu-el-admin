import request from '@/utils/request'

export function getDashBoardNews() {
  return request({
    url: '/dashBoard/news',
    method: 'post',
    data: {}
  })
}

export function getDashBoardSurveyCase() {
  return request({
    url: '/dashBoard/availableSurvey',
    method: 'post',
    data: {}
  })
}
