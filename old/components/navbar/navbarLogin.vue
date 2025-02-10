<template>
    <li class="nav-item">
      <a class="nav-link" aria-current="page" href="#userModal" data-bs-toggle="modal">
        <span v-if="isAuthenticated" >هلا {{ loggedInUser.username }}</span>
        <span v-else >تسجيل دخول</span>
      </a>
    </li>     
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
  },
};
</script>
