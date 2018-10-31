<template>
<div class="height100">
  <div :class="tabNum==0?'chat_wrap':'chat_wrap displayN'">
        <div class="panel" :class="showList?'panel':'panel displayN'">
                <div class="scroll-wrapper scrollbar-macosx chat-scroll">
                    <div class="scrollbar-macosx scroll-content scroll-chat-content" data-reactid="" style="height:100%;">
                      <div class="overflow-h padding10 jj-box">
                        <div class="float_l">
                          <el-checkbox v-model="radio" @change="changeRadio()">有效</el-checkbox>
                        </div>
                        <el-select class="float_r" size="mini" v-model="origin_id01" clearable filterable placeholder="请选择" @change="updata">
                          <el-option
                            v-for="item in proList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.origin_id">
                          </el-option>
                        </el-select>
                      </div>
                        <!-- 用户列表 -->
                        <div v-for="item in clientLists" :key="item.id" @click="currUser(item)" class="card" :class="{card_selected: item.checked}" data-reactid="">
                            <div class="card_pic" data-reactid="">
                                <img data-reactid="" :src="item.avatar" :alt="item.nickname" :title="item.nickname">
                                <img :src="item.icon" class="logo" />
                            </div>
                            <div class="card_content" data-reactid="">
                                <div class="chat_content_header" data-reactid="">
                                    <span v-text="item.nickname" data-reactid="" class="card_content_nick" ></span>
                                    <span data-reactid="" class="card_message_state" v-show="item.showNum && item.num>0" v-text="item.num"></span>
                                </div>
                                <div class="card_content_chat" data-reactid="">
                                    <p v-html="item.latest_msg" class="card_content_detail" data-reactid="">jkl</p>
                                    <span v-text="item.updated_at" class="card_content_time" data-reactid="" v-if="item.status=='0'"></span>
                                    <span class="card_content_time" data-reactid="" v-if="item.status=='1'">已过期</span>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
        </div>

        <!-- 表情 -->
        <Emoji v-show="emojiShowFlag" @onEmojiClick="getEmojiIdx"></Emoji>
        <div class="chat chat_no_input" :class="showList?'chat_left':''">
            <!-- 当前聊天 -->
            <!-- header -->
            <div v-show="showHistory">
            <div class="chat_header" data-reactid="">
                <div class="chat_header_items" data-reactid="">
                    <span class="chat_header_name" data-reactid="" v-text="nickname" @click="showLeftList()"></span>
                    <div class="chat_header_icons" data-reactid="" @click="changeCust()" v-show="onlineFlag && overdue == '0'">
                        <span class="chat_header_icon transfer" style="" data-reactid=""></span>
                    </div>
                </div>
            </div>
            <!-- 聊天对话框 -->
            <div class="scroll-wrapper chat_body scrollbar-macosx" style="position: relative;" >
                <div class="chat_body scrollbar-macosx scroll-content scroll-scrolly_visible chat_body_h"   id="wrap" @scroll.native="handleScroll" data-reactid="">
                   <!-- 历史聊天记录 -->
                    <div v-for="(item ,index)  in msgsLists" :key="index" class="chat_body_inner" data-reactid="" >
                      <!-- 用户对话 -->
                        <div v-show="item.identity === 'std'" class="message_box " data-msgid="751" data-reactid="">
                            <div class="message_box_time" data-reactid="" v-text="item.created_at"></div>
                            <img :src="item.avatar" class="mssage_box_pic" data-is-me="false" style="display:inline-block;" data-reactid="" :title="item.nickname">
                            <div class="message_content" data-reactid="">
                                <span data-reactid=""></span>
                                <div class="message_content_inner" data-reactid="">
                                    <p v-if="item.msg_type=='text'" v-html="item.msg"></p>
                                    <p v-if="item.msg_type=='image'"><img :src="item.pic_url" style="width:100%"/></p>
                                    <div class="message_content_detecting" data-reactid="">
                                        <span class="first" data-reactid=""></span>
                                        <span class="second" data-reactid=""></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 客服对话 -->
                        <div v-show="item.identity === 'teacher' || item.identity === 'bot'" class="message_box from_self" data-msgid="752" data-reactid="">
                            <div class="message_box_time" data-reactid="" v-text="item.created_at"></div>
                            <img :src="userIcon" class="mssage_box_pic" data-is-me="true" style="display:inline-block;" data-reactid=""  :title="item.nickname">
                            <div class="message_content" data-reactid="">
                                <span data-reactid=""></span>
                                <div class="message_content_inner" data-reactid="">
                                    <p data-reactid="" v-if="item.msg_type=='text'" v-html="item.msg"></p>
                                    <p v-if="item.msg_type=='image'"><img :src="item.pic_url" style="width:100%"/></p>
                                    <div class="message_content_detecting" data-reactid="">
                                        <span class="first" data-reactid=""></span>
                                        <span class="second" data-reactid=""></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            <!-- 聊天输入框 -->
              <div class="chat_edit" style="display: block;" data-reactid=".0.5.1.0.2.0.2" v-show="onlineFlag && overdue == '0'">
                <div class="chat_edit_items" data-reactid=".0.5.1.0.2.0.2.0">
                    <div class="chat_edit_icons" data-reactid=".0.5.1.0.2.0.2.0.0">
                        <span class="chat_edit_icon emoji" title="表情" id="toggler-btn"  @click="toggleEmoji"></span>
                    </div>
                </div>
                <div class="chat_edit_input" data-reactid=".0.5.1.0.2.0.2.1">
                    <div class="scroll-wrapper edit_area scrollbar-macosx" style="position: relative;">
                        <pre id="editor" ref="editor" @focus="focusPre" @input="focusPre"  @keyup.13="show" class="edit_area scrollbar-macosx scroll-content" contenteditable="true" data-reactid=""  v-html="editContent">

                        </pre>
                      <p class="tips_p" v-show="tipsShow">最多可以输入500个字</p>
                        <div class="scroll-element scroll-x">
                            <div class="scroll-element_outer">
                                <div class="scroll-element_size"></div>
                                <div class="scroll-element_track"></div>
                                <div class="scroll-bar" style="width: 96px;"></div>
                            </div>
                        </div>
                        <div class="scroll-element scroll-y">
                            <div class="scroll-element_outer">
                                <div class="scroll-element_size"></div>
                                <div class="scroll-element_track"></div>
                                <div class="scroll-bar" style="height: 96px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat_edit_footer" data-reactid=".0.5.1.0.2.0.2.2">
                    按Enter发送，Ctrl+Enter换行
                </div>

            </div>
        </div>
        <!-- 未选择聊天 -->
        <div class="chat_not_pick" data-reactid=".0.5.1.0.2.0" v-show="!showHistory">
            <span class="wx_logo" data-reactid=".0.5.1.0.2.0.0"></span>
            <p class="not_pick_text" data-reactid=".0.5.1.0.2.0.1">未选择聊天</p>
        </div>
        <!-- 未选择聊天end -->
        <!-- 转接客服 -->
        <div class="transfer_popup" v-show="custShow===1"  data-reactid=".0.5.1.3" >
            <div class="transfer_chosen" data-reactid=".0.5.1.3.0">
                <div class="transfer_header overflow-h" data-reactid=".0.5.1.3.0.0">
                  <span class="float_l">请选择要转接的客服</span>
                </div>
                <div class="scroll-wrapper transfer_cards scrollbar-macosx" style="position: relative;">
                    <div class="transfer_cards scrollbar-macosx scroll-content" data-reactid=".0.5.1.3.0.1" style="height: 210px; margin-bottom: 0px; margin-right: 0px; max-height: none;">
                    <div :class="custChose!=index?'transfer_card':'transfer_card selected'" @click="chooseCust(index,item)" data-reactid=".0.5.1.3.0.1.$229176575" v-for="(item,index) in custList" :key="item.id">
                        <span class="transfer_card_img" data-reactid=".0.5.1.3.0.1.$229176575.0"><img :src="item.avatar" data-reactid=".0.5.1.3.0.1.$229176575.0.0" /></span>
                        <div class="transfer_card_info" data-reactid=".0.5.1.3.0.1.$229176575.1">
                            <p data-reactid=".0.5.1.3.0.1.$229176575.1.0">{{item.name}}</p>
                            <p class="transfer_card_assis" data-reactid=".0.5.1.3.0.1.$229176575.1.1">{{item.nickname}}</p>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="transfer_inputs" data-reactid=".0.5.1.3.0.2">

                <div class="transfer_input" data-reactid=".0.5.1.3.0.2.1">
                <div class="transfer_btn_wrap">
                <span class="btn_wrap">
                    <a @click="changeCustBtn()" class="btn btn_primary" >转接</a>
                </span>
                <span class="btn_wrap">
                    <a @click="delChangeCustBtn()" class="btn btn_default">取消</a>
                </span>
                </div>
                </div>
                </div>
            </div>
            </div>
      </div>
    </div>
  <div :class="tabNum==1?'waiting_wrap fff-bg':'waiting_wrap fff-bg displayN'">
    <div class="waiting_inner">
      <div class="waiting_panel">
        <div :class="curIndex==0?'setting_panel choose':'setting_panel'" data-index="0" @click="changeTab($event)">待接入会话</div>
        <div :class="curIndex==1?'setting_panel choose':'setting_panel'" data-index="1" @click="changeTab($event)">已过期会话</div>
        <el-select class="float_r seting_select" size="mini" v-model="origin_id02" clearable filterable placeholder="请选择" @change="updata">
          <el-option
            v-for="item in proList"
            :key="item.id"
            :label="item.name"
            :value="item.origin_id">
          </el-option>
        </el-select>
      </div>
      <div class="waiting_box">
        <div class="scoll_wrapper wait_list">
          <div class="wait_list">
            <div  :class="curIndex==0?'displayB':'displayN'">
            <ul class="list_ul djrlist"  v-show="waitingList.length>0">
              <li class="wait_li position-r" v-for="item in waitingList" :key="item.id">
                <div class="li_img position-a">
                  <img class="" :src="item.avatar"/>
                  <span class="img_span colorfff position-a msgnum">{{item.msg_num}}</span>
                  <span class="img_img colorfff position-a "><img class="" :src="item.icon"/></span>
                </div>
                <div class="div_info">
                  <div class="overflow-h span-div">
                    <span class="float_l fontweight_b color333 margin_r10" v-text="item.nickname"></span>
                    <span class="float_l color999 margin_r10 created" v-text="item.updated_at"></span>
                    <span class="float_l color999 overdue">{{item.overdue}}</span><span class="float_l color999">过期</span>
                  </div>
                  <p class="color666 msg" v-html="item.latest_msg.msg"></p>
                </div>
                <el-button v-show="item.state==1" class="position-a li-btn" type="success" size="mini" @click="accessFun(item)">接入会话</el-button>
                <el-button v-show="item.state==0" class="position-a li-btn" type="primary" size="mini" :loading="true">等待接入</el-button>
              </li>
            </ul>
              <p class="text_c" v-show="waitingList.length==0">暂无待接入会话记录</p>
            </div>
            <div  :class="curIndex==1?'displayB':'displayN'">
            <ul class="list_ul" v-show="overdueList.length>0">
              <li class="wait_li position-r" v-for="item in overdueList" :key="item.id">
                <div class="li_img position-a">
                  <img class="" :src="item.avatar"/>
                  <span class="img_span colorfff position-a displayN">{{item.msg_num}}</span>
                  <span v-if="item.origin_id=='gh_f4546e33a886'" class="img_img colorfff position-a "><img class="" src="../assets/imgs/pro_logo01.png"/></span>
                </div>
                <div class="div_info">
                  <div class="overflow-h">
                    <span class="float_l fontweight_b color333 margin_r10"  v-text="item.nickname"></span>
                    <span class="float_l color999 margin_r10" v-text="item.updated_at"></span>
                  </div>
                  <p class="color666" v-html="item.latest_msg.msg"></p>
                </div>
                <el-button class="position-a li-btn" type="info" plain disabled size="mini">已过期</el-button>
              </li>
              <li class="wait_li position-r borderN"><p class="text_c">只展示最近5天的数据</p></li>
            </ul>
              <p class="text_c" v-show="overdueList.length==0">暂无已过期会话记录</p>
            </div>
            <el-pagination  v-if="pageShow"
                            class="page-wrap"
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-size="pageSize"
              layout="total, prev, pager, next,jumper"
              :total="total">
            </el-pagination>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import ConversationService from '../service/Conversation';
import commentService from "../service/comment";
import Emoji from "../common/Emoji";
import emojiUtil from "../utils/emoji";
// import ws from "../utils/ws";
import $ from 'jquery';
window.$ = $;
var origin_init = localStorage.getItem("origin_id");
// console.log(ws)
var data = {
        clientLists:[],  //客户列表
        lists:[],
        msgsLists:[], // 消息列表
        nickname:"", //客户昵称
        avatar:"" , //客户头像
        open_id:"", // 客户ID
        userIcon:require("../assets/imgs/timg.jpg"),
        userName:"尚德成长+",
        editContent:"", // 输入框内容
        showHistory:false,
        emojiShowFlag:false, // 是否显示表情
        totalUnreadNum:0, // 未读信息总数
        curIndex:0,
        options: [{
            value: '选项1',
            label: '尚德成长+'
        }, {
            value: '选项2',
            label: '菠萝英语'
        }],
        value8: '',
        waitingList:[],
        overdueList:[],
        proList:[],
        expire:[],
        page:1,
        pageSize:5,
        total:0,//分页总数
        total1:'',//待接入总人数
        pageShow:false,
        cust_id:4,
        origin_id:origin_init, //产品Id,
        origin_id01:origin_init,
        origin_id02:origin_init,
        tipsShow:true,//字数提示语，true为显示
        closeFlag:false, // ws链接关闭
        custList:[],//在线客服列表
        custShow:0,//0不展示在线客服列表，1展示在线客服列表
        custChose:'no',//选择客服
        new_cust_id:'',//被转接新客服id
        shownum:0,
        nowtime:new Date().getTime(), //获取当前时间
        focusState:false,
        ws:'',
        onlineFlag:false, // 下线
        radio:false,
        is_all:1,//1是全部，0是有效
        accessStatus:0, //转入状态
        beyond:0, //超出5条
        lsClientLists:[],
        root:0, //用户权限
        proIcon:'',//产品图标
        overdue:'',//当前用户是否过期
        pro_client_list:[],//不同产品对应不同的用户列表
        prolsClientLists:[],
        showList:true,//是否显示左侧用户列表
}
export default {
// let app = {
  name: 'index',
  props:['onlineStatua','tabNum','numPp'],
  data () {
    return data
  },
components: {Emoji},
directives: {
    focus: {
      update: function (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    }
  },
created() {
        let body = document.querySelector('body')
        body.addEventListener('click',(e)=>{
            if(e.target.id === 'toggler-btn' || e.target.id === 'page_emotion' || e.target.className === 'emoji-icon'){
                    this.emojiShowFlag = true;
                    var obj = document.getElementById("editor");
                    obj.focus()
            }else {
                this.emojiShowFlag = false
            }
        },false)
      this.custShow=0
      this.cust_id = localStorage.getItem('cust_id');
      this.userName = localStorage.getItem("nickname");
      this.origin_id = localStorage.getItem("origin_id");
      this.origin_id01 = this.origin_id
      this.origin_id02=this.origin_id
      this.proList=JSON.parse(localStorage.getItem("product_list"))
      this.root = localStorage.getItem("root")
      this.totalUnreadNum = parseInt(localStorage.getItem("totalUnreadNum"))
      console.log(this.totalUnreadNum)
      if(isNaN(this.totalUnreadNum)){
        this.totalUnreadNum = 0;
      }
      // this.unreadList =JSON.parse(localStorage.getItem("unreadList"))
      // console.log(this.unreadList)
      // if(this.unreadList == null){
      //   this.unreadList = []
      // }else{
      //   for(let i = 0 ; i<this.unreadList.length; i++){
      //     if(this.origin_id == this.unreadList[i].origin_id){
      //       this.totalUnreadNum = this.unreadList[i].totalUnreadNum
      //     }
      //   }
      // }
      if(localStorage.getItem("stateNum")==1){
        this.onlineFlag = true;
        this.online();
      }else{
          this.onlineFlag = false;
      }
      //this.proList.unshift({id:'',name:'全部',origin_id:''})去掉全部
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.msgsLists=[]
      vm.nickname=''
      vm.onlineFlag=false
      vm.overdue=''
      vm.showHistory=false
    })
  },
  watch: {
    // totalUnreadNum:{
    //     handler(){
    //       this.$emit("msgTotal", this.totalUnreadNum)
    //     },
    //     deep:true
    // },
      accessStatus:{
           handler(){
            if(this.accessStatus > 0){
                // this.getHistory();//获取转接的客服
                this.$notify({
                  title: '消息提示',
                  message: '你有一个新用户转入，请注意查看会话列表',
                  type: 'success',
                  duration: 0
                });
                // this.messageOpen("你有一个新用户转入，请注意查看会话列表")
            }
          },
          deep:true

      },
      beyond:{
           handler(){
             this.$message.error('连续发送消息超过5次');
          },
          deep:true
      },
      onlineStatua(num){ //监控上线下线
      console.log(num)
            if(num==1){
                this.onlineFlag = true;
                this.online();
            }else{
                this.onlineFlag = false;
                this.offline()
                closeWs();
            }
      },
    totalUnreadNum(){
          this.$emit("msgTotal", this.totalUnreadNum)
      },
    tabNum(){
      if(this.tabNum===0){
        this.students()//获取会话列表
      }else if(this.tabNum===1){
        this.getWaitingList()//获取待接入列表
      }
    },
    waitingList(){
      this.$set(data,'waitingList', this.waitingList);
    },
    total1(){
      //this.total=this.total1
      this.$emit('shownum', parseInt(this.total1))//新待接入用户进来待接入人数+1
    },
    closeFlag:function(){
          // this.open("获取数据失败,请刷新重试!")
      },
      msgsLists:{
          handler(){
            setTimeout(()=>{this.add()},500)
          },
          deep:true
      },
    clientLists:{
       handler(){
          localStorage.setItem('clientLists',JSON.stringify(this.pro_client_list));

         this.prolsClientLists = JSON.parse(localStorage.getItem("clientLists"))
       },
       deep: true
    }
  },
    mounted() {

         if(localStorage.getItem("clientLists")== null) {
             console.log('null is null')
         }else{
          if(localStorage.getItem("clientLists").indexOf('proId')>-1){
              this.pro_client_list = JSON.parse(localStorage.getItem("clientLists"))
          }
         }
      //从缓存中取不同产品对应不同的用户列表
      if(!this.pro_client_list){
        this.pro_client_list =[]
      }
        this.students();   //   获取用户列表
        // this.getPro()//获取小程序列表

    },
    methods: {

      //是否显示左侧列表
      showLeftList(){

        if(this.showList){
          this.showList = false
        }else{
          this.showList = true;
        }

      },
    //搜索某位客服
      searchCust(){
        //todo
        this.getCustList()
      },
     handleCurrentChange(val){
        this.page = parseInt(val);
        if (this.curIndex == 0) {
          this.getWaitingList()
        } else if (this.curIndex == 1) {
          this.getOverDueList()
        }
      },
      // 提示信息
    messageOpen(text) {
        this.$message({
            message: text,
            type: 'success'
            });
      },
      //获取焦点隐藏提示语
      focusPre(){
        this.tipsShow=false
      },
      //获取焦点显示提示语
      showTip(){
        this.tipsShow=true
      },
   //下线
       offline(){
        let params = {
            origin_id:this.origin_id,
            cust_id:this.cust_id
        }
        ConversationService.offline(params).then(data=>{
            if(data.code==0){
                closeWs();
                // Ws.onclose();
                this.onlineFlag = false;
                this.open("您已下线!")
            }else{
              this.onlineFlag = true
              this.$emit('showjj',1)
              this.open("下线失败,请刷新重试!")
            }
        })
    },
        //上线
    online(){
        let vm = this
            let params = {
                origin_id:this.origin_id,
                cust_id:this.cust_id,
                root:this.root,
            }
            ConversationService.online(params).then(data=>{
                if(data.code==0){
                    // let that = this;
                    // ws.init({
                    //   url: data.data + '?cust_id=' + that.cust_id + '&origin_id=' + that.origin_id +'&root=' + that.root
                    // }).connect();
                    this.ws = connect(data.data + '?cust_id=' + this.cust_id + '&origin_id=' + this.origin_id +'&root=' + this.root);
                    this.onlineFlag = true
                  if(vm.tabNum==1){
                     vm.getWaitingList()
                  }
                }else{
                  this.onlineFlag = false
                  this.$emit('showjj',0)
                    this.open(data.msg)
                }
            }).catch(data => {
              this.onlineFlag = false
              this.$emit('showjj',0)
            });
        },
    //获取http历史记录getHistory
    getHistory(){
            let params = {
                open_id:this.open_id,
            }
            ConversationService.getHistory(params).then(data=>{
                if(data.code==0){
                    console.log(data)
                    this.msgsLists = data.data.reverse();
                    this.msgsLists.forEach(item => {
                    item.msg = emojiUtil.emojiToImg(item.msg)
                    })
                }else{
                    this.open("获取数据失败,请刷新重试!")
                }
            })
        },
        // 渲染表情
        getEmojiIdx(idx){
           let img =  emojiUtil.emojiIndexToImg(idx);
           this.editContent = this.$refs.editor.innerHTML + img
        },
      //切换有无效用户列表
      changeRadio(){
        if(this.radio===true){
        this.is_all=0
        }else{
        this.is_all=1
        }
        this.students()
      },
        // 获取左侧用户列表
        students(a){
          let that = this;
          that.msgsLists=[]
          that.nickname=''
          // that.onlineFlag=false
          that.overdue=''
          that.showHistory=false
            var params = {
                "origin_id":this.origin_id01,
                "cust_id":this.cust_id,
                "page":1,
                "pageSize":9999,
                "is_all":this.is_all
            }
            ConversationService.getAccessedLists(params).then(data=>{
                if(data.code==0){
                  data.data.list.sort((a,b)=>{
                      return a.status - b.status
                    })
                  data.data.list.forEach(item=> {
                    item.checked = false; //是否点击
                    item.showNum = true; //是否显示未读条数
                    item.num = 0; // 显示未读条数
                  });
                  that.clientLists = data.data.list;//当前产品id下的用户列表
                  if(that.pro_client_list.length<=0){
                    that.pro_client_list.push({proId:that.origin_id01,clientLists:that.clientLists})//存产品id及对应的列表
                    localStorage.setItem('clientLists',JSON.stringify(that.pro_client_list));
                  }else{
                    if(JSON.stringify(that.pro_client_list).indexOf(that.origin_id01)>-1){
                      $.each(that.pro_client_list,function(index,item){
                        if(item.proId==that.origin_id01){//更新该产品id下的用户列表
                          that.prolsClientLists = JSON.parse(localStorage.getItem("clientLists"))
                          if( that.prolsClientLists != null){
                              that.lsClientLists=that.prolsClientLists[index].clientLists//缓存中该产品id对应的用户列表
                              for(let i= 0; i < that.clientLists.length ; i++){
                                for(let m = 0; m <that.lsClientLists.length ; m++){ //获取未读条数
                                  if(that.lsClientLists[m].open_id == that.clientLists[i].open_id){
                                    that.clientLists[i].num = that.lsClientLists[m].num;

                                    that.clientLists[i].checked = that.lsClientLists[m].checked;
                                    if(that.lsClientLists[m].checked){ //当前聊天,获取聊天记录
                                    that.nickname = that.lsClientLists[m].nickname;
                                    that.overdue = that.lsClientLists[m].status;
                                    that.open_id = that.lsClientLists[m].open_id;
                                    that.getHistory();
                                    that.showHistory = true;
                                    }
                                    break;
                                  }
                                }
                              }

                          }
                          that.pro_client_list[index].clientLists=that.clientLists//更新该产品id下的用户列表,更新完成
                          localStorage.setItem('clientLists',JSON.stringify(that.pro_client_list));//将更新完成的用户列表数组再存进
                        }
                      })
                    }else{
                      that.pro_client_list.push({proId:that.origin_id01,clientLists:that.clientLists})
                      localStorage.setItem('clientLists',JSON.stringify(that.pro_client_list))
                    }

                  }
                  if(a == 1){
                      that.clientLists.forEach((item,index) => {
                        console.log(index)
                        if(index == 0){
                          item.checked = true;
                            console.log(index,item)
                        }else{
                          item.checked = false;
                        }

                      })
                      // that.clientLists[0].checked = true;
                      console.log(that.clientLists[0])
                      that.open_id = that.clientLists[0].open_id;
                      that.getHistory();
                      that.showHistory = true;
                      that.nickname=that.clientLists[0].nickname;
                      that.overdue = '0';
                      that.onlineFlag = true;
                    }
                    that.clientLists.forEach(item =>{ // 添加表情
                        item.latest_msg = emojiUtil.emojiToImg(item.latest_msg)
                        // proLis添加产品图标
                        for(let m = 0; m < that.proList.length;m++){
                            if(item.origin_id== that.proList[m].origin_id){
                                item.icon = that.proList[m].icon;
                                break;
                            }
                        }
                    })

                }else{
                    this.open("获取数据失败,请刷新重试")
                }

            });
        },
        // 表情框
        toggleEmoji(e) {
            this.isMenuActive = !this.isMenuActive
             this.emojiShowFlag = true;
        },
      // //获取小程序列表
      // getPro() {
      //   const vm = this
      //   commentService.getPro().then(data => {
      //     if (data.code == 0) {
      //         console.log(data.data)
      //       this.proList = data.data
      //     }
      //   });
      // },
      //接入会话
      accessFun(item) {
        const vm = this
        console.log(vm.onlineFlag,item)
        if(vm.onlineFlag===true){
        item.state = 0
        const params = {
          open_id:item.open_id
        };
        commentService.accessFun(params).then(data => {
          console.log(data)
          if (data.code == 0) {
              vm.origin_id01 = item.origin_id
              vm.getWaitingList()
            vm.total1=vm.numPp
            if(vm.total1>=1) {
              vm.$emit('shownum', vm.total1 - 1)//待接入人数-1
            }
            var totalWaittingList=JSON.parse(localStorage.getItem("totalWaittingList"))
            totalWaittingList.forEach(function(arr,index){
              if(arr.open_id==item.open_id){
                totalWaittingList.splice(index,1)
                localStorage.setItem("totalWaittingList", JSON.stringify(totalWaittingList))
              }
            })
              vm.$emit('tabNum',0)
              vm.$emit('gotoCon')//切换到会话列表
          }else {
            item.state = 1
            this.$message({
              message: data.msg
            });
            vm.getWaitingList()
          }
        }).then(data=>{
            vm.students(1)
        });
        }else{
          this.open("离线状态无法接入用户，请先上线。")
        }
      },
      //待接入会话列表
      getWaitingList() {
        const params = {
          origin_id: this.origin_id02,
          page: parseInt(this.page),
          pageSize: this.pageSize,
        };
        //const loadingInstance = this.$loading({ fullscreen: true });
        commentService.getWaitingList(params).then(data => {
          if (data.code == 0) {
            const rdata = data.data;
            this.total= parseInt(rdata.total);
            //this.total1 = parseInt(rdata.total);
            //this.$emit('shownum',parseInt(rdata.total))
            this.page = parseInt(rdata.page);
            this.total1=this.numPp
            if (this.total > 5) {
              this.pageShow = true;
            }
            rdata.list.forEach(news => {
              news.state = 1
              var thelast = new Date(news.updated_at).getTime() + 48 * 60 * 60 * 1000
              var thetime=Math.floor((thelast - this.nowtime) / 1000 / 60 / 60)

              if(thetime<1){
                thetime = Math.floor((thelast - this.nowtime) / 1000 / 60 )
                if(thetime<1){
                  news.overdue = '即将'
                }else{
                  news.overdue = thetime+'分钟后'
                }
              }else{
                news.overdue = thetime+'小时后'
              }
              news.latest_msg.msg = emojiUtil.emojiToImg(news.latest_msg.msg)
              for(let m = 0; m < this.proList.length;m++){
                if(news.origin_id== this.proList[m].origin_id){
                  news.icon = this.proList[m].icon;
                  break;
                }
              }
            });

            this.waitingList = rdata.list;

            //this.inputTagsChange()
          }
        });
      },
      //已过期列表
      getOverDueList() {
        const params = {
          origin_id: this.origin_id02,
          page: parseInt(this.page),
          pageSize: this.pageSize,
        };
        //const loadingInstance = this.$loading({ fullscreen: true });
        commentService.getOverDueList(params).then(data => {
          if (data.code == 0) {
            const rdata = data.data;

            this.total = parseInt(rdata.total);
            this.page = parseInt(rdata.page);
            if (this.total > 5) {
              this.pageShow = true;
            }
            rdata.list.forEach(news => {
              news.state = 1;
            news.latest_msg.msg = emojiUtil.emojiToImg(news.latest_msg.msg)
            });
            this.overdueList = rdata.list;
            //this.inputTagsChange()

          }
        });
      },
      updata() {
        if(this.tabNum==0){
          this.students()
          // this.unreadList = JSON.parse(localStorage.getItem('unreadList'))
          localStorage.setItem("origin_id",this.origin_id01)
            // this.totalUnreadNum = 0
            // if(this.unreadList == null){

            // }else{
            //   for(let i = 0; i< this.unreadList.length ; i++){
            //     if(this.origin_id01 == this.unreadList[i].origin_id){
            //       this.totalUnreadNum = this.unreadList[i].totalUnreadNum
            //       this.$emit("msgTotal", this.totalUnreadNum)
            //       return
            //     }
            //   }

            // }

        }else if(this.tabNum==1){
        this.page=1
        this.pageShow=false
        if (this.curIndex == 0) {
          this.getWaitingList()
        } else if (this.curIndex == 1) {
          this.getOverDueList()
        }
        }
      },
      //切换标签
      changeTab: function (e) {
        var the = e.currentTarget;
        var index = the.dataset.index;
        this.curIndex = index
        this.page=1
        this.pageShow=false
        if (index == 0) {
          this.getWaitingList()
        } else if (index == 1) {
          this.getOverDueList()
        }
      },
      //转接客服
      changeCust(){
        this.custShow=1
        this.getCustList()
      },
      //选择客服
      chooseCust(num,item){
        this.custChose=parseInt(num)
        this.new_cust_id=item.id
      },
//获取在线客服列表
      getCustList(item) {
        const vm = this
        const params = {
          origin_id: vm.origin_id,
        };
        commentService.getCustList(params).then(data => {
          if (data.code == 0) {
            if (data.msg === 'success') {
              var rdata=data.data
              rdata.forEach((item,index) => {
                if(vm.cust_id===item.id){
                  rdata.splice(index,1)
                }
              });
              vm.custList=data.data
            } else {
              item.state = 1
            }
            //this.inputTagsChange()

          }
        });
      },
//点击转接
      changeCustBtn(){
        const vm = this
        if(this.custChose!='no'){
        const params = {
          cust_id:parseInt(vm.cust_id),
          new_cust_id:parseInt(vm.new_cust_id),
          open_id:vm.open_id,
        };
        commentService.transferStu(params).then(data => {
          if (data.code == 0) {
            if (data.msg === 'success') {
              this.$message({
                message: '转接客服成功',
                type: 'success'
              });
              vm.custShow=0
              vm.custChose='no'
            //   for(let i = 0;i<vm.clientLists.length;i++){
            //      if(vm.open_id===vm.clientLists[i].open_id){
            //       vm.clientLists.splice(i,1);
            //       vm.showHistory = false;
            //       break;
            //     }
            //   }
              vm.clientLists.forEach((item,index)=>{
                if(vm.open_id===item.open_id){
                  vm.clientLists.splice(index,1);
                  vm.showHistory = false;
                }
              })
            }
            //this.inputTagsChange()

          }else{
            this.open(data.msg)
          }
        });
        }else{
          this.$confirm('请先选中一位客服', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }
      },
      //取消转接客户
      delChangeCustBtn(){
        this.custShow=0
      },
      // 滚动条
      add(){
        var div = document.getElementById('wrap');
        div.scrollTop = div.scrollHeight;
      },
    //弹框
     open(text) {
        this.$alert(text, '信息', {
          confirmButtonText: '确定',
        });
      },
    //   点击用户列表
      currUser(item){
          this.showHistory = true;
          let that = this;
          this.clientLists.forEach(item => {
              item.checked = false;
              item.showNum = true;
          })
          item.checked = true;  // 选中状态
        item.num = 0;//设置未读条数为0
          item.showNum = false; // 设置未读条数不可见
          if(this.totalUnreadNum >= item.num){
              this.totalUnreadNum = this.totalUnreadNum - item.num;
          }

          // that.unreadList = JSON.parse(localStorage.getItem('unreadList'))
          // if(that.unreadList != null){
          //   for(let i = 0; i< that.unreadList.length ; i++){
          //         if(this.origin_id01 == that.unreadList[i].origin_id){
          //           that.unreadList[i].totalUnreadNum = that.totalUnreadNum
          //           this.$emit("msgTotal", this.totalUnreadNum)
          //         }
          //   }
          //   localStorage.setItem('unreadList',JSON.stringify(this.unreadList))
          // }
          localStorage.setItem('totalUnreadNum',JSON.stringify(this.totalUnreadNum))
          item.num = 0;
          this.overdue = item.status;
          this.nickname = item.nickname;
          this.avatar = item.avatar,
          this.open_id = item.open_id;
          this.origin_id = item.origin_id;
          this.msgsLists=[]; // 清空聊天记录
          localStorage.setItem("clientLists",this.pro_client_list)

          if(this.onlineFlag){ //判断上线状态
                // 获取历史记录
                var params = {
                    "event": "chat_history",
                    "data": {
                        "cust_id": that.cust_id,
                        "open_id":this.open_id,
                        "origin_id": this.origin_id
                    }
                }
                ws.send(JSON.stringify(params));
          }else{

              this.getHistory();
          }

      },
      show:function(e){
        let that = this;
        let sendMsg = e.target.innerHTML.replace(/<div><br><\/div>/g,'').replace(/(&nbsp;)/g,'');
        let text = $.trim(sendMsg) ;
        let n = text.length;
        let fontText=$.trim(e.target.innerText)
        let textLength=fontText.length
        if(textLength<=500){
          if(n>0){
            let params = {
              "event": "chat_reply",
              "data": {
                "open_id": that.open_id,
                "origin_id": that.origin_id,
                "cust_id": that.cust_id,
                "msg":emojiUtil.imgToEomoji(sendMsg),
                "nickname": that.userName,
                "avatar":that.userIcon,
                "msg_type":"text"
              }
            }
            ws.send(JSON.stringify(params));
            e.target.innerHTML = "";
            that.showTip()
          }else{
            e.target.innerHTML = "";
          }
        }else{
          this.open('输入已超出500个字')
        }

        },

    }
  };
// export default app;
  // 获取消息事件
var ws;
// 重连
function connect(uri){
  console.log(uri)
    ws = new WebSocket(uri);
    ws.onmessage = onmessage;
    ws.onclose = function () {
      data.closeFlag = true;
      if(data.onlineFlag){
          console.log("连接已关闭...");
          setTimeout(()=>{
              connect(uri)
            }, 30000)
        }

    }
};
// 断开
function closeWs(){
    ws.close()
};

		// ws.init({
		// 	url: "//xxx"
		// }).connect();

		// ws.onmessage = function(message) {
		// 	console.log("receive:" + message.data);
		// }

		// ws.onopen = function() {
    //   // this.send("adfa");
    //   console.log("onopen")
    // }
    function onmessage(evt) {
      console.log(evt,9999)
       if(evt.data.indexOf('code')>=0){
         var resData = JSON.parse(evt.data);
         console.log(resData)
          if(resData.code==1){ // 连续发送超过5条
            data.beyond += 5
            console.log("连续发送超过5条")
          }
          if(resData.code==0){
              if(resData.event == 'chat_reply'){
                 console.log( resData.data)
                 console.log("chat_reply")
                 chatReplay(resData)
                }
                if(resData.data.event == 'chat_std'){
                  console.log('chat_std')
                  chatStd(resData)
                }
                if(resData.event == 'chat_history'){
                  console.log('chat_history')
                  chatHistory(resData)
                }

            };
    }

        //获取新用户的待接入
      // var lastS=0
      if(evt.data.indexOf('nickname')>=0){
        var resData = JSON.parse(evt.data);
        if(resData.event == 'transfer_student'){ //转接学员
            console.log(resData.data)
            transferStudent(resData)
        }
        if(resData.event == 'wait_handle'){
          console.log(resData.data)
          waitHandle(resData)
        }
      }
      //接入学员发送移除通知
      if(evt.data.indexOf('open_id')>=0){
        var resData = JSON.parse(evt.data);
        if(resData.event == 'remove_std'){
          console.log(resData.data)
          removeStd(resData)
        }
      }
    };
    function transferStudent(resData){
      resData.data.latest_msg =emojiUtil.emojiToImg(resData.data.latest_msg)
        // proLis添加产品图标
      for(let m = 0; m < data.proList.length;m++){
          if(resData.data.origin_id== data.proList[m].origin_id){
              resData.data.icon = data.proList[m].icon;
              break;
          }
      }
      data.clientLists.unshift(resData.data)
      data.accessStatus +=1;
    }
    function waitHandle(resData){
         let lastS=0
         //计算过期时间
          var nowtime=new Date()
          nowtime=nowtime.getTime()
          resData.data.state=1
          var thelast=new Date(resData.data.updated_at).getTime()+48*60*60*1000
          resData.data.overdue=Math.floor((thelast-nowtime)/1000/60/60)+'小时';
          console.log(data.waitingList)
          var totalWaittingList=JSON.parse(localStorage.getItem("totalWaittingList"))
          if(totalWaittingList.length>0){
          $.each(totalWaittingList,function(index,item){
            if(resData.data.open_id===item.open_id){//判断当前总待接入列表中是否有当前待接入者
              lastS=2
             //当前总待接入列表中有当前待接入者的话，总待接入人数不+1
              if(resData.data.origin_id===data.origin_id02||data.origin_id02===''){//判断当前待接入者的产品id是否是当前选择的产品id
                data.waitingList.forEach((item,index)=>{//当前选择的产品id=当前待接入者的产品id，或当前未选择产品，更新列表
                  if(resData.data.open_id===item.open_id){
                    resData.data.msg_num=parseInt($('.djrlist li').eq(index).find('.msgnum').text())+1
                    resData.data.updated_at=resData.data.updated_at
                    data.waitingList.splice(index,1)
                    data.waitingList.unshift(resData.data)
                    return
                  }
                })
              }
              return
            }
          })
          }
          if(lastS!=2){
            console.log(localStorage.getItem("forWsWaittingPp"))
            //当前总待接入列表中无当前待接入者的话，总待接入人数不+1
            data.total1=parseInt(localStorage.getItem("forWsWaittingPp"))+1
            if(resData.data.origin_id===data.origin_id02||data.origin_id02===''){//判断当前待接入者的产品id是否是当前选择的产品id
              data.waitingList.unshift(resData.data)
            }
            var totalWaittingList=JSON.parse(localStorage.getItem("totalWaittingList"))
            totalWaittingList.unshift(resData.data)
            localStorage.setItem("totalWaittingList", JSON.stringify(totalWaittingList))
          }

          for(let m = 0; m < data.proList.length;m++){
            if(resData.data.origin_id== data.proList[m].origin_id){
              resData.data.icon = data.proList[m].icon;
              break;
            }
          }
    }
    function removeStd(resData){
      data.waitingList.forEach((item,index)=>{
            if(resData.data.open_id===item.open_id){
              data.waitingList.splice(index,1)
            }
          })
    }
    function chatHistory(resData){
        if(resData.data.length >0){
            data.msgsLists  = resData.data.reverse();
            data.msgsLists.forEach(item => {
                item.msg = emojiUtil.emojiToImg(item.msg)
            })
        }
    }
    function chatStd(resData){
        var id = resData.data.open_id;
      // 显示未读条数

          if (resData.code==0&&resData.data.origin_id == data.origin_id01) { //推送来的消息是当前产品id
            resData.data.msg = emojiUtil.emojiToImg(resData.data.msg);
            for (var i = 0; i < data.clientLists.length; i++) {
              if (data.clientLists[i].open_id == id) {
                data.clientLists[i].created_at = resData.data.created_at;
                data.clientLists[i].updated_at = resData.data.created_at;
                data.clientLists[i].latest_msg = emojiUtil.emojiToImg(resData.data.msg);
                if(data.open_id != id){
                  data.clientLists[i].num= parseInt(data.clientLists[i].num) + 1;
                }
              }
            }
            if(data.open_id == id){ //推送来的消息是当前聊天
              data.msgsLists.push(resData.data);
            }else{
              data.totalUnreadNum = data.totalUnreadNum + 1;
              localStorage.setItem("totalUnreadNum",data.totalUnreadNum)
            }

          } else {
            $.each(data.pro_client_list, function (index, item) {
              if (item.proId == resData.data.origin_id) {
                data.prolsClientLists = JSON.parse(localStorage.getItem("clientLists"))
                var theclientLists = data.pro_client_list[index].clientLists
                for (var i = 0; i < theclientLists.length; i++) {
                  if (theclientLists[i].open_id == id) {
                    theclientLists[i].num = parseInt(theclientLists[i].num) + 1;
                    theclientLists[i].created_at = resData.data.created_at;
                    theclientLists[i].updated_at = resData.data.created_at;
                    theclientLists[i].latest_msg = emojiUtil.emojiToImg(resData.data.msg);
                    data.totalUnreadNum = data.totalUnreadNum + 1;
                    console.log(data.totalUnreadNum,'5959')
                    // console.log(data.unreadList)
                    // if(data.unreadList != null){
                    //   for(let i = 0; i< data.unreadList.length ; i++){
                    //     if(resData.data.origin_id == data.unreadList[i].origin_id){
                    //       data.unreadList[i].totalUnreadNum = data.totalUnreadNum;
                    //       localStorage.setItem('unreadList', JSON.stringify(data.unreadList))
                    //       return;
                    //     }
                    //   }
                    // }
                    // if(data.unreadList == null){
                    //     let params = [{"origin_id":resData.data.origin_id,"totalUnreadNum":data.totalUnreadNum}]
                    //     console.log(params)
                    //     localStorage.setItem('unreadList', JSON.stringify(params))
                    // }
                    // console.log(localStorage.getItem('unreadList'))
                    localStorage.setItem("totalUnreadNum",data.totalUnreadNum)
                    data.pro_client_list[index].clientLists = theclientLists
                    localStorage.setItem('clientLists', JSON.stringify(data.pro_client_list))
                    break;
                  }
                }
              }
            })
          }
    }
   function chatReplay(resData){
    if(resData.data.open_id != undefined){
        resData.data.msg = emojiUtil.emojiToImg(resData.data.msg)
        data.msgsLists.push(resData.data)
          // 是否移动当前用户到列表第一位
        let length = data.clientLists.length;
        let index = 0;
        let status = "";
        let itemIcon = "";
        if(length >1){ // 用户列表人数大于1,当前聊天不在好友列表第一位
            for(var i = 0 ; i < length ; i++ ){ // 判断当前用户在列表中的位置
                if(data.clientLists[i].open_id == data.open_id){
                    index = i;
                    status = data.clientLists[i].status;
                    itemIcon = data.clientLists[i].icon
                    break;
                }
            };
            if(index>0){  //当前聊天用户不是第一位
                data.clientLists.splice(index,1);
                var param = {
                            "open_id": data.open_id,
                            "origin_id": data.origin_id,
                            "nickname": data.nickname,
                            "avatar": data.avatar,
                            "latest_msg": resData.data.msg,
                            "updated_at": resData.data.created_at,
                            "checked":true,
                            "status":status,
                            "icon":itemIcon,
                }

                data.clientLists.unshift(param)
            }
        }else{
                  data.clientLists[0].latest_msg = resData.data.msg;
                  data.clientLists[0].updated_at = resData.data.created_at;
            }
    }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/* panel ::-webkit-scrollbar
{
    width: 4px;
    height: 100%;
} */

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
/* -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,0.3); */
border-radius: 4px;
/* background-color: #F5F5F5; */
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
    border-radius:4px;
    -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,.3);
    background-color: #C6C5C5;
}
.edit_area{
height: 80px;
margin-bottom: 0px;
margin-right: 0px;
max-height: none;
}
.card .card_pic img.logo{
    position:absolute;
    bottom:0;
    right:0;
    width: 24px;
    height: 24px;
    display: inline-block;
    border-radius: 50%;
    background:url('../assets/imgs/timg.jpg') no-repeat;
    background-size:100% 100%;
}
.scroll-chat-content{
height: 700px;
margin-bottom: 0px;
margin-right: 0px;
max-height: none;
}

.chat-scroll{
position: relative;
height: 100%;
}
.chat_wrap {
position: relative;
height: 100%;
}

.panel {
  height: 100%;
  background-color: #fff;
  float: left;
  overflow: hidden;
}
.shortcut {
  float: right;
  display: none;
  height: 100%;
  background-color: #fff;
}
.chat {
  position: relative;
  border-left: 1px solid #dcdcdc;
  background-color: #f5f5f5;
  margin-right: 0;
  height: 100%;
}
.card_selected {
background-color: #EAEAEA;
cursor: default;
}
.card {
padding: 15px 10px;
overflow: hidden;
cursor: pointer;
}
.scroll-wrapper {
overflow: hidden!important;
position: relative;
}
.scroll-wrapper>.scroll-content {
border: none!important;
box-sizing: content-box!important;
/* height: auto; */
left: 0;
margin: 0;
max-height: none;
max-width: none!important;
overflow-y: scroll!important;
padding: 0;
position: relative!important;
top: 0;
width: auto!important;
}
.card .card_pic {
position: relative;
float: left;
width: 50px;
}
.card .card_content {
float: left;
position: relative;
padding-left: 5px;
}
.card .card_pic img {
margin-top: 5px;
width: 39px;
height: 39px;
border: 1px solid #f5f5f5;
}
.card .card_content .chat_content_header {
margin-top: 3px;
}
.card .card_content .card_content_nick {
display: inline-block;
width: 120px;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
word-wrap: normal;
vertical-align: middle;
color:#000;
}
.card .card_content .card_message_state {
position: absolute;
right: 0;
top: 0;
padding: 2px 4px;
text-align: center;
line-height: 1;
background-color: #ed5103;
color: #fff;
border-radius: 2px;
-moz-border-radius: 2px;
-webkit-border-radius: 2px;
font-size: 12px;
}
.card .card_content .card_content_detail {
width: 100px;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
word-wrap: normal;
display: inline-block;
height:20px;
overflow: hidden;
vertical-align: middle;
font-size: 12px;
}
.card .card_content .card_content_detail{
  height:20px;
}
.card .card_content .card_content_detail img{
 height:100%;
}
.card .card_content .card_content_time {
float: right;
margin-top: 3px;
font-size: 12px;
color: #aaa;
}
.card .card_content .card_content_chat {
font-size: 14px;
color: #969696;
}

/* 未选择聊天 */
.chat_not_pick {
padding-top: 180px;
text-align: center;
}
.chat_not_pick .wx_logo {
display: inline-block;
width: 90px;
height: 90px;
vertical-align: middle;
background: transparent url(../assets/imgs/wx_logo.png) no-repeat 0 0;
}
.chat_not_pick .not_pick_text {
margin-top: 15px;
color: #969696;
}
/* 当前聊天header */
.chat_header {
padding: 10px 0;
margin: 0 15px;
height: 40px;
border-bottom: 1px solid #dcdcdc;
}
.chat_header_items span {
display: inline-block;
margin-right: 10px;
vertical-align: middle;
cursor: default;
}
 .chat_header_name{
    width:60%;
    height:40px;
    position: absolute;
    line-height:40px;
    top:0px;
  }
.chat_header_items .chat_header_icons {
float: right;
}
.chat_header_items .chat_header_icon.transfer {
background: transparent url(../assets/imgs/transfer_g.png) no-repeat 0 0;
}
.chat_header_items .chat_header_icon {
width: 24px;
height: 24px;
cursor: pointer;
}
body{
-webkit-font-smoothing: antialiased;
line-height: 1.6;
}
/* 聊天对话框 */
.chat_body {
height: 495px;
overflow: hidden;
border-bottom: 1px solid #dcdcdc;
/* overflow-y: scroll; */
}
#wrap{
  height: 100%;
  margin-bottom: 0px;
  margin-right: 0px;
}
.chat_body_inner {
padding: 0 15px;
padding-top: 20px;
}
.message_box {
position: relative;
overflow: hidden;
margin-bottom: 15px;
}
.message_box .mssage_box_pic {
float: left;
width: 39px;
height: 39px;
border: 1px solid #f5f5f5;
cursor: pointer;
}
.message_box .message_content_inner {
display: inline-block;
position: relative;
margin: 0 10px;
padding: 8px 15px;
padding-right: 18px;
vertical-align: middle;
word-break: break-all;
cursor: default;
max-width: 420px;
border: 1px solid #dcdcdc;
border-radius: 2px;
-moz-border-radius: 2px;
-webkit-border-radius: 2px;
background-color: #fff;
}
/* @media screen and (-webkit-min-device-pixel-ratio: 0)
.message_box .message_content_inner {
word-break: break-word;
} */
.message_box .message_content_detecting {
position: absolute;
right: 8px;
bottom: 8px;
line-height: 0;
}
.message_content_detecting {
display: none;
}
.message_box .message_content_detecting span {
border-radius: 50%;
display: inline-block;
vertical-align: middle;
height: 3px;
width: 3px;
}
.message_box .message_content_detecting {
position: absolute;
right: 8px;
bottom: 8px;
line-height: 0;
}
.message_box .message_box_time {
margin: 5px 0 20px;
text-align: center;
color: #969696;
font-size: 12px;
}
.message_box.from_self .mssage_box_pic {
float: right;
}
.message_box.from_self .message_content {
text-align: right;
}
.message_box.from_self .message_content_inner {
background-color: #b1e37c;
border-color: #b1e37c;
text-align: left;
text-align: left!important;
color: #000;
padding-right: 15px;
padding-left: 18px;
}
.chat_edit {
position: relative;
}
.chat_edit_items {
height: 40px;
padding: 0 20px;
}
.chat_edit_input {
padding: 5px 20px;
overflow: hidden;
}
.chat_edit_input .edit_area {
margin: 0;
height: 100%;
width: 100%;
border: 0;
font-size: 14px;
white-space: normal;
word-break: break-all;
}
.chat_edit_footer {
height: 30px;
padding: 0 20px;
text-align: right;
color: #bcbcbc;
}
.chat_edit_items .chat_edit_icon.emoji:hover {
background: transparent url(../assets/imgs/emoj_d.png) no-repeat 0 0;
}
.chat_edit_items {
height: 40px;
padding: 0 20px;
}
.chat_edit_items .chat_edit_icons {
display: inline-block;
height: 100%;
vertical-align: middle;
}
.chat_edit_items .chat_edit_icon {
display: inline-block;
margin: 10px 10px 0 0;
width: 24px;
height: 24px;
/* background-color: #ccc; */
vertical-align: middle;
cursor: pointer;
}
.emoji {
background: transparent url(../assets/imgs/emoj_d.png)  no-repeat 0 0;
width: 20px;
height: 20px;
display: -moz-inline-stack;
display: inline-block;
vertical-align: middle;
margin-top: -0.2em;
zoom: 1;
}
pre {
font-family: "Helvetica Neue","Hiragino Sans GB","Microsoft YaHei","\9ED1\4F53",Arial,sans-serif;
}

@media screen and (max-width:768px){
.panel {
    width: 160px;
}
.chat_left {
  margin-left: 160px;
}
.shortcut {
  width: 160px;

}
.card .card_content {
    width: 75px;
}
.chat_edit_input{
  height:55px;
}
.jj-box .el-select{
  width:80px;
}
.chat .chat_body{
height: 135px;
}

}
@media screen and (max-width:768px) and (min-width:500px){

.chat_edit_input{
  height:55px;
}

.chat .chat_body{
height: 135px;
}
#wrap{
  max-height: 300px;
}
#app{
  margin-top:160px;
}
}
@media screen and (max-width:500px){

.chat_edit_input{
  height:55px;
}

.chat .chat_body{
height: 305px;
}
#wrap{
  height: 305px;
}
}
@media screen and (max-width:500px) and (min-width: 350px){

.chat_edit_input{
  height:55px;
}

.chat .chat_body{
height: 295px;
}
#wrap{
  height: 295px;
}

}
@media screen and (min-width:768px){
  .chat_edit_input{
  height:80px;
}
.chat .chat_body{
height: 335px;
}
.jj-box .el-select{
  width:120px;
}

  .panel {
    width: 250px;
}
.chat_left {
  margin-left: 250px;
}
.shortcut {
  width: 250px;
}
.card .card_content{
    width: 155px;
}
}
/* @media screen and (max-height: 760px) and (min-height: 600px){
.chat .chat_body{
height: 335px;
}
}
@media screen and (max-height: 400px) and (min-height: 300px){
.chat .chat_body{
height: 135px;
}
#wrap{
  max-height: 300px;
}
} */
</style>
<style scoped>
.msg_img img{
  width:120px;
}
  .span-div span{height: 22px;line-height: 22px;}
  .list_ul{max-height: 350px;overflow-y: scroll;}
  .msg{height:28px;line-height: 28px;text-overflow : ellipsis;
    white-space : nowrap;
    overflow : hidden; }
  .wait_li{padding:10px 0;border-bottom: 1px solid #f5f5f5;}
  .div_info{margin:0 100px 0 52px;}
  .li_img{width:42px;height:42px;top:50%;transform: translateY(-50%);left:0;}
  .li-btn{right:0;top:50%;transform: translateY(-50%)}
  .li_img img{width:100%;height:100%;border-radius: 50%;}
  .img_span{width:18px;height:18px;top:-2px;right:-2px;border-radius: 50%;background: red;font-size:12px;text-align: center;line-height: 18px;}
  .img_img{width:18px;height:18px;bottom:-2px;right:-2px;color:blue;font-size:12px;text-align: center;line-height: 18px;}
  .setting_panel{padding:0 30px;display: inline-block;}
  .setting_panel:first-child{padding-left:0;}
  .waiting_panel {
    padding-bottom: 15px;
    overflow: hidden;
  }

  .waiting_wrap {
    height: 100%;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    background-color: #fff;
  }
  .waiting_wrap .waiting_inner {
    padding: 30px 40px 0;
  }
  @media screen and (max-width: 600px){
  .waiting_wrap .waiting_inner {
    padding: 30px 10px;
  }
  .setting_panel{
    padding:0 10px;
  }
  .seting_select{
      width: 100px;
  }
  /* .list_ul{
    max-height:60%;
    overflow-y: scroll;
} */

}
  .scroll-wrapper {
    overflow: hidden !important;
    position: relative;
  }
  .wait_list {
    height: 560px;
    overflow: hidden;
  }
  @media screen and (max-height: 760px) and (min-height: 300px){
    .wait_list {
      height: 400px;
    }
  }
  .choose{color:#67c23a;}
  #editor{
      height:100%;
  }
  .tips_p{position:absolute;left:0;top:0;}
</style>


<style scoped>
  /*转接客服*/
  .transfer_popup {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -399px;
    margin-top: -210px;
    width: 736px;
    padding: 20px 30px;
    background-color: #f5f5f5;
    border-radius: 2px;
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
    border: 1px solid #dcdcdc;
    z-index: 20;
  }
  .transfer_chosen {
    max-height: 400px;
  }
  .transfer_header {
    margin-bottom: 15px;
  }
  .transfer_cards {
    overflow: hidden;
    height: 210px;
  }
  .scroll-wrapper>.scroll-content {
    border: none!important;
    box-sizing: content-box!important;
    height: auto;
    left: 0;
    margin: 0;
    max-height: none;
    max-width: none!important;
    /* overflow-y: scroll!important; */
    overflow: auto!important;
    padding: 0;
    position: relative!important;
    top: 0;
    width: auto!important;
  }
  .transfer_card {
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 10px;
    width: 210px;
    background-color: #fff;
    border: 1px solid #dcdcdc;
    cursor: pointer;
  }
  .transfer_btn_wrap {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .transfer_card_img {
    float: left;
  }
  .transfer_card_info {
    margin-left: 60px;
    margin-top: 5px;
  }
  .transfer_card img {
    width: 50px;
    height: 50px;
  }
  .transfer_card.selected {
    position: relative;
    border: 1px solid #09bb07;
  }
  .transfer_card.selected:after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 24px;
    height: 24px;
    background: url(../assets/imgs/emoji.png) 0 -120px no-repeat;
  }
</style>
<style>
  .el-button.is-loading.position-a {
    position: absolute;
  }
  .height100{height:100%;}
  .text_c{text-align:center;}
  .borderN{border:none!important;}
  .padding10{padding:10px;}
  .jj-box .el-checkbox{padding:5px 0;}
</style>
