<template>
  <div>
    <h2>مراقبة النكت<br>
    <small class="text-muted">إذا النكتة عجبت ناس واجد بنعرضها, وإذا ماعجبت ناس واجد راح نمسحها قبل العرض</small>
    </h2>
    <hr />
    <section class="moderate" v-if="pending.length">
        <b-alert :text="message" :show="dismissCountDown" dismissible fade :variant="status" @dismiss-count-down="countDownChanged"></b-alert>
        
        <b-alert show variant="warning"><strong>ساعدنا!</strong> قم بتقييم هذه النكتة إذا كانت تستحق الظهور أو لا.</b-alert>

        <h3 class="mt-3">النكتة تقول:</h3>
        <hr>

      <article class="p-md-3 p-1 mb-2" v-bind:key="joke.id" v-for="joke in pending">
        <b-row>
          <b-col cols="12">
            <header class="mb-2">
              <div class="float-left small">
                <i class="far fa-chevron-down"></i>
              </div>
              <p class="p-0 m-0 small text-muted">
                <time class=" pl-2" :datetime="joke.updated_at">منذ خمس دقائق</time>
              </p>
            </header>
            <section class="">
              <p class="p-0 m-0">{{ `${joke.content}` }}</p>
              <footer class="mb-3">
                <ul class="list-inline p-0 m-0 small" v-if="joke.tags.length">
                  <li v-bind:key="tag.id" v-for="tag in joke.tags" class="list-inline-item">
                    <a href="#">#{{ `${tag.title}` }}</a>
                  </li>
                </ul>
              </footer>
            </section>
          </b-col>
        </b-row>
      </article>


      <h3 class="mt-5">وأنت وش تقول؟</h3>
      <hr>
      <div class="mt-3">
    <b-button-group size="lg" block>
      <b-button squared variant="success" @click.stop.prevent="like">عجبتني</b-button>
      <b-button squared variant="light" @click.stop.prevent="skip">نو كومنت</b-button>
      <b-button squared variant="danger" @click.stop.prevent="dislike">ماعجبتني</b-button>
    </b-button-group>
  </div>

    </section>
    <section v-else>
      <b-alert variant="danger" show>لايوجد نكت بإنتظار المراقبة الآن 💔 أو إنك شطبت عليهم كلهم طال عمرك , تعال وقت ثاني وإن شاء الله نجيب لك زيادة 😘</b-alert>
    </section>
  </div>
  
</template>

<script>
export default {
  data() {
    return {
        pending: {},
        message: "",
        status: "success",
        dismissSecs: 5,
        dismissCountDown: 0,
        showDismissibleAlert: false
    };
  },
  mounted() {
    console.log('mounted')
    this.fetchPending();
  },
  methods: {
    async fetchPending() {
      const data = await this.$axios.$get('http://localhost:8080/jokes/pending')
      console.log(data);
      this.pending = data;
    },
    countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
    },
    showAlert() {
        this.dismissCountDown = this.dismissSecs
    },
    async like(){
        // record to cookie or session, id of the joke liked
        try{
            const args = {"data": {"value": "up"}};
            const data = await this.$axios.$post('http://localhost:8080/jokes/pending',args)
            console.log(data);
            this.message = "صوتك وصل يالحب"; this.status = "success"; this.showAlert();

            this.pending = data;
        }
        catch(err){
            this.message = err; this.status = "danger"; this.showAlert();
        }
    },
    async dislike(){
        // record to cookie or session, id of the joke liked
        try{
            const args = {"data": {"value": "down"}};
            const data = await this.$axios.$post('http://localhost:8080/jokes/pending',args)
            console.log(data);
            this.message = "صوتك وصل يالحب"; this.status = "success"; this.showAlert();

            this.pending = data;
        }
        catch(err){
            this.message = err; this.status = "danger"; this.showAlert();
        }
    },
    async skip(){
        // record to cookie or session, id of the joke liked
        try{
            const args = {"data": {"value": "neutral"}};
            const data = await this.$axios.$post('http://localhost:8080/jokes/pending',args)
            console.log(data);
            this.message = "صوتك وصل يالحب"; this.status = "success"; this.showAlert();

            this.pending = data;
        }
        catch(err){
            this.message = err; this.status = "danger"; this.showAlert();
        }
    },
  }
};</script>