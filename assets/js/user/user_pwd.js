$(function () {
    //1.定义表单验证规则
    var form = layui.form
    form.verify({
        // 密码
        pwd: function (value) {
            if (value == $('.layui-form input[name=oldPwd]').val()) {
                return '新密码和旧密码不能一样'
            }
        },
        //确认密码
        repwd: function (value) {
            if (value !== $('.layui-form input[name=newPwd]').val()) {
                return '两次输入不一致'
            }
        }
    })
    //发送ajax  修改密码
    var layer = layui.layer
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                window.parent.location.href = '/login.html'
                //清空token
                localStorage.removeItem('token')
            }
        })
    })
})