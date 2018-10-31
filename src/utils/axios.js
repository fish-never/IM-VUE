import Axios from 'axios'
import qs from 'qs'
import { Message, MessageBox } from 'element-ui'
let axios = Axios.create({});


if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = API_URL||"http://qa-webim-api.toutiao.com";
    // axios.defaults.baseURL = "http://webim-api.ministudy.com";
} else if (process.env.NODE_ENV == 'debug') {
    axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL =  API_URL||"http://qa-webim-api.toutiao.com";
    // axios.defaults.baseURL = "http://manage-api-toutiao.ministudy.com";
}
let exceptionHandler;
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.responseType = 'json';
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.validateStatus = function (status) {
    return true;
};
axios.defaults.timeout =  15000;

axios.interceptors.request.use(function (config) {
    config.headers.Accept = 'application/json';
    return config;
}, function (error) {
  // Do something with request error
  Message({
    // message: error.response ? error.response.statusText : error.message,
    message: '服务器响应超时，请稍后重试。',
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    let data = response.data;
    let status = response.status;
    if(data.code == 10030003){

    }
    // if (status === 200) {
    //     return Promise.resolve(response);
    // } else {
    //     if(exceptionHandler){
    //         return exceptionHandler(response);
    //     }else{
    //         return Promise.reject(response);
    //     }
    // }
    if(data.code == '10001'){
        location.href='/#/'
    }else if (status === 200) {
        return Promise.resolve(response);
    } else {
        if(exceptionHandler){
            return exceptionHandler(response);
        }else{
            return Promise.reject(response);
        }
    }
},
  error => {
    console.log('err' + error)// for debug
    Message({
      // message: error.response ? error.response.statusText : error.message,
      message: '服务器响应超时，请稍后重试。',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
);

let methods = ['get', 'post', 'put', 'delete'];
let api = {};
methods.forEach((method)=> {
    api[method] = function (uri, data, form, config) {
        if(form){
            config = Object.assign({}, config || {}, {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            })
            axios.defaults.transformRequest = [function (data) {
                return qs.stringify(data)
            }];
        }else{
            axios.defaults.transformRequest = [function (data) {
                return JSON.stringify(data)
            }];
        }
        return new Promise(function (resolve, reject) {
            axios[method](uri, data, config).then((response)=> {
                resolve(response);
            }).catch((response)=> {
                reject(response);
            })
        })
    }
});

api.setToken = function(token){
  axios.defaults.headers['Authorization'] = token;
}

api.setExceptionHandler = function(handler){
    exceptionHandler = handler;
}

export default api;
