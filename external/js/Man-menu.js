var baseurl='http://localhost:8080/exam_gzyz_ssm';
$(function () {
    load();
})
function reload(){
    $("#menu-Table").bootstrapTable("refresh");
}

/**
 * 向后台发送数据查询
 * @returns {*}
 */
function load() {
    let url=baseurl+'/Manager/queryMenu';
    $("#menu-Table").bootstrapTable({
        formatLoadingMessage:function (){
            return "数据加载中....";
        },
        formatNoMatches:function (){
            return "无匹配数据";
        },
        url:url,
        method:"POST",
        dataType:"JSON",
        striped:true,  //是否显示行间隔色
        columns:[
            {
                checkbox:true,
                visible:true,
            },
            {
                title:'行号',
                align:"center",
                halign:"center",
                formatter:function (value,row,index) {
                    return index+1;
                }

            },
            {
                title:'菜单名称',
                field:'meauName',
            },
            {
                title:'菜单级别',
                field:'meauLevel',
            },
            {
                title:'父菜单',
                field:'meauParentId',
                formatter(value,row,index){
                    jsonData={};
                    jsonData.meauParentId=value;
                    var meauName='无';
                    $.ajax({
                        url:baseurl+'/Manager/queryOneMenuById',
                        async:false,
                        data: jsonData,
                        type: "post",
                        success:function (res){
                            if (res!="" && res.length!=0){
                                console.log(res)
                                meauName=res;
                                console.log(res);
                            }
                        }
                    });
                    return meauName;
                }
            },
            {
                title:'创建时间',
                field:'createTime',
            },
            {
                title:'管理',
                field: 'meauId',
                formatter:function(value,row,index){
                    var quesId=row.quesId;
                    let del='<a onclick="delMenu(\''+value+'\')" href="javascript:void(0);">删除</a>';
                   /* let  edit='<a onclick="modifyQues(\''+row.pTitle+'\',\''+row.pcId+'\',\''+row.pStartTime+'\',\''+row.pEndTime+'\',\''+row.pFree+'\',\''+row.pStatus+'\',\''+row.userId+'\')">编辑</a>';*/
                    let  edit='<a onclick="modifyMenu(\''+value+'\',\''+row.meauName+'\',\''+row.meauLevel+'\')">编辑</a>';
                    return del+edit;
                }
            }
        ]
    })
}

/**
 * 删除菜单
 * @param menuId
 */
function delMenu(menuId){
    layer.confirm('确定要删除此菜单？', {
        btn: ['是','否'] //按钮
    }, function(){
        $.ajax({
            url:baseurl+'/Manager/delOneMenu',
            type:'post',
            data:JSON.stringify({"menuId":menuId}),
            contentType:'application/json',
            dataType:'json',
            success:function (res){
                if(res==true){
                    layer.msg('删除成功', {icon: 1});
                }else {
                    layer.msg('删除失败',  {icon: 2});
                }
            }
        });
    }, function(){
        layer.msg('已取消',  {icon: 2});
    });
}


//批量删除
$("#delSelMenu").on('click',function (){
    var rows=$("#menu-Table").bootstrapTable('getSelections');
    if (rows.length==0){
        alert("请先选择要删除的记录");
        return ;
    }else{
        var meauIds='';
        for(var i=0;i<rows.length;i++){
            meauIds+=rows[i].menuId+",";

        }
        meauIds=meauIds.substring(0,meauIds.length - 1);
        deleteMenus(meauIds);
    }

})
function deleteMenus(meauIds){
    var msg='您真的要删除吗？';
    if(confirm(msg)==true){
        $.ajax({
            url:'http://localhost:8080/exam_gzyz_ssm/Manager/delManyMenu',
            type:'post',
            contentType: 'application/json',
            data:JSON.stringify({"menuIds":meauIds}),
            dataType:'json',
            success:function (flag){
                if (flag==true){
                    layer.msg('删除成功', {icon: 1});
                    reload();
                }
            }
        })
    }
}

/**
 * 编辑菜单，打开弹框
 * @param munuId
 */
function modifyMenu(meauId,meauName,meauLevel){
    layer.open({
        type: 2,
        title: '编辑菜单',
        fix: false,
        shadeClose: true,
        shade: 0.8,
        area: ['660px', '420px'],
        content: '../views/管理员-编辑菜单（弹框页）.html',
        success:function (layero,index){
            let childBody=layer.getChildFrame('body',index);
            //
            $(childBody).find('input[name="meauId"]').val(meauId);
            $(childBody).find('input[name="meauName"]').val(meauName);
            $(childBody).find('select[name="meauLevel"] option[value="'+meauLevel+'"]').attr("selected",true);
            if (meauLevel==1){
                $(childBody).find('#ParentMeau').css('display','none');
            }
        },
        end:function (){
            reload();
        }
    });
}

/**
 * 点击添加按钮添加菜单
 */
$('#addMenu').on('click',function (){
    layer.open({
        type: 2,
        title: '添加菜单',
        fix: false,
        shadeClose: true,
        shade: 0.8,
        area: ['660px', '420px'],
        content: '../views/管理员-添加菜单（弹框页）.html',
        end:function (){
            reload();
        }
    });
})

//判断弹框
$(".delete").click(function(){
    layer.confirm('确定要删除此任务？', {
        btn: ['是','否'] //按钮
    }, function(){
        layer.msg('已删除', {icon: 1});
    }, function(){
        layer.msg('已取消',  {icon: 2});
    });
})

layui.use('form', function(){
    var form = layui.form;
    form.render();
});
