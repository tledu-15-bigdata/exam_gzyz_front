var baseurl='http://123.57.18.186:8080/exam_gzyz_ssm'
$(function () {
    load();
})
function reload(){
    $("#userTable").bootstrapTable("refresh");
}

/**
 * 向后台发送数据查询
 * @returns {*}
 */
function load() {
    let url=baseurl+'/User/queryAllUser';
    $("#userTable").bootstrapTable({
        formatLoadingMessage:function (){
            return "数据加载中....";
        },
        formatNoMatches:function (){
            return "去匹配数据";
        },
        url:url,
        method:"POST",
        dataType:"JSON",
        sidePagination:"server", //服务器端分页
        striped:true,  //是否显示行间隔色
        pageNumber:1,   //初始化加载第一页
        pagination:true,  //是否分页
        pageSize:10,   //单页记录数

        //查询时携带的参数  data:JSON.stringify()
        queryParams:function(params){   //上传服务器的参数
            var temp={
                offSet:params.offset, //SQL语句起始索引
                pageNumber: params.limit, //每页显示数量
            };
            return JSON.stringify(temp);
        },
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
                title:'用户账号',
                field:'userPhone',
            },
            {
                title:'用户昵称',
                field:'userName',
            },
            {
                title:'密码',
                field:'userPwd',
            },
            {
                title:'注册时间',
                field:'createTime',
            },
            {
                title:'状态',
                field:'isDelete',
                formatter:function(value,row,index){
                    let status
                    if(value==0){
                        status='<a onclick="editStatus(\''+row.userId+'\',\''+row.isDelete+'\')" title="点击禁用" href="javascript:void(0);">已启动</a>';
                    }else {
                        status='<a onclick="editStatus(\''+row.userId+'\',\''+row.isDelete+'\')" title="点击启动" href="javascript:void(0);">已禁用</a>';
                    }
                    return status;
                }
            }

        ]
    })
}

/**
 * 修改用户状态
 * @param userId
 */
function editStatus(userId,isDelete){
    if(isDelete==0){
        isDelete=1
    }else {
        isDelete=0
    }

    layer.confirm('确定要修改状态？', {
        btn: ['是','否'] //按钮
    }, function(){
        $.ajax({
            url:baseurl+'/Manager/managerUser',
            type:'post',
            data:JSON.stringify(
                {"userId":userId,
                    "isDelete":isDelete},

                ),
            contentType:'application/json',
            dataType:'json',
            success:function (res){
                if (res==true){
                    layer.msg('操作成功', {icon: 1});
                    reload();
                }else {
                    layer.msg('操作失败', {icon: 2});
                }
            }
        });
    }, function(){
        layer.msg('已取消',  {icon: 2});
    });
}
