<template>
    <div class="upload-btn"  :value="value" :style="{backgroundImage:'url('+ file +')'}">
      <input type="file" class="file-input" :name="feildName" @change="fileChange"/>
    </div>
    <!-- <div>
    <img class="upload-btn"  :src="file" />
      <input type="file" class="file-input" name="imgFile" @change="fileChange"/>
    </div> -->
    
</template>

<script>
import Vue from 'vue'
import router from '../../router'
import uploader from '../../utils/upload'

export default {
  name: "UploadFile",
  props: ['value'],
  data() {
    return {
      feildName: Date.now() + '' + parseInt(Math.random() * 100000),
      file:require(""),
    };
  },
  watch:{
    value(val){
      this.file = val;
    },
    file(val){
      this.$emit('input', val);
    }
  },
  mounted() {
    if (this.value) {
      this.file = this.value;
    }
  },
  methods: {
   fileChange: function(val){
     uploader.uploadToOss((val)=>{
       this.file = val.data.url;
     }, this.feildName)
   }
  },

};
</script>

<style scoped>

.upload-btn{
  display: inline-block;
  margin-right:16px;
  width: 94px;
  height: 60px;
  padding: 0;
  margin: 0;
  overflow:hidden;
  background-size: 100% 100%;
  cursor: pointer;
}

.file-input{
  top:0;
  margin: 0;
  padding: 0;
  width: 94px;
  height: 60px;
  background: #fff;
  opacity: 0;
  border:1px solid red;
}


</style>
