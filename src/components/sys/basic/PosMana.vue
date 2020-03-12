<template><!--template下面只有一个跟节点，也就是都是页面都需要包含在一个div,
            因为template渲染的时候会消失，如果有多个标签，那系统就不能识别其布局-->
    <div>
        <div>
            <el-input
                    size="small"
                    class="addPostInput"
                    placeholder="添加职位..."
                    prefix-icon="el-icon-plus"
                    @keydown.enter.native="addPosition"
                    v-model="pos.name"><!--这里就是一会儿要添加的数据,这里上传的时候使用json-->
            </el-input>
            <el-button icon="el-icon-plus" type="primary" size="small" @click="addPosition">添加</el-button>
        </div>
        <div class="posManaMain">
            <el-table
                :data="positions"
                border
                stripe
                @selection-change="handleSelectionChange"
                size="small"
                style="width: 70%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职位名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        width="120px"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        label="是否启用">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope"><!--slot-scope的出现实现了父组件调用子组件内部的数据，子组件的数据通过slot-scope属性传递到了父组件-->
                        <el-button
                                size="mini"
                                @click="showEditView(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button
                    size="mini"
                    type="danger"
                    style="margin-top:8px "
                    @click="deleteMany" :disabled="multipleSelection.length==0">批量删除</el-button><!--批量删除-->

            <el-dialog
                    title="修改职位"
                    :visible.sync="dialogVisible"
                    width="30%">
                   <!-- 这里去掉关闭之前的回调:before-close="handleClose"-->
                <div><!--展示的内容-->
                    <div>
                        <el-tag>职位名称</el-tag>
                        <el-input class="updatePostInput" size="small" v-model="updatePos.name"></el-input>
                    </div>
                    <div>
                        <el-tag>是否启用</el-tag>
                        <el-switch
                                v-model="updatePos.enabled"
                                active-text="启用"
                                inactive-text="禁用">
                        </el-switch>
                    </div>

                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="doUpdate" >确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {deleteRequest} from "../../../utils/api";

    export default {
        name: "PosMana",
        data(){
            return {
                pos:{
                    name:''
                },
                dialogVisible:false//编辑弹出框显示标记
                ,updatePos:{//编辑输入框中职位名字
                    name:'',
                    enabled:false
                }
                , multipleSelection: []//批量操作勾选数组
                ,
                positions: []
            }
        },mounted() {
            this.initPositions();
        },methods:{
            deleteMany(){
                this.$confirm('此操作将永久删除【'+this.multipleSelection.length+'】条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   //点击确定批量删除
                        let ids='?';
                        this.multipleSelection.forEach(item=>{
                            ids+='ids='+item.id+'&'
                        })
                        this.deleteRequest("/system/basic/pos/"+ids).then(resp=>{
                            if(resp){
                                //删除成功
                                this.initPositions();
                            }
                        });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val){
                this.multipleSelection=val;
                console.log(val);
            },
            addPosition(){
                if(this.pos.name){
                    this.postRequest("/system/basic/pos/",this.pos).then(resp=>{
                        if(resp){
                            //添加成功之后，要把表格刷新一下
                            this.initPositions();
                            this.pos.name='';//清空输入框
                        }
                    })//注意这里要使用pos而不是pos.name
                }else{
                    this.$message.error('请输入职位名称！');
                }
            },
            showEditView(index,data){
               // this.updatePos=data;//这里data为点击所在行的数据,这里是变量的直接赋值，但在用户取消操作的时候，会出现修改了表格中行的信息，所以这里是不对的
                Object.assign(this.updatePos,data);//变量的拷贝，而不是赋值
                this.dialogVisible=true;//设置可见
            },
            doUpdate(){
                this.putRequest("/system/basic/pos/",this.updatePos).then(resp=>{
                    if(resp){
                        this.initPositions();//刷新
                        this.updatePos.name='';
                        this.dialogVisible=false;
                    }
                })
            },
            handleDelete(index,data){
                this.$confirm('此操作将永久删除【'+data.name+'】职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/pos/"+data.id).then(resp=>{
                        if(resp){//删除成功
                            this.initPositions();//刷新表格
                        }
                    })
                    /*this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });*/
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            initPositions(){
                this.getRequest("/system/basic/pos/").then(resp=>{
                    if(resp){//如果获取到数据
                        this.positions=resp;
                    }
                })
            }
        }
    }
</script>

<style >
    .updatePostInput{/*编辑输入框样式*/
        width: 200px;
        margin-left: 8px;
    }
    .posManaMain{
        margin-top: 10px;
    }
    .addPostInput{/*添加职位输入框样式*/
        width: 300px;
        margin-right: 8px
    }
</style>