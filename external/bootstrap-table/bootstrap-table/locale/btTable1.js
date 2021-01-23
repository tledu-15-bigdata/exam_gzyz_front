$(function () {
    load();
})
function reload(){
    $("#myCourceTable").bootstrapTable("refresh");
}

function load() {
    let url="http://localhost:8080/exam_gzyz_ssm/question/type/queryCourse"
    $("#myCourceTable").bootstrapTable({
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
                userId:localStorage.getItem("userId")
            };
            return JSON.stringify(temp);
        },
        columns:[
            {
                title:'全部分组',
                field:'courName',

            },
            {
                title:'管理',
                formatter:function(value,row,index){
                    var courId=row.courId;
                    let url= 'http://localhost:8080/exam_gzyz_ssm/question/type/delCourseByName/'+courId;
                    let operations='<a href="javascript:removeCour(\''+url+'\')">删除</a>';
                    operations+='<a href="javascript:void(0)" onclick="modifyCour(\''+row.courId+'\',\''+row.courName+'\')">修改</a>';
                    return operations;

                }
            }

        ]
    })


}

function removeCour(url){

    $.ajax({
        url:url1,
        type:"get",
        success:function (flag){
            if (flag=="1"){
                reload();
            }
        }
    })
}

function modifyCour(courId,courName){
    layer.open({
        type:2,
        title:'修改分类',
        maxmin:false,
        shadeClose:false,
        area:['50%','50%'],
        content:'修改分类.html',
        success:function (layero,index){
            let childBody=layer.getChildFrame('body',index);
            $(childBody).find('input[name=courName]').val(courName);
            $(childBody).find('input[name=courId]').val(courId);
        }
    })
}