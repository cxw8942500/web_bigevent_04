$(function () {
    //点击去注册用户，登录页面隐藏，注册页面显示
    $('#reg-link').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击去登录，注册页面隐藏，登录页面显示
    $('#login-link').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //校验表单
    let form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            if ($('#form_reg input[name=password]').val() !== value) {
                return '两次输入不一致'
            }
        }
    })
    //监听注册表单
    var layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg input[name=username]').val(),
                password: $('#form_reg input[name=password]').val()
            },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜你，注册成功!')
                $('#form_reg')[0].reset()
                $('#login-link').click()
            }
        })
    })
    //登录表单
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                //存储token
                localStorage.setItem('token', res.token)
                //跳转页面
                location.href = '/index.html'
            }
        })
    })
})