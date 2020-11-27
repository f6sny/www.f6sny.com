<template>
  <article class="p-md-3 p-1 mb-2" :id="joke.id">
        <b-row>
          <b-col cols="1" class="pl-0">
            <div v-if="joke.author"> <b-img src="https://placehold.co/50" fluid-grow right alt="..." rounded="circle"></b-img> </div>
            <div v-else> <b-img src="https://placehold.co/50" fluid-grow right alt="..." rounded="circle"></b-img> </div>
          </b-col>
          <b-col cols="11">
            <header class="mb-2">
              <div class="float-left small">
                <i class="far fa-chevron-down"></i>
              </div>
              <p class="p-0 m-0 small text-muted">
                <time class=" pl-2" :datetime="joke.updated_at">منذ خمس دقائق</time>
                <strong><a href="#">بواسطة مطحس </a></strong>
              </p>
            </header>
            <section class="">
              <p class="p-0 m-0" v-html="joke.content"></p>
              <footer class="mb-3">
                <ul class="list-inline p-0 m-0 small" v-if="joke.tags.length">
                  <li v-bind:key="tag.id" v-for="tag in joke.tags" class="list-inline-item" >
                    <NuxtLink :to="`/t/${tag.name}`">{{ `#${tag.name}` }}</NuxtLink>  
                  </li>
                </ul>
              </footer>
            </section>
            <footer class="">
              <ul class="list-inline p-0 m-0 col-12 text-muted small row text-center">
                <li class="list-inline-item col">
                  <i class="fal fa-comment"></i>
                </li>
                <li class="list-inline-item col">
                  <i class="far fa-heart"></i>
                </li>
                <li class="list-inline-item col">
                  <i class="fal fa-flag-alt"></i>
                </li>
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