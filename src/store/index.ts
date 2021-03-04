import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist'
import { getModule } from 'vuex-module-decorators'
import { ChatModule } from '@/store/chatModule'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})

const store = new Vuex.Store({
    modules: {
        chatModule: ChatModule
    },
    plugins: [vuexLocal.plugin],
    strict: debug
})

export default store

export const chatModule = getModule(ChatModule, store)