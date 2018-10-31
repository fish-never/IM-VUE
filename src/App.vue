<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss" >
 body{
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: url(../src/assets/imgs/bg.png) no-repeat 50% 50%;
    background-size: cover;
 }
@import './sass/style.scss';

</style>
