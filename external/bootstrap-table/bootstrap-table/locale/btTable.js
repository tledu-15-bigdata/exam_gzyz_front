$(function () {
    load();
})
function reload(){
    $("#myTable").bootstrapTable("refresh");
}

function load() {
    let url="http://localhost:8080/exam_gzyz//quesion/ques/queryQuestions"
    $("#myTable").bootstrapTable({
        url:url,
        method:"POST",
        dataType:"JSON",

        sidePagination:"server", //服务器端分页
        striped:true,  //是否显示行间隔色
        pageNumber:1,   //初始化加载第一页
        pagination:true,  //是否分页
        pageSize:5,   //单页记录数

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
                checkbox:true,
                visible:true
            },
            {
                title:'行号',
                align:"center",
                halign:"center",
                formatter:function (value,row,index) {
                    return index+1;
                }

            },
            // {
            //     title:'id',
            //     field:'userid',
            // },
            {
                title:'题目类型',
                field:'quesType',
                formatter:function (value,row,index){
                    var trueval;
                    if (value==0){
                        trueval="单项选择题"
                    }else if (value==1){
                        trueval="简单题"
                    }
                    return trueval
                }
            },
            {
                title:'试题分类',
                field:'courId',
                formatter(courId,row,index){
                    jsonData={};

                    jsonData.courId=courId;

                    $.ajax({
                        url:'http://localhost:8080/exam_gzyz_ssm/',
                        data: JSON.stringify(jsonData),
                        type: "post",
                        contentType: "application/json",
                        dataType: "JSON",
                        success:function (courName){
                            courId=courName;
                        }

                    })
                    return courId;
                }

            },
            {
                title:'试题内容',
                field:'quesTitle',
            },
            {
                title:'增加时间',
                field:'createTime',
            },
            {
                title:'管理',
                formatter:function(value,row,index){
                    var quesId=row.quesId;
                    let url= 'http://localhost:8080/exam_/removeData/'+quesId;
                    let operations='<a href="javascript:removeQues(\''+url+'\')">删除</a>';
                        operations+='<a href="javascript:void(0)" onclick="modifyQues()">修改</a>'
                    return operations;
                }
            }

        ]
    })


}

function remove(url){
    $.ajax({
        url:url,
        type:"get",
        success:function (flag){
            if (flag=="1"){
                reload();
            }
        }
    })
}

function modifyQues(){
    layer.open({
        type:2,
        title:'添加分类',
        maxmin:false,
        shadeClose:false,
        area:['50%','50%'],
        content:'修改分类.html',
        success:function (layero,index){
            let childBody=layer.getChildFrame('body',index);
            $(childBody).find().val()
        }
    })
}