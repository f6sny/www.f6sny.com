<template>
    <b-nav-item href="#" class="text-white" v-b-modal.userModal><span v-if="isAuthenticated" >
    هلا {{ loggedInUser.username }}</span> <i class="fa fa-user fa-lg"></i>
    </b-nav-item>
</template>
<script>
import { mapGetters } from "vuex";
import NotLoggedIn from "@/components/Navbar/NotLoggedIn"
import LoggedIn from "@/components/Navbar/LoggedIn"

export default {
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
  },
};
</script>
