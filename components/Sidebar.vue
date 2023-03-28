<template>
  <aside id="sidebar">
    
    <section class="widget tags mt-2 p-3 mb-4">
      <h4>سحابة التصنيفات</h4>
      <hr class="my-1" />
      <ul v-if="tags" style="" class="list-inline p-0 m-0 text-center">
        <li v-bind:key="tag.id" v-for="tag in tags" :style="`font-size: ${ randomSize(tag.jokes,tag.jokes_max) }em;`" class="list-inline-item">
          <NuxtLink :to="`/tag/${tag.slug}`" :style="`color: ${tag.hex_color}`">{{ `#${tag.title}` }}</NuxtLink>  
          
          </li>
      </ul>
    </section>

    <section class="widget p-3 mb-4">
      <h4>إحصائيات</h4>
      <hr class="my-1" />
      <ul v-if="counters" class="list-unstyled">
        <li class="text-success"><i class="fa fa-check"></i> {{counters.total_jokes - counters.pending_jokes - counters.deleted_jokes}} نكتة مفعلة</li>
        <li class="text-warning"><i class="far fa-clock"></i> {{ counters.pending_jokes }} نكتة بالإنتظار</li>
        <li class="text-error"><i class="far fa-trash"></i> {{ counters.deleted_jokes }} نكتة ممسوحة</li>
        <li class="text-info"><i class="fa fa-user"></i> {{ counters.users }} عضو</li>
        <li><i class="fa fa-comments"></i> {{ counters.comments }} تعليق</li>
        <!-- <li><i class="fa fa-signal"></i> 661152 زيارة</li>
        <li>تم تحميل الصفحة في 0.4694 ثانية</li> -->
      </ul>
    </section>

    <section class="widget comments p-3 mb-4">
      <h4>آخر التعليقات</h4>
      <hr class="my-1" />
      <ul class="list-unstyled">
        <li v-bind:key="comment.id" v-for="comment in comments" >
          <nuxt-link :to="`/joke/${comment.related[0].slug}#comment-${comment.id}`" class="text-muted"><i class="fa fa-comment"></i> <strong v-if="comment.authorName"> {{ comment.authorName }}</strong> {{ comment.content }}</nuxt-link>
        </li>
      </ul>
    </section>

    <section class="widget p-3 mb-4">
      <h4>روابط مهمة</h4>
      <hr class="my-1" />
      <ul class="list-unstyled text-small">
        <li v-bind:key="page.id" v-for="page in pages"><nuxt-link :to="`/page/${page.slug}`"><i class="fas fa-exclamation-triangle"></i> {{ page.title }}</nuxt-link></li>  
        <li><nuxt-link to="#"><i class="fas fa-exclamation-triangle"></i> القوانين والأحكام</nuxt-link></li>
        <li><a href="https://github.com/f6sny"><i class="fab fa-github"></i> المشروع في GitHub</a></li>
        <li><nuxt-link to="#"><i class="fas fa-envelope"></i> إتصل بنا</nuxt-link></li>
      </ul>
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
        const page_data = await this.$f6snyApi.getPages();
        console.log(page_data)
        this.pages = page_data;
    },
    async fetchComments() {
      this.comments = await this.$f6snyApi.getLatestComments();
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