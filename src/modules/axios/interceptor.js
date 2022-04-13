// 禁用生产环境的log
if (import.meta.env === 'prod') {
  Object.keys(console).forEach((elem) => {
    console[elem] = () => {}
  })
}

import config from '@/modules/service/config'
import router from '@/router'

const {
  SUCCESS,
  FAIL,
  TOKEN_EXPIRE,
  TOKEN_EMPTY,
  SYSTEM_ERROR,
  PERMISSION_DENIED,
} = config

export function requestSuccessFunc(requestObj) {
  // isDev && console.info('request', `url: ${requestObj.url}`, requestObj)
  return Promise.resolve(requestObj)
}

export function requestFailFunc(requestError) {
  // 自定义发送请求失败逻辑，断网，请求发送监控等
  return Promise.reject(requestError)
}

export function responseSuccessFunc(responseObj) {
  // isDev && console.info('response', responseObj)
  const data = responseObj.data

  try {
    switch (data.code) {
      case SUCCESS:
        // 业务成功
        return {
          result: data.result,
          code: SUCCESS,
        }
      case FAIL:
        // 业务失败
        return {
          errorDesc: data.errorDesc,
          errorNo: data.errorNo,
          code: FAIL,
        }
      case TOKEN_EXPIRE:
        // 登录过期
        console.log('token expired...')
        localStorage.removeItem('login')
        router.replace({ name: 'Login' })
      case TOKEN_EMPTY:
        // 没有token
        console.log('token empty...')
        localStorage.removeItem('login')
        router.replace({ name: 'Login' })
        return {
          errorNo: data.errorNo,
        }
      case SYSTEM_ERROR:
        localStorage.removeItem('login')
        router.replace({ name: 'Login' })
        break
      case PERMISSION_DENIED:
        break
      default:
        // 需要抛一个统一的异常
        // 业务中还会有一些特殊 code 逻辑，我们可以在这里做统一处理，也可以下方它们到业务层
        return (
          data || {
            code: 0,
            errorNo: data.errorNo,
          }
        )
    }
  } catch (error) {
    console.log('interceptor error: ', error)
    return {
      code: 0, // 保证业务端不需要try catch, 一定可以拿到对象并使用code判断
    }
  }
}

export function responseFailFunc(responseError) {
  // 响应失败，可根据 responseError.message 和 responseError.response.status 来做监控处理
  return Promise.reject(responseError)
}
