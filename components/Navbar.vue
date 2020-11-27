<template>
  <header>
    <div class="rainbow"></div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-xl">
        <a class="navbar-brand" href="/"></a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <!-- Hidden temporarly
            <NewJoke />
             

            <li class="nav-item">
              <b-link to="moderate" class="nav-link text-white"><i class="fa fa-eye fa-lg"></i> <b-badge v-if="counters" pill variant="danger">{{ counters.pending_jokes }}</b-badge></b-link>
            </li>
            -->

            <Tags />
            <!-- Hidden temporarly
            <Login />
            -->

          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import  Tags  from "@/components/Navbar/Tags";
export default {
  components:{
    Tags,
  },
  computed: {
    tags () {
      return this.$store.state.tags;
    },
    counters () {
      return this.$store.state.counters;
    }
  }
}
</script>