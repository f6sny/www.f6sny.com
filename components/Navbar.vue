<template>
  <header>
    <div class="rainbow"></div>
    <nav class="navbar navbar-expand-lg" data-bs-theme="dark" >
      <div class="container">
        <a class="navbar-brand me-0 ms-2" href="/">
          <img src="~/assets/img/Logo.png" height="50" />
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="offcanvas offcanvas-start" data-bs-theme="dark" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">القائمة</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-end flex-grow-1 ps-3">
              <li class="nav-item">
                <a class="nav-link active link-light" title="عندك نكتة؟" aria-current="page" href="#jokeModal" data-bs-toggle="modal">إضافة نكتة</a>
              </li>
              <li class="nav-item">
                <a class="nav-link position-relative" href="/moderate">
                  مراقبة
                  <span v-if="counters.pending_jokes" class="badge rounded-pill bg-danger">
                    {{ counters.pending_jokes }}
                    <span class="visually-hidden">نكت تنتظر المراقبة</span>
                  </span>
                </a>
              </li>
              <NavbarTags data-bs-theme="light" />
            </ul>
            <div class="d-flex" role="search" data-bs-theme="light">
              <input class="form-control ms-2" aria-label="Search" type="search" v-model="search_word" v-on:keyup.enter="search" id="search" name="search" placeholder="ابحث بالموقع" />
            </div>
            <ul class="navbar-nav">
              <NavbarLogin />          
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['counters','tags']),
    search_keyword (){  
      return this.$store.state.search_keywords;
    }
  },
  data(){
    return {
      search_word: "",
    }

  },
  mounted(){
        console.log('mounted navbar')
        this.$store.dispatch('nuxtServerInit');
        this.$store.dispatch('updateCounters');
  },
  methods:{
    search() {
        this.$store.commit('setSearchKeyword', this.search_word)
        this.$router.push(`/search/${this.search_word}`);
    },
  }

}
</script>