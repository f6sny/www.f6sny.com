<template>
  <div>
    <div v-if="user_info">
        <b-row>
          <b-col cols="2">
            <b-avatar v-if="user_info.display_picture" :src="user_info.display_picture" size="6rem"></b-avatar>
            <b-avatar v-else size="6rem"></b-avatar>
          </b-col>
          <b-col cols="9">
            <h1 class="h2">
              {{ username }}<br />
              <small>{{ user_info.bio }}</small>
            </h1>
          </b-col>
        </b-row>
        
        <hr />
        <section class="user_info" v-if="user_info">
          <b-tabs content-class="mt-3">
            <b-tab title="معلومات عامة" active>

              <div class="row">
                <div class="col-sm-3"><h6 class="mb-0">الإسم</h6></div>
                <div class="col-sm-9 text-secondary">{{ user_info.firstname }} {{ user_info.lastname }}</div>
            </div>
            <hr>

            <div class="row">
                <div class="col-sm-3"><h6 class="mb-0">البريد الإلكتروني</h6></div>
                <div class="col-sm-9 text-secondary">{{ user_info.email }}</div>
            </div>
            <hr>

            <div class="row">
                <div class="col-sm-3"><h6 class="mb-0">مسجل منذ</h6></div>
                <div class="col-sm-9 text-secondary"><time :title="user_info.created_at" :datetime="user_info.created_at">{{ $moment(user_info.created_at).fromNow() }}</time></div>
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
            <b-tab title="النكت">
                <section class="jokes tags" v-if="jokes.length">
                    <blocks-joke-block v-for="(joke, i) in jokes" :key="joke.id" v-observe-visibility="i === jokes.length - 1 ? lazyLoadJokes : false" :joke="joke"/>
                </section>
                <section v-else>
                    <b-alert variant="danger" show>
                        لايوجد أي نكت بإسم هذا العضو
                    </b-alert>
                </section>
            </b-tab>
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
        current_page: 1,
        jokes_retreived: 0,
    };
  },
  head() {
    return {
        title: this.username ,
        meta: [
            { hid: 'description', name: 'description', content: `${this.user} ${this.user_info.bio}` },
        ]
    }
  },
    mounted(){
    },
  async fetch() {
        await this.getUser();
        await this.getJokes();
  },
  methods: {
      async getUser(){
        const user_data = await this.$f6snyApi.users().getUserByUsername(this.$route.params.username)
        this.user_info = user_data[0];
        console.log('got user')
      },
      async getJokes(){
          const joke_data = await this.$f6snyApi.jokes().getUserJokesByID(this.user_info.id, this.jokes_retreived) 
            this.jokes = this.jokes.concat(joke_data);
            this.jokes_retreived += joke_data.length;
      },
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