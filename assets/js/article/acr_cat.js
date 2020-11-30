$(function () {


    var layer = layui.layer
    var form = layui.form
    //1.调用渲染文章列表的函数
    iuitTable()

    function iuitTable() {
        $.ajax({
            method: 'get',
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 2.添加分类列表
    var indexAdd = null
    $('#addclass').on('click', function () {
        indexAdd = layer.open({
            title: '添加文章分类',
            area: ['500px', '300px'],
            type: 1,
            content: $('#tpl-add').html() //这里content是一个普通的String
        });
    })
    // 3.监听提交分类
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 重新渲染
                iuitTable()
                //关闭弹出层
                layer.close(indexAdd)
            }
        })
    })


    //4.编辑功能
    var indexCom = null
    $('tbody').on('click', '.btn-compile', function () {
        var id = $(this).attr('data-id')
        indexCom = layer.open({
            title: '添加文章分类',
            area: ['500px', '300px'],
            type: 1,
            content: $('#tpl-Com').html() //这里content是一个普通的String
        });
        //根据id拿到表单数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val("form-Com", res.data);
            }
        })
        //5.重置按钮
        $('body').on('click', '.btnReset', function () {
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    form.val("form-Com", res.data);
                }
            })
        })
    })

    // //5.监听编辑表单
    $('body').on('submit', '#form-Com', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 重新渲染
                iuitTable()
                //关闭弹出层
                layer.close(indexCom)
            }
        })
    })

    //6.删除功能
    $('tbody').on('click', '.btn-del', function () {
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function (res) {

                layer.confirm('是否删除?', {
                    icon: 3,
                    title: '提示'
                }, function (index) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    iuitTable()
                    layer.close(index);
                });
                // console.log(res);


            }
        })
    })
})