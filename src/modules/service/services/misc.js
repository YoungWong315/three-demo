import axios from '@/modules/axios'

class Misc {
  constructor() {
    this.prefix = `/misc`
  }
  /**
   * 获取bimface viewToken
   * @param {Object} bodyData = {  "compareId": "string", "fileId": "string", "integrateId": "string" }
   * @returns Promise
   */
  bimfaceViewToken = ({
    compareId = null,
    fileId = null,
    integrateId = null,
  }) =>
    axios.post(`${this.prefix}/3rd/bimface/view/token`, {
      compareId,
      fileId,
      integrateId,
    })
  /**
   * 通过手机号创建用户(User)及认证信息(Auth)并登录
   * @param {Object} bodyData = { "mobile": "string", "verifyCode": "string" }
   * @returns Promise
   */
  loginMobileVerify = (bodyData) =>
    axios.post(`${this.prefix}/oauth/login/mobile/verify`, bodyData)
  /**
   * 通过手机号/密码登录
   * @param {Object} bodyData = { "authPwd": "string", "mobile": "string" }
   * @returns Promise
   */
  loginMobilePwd = (bodyData) =>
    axios.post(`${this.prefix}/oauth/login/mobile/pwd`, bodyData)
}

export default Misc
