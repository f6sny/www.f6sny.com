<template>
  <aside id="sidebar">
    
    <section class="widget tags my-5 pe-3">
      <blocks-widget-title title="سحابة التصنيفات" />
      <ul v-if="tags" style="" class="list-inline p-0 m-0 text-center">
        <li v-bind:key="tag.id" v-for="tag in tags" :style="`font-size: ${ randomSize(tag.jokes,tag.jokes_max) }em;`" class="list-inline-item">
          <NuxtLink class="text-decoration-none" :to="`/tag/${tag.slug}`" :style="`color: ${tag.hex_color}`">{{ `#${tag.title}` }}</NuxtLink>  
        
          </li>
      </ul>
    </section>

    <section class="widget comments mb-5 pe-3">
      <blocks-widget-title title="آخر التعليقات" />
      <ul class="list-unstyled p-0 m-0 small">
        <li class="mb-2 lh-1" v-bind:key="comment.id" v-for="comment in comments" >
          <nuxt-link class="link-secondary link-underline-opacity-25 d-inline-block text-truncate col-12" :to="`/joke/${comment.related[0].slug}#comment-${comment.id}`">
            <i class="bi bi-chat-fill text-decoration-none ps-2"></i>
            <strong v-if="comment.authorName">{{ comment.authorName }}: </strong> {{ comment.content }}
          </nuxt-link>
        </li>
      </ul>
    </section>

    

    <section class="widget links mb-5 pe-3">
      <blocks-widget-title title="روابط مهمة" />
      <ul class="list-unstyled small p-0 m-0">
        <li v-bind:key="page.id" v-for="page in pages">
          <nuxt-link class="link-secondary link-underline-opacity-25" :to="`/page/${page.slug}`"><i class="bi bi-link-45deg text-decoration-none ps-2"></i>{{ page.title }}</nuxt-link>
        </li>  
        <li>
          <nuxt-link class="link-secondary link-underline-opacity-25" to="#"><i class="bi bi-exclamation-triangle-fill text-decoration-none ps-2"></i>القوانين والأحكام</nuxt-link>
        </li>
        <li>
          <a class="link-secondary link-underline-opacity-25" href="https://github.com/f6sny"><i class="bi bi-github text-decoration-none ps-2"></i>المشروع في GitHub</a>
        </li>
        <li>
          <nuxt-link class="link-secondary link-underline-opacity-25" to="#"><i class="bi bi-envelope-fill text-decoration-none ps-2"></i>إتصل بنا</nuxt-link>
        </li>
      </ul>
    </section>

    <section class="widget statistics mb-3 small">
      <div class="alert alert-info">
        <blocks-widget-title myclass="h4" title="إحصائيات" />
        <ul v-if="counters" class="list-unstyled p-0 m-0 small lh-lg">
        <li class=""><i class="bi bi-check-lg ps-2"></i>{{counters.total_jokes - counters.pending_jokes - counters.deleted_jokes}} نكتة مفعلة</li>
        <li class=""><i class="bi bi-clock ps-2"></i>{{ counters.pending_jokes }} نكتة بالإنتظار</li>
        <li class=""><i class="bi bi-trash ps-2"></i>{{ counters.deleted_jokes }} نكتة ممسوحة</li>
        <li class=""><i class="bi bi-person-fill ps-2"></i>{{ counters.users }} عضو</li>
        <li class=""><i class="bi bi-chat-fill ps-2"></i>{{ counters.comments }} تعليق</li>
        <!-- <li><i class="bi bi-signal"></i> 661152 زيارة</li>
        <li>تم تحميل الصفحة في 0.4694 ثانية</li> -->
      </ul>
      </div>
      
      
    </section>
  </aside>
</template>

<script>
export default {
  computed: {
    tags () {
      return this.$store.state.tags;
    },
    counters () {
      return this.$store.state.counters;
    }
  },
  data(){
    return {
      comments: [],
      pages: [],
    }

  },
  mounted() {
    this.fetchComments();
    this.fetchPages();
  },
  methods:{
    async fetchPages() {
        const page_data = await this.$f6snyApi.pages().getPages();
        this.pages = page_data;
    },
    async fetchComments() {
      this.comments = await this.$f6snyApi.comments().getLatestComments();
    },
    randomSize(actual, max){
      const base = 1.5;
      if((actual/max) > 0.8) return 1 * base;
      if((actual/max) > 0.5) return 0.8 * base;
      else return 0.6 * base;
    }
  }
}
</script>