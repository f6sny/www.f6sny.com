<template>
    <div :id="`comment-${comment.id}`" class="comment comment-id-5 p-3 rounded">
        <div class="row">
            <div class="col col-auto text-center">
                <avatar :picture="(comment?.authorUser?.display_picture) ? comment?.authorUser?.display_picture : ``"></avatar>
            </div>   
            <div class="col">
                <header class="mb-3">
                    <time class="ps-2" :datetime="comment.updated_at" :title="comment.updated_at">{{ $moment(comment.updated_at).fromNow() }}</time>
                    <strong>
                        <NuxtLink :to="`/user/${comment.authorUser.username}`" v-if="comment.authorUser">{{ comment.authorUser.username }}</NuxtLink>
                        <a :title="`${comment.authorEmail}`" v-else>{{ comment.authorName }}</a>
                    </strong> 
                </header>
                <div class="comment-text" v-html="comment.content"></div>
                <footer class="text-left text-muted small"></footer>
            </div>
        </div>
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