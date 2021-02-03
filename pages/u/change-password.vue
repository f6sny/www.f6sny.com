<template>
  <div>
        <h2>تغيير كلمة المرور<br><small class="text-muted">إذا ودك تغير كلمة سرك, تأكد إنك تختار شي صعب بس ماتنساه</small></h2>
        <hr />
        <Notification v-if="success" type="success" :message="success" />
        <Notification v-if="error" type="danger" :message="error" />

        <b-form @submit="resetPassword">
      
            <b-form-group id="old-password-group" label="كلمة المرور القديمة:" label-for="old-password" description="اكتب كلمة المرور القديمة">
                <b-form-input id="old-password" v-model="old_password" type="password"  required></b-form-input>
            </b-form-group>


            <b-form-group id="new-password-group" label="كلمة المرور الجديدة:" label-for="new-password" description="اكتب كلمة المرور الجديدة">
                <b-form-input id="new-password" v-model="new_password" type="password"  required></b-form-input>
            </b-form-group>

            <b-form-group id="new-password-2-group" label="إعادة كلمة المرور الجديدة:" label-for="new-password-2" description="اكتب كلمة المرور الجديدة من جديد ولا تغلط">
                <b-form-input id="new-password-2" v-model="new_password2" type="password" required></b-form-input>
            </b-form-group>

        <b-button type="submit" class="btn-block" variant="primary" @click.stop.prevent="resetPassword">تغيير كلمة المرور</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
    data() {
    return {
      old_password:"",
      new_password:"",
      new_password2:"",
      success: null,
      error: null,
    };
  },
}
</script>

<style>

</style>