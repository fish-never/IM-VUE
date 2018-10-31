<template>
  <div class="height100">
    <div class="content-box">
      <div class="title clearfloat">
        <ul class="tab-list pull-left">
          <li :class="{'active':tabStatus === 1}" @click="changeTab(1)">客服管理</li>
          <li :class="{'active':tabStatus === 2}" @click="changeTab(2)">条件自动回复管理</li>
          <li :class="{'active':tabStatus === 3}" @click="changeTab(3)">全局自动回复管理</li>
        </ul>
        <div class="pull-right">
          <el-select class="float_r" size="mini" v-model="product_id" @change="changeTab(tabStatus)"
                     clearable filterable placeholder="请选择产品">
            <el-option
                    v-for="(item,prdIdx) in prdList"
                    :key="prdIdx"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="setting_box" v-show="tabStatus===1">
        <ul class="content-list">
          <li class="item position-r" v-for="(item,userIdx) in userList" :key="userIdx">
            <div class="li_img position-a">
              <img class="" v-if="!item.avatar" src="../assets/imgs/bg.png"/>
              <img class="" v-if="item.avatar" :src="item.avatar"/>
            </div>
            <div class="div_info">
              <div class="overflow-h">
                <span class="float_l fontweight_b color333 margin_r10">{{item.name}}</span>
                <span class="float_l color999 margin_r10">{{item.nickname}}</span>
              </div>
              <p class="color666">
                <el-tag class="margin_r10" type="info" size="mini">{{item.root==1?'管理员':'客服'}}</el-tag>
                绑定产品：<span v-for="(item,idx) in (item.product_list || [])" :key="idx"><span
                      v-if="idx != 0">,</span>{{item.name}}</span>
              </p>
            </div>
            <div class="position-a li-btn">
              <el-button type="text" size="mini" @click="editAccount(item)">修改</el-button>
              <el-button type="text" size="mini" @click="changeAccountStatus(item)">{{item.disable==1?'启用':'禁用'}}
              </el-button>
              <el-button type="text" size="mini" @click="deleteAccount(item.id)">删除</el-button>
            </div>
          </li>
        </ul>
        <div class="text-center text-gary" v-if="userList.length == 0">
          <br><br><br>
          暂无数据
          <br><br><br>
        </div>
        <el-pagination
                small
                layout="prev, pager, next"
                :total="userTotal*1" v-if="userList.length>0"
                :current-page.sync="userPage"
                @current-change="userPageChange">
        </el-pagination>

        <button class="btn btn-primary pull-right" @click="addAccount">添加账号</button>
        <div class="clearfloat"></div>

        <el-dialog
                :title="(isEditAccount?'编辑':'添加') + '账号'"
                :visible.sync="editAccountDialog"
                width="500px">
          <el-form ref="accountForm" :model="accountForm" label-width="80px">
            <el-form-item label="账号" prop="name"
                          :rules="[
                            { required: true, message: '请输入账号', trigger: 'blur',
                             validator:(rule, value, callback) => {
                                if (value && value.trim() != '') {
                                  callback();
                                }else{
                                  callback('请输入账号');
                                }
                             }},
                          ]">
              <el-col :span="20">
                <el-input v-model="accountForm.name" :disabled="isEditAccount"
                          placeholder="请输入账号"
                          size="small"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname"
                          :rules="[
                            { required: true, message: '请输入昵称', trigger: 'blur' ,
                            validator:(rule, value, callback) => {
                                if (value && value.trim() != '') {
                                  callback();
                                }else{
                                  callback('请输入账号');
                                }
                             }},
                          ]">
              <el-col :span="20">
                <el-input v-model="accountForm.nickname" size="small" placeholder="请输入昵称"></el-input>
              </el-col>
            </el-form-item>
                        <el-form-item label="open_id" prop="open_id">
              <el-col :span="20">
                <el-input v-model="accountForm.open_id" size="small" placeholder="请输入open_id"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="密码" prop="password"
                          :rules="[
                            { required: !isEditAccount, message: '请输入昵称'},
                          ]">
              <el-col :span="20">
                <el-input v-model="accountForm.password"
                          type="password"
                          :placeholder="isEditAccount?'不修改密码请留空':'请输入密码'"
                          size="small"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="类别">
              <el-radio-group v-model="accountForm.root">
                <el-radio :label="1">管理员</el-radio>
                <el-radio :label="0">客服</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="产品" v-if="accountForm.root == 1">
              <el-checkbox-group v-model="accountForm.type_id">
                <el-checkbox v-for="(item,idx) in prdList"
                             :key="idx"
                             :label="item.id">{{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="产品" v-if="accountForm.root != 1">
              <el-radio-group v-model="accountForm.type_id[0]">
                <el-radio v-for="(item,idx) in prdList"
                             :key="idx"
                             :label="item.id" name="type_id">{{item.name}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editAccountDialog = false">取 消</el-button>
            <el-button type="primary" @click="saveAccount">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="setting_box" v-show="tabStatus===2">
        <ul class="content-list">
          <li class="item position-r" v-for="(item,idx) in getIfList" :key="idx">
            <div class="li_img position-a">
              <img v-if="!item.icon" class="" src="../assets/imgs/bg.png"/>
              <img v-if="item.icon" class="" :src="item.icon"/>
            </div>
            <div class="div_info">
              <p class="color333"><span class="color999">条件:</span>{{item.conditions}}</p>
              <p class="color333"><span class="color999">回复:</span>{{item.answer}}</p>
            </div>
            <div class="position-a li-btn">
              <el-button type="text" size="mini" @click="clickUpdate(item)">修改</el-button>
              <el-button type="text" size="mini" @click="clickDelete(item)">删除</el-button>
            </div>
          </li>
        </ul>
        <div class="text-center text-gary" v-if="getIfList.length == 0">
          <br><br><br>
          暂无数据
          <br><br><br>
        </div>
        <el-pagination
                small
                layout="prev, pager, next"
                :total="localTotal*1" v-if="getIfList.length>0"
                :current-page.sync="localPage"
                @current-change="replayLocalChange">
        </el-pagination>
        <div class="overflow-h">
          <el-button class="pull-right" type="primary" @click="open4">添加条件回复</el-button>
        </div>

      </div>
      <div class="setting_box" v-show="tabStatus===3">
        <ul class="content-list">
          <li class="item position-r" v-for="(item,idx) in globalReplay" :key="idx">
            <div class="li_img position-a">
              <img v-if="!item.icon" class="" src="../assets/imgs/bg.png"/>
              <img v-if="item.icon" class="" :src="item.icon"/>
            </div>
            <div class="div_info">
              <p class="color333">全局自动回复</p>
              <p class="color333"><span class="color999">回复:</span>{{item.answer}}</p>
            </div>
            <div class="position-a li-btn">
              <el-button type="text" size="mini" @click="globalEdit(item)">修改</el-button>
              <el-button type="text" size="mini" @click="globalDelete(item)">删除</el-button>
            </div>
          </li>
        </ul>
        <div class="text-center text-gary" v-if="globalReplay.length == 0">
          <br><br><br>
          暂无数据
          <br><br><br>
        </div>
        <el-pagination
                small
                layout="prev, pager, next"
                :total="globalTotal*1" v-if="globalReplay.length>0 && globalTotal*1>10"
                :current-page.sync="globalPage"
                @current-change="replayGlobalChange">
        </el-pagination>
        <div class="overflow-h">
          <el-button class="pull-right" type="primary"
                     @click="addReplyGlobal">添加全局回复
          </el-button>
        </div>
      </div>
      <el-dialog
              :title="(isEditReplay?'编辑':'添加') + '全局回复'"
              :visible.sync="replayManageDialog"
              width="500px">
        <el-form ref="replayManageForm" :model="replayManageForm" label-width="80px">
          <el-form-item label="选择产品" prop="product_id"
                        :rules="[
                          { required: true, message: '请选择产品'},
                        ]">
            <el-col :span="14">
              <el-select v-model="replayManageForm.product_id" size="small"
                         :disabled="isEditReplay"
                         placeholder="选择产品">
                <el-option
                        v-for="(item,idx) in prdList"
                        :key="idx"
                        :label="item.name"
                        :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="10" v-if="globalReplayId.indexOf(replayManageForm.product_id)>-1 && !isEditReplay">
              <p style="color: #f00;">该产品已有全局自动回复</p>
            </el-col>
          </el-form-item>
          <el-form-item label="回复类别">
            <el-radio-group v-model="replayManageForm.type" @change="globalTypeChange">
              <el-radio label="0">文本</el-radio>
              <el-radio label="1">图片</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="回复内容" prop="answer" v-if="replayManageForm.type == 0"
                        :rules="[
                          { required: true, message: '请输入回复内容'},
                        ]">
            <el-col :span="20">
              <el-input type="textarea" v-model="replayManageForm.answer"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="回复内容" prop="answer" v-if="replayManageForm.type == 1"
                        :rules="[
                          { required: true, message: '请选择文件'},
                        ]">
            <el-col :span="20">
              <input type="file" accept="image/*" @change="globalUploadFile">
              <p v-if="isGlobalUpload" style="color: #999;">图片上传中...</p>
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="replayManageDialog = false">取 消</el-button>
          <el-button type="primary" @click="replayManageSave"
                     :disabled="(globalReplayId.indexOf(replayManageForm.product_id)>-1 && !isEditReplay) || isGlobalAdd || isGlobalUpload"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div v-show="ifBox" tabindex="-1" role="dialog" class="el-message-box__wrapper" style="z-index: 2003;">
      <div class="el-message-box">
        <div class="el-message-box__header">
          <div class="el-message-box__title"><!---->
            <span>{{btnType==1?'修改':'添加'}}条件回复</span>
          </div>
          <button type="button" aria-label="Close" class="el-message-box__headerbtn" @click="closeBox">
            <i class="el-message-box__close el-icon-close"></i>
          </button>
        </div>
        <div class="el-message-box__content" data-id="from.id"><!---->
          <el-form ref="from" :model="from" label-width="95px"
                   class="el-message-box__message">
            <el-form-item label="选择产品：" prop="product_id"
                          :rules="[
                            { required: true, message: '请选择产品'},
                          ]">
              <el-select class="float_l margin-r10" size="small"
                         :disabled="btnType == 1"
                         v-model="from.product_id" clearable filterable
                         placeholder="请选择产品">
                <el-option
                        v-for="(item,idx) in prdList"
                        :key="idx"
                        :label="item.name"
                        :value="item.id+''">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户消息：">
              <div class="news_div overflow-h margin_b10" v-for="(item,index) in conditions" :key="index">
                <el-input class="float_l width200 margin-r10" maxlength="" size="small" v-model="item.value"
                          placeholder="请输入内容"></el-input>

                <i class="fontsize20 el-icon-circle-close-outline margin-r10 float_r lingheight32"
                   @click="deleteArraw(index)"></i>
              </div>
              <i class="fontsize20 el-icon-circle-plus-outline position-a lingheight32 position_icon"
                 @click="addArraw"></i>
            </el-form-item>
            <el-form-item label="回复类别：">
              <el-radio-group v-model="from.type" @change="localTypeChange">
                <el-radio label="0">文本</el-radio>
                <el-radio label="1">图片</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="回复内容：" v-if="from.type == 0" prop="answer"
                          :rules="[
                            { required: true, message: '请输入回复内容'},
                          ]">
              <el-input type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="from.answer">
              </el-input>
            </el-form-item>
            <el-form-item label="回复内容：" v-if="from.type == 1" prop="answer"
                          :rules="[
                            { required: true, message: '请选择文件'},
                          ]">
              <el-col :span="20">
                <input type="file" accept="image/*" @change="localUploadFile"/>
                <p v-if="isLocalUpload" style="color: #999;">图片上传中...</p>
              </el-col>
            </el-form-item>
          </el-form>

        </div>
        <div class="el-message-box__btns">
          <button type="button" class="el-button el-button--default el-button--small" @click="closeBox"><!---->
            <!----><span>
          取消
        </span></button>
          <el-button type="primary" size="small"
                  :disabled="isLocalAdd || isLocalUpload"
                  @click="commit(btnType)"><!----><!----><span>
          确定
        </span></el-button>
        </div>
      </div>
    </div>
    <div class="v-modal" v-show="cover===true" tabindex="0" style="z-index: 2000;"></div>
  </div>
</template>


<script>
  import api from '../utils/axios'
  import axios from 'axios'
  import commentService from "../service/comment";
  var validateStr = (rule, value, callback) => {
    if (value.trim() != '') {
      callback();
    }
  };

  export default {
    name: 'index',
    data() {
      return {
        userTotal: 0,
        userList: [],
        userPage: 1,

        pageShow: false,//不显示分页
        localTotal: '',
        localPage: 1,
        globalPage: 1,
        globalReplay: [],
        globalReplayAll: [],
        globalReplayId: [],
        globalTotal: 0,
        isGlobalAdd: false,
        isLocalAdd: false,
        isGlobalUpload: false,
        isLocalUpload: false,
        pageSize: 10,
        ifBox: false,//条件回复框显示true,隐藏false
        cover: false,
        radio: '1',//回复内容文本为1，图片为2
        tabStatus: 1,   // 当前tab
        ifinput: [{'value': ''}],
        product_id: '',
        prdList: [],

        textarea: '',
        content: '',
        getIfList: [],//条件回复列表
        from: {
          id: '',
          product_id: '',
          answer: '',
          type: '0',
          is_global: 0
        },
        conditions: [{value: ''}],
        btnType: 1,//1为修改，2为创建
        editAccountDialog: false,
        isEditAccount: false,
        accountForm: {
          root: 0,
          type_id: [],
        },

        // 全局自动回复管理 dialog
        replayManageDialog: false,
        isEditReplay: false,
        replayManageForm: {
          type: '0',
          answer: '',
        },
        totalUnreadNum:0, // 未读信息总数
      }
    },
    created() {
      let self = this
      commentService.getPro().then((res) => {
        self.prdList = res.data
      })
      let unreadNum = parseInt(localStorage.getItem('totalUnreadNum'))
      if(isNaN(unreadNum)){
        this.totalUnreadNum = 0
      }else{
        this.totalUnreadNum = unreadNum
      }
      self.getCustomerList()
      self.getIfListLocal()
      self.getIfListGlobal()
    },
    mounted() {
    },
    watch:{
      totalUnreadNum(){
        this.$emit("msgTotal", this.totalUnreadNum)
      }
    },
    methods: {
      getCustomerList() {
        let self = this;
        commentService.getCustomerList({
          product_id: self.product_id,
          page: this.userPage,
          page_size: 10,
        }).then(data => {
          if (data.code == 0) {
            self.userList = data.data
            self.userTotal = data.total
          }
        });
      },
      userPageChange(page) {
        let self = this
        self.userPage = page
        self.getCustomerList()
      },
      // 条件自动回复
      getIfListLocal() {
        const params = {
          page: this.localPage,
          page_size: this.pageSize,
          product_id: this.product_id,
          is_global: 0
        };
        //const loadingInstance = this.$loading({ fullscreen: true });
        commentService.getIfList(params).then(data => {
          if (data.code == 0) {
            const rdata = data.data;
            this.localTotal = data.total || [];
            if (this.total > 5) {
              this.pageShow = true;
            }
            console.log("here")
            this.getIfList = rdata;
            //this.inputTagsChange()

          }
        });
      },
      replayLocalChange(page) {
        let self = this
        this.localPage = page
        self.getIfListLocal()
      },
      // 全局自动回复
      getIfListGlobal() {
        const params = {
          page: this.globalPage,
          page_size: 999,
          product_id: this.product_id,
          is_global: 1
        };
        //const loadingInstance = this.$loading({ fullscreen: true });
        commentService.getIfList(params).then(data => {
          if (data.code == 0) {
            this.globalReplay = data.data || [];
            if(!this.product_id){
              this.globalReplayAll = [...data.data]
            }
            if(this.globalReplayAll.length>0){
              this.globalReplayId = this.globalReplayAll.map((item)=>{
                return item.product_id
              })
            }
            this.globalTotal = data.total;
          }
        });
      },
      //条件回复修改
      clickUpdate(item) {
        const vm = this
        vm.cover = true
        vm.ifBox = true
        vm.from = Object.assign({},item);
        setTimeout(function () {
          if (vm.$refs['from']) {
            vm.$refs['from'].clearValidate()
          }
        })
        var newsArrow = item.conditions.split(',')
        const newlist = []
        newsArrow.forEach(news => {
          newlist.push({value: news})
        });
        vm.conditions = newlist

        this.btnType = 1
      },
      //修改条件回复提交
      commit(num) {
        const vm = this
        if (num === 1) {
          vm.update()
        } else if (num === 2) {
          vm.create()
        }
      },
      update() {
        const vm = this
        const newArrow = []
        vm.conditions.forEach(news => {
          newArrow.push(news.value)
        });
        vm.from.conditions = newArrow.join(',')
        vm.$refs['from'].validate((valid) => {
          if (valid) {
            if (vm.from.conditions.length > 0) {
              vm.isLocalAdd = true
              commentService.update(vm.from).then(data => {
                vm.isLocalAdd = false
                if (data.msg === 'ok') {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
                  vm.closeBox()
                  vm.localPage = 1
                  vm.getIfListLocal()
                } else {
                  this.$message.error(data.msg)
                }
              });
            } else {
              this.$message.error('请输入条件！');
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      create() {
        const vm = this
        const newArrow = []
        vm.conditions.forEach(news => {
          newArrow.push(news.value)
        });
        vm.from.conditions = newArrow.join(',')
        vm.$refs['from'].validate((valid) => {
          if (valid) {
            if (vm.from.conditions.length > 0) {
              vm.isLocalAdd = true
              commentService.create(vm.from).then(data => {
                vm.isLocalAdd = false
                if (data.msg === 'ok') {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
                  vm.closeBox()
                  // 添加完成 重新获取列表
                  vm.localPage = 1
                  vm.getIfListLocal()
                }else{
                  this.$message.error(data.msg);
                }
              });
            } else {
              this.$message.error('请输入条件！');
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //删除条件回复
      clickDelete(item) {
        const vm = this
        this.$confirm('确定要删除该记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {id: parseInt(item.id)}
          commentService.clickDelete(params).then(data => {
            if (data.msg === 'ok') {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              vm.closeBox()
              // 删除成功 获取列表
              vm.getIfListLocal()
            } else {
              this.$message({
                message: data.msg,
                type: 'error'
              });
            }
          });
        }).catch(() => {

        });

      },
      changeTab(val) {
        var self = this
        this.tabStatus = val
        if (self.tabStatus == 1) {
          self.userPage = 1
          self.getCustomerList()
        } else if (self.tabStatus == 2) {
          self.page = 1
          self.getIfListLocal()
        } else {
          self.globalPage = 1
          self.getIfListGlobal()
        }
      },
      open4() {
        this.cover = true
        this.ifBox = true
        let self = this;
        setTimeout(function () {
          if (self.$refs['from']) {
            self.$refs['from'].clearValidate()
          }
        })
        this.from = {
          product_id: '',
          answer: '',
          type: '0',
          is_global: 0
        },
          this.conditions = [{value: ''}]
        this.btnType = 2
      },
      closeBox() {
        this.ifBox = false
        this.cover = false
      },
      addArraw() {
        this.conditions.push({'value': ''})
      },
      deleteArraw(num) {
        if (this.conditions.length > 1) {
          this.conditions.splice(num, 1)
        }

      },
      changeAccountStatus(item) {
        let self = this
        self.$confirm('确定要'+(item.disable == 1?'启用':'禁用')+'该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(item.disable == 1){
            // 启用操作
            commentService.enableAccount({id: item.id}).then((res) => {
              if (res.msg == 'ok') {
                self.$message.success('操作成功！')
                self.userPage = 1;
                self.getCustomerList()
              } else {
                self.$message.error(res.data)
              }
            })
          }else{
            // 禁用操作
            commentService.disableAccount({id: item.id}).then((res) => {
              if (res.msg == 'ok') {
                self.$message.success('操作成功！')
                self.userPage = 1;
                self.getCustomerList()
              } else {
                self.$message.error(res.data)
              }
            })
          }
        }).catch(() => {

        });
      },
      deleteAccount(id) {
        let self = this
        self.$confirm('确定要删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          commentService.deleteAccount({id: id}).then((res) => {
            if (res.msg == 'ok') {
              self.$message.success('操作成功！')
              self.userPage = 1;
              self.getCustomerList()
            } else {
              self.$message.error(res.msg)
            }
          })

        }).catch(() => {

        });
      },
      editAccount(item) {
        let self = this
        self.editAccountDialog = true
        setTimeout(function () {
          if (self.$refs['accountForm']) {
            self.$refs['accountForm'].clearValidate()
          }
        })

        self.isEditAccount = true
        for (let i in item) {
          self.accountForm[i] = item[i]
        }
        if (item.product_list && item.product_list.length > 0) {
          self.accountForm.type_id = item.product_list.map((i) => {
            return i.id
          })
        } else {
          self.accountForm.type_id = []
        }
        self.accountForm.customer_id = item.id
        self.accountForm.root = self.accountForm.root * 1

      },
      addAccount() {
        let self = this
        self.editAccountDialog = true
        self.isEditAccount = false
        setTimeout(function () {
          if (self.$refs['accountForm']) {
            self.$refs['accountForm'].clearValidate()
          }
        })
        self.accountForm = {
          root: 0,
          type_id: [],
        }
      },
      saveAccount() {
        let self = this
        self.$refs['accountForm'].validate((valid) => {
          if (valid) {
            if (self.accountForm.type_id.length > 0) {
              if (self.isEditAccount) {
                // 非管理员 只绑定一个产品
                if(self.accountForm.root != 1){
                  self.accountForm.type_id = [self.accountForm.type_id[0]]
                }
                // 编辑账号
                commentService.updateUser(self.accountForm).then((res) => {
                  if (res.msg == 'ok') {
                    self.$message.success('操作成功')
                    self.editAccountDialog = false
                    self.userPage = 1
                    self.getCustomerList()
                  } else {
                    self.$message.error(res.data)
                  }
                })
              } else {
                // 创建账号
                commentService.saveAccount(self.accountForm).then((res) => {
                  if (res.code == 0) {
                    self.$message.success('操作成功')
                    self.editAccountDialog = false
                    self.userPage = 1
                    self.getCustomerList()
                  } else {
                    self.$message.error(res.msg)
                  }
                })
              }

            } else {
              this.$message.error('请选择产品！');
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      replayGlobalChange(page) {
        let self = this
        self.globalPage = page
        self.getIfListGlobal()
      },
      addReplyGlobal() {
        let self = this
        self.isEditReplay = false
        self.replayManageDialog = true
        setTimeout(function () {
          if (self.$refs['replayManageForm']) {
            self.$refs['replayManageForm'].clearValidate()
          }
        })
        self.replayManageForm = {
          type: '0',
          answer: '',
        }
      },
      globalEdit(item) {
        let self = this
        self.replayManageDialog = true
        console.log(item)
        setTimeout(function () {
          if (self.$refs['replayManageForm']) {
            self.$refs['replayManageForm'].clearValidate()
          }
        })
        self.replayManageForm = Object.assign({},item)
        self.isEditReplay = true
      },
      globalDelete(item) {
        let self = this
        self.$confirm('确定要删除该记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          commentService.clickDelete({id: item.id * 1}).then((res) => {
            if (res.msg == 'ok') {
              self.$message.success('操作成功！')
              self.globalPage = 1;
              self.getIfListGlobal()
            } else {
              self.$message.error(res.msg)
            }
          })

        }).catch(() => {

        });
      },
      replayManageSave() {
        let self = this
        self.replayManageForm.is_global = 1
        self.$refs['replayManageForm'].validate((valid) => {
          if (valid) {
            self.isGlobalAdd = true
            if (self.isEditReplay) {
              commentService.update(self.replayManageForm).then(data => {
                self.isGlobalAdd = false
                if (data.msg === 'ok') {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
                  self.replayManageDialog = false
                  self.globalPage = 1
                  self.getIfListGlobal()
                } else {
                  this.$message({
                    message: data.msg,
                    type: 'error'
                  });
                }
              });
            } else {
              commentService.create(self.replayManageForm).then(data => {
                self.isGlobalAdd = false
                if (data.msg === 'ok') {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
                  self.replayManageDialog = false
                  self.globalPage = 1
                  self.getIfListGlobal()
                } else {
                  this.$message({
                    message: data.msg,
                    type: 'error'
                  });
                }
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      localUploadFile(e) {
        let self = this
        if(e.target.files[0]){
          self.isLocalUpload = true
          self.$refs['from'].clearValidate(['answer'])
          self.uploadFile(e, (url) => {
            self.isLocalUpload = false
            self.from.answer = url
          })
        }
      },
      globalUploadFile(e) {
        let self = this
        if(e.target.files[0]){
          self.isGlobalUpload = true
          self.$refs['replayManageForm'].clearValidate(['answer'])
          self.uploadFile(e, (url) => {
            self.isGlobalUpload = false
            self.replayManageForm.answer = url
          })
        }
      },
      uploadFile(e, callback) {
        api.get('oss/token/generate').then((res) => {
          let resData = JSON.parse(res.data.data)
          console.log(resData)
          let tokenObj = resData.data || {}
          let form = new FormData();
          let fileName = 'reply' + new Date().getTime()
          const const_para = tokenObj.dir + "/" + fileName;//${filename}这个是一个常量字符串 阿里云os会自动的帮你读取文件名称
          form.append("key", const_para);
          form.append("policy", tokenObj.policy);
          form.append("OSSAccessKeyId", tokenObj.accessid);
          form.append("success_action_status", "200");//返回的为200,不传则返回204
          form.append("signature", tokenObj.signature);
          form.append("callback", tokenObj.callback);
          form.append('file', e.target.files[0]);

          axios.post(tokenObj.host, form)
            .then(function (res) {
              console.log(res.data.data.url)
              // 图片绝对路径
              callback && callback(res.data.data.url)
            })
            .catch(function (err) {
              console.log(err)

            });
        })
      },
      localTypeChange(val){
        let self = this
        self.from.answer = ''
        self.$nextTick(function () {
          self.$refs['from'].clearValidate(['answer'])
        })
      },
      globalTypeChange(val){
        let self = this
        self.replayManageForm.answer = ''
        self.$nextTick(function () {
          self.$refs['replayManageForm'].clearValidate(['answer'])
        })
      },
    }
  }
</script>
<style scoped>
  .position_icon {
    right: 0;
    top: 0;
  }

  .news_span {
    left: 0;
    top: 0;
  }

  .news_div {
    margin-right: 50px;
  }

  .fontsize20 {
    font-size: 20px;
  }

  .margin-r10 {
    margin-right: 10px;
  }

  .margin_b10 {
    margin-bottom: 10px;
  }

  .lingheight32 {
    line-height: 32px;
  }

  .width200 {
    width: 200px;
  }

  .wait_li {
    padding: 10px 0;
    border-bottom: 1px solid #f5f5f5;
  }

  .div_info {
    margin: 0 100px 0 52px;
    display: block;
    line-height: 24px;
  }

  .li_img {
    width: 42px;
    height: 42px;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }

  .li-btn {
    right: 0;
    top: 50%;
    transform: translateY(-50%)
  }

  .li_img img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .img_span {
    width: 18px;
    height: 18px;
    top: -2px;
    right: -2px;
    border-radius: 50%;
    background: red;
    font-size: 12px;
    text-align: center;
    line-height: 18px;
  }

</style>

<style lang="scss">
  .link {
    color: #599bff;
    &:hover {
      color: #488aef;
    }
  }

  .text-gary {
    color: #999;
  }

  .pull-left {
    float: left;
  }

  .pull-right {
    float: right;
  }

  .text-center {
    text-align: center;
  }

  .content-box {
    padding: 30px;
    background: #fff;
    height: 100%;
    overflow: auto;
    max-height: 700px;
    .title {
      border-bottom: 1px solid #dbdbdb;
      padding-bottom: 12px;
    }
    .tab-list {
      font-size: 16px;
      li {
        float: left;
        padding: 0 5px;
        margin: 0 15px;
        cursor: pointer;
        color: #999;
        &.active {
          color: #599bff;
          &:hover {
            color: #488aef;
          }
        }
      }
    }
    .content-list {
      margin-bottom: 20px;
      .item {
        padding: 15px 0;
        border-bottom: 1px solid #f5f5f5;
      }
      .li-btn .el-button--text {
        text-decoration: underline;
      }
    }
  }

  .btn {
    &.btn-primary {
      background: #488aef;
      color: #fff;
      padding: 0;
      width: 120px;
    }
  }

  .el-form-item.is-required .el-form-item__label:before {
    content: '';
  }
  .height100{height:100%;}
</style>
