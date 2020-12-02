<template>
  <b-modal id="userModal">
      <template #modal-title>يا هلا</template>
      <template #modal-footer>
        <b-button type="submit" id="logout_button" variant="danger"  @click.stop.prevent="logout">تسجيل خروج</b-button>
      </template>

        <div class="modal-body">
          <ul>
              <li><b-link href="#">الملف الشخصي</b-link></li>
              <li><b-link href="#">تغيير كلمة المرور</b-link></li>
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
  },
};
</script>
