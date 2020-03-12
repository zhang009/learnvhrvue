<template>
    <div style="width: 500px">
        <el-input
                placeholder="请输入部门名称进行搜索"
                v-model="filterText"
                prefix-icon="el-icon-search">
        </el-input>

        <el-tree
                :data="deps"
                :props="defaultProps"
                :filter-node-method="filterNode"
                expand-on-click-node="false"
                ref="tree">
             <span class="custom-tree-node" style="display:flex;justify-content: space-between;width: 100%" slot-scope="{ node, data }"><!--data为服务端返回的jsonOjbect-->
                <span>{{ node.label }}</span>
                <span>
                  <el-button
                          type="primary"
                          size="mini"
                          class="depBtn"
                          @click="() => showAddDepView(data)">
                    添加部门
                  </el-button>
                  <el-button

                          size="mini"
                          type="danger"
                          class="depBtn"
                          @click="() => deleteDep( data)">
                    删除部门
                  </el-button>

                </span>
              </span>
        </el-tree>
        <el-dialog
                title="添加部门"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td><el-tag>上级部门</el-tag></td>
                        <td>{{pname}}</td>
                    </tr>
                    <tr>
                        <td><el-tag>部门名称</el-tag></td>
                        <td><el-input v-model="dep.name" placeholder="请输入部门名称..."></el-input></td>
                    </tr>


                </table>

            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddDep">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data(){
            return {
                dialogVisible:false,
                filterText:'',
                deps:[],
                dep:{
                    name:'',
                    parentId:-1
                },
                pname:'',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        watch: {
            filterText(val) {//当filterText的值发生变化的时候会触发此方法，val即为filterText的最新值
                this.$refs.tree.filter(val);
            }
        },
        mounted() {
            this.initDeps();
        },
        methods:{
            initDep(){
              this.dep={
                  name:'',
                  parentId:-1
              },
              this.pname=''
            },
            addDep2Deps(deps,dep){//解决添加部门之后，弹窗收起问题
                for(let i=0;i<deps.length;i++){
                    let d=deps[i];
                    if(d.id=dep.parentId){
                        d.children=d.children.concat(dep);
                        return;
                    }else{
                        this.addDep2Deps(d.children,dep);
                    }
                }
            },
            doAddDep(){
                this.postRequest("/system/basic/department/",this.dep).then(resp=> {
                    if(resp){
                        //this.initDeps();
                        this.addDep2Deps(this.deps,resp.obj);
                        this.dialogVisible=false;
                        this.initDep();//初始化添加弹窗变量

                    }
                })

            },
            showAddDepView(data){
                console.log(data);
                this.pname=data.name;
                this.dep.parentId=data.id;
                this.dialogVisible=true;
            },
            deleteDep(data){
                console.log(data);
                if(data.parent){
                    this.$message.error("父部门删除失败");
                }else{
                    this.$confirm('此操作将永久删除【'+data.name+'】部门, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("system/basic/department/"+data.id).then(resp=>{
                            if(resp){
                                //删除成功，动态的从数组里面移除一项
                                this.removeDepFromDeps(this.deps,data.id);
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }

            },
            removeDepFromDeps(deps,id){
                for(let i=0;i<deps.length;i++){
                    let d=deps[i];
                    if(d.id==id){
                        deps.splice(i,1);
                        return;
                    }else{
                        this.removeDepFromDeps(d.children,id);
                    }
                }
            },
            initDeps(){
              this.getRequest("/system/basic/department/").then(resp=> {
                  if (resp) {
                        this.deps=resp;
                  }
              })
            },
            filterNode(value, data) {//value为filterText的最新值，data为json数组的每一项
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            }
        }
    }
</script>

<style >
    .depBtn{
        padding:2px;
    }
</style>