$(function () {
    load();
})
function reload(){
    $("#table").bootstrapTable("refresh");
}

function load() {
    let url="http://localhost:8080/exam_gzyz_ssm/paper/queryAllQuesByPid";
    $("#table").bootstrapTable({
        url:url,
        method:"POST",
        contentType: 'application/json',
        data:JSON.stringify({"pId":localStorage.getItem("pId")}),
        dataType:"JSON",
        columns:[
            {
                title:'行号',
                align:"center",
                halign:"center",
                checkbox:true,
                visible:true,
                formatter:function (value,row,index) {
                    return index+1;
                }

            },
            {
                title:'题目信息',
                field:'quesType',
                align:"center",
                formatter:function (value,row,index){
                    var trueval;
                    var second='';
                    var thired='';
                    if (value==0){
                        trueval="【单项选择题】 "+row.quesTitle+"。("+row.quesScore+")<br/>";
                        if (row.quesSelA!="" && row.quesSelA!=null && row.quesSelA.length!=0){
                            second+="A."+row.quesSelA+"<br/>";
                        }
                        if (row.quesSelB!="" && row.quesSelB!=null && row.quesSelB.length!=0){
                            second+="B."+row.quesSelB+"<br/>";
                        }
                        if (row.quesSelC!="" && row.quesSelC!=null && row.quesSelC.length!=0){
                            second+="C."+row.quesSelC+"<br/>";
                        }
                        if (row.quesSelD!="" && row.quesSelD!=null && row.quesSelD.length!=0){
                            second+="D."+row.quesSelD+"<br/>";
                        }
                        thired="正确答案："+row.quesAns;
                    }else if (value==1){
                        trueval="【简答题】 "+row.quesTitle+"。("+row.quesScore+")<br/>";
                        thired="正确答案："+row.quesAns;
                    }
                    return second==''?trueval+thired:trueval+second+thired;
                }
            }
        ]
    })
}

/**
 * 删除选中项  pId试卷id  quesIds试题id
 */
$("#delSelect").on('click',function (){
    var rows=$("#table").bootstrapTable('getSelections');
    if (rows.length==0){
        alert("请先选择要删除的记录");
        return ;
    }else{
        var quesIds='';
        for(var i=0;i<rows.length;i++){
            quesIds+=rows[i].quesId+",";

        }
        quesIds=quesIds.substring(0,quesIds.length - 1);
        deleteQues(quesIds);
    }

})
function deleteQues(quesIds){
    var msg='您真的要删除吗？';
    if(confirm(msg)==true){
        $.ajax({
            url:'http:localhost:8080/exam_gzyz_ssm/paper/delQuestion',
            type:'post',
            contentType: 'application/json',
            data: JSON.stringify({"quesIds":quesIds,"pId":localStorage.getItem("pId")}),
            dataType: 'json',
            success:function (flag){
                if (flag==true){
                    reload();
                }
            }
        })
    }
}

/**
 * 题库选题弹框
 */
$('#selFromStock').on('click', function(){
    layer.open({
        type: 2,
        title: '题库选题',
        fix: false,
        shadeClose: true,
        shade: 0.8,
        area: ['80%', '80%'],
        content: '../views/试卷-题库选题（弹框页）.html',
        end: function () {
            location.reload();
        }
    });
})


layui.use('form', function(){
    var form = layui.form;
    form.render();
});
