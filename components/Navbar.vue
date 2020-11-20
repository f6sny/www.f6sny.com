<template>
  <div>
    <div class="rainbow"></div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-xl">
        <a class="navbar-brand" href="/"></a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item">
              <b-button
                href="#"
                variant="link text-decoration-none nav-link text-white"
                v-b-modal.jokeModal
                >جديد</b-button
              >
            </li>
            <!-- Add Jokes Modal -->
            <NewJoke />

            <li class="nav-item">
              <b-link to="moderate" class="nav-link text-white">مراقبة <b-badge v-if="counters" pill variant="danger">{{ counters.pending }}</b-badge></b-link>
            </li>

            <b-nav-item-dropdown right text="تصنيفات" v-if="tags">
              <b-dropdown-item
                href="#"
                v-bind:key="tag.id"
                v-for="tag in tags"
                :style="`color: ${tag.fore_color}`"
                >{{ `#${tag.name}` }}</b-dropdown-item
              >
            </b-nav-item-dropdown>

            <li class="nav-item">
              <b-button
                href="#"
                variant="link text-decoration-none text-white"
                v-b-modal.userModal
                ><i class="fa fa-user fa-lg"></i
              ></b-button>
            </li>
            <Login />
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  props: ['counters'],
  data() {
    return {
      tags: []
    };
  },
  mounted() {
    this.fetchSomething();
  },
  methods: {
    async fetchSomething() {
      const data = await this.$axios.$get('http://localhost:8080/tags')
      this.tags = data;
    }
  }
};
</script>

<style>

</style>