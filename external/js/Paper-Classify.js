var baseUrl='http://123.57.18.186:8080/exam_gzyz_ssm'
$(function () {
    load();
})
function reload(){
    $("#Mytable2").bootstrapTable("refresh");
}

function load() {
    let userId=localStorage.getItem("userId");
    let url=baseUrl+'/paper/queryAllClassify/'+userId;
    $("#Mytable2").bootstrapTable({
        formatLoadingMessage:function (){
            return "数据加载中...";
        },formatNoMatches:function (){
          return "无匹配数据";
        },
        url:url,
        method:"POST",
        dataType:"JSON",
        striped:true,  //是否显示行间隔色
        columns:[
            {
                checkbox:true,
                visible:true
            },
            {
                title:'行号',
                align:"center",
               /* halign:"center",*/
                formatter:function (value,row,index) {
                    return index+1;
                }

            },
            {
                title:'试卷分类类名',
                align:"center",
                field:'pcName'
            },
            {
                title:'增加时间',
                align:"center",
                field:'createTime',
            },
            {
                title: '操作',
                field: 'pcId',
                align:"center",
                formatter:function (value,row,index){
                    let del='<a onclick="delMsg(\''+value+'\')" class="delMsg" href="javaScript:void(0);">删除</a>';
                    /*let del='<a id="'+value+'" onclick="delMsg(\''+value+'\')" class="delMsg" href="javaScript:void(0);">删除</a>';*/
                    let edit='<a onclick="editMsg(\''+value+'\',\''+row.pcName+'\')" class="editMsg" href="javaScript:void(0);">修改</a>';
                    return del+" "+edit;
                }
            }
        ]
    });
}

/**
 * 删除功能实现2
 */
function delMsg(id){
    var data={"pcId":id};
    $.ajax({
        url:baseUrl+'/paper/delClassifyById',
        type:'post',
        contentType:'application/json;charset=UTF-8',
        data:JSON.stringify(data),
        dataType:'json',
        success:function (res){
            if(res=="1"){
                alert("删除成功");
                reload();
            }else {
                alert("删除失败");
            }
        }
    });
};

/**
 * 编辑试题
 * @param id
 * @param pcName  旧的时间分类名
 */
function editMsg(id,pcName){
    /**
     * 编辑试题分类弹框
     */
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.open({
            type: 2,
            title: '编辑试卷分类',
            fix: false,
            maxmin:false,
            shadeClose: true,
            shade: 0.8,
            area: ['660px', '420px'],
            content: 'paperEditPaperClassify.html',
            //弹出层页面成功打开后，的设置       加载子页面 渲染子页面 load后端数据 弹出 success 展示成功
            success:function(layero,index){
                //当前是表格页面     修改是表格的子页面   父页面JS代码中将数据传递给子页面中
                //获取子页面HTML对象  固定方法
                //js  dom对象
                let childBody= layer.getChildFrame('body',index);

                //在childBody子页面body区域中find（查找）input标签name属性是xxx的那个input对象，给其设置值为xxx
                $(childBody).find('input[name="pcId"]').val(id);
                $(childBody).find('input[name="pcName"]').val(pcName);
                //获取子页面JS对象
            },
            end: function () {
                location.reload();
            }
        });
    });
}

/**
 * 添加试题分类弹框
 */
$('#fabu').on('click', function(){
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.open({
            type: 2,
            title: '添加试卷分类',
            fix: false,
            shadeClose: true,
            shade: 0.8,
            area: ['660px', '420px'],
            content: 'paperAddPaperClassify.html',
            end: function () {
                location.reload();
            }
        });
    });
})

/*//判断弹框
$(".delete").click(function(){
    layer.confirm('确定要删除此任务？', {
      btn: ['是','否'] //按钮
    }, function(){
      layer.msg('已删除', {icon: 1});
    }, function(){
      layer.msg('已取消',  {icon: 2});
    });
})*/

layui.use('form', function(){
    var form = layui.form;
    form.render();
});