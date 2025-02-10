<template>

  <div ref="userModal" class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="userModalLabel">يا هلا</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ul>
              <li><nuxt-link :to="`/user/profile`" @click="toggleModal">الملف الشخصي</nuxt-link></li>
              <li><nuxt-link :to="`/user/change-password`" @click="toggleModal">تغيير كلمة المرور</nuxt-link></li>
          </ul>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-danger" id="logout_button" @click.stop.prevent="logout">تسجيل خروج</button>
        </div>
      </div>
    </div>
  </div>

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
