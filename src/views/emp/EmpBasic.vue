<template>
    <div>
        <div ><!--工具栏-->
            <div style="display: flex;justify-content: space-between"><!--工具栏-->
                <div>
                <el-input placeholder="通过员工名搜索员工..." prefix-icon="el-icon-search"
                          clearable
                          @clear="initEmps"
                          style="width: 300px;margin-right: 10px" v-model="keyword" @keydown.enter.native="initEmps" :disabled="showAdvanceSearchView"></el-input>
                <el-button icon="el-icon-search" type="primary" @click="initEmps" :disabled="showAdvanceSearchView"> 搜索</el-button>
                <el-button  type="primary" @click="showAdvanceSearchView=!showAdvanceSearchView">
                    <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'" aria-hidden="true"/>
                    高级搜索</el-button>
            </div>
                <div >
                    <el-upload
                            :on-error="onError"
                            :on-success="onSuccess"
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :disabled="importDataDisabled"
                            style="display: inline-flex;margin-right: 8px"
                            class="upload-demo"
                            action="/employee/basic/import">
                        <el-button :disabled="importDataDisabled" type="success" :icon="importDataBtnIcon">
                            <!-- <i class="fa fa-level-up" aria-hidden="true" icon="el-icon-download"/>-->
                            {{importDataBtnText}}<!--导入数据-->
                        </el-button>
                    </el-upload>

                    <el-button
                            @click="exportData" type="success">
                        <i class="fa fa-level-down" aria-hidden="true"/>
                        导出数据
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">
                        添加用户
                    </el-button>
                </div>
            </div>
            <transition name="slide-fade">
            <div v-show="showAdvanceSearchView" style="border :1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px ;margin: 10px 0px;"><!--高级搜索-->
                <el-row>
                    <el-col :span="5">
                        政治面貌:
                            <el-select v-model="emp.politicId" placeholder="请选择" size="mini" style="width: 200px;">
                                <el-option
                                        v-for="item in politicsstatus"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                    </el-col>
                    <el-col :span="4">
                        民族：
                        <el-select v-model="emp.nationId" placeholder="民族" size="mini" style="width: 150px;">
                            <el-option
                                    v-for="item in nations"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        职位：
                        <el-select v-model="emp.posId" placeholder="职位" size="mini" style="width: 150px;">
                            <el-option
                                    v-for="item in positions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        职称：
                        <el-select v-model="emp.jobLevelId" placeholder="职称" size="mini" style="width: 150px;">
                            <el-option
                                    v-for="item in joblevels"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="7">
                        聘用形式：
                            <el-radio-group v-model="emp.engageForm">
                                <el-radio label="劳动合同">劳动合同</el-radio>
                                <el-radio label="劳务合同">劳务合同</el-radio>
                            </el-radio-group>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 10px;">
                    <el-col :span="5">
                        所属部门：
                        <el-popover
                                placement="right"
                                title="请选择部门"
                                width="200"
                                trigger="manual"
                                v-model="popVisible">
                            <div>
                                <!--部门树-->
                                <el-tree default-expand-all :data="allDeps" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                            </div>
                            <div slot="reference" style="width: 180px;display: inline-flex;font-size: 13px;margin-left: 3px;
                                    border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box;"  @click="showDepViews">
                               所属部门
                            </div>
                        </el-popover>
                    </el-col>
                    <el-col :span="10">
                        入职日期：
                        <el-date-picker
                                v-model="value1"
                                type="daterange"
                                size="mini"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="5" :offset="4">
                        <el-button size="mini">取消</el-button>
                        <el-button size="mini" icon="el-icon-search" type="primary">搜索</el-button>
                    </el-col>
                </el-row>
            </div>
            </transition>
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
                        prop="gender"
                        label="性别"
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
                        prop="wedlock"
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
                        prop="tiptopDegree"
                        label="最高学历">
                </el-table-column>
                <el-table-column
                        prop="specialty"
                        label="专业">
                </el-table-column>
                <el-table-column
                        prop="school"
                        label="毕业院校">
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
                        <el-button @click="showEditEmpView(scope.row)" style="padding:3px;" size="mini"> 编辑</el-button>
                        <el-button style="padding:3px;" size="mini" type="primary"> 查看高级资料</el-button>
                        <el-button @click="deleteEmp(scope.row)" style="padding:3px;" size="mini" type="danger"> 删除</el-button>
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
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="80%">

            <div>
                <el-form :model="emp" :rules="rules" ref="empForm">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="姓名:" prop="name">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="emp.name"
                                          placeholder="请输入员工姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="性别:" prop="gender">
                                <el-radio-group v-model="emp.gender">
                                    <el-radio label="男">男</el-radio>
                                    <el-radio label="女">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="出生日期:" prop="birthday">
                                <el-date-picker
                                        v-model="emp.birthday"
                                        type="date"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        style="width: 150px;"
                                        placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="政治面貌:" prop="politicId">
                                <el-select v-model="emp.politicId" placeholder="请选择" size="mini" style="width: 200px;">
                                    <el-option
                                            v-for="item in politicsstatus"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="民族:" prop="nationId">
                                <el-select v-model="emp.nationId" placeholder="民族" size="mini" style="width: 150px;">
                                    <el-option
                                            v-for="item in nations"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="籍贯:" prop="nativePlace">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                          v-model="emp.nativePlace" placeholder="请输入籍贯"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="电子邮箱"  prop="email">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-email"
                                          v-model="emp.email" placeholder="请输入电子邮箱"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="联系地址" prop="address">
                                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                          v-model="emp.address" placeholder="请输入联系地址"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="职位:" prop="position">
                                <el-select v-model="emp.posId" placeholder="职位" size="mini" style="width: 150px;">
                                    <el-option
                                            v-for="item in positions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="职称:" prop="jobLevelId">
                                <el-select v-model="emp.jobLevelId" placeholder="职称" size="mini" style="width: 150px;">
                                    <el-option
                                            v-for="item in joblevels"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属部门"  prop="departmentId">
                               <!-- <el-input size="mini" style="width: 150px" prefix-icon="el-icon-message"
                                          v-model="emp.departmentId" placeholder="所属部门">
                                </el-input>-->
                                <el-popover
                                        placement="right"
                                        title="请选择部门"
                                        width="200"
                                        trigger="manual"
                                        v-model="popVisible">
                                    <div>
                                        <!--部门树-->
                                        <el-tree default-expand-all :data="allDeps" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                                    </div>
                                    <div slot="reference" style="width: 150px;display: inline-flex;font-size: 13px;
                                    border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box" @click="showDepViews">
                                        {{inputDepName}}
                                    </div>
                                </el-popover>

                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="电话号码" prop="phone">
                                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-phone"
                                          v-model="emp.address" placeholder="电话号码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="工号" prop="wordID">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-phone"
                                          v-model="emp.workID" placeholder="工号" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="学历:" prop="tiptopDegree">
                                <el-select v-model="emp.tiptopDegree" placeholder="学历" size="mini" style="width: 150px;">
                                    <el-option
                                            v-for="item in tiptopDegrees"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="毕业院校" prop="school">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                          v-model="emp.school" placeholder="毕业院校">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="专业名称" prop="specialty">
                                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                          v-model="emp.specialty" placeholder="请输入专业名称">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="入职日期:" prop="beginDate">
                                <el-date-picker
                                        v-model="emp.beginDate"
                                        type="date"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        style="width: 130px;"
                                        placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="转正日期:" prop="birthday">
                                <el-date-picker
                                        v-model="emp.conversionTime"
                                        type="date"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        style="width: 130px;"
                                        placeholder="转正日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="合同起始日期:" prop="birthday">
                                <el-date-picker
                                        v-model="emp.beginContract"
                                        type="date"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        style="width: 130px;"
                                        placeholder="合同起始日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="合同终止日期:" prop="endContract">
                                <el-date-picker
                                        v-model="emp.endContract"
                                        type="date"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        style="width: 130px;"
                                        placeholder="合同终止日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="身份证号码" prop="idCard">
                                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                          v-model="emp.idCard" placeholder="身份证号码">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="聘用形式:" prop="engageForm">
                                <el-radio-group v-model="emp.engageForm">
                                    <el-radio label="劳动合同">劳动合同</el-radio>
                                    <el-radio label="劳务合同">劳务合同</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="婚姻状况:" prop="wedlock">
                                <el-radio-group v-model="emp.wedlock">
                                    <el-radio label="已婚">已婚</el-radio>
                                    <el-radio label="未婚">未婚</el-radio>
                                    <el-radio label="离异">离异</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doAddEmp" >确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>

<script>
    import {deleteRequest} from "../../utils/api";

    export default {
        name: "EmpBasic",
        data(){
            return{
                showAdvanceSearchView:false,
                importDataDisabled:false,
                importDataBtnText:'导入数据',
                importDataBtnIcon:'el-icon-upload2',
                title:'添加员工',
                rules:{
                    name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
                    birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
                    idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}, {
                        pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                        message: '身份证号码格式不正确',
                        trigger: 'blur'
                    }],
                    wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
                    nationId: [{required: true, message: '请输入您组', trigger: 'blur'}],
                    nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
                    politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
                    email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}, {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur'
                    }],
                    phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
                    address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
                    departmentId: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
                    jobLevelId: [{required: true, message: '请输入职称', trigger: 'blur'}],
                    posId: [{required: true, message: '请输入职位', trigger: 'blur'}],
                    engageForm: [{required: true, message: '请输入聘用形式', trigger: 'blur'}],
                    tiptopDegree: [{required: true, message: '请输入学历', trigger: 'blur'}],
                    specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
                    school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
                    beginDate: [{required: true, message: '请输入入职日期', trigger: 'blur'}],
                    workState: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
                    workID: [{required: true, message: '请输入工号', trigger: 'blur'}],
                    contractTerm: [{required: true, message: '请输入合同期限', trigger: 'blur'}],
                    conversionTime: [{required: true, message: '请输入转正日期', trigger: 'blur'}],
                    notworkDate: [{required: true, message: '请输入离职日期', trigger: 'blur'}],
                    beginContract: [{required: true, message: '请输入合同起始日期', trigger: 'blur'}],
                    endContract: [{required: true, message: '请输入合同结束日期', trigger: 'blur'}],
                    workAge: [{required: true, message: '请输入工龄', trigger: 'blur'}],
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                allDeps:[],
                popVisible:false,
                tiptopDegrees:['本科','大专','硕士','博士','高中','初中','小学','其他'],
                dialogVisible:false,
                emps:[],
                nations:[],
                joblevels:[],
                politicsstatus:[],
                positions:[],
                total:0,
                page:1,
                size:10,
                keyword:'',
                inputDepName:'',
                emp: {
                    name: "张依方",
                    gender: "男",
                    birthday: "1990-01-01",
                    idCard: "610122199001011256",
                    wedlock: "已婚",
                    nationId: 1,
                    nativePlace: "陕西",
                    politicId: 13,
                    email: "laowang@qq.com",
                    phone: "18565558897",
                    address: "深圳市南山区",
                    departmentId: 5,
                    jobLevelId: 9,
                    posId: 29,
                    engageForm: "劳务合同",
                    tiptopDegree: "本科",
                    specialty: "信息管理与信息系统",
                    school: "深圳大学",
                    beginDate: "2018-01-01",
                    workState: "在职",
                    workID: "00000001",
                    contractTerm: 2.0,
                    conversionTime: "2018-04-01",
                    notWorkDate: null,
                    beginContract: "2018-01-01",
                    endContract: "2020-01-01",
                    workAge: null
                }
            }
        },mounted() {
            this.initEmps();
            this.initData();
            this.initPositions();
        },
        methods:{
            onError(response,file,fileList){
                this.importDataBtnText='导入数据';
                this.importDataBtnIcon='el-icon-upload2';
                this.importDataDisabled=false;
            },
            onSuccess(response,file,fileList){
                this.importDataBtnText='导入数据';
                this.importDataBtnIcon='el-icon-upload2';
                this.importDataDisabled=false;
                this.initEmps();
            },
            beforeUpload(){//上传之前事件
                this.importDataBtnText='正在导入';
                this.importDataBtnIcon='el-icon-loading';
                this.importDataDisabled=true;
            },
            exportData(){
                window.open('/employee/basic/export','_parent');
            },
            emptyEmp(){
                this.emp={
                    name: "",
                        gender: "",
                        birthday: "",
                        idCard: "",
                        wedlock: "",
                        nationId: 1,
                        nativePlace: "",
                        politicId: 13,
                        email: "",
                        phone: "",
                        address: "",
                        departmentId: 5,
                        jobLevelId: 9,
                        posId: 29,
                        engageForm: "",
                        tiptopDegree: "",
                        specialty: "",
                        school: "",
                        beginDate: "",
                       // workState: "",
                        workID: "",
                        contractTerm: 2.0,
                        conversionTime: "",
                        notWorkDate: null,
                        beginContract: "",
                        endContract: "",
                        workAge: null
                }
                this.inputDepName='';
            },
            showEditEmpView(data){
                this.initPositions();
                this.title='编辑员工信息';
                this.emp=data;
                this.inputDepName=data.department.name;
                this.dialogVisible=true;
            },
            deleteEmp(data){
                this.$confirm('此操作将永久删除['+data.name+'], 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   this.deleteRequest("/employee/basic/"+data.id).then(resp=>{
                       if(resp){
                           this.initEmps();
                       }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doAddEmp(){
                //判断是添加还是更新，有id则为更新，没有id则为更新
                if(this.emp.id){//更新
                    this.$refs.empForm.validate(valid=>{
                        if(valid){//数据验证成功
                            this.putRequest("/employee/basic/",this.emp).then(resp=>{
                                if(resp){
                                    this.dialogVisible=false;
                                    this.initEmps();//刷新页面
                                }
                            })
                        }
                    })
                }else{//添加
                    this.$refs.empForm.validate(valid=>{
                        if(valid){//数据验证成功
                            this.postRequest("/employee/basic/",this.emp).then(resp=>{
                                if(resp){
                                    this.dialogVisible=false;
                                    this.initEmps();//刷新页面
                                }
                            })
                        }
                    })
                }

            },
            handleNodeClick(data){//点击部门树时触发该方法
                this.inputDepName=data.name;

                this.emp.departmentId=data.id;
                this.popVisible=!this.popVisible;
            },
            showDepViews(){
                this.popVisible=!this.popVisible;
            },
            getMaxWordID(){
                this.getRequest('/employee/basic/maxWorkID').then(resp => {
                    if (resp) {
                        this.emp.workID = resp.obj;

                    }
                })
            },
            initPositions(){
                this.getRequest('/employee/basic/positions').then(resp => {
                    if (resp) {
                        this.positions = resp;

                    }
                })
            },
            initData(){
                if(!window.sessionStorage.getItem("nations")){
                    this.getRequest('/employee/basic/nation').then(resp => {
                        if (resp) {
                            this.nations = resp;
                            window.sessionStorage.setItem("nations", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.nations=JSON.parse(window.sessionStorage.getItem("nations"));
                }
                if(!window.sessionStorage.getItem("joblevel")){
                    this.getRequest('/employee/basic/joblevel').then(resp => {
                        if (resp) {
                            this.joblevels = resp;
                            window.sessionStorage.setItem("joblevel", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.joblevels=JSON.parse(window.sessionStorage.getItem("joblevel"));
                }
                if(!window.sessionStorage.getItem("politicsstatus")){
                    this.getRequest('/employee/basic/politicsstatus').then(resp => {
                        if (resp) {
                            this.politicsstatus = resp;
                            window.sessionStorage.setItem("politicsstatus", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.politicsstatus=JSON.parse(window.sessionStorage.getItem("politicsstatus"));
                }
                if(!window.sessionStorage.getItem("deps")){
                    this.getRequest('/employee/basic/deps').then(resp => {
                        if (resp) {
                            this.allDeps = resp;
                            window.sessionStorage.setItem("deps", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.allDeps=JSON.parse(window.sessionStorage.getItem("deps"));
                }
            },
            showAddEmpView(){
                this.emptyEmp();//清空
                this.title='添加员工';
                this.dialogVisible=true;

                this.getMaxWordID();
            },
            sizeChange(currentSize){
                this.size=currentSize;
                this.initEmps();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initEmps();
            },
            initEmps(){
                this.getRequest("/employee/basic/?page="+this.page+"&size="+this.size+"&keyword="+this.keyword).then(resp=>{
                    if(resp){
                        this.emps=resp.data;
                        this.total=resp.total;
                    }
                })
            }
        }
    }
</script>

<style >
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .8s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }
</style>