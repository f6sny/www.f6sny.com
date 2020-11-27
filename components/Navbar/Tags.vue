<template>
    <b-nav-item-dropdown right text="تصنيفات" v-if="tags">
        <template slot="button-content">
            <i class="fa fa-sitemap fa-lg"></i>
        </template>

        <b-dropdown-item href="#" v-bind:key="tag.id" v-for="tag in tags" >
          <NuxtLink :to="`/t/${tag.name}`" :style="`color: ${tag.fore_color}`">{{ `#${tag.name}` }}</NuxtLink>  
        </b-dropdown-item>
    </b-nav-item-dropdown>
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