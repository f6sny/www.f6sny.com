<template>
  <b-alert fade :variant="`${type}`" show>
    <strong v-if="type == `danger`">خطأ: </strong>
    {{ message }}
  </b-alert>
</template>

<script>
export default {
  name: "Notification",
  props: {
    type: {
      type: String,
      default: "success",
      validator: (val) => ["danger", "success"].includes(val),
    },
    message: {
      type: String,
      default: "",
    },
  },
};
</script>