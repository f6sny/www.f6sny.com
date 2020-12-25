<template>
  <div>
        <section class="jokes" v-if="joke">
            <joke-block  :key="joke.id" :joke="joke" />
        </section>
        <section v-else-if="joke == {}"><b-alert show variant="danger">مافيه نكتة كذا عندنا، إذا تعرفها بالله  علمنا عنها..</b-alert></section>
        <section v-else><b-alert variant="warning" show>ماحصلنا النكتة</b-alert></section>

		<section id="comments">
			<h4 class="mt-5"> التعليقات <br/><small class="text-muted"> التعليقات مسموحة للزوار أيضاً </small></h4>

			<div class="comments-form">
				<b-form-group
					id="comment_field"
					>
					<b-form-textarea
						id="new_comment_box"
						v-model="new_comment"
						rows="2"
						placeholder="Small textarea"
						no-resize
					></b-form-textarea>
					</b-form-group>
					
					<b-form-group
					id="comment_button"
					>
						<b-button type="submit" id="comment_button" name="comment" class="btn-block" variant="success" size="sm">إرسال</b-button>
					</b-form-group>


				
			</div>

			<div class="comments-loop" v-if="comments.length">
				<!-- <comment-block  :key="comment.id" :comment="comment" /> -->
                <div :id="`comment-${comment.id}`" class="comment comment-id-5 p-3 rounded" v-for="comment in comments" v-bind:key="comment.id">
					<b-row>
						<b-col cols="auto" class="text-center"><b-avatar></b-avatar></b-col>
						<b-col>
							<div class="comment-text" v-html="comment.content"></div>
							<footer class="text-left text-muted small">
								<i class="fas fa-flag-alt"></i>
							</footer>
						</b-col>
					</b-row>
				</div>
			</div>
			<div class="comments-loop mb-5" v-else-if="comments.length == 0">
				
				
				<b-alert show variant="danger">مافيه تعليقات، اكتب اول تعليق..</b-alert>
				
			</div>
			<div v-else><h5>جاري سحب التعليقات..</h5></div>

		</section>
  </div>
</template>

<script>
export default {
	data(){
		return {
			slug: this.$route.params.slug,
			joke: null,
			new_comment: "",
			comments: []
		}
	},
    async fetch() {
    const data = await this.$f6snyApi.getJokeBySlug(this.slug) 
    this.joke = data[0]
    console.log(this.joke)
    
    // we have to add get comments here.
    const data2 = await this.$f6snyApi.getComments(this.joke.id)
    this.comments = data2
    console.log(data2)
  },

  methods: {

  }
}
</script>