<template>
  <aside id="sidebar">
    <section class="widget search py-3 mb-4">
      <form>
        <div class="form-group">
          <input class="form-control" type="text" id="search" name="search" value="" placeholder="ابحث بالموقع" />
        </div>
      </form>
    </section>

    <section class="widget tags p-3 mb-4">
      <h4>سحابة التصنيفات</h4>
      <hr class="my-1" />
      <ul v-if="tags" style="" class="list-inline p-0 m-0 text-center">
        <li v-bind:key="tag.id" v-for="tag in tags" :style="`font-size: ${ randomSize(tag.jokes,tag.jokes_max) }em;`" class="list-inline-item">
          <NuxtLink :to="`/t/${tag.name}`" :style="`color: ${tag.fore_color}`">{{ `#${tag.name}` }}</NuxtLink>  
          
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
          <b-link href="#" class="text-muted"><i class="fa fa-comment"></i> <strong v-if="comment.author">{{ comment.author.username }}</strong> {{ comment.content }}</b-link>
        </li>
      </ul>
    </section>

    <section class="widget p-3 mb-4">
      <h4>روابط مهمة</h4>
      <hr class="my-1" />
      <ul class="list-unstyled text-small">
        <li><b-link href="#"><i class="fas fa-question-circle"></i> ليه ماطلعت نكتتي</b-link></li>
        <li><b-link href="#"><i class="fas fa-question-circle"></i> النكت حلال ولا حرام</b-link></li>
        <li><b-link href="#"><i class="fas fa-exclamation-triangle"></i> القوانين والأحكام</b-link></li>
        <li><b-link href="https://github.com/Mo9a7i"><i class="fab fa-github"></i> المشروع في GitHub</b-link></li>
        <li><b-link href="#"><i class="fas fa-envelope"></i> إتصل بنا</b-link></li>
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
      
    }

  },
  mounted() {
    this.fetchComments();
  },
  methods:{
    async fetchComments() {
      const data = await this.$axios.$get('http://localhost:8080/comments?_sort=id:DESC&_limit=10&status=true')
      this.comments = data;
    },
    randomSize(actual, max){
      const base = 1.5;
      if((actual/max) > 0.8){
        return 1 * base;
      }
      if((actual/max) > 0.5){
        return 0.8 * base;
      }
      else{
        return 0.6 * base;
      }
    }
  }
}
</script>