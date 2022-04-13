import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      countUpOptions: {
        useEasing: true,
        useGrouping: false,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: '',
        duration: 1.5,
      },
    }
  },
  mutations: {},
})

export default store
