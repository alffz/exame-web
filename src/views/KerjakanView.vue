<template>
  <div class="container-fluid bg-color">
    <div class="row vh-100">
      <div class="col-md-3 d-flex justify-content-cednter align-items-center">
        <SidebarComponent></SidebarComponent>
      </div>
      <div class="col-md-9 d-flex jus">
        <kerjakanComponent></kerjakanComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import SidebarComponent from '../components/SidebarComponent.vue'
import kerjakanComponent from '../components/kerjakanComponent.vue'
</script>

<style scoped>
.container-fluid.bg-color {
  background-color: var(--darkBlue);
}

.container-fluid .row .col-md-3 {
  background-color: var(--dark);
  background-image: linear-gradient(to right, var(--lightDark), var(--darkBlue));
}
</style>
