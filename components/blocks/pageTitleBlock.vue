<template>
    <!--       
        <blocks-page-title-block :title="`#${tag}`" :description="tag_info.description" :small="`عندنا ${ tag_info.jokes } نكتة تحت تصنيف #${ tag }`" />
    -->
    <div class="page-title mb-3">
        <h1 class="">{{ title }}</h1>
        <p class="p-0 m-0 text-body-secondary" v-if="description">{{ description }}</p>
        <small v-if="small" class="text-body-secondary">{{ small }}</small>
    </div>
</template>

<script>
export default {
    props: ['title', 'description', 'small' ]
}
</script>