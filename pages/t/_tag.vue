<template>
  <div>
    <div v-if="jokes">
      <h2>
        #{{ tag }}<br />
        <small>{{ tag_info.description }}</small>
        <br />
        <small class="text-muted"
          >يوجد بالموقع {{ tag_info.jokes }} نكتة تحت تصنيف #{{ tag }}</small
        >
      </h2>
      <hr />
      <section class="jokes tags" v-if="jokes.length">
        <joke-block
          v-for="(joke, i) in jokes"
          :key="joke.id"
          v-observe-visibility="i === jokes.length - 1 ? lazyLoadJokes : false"
          :joke="joke"
        />
      </section>
      <section v-else>
        <b-alert variant="warning" show><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> جاري سحب النكت..</b-alert>
      </section>
    </div>
    <div v-else>Error: No Jokes Found</div>
  </div>
</template>

<script>
import JokeBlock from "~/components/blocks/JokeBlock.vue";
export default {
  components: {
    JokeBlock,
  },
  data() {
    return {
      tag: this.$route.params.tag,
      tag_info: {
          description: " ",
          jokes: 99999,
      },
      jokes: [],
      current_page: 1,
      jokes_retreived: 0,
    };
  },

  head() {
    return {
      title: "#" + this.tag + " | " + this.tag_info.description,
      meta: [
        {
          hid: "description",name: "description",content: this.tag_info.description,
        },
        {
          name: "keywords",content: this.tag_info.description.split(" ").join(", ").concat(", " + this.tag),
        },
      ],
    };
  },
  mounted() {},
  async fetch() {
    const joke_data = await this.$axios.$get(encodeURI(`/jokes?tags.slug=${this.$route.params.tag}&_start=${this.jokes_retreived}`));
    this.jokes = this.jokes.concat(joke_data);
    this.jokes_retreived += joke_data.length;

    const tag_data = await this.$axios.$get(encodeURI(`/tags?slug=${this.$route.params.tag}`));
    this.tag_info = tag_data[0];
  },

  methods: {
    lazyLoadJokes(isVisible) {
      console.log("lazy load fired");
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