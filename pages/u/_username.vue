<template>
  <div>
    <div v-if="user_info">
        <b-row>
          <b-col cols="2">
            <b-avatar v-if="user_info.display_picture" :src="user_info.display_picture" size="6rem"></b-avatar>
            <b-avatar v-else size="6rem"></b-avatar>
          </b-col>
          <b-col cols="9">
            <h2>{{ username }}<br />
            <small>{{ user_info.bio }}</small></h2>
          </b-col>
        </b-row>
        
        <hr />
        <section class="user_info" v-if="user_info">
          <b-tabs content-class="mt-3">
            <b-tab title="معلومات عامة" active>

              <div class="row">
                <div class="col-sm-3">
                    <h6 class="mb-0">الإسم</h6>
                </div>
                <div class="col-sm-9 text-secondary">
                    {{ user_info.firstname }} {{ user_info.lastname }}
                </div>
            </div>
            <hr>

            <div class="row">
                <div class="col-sm-3">
                    <h6 class="mb-0">البريد الإلكتروني</h6>
                </div>
                <div class="col-sm-9 text-secondary">
                    {{ user_info.email }}
                </div>
            </div>
            <hr>

            <div class="row">
                <div class="col-sm-3">
                    <h6 class="mb-0">مسجل منذ</h6>
                </div>
                <div class="col-sm-9 text-secondary">
                    <time :title="user_info.created_at" :datetime="user_info.created_at">{{ $moment(user_info.created_at).fromNow() }}</time>
                </div>
            </div>
            <hr>

            <div class="row">
                <div class="col-sm-3">
                    <h6 class="mb-0">الجنس</h6>
                </div>
                <div class="col-sm-9 text-secondary">
                    {{ user_info.gender }}
                </div>
            </div>

            </b-tab>
            <b-tab title="النكت"><p>I'm the second tab</p></b-tab>
            <b-tab title="التعليقات"><p>I'm a disabled tab!</p></b-tab>
          </b-tabs>



            

        </section>
        <section v-else><h5>جاري سحب اليوزر..</h5></section>
    </div>
    <div v-else>Error: No User Found</div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
        username: this.$route.params.username,
        user_info: {},
        jokes: [],
    };
  },
  head() {
    return {
        title: this.username ,
        meta: [
            { hid: 'description', name: 'description', content: this.user_info.bio },
            { name: 'keywords', content: this.user_info.bio },
        ]
    }
  },
    mounted(){
    },
  async fetch() {
      console.log(encodeURI(`/users-permissions/username/${ this.$route.params.username }`))
    const user_data = await this.$axios.$get(encodeURI(`/users-permissions/username/${ this.$route.params.username }`))
    //const tag_data = await this.$axios.$get(encodeURI(`/tags/slug/${ this.$route.params.tag }`))
    user_data.gender = user_data.gender ? "ذكر" : "أنثى";
    this.user_info = user_data;
    console.log(user_data)
    //this.jokes_retreived += joke_data.length;
    //this.tag_info = tag_data;
  },

  methods: {
    lazyLoadJokes(isVisible) {
      console.log('lazy load fired')
      if (isVisible) {
        if (this.current_page < 10) {
          this.current_page++
          this.$fetch()
        }
      }
    }
  }

};</script>

<style>

</style>