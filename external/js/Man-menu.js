var baseurl='http://localhost:8080/exam_gzyz_ssm';
$(function () {
    load();
})
function reload(){
    $("#menuTable").bootstrapTable("refresh");
}

/**
 * 向后台发送数据查询
 * @returns {*}
 */
function load() {
    let url=baseurl+'/Manager/queryMenu';
    $("#menuTable").bootstrapTable({
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
                field:'menuName',
            },
            {
                title:'菜单级别',
                field:'menuLevel',
            },
            {
                title:'总分',
                field:'createTime',
            },
            {
                title:'管理',
                field: 'menuId',
                formatter:function(value,row,index){
                    var quesId=row.quesId;
                    let del='<a onclick="delMenu(\''+value+'\')" href="javascript:void(0);">删除</a>';
                   /* let  edit='<a onclick="modifyQues(\''+row.pTitle+'\',\''+row.pcId+'\',\''+row.pStartTime+'\',\''+row.pEndTime+'\',\''+row.pFree+'\',\''+row.pStatus+'\',\''+row.userId+'\')">编辑</a>';*/
                    let  edit='<a onclick="modifyQues(\''+value+'\')">编辑</a>';
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
    layer.confirm('确定要删除此任务？', {
        btn: ['是','否'] //按钮
    }, function(){
        $.ajax({
            url:baseurl+'/Manager/queryMenu',
            type:'post',
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
