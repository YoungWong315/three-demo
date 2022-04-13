class RouterGuard {
  constructor(router) {
    this.router = router
  }
  start() {
    this.beforeEach()
  }
  async beforeEach() {
    this.router.beforeEach((to, from, next) => {
      // 修改页面title
      const pageTitle = to.meta && to.meta.title
      if (pageTitle) document.title = pageTitle

      // 登录判断
      /* if (to.name != 'Login') {
        let login = localStorage.getItem('login')
        if (login) login = JSON.parse(login)
        if (!login || (login && login.expireDate <= new Date().getTime())) {
          next({ name: 'Login' })
        } else {
          next()
        }
      } else {
        next()
      } */

      next()
    })
  }
}

export default RouterGuard
