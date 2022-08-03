<template>
  <!-- <comment-block  :key="comment.id" :comment="comment" /> -->
    <div :id="`comment-${comment.id}`" class="comment comment-id-5 p-3 rounded">
        <b-row>
            <b-col cols="auto" class="text-center"><b-avatar size="sm" square></b-avatar></b-col>
            <b-col>
                <header class="mb-3">
                    <time class=" pl-2" :datetime="comment.updated_at" :title="comment.updated_at">{{ $moment(comment.updated_at).fromNow() }}</time>
                    <strong>بواسطة 
                        <b-link :to="`/user/${comment.authorUser.username}`" v-if="comment.authorUser">{{ comment.authorUser.username }}</b-link>
                        <b-link :title="`${comment.authorEmail}`" v-else>{{ comment.authorName }}</b-link>
                    </strong>    
                </header>
                <div class="comment-text" v-html="comment.content"></div>
                <footer class="text-left text-muted small"></footer>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    props: {
        comment: {
            type: Object,
            default: null,
        }
    },
}
</script>

<style>

</style>