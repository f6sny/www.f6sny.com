<template>
  <div>
        <h2>تغيير كلمة المرور<br><small class="text-muted">بما إنك وصلت هنا، تقدر تغير كلمة المرور حقتك وتقلط وتنورنا</small></h2>
        <hr />
        <Notification v-if="success" type="success" :message="success" />
        <Notification v-if="error" type="danger" :message="error" />
        <b-form @submit="resetPassword">
      
            <b-form-group id="new-password-group" label="كلمة المرور الجديدة:" label-for="new-password" description="اكتب كلمة المرور الجديدة">
                <b-form-input id="new-password" v-model="password" type="password"  required></b-form-input>
            </b-form-group>

            <b-form-group id="new-password-2-group" label="إعادة كلمة المرور الجديدة:" label-for="new-password-2" description="اكتب كلمة المرور الجديدة من جديد ولا تغلط">
                <b-form-input id="new-password-2" v-model="password2" type="password" required></b-form-input>
            </b-form-group>

        <b-button type="submit" class="btn-block" variant="primary" @click.stop.prevent="resetPassword">تغيير كلمة المرور</b-button>
    </b-form>

  </div>
</template>

<script>
export default {
    data() {
    return {
      password:"",
      password2:"",
      success: null,
      error: null,
    };
  },
  methods: {
    async resetPassword() {
        console.log('reset requested');
        this.error = null;
        let data = {
            code: this.$route.query.code,
            password: this.password,
            passwordConfirmation: this.password2,
        }
        try {
            console.log('before request');

            let reset_response = await this.$f6snyApi.users().resetPassword(data);
            console.log('after request');
            this.password2 = '';
            this.success = `تم تغيير كلمة المرور بنجاح، يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة`;

            let response = await this.$auth.loginWith("local", {
                data: {
                    identifier: reset_response.user.email,
                    password: this.password,
                },
            });

            Cookie.set('auth', response.jwt)
            this.$store.dispatch('updateCounters');
            this.$router.push("/");
        } 
        catch (error) {
            this.error = error.response.data.message[0].messages[0].message;
        }
    },
  },
}
</script>