import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import Header from '@/common/Header'

import Login from '@/pages/Login'

// import PendingAccess from '@/pages/PendingAccess'

import Conversation from '@/pages/Conversation'

import Setting from '@/pages/Setting'

Vue.use(Vuex)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'index',
      component: Header,
      children: [
        {
          path: '/index',
          name: 'Conversation',
          component: Conversation
        }
      ]
    }
  ]
})
