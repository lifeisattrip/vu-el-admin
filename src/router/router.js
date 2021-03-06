import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'home',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/starter/dashboard'),
      meta: { title: '系统首页', icon: 'table' }
    }]
  }
]
export const asyncRouterUserMap = [
  { path: '*', redirect: '/404', hidden: true }
]
export const asyncRouterMap = [{
  path: '/system',
  redirect: '/system/user',
  name: 'System',
  component: Layout,
  meta: { title: '系统管理', icon: 'example' },
  children: [
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/starter/SysUserTable'),
      meta: { title: '人员管理', icon: 'people' }
    },
    {
      path: 'config',
      name: 'Config',
      component: () => import('@/views/starter/SysConfigTable'),
      meta: { title: '配置管理', icon: 'people' }
    },
    {
      path: 'resource',
      name: 'Resource',
      component: () => import('@/views/starter/perm/SysResourceTable'),
      meta: { title: '权限资源', icon: 'people' }
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/starter/perm/SysRoleTable'),
      meta: { title: '角色管理', icon: 'people' }
    },
    {
      path: 'roleGroup',
      name: 'RoleGroup',
      component: () => import('@/views/starter/perm/SysRoleGroupTable'),
      meta: { title: '角色组', icon: 'people' }
    },
    {
      path: 'log',
      name: 'Log',
      component: () => import('@/views/starter/SysLogTable'),
      meta: { title: '系统日志', icon: 'people' }
    },
    {
      path: 'task',
      name: 'Task',
      component: () => import('@/views/starter/QuartzJobTable'),
      meta: { title: '定时任务', icon: 'people' }
    },
    {
      path: 'test',
      name: 'Test',
      component: () => import('@/views/starter/perm/SysResourceTree'),
      meta: { title: 'Test', icon: 'people' }
    }
  ]
}, { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

