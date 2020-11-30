$(function () {
    var layer = layui.layer
    var form = layui.form
    //1.获取数据下拉列表
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                //  console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //调用layui重新渲染

                form.render()
                getinitCate()
            }
        })
    }
    //2.// 初始化富文本编辑器
    initEditor()

    //3.  // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)



    $('#btnSel').on('click', function () {
        $('#uplod').click()
    })


    // 更换图片
    $('#uplod').on('change', function (e) {
        var file = e.target.files[0]
        if (file === undefined) {
            return
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var state = null
    $('#btnsame1').on('click', function () {
        state = '已发布'
    })
    $('#btnsame2').on('click', function () {
        state = '草稿'
    })
    $('#form-cates').on('submit', function (e) {
        e.preventDefault()
        // console.log(23);
        var fd = new FormData(this)
        fd.append('state', state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                var see = sessionStorage.getItem('id')
                // 如果本地存储为空就是发表文章   不空就是修改文章
                if (see == null) {
                    $.ajax({
                        method: 'POST',
                        url: '/my/article/add',
                        data: fd,
                        contentType: false,
                        processData: false,
                        success: function (res) {
                            // console.log(res);
                            if (res.status !== 0) {
                                return layer.msg(res.message)
                            }
                            layer.msg(res.message)
                            // location.href = '/article/acr_list.html'
                            window.parent.document.querySelector('#act-list').click()
                        }
                    })
                } else {
                    fd.append('Id', see)
   
                    publishArticle(fd)
                }

            })
    })




    //获取对应的信息

    function getinitCate() {
        //更新文章信息
        //根据id获取对应的信息
        var id = sessionStorage.getItem('id')
        if (!id) {
            return
        } else {
            $.ajax({
                method: "GET",
                url: "/my/article/" + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    form.val('form-cates', res.data)
                    //  tinymce赋值  
                    // tinyMCE.activeEditor.setContent(res.data.content)
                    // 图片
                    // 判断用户是否上传封面
                    if (!res.data.cover_img) {
                        return layer.msg('用户还未上传封面')
                    }
                    var newImgURL = baseURL + res.data.cover_img
                    $image
                        .cropper('destroy') // 销毁旧的裁剪区域
                        .attr('src', newImgURL) // 重新设置图片路径
                        .cropper(options) // 重新初始化裁剪区域
                }
            })
        }

    }


    //封装一个更新文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜你，修改文章成功')
                window.parent.document.querySelector('#act-list').click()
                sessionStorage.removeItem('id')
            }
        })
    }

})