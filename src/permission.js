import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

import Mgr from './services/SecurityService'
const mgr = new Mgr()

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/CallBack', '/SilentCallback'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  /* has no token*/
  if (whiteList.indexOf(to.path) !== -1) {
    // in the free login whitelist, go directly
    next()
  } else {
    mgr.getSignedIn(to.path).then((res) => {
      if (res) {
        NProgress.done()
        next()
      }
    })
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
