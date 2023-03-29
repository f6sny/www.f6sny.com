<template>
  <article class="p-md-3 p-2 mb-2" :id="joke.id">
    <div class="container">
      <div class="row">
      <div class="col col-1 d-flex justify-content-center">
        <avatar :picture="(joke.author.display_picture) ? joke.author.display_picture : ``"></avatar>
      </div>
      <div class="col col-11">
        <header class="mb-1">
          <p class="fs-6 p-0 m-0 small text-muted fw-lighter lh-1">
            <time class="ps-1" :datetime="joke.updated_at" :title="joke.updated_at">{{ $moment(joke.updated_at).fromNow() }}</time>
            <span>بواسطة <a v-if="joke.author" :href="`/user/${joke.author.username}`">{{ joke.author.username }}</a><a href="#" v-else>مجهول</a></span>
          </p>
        </header>
        <section>
          <h1 v-if="!is_homepage" class="h5 p-0 m-0" v-html="joke.content"></h1>
          <p v-else class="p-0 m-0" v-html="joke.content"></p>
          <footer class="mb-1">
            <ul class="list-inline p-0 m-0 small" v-if="joke.tags.length">
              <li v-bind:key="tag.id" v-for="tag in joke.tags" class="list-inline-item" >
                <NuxtLink class="ms-2" :to="`/tag/${tag.slug}`">{{`#${tag.title}`}}</NuxtLink>  
              </li>
            </ul>
          </footer>
        </section>
        <footer>
          <ul class="list-inline p-0 m-0 col-12 text-muted small fs-6 text-start">
            <li title="صفحة النكتة" class="list-inline-item"><b-link class="text-muted" :to="`/joke/${joke.slug}`"><i class="fas fa-link"></i></b-link></li>
            <li title="خمس تعليقات" class="list-inline-item"><i class="fas fa-comment"></i></li>
            <li :title="votes_up + ' تصويتات للأعلى'" class="list-inline-item" @click.stop.prevent="like"><i class="fas fa-thumbs-up"></i></li>
            <li :title="votes_down + ' تصويتات للأسفل'" class="list-inline-item" @click.stop.prevent="dislike"><i class="fas fa-thumbs-down"></i></li>
            <li title="تبليغ" class="list-inline-item"><i class="fas fa-flag-alt"></i></li>
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