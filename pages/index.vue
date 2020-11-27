<template>
  <div>
    <h2>كل النكت</h2>
    <hr />
    <section class="jokes" v-if="jokes.length">
      <joke-block v-for="(joke, i) in jokes" :key="joke.id" v-observe-visibility="i === jokes.length - 1 ? lazyLoadJokes : false" :joke="joke" />
    </section>
    <section v-else>
      <h5>جاري سحب النكت..</h5>
    </section>
  </div>
</template>

<script>
import JokeBlock from '~/components/blocks/JokeBlock.vue';
export default {
  components: {
    JokeBlock,
  },
  data() {
    return {
      jokes: [],
      current_page: 1,
      jokes_retreived:0,
    };
  },
 
  async fetch() {
    const data = await this.$axios.$get(`http://localhost:8080/jokes?_start=${this.jokes_retreived}`)
      this.jokes = this.jokes.concat(data);
      this.jokes_retreived += data.length;
  },

  methods: {
    lazyLoadJokes(isVisible) {
      console.log('lazy load fired')
      if (isVisible) {
        if (this.current_page < 10) {
          this.current_page++
          this.$fetch()
        }
      }
    }
  }

};</script>

<style>

</style>
