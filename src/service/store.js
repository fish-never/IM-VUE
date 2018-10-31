import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
  name: 'store',
  state: {
    count: 1
  }
})
