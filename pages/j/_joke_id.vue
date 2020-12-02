<template>
  <div>
        <section class="jokes" v-if="joke">
            <joke-block  :key="joke.id" :joke="joke" />
        </section>
        <section v-else-if="joke == {}"><b-alert show variant="danger">مافيه نكتة كذا عندنا، إذا تعرفها بالله  علمنا عنها..</b-alert></section>
        <section v-else><h5>جاري سحب النكتة..</h5></section>

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
				Hi<!-- <comment-block  :key="comment.id" :comment="comment" /> -->
			</div>
			<div class="comments-loop mb-5" v-else-if="comments.length == 0">
				<div class="comment comment-id-5 p-3 rounded">
					<b-row>
						<b-col cols="auto" class="text-center"><b-avatar></b-avatar></b-col>
						<b-col>
							<div class="comment-text">التعليق مكتوب فيه كلام واجد وكلام شوي
								عاد انت يبيلك تتفاهم معاه وتحط السطور فوق السطور
								وإذا مانفع الموضوع, خل الموضوع حبي بينك وبينهم
							</div>
							<footer class="text-left text-muted small">
								<i class="fas fa-flag-alt"></i>
							</footer>
						</b-col>
					</b-row>
				</div>

				<div class="comment comment-id-5 p-3 rounded">
					<b-row>
						<b-col cols="auto" class="text-center"><b-avatar></b-avatar></b-col>
						<b-col>
							<div class="comment-text">التعليق مكتوب فيه كلام واجد وكلام شوي
								عاد انت يبيلك تتفاهم معاه وتحط السطور فوق السطور
								وإذا مانفع الموضوع, خل الموضوع حبي بينك وبينهم
							</div>
							<footer class="text-left text-muted small">
								<i class="fas fa-flag-alt"></i>
							</footer>
						</b-col>
					</b-row>
				</div>

				<div class="comment comment-id-5 p-3 rounded">
					<b-row>
						<b-col cols="auto" class="text-center"><b-avatar></b-avatar></b-col>
						<b-col>
							<div class="comment-text">التعليق مكتوب فيه كلام واجد وكلام شوي
								عاد انت يبيلك تتفاهم معاه وتحط السطور فوق السطور
								وإذا مانفع الموضوع, خل الموضوع حبي بينك وبينهم
							</div>
							<footer class="text-left text-muted small">
								<i class="fas fa-flag-alt"></i>
							</footer>
						</b-col>
					</b-row>
				</div>
				
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
			joke_id: this.$route.params.joke_id,
			joke: {},
			new_comment: "",
			comments: []
		}
	},
async fetch() {
	const data = await this.$axios.$get(`/jokes/${this.joke_id}`)
	this.joke = data;
  },

  methods: {

  }
}
</script>