<template>
    <b-nav-item href="#" class="text-white" v-b-modal.userModal>
        <span v-if="isAuthenticated" > هلا {{ loggedInUser.username }}</span> <i class="fa fa-user fa-lg"></i>
    </b-nav-item>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
  },
};
</script>
