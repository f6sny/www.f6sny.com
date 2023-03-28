<template>
  <div :class="`alert alert-${type}`">
    <strong v-if="type == `danger`">خطأ: </strong>
    {{ message }}
  </div>

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