<template>
    <b-modal ref="userModal" id="userModal">
      <template #modal-title>إقلط</template>
      <template #modal-footer>
        <b-link class="ml-auto" @click="alternate_mode" href="#"><span v-if="registeration_mode">عندك عضوية؟ طق هنا</span><span v-else>تبي تسجل معنا؟ طق هنا</span></b-link>
        <b-button v-if="registeration_mode" type="submit" id="register_button" variant="success"  @click.stop.prevent="register">تسجيل جديد</b-button>
        <b-button v-if="!registeration_mode" type="submit" id="login_button" variant="primary"  @click.stop.prevent="login">تسجيل دخول</b-button>
      </template>
      <Notification v-if="success" type="success" :message="success" />
      <Notification v-if="error" type="danger" :message="error" />

      <form v-if="!success" ref="form" method="post">
        <div class="modal-body">
          <b-form-group v-if="registeration_mode" label="اسم المستخدم" label-for="username-input">
            <b-form-input
              v-model="username"
              type="text"
              class="form-control"
              name="username"
              id="username-input"
              aria-describedby="usernameHelp"
              required
            />
          </b-form-group>
          <b-form-group v-if="registeration_mode" label="البريد الإلكتروني" label-for="email-input">
            <b-form-input
              v-model="email"
              type="email"
              class="form-control"
              name="email"
              id="email-input"
              aria-describedby="emailHelp"
              required
            />
            <small id="emailHelp" class="form-text text-muted"
              >ماراح نعرض إيميلك لاحد أو نعطيه أحد.</small
            >
          </b-form-group>

          <b-form-group v-if="!registeration_mode" label="اسم المستخدم أو الإيميل" label-for="identifier-input">
            <b-form-input
              v-model="identifier"
              type="text"
              class="form-control"
              name="identifier"
              id="identifier-input"
              aria-describedby="identifierHelp"
              required
            />
          </b-form-group>

          <b-form-group label="كلمة السر" label-for="password-input">
            <b-form-input
              v-model="password"
              type="password"
              class="form-control"
              id="password-input"
              name="password"
              required
            />
            <small id="passwordHelp" class="form-text"
              ><b-link class="text-muted" href="#">نسيت كلمة المرور؟</b-link></small
            >
          </b-form-group>
        </div>
      </form>
    </b-modal>
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

      } catch (e) {
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
        console.log(response)
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
