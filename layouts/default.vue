<template>
  <div>
    <Header />
    <b-container>
      <b-row>
        <b-col cols="8" class="py-3"><Nuxt keep-alive /></b-col>
        <b-col cols="4">
          <Sidebar />
          <Footer />
        </b-col>
      </b-row>
    </b-container>
    
  </div>
</template>

<style>

</style>
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
  head() {
    return {
      title: 'إضحك لين تفطس',
    }
  },
  mounted() {
    this.updateInitiail();
  },
  methods: {
    async updateInitiail(){
      const tags = await this.$axios.$get('http://localhost:8080/tags')
      const counters = await this.$axios.$get('http://localhost:8080/counters')
      this.$store.commit('setCounters', counters)
      this.$store.commit('setTags', tags)
    }
  }

}
</script>