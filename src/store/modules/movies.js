import axios from 'axios';

const movies  = {
  namespaced: true,
  state: {
    total: 0,
    next: null,
    previous: null,
    movies: []
  },
  mutations: {
    setMovies(state, data) {
      state.total = data.count;
      state.movies = data.results;
      state.next = data.next;
      state.previous = data.previous;
    }
  },
  actions: {
    async getAll ({ commit }, { query }) {
      let res = await axios.get('https://swapi.dev/api/films/', {
          params: {search : query || ''}
        });
        
      commit('setMovies', res.data);
    }
  }
}

export default movies;
