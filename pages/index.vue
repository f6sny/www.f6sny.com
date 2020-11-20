<template>
  <div>
    <h2>كل النكت</h2>
    <hr />
    <section class="jokes" v-if="jokes.length">
      <article
        class="p-md-3 p-1 mb-2"
        v-bind:key="joke.id"
        v-for="joke in jokes"
      >
        <b-row>
          <b-col cols="1" class="pl-0">
            <div v-if="joke.author">
              <b-img
                src="https://placehold.co/50"
                fluid-grow
                right
                alt="..."
                rounded="circle"
              ></b-img>
            </div>
            <div v-else>
              <b-img
                src="https://placehold.co/50"
                fluid-grow
                right
                alt="..."
                rounded="circle"
              ></b-img>
            </div>
          </b-col>
          <b-col cols="11">
            <header class="mb-2">
              <div class="float-left small">
                <i class="far fa-chevron-down"></i>
              </div>
              <p class="p-0 m-0 small text-muted">
                <time class=" pl-2" :datetime="joke.updated_at"
                  >منذ خمس دقائق</time
                >
                <strong><a href="#">بواسطة مطحس </a></strong>
              </p>
            </header>
            <section class="">
              <p class="p-0 m-0">{{ `${joke.content}` }}</p>
              <footer class="mb-3">
                <ul class="list-inline p-0 m-0 small" v-if="joke.tags.length">
                  <li
                    v-bind:key="tag.id"
                    v-for="tag in joke.tags"
                    class="list-inline-item"
                  >
                    <a href="#">#{{ `${tag.name}` }}</a>
                  </li>
                </ul>
              </footer>
            </section>
            <footer class="">
              <ul
                class="list-inline p-0 m-0 col-12 text-muted small row text-center"
              >
                <li class="list-inline-item col">
                  <i class="fal fa-comment"></i>
                </li>
                <li class="list-inline-item col">
                  <i class="far fa-heart"></i>
                </li>
                <li class="list-inline-item col">
                  <i class="fal fa-flag-alt"></i>
                </li>
              </ul>
            </footer>
          </b-col>
        </b-row>
      </article>
    </section>
    <section v-else>
      <h5>Fetching jokes . . .</h5>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jokes: [],
      page: 1,
      jokes_retreived:0,
    };
  },
  mounted() {
    this.fetchSomething();
  },
  methods: {
  async fetchSomething() {
    const data = await this.$axios.$get('http://localhost:8080/jokes')
    this.jokes = data;
    this.jokes_retreived += data.length;
  }
}


};</script>

<style>

</style>
