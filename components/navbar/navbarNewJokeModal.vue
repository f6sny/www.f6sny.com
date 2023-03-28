<template>
    <div class="modal fade" id="jokeModal" tabindex="-1" aria-labelledby="jokeModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="jokeModalLabel">عندك نكتة؟</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <Notification v-if="success" type="success" :message="success" />
              <Notification v-if="error" type="danger" :message="error" />
              
              <div class="collapse" id="new_joke_help">
                <div class="alert alert-warning">
                  <ul class="list-unstyled p-0 m-0 fs-6">
                      <li><strong>مبادئ لازم نعرفها كويس:</strong>
                      <ul>
                          <li>تبدا النكتة دائماً بكلمة<mark> يقول لك,</mark> وفاصلة</li>
                          <li>اكتب النكتة بدون زخرفة ومدات وشخطات وخذ راحتك</li>
                      </ul>
                      </li>
                      <li><strong>النشر:</strong>جميع النكت لازم تمر على <a href="https://www.f6sny.com/moderate">المراقبة</a> قبل لا يتم نشرها ف لا تنقد علينا إذا ماطلعت على طول!</li>
                  </ul>
                </div>
              </div>
              
              <div class="user-info text-start p-1">
                  <small>سيتم نشر النكتة بإسم: <span class="username text-nowrap bg-body-secondary border">{{isAuthenticated ? loggedInUser.username : 'زائر'}}</span> | <a data-bs-toggle="collapse" href="#new_joke_help" role="button" aria-expanded="false" aria-controls="new_joke_help">مساعدة؟</a></small>
              </div>

              <div class="joke-content">
                  <div class="form-group">
                    <textarea v-model="joke_content" placeholder="يقول لك، " class="form-control" id="jokeContent" rows="6"></textarea>
                  </div>
              </div>

              <div class="characters-info text-start"><small>عدد الحروف: {{ textarea_counter }}</small></div>

              <div class="tags-info p-2">
                <div>لازم تختار تصنيف واحد عالأقل:</div>
                <div>
                  <div class="form-check form-check-inline" v-bind:key="option.value" v-for="option in options">
                    <label class="form-check-label" :for="`inlineCheckbox-${option.value}`">{{option.text}}</label>
                    <input class="form-check-input input-sm" type="checkbox" :id="`inlineCheckbox-${option.value}`" :value="`option-${option.value}`" v-model="selected">
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer flex-row-reverse">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
            <button type="button" class="btn btn-success" @click="submit_joke()">إرسال</button>
          </div>
        </div>
      </div>
    </div>
</template>


<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      selected: [],
      options: [],
      success: null,
      error: null,
      joke_content: 'يقول لك، ',
      text_area_characters_count: 0,
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
    textarea_counter(){
      this.text_area_characters_count = this.joke_content.length;
      return this.joke_content.length;
    }
 
  },
  methods: {
    async submit_joke(){
        try {
            const joke = {
                'content': this.joke_content,
                'tags': this.selected,
            }

            const data = await this.$f6snyApi.postJoke(joke);

            console.log('joke submitted');
            console.log(data);

            this.success = "هههههههههه حلوة حلوة هات غيرها بالله";

            this.$store.dispatch('updateCounters')

            this.joke_content= 'يقول لك، ';
            this.selected= [];
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.success = null;
        } 
        catch (error) {
            this.error = error.response.data.message;
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.error = null;
        }
    },
  },
  async fetch() {
    const data = await this.$f6snyApi.getTags();
    this.options = data.map(element => {
      return {
        text: `#${element.title}`,
        value: element.id
      }
    });
  }
};
</script>
