import axios from 'axios'
import { Message } from 'element-ui';
import router from "../router";
axios.interceptors.response.use(success=>{
    //http响应码，是200的会进入到这里，如果是其他的则会进入到error里面
    //但是我们要知道，即使，进入到这里，也不一定是成功的，如账户被锁定、密码过期、账户过期、账户被禁用，但相应码依然是200
    //可以对照jq里面的ajax来理解
    if(success.status&&success.status==200&&success.data.status==500)//success.data.status这里status是返回后端json的状态码
    {
        //这里是业务上的错误
        Message.error({message:success.data.msg})//服务端respBean的msg属性内容
        return;//注意这里return为空，所以一会如果返回为空的话，则为请求失败，则页面展示的话这里不用管
    }
    //if(success)//这里可以不用写
    if(success.data.msg){
        Message.success({message:success.data.msg});//如果服务端返回msg,则前端提示，不返回则不提示
    }
    return success.data;
},error => {
    if(error.response.status==504||error.response.status==404){
        Message.error({message:'服务器不知道去哪了！！！( ╯□╰ )'})
    }else if(error.response.status==403){
        Message.error({message:'权限不足，请联系管理员'})
    }else if(error.response.status==401){
        Message.error({message:'尚未登录，，，，请登录'})
        router.replace("/")//回到登录页
    }else {
        if(error.response.data.msg){//如果服务端返回的有错误信息
            Message.error({message:error.response.data.msg})
        }else{

            Message.error({message:'未知错误'});
        }
    }
    return;
})
//封装请求
let base='';//以便加前缀

//登录的话springsecurity只支持keyvalue，不支持jison,当然可以改后端代码让其支持，这里不再修改
export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
//封装传递json的post
export const postRequest=(url,params)=>{
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    });
}
//封装传递json的put
export const putRequest=(url,params)=>{
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    });
}
//封装传递json的get
export const getRequest=(url,params)=>{
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    });
}
//封装传递json的delete
export const deleteRequest=(url,params)=>{
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    });
}