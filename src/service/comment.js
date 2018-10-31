import qs from 'qs'
import api from '../utils/axios'
export default {

  getIfList(params){
    return api.get('config/bot/index?'+qs.stringify(params)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  update(data){
    return api.post('config/bot/update',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  create(data){
    return api.post('config/bot/create',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  clickDelete(data){
    return api.post('config/bot/delete',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  // //获取小程序列表
  getPro(params){
    return api.get('config/bot/getProduct').then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  //获取待接入列表
  getWaitingList(data){
    return api.post('custim/cust/waitHandle',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  //获取已过期列表
  getOverDueList(data){
    return api.post('custim/cust/expiredList',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  //接入会话
  accessFun(data){
    return api.get('custim/cust/accessStudent?'+qs.stringify(data)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  //获取在线客服列表
  getCustList(data){
    return api.get('custim/cust/customerOnlineList?'+qs.stringify(data)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  //转交学员
  transferStu(data){
    return api.post('custim/cust/transferStudent',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },

  // 添加 保存 用户
  saveAccount(data){
    return api.post('custim/cust/addCustomer',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  // 更新 用户
  updateUser(data){
    return api.post('custim/cust/updateCustomer',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  // 用户列表
  getCustomerList(data){
    return api.get('custim/cust/getCustomer?'+qs.stringify(data)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  // 禁用账户
  disableAccount(data){
    return api.post('custim/cust/disableCustomer',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  // 启用账户
  enableAccount(data){
    return api.post('custim/cust/enableCustomer',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  // 删除账户
  deleteAccount(data){
    return api.post('custim/cust/deleteCustomer',data,true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  //注销
  logout(data){
    return api.post('custim/login/logout',true).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  }
}

