<template>
	<div>
		<section class="jokes" v-if="joke">
			<blocks-joke-block :key="joke.id" :joke="joke" />
		</section>
		<section v-else-if="joke == {}">
			<div class="alert alert-danger">مافيه نكتة كذا عندنا، إذا تعرفها بالله علمنا عنها</div>
		</section>
		<section v-else>
			<div class="alert alert-warning">ماحصلنا النكتة</div>
		</section>

		<section id="comments">
			<h4 class="mt-5">التعليقات</h4>
			<blocks-comment-form-block :joke="joke" />
			<div class="comments-loop" v-if="comments.length">
				<blocks-comment-block :key="comment.id" :comment="comment" v-for="comment in comments"/>
			</div>
			<div class="comments-loop mb-5" v-else-if="comments.length == 0">
				<div class="alert alert-danger">مافيه تعليقات، اكتب اول تعليق</div>
			</div>
			<div v-else>
				<div class="alert alert-light">جاري سحب التعليقات</div>
			</div>
		</section>
	</div>
</template>

<script>
export default {
	data() {
		return {
			slug: this.$route.params.slug,
			joke: null,
			comments: [],
		};
	},

	async fetch() {
		await this.get_joke();
		await this.get_comments();
	},
	head() {
		return {
			title: this.shorten(this.joke.content, 46, " "),
			meta: [
				{
					hid: "description",
					name: "description",
					content: this.joke.content,
				},
			],
		};
	},
	methods: {
		shorten(str, maxLen, separator = " ") {
			if (str.length <= maxLen) return str;
			return str.substr(0, str.lastIndexOf(separator, maxLen));
		},

		async get_joke() {
			const data = await this.$f6snyApi.getJokeBySlug(this.slug);
			this.joke = data[0];
		},
		async get_comments() {
			// we have to add get comments here.
			const result = await this.$f6snyApi.getComments(this.joke.id);
			this.comments = result.sort((a, b) => {
				if (a.id > b.id) {
					return -1;
				}
				if (b.id > a.id) {
					return 1;
				}
				return 0;
			});
		},
	},
};
</script>