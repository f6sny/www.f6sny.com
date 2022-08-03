<template>
  <div>
    <section class="jokes" v-if="joke">
      <joke-block :key="joke.id" :joke="joke" />
    </section>
    <section v-else-if="joke == {}">
      <b-alert show variant="danger"
        >مافيه نكتة كذا عندنا، إذا تعرفها بالله علمنا عنها..</b-alert
      >
    </section>
    <section v-else>
      <b-alert variant="warning" show>ماحصلنا النكتة</b-alert>
    </section>

    <section id="comments">
      <h4 class="mt-5">التعليقات</h4>

      <comment-form-block :joke="joke" />

      <div class="comments-loop" v-if="comments.length">
        <comment-block
          :key="comment.id"
          :comment="comment"
          v-for="comment in comments"
        />
      </div>

      <div class="comments-loop mb-5" v-else-if="comments.length == 0">
        <b-alert show variant="danger">مافيه تعليقات، اكتب اول تعليق..</b-alert>
      </div>

      <div v-else><h5>جاري سحب التعليقات..</h5></div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      slug: this.$route.params.slug,
      joke: null,
      comments: [],
    };
  },

  async fetch() {
    await this.get_joke();
    await this.get_comments();
  },
  head() {
    return {
      title: this.shorten(this.$route.params.slug, 46, " "),
      meta: [{ hid: "description",name: "description",content: this.joke.content,},],
    };
  },
  methods: {
    shorten(str, maxLen, separator = " ") {
      if (str.length <= maxLen) return str;
      return str.substr(0, str.lastIndexOf(separator, maxLen));
    },

    async get_joke() {
      const data = await this.$f6snyApi.getJokeBySlug(this.slug);
      this.joke = data[0];
      //console.log(this.joke);
    },
    async get_comments() {
      // we have to add get comments here.
      const data2 = await this.$f6snyApi.getComments(this.joke.id);
      this.comments = data2.sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        }
        if (b.id > a.id) {
          return 1;
        }
        return 0;
      });
      console.log(data2);
    },
  },
};
</script>