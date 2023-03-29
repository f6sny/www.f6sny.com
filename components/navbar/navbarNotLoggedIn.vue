<template>
    <div ref="userModal" class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="userModalLabel">إقلط</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Notification v-if="success" type="success" :message="success" />
            <Notification v-if="error" type="danger" :message="error" />

            <form v-if="!success" ref="form" method="post">
              <div class="mb-3" v-if="registeration_mode">
                <label for="username-input" class="form-label">اسم المستخدم</label>
                <input v-model="username" autocomplete="username" type="text" class="form-control" name="username" id="username-input" aria-describedby="usernameHelp" required>
              </div>

              <div class="mb-3" v-if="registeration_mode">
                <label for="email-input" class="form-label">البريد الإلكتروني</label>
                <input v-model="email" type="email" class="form-control" name="email" id="email-input" aria-describedby="emailHelp" required>
                <div id="emailHelp" class="form-text">
                  ماراح نعرض إيميلك لاحد أو نعطيه أحد
                </div>
              </div>

              <div class="mb-3" v-if="!registeration_mode">
                <label for="identifier-input" class="form-label">اسم المستخدم أو الإيميل</label>
                <input v-model="identifier" type="text" class="form-control" name="identifier" id="identifier-input" aria-describedby="identifierHelp" required>
              </div>

              <div class="mb-3">
                <label for="password-input" class="form-label">كلمة السر</label>
                <input v-model="password" autocomplete="password" type="password" class="form-control" name="password" id="password-input" aria-describedby="identifierHelp" required>
                <div id="emailHelp" class="form-text">
                  <small><nuxt-link class="text-muted" to="#">نسيت كلمة المرور؟</nuxt-link></small>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <a class="ms-auto" @click="alternate_mode" href="#">
              <span v-if="registeration_mode">عندك عضوية؟ طق هنا</span>
              <span v-else>تبي تسجل معنا؟ طق هنا</span>
            </a>
            <button v-if="registeration_mode" type="submit" class="btn btn-success" id="register_button" @click.stop.prevent="register">تسجيل جديد</button>
            <button v-if="!registeration_mode" type="submit" class="btn btn-primary" id="login_button" @click.stop.prevent="login">تسجيل دخول</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  data() {
    return {
      identifier:"",
      username: "",
      email: "",
      password: "",
      success: null,
      error: null,
      registeration_mode: false,
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
  },
  methods: {
    alternate_mode() {
      this.registeration_mode = !this.registeration_mode;
    },

    async register() {
      this.error = null;
      try {
        this.$axios.setToken(false);
        await this.$axios.post("auth/local/register", {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        this.success = `تم إرسال رسالة إلى بريدك الإلكتروني، شيكها وحياك الله`;
        const registerButton = document.getElementById("register_button");
        registerButton.disabled = true;

      } 
      catch (e) {
        this.error = e.response.data.error;
      }
    },

    async login() {
      this.error = null;
      try {
        let response = await this.$auth.loginWith("local", {
          data: {
            identifier: this.identifier,
            password: this.password,
          },
        });
        Cookie.set('auth', response.jwt)
        this.$store.dispatch('updateCounters');
        this.$router.push("/");
      } 
      catch (e) {
        this.error = e.response.data.message[0].messages[0].message;
      }
    },
  },
};
</script>
