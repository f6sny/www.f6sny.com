<template>
  <li class="nav-item dropdown" v-if="tags">
    <a class="nav-link dropdown-toggle" href="#" title="تصنيفات" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      التصنيفات
    </a>
    <ul class="dropdown-menu text-start">
      <li>
        <nuxt-link dir="rtl" class="dropdown-item text-end" :to="`/tag/${tag.slug}`" v-bind:key="tag.id" v-for="tag in tags" :style="`color: ${tag.hex_color}`">
          {{ `#${tag.title}` }}
        </nuxt-link>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
computed: {
    tags () {
      return this.$store.state.tags;
    },
  }
}
</script>

<style>

</style>