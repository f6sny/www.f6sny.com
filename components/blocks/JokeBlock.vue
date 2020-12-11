<template>
  <article class="p-md-3 p-1 mb-2" :id="joke.id">
        <b-row>
          <b-col cols="1" class="pl-0">
            <b-avatar v-if="joke.author.display_picture" :src="joke.author.display_picture" size=""></b-avatar>
            <b-avatar v-else size=""></b-avatar>
          </b-col>
          <b-col cols="11">
            <header class="mb-2">
              <div class="float-left small">
                <i class="far fa-chevron-down"></i>
              </div>
              <p class="p-0 m-0 small text-muted">
                <time class=" pl-2" :datetime="joke.updated_at">منذ خمس دقائق</time>
                <strong>بواسطة <a v-if="joke.author" :href="`/u/${joke.author.username}`">{{ joke.author.username }} </a> <a href="#" v-else>مجهول</a></strong>
              </p>
            </header>
            <section class="">
              <p class="p-0 m-0" v-html="joke.content"></p>
              <footer class="mb-3">
                <ul class="list-inline p-0 m-0 small" v-if="joke.tags.length">
                  <li v-bind:key="tag.id" v-for="tag in joke.tags" class="list-inline-item" >
                    <NuxtLink :to="`/t/${tag.title}`">{{ `#${tag.title}` }}</NuxtLink>  
                  </li>
                </ul>
              </footer>
            </section>
            <footer class="">
              <ul class="list-inline p-0 m-0 col-12 text-muted small text-left">
                <li class="list-inline-item"><i class="fas fa-comment"></i> (5 تعليقات)</li>
                <li class="list-inline-item"><i class="fas fa-thumbs-up"></i></li>
                <li class="list-inline-item"><i class="fas fa-thumbs-down"></i></li>
                <li class="list-inline-item"><i class="fas fa-flag-alt"></i></li>
              </ul>
            </footer>
          </b-col>
        </b-row>
      </article>
</template>

<script>
export default {
    props: {
        joke: {
            type: Object,
            default: null,
        }
    }
}
</script>

<style>

</style>