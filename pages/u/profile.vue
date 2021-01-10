<template>
  <div>
      <h1>ملفك الشخصي<br /><small class="text-muted">قم بتعديل بياناتك الشخصية في هذه الصفحة, وتذكر أن تقوم بزيارتها للتحديث دورياً</small></h1>
        <hr />
        <Notification v-if="success" type="success" :message="success" />
        <Notification v-if="error" type="danger" :message="error" />

       <b-tabs content-class="mt-3">
            <b-tab title="معلومات عامة" active>

                <b-form-group  label-cols-sm="4" label-cols-lg="3" content-cols-sm content-cols-lg="7" label="البريد الإلكتروني" label-for="email-input">
                    <b-form-input disabled v-model="user_data.email" id="email-input" name="email"></b-form-input>
                </b-form-group>

                <b-form-group  label-cols-sm="4" label-cols-lg="3" content-cols-sm content-cols-lg="7" label="الإسم الأول" label-for="firstname-input">
                    <b-form-input v-model="user_data.first_name" id="firstname-input" name="firstname"></b-form-input>
                </b-form-group>

                <b-form-group  label-cols-sm="4" label-cols-lg="3" content-cols-sm content-cols-lg="7" label="الإسم الأخير" label-for="lastname-input">
                    <b-form-input v-model="user_data.last_name" id="lastname-input" name="lastname"></b-form-input>
                </b-form-group>

                <b-form-group  label-cols-sm="4" label-cols-lg="3" content-cols-sm content-cols-lg="7" description="اكتب كلمتين عن نفسك" label="السيرة الشخصية" label-for="bio-input">
                    <b-form-textarea id="bio-input" v-model="user_data.biography" placeholder="كلمتين عنك"></b-form-textarea>
                </b-form-group>

                <b-form-group  label-cols-sm="4" label-cols-lg="3"  content-cols-sm content-cols-lg="7" label="تاريخ الميلاد" label-for="date-of-birth-input">
                    <b-form-datepicker 
                    id="date-of-birth-input" 
                    v-model="user_data.date_of_birth" 
                    locale="en" 
                    class="mb-2" 
                    placeholder="YYYY-MM-DD" 
                    show-decade-nav
                    :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" 
                    direction="ltr"></b-form-datepicker>
                </b-form-group>

                <b-form-group label-cols-sm="4" label-cols-lg="3"  content-cols-sm content-cols-lg="7" label="الجنس">
                    <b-form-radio-group  class="pt-2" v-model="user_data.gender" :options="[{ text: 'ذكر', value: 'male' }, { text: 'أنثى', value: 'female' },]"></b-form-radio-group>
                </b-form-group>

                <b-form-group label-cols-sm="4" label-cols-lg="3" content-cols-sm content-cols-lg="7" label="">
                    <b-alert variant="warning" show>
                    <h5>عرض محتوى البالغين فقط</h5>
                    <b-form-group  description="بإختيارك نعم، تقر بأنك في عمر الـ18 أو أكبر، إذا كذبت بنعلم ابوك">
                        <b-form-radio-group stacked  class="pt-2" v-model="user_data.adult_content" :options="[{ text: 'نعم، أنا أكبر من 18', value: 'show' }, { text: 'لا', value: 'hide' },]"></b-form-radio-group>
                    </b-form-group>
                </b-alert>
                </b-form-group>

                <b-form-group label-cols-sm="4" label-cols-lg="3" content-cols-sm content-cols-lg="7" label="">
                    <b-button type="submit" id="update_button" variant="primary"  @click.stop.prevent="updateUser">تحديث</b-button>
                </b-form-group>


            </b-tab>
            <b-tab title="الصورة الشخصية">
            </b-tab>
       </b-tabs>

  </div>
</template>

<script>
export default {
    // will run the authenticated middle-ware ahead of page load
    //middleware: 'authenticated',
    data() {
        return {
            success: null,
            error: null,
            user_data : {
                id: 0,
                first_name: '',
                last_name: '',
                email: '',
                biography: '',
                date_of_birth: '',
                gender: '',
                adult_content: '',
            },
           
        }
    },
    async fetch(){
        // Doesn't work properly with token on refresh
    },
    computed: {
        
    },
    mounted(){
        this.getUser();
    },
    methods: {
        async getUser(){
            const user_data = await this.$f6snyApi.getCurrentUser();
            this.user_data.id = user_data.id;
            this.user_data.first_name = user_data.first_name;
            this.user_data.last_name = user_data.last_name;
            this.user_data.email = user_data.email;
            this.user_data.biography = user_data.biography;
            this.user_data.date_of_birth = new Date(user_data.date_of_birth);
            this.user_data.gender = user_data.gender;
            this.user_data.adult_content = user_data.adult_content;
            console.log(user_data)
        },
        async updateUser(){
            this.error = null;
            try {
                console.log(this.user_data)
                await this.$f6snyApi.updateUserData(this.user_data.id, this.user_data);
                this.success = `تم تحديث بياناتك بنجاح`;
                await new Promise(resolve => setTimeout(resolve, 3000));
                this.success = null;

            } catch (e) {
                this.error = e.response.data.error;
                await new Promise(resolve => setTimeout(resolve, 3000));
                this.error = null;
            }
        }
    },

}
</script>