<template>
  <div class="container-fluid bg-color">
    <div class="row vh-100">
      <div class="col-md-3 d-flex align-items-center">
        <SidebarComponent></SidebarComponent>
      </div>
      <div v-if="defaultContent" class="col-md-9 d-flex align-items-center">
        <template v-if="totalLessons > 0">
          <button @click="openSecondComponent" class="btn btn-sm btn-success"><i class="bi bi-plus"></i></button>
          <div  class="overflow-auto text-white h-25 w-75 mx-5 px-5 my-5 border ">
            <div v-for="lesson in lessons" :key="lesson" class="custom-element w-100 d-flex justify-content-between align-items-center" >
              <strong class="px-1">{{ lesson.name }}</strong>
              <div>
                <button @click="editLesson({button:`edit`,id:lesson.id})" class="btn btn-sm btn-primary mx-1"><i class="bi bi-pen-fill"></i></button>
                <button @click="removeLesson(lesson.id)" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        </template>
        <tamplate v-else class="col-md-9 d-flex align-items-center vh-50">
          <button @click="openSecondComponent" class="btn btn-sm btn-success m"><i class="bi bi-plus"></i></button>
          <div  class="text-white h-100  w-75 mx-5 my-5 " >
            <strong class="text-white">Upss Pelajaran gak ada</strong>
          </div>
        </tamplate>
      </div>
        <lessonComponent v-if="lessonComponenStatus" @toggleComponent="toggleComponent" @resetButton="resetButton" @updateDom="getLesson" :typeButton="typeButton" :lessonId="lessonId"></lessonComponent>
    </div>
  </div>
</template>

<script setup>
import SidebarComponent from '../components/SidebarComponent.vue'
import lessonComponent from '../components/lessonComponent.vue'
import { ref,onMounted } from 'vue'
import axios from 'axios';
import { showAlert } from '../utils/utils.js';

const defaultContent = ref(true)
const lessonComponenStatus = ref(false)
const lessons = ref()
const totalLessons = ref(0)

const openSecondComponent = ()=>{
  defaultContent.value = false
  lessonComponenStatus.value = true
}
const toggleComponent = ()=>{
  defaultContent.value = true
  lessonComponenStatus.value = false
}

const resetButton = ()=>{
  typeButton.value = 'add'
}

const getLesson = async ()=>{
  try{
    const result = await axios.get('lesson')
    if(result.status === 200){
      totalLessons.value = result.data.data.length
      lessons.value = result.data.data
      return
    }else{
      totalLessons.value = 0
      return showAlert({message:"upss... ada yang salah",background:"alert-warning"})
    }
  }catch (err){
    return showAlert({message:err.response.data.errors,background:"alert-warning"})
  }
}

const removeLesson = async (id)=>{
  try{
    const result = await axios.delete('lesson/'+id)
    if(result.status === 200){
      await getLesson()
      return showAlert({message:"Pelajaran dihapus",background:"alert-success"})
    }else{
      return showAlert({message:"upss... ada yang salah",background:"alert-warning"})
    }
  }catch (err){
    return showAlert({message:err.response.data.errors,background:"alert-warning"})
  }
}

const typeButton = ref('add')
const lessonId = ref()
const editLesson = ({button,id})=>{
  typeButton.value = button
  lessonId.value = id
  openSecondComponent()
}

onMounted( async() => {
  await getLesson()
})

</script>

<style scoped>
.container-fluid.bg-color {
  background-color: var(--darkBlue);
}

.container-fluid .row .col-md-3 {
  background-color: var(--dark);
  background-image: linear-gradient(to right, var(--lightDark), var(--darkBlue));
}

.custom-element {
  background-color: var(--darkBlue); /* Background color for danger alerts */
  color: var(--orange); /* Text color for danger alerts */
  border: 1px solid #f5c6cb; /* Border color for danger alerts */
  border-radius: 15px;
  padding: 5px;
  margin: 5px;
}
</style>
