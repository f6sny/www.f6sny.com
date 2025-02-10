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
		this.$nuxt.$emit('joke-loaded', this.joke);
	},
	mounted() {
  this.$nuxt.$on('joke-loaded', this.get_comments);
},
	head() {
		if (!this.joke) return {};
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
		shorten(text, maxLen, separator = " ") {
			if (text.length <= maxLen) return text;
			return text.substr(0, text.lastIndexOf(separator, maxLen));
		},

		async get_joke() {
			const data = await this.$f6snyApi.jokes().getJokeBySlug(this.slug);
			this.joke = data[0];
		},
		async get_comments() {
			// we have to add get comments here.
			const result = await this.$f6snyApi.comments().getJokeComments(this.joke.id);
			this.comments = this.quickSort(result);
		},
		quickSort(array) {
			if (array.length <= 1) {
				return array;
			}

			const pivotIndex = Math.floor(array.length / 2);
			const pivot = array[pivotIndex];
			const left = [];
			const right = [];

			for (let i = 0; i < array.length; i++) {
				if (i === pivotIndex) {
				continue;
				}

				if (array[i].id > pivot.id) {
				right.push(array[i]);
				} else {
				left.push(array[i]);
				}
			}

			return this.quickSort(right).concat([pivot], this.quickSort(left));
		},

	},
};
</script>