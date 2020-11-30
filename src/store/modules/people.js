import axios from 'axios';

const people  = {
  namespaced: true,
  state: {
    total: 0,
    next: null,
    previous: null,
    people: []
  },
  mutations: {
    setPeople(state, data) {
      state.total = data.count;
      state.people = data.results;
      state.next = data.next;
      state.previous = data.previous;
    }
  },
  actions: {
    async getAll ({ commit }, { query }) {
      let res = await axios.get('https://swapi.dev/api/people/', {
          params: {search : query || ''}
        });
      commit('setPeople', res.data);
    }
  }
}

export default people;
