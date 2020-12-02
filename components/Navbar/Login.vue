<template>
  <li class="nav-item">
    <b-button href="#" variant="link text-decoration-none text-white" v-b-modal.userModal><span v-if="isAuthenticated">
      هلا {{ loggedInUser.username }}</span> <i class="fa fa-user fa-lg"></i>
    </b-button>

    <NotLoggedIn v-if="!isAuthenticated" />
    <LoggedIn v-if="isAuthenticated" />
  </li>
</template>
<script>
import { mapGetters } from "vuex";
import NotLoggedIn from "@/components/Navbar/NotLoggedIn"
import LoggedIn from "@/components/Navbar/LoggedIn"

export default {
  components: {
    NotLoggedIn,
    LoggedIn
  },

  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
  },
};
</script>
