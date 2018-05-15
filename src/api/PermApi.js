// import request from '@/utils/request'
import _ from 'lodash'

export function getValidRouterUrl() {
  return ['/system', '/system/user']
}

export function browserMenuTree(routerMap, parentPath, path2RouterMap) {
  for (const router of routerMap) {
    const pPath = parentPath + (router.path.indexOf('/') === 0 ? router.path : '/' + router.path)
    path2RouterMap[pPath] = router
    if (router && router.children && router.children.length > 0) {
      browserMenuTree(router.children, pPath, path2RouterMap)
    }
  }
}

export function filterMenuValidUrl(url2Router, validUrls) {
  for (const url in url2Router) {
    if (!_.includes(validUrls, url)) {
      // url2Router[url].hidden = true
    }
  }
}

export function filterAllRouterItems(routerMap) {
  const url2Router = {}
  browserMenuTree(routerMap, '', url2Router)
  const validUrls = getValidRouterUrl()
  filterMenuValidUrl(url2Router, validUrls)
}
