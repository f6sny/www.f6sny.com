<template>
  <div>
    <blocks-page-title-block :title="page.title" />
      <div class="content" v-html="$md.render(page.content)">
      </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            page: {
                title: " ",
            },
        };
    },
    head() {
        return {
            title: this.page.title,
            meta: [
                {
                    hid: "description",name: "description",content: this.page.title,
                },
                {
                    name: "keywords",content: this.page.title.split(" ").join(", "),
                },
            ],
        };
    },
    async fetch() {
        await this.getPage();
    },
    methods: {
        async getPage(){
            const page_data = await this.$f6snyApi.pages().getPageBySlug(this.$route.params.slug)
            this.page = page_data[0];
        },
    }
}
</script>

<style>

</style>