<template>
    <!--       
        <blocks-page-title-block :title="`#${tag}`" :description="tag_info.description" :small="`عندنا ${ tag_info.jokes } نكتة تحت تصنيف #${ tag }`" />
    -->
    <div class="page-title">
        <h1 class="">{{ title }}</h1>
        <p class="p-0 m-0" v-if="description">{{ description }}</p>
        <small v-if="small" class="text-muted">{{ small }}</small>
        <hr />
    </div>
</template>

<script>
export default {
    props: ['title', 'description', 'small' ]
}
</script>

<style>

</style>