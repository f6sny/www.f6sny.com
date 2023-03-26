<template>
  <div>
    <div v-if="jokes">
      <h1 class="h2">
        #{{ tag }}<br />
        <small>{{ tag_info.description }}</small>
        <br />
        <small class="text-muted">عندنا {{ tag_info.jokes }} نكتة تحت تصنيف #{{ tag }}</small>
      </h1>
      <hr />
      <section class="jokes tags" v-if="jokes.length">
        <blocks-joke-block v-for="(joke, i) in jokes" :key="joke.id" v-observe-visibility="i === jokes.length - 1 ? lazyLoadJokes : false" :joke="joke"/>
      </section>
      <section v-else>
        <b-alert variant="warning" show><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> جاري سحب النكت..</b-alert>
      </section>
    </div>
    <div v-else>Error: No Jokes Found</div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      tag: this.$route.params.tag,
      tag_info: {
          description: " ",
          jokes: "----",
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
          name: "robots",content: 'noindex',
        },
        {
          name: "keywords",content: this.tag_info.description.split(" ").join(", ").concat(", " + this.tag),
        },
      ],
    };
  },
  mounted() {},
  async fetch() {
    await this.getJokes();
    await this.getTag();
  },

  methods: {
      async getJokes(){
        const joke_data = await this.$f6snyApi.getTagJokesBySlug(this.$route.params.tag, this.jokes_retreived) 
        this.jokes = this.jokes.concat(joke_data);
        this.jokes_retreived += joke_data.length;
      },
      async getTag(){
        const tag_data = await this.$f6snyApi.getTagBySlug(this.$route.params.tag);
        this.tag_info = tag_data[0];
      },
    lazyLoadJokes(isVisible) {
      console.log("lazy load fired");
      if (isVisible) {
        if (this.current_page < 10) {
          this.current_page++;
          this.getJokes();
        }
      }
    },
  },
};
</script>

<style>
</style>