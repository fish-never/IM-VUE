import api from '../utils/axios'
import qs from 'qs'

export default {

// 获取已接入列表
getAccessedLists(data){
  console.log(data)
    return api.get('/custim/cust/studentList?'+qs.stringify(data)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  // 上线下线
  online(data){
    return api.get('custim/cust/online?'+qs.stringify(data)).then((resp)=>{
        return Promise.resolve(resp.data)
      })
  },
  // 离线获取历史记录
  getHistory(data){
    return api.get('custim/cust/chatHistory?'+qs.stringify(data)).then((resp)=>{
      return Promise.resolve(resp.data)
    })
  },
  offline(data){
    return api.get('custim/cust/offline?'+qs.stringify(data)).then((resp)=>{
        return Promise.resolve(resp.data)
      })
  },
  
  // getAccessedList(data){
  //   return api.post('custim/cust/friendList',data,true).then((resp)=>{
  //       return Promise.resolve(resp.data)
  //     })
  // },



}

