$(function () {
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: ''
    }
    var layer = layui.layer
    var form = layui.form
    //1.渲染表格数据
    initTable()

    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                pageinit(res.total)
            }
        })
    }

    //2.渲染所有分类下拉列表
    initCate()

    function initCate() {
        $.ajax({
            method: "get",
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                //重新渲染layui
                form.render()
            }
        })
    }
    //3.筛选,//给表单添加监听事件
    $('#form-screen').on('submit', function (e) {
        e.preventDefault()
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initTable()
    })

    //4.分页
    var laypage = layui.laypage

    function pageinit(total) {
        laypage.render({
            curr: q.pagenum,
            limit: q.pagesize,
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr

                //首次不执行
                if (!first) {
                    //do something
                    initTable()
                }
            }
        });
    }
    //5.删除
    $('tbody').on('click', '.btn-del', function () {
        var id = $(this).attr('data-id')
        layer.confirm('是否删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: "GET",
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    //判断删除的事都是第一页或者这一页的最后一条数据
                    if ($('.btn-del').length === 1 && q.pagenum > 1) {
                        q.pagenum--
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })

    //6.编辑
    $('tbody').on('click', '.btn-compile', function () {
        var id = $(this).attr('data-id')
        sessionStorage.setItem('id',id)
        window.parent.document.querySelector('#act-pub').click()
        // console.log(id);
        // $.ajax({
        //     method: 'GET',
        //     url: '/my/article/' + id,
        //     success: function (res) {
        //         // console.log(res);
        //         if (res.status !== 0) {
        //             return layer.msg(res.message)
        //         }
        //         sessionStorage.setItem('id',JSON.stringify(res))
        //         // window.parent.document.querySelector('#act-pub').click()
        //     }
        // })
    })
})