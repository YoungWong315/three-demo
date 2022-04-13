// 引入service类
import Misc from './services/misc'
const services = [Misc]

import axios from '@/modules/axios'

import config from './config'
import mixinClass from './serviceUtil'

class MixedService extends mixinClass(...services) {
  constructor(props) {
    super(props)
    this.instance = null
    // 后端接口错误码配置
    Object.assign(this, config)
  }
  static getSingletonInstance = () => {
    if (!this.instance) {
      this.instance = new MixedService()
    }
    return this.instance
  }
  getAxiosInstance = () => axios
  /**
   * 修改header默认值的方法
   */
  updateToken = (token) => (axios.defaults.headers['x-token'] = token)
  updateAppid = (appid) => (axios.defaults.headers['x-app-id'] = appid)
  updateChannel = (channel) => (axios.defaults.headers['x-channel'] = channel)
}

export default MixedService.getSingletonInstance()
