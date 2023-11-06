<template>
  <div class="col bg-color d-flex justify-content-center align-items-center">
    <div class="fs-1">
      <RouterLink
        :to="{ name: 'soal' }"
        class="list-group-item "
      >
        Soal</RouterLink
      >
      <RouterLink :to="{ name: 'kerjakan-soal' }" class="list-group-item ">
        Kerjakan Soal</RouterLink
      >
    </div>
  </div>
</template>
<script setup>
import { RouterLink } from 'vue-router'

</script>
<style scoped>
a.router-link-active.router-link-exact-active{
    color:var(--orange)
}
a.list-group-item{
    color: var(--lightBlue);
}
</style>
