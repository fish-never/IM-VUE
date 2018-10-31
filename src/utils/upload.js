function getOssToken(){
    var token = localStorage.getItem('Token');
    return $.ajax({
        method: 'get',
        // axios.defaults.baseURL = "http://tmp-manage-api.ministudy.com";
        // url: 'http://manage-api.ministudy.com/oss/upload/token',
        // url: 'http://tmp-manage-api.ministudy.com/oss/upload/token',

        url: (API_URL||'http://manage-api.ministudy.com/')+'oss/upload/token?type=image',
        // url: 'http://manage-api-toutiao.ministudy.com/oss/upload/token',
        
        headers:{
            'Authorization': token
        }
    })
}

function uploadToOss(callback, feildName){
    getOssToken().done(function(resp){
        console.log(resp)
        if(resp.code != 0){
            return alert('获取oss token异常')
        }
        var filePath = $('[name=localUrl]').val();
        if(filePath == ''){
            return alert('请选择文件')
        }

        var tokenObj = resp.data;
        var form = new FormData();
        var const_para = "/${filename}";
        form.append("key",tokenObj.dir + const_para);
        form.append("name", "whatever_you_want");
        form.append("policy",tokenObj.policy);
        form.append("OSSAccessKeyId", tokenObj.accessid);
        form.append("success_action_status", "200");
        form.append("signature", tokenObj.signature);
        form.append("callback",tokenObj.callback);
        form.append("file", $('[name='+ (feildName || 'imgFile') +']')[0].files[0]);
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": tokenObj.host,
            "method": "POST",
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        }
        $.ajax(settings).done(function (response) {
            callback(JSON.parse(response))
        });
    })
}

export default {
    uploadToOss,
    ok(){
        console.log(333)
    }
};
