<template>
  <div>
    <div v-if="results">
      <h2>بحث عن "{{ this.search_word }}"</h2>
      <hr />
      <section class="jokes search_results" v-if="results.length">
        <joke-block
          v-for="(joke, i) in results"
          :key="joke.id"
          v-observe-visibility="
            i === results.length - 1 ? lazyLoadJokes : false
          "
          :joke="joke"
        />
      </section>
      <section v-else-if="results.length == 0">
        <b-alert show variant="danger">لم يتم إيجاد شي يطابق بحثك..</b-alert>
      </section>
      <section v-else>
        <h5>جاري سحب النكت..</h5>
      </section>
    </div>
    <div v-else>Error: No results Found</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search_word: this.$route.params.search,
      results: [],
      current_page: 1,
      results_retreived: 0,
    };
  },
  async fetch() {
    const data = await this.$f6snyApi.searchJokesByKeywords(
      this.search_word,
      this.results_retreived
    );
    this.results = this.results.concat(data);
    this.results_retreived += data.length;
  },

  head() {
    return {
      title: "نتائج بحث عن " + this.search_word,
      meta: [
        {
          hid: "description",name: "description",content: "نتائج بحث عن " + this.search_word,
        },
        {
          name: "robots",content: 'noindex',
        },
      ],
    };
  },

  methods: {
    lazyLoadJokes(isVisible) {
      if (isVisible) {
        if (this.current_page < 10) {
          this.current_page++;
          this.$fetch();
        }
      }
    },
  },
};
</script>

<style>
</style>