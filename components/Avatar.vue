<template>
    <div class="d-inline text-center avatar">
        <img :src="(picture ? picture : 'https://placeholder.pics/svg/35')" height="35px" class="rounded-circle" alt="...">
    </div>
</template>

<script>
export default {
    props: {
        picture: {
            type: String,
            default: 'null',
        }
    },
}
</script>
