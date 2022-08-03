<template>
  <div>
    <h1 class="h2">مراقبة النكت<br>
    <small class="text-muted">إذا النكتة عجبت ناس واجد بنعرضها, وإذا ماعجبت ناس واجد راح نمسحها قبل العرض</small>
    </h1>
    <hr />
    <section class="moderate" v-if="Object.entries(pending).length !== 0">
        <Notification v-if="success" type="success" :message="success" />
        <Notification v-if="error" type="danger" :message="error" />
        
        <b-alert show variant="warning"><strong>ساعدنا!</strong> قم بتقييم هذه النكتة إذا كانت تستحق الظهور أو لا.</b-alert>

        <h3 class="mt-3">النكتة تقول:</h3>
        <hr>

      <article class="p-md-3 p-1 mb-2" v-bind:key="pending.id">
        <b-row>
          <b-col cols="12">
            <header class="mb-2">
              <div class="float-left small">
                <i class="far fa-chevron-down"></i>
              </div>
              <p class="p-0 m-0 small text-muted">
                <time class=" pl-2" :datetime="pending.updated_at">منذ خمس دقائق</time>
              </p>
            </header>
            <section class="">
              <p class="p-0 m-0">{{ `${pending.content}` }}</p>
              <footer class="mb-3">
                <ul class="list-inline p-0 m-0 small" v-if="pending.tags">
                  <li v-bind:key="tag.id" v-for="tag in pending.tags" class="list-inline-item">
                      <NuxtLink :to="`/tag/${tag.slug}`">{{ `#${tag.title}` }}</NuxtLink>  
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
        success: null,
        error: null,
        
    };
  },
  head() {
    return {
      title: "مراقبة النكت",
      meta: [{ hid: "description",name: "description",content: "راقب النكت معنا، إذا النكتة عجبت ناس واجد بنعرضها, وإذا ماعجبت ناس واجد راح نمسحها قبل العرض",},],
    };
  },
  mounted() {
    console.log('mounted')
    this.fetchPending();
  },
  computed: {
  },
  methods: {
    async fetchPending() {
        try{
            this.pending = await this.$f6snyApi.getPendingJokes();
            console.log('now should be fetching pending')
            console.log(this.pending);
        }catch(err){
            this.pending =  {};
        }
      
      
    },
    async like(){
        console.log('like triggered')
        // record to cookie or session, id of the joke liked
        try{
            const data = await this.$f6snyApi.vote(this.pending.id,"up")
            this.success = "صوتك وصل يالحب";
            console.log('before dispatch')
            this.$store.dispatch('updateCounters');
            console.log('after dispatch')
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.success = null;
            this.fetchPending();

        }
        catch(err){
            this.error = err.response.data.message;
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.error = null;
        }
    },
    async dislike(){
        console.log('dislike triggered')
        // record to cookie or session, id of the joke liked
        try{
            const data = await this.$f6snyApi.vote(this.pending.id,"down")
            this.success = "صوتك وصل يالحب";
            this.$store.dispatch('updateCounters');
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.success = null;
            this.fetchPending();
        }
        catch(err){
            this.error = err.response.data.message;
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.error = null;
        }
    },
    async skip(){
        console.log('neutral triggered')
        // record to cookie or session, id of the joke liked
        try{
            const data = await this.$f6snyApi.vote(this.pending.id,"neutral")
            this.success = "صوتك وصل يالحب";
            this.$store.dispatch('updateCounters');
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.success = null;
            
            this.fetchPending();
        }
        catch(err){
            this.error = err.response.data.message;
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.error = null;
        }
    },
  }
};</script>