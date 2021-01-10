<template>
  <b-modal ref="userModal" id="userModal">
      <template #modal-title>يا هلا</template>
      <template #modal-footer>
        <b-button type="submit" id="logout_button" variant="danger"  @click.stop.prevent="logout">تسجيل خروج</b-button>
      </template>

        <div class="modal-body">
          <ul>
              <li><b-link :to="`/u/profile`" @click="toggleModal">الملف الشخصي</b-link></li>
              <li><b-link :to="`/u/change-password`" @click="toggleModal">تغيير كلمة المرور</b-link></li>
          </ul>
        </div>
    </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
export default {

  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
  },
  mounted() {},
  methods: {
    async logout() {
      await this.$auth.logout()
    },
    toggleModal() {
        // We pass the ID of the button that we want to return focus to
        // when the modal has hidden
        this.$refs['userModal'].toggle()
      }
  },
};
</script>
