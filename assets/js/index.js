$(function () {
    //1.获取用户基本信息
    getUserInof()

    //给退出绑定事件
    var layer = layui.layer
    $('#btnUpload').on('click', function () {
        layer.confirm('是否退出？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //清空token
            localStorage.removeItem('token')
            //跳换页面
            location.href = '/login.html'

            layer.close(index);
        });
    })
})


//封装一个获取用户信息的函数，因为后面要用，所以定义全局
function getUserInof() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return res.message
            }
            //调用一个渲染用户信息的函数
            renderAvatar(res.data)
        }
    })
}
//封装一个渲染页面数据的函数
function renderAvatar(user) {
    //1.昵称优先，如果没有就用用户名
    var name = user.nickname || user.username
    $('#welcome').html(`欢迎  ${name}`)
    //判断用户是否上传头像
    if (user.user_pic == null) {
        $('.layui-nav-img').hide()
        $('.text_avatar').html(name[0].toUpperCase())
    } else {
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.text_avatar').hide()
    }
}