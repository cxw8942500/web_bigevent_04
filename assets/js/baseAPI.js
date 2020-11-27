//1.开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net'
//2.测试环境服务器地址
// var baseURL = 'http://ajax.frontend.itheima.net'
//1.生产环境服务器地址
// var baseURL = 'http://ajax.frontend.itheima.net'

//拦截所有的ajax请求
$.ajaxPrefilter(function (params) {
    //拼接对应环境的服务器地址
    // 带着权限去访问页面
    params.url = baseURL + params.url
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //拦截所有响应，判断认证信息
    params.complete = function (res) {
        console.log(res);
        var obj = res.responseJSON
        if (obj.status === 1 && obj.message === "身份认证失败！") {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})