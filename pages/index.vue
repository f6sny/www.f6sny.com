<template>
  <div>
    <h2>كل النكت</h2>
    <hr />
    <section class="jokes" v-if="jokes.length">
      <blocks-joke-block v-for="(joke, i) in jokes" :key="`joke-${joke.id}`" v-observe-visibility="i === jokes.length - 1 ? lazyLoadJokes : false" :joke="joke" v-bind:is_homepage="true" />
    </section>
    <section v-else>
      <h5>جاري سحب النكت..</h5>
    </section>
  </div>
</template>

<script>
export default {

  data() {
    return {
      jokes: [],
      current_page: 1,
      jokes_retreived:0,
    };
  },
 
  async fetch() {
    const data = await this.$f6snypi.jokes().getJokes(((this.jokes_retreived)? this.jokes_retreived + 1 : this.jokes_retreived));
      this.jokes = this.jokes.concat(data);
      console.log(`Got ${data.length} jokes, adding to ${this.jokes_retreived} total should be ${data.length + this.jokes_retreived}`)
      this.jokes_retreived += data.length;
  },

  methods: {
    lazyLoadJokes(isVisible) {
      if (isVisible) {
        if (this.current_page < 10) {
          this.current_page++
          this.$fetch()
        }
      }
    }
  }
};
</script>
