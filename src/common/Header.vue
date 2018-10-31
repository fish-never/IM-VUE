<template>
  <div class="main_content">
      <div class="main_header">
        <div class="tab">
          <div :class="tabNum==0?'tab_item float_l tab_choose':'tab_item float_l'" @click="tabChoose(0)">
            会话
             <span v-if="totalUnreadNum>0">({{totalUnreadNum}})</span>
          </div>
          <div  :class="tabNum==1?'tab_item float_l tab_choose':'tab_item float_l'" @click="tabChoose(1)">
            待接入<span v-if="num>0">({{num}})</span>
          </div>
          <div  :class="tabNum==2?'tab_item float_l tab_choose':'tab_item float_l'" @click="tabChoose(2)"
                v-if="root==1 && disable==0">
           <i class="el-icon-setting fontsize20"></i>
          </div>
        </div>
        <div class="state" @click="showToggle">
          <span class="state_icon online" v-show="stateNum===1"></span>
          <span class="state_icon leave" v-show="stateNum===0"></span>
          <span class="state_set">{{nickname}}</span>
        </div>
         <div class="quite" @click="quit()">
           <span>退出</span>
        </div>

        <div class="state_box" v-show="stateChangeNum">
          <ul>
            <li class="state_li" @click="changeState(1)">
              <span class="state_icon online"></span>
              <span>在线</span>
            </li>
            <li class="state_li" @click="changeState(0)">
              <span class="state_icon leave"></span>
              <span>离开</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="main_body">
          <router-view @gotoCon="gotoCon"  @shownum="numShow"  @tabNum="changetabNum" :numPp="num" :tabNum="tabNum" @msgTotal="msgTotal"  :onlineStatua="stateNum" @showjj="Showjjf"/>
      </div>
  </div>

</template>

<script>

  import commentService from "../service/comment";
  import $ from 'jquery';

  window.$ = $;
  window.onbeforeunload=function (){
    alert("===onbeforeunload===");
    if(event.clientX>document.body.clientWidth && event.clientY < 0 || event.altKey){
      alert("你关闭了浏览器");
    }else{
      alert("你正在刷新页面");
    }
  }

  export default {
  name: 'index',
  data () {
    return {
      tabNum:0,
      stateChangeNum:false,
      stateNum:0,
      num:0,
      total:7,
      nickname:"",
      totalUnreadNum: 0,
      root:"",
      disable:"",
      origin_id:'',
      page:1,
      pageSize:5,
      totalWaittingList:[]//总的待接入列表
    }
  },
    computed: {
      count () {
        return this.$store.state.count
      }
    },
  created(){
    var num = localStorage.getItem('totalUnreadNum');
    if(isNaN(num)){
      this.totalUnreadNum = 0;
    }else{
      this.totalUnreadNum = num;
    }
    let body = document.querySelector('body')
    body.addEventListener('click',(e)=>{
      if( e.target.className === 'state_box'||e.target.className === 'state_set'){
        //this.stateChangeNum = true;

      }else {
        this.stateChangeNum = false
      }

    },false)

    this.root = localStorage.getItem("root")
    this.disable = localStorage.getItem("disable")
    this.nickname = localStorage.getItem('nickname');
    this.stateNum=parseInt(localStorage.getItem("stateNum"))
    this.origin_id=localStorage.getItem("origin_id");
    if(this.$route.path.indexOf('Setting')>-1){
      this.tabNum = 2
    }
    this.proList=JSON.parse(localStorage.getItem("product_list"))
    //获取初始待接入人数
    var that=this
    $.each(that.proList,function(index,item){
      const params = {
        origin_id: item.origin_id,
        page: that.page,
        pageSize: that.pageSize,
      };
      //const loadingInstance = this.$loading({ fullscreen: true });
      commentService.getWaitingList(params).then(data => {
        if (data.code == 0) {
          const rdata =data.data;
          that.num += parseInt(rdata.total);
          if(rdata.list.length>0){
            that.totalWaittingList=that.totalWaittingList.concat(rdata.list)
          }
          localStorage.setItem("totalWaittingList", JSON.stringify(that.totalWaittingList))
          localStorage.setItem("forWsWaittingPp", that.num)
        }
      });
    })

  },
  watch:{
  },
  mounted(){
    var that= this

  },
  methods:{
      quit() {
        var vm = this;
        this.$confirm('确定退出？', '消息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(() => {
            localStorage.setItem("stateNum",0)
            vm.logout()
          })
          .catch(action => {

          });
      },
    gotoCon(){//接入进入会话
      this.tabNum=0//tab切换到会话
      //todo,会话数+1
    },
    //待接入人数
    numShow(num){
      this.num=num
    },
    //从待接入切到会话
    changetabNum(num){
      this.tabNum=num
    },
    Showjjf(num){
        this.stateNum=num
      localStorage.setItem("stateNum",num)
    },
    msgTotal(num){
      this.totalUnreadNum = num
    },
    //切换tab
    tabChoose:function(num){
      var vm=this
      this.tabNum=num
      if(num===0){
        vm.$router.push( '/index' )

      }else if(num===1){
        vm.$router.push( '/index' )
        //vm.$router.push('PendingAccess')
      }else if(num===2){
        vm.$router.push('Setting')
      }
    },
    //状态设置框
    showToggle:function(){
      this.stateChangeNum=!this.stateChangeNum
    },
    //切换状态
    changeState:function(num){
      this.stateNum=num
      localStorage.setItem("stateNum",num)
      this.stateChangeNum=false
    },
    //注销接口logout
      logout(){
      commentService.logout().then(data => {
        if (data.code == 0) {
           this.$router.push( '/' )
        }
      });
    },
    // custim/login/logout

  },

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .state_box {
    position: absolute;
    right: 70px;
    top: 50px;
    padding: 10px;
    width: 80px;
    background-color: #fff;
    border: 1px solid #dcdcdc;
    border-radius: 2px;
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
    z-index: 10;
  }
  .state_li {
    position: relative;
    padding: 5px 5px;
    cursor: pointer;
  }
  .state .state_icon {
    margin-top: -2px;
    margin-right: 5px;
  }
  .state_icon.leave {
    display: inline-block;
    border: 2px solid #ed510e;
    width:11px;
    height: 11px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    vertical-align: middle;
  }
  .state_icon.online {
    display: inline-block;
    border: 2px solid #09bb07;
    width:11px;
    height: 11px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    vertical-align: middle;
  }
  .state .state_set:after {
    content: '';
    margin-left: 8px;
    margin-bottom: 9px;
    display: inline-block;
    width: 7px;
    height: 7px;
    vertical-align: middle;
    border: 1px solid #fff;
    border-top: 0;
    border-left: 0;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .state {
    position: absolute;
    padding: 10px 20px;
    right: 53px;
    top: 11px;
    color: #fff;
    cursor: pointer;
  }
  .quite{
    position: absolute;
    padding: 10px 5px;
    right: 10px;
    top: 9px;
    color: #fff;
    cursor: pointer;
  }
  .fontsize20{font-size:20px;line-height:60px;}
  .tab {
    overflow: hidden;
    line-height: 60px;
    height:60px;
  }
  .tab .tab_item {
    overflow: hidden;
    padding: 0 17px;
    text-align: center;
    color: #fff;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
  }
  .tab .tab_choose {
    background-color: #000;
    color: #09bb07;
  }
</style>
<style>
html{
  overflow: hidden;
}
 .main_content {
    position: relative;
    max-width: 950px;
    min-width: 820px;
    max-height: 760px;
    margin: 0 auto;
    overflow: hidden;
    border-top-left-radius: 5px;
    -moz-border-radius-topleft: 5px;
    -webkit-border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    -moz-border-radius-topright: 5px;
    -webkit-border-top-right-radius: 5px;
}
 .main_body {
   height: 700px;
 }
.main_header {
    height: 60px;
    background-color: #42494b;
}
 @media screen and (max-height:400px) {
  .main_body {
      height: 300px;
  }
      .main_content {
    position: relative;
    width:100%;
    height:100%;
    max-width: 100%;
    min-width: 100%;
    max-height: 100%;
}
}
@media screen and (max-height:700px) {
.main_body {
    height: 450px;
}
    .main_content {
    position: relative;
    width:100%;
    height:100%;
    max-width: 100%;
    min-width: 100%;
    max-height: 100%;
}
}

 @media screen and (max-height: 760px) and (min-height: 670px){
   .main_body {
     height: 480px;
   }
   .chat .chat_body{
      height: 335px;
   }
 }
  @media screen and (min-height: 667px){
   .main_body {
     height: 580px;
   }
   .chat .chat_body{
      height: 435px;
   }
 }
  .float_r{float:right;}
 .float_l{float:left;}
 .position-a{position:absolute;}
  .position-r{position:relative;}
  .overflow-h{overflow:hidden;}
  .fontweight_b{font-weight: bold;}
  .color333{color:#333;}
 .color666{color:#666;}
 .color999{color:#999;}
 .colorfff{color:#fff;}
  .margin_r10{margin-right: 10px;}
  .displayN{display:none!important;}
  .displayB{display:block!important;}
</style>
