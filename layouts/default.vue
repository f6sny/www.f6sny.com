<template>
  <div>
    <Header />
    <b-container>
      <b-row>
        <b-col md="8" class="py-3"><Nuxt keep-alive /></b-col>
        <b-col md="4">
          <Sidebar />
          <Footer />
        </b-col>
      </b-row>

        <NewJokeModal />
        <NotLoggedIn v-if="!isAuthenticated" />
        <LoggedIn v-if="isAuthenticated" />
    </b-container>
    
  </div>
</template>

<style>

</style>
<script>
import { mapGetters } from "vuex";
import NotLoggedIn from "@/components/Navbar/NotLoggedIn"
import LoggedIn from "@/components/Navbar/LoggedIn"
import NewJokeModal from '@/components/Navbar/NewJokeModal';

export default {
    components: {
    NewJokeModal,
    NotLoggedIn,
    LoggedIn
  },
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