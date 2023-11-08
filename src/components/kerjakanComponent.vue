<template>
  <div v-if="showQuestion" class="row vh-100 d-flex align-items-center">
    <div class="col-sm-8 col-md-8 mb-3 mb-sm-0 v">
        <div class="mb-3 text-whites">
          <label class="form-check-label text-white mb-3">Pilih soal</label>
          <select v-model="lessonId" class="form-select" aria-label="Default select example">
            <option v-for="lesson in lessons" :key="lesson" :value="lesson.id">{{ lesson.name }}</option>
          </select>
          <button  @click="getLessonById" class="btn btn-sm btn-primary mt-1"><i class="bi bi-check2"></i></button>
        </div>
      <div v-if="isLessonSelected" class="card text-white" style="width: 670px;">
        <div class="card-body">
          <h5 class="text-light-red">{{ questionsIndex + 1 }}</h5>
          <h5 class="card-title">{{ currentQuestion.question }}</h5>
          <div class="form-check" >
            <input @click="answeredQuestion(questionsIndex,'a')" :checked="currentQuestion?.answers == 'a'" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
            <label class="form-check-label" for="flexRadioDefault1">
              {{ currentQuestion.choice.a }}
            </label>
          </div>
          <div class="form-check" >
            <input @click="answeredQuestion(questionsIndex,'b')" :checked="currentQuestion?.answers == 'b'" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
            <label class="form-check-label" for="flexRadioDefault1">
              {{ currentQuestion.choice.b }}
            </label>
          </div>
          <div class="form-check" @click="answeredQuestion(questionsIndex,'c')">
            <input @click="answeredQuestion(questionsIndex,'c')" :checked="currentQuestion?.answers == 'c'" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
            <label class="form-check-label" for="flexRadioDefault1">
              {{ currentQuestion.choice.c }}
            </label>
          </div>
          <div class="form-check" @click="answeredQuestion(questionsIndex,'d')">
            <input @click="answeredQuestion(questionsIndex,'d')" :checked="currentQuestion?.answers == 'd'" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
            <label class="form-check-label" for="flexRadioDefault1">
              {{ currentQuestion.choice.d }}
            </label>
          </div>
        </div>
        <div class="card-footer  d-flex justify-content-start">
          <button v-if="questionsIndex === 0" class="btn btn-sm btn-primary mx-1" disabled><i class="bi bi-caret-left"></i></button>
          <button v-else @click="previous(questionsIndex)" class="btn btn-sm btn-primary mx-1" ><i class="bi bi-caret-left"></i></button>
          <button v-if="questionsIndex === (totalQuestions-1)" @click="submit" class="btn btn-sm btn-success mx-1" ><i class="bi bi-send"></i></button>
          <button v-else @click="next(questionsIndex)" class="btn btn-sm btn-primary mx-1" ><i class="bi bi-caret-right"></i></button>
        </div>
      </div>
      <div v-else class="card text-white">
        <div class="card-body place">
          <h5 class="card-title">Soal Belum Dipilih</h5>
          <div class="placeholder-text">
          <p>d</p>
          <p>d</p>
          <p>o</p>
          <p>d</p>
          <p></p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLessonSelected" class="col-sm-4 col-md-4 ">
      <div class="card text-white " style="width: 300px;">
        <div class="card-body w-100">
          <button v-for="(q, index) in questions" :key="q" @click="toQuestion(index)" :class="{ 'btn-primary': q.done, 'btn-secondary': !q.done }" class="btn btn-sm rounded-2 ms-2 mt-2">{{ index + 1 }}</button>
        </div>
      </div>
    </div>
    <div v-else class="col-sm-4 col-md-4 ">
      <div class="card text-white w-100">
        <div class="card-body">
          <h5 class="placeholder-text">Place holder text adipisicing elit. Provident quasi dolor nam possimus asperiores quam?  Temporibus, dolor odio? Autem, eligendi?</h5>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showAssignment" class="row w-100 vh-100 ">
    <div class="col-sm-12 col-md-12 mb-3 mb-sm-0 mt-3">
      <assignmentComponent @toggleComponent="toggleComponent" :assignmentResult="assignmentResult"></assignmentComponent>
    </div>
  </div>
</template>
<script setup>
import assignmentComponent from '../components/assignmentComponent.vue'
import { ref,onMounted } from 'vue'
import axios from 'axios';
import { showAlert } from '../utils/utils.js';

 const showQuestion = ref(true)
 const showAssignment = ref(false)
 const lessons = ref()
 const lessonId = ref()
 const questionsIndex = ref()
 const questions = ref()
 const isLessonSelected = ref(false)
 const currentQuestion = ref({})
 const totalQuestions = ref()
 const assignmentResult = ref()

const getLesson = async ()=>{
  try{
    const result = await axios.get('lesson')
    if(result.status === 200){
      return lessons.value = result.data.data
    }
  }catch (err){
    return showAlert({message:err.response.data.errors,background:"alert-warning"})
  }
}

const getLessonById = async ()=>{
  try{
    const result = await axios.get('lesson/'+lessonId.value+"?exame=true")
    if(result.status === 200){
      questionsIndex.value = 0
      questions.value = result.data.data.questions
      currentQuestion.value = result.data.data.questions[questionsIndex.value] 
      totalQuestions.value = result.data.data.questions.length
      return isLessonSelected.value = true
    }
  }catch (err){
    showAlert({message:err.response.data.errors,background:"alert-warning"})
  }
}

 const answeredQuestion = (index,answers)=>{
  questions.value[index].answers = answers
  questions.value[index].done = true
}

 const previous = (index)=>{
  currentQuestion.value = questions.value[index - 1]
  questionsIndex.value -= 1
}

 const next = (index)=>{
  currentQuestion.value = questions.value[index + 1]
  questionsIndex.value += 1
}

 const toQuestion = (index)=>{
  currentQuestion.value = questions.value[index]
  questionsIndex.value = index
}

 const submit = async ()=>{
  try{
    const answered = questions.value.reduce((acc,question) =>{
      const id = question.id
      const answers = question?.answers || null
      acc[id] = answers
      return acc
    },{})

    const result = await axios.post('lesson/'+lessonId.value+"/submit",answered)
    if(result.status === 200){
      showQuestion.value = false
      showAssignment.value = true
      assignmentResult.value = result.data.data
    }
  }catch (err){
    showAlert({message:err.response.data.errors,background:"alert-warning"})
  }
}

 const toggleComponent = ()=>{
  showQuestion.value = true
  showAssignment.value = false
}

onMounted(async()=>{
  await getLesson()
})
</script>

<style scoped>
@import '/src/assets/main.css';

.container-fluid .card {
  background-color: var(--secondDarkBlue);
}

.text-light-red {
  color: var(--lightRed);
}
.text-coklat {
  color: var(--coklate);
}

.placeholder-text {
  color: var(--secondDarkBlue);;
}
</style>
