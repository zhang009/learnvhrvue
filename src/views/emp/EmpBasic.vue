<template>
    <div>
        <div style="display: flex;justify-content: space-between"><!--工具栏-->
            <div>
                <el-input placeholder="通过员工名搜索员工..." prefix-icon="el-icon-search" style="width: 300px;margin-right: 10px"></el-input>
                <el-button icon="el-icon-search" type="primary"> 搜索</el-button>
                <el-button  type="primary">
                    <i class="fa fa-angle-double-down" aria-hidden="true"/>
                    高级搜索</el-button>
            </div>
            <div >
                <el-button type="success">
                    <i class="fa fa-level-up" aria-hidden="true"/>
                    导入数据</el-button>
                <el-button type="success">
                    <i class="fa fa-level-down" aria-hidden="true"/>
                    导出数据</el-button>
                <el-button type="primary" icon="el-icon-plus">

                    添加用户</el-button>
            </div>
        </div>
        <div style="margin-top: 10px"><!--表格内容-->
            <el-table
                    :data="emps"
                    stripe
                    border
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        fixed
                        align="left"
                        width="90"><!--fixed表示冻结-->
                </el-table-column>
                <el-table-column
                        prop="workID"
                        label="工号"
                        align="left">
                </el-table-column>
                <el-table-column
                        prop="birthday"
                        align="left"
                        width="95"
                        label="出生日期">
                </el-table-column>
                <el-table-column
                        prop="idCard"
                        label="身份证号码">
                </el-table-column>
                <el-table-column
                        prop="weblock"
                        width="70"
                        label="婚姻状况">
                </el-table-column>
                <el-table-column
                        prop="nation.name"
                        label="民族">
                </el-table-column>
                <el-table-column
                        prop="nativePlace"
                        width="80"
                        label="籍贯">
                </el-table-column>
                <el-table-column
                        prop="politicsstatus.name"
                        label="政治面貌">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="电子邮件">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="电话号码">
                </el-table-column>

                <el-table-column
                        prop="address"
                        width="220"
                        label="联系地址">
                </el-table-column>
                <el-table-column
                        prop="department.name"
                        label="所属部门">
                </el-table-column>
                <el-table-column
                        prop="position.name"
                        label="职位">
                </el-table-column>
                <el-table-column
                        prop="jobLevel.name"
                        label="职称">
                </el-table-column>
                <el-table-column
                        prop="engageForm"
                        label="聘用形式">
                </el-table-column>
                <el-table-column
                        prop="beginDate"
                        width="95"
                        label="入职日期">
                </el-table-column>
                <el-table-column
                        prop="conversionTime"
                        width="95"
                        label="转正日期">
                </el-table-column>
                <el-table-column
                        prop="beginContract"
                        width="95"
                        label="合同起始日期">
                </el-table-column>
                <el-table-column
                        prop="endContract"
                        width="95"
                        label="合同终止日期">
                </el-table-column>
                <el-table-column
                        prop="contractTerm"
                        label="合同期限">
                </el-table-column>
                <el-table-column
                        prop="tiptopDegree"
                        label="最高学历">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        width="200px"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button style="padding:3px;" size="mini"> 编辑</el-button>
                        <el-button style="padding:3px;" size="mini" type="primary"> 查看高级资料</el-button>
                        <el-button style="padding:3px;" size="mini" type="danger"> 删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-end">
                <el-pagination
                        background
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        layout="sizes, prev, pager, next, jumper, ->, total, slot"
                        :total="total">
                </el-pagination>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "EmpBasic",
        data(){
            return{
                emps:[],
                total:0,
                page:1,
                size:10
            }
        },mounted() {
            this.initEmps();
        },
        methods:{
            sizeChange(currentSize){
                this.size=currentSize;
                this.initEmps();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initEmps();
            },
            initEmps(){
                this.getRequest("/emp/basic/?page="+this.page+"&size="+this.size).then(resp=>{
                    if(resp){
                        this.emps=resp.data;
                        this.total=resp.total;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>