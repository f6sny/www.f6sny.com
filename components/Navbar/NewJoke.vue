<template>
<li class="nav-item">
  <b-button href="#" variant="link text-decoration-none nav-link text-white" title="عندك نكتة؟" v-b-modal.jokeModal><i class="fas fa-plus"></i></b-button>
  <b-modal id="jokeModal" size="xl" scrollable centered>
    <template #modal-title>عندك نكتة؟</template>
    <template #modal-footer>
      <b-button type="submit" variant="success" @click="submit_joke()">إرسال</b-button>
      <b-button variant="secondary" @click="show = false">إلغاء</b-button>
    </template>
    <form >
      <div class="user-info text-left">
        <small>سيتم نشر النكتة بإسم: زائر | <a href="#">مساعدة؟</a></small>
      </div>
      <div class="joke-content">
        <div class="form-group">
          <textarea v-model="joke_content" placeholder="يقول لك، " class="form-control" id="jokeContent" rows="6"></textarea>
        </div>
      </div>
      <div class="characters-info text-left">
        <small>عدد الحروف: {{ textarea_counter }}</small>
      </div>
      <div class="tags-info">
        <b-form-group label="لازم تختار تصنيف واحد عالأقل:">
          <b-form-checkbox-group id="checkbox-group-1" v-model="selected" :options="options" name="tags"></b-form-checkbox-group>
        </b-form-group>
      </div>
    </form>
  </b-modal>
</li>
  
</template>
<style scoped>

</style>
<script>

export default {
  data() {
    return {
      selected: [],
      options: [],
      joke_content: 'يقول لك، ',
      text_area_characters_count: 0,
    };
  },
  computed: {
    textarea_counter(){
      this.text_area_characters_count = this.joke_content.length;
      return this.joke_content.length;
    }
 
  },
  methods: {
    async submit_joke(){
      const joke = {
        'content': this.joke_content,
        'tags': this.selected,
        'author': '',
      }

      const data = await this.$axios.$post(`http://localhost:8080/jokes`,joke);
      console.log(data);
      console.log('joke submitted')
      console.log(joke)
    }
  },
  async fetch() {
    const data = await this.$axios.$get(`http://localhost:8080/tags`)
    this.options = data.map(elem => {
      return {
        text: `#${elem.name}`,
        value: elem.id
      }
    });
    
  }
};
</script>
