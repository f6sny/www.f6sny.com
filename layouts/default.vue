<template>
  <div>
    <Header :counters="counters" />
    <b-container>
      <b-row>
        <b-col cols="8" class="py-3"><Nuxt /></b-col>
        <b-col cols="4">
          <Sidebar :counters="counters" />
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
  data() {
    return {
      counters:{},
    };
  },
  mounted() {
    this.fetchData();
  },
  methods:{
    async fetchData(){
      const data = await this.$axios.$get('http://localhost:8080/counters');
      console.log(data);
      this.counters = data;
    }
  }
}
</script>