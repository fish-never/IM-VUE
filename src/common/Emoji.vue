<template>
    <div>
        <!-- <article id="form_article" contenteditable="true" onkeydown="myInput.listen(this, event);"></article> -->
    <div class="page_emotion box_swipe" id="page_emotion">
     <div class="qq_body" style="display:block;">
        <a href="#" class="face_wrap qq_wrap" v-for="(item,index) in emojis" :key="index">
            <img @click="addEmoji(index)" class="emoji-icon" :src="'https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/'+ index + '.gif'"/>
        </a>
        </div>
        </div> 
    </div>
  
</template>
<script>
import commentService from "../service/comment";
import emojiUtil from "../utils/emoji";
export default {
  name: 'Emoji',
  data(){
      return {
        emojis: emojiUtil.list,
    }
  },
  created(){

  },
  mounted(){
      
  },
  methods:{
      addEmoji(index){
          this.$emit("onEmojiClick",index)
      }

  }
}
</script>


<style scoped>
.page_emotion{
    width: 530px;
    display: block;
    height: 230px;
    border: 1px solid#d9d9d9;
    position: absolute;
    bottom: 170px;
    left: 270px;
    z-index: 9999;
    background: #fff;
    padding: 8px;
}
.page_emotion dd{
	display: inline-block;
	float:left;
	width:14.2%;
	height:24px;
	margin:5px 0;
	text-align:center;
}
.list_emotion *[data-key]{
	color:transparent;
	display: block;
	width:24px;
	height:24px;
	margin: auto;
	/* background:url(../assets/imgs/default.gif) no-repeat 0 0; */
	-webkit-background-size:auto 24px;
}
.list_emotion *.del{
	/* background-image:url(../assets/imgs/del.png); */
}
.nav_emotion{
	padding:10px 0;
	text-align: center;
}
.nav_emotion span{
	display: inline-block;
	width:8px;
	height:8px;
	border-radius:10px;
	background: #ebebeb;
	margin:0 5px;
}
.nav_emotion span.on{
	background-color:#bbb;
}
.face_wrap{
    padding:4px;
}
</style>

