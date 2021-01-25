var baseurl='http://localhost:8080/exam_gzyz_ssm';
$(function () {
    load();
})
function reload(){
    $("#table").bootstrapTable("refresh");
}

/**
 * 向后台发送数据查询
 * @returns {*}
 */
function load() {
    let url=baseurl+'/paper/queryAllPapers';
    $("#table").bootstrapTable({
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
                userId:localStorage.getItem("userId")
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
                title:'试卷标题',
                field:'pTitle',
            },
            {
                title:'试卷分类',
                field:'pcId',
                formatter(value,row,index){
                    jsonData={};
                    jsonData.pcId=value;
                    var pcName='';
                    $.ajax({
                        url:baseurl+'/paper/queryOneClassify',
                        type: "post",
                        contentType: "application/json",
                        data: JSON.stringify(jsonData),
                        dataType: "JSON",
                        success:function (res){
                            pcName=res.pcName;
                            console.log(res.pcName);
                        }
                    });
                    return pcName;
                }
            },
            {
                title:'总分',
                field:'pTolScore',
            },
            {
                title:'开始时间',
                field:'pStartTime',
            },{
                title:'结束时间',
                field:'pEndTime',
            },{
                title:'随意时间考试',
                field: 'pFree',
                formatter:function (value,row,index){
                    var msg;
                    if (value==1){
                        msg="是";
                    }else if (value==0){
                        msg="否";
                    }
                    return msg;
                }
            },{
                title:'考试码',
                field:'pRandNum',
            },{
                title: '创建时间',
                field: 'createTime'
            },{
                title:'管理',
                field: 'pId',
                formatter:function(value,row,index){
                    var quesId=row.quesId;
                    let del='<a onclick="delMsg(\''+value+'\')" href="javascript:void(0);">删除</a>';
                    let addQuestion='<a onclick="questionManager(\''+value+'\')" href="javaScript:void(0);">试题设置</a>';
                    /*let  edit='<a onclick="modifyQues(\''+row.pTitle+'\',\''+row.pcId+'\',\''+row.pStartTime+'\',\''+row.pEndTime+'\',\''+row.pFree+'\',\''+row.pStatus+'\',\''+row.userId+'\')">编辑</a>';*/

                    let  edit2='<a onclick="modifyQues(\''+row.pId+'\',\''+row.pTitle+'\',\''+row.pcId+'\',\''+row.pStartTime+'\',\''+row.pEndTime+'\',\''+row.pFree+'\',\''+row.pStatus+'\',\''+row.userId+'\')">编辑</a>'
                    return del+addQuestion+edit2;
                }
            }

        ]
    })
}

/**
 * 点击试题设置，跳转页面
 * @param pId
 */
function questionManager(pId){
    localStorage.setItem("pId",pId);
    window.location.href='../views/试卷-试题设置.html';
}
/**
 * 点击编辑信息进入编辑试卷页面
 * @param pTitle
 * @param pcId
 * @param pStartTime
 * @param pEndTime
 * @param pFree
 * @param pStatus
 * @param userId
 */
function modifyQues(pId,pTitle,pcId,pStartTime,pEndTime,pFree,pStatus,userId){
    layer.open({
        type:2,
        title:'编辑试卷信息',
        maxmin:false,
        shadeClose:false,
        area:['60%','90%'],
        content:'../views/试卷-编辑试卷（弹框页）.html',
        success:function (layero,index){
            let childBody=layer.getChildFrame('body',index);
            //
            $(childBody).find('input[name="pId"]').val(pId);
            $(childBody).find('input[name="pTitle"]').val(pTitle);
            $(childBody).find('option[value='+pcId+']').attr("selected",'selected');
            $(childBody).find('input[name="pStartTime"]').val(pStartTime);
            $(childBody).find('input[name="pEndTime"]').val(pEndTime);
            $(childBody).find('input[value='+pFree+']').val(pFree);
            $(childBody).find('input[value='+pStatus+']').attr('checked',true);
        },
        end:function (){
            reload();
        }
    })
}


/**
 * 批量删除试卷
 */
$("#delManyPaper").on('click',function (){
    var rows=$("#table").bootstrapTable('getSelections');
    if (rows.length==0){
        alert("请先选择要删除的记录");
        return ;
    }else{
        var pIds='';
        for(var i=0;i<rows.length;i++){
            pIds+=rows[i].pId+",";
        }
        pIds=pIds.substring(0,pIds.length - 1);
        deleteQues(pIds);
    }

})
function deleteQues(pIds){
    var msg='您真的要删除吗？';
    if(confirm(msg)==true){
        $.ajax({
            url:baseurl+'/paper/delManyPaper/'+pIds,
            type:'post',
            dataType:'post',
            success:function (flag){
                if (flag==true){
                   alert("删除成功");
                   reload();
                }
            }
        })
    }
}

/**
 * 删除单个试卷
 * @param pId
 */
function delMsg(pId){
    layer.confirm('确定要删除此试卷？', {
        btn: ['是','否'] //按钮
    }, function(){
        $.ajax({
            url:baseurl+'/paper/delOnePaper/'+pId,
            type:'post',
            dataType:'json',
            success:function (res){
                if (res==true){
                    layer.msg('删除成功', {icon: 1});
                    reload();
                }else {
                    layer.msg('删除失败', {icon: 2});
                }
            }
        });
    }, function(){
        layer.msg('已取消',  {icon: 2});
    });
}

/**
 * 添加试卷弹框
 */
$('#fabu').on('click', function(){
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.open({
            type: 2,
            title: '添加试卷',
            fix: false,
            shadeClose: true,
            shade: 0.8,
            area: ['750px', '500px'],
            /*content: '试卷-添加试卷（弹框页）.html',*/
            content: '../views/试卷-添加试卷（弹框页）.html',
            end: function () {
                location.reload();
            }
        });
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