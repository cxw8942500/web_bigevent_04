$(function () {
    //定义校验表单规则
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '请输入1 ~ 6位'
            }
        }
    })
    //2.用户渲染，给表单赋值
    userRenderer()
    // 封装一个渲染用户的函数
    var layer = layui.layer

    function userRenderer() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('formUserInfo', res.data)
            }
        })
    }

    //3.表单重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        userRenderer()
    })

    //3.更新用户资料,给表单添加sumbit
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0) {
                    return layer.msg('资料修改不成功')
                }
                layer.msg(res.message)
                // console.log(res);
                window.parent.getUserInof()
            }
        })
    })


})