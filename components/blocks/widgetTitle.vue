<template>
	<div class="widget-title mb-3">
		<h4 :class="myclass">{{ title }}</h4>
		<hr class="mt-0 mb-3" />
	</div>
</template>

<script> 
export default {
    props: {
        title: String,
        myclass: {
            type: String,
            default: "h4"
        },

    }
}
</script>