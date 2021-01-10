<template>
  <b-modal id="jokeModal" size="xl" scrollable centered>
        <template #modal-title>عندك نكتة؟</template>
        <template #modal-footer><b-button type="submit" variant="success" block @click="submit_joke()">إرسال</b-button></template>
        
        <Notification v-if="success" type="success" :message="success" />
        <Notification v-if="error" type="danger" :message="error" />
        <form >
            <b-collapse id="new_joke_help" class="mt-2">
                <b-alert show variant="warning">
                    <ul class="list-unstyled p-0 m-0">
                        <li><strong>مبادئ لازم نعرفها كويس:</strong>
                        <ul>
                            <li>تبدا النكتة دائماً بكلمة<mark> يقول لك,</mark> وفاصلة</li>
                            <li>اكتب النكتة بدون زخرفة ومدات وشخطات وخذ راحتك</li>
                        </ul>
                        </li>
                        <li><strong>النشر:</strong>جميع النكت لازم تمر على <a href="https://www.f6sny.com/moderate">المراقبة</a> قبل لا يتم نشرها ف لا تنقد علينا إذا ماطلعت على طول!</li>
                    </ul>
                </b-alert>
            </b-collapse>

        <div class="user-info text-left">
            
            <small>سيتم نشر النكتة بإسم: <mark v-if="isAuthenticated">{{ loggedInUser.username }}</mark><mark v-else>زائر</mark> | <a href="#" v-b-toggle.new_joke_help>مساعدة؟</a></small>
        </div>

        <div class="joke-content">
            <div class="form-group">
            <textarea v-model="joke_content" placeholder="يقول لك، " class="form-control" id="jokeContent" rows="6"></textarea>
            </div>
        </div>

        <div class="characters-info text-left"><small>عدد الحروف: {{ textarea_counter }}</small></div>

        <div class="tags-info">
            <b-form-group label="لازم تختار تصنيف واحد عالأقل:">
                <b-form-checkbox-group id="checkbox-group-1" v-model="selected" :options="options" size="sm" name="tags"></b-form-checkbox-group>
            </b-form-group>
        </div>
        </form>
    </b-modal>
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
    this.options = data.map(elem => {
      return {
        text: `#${elem.title}`,
        value: elem.id
      }
    });
  }
};
</script>
