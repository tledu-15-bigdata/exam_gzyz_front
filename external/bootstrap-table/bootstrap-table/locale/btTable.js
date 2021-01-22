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
                        trueval="单项选择题";
                    }else if (value==1){
                        trueval="简答题";
                    }
                    return trueval;
                }
            },
            {
                title:'试题分类',
                field:'courId',
                formatter(value,row,index){
                    jsonData={};
                    jsonData.courId=value;
                    var courId;
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
                        operations+='<a href="javascript:void(0)" onclick="modifyQues(\''+row.quesId+'\',\''+row.quesType+'\',\''+row.courId+'\',\''+row.quesTitle+'\',\''+row.quesSelA+'\',\''+row.quesSelB+'\',\''+row.quesSelC+'\',\''+row.quesSelD+'\',\''+row.quesAns+'\',\''+row.quesScore+'\',\''+row.quesImg+'\',\''+row.createTime+'\',)">修改</a>'
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

function modifyQues(quesId,quesType,courId,quesTitle,quesSelA,quesSelB,quesSelC,quesSelD,quesAns,quesScore,quesImg,createTime){
    layer.open({
        type:2,
        title:'编辑',
        maxmin:false,
        shadeClose:false,
        area:['60%','90%'],
        content:'修改试题.html',
        success:function (layero,index){
            let childBody=layer.getChildFrame('body',index);
            //
            $(childBody).find('#box1_get_quesId').val(quesId);
            $(childBody).find('input[value='+quesType+']').prop("checked","checked");
            $(childBody).find('.box1_get_courId').val(courId);
            $(childBody).find('.box1_get_quesTitle').val(quesTitle);
            $(childBody).find('.box1_get_a').val(quesSelA);
            $(childBody).find('.box1_get_b').val(quesSelB);
            $(childBody).find('.box1_get_c').val(quesSelC);
            $(childBody).find('.box1_get_d').val(quesSelD);
            $(childBody).find('input[value='+quesAns+']').prop("checked","checked");
            $(childBody).find('.box1_get_quesScore').val(quesScore);
            //
            $(childBody).find('#box2_get_quesId').val(quesId);
            $(childBody).find('.box2_get_courId').val(courId);
            $(childBody).find('.box2_get_quesTitle').val(quesTitle);
            $(childBody).find('.box2_get_quesAns').val(quesAns);
            $(childBody).find('.box2_get_quesScore').val(quesScore);

        }
    })
}


//批量删除
$("#shanchuxuanzhong").on('click',function (){
    var rows=$("#myTable").bootstrapTable('getSelections');
    if (rows.length==0){
        alert("请先选择要删除的记录");
        return ;
    }else{
        var quesIds='';
        for(var i=0;i<rows.length;i++){
            quesIds+=rows[i]['quesId']+",";

        }
        quesIds=quesIds.substring(0,quesIds.length - 1);
        deleteQues(quesIds);
    }

})

function deleteQues(quesIds){
    var msg='您真的要删除吗？';
    if(confirm(msg)==true){
        $.ajax({
            url:'http:localhost:8080/exam_gzyz_ssm/quesion/ques/delManyQuestion',
            type:'post',
            data: {
                quesIds:quesIds
            },
            success:function (flag){
                if (flag&&flag=="1"){
                    $("#myTable").bootstrapTable('refresh');
                }
            }
        })
    }
}