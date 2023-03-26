<template>
    <div>
        <h1>Hello</h1>
        <div class="search_box">
          <input class="page-explore__input text-medium" type="text" :value="activeQuery" placeholder="Search anything" @input="inputHandler" />
        </div>

        <div class="results">
            <div v-for="item in result_posts" :key="item.id">
                {{ item.text }}
            </div>
        </div>
    </div>
    
  </template>
  
  <script>
  import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
  //import meili from "~/plugins/meilisearch";
  export default {
    data() {
      return {
        searchClient: instantMeiliSearch(
          "https://search.f6sny.com",
          "bca2c63b74b297238d9d0c0f92eafc3271b7fef25c9ff64429976c83dcb4"
        ),
      };
    },
  };
  </script>