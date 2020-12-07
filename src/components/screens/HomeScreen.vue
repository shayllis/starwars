<template>
  <div>
    <b-container class="py-30">
      <b-row>
        <b-col cols="12" md="4">
          <b-card class="border-top-1 mb-3">
            <b-form v-on:submit.prevent="sendForm">
              <b-form-group>
                <label class="font-weight-600 mb-0">What are you searching for?</label>
              </b-form-group>

              <b-form-group class="font-weight-600">
                <b-form-radio-group id="radio-group-2" v-model="category" name="category" :options="options">
                </b-form-radio-group>
              </b-form-group>

              <b-form-group class="mb-3">
                <b-form-input
                  class="mb-1"
                  type="text"
                  v-model="query"
                  id="q"
                  :placeholder="placeholder">
                </b-form-input>
              </b-form-group>
              <b-button v-bind="sendButton" class="font-weight-bold text-white" type="submit" block>{{ sendButton.text }}</b-button>
            </b-form>
          </b-card>
        </b-col>

        <b-col cols="12" md="8">
          <b-card id="results">
            <h5 class="font-weight-bold border-1 pb-2">Results</h5>
            <b-list-group class="rounded-0">
              <b-list-group-item class="border-left-0 px-0 border-1 border-bottom-0 border-right-0" v-for="item in this[category]" :key="item.id">
                <b-row class="justify-content-between">
                  <b-col align-self="center">
                    <span class="h6 font-weight-bold">{{ item.name || item.title }}</span>
                  </b-col>
                  <b-col class="text-right">
                    <b-link class="btn btn-primary font-weight-bold" href="//detalhes">SEE DETAILS</b-link>
                  </b-col>
                </b-row>
              </b-list-group-item>
            </b-list-group>

            <b-row id="status-line" class="border-1 border-top" v-if="$vueLoading.anyLoading || !this[category].length">
              <b-col class="text-secondary font-weight-bold text-center" align-self="center">
                <p v-if="$vueLoading.anyLoading">
                  Searching...
                </p>
                <p v-else>
                  There are zero matches.<br>
                  Use the form to search for People or Movies.
                </p>
              </b-col>
            </b-row>
            <p class="text-secondary text-center font-weight-bold">
            </p>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import statistics from '../../utils/statistics.js'

export default {
  name: 'Home',
  computed: {
    placeholder: function () {
      const option = this.options.filter(o => {return o.value == this.category})[0];
      return option.placeholder;
    },
    sendButton: function () {
      if (this.$vueLoading.anyLoading) {
        return {
          variant: 'primary',
          disabled: true,
          text: 'SEARCHING...'
        };
      }

      return this.query && this.query.length ? {
          variant: 'primary',
          text: 'SEARCH'
        } :
        {
          variant: 'secondary',
          disabled: true,
          text: 'SEARCH'
        };
    },
    loadingStatus () {
      return this.$store[this.category]
    },
    ...mapState('people', ['people']),
    ...mapState('movies', ['movies']),
  },
  created () {
    this.search();
  },
  data() {
    return {
      category: this.$route.query.category || 'people',
      query: this.$route.query.q || '',
      options: [
        { text: 'People', value: 'people', placeholder: 'e.g. Chewbacca, Yoda, Boba Fett' },
        { text: 'Movies', value: 'movies', placeholder: 'e.g. The Phantom Menace, The Clone Wars, The Jedi Return' },
      ]
    }
  },
  methods: {
    sendForm: function () {
      this.$router.push({ path: '/', query: { category: this.category, q: this.query }})
        .catch(()=>{});
      this.search();
    },
    search: async function () {
      if (!this.query || !this.category)
        return ;

      this.$vueLoading.startLoading();
      await this.$store.dispatch(`${this.category}/getAll`, {query: this.query});
      statistics.event('search', this.category, {q: this.query});

      this.$vueLoading.endLoading();
    },
  },
}
</script>
