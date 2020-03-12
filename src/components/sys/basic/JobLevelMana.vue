<template>
    <div>
       <div>
           <el-input
                   size="small"
                   v-model="jl.name"
                   style="width: 300px;"
                   prefix-icon="el-icon-plus"
                   placeholder="添加职称..."></el-input>
           <el-select v-model="jl.titleLevel" placeholder="职称等级" size="small" style="margin-left: 5px;margin-right: 5px">
               <el-option
                       v-for="item in titleLevels"
                       :key="item"
                       :label="item"
                       :value="item"><!--label展示给用户看的,value是提交的-->
               </el-option>
           </el-select>
           <el-button icon="el-icon-plus" size="small" type="primary" @click="addJobLevel">添加</el-button>
       </div>
       <div style="margin-top: 10px">
           <el-table
                   :data="jls"
                   stripe
                   border
                   size="small"
                   style="width: 80%"
                   @selection-change="handleSelectionChange">
               <el-table-column
                       type="selection"
                       width="55">
               </el-table-column>
               <el-table-column
               <el-table-column
                       prop="id"
                       label="编号"
                       width="180">
               </el-table-column>
               <el-table-column
                       prop="name"
                       label="职称名称"
                       width="150">
               </el-table-column>
               <el-table-column
                       prop="titleLevel"
                       label="职称级别">
               </el-table-column>
               <el-table-column
                       prop="createDate"
                       label="创建时间">
               </el-table-column>
               <el-table-column
                       prop="enabled"
                       label="是否启用">
                   <template slot-scope="scope">
                       <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                       <el-tag type="danger" v-else>未启用</el-tag>
                   </template>

               </el-table-column>
               <el-table-column
                       label="操作">
                   <template slot-scope="scope">
                       <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
                       <el-button size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                   </template>
               </el-table-column>
           </el-table>
           <el-button type="danger" size="small" style="margin-top: 10px" :disabled="multipleSelection.length==0" @click="deleteMany">批量删除</el-button>
           <el-dialog
                   title="修改职称信息"
                   :visible.sync="dialogVisible"
                   width="30%">
               <div>
                   <table>
                       <tr>
                           <td><el-tag>职称名：</el-tag></td>
                           <td>
                               <el-input size="small" v-model="updatejl.name"></el-input>
                           </td>
                       </tr>
                       <tr>
                           <td><el-tag>职称级别</el-tag></td>
                           <td>
                               <el-select v-model="updatejl.titleLevel" placeholder="职称等级" size="small" style="margin-left: 5px;margin-right: 5px">
                                   <el-option
                                           v-for="item in titleLevels"
                                           :key="item"
                                           :label="item"
                                           :value="item"><!--label展示给用户看的,value是提交的-->
                                   </el-option>
                               </el-select>
                           </td>
                       </tr>
                       <tr>
                           <td><el-tag>是否启用</el-tag></td>
                           <td>
                               <el-switch
                                       v-model="updatejl.enabled"
                                       active-text="启用"
                                       inactive-text="未启用">
                               </el-switch>

                           </td>
                       </tr>
                   </table>

               </div>
               <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doUpdate = false">确 定</el-button>
              </span>
           </el-dialog>
       </div>
    </div>
</template>

<script>
    export default {
        name: "JobLevelMana",
        data(){
            return{
                multipleSelection: [],
                dialogVisible:false,
                updatejl:{
                    name:'',
                    titleLevel:'',
                    enabled:false
                },
                jls:[],
                jl:{
                    name:'',
                    titleLevel:''
                },
                titleLevels:[
                    '正高级',
                    '副高级',
                    '中级',
                    '初级',
                    '原级',
                ]
            }
        },mounted() {   //注意这里，mounted是一个方法，methods是一个属性
           this.initJls();//进入页面时候，初始化表格数据
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
                    this.deleteRequest("/system/basic/joblevel/"+ids).then(resp=>{
                        if(resp){
                            //删除成功
                            this.initJls();
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            doUpdate(){
                this.putRequest("/system/basic/joblevel/",this.updatejl).then(resp=>{
                    if(resp){
                        this.initJls();
                        this.dialogVisible=true;
                    }
                })
            },
            showEditView(data){
                Object.assign(this.updatejl,data)
                this.dialogVisible=true;//显示编辑对话框
            },
            deleteHandler(data){
                this.$confirm('此操作将永久删除【'+data.name+'】职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/joblevel/"+data.id).then(resp=>{
                        if(resp){//删除成功
                            this.initJls();//刷新表格
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addJobLevel(){
                if(this.jl.titleLevel&&this.jl.name){
                    this.postRequest("/system/basic/joblevel/",this.jl).then(resp=>{
                        if(resp){
                            this.initJls();

                        }
                    })
                }else{
                    this.$message.error("添加字段不能为空！");
                }

            },
            initJls(){
                this.getRequest("/system/basic/joblevel/").then(resp=>{
                    if(resp){
                        this.jls=resp;
                        this.jl={
                            name:'',
                            titleLevel:''
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>