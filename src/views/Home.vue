<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">
                    微人事
                </div>
                <el-dropdown class="userInfo" @command="commandHandler">
                      <span class="el-dropdown-link">
                          {{user.name}}<i ><img :src="user.userface"> </i><!--v-module的简写：-->
                      </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <!--<el-menu @select="menuClick">-->
                    <el-menu router unique-opened>
                            <!--default-active="2"-->
                            <!--class="el-menu-vertical-demo"-->
                           <!-- @open="handleOpen"
                            @close="handleClose">-->
                        <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden" :key="index"><!--this.$router.options.routes获得的是rounter数组-->
                            <template slot="title">
                                <i style="color:#409eff; margin-right:5px" :class="item.iconCls"></i>
                                <span>{{item.name}}</span>
                            </template>

                                <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">{{child.name}}</el-menu-item>
                        </el-submenu>

                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
                        欢迎来到微人事！
                    </div>
                    <router-view class="homeRouterView"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data(){
            return{
                user:JSON.parse(window.sessionStorage.getItem("user"))//获取user,并转成json对象
            }
         },
        computed:{
            routes(){
                return this.$store.state.routes;
            }
        },
        methods:{
           /* menuClick(index,indexPath){
               /!* console.log(index);
                console.log(indexPath);*!/
               this.$router.push(index);
            },*/
            commandHandler(cmd){

                if(cmd=='logout'){
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                       //注销
                        this.getRequest("/logout");//以前我们自定义的方法
                        window.sessionStorage.removeItem("user");
                        this.$router.replace("/");//回到登录页面
                        this.$store.commit('initRoutes', []);//清空存储的菜单数据
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }
            }
        }
    }
</script>

<style >
    .homeRouterView{
        margin-top: 10px;
    }
    .homeWelcome{
        text-align: center;
        font-size: 30px;
        font-family: 华文行楷;
        color: #409eff;
        padding-top: 50px;
    }
    .homeHeader{
        background-color: cornflowerblue;
        display: flex;
        align-items: center;/*垂直方向居中*/
        justify-content: space-between;/*设置主轴上的对齐方式，为两端对齐，项目之间的间隔都相等*/
        padding: 0px 15px;/*上下0px,左右15px*/
        box-sizing: border-box;
    }
    .title{
        font-size: 30px;
        font-family: 华文行楷;
        color: #ffffff;

    }
    .homeHeader.userInfo{
        cursor: pointer ;

    }
    .el-dropdown-link img{
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 8px;
    }
    .el-dropdown-link{
        display: flex;
        align-items: center;
    }

</style>