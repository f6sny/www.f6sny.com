<template>
  <header>
    <div class="rainbow"></div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-xl">
        <a class="navbar-brand" href="/"></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02"
          aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
            <b-navbar-nav class="ms-auto mt-2 mt-lg-0">
                <b-nav-item href="#" title="عندك نكتة؟" v-b-modal.jokeModal><i class="fas fa-plus"></i></b-nav-item>
                <b-nav-item to="/moderate"><i class="fa fa-eye fa-lg"></i> <b-badge v-if="counters.pending_jokes" pill variant="danger">{{ counters.pending_jokes }}</b-badge></b-nav-item>
                <NavbarTags />
                <NavbarLogin />
            </b-navbar-nav>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState(['counters','tags']),
  mounted(){
        console.log('mounted navbar')
        this.$store.dispatch('nuxtServerInit');
        this.$store.dispatch('updateCounters');
  }

}
</script>