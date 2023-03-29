<template>
  <div>
        <h2>نسيت كلمة المرور<br><small class="text-muted">بإمكانك تغيير كلمة المرور الخاصة بك إذا كانت مسجل لدينا بالبريد الإلكتروني الصحيح</small></h2>
        <hr />
        <Notification v-if="success" type="success" :message="success" />
        <Notification v-if="error" type="danger" :message="error" />
        <b-form @submit="requestReset">
      
            <b-form-group id="email-address-group" label="البريد الإلكتروني:" label-for="email" description="حط إيميلك اللي سجلت فيه وتأكد إن السبلنق صح بالله">
                <b-form-input id="email" v-model="identifier" type="email" placeholder="username@f6sny.com" required></b-form-input>
            </b-form-group>

        <b-button type="submit" class="btn-block" variant="primary" @click.stop.prevent="requestReset">إرسال رابط إستعادة</b-button>
    </b-form>

  </div>
</template>

<script>
export default {
    data() {
    return {
      identifier:"",
      success: null,
      error: null,
    };
  },
    methods: {
        async requestReset() {
            this.error = null;
            try {
                let response = await this.$f6snyApi.users().forgotPassword(this.identifier);
                this.identifier = '';
                this.success = `تم إرسال رسالة إلى بريدك الإلكتروني، شيكها وحياك الله`; 
            } 
            catch (e) {
                this.error = e.response.data.message[0].messages[0].message;
            }
        },
    },
}
</script>