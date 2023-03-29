<template>
  <article class="py-md-3 px-md-2 p-2 mb-4 bg-white shadow-sm rounded-3" :id="joke.id">
    <div class="container">
      <div class="row">
        <div class="col col-1 d-flex justify-content-center">
          <avatar :picture="(joke.author.display_picture) ? joke.author.display_picture : ``"></avatar>
        </div>
        <div class="col col-11">
          <header class="mb-2">
            <small class="p-0 m-0 text-muted fw-lighter lh-1">
              <time class="ps-1" :datetime="joke.updated_at" :title="joke.updated_at">{{ $moment(joke.updated_at).fromNow() }}</time>
              <span>بواسطة 
                <a class="link-primary link-underline-opacity-25" v-if="joke.author" :href="`/user/${joke.author.username}`">{{ joke.author.username }}</a>
                <a class="link-underline-opacity-25" href="#" v-else>مجهول</a></span>
            </small>
          </header>
          <section>
            <h1 v-if="!is_homepage" class="h5 p-0 m-0" v-html="joke.content"></h1>
            <p v-else class="p-0 m-0" v-html="joke.content"></p>
            <footer class="mb-1">
              <ul class="list-inline p-0 m-0 small" v-if="joke.tags.length">
                <li v-bind:key="tag.id" v-for="tag in joke.tags" class="list-inline-item" >
                  <NuxtLink class="small link-secondary link-underline-opacity-25" :to="`/tag/${tag.slug}`">{{`#${tag.title}`}}</NuxtLink>  
                </li>
              </ul>
            </footer>
          </section>
          <footer>
            <ul class="list-inline p-0 m-0 col-12 text-muted small text-start">
              <li class="list-inline-item text-secondary" title="صفحة النكتة" ><nuxt-link class="link-secondary" :to="`/joke/${joke.slug}`"><i class="bi bi-box-arrow-up-right"></i></nuxt-link></li>
              <li class="list-inline-item text-secondary" title="خمس تعليقات" ><i class="bi bi-chat-fill"></i></li>
              <li class="list-inline-item text-secondary" :title="votes_up + ' تصويتات للأعلى'"  @click.stop.prevent="like"><i class="bi bi-hand-thumbs-up-fill"></i></li>
              <li class="list-inline-item text-secondary" :title="votes_down + ' تصويتات للأسفل'"  @click.stop.prevent="dislike"><i class="bi bi-hand-thumbs-down-fill"></i></li>
              <li class="list-inline-item text-secondary" title="تبليغ" ><i class="bi bi-flag-fill"></i></li>
            </ul>
            <Notification v-if="success" type="success" :message="success" />
            <Notification v-if="error" type="danger" :message="error" />
          </footer>
        </div>
    </div>
    </div>
  </article>
</template>

<script>
export default {
    props: {
        joke: {
            type: Object,
            default: null,
        },
        is_homepage: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            votes_up: 0,
            votes_down: 0,
            success: null,
            error: null,
        };
    },
    mounted() {
        if(this.joke.votes){
            this.joke.votes.forEach(element => {
                if(element.value =="up") this.votes_up++;
                if(element.value =="down") this.votes_down++;
            });
        }
        
    },
    methods:{
        async like(){
            // record to cookie or session, id of the joke liked
            try{
                const data = await this.$f6snyApi.jokes().vote(this.joke.id,"up")
                this.success = "صوتك وصل يالحب";
                this.$store.dispatch('updateCounters');
                await new Promise(resolve => setTimeout(resolve, 3000));
                this.success = null;
                this.$nuxt.refresh()

            }
            catch(error){
                console.log(error)
                this.error = error.message;
                await new Promise(resolve => setTimeout(resolve, 3000));
                this.error = null;
            }
        },
        async dislike(){
            console.log('dislike triggered')
            // record to cookie or session, id of the joke liked
            try{
                const data = await this.$f6snyApi.jokes().vote(this.joke.id,"down")
                this.success = "صوتك وصل يالحب";
                this.$store.dispatch('updateCounters');
                await new Promise(resolve => setTimeout(resolve, 3000));
                this.success = null;
                this.$nuxt.refresh()
            }
            catch(err){
                this.error = err.response.data.message;
                await new Promise(resolve => setTimeout(resolve, 3000));
                this.error = null;
            }
        },
    }
}
</script>