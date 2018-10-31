import { Toast } from 'mint-ui'
import axios from './axios'
import userService from '../service/user'

//初始化用户token
let userInfo = userService.getLoginUserInfo()
if(userInfo){
    console.log('here token')
    axios.setToken(userInfo.token)
}

//处理通用网络异常
export default {
    init(app){
        axios.setExceptionHandler(function(resp){
            console.log(888)
            console.log(resp)
            switch(resp.status){
                case 403:
                    app.$router.push('/login')
                    break;

            }
        })
    }
}
