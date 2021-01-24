$(function () {
    let url="http://localhost:8080/exam_gzyz_ssm/quesion/ques/queryQuestions";
    load(url);
})
function reload(){
    $("#myAllQuestion").bootstrapTable("refresh");
}

function load(url) {
    $("#myAllQuestion").bootstrapTable({
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
                title:'题目内容',
                field:'quesType',
                align:"center",
                formatter:function (value,row,index){
                    var index2=index+1+".";
                    var ques;
                    if (value==0){
                        ques="【单项选择题】("+row.quesScore+")"+row.quesTitle;
                    }else if (value==1){
                        ques="【简答题】("+row.quesScore+")"+row.quesTitle;
                    }
                    return index2+ques;
                }
            },
            {
                checkbox:true,
                visible:true
            },
        ]
    })
}
let baseUrl='http://localhost:8080/exam_gzyz_ssm';
/**
 * 点击筛选按钮
 */
$('#filter').on('click',function (){
   url= baseUrl+'/question/ques/queryQuestionsByCondition';
   load(url);
   reload();
});

/**
 * 当前页全选
 */
$('#selAll').on('click',function (){
    $("#myAllQuestion").bootstrapTable('checkAll');
})
/**
 * 取消当前页全选
 */
$('#cancelSelAll').on('click',function (){
    $("#myAllQuestion").bootstrapTable('uncheckAll');
});
/**
 * 点击确定按钮，添加向试卷中添加试题
 */
$('#Ok').on('click',function (){
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
        addQues(quesIds);
    }
})
function addQues(quesIds){
    var msg='您真的要删除吗？';
    if(confirm(msg)==true){
        var jsonData={"quesIds":quesIds,"pId":localStorage.getItem("pId")};
        $.ajax({
            url:'http:localhost:8080/exam_gzyz_ssm/quesion/ques/delManyQuestion',
            type:'post',
            data:JSON.stringify(jsonData),
            contentType:'application/jaon',
            dataType:'json',
            success:function (flag){
                if (flag==true){
                    reload();
                }
            }
        })
    }
}


/*
//弹框
$('#fabu').on('click', function(){
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.open({
            type: 2,
            title: '发布任务',
            fix: false,
            shadeClose: true,
            shade: 0.8,
            area: ['660px', '420px'],
            content: '02任务发布-发布任务.html',
            end: function () {
                location.reload();
            }
        });
    });
})
*/

/*
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
*/

layui.use('form', function(){
    var form = layui.form;
    form.render();
});
