import Vue from 'vue'
import Vuex from 'vuex'
import people from './modules/people'
import movies from './modules/movies'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    people,
    movies
  },
})
