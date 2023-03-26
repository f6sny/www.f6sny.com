<template>
  <div>
    <Header />
    <div class="container">
      <div class="row">
        <div class="col col-md-8 py-3">
          <Nuxt keep-alive />
        </div>
        <div class="col col-md-4">
          <Sidebar />
          <Footer />
        </div>
      </div>

        <NavbarNewJokeModal />
        <NavbarNotLoggedIn v-if="!isAuthenticated" />
        <NavbarLoggedIn v-if="isAuthenticated" />
      </div>
    
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