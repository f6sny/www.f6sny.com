<template>
  <div>
    <Header />
    <section id="main" class="bg-secondary" style="--bs-bg-opacity: .01;">
      <div class="container">
        <div class="row">
          <div class="col col-md-9 py-3">
            <Nuxt keep-alive />
          </div>
          <div class="col col-md-3">
            <Sidebar />
            <Footer />
          </div>
        </div>
      </div>
    </section>
    <NavbarNewJokeModal />
    <NavbarNotLoggedIn v-if="!isAuthenticated" />
    <NavbarLoggedIn v-if="isAuthenticated" />
  </div>
</template>

<style>

</style>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
      ...mapGetters(["isAuthenticated", "loggedInUser"]),
    tags () {
      return this.$store.state.tags;
    },
    counters () {
      return this.$store.state.counters;
    }
  },
  head() {
    return {
      title: 'إضحك لين تفطس',
    }
  },
}
</script>