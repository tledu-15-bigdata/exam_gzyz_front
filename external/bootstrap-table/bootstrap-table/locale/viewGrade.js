$(function () {
    load();
})
function reload(){
    $("#gradeViewTab").bootstrapTable("refresh");
}

function load() {
    console.log("yihu")
    console.log(localStorage.getItem("pId"))
    let url="http://localhost:8080/exam_gzyz_ssm/exam/queryGrageBypid";
    $("#gradeViewTab").bootstrapTable({
        url:url,
         method:"POST",
         dataType:"JSON",

        striped:true,  //是否显示行间隔色

        //查询时携带的参数  data:JSON.stringify()
        queryParams:function(params){   //上传服务器的参数
            var temp={
                pId:localStorage.getItem("pId")
            };
            return JSON.stringify(temp);
        },
        columns:[
            // {
            //     checkbox:true,
            //     visible:true
            // },
            {
                title:'行号',
                align:"center",
                halign:"center",
                formatter:function (value,row,index) {
                    return index+1;
                }

            },
            {
                title:'登录号',
                field:'pId',
            },


            {
                title:'学生ID',
                field:'stu_name',
            },
            {
                title:'学生成绩',
                field:'psgGrade',
            },
            // {
            //     title:'管理',
            //     formatter:function(value,row,index){
            //         var quesId=row.quesId;
            //         let url= 'http://localhost:8080/exam_gzyz_ssm/question/ques/delOneQuestion/'+quesId;
            //         let operations='<a href="javascript:removeQues(\''+url+'\')">删除</a>';
            //             operations+='<a href="javascript:void(0)" onclick="modifyQues(\''+row.quesId+'\',\''+row.quesType+'\',\''+row.courId+'\',\''+row.quesTitle+'\',\''+row.quesSelA+'\',\''+row.quesSelB+'\',\''+row.quesSelC+'\',\''+row.quesSelD+'\',\''+row.quesAns+'\',\''+row.quesScore+'\',\''+row.quesImg+'\',\''+row.createTime+'\',)">修改</a>'
            //         return operations;
            //     }
            // }

        ]
    })


}




