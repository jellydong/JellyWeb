import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

import Mgr from './services/SecurityService'
const mgr = new Mgr()

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/CallBack', '/SilentCallback'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  /* has no token*/
  if (whiteList.indexOf(to.path) !== -1) {
    // in the free login whitelist, go directly
    next()
  } else {
    // 判断是不是登录的，不是登录的话要登录
    mgr.getSignedIn(to.path).then((res) => {
      if (res) {
        // determine whether the user has obtained his permission roles through getInfo
        const hasRoles = store.getters.roles && store.getters.roles.length > 0
        if (hasRoles) {
          next()
        } else {
          try {
            // todo: 这里实际是需要获取登录用户的角色，然后通过角色去控制
            // get user info
            // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
            mgr.getRole().then(role => {
              // generate accessible routes map based on roles
              store.dispatch('permission/generateRoutes', role).then(accessRoutes => {
                // dynamically add accessible routes
                router.addRoutes(accessRoutes)
              })
            })
            next()
          } catch (error) {
            // remove token and go to login page to re-login
          }
        }
      }
    })
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
