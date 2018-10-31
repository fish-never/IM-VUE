import api from '../utils/axios'
export default {


  login(username, password){
    api.setToken(null)
    return api.post('custim/login/index', {username, password}, true).then(resp=>{
      console.log(resp)
      if(resp.data.code ==0){
        localStorage.setItem("Token", resp.data.data.token)
        localStorage.setItem("nickname", resp.data.data.nickname)
        localStorage.setItem("disable", resp.data.data.disable)
        localStorage.setItem("avatar", resp.data.data.avatar)
        localStorage.setItem("cust_id", resp.data.data.id)
        localStorage.setItem('root',resp.data.data.root)
        localStorage.setItem("origin_id",resp.data.data.product_list[0].origin_id)
        localStorage.setItem("stateNum",0)
        localStorage.setItem("product_list",JSON.stringify(resp.data.data.product_list))
        api.setToken(resp.data.data.token)
      }
      return Promise.resolve(resp.data)
    })
  }
}

