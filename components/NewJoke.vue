<template>
  <b-modal id="jokeModal" size="xl" scrollable centered>
    <template #modal-title>عندك نكتة؟</template>
    <template #modal-footer>
      <b-button type="submit" variant="success">Register</b-button>
      <b-button variant="secondary" @click="show = false">Close</b-button>
    </template>
    <form>
      <div class="user-info text-left">
        <small>سيتم نشر النكتة بإسم: زائر | <a href="#">مساعدة؟</a></small>
      </div>
      <div class="joke-content">
        <div class="form-group">
          <textarea class="form-control" id="jokeContent" rows="6"></textarea>
        </div>
      </div>
      <div class="characters-info text-left">
        <small>عدد الحروف: 9</small>
      </div>
      <div class="categories-info">
        <b-form-group label="Tagged input using select">
          <!-- prop `add-on-change` is needed to enable adding tags vie the `change` event -->
          <b-form-tags v-model="value" size="lg" add-on-change no-outer-focus class="mb-2">
            <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
              <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
                <li v-for="tag in tags" :key="tag" class="list-inline-item">
                  <b-form-tag @remove="removeTag(tag)" :title="tag" :disabled="disabled" variant="info">{{ tag }}</b-form-tag>
                </li>
              </ul>
              <b-form-select v-bind="inputAttrs" v-on="inputHandlers" :disabled="disabled || availableOptions.length === 0" :options="availableOptions">
                <template #first>
                  <!-- This is required to prevent bugs with Safari -->
                  <option disabled value="">Choose a tag...</option>
                </template>
              </b-form-select>
            </template>
          </b-form-tags>
        </b-form-group>

        <b-form-group label="لازم تختار تصنيف واحد عالأقل:">
          <b-form-checkbox-group
            id="checkbox-group-1"
            v-model="selected"
            :options="options"
            name="tags"
          ></b-form-checkbox-group>
        </b-form-group>
      </div>
    </form>
  </b-modal>
</template>
<script>
export default {
  data() {
    return {
      selected: [],
      options: [],
      value: [],
      tags: [],
    };
  },
  computed: {
      availableOptions() {
        return this.options.filter(opt => this.value.indexOf(opt) === -1)
      }
    },
  mounted() {
    fetch("http://localhost:8080/tags", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        this.options = data.map(function(elem) {
          return {
            text: `#${elem.name}`,
            value: elem.id
          };
        });
      });
  }
};
</script>
