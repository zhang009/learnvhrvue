<template>
    <div>
        <div class="permissManaTool">
            <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="请输入角色中文名" v-model="role.nameZh"></el-input>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
        </div>
        <div class="permissManaMain">
            <el-collapse v-model="activeName"   accordion @change="change"><!--v-model="activeName"-->
                <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <el-button style="float: right; padding: 3px 0;color: #ff0000" icon="el-icon-delete" type="text"
                                    @click="deleteRole(r)"></el-button>
                        </div>
                        <div><!--菜单项-->
                            <el-tree
                                    ref="tree"
                                    show-checkbox
                                    node-key="id"
                                    :key="index"
                                    :default-checked-keys="selectedMenus"
                                    :data="allmenus" :props="defaultProps" ></el-tree>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button @click="cancelUpdate">取消修改</el-button>
                                <el-button @click="doUpdate(r.id,index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>

                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissMana",
        data(){
            return{
                /*activeName:'2',*/
                role:{
                    name:'',
                    nameZh:''
                },
                roles:[],
                allmenus:[],
                activeName:-1,//手风琴激活面板
                selectedMenus:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'//展示出来的文本
                }
            }
        },
        mounted() {
          this.initRoles();
        },
        methods:{
            deleteRole(role){
                this.$confirm('此操作将永久删除【'+role.nameZh+'】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   this.deleteRequest("/system/basic/permiss/role/"+role.id).then(resp=>{
                       if(resp){

                           this.initRoles();
                       }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doAddRole(){
                if(this.role.name&&this.role.nameZh){
                    this.postRequest("/system/basic/permiss/role",this.role).then(resp=>{
                        if(resp){
                            this.initRoles();
                            this.role.name='';
                            this.role.nameZh='';
                        }
                    })
                }else{
                    this.$message.error("请填写完整信息！");
                }

            },
            cancelUpdate(){
                this.activeName=-1;
            },
            doUpdate(rid,index){
               // console.log(rid);//获取当前角色的id
                let tree=this.$refs.tree[index];      // 获取选中的资源id
                let selectedKeys=tree.getCheckedKeys(true);
               // console.log(selectedKeys);
                let url='/system/basic/permiss/?rid='+rid;
                selectedKeys.forEach(key=>{
                    url+='&mids='+key;
                })
                this.putRequest(url).then(resp=>{
                    if(resp){
                       // this.initRoles();
                        this.activeName=-1;//收起面板
                    }
                })
            },
            change(rid){
                if(rid){//展开时响应
                    this.initAllMenus();
                    this.initSelectedMenus(rid);
                }
            },
            initSelectedMenus(rid){
                this.getRequest("/system/basic/permiss/mids/"+rid).then(resp=>{
                    if(resp){
                        this.selectedMenus=resp;
                    }
                })
            },
            initAllMenus(){
                this.getRequest("/system/basic/permiss/menus").then(resp=>{
                    if(resp){
                        this.allmenus=resp;
                    }
                })
            },
            initRoles(){
                this.getRequest("/system/basic/permiss/").then(resp=>{
                    if(resp){
                        this.roles=resp;
                    }
                })

            }
        }
    }
</script>

<style>
    .permissManaMain{
        margin-top: 10px;
        width: 700px
    }
    .permissManaTool{
        display: flex;

    }
    .permissManaTool .el-input{
        width: 300px;
        margin-right: 3px;
    }

</style>