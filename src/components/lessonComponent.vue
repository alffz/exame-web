<template>
  <div class="col-md-9 vh-100 text-white">
    <div class="container-flud">
      <div class="row d-flex justify-content-between align-items-center">
        <div class="col-4">
          <div class="card rounded-5 mt-3"> 
            <div class="card-body d-flex justify-content-between align-items-center">
                <div class="mb-3">
                  <label for="pelajaran" class="form-label text-light-red">Nama pelajaran </label>
                  <input v-model="lesson" type="text" class="form-control" id="pelajaran" placeholder="Matematika" >
                  <small class="text-white">Total soal : {{ totalQuestions }} </small>
                </div>
                <div class="row ms-1">
                  <div class="col-12">
                    <button v-if="props.typeButton === 'edit'" @click="editLesson" class="btn btn-sm btn-success w-75">Edit</button>
                    <button v-else @click="saveLesson" class="btn btn-sm btn-success w-75">Simpan</button>
                  </div>
                  <div class="col-12">
                    <button @click="cancle" class="btn btn-sm btn-secondary my-1 w-75">Batal</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-8 vh-100"> 
          <div class="overflow-auto text-white vh-100  w-100 mx-1 my-1  border-dark">
            <div v-for="(question,index) in questions" :key="question" class="card rounded-5 mt-3" >
              <div class="card-body text-light-red">
                <p class="text-white">{{ index + 1 }}</p>
                <form>
                  <div class="mb-3">
                    <textarea v-model="question.question" type="text" class="form-control"  placeholder="tulis soal ..."> </textarea>
                  </div>
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">A </span>
                    <input v-model="question.choice.a" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                  </div>
                  <div  class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">B</span>
                    <input v-model="question.choice.b" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                  </div>
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">C</span>
                    <input v-model="question.choice.c" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                  </div>
                  <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">D</span>
                    <input v-model="question.choice.d" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                  </div>
                  <select v-model="question.answer" class="form-select" aria-label="Default select example">
                    <option disabled selected class="text-success">Pilih jawaban</option>
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                  </select>
                </form>
              </div>
              <div class="card-footer d-flex justify-content-center">
                <button @click="pushElement(index)" class="btn btn-sm btn-primary mx-1" ><i class="bi bi-plus"></i></button>
                <button v-if="totalQuestions === 1" class="btn btn-sm btn-danger" disabled ><i class="bi bi-trash"></i></button>
                <button v-else @click="deleteElement(index)" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import {ref,computed, onMounted} from 'vue'
  import axios from 'axios';
  import { showAlert } from '../utils/utils.js';

  const emit = defineEmits(['updateDom','toggleComponent'])
  const lesson = ref('')
  const questions = ref([{
      "question": null,
      "choice": {
        "a": null,
        "b": null,
        "c": null,
        "d": null
      },
      "answer":null
    }
  ])
  const props = defineProps({
    typeButton:String,
    lessonId:Number
  })
  const totalQuestions = computed(() => {
    return questions.value.length
  })

  onMounted( async ()=>{
    if(props.typeButton === 'edit'){
      try{
        const result = await axios.get('lesson/'+props.lessonId)
        if(result.status === 200){
          lesson.value = result.data.data.name
          return questions.value = result.data.data.questions
      }
      }catch (err){
        showAlert({message:err.response.data.errors,background:"alert-warning"})
      }
    }
  })

  const pushElement = (index)=>{
    const question =     {
      "question": null,
      "choice": {
        "a": null,
        "b": null,
        "c": null,
        "d": null
      },
      "answer": null
    }
    const indexQuestion = index + 1
    return questions.value.splice(indexQuestion,0,question)
  }

  const deleteElement = (index)=>{
    return questions.value.splice(index,1)
  }

  const saveLesson = async ()=>{
    try{
      const data = {
        name:lesson.value,
        questions:questions.value
      }
      const result = await axios.post('lesson',data)
      if(result.status === 200){
        showAlert({message:"Pelajaran ditambahkan",background:"alert-success"})
        emit('updateDom')
        emit('toggleComponent')
      }
    }catch (err){
      showAlert({message:err.response.data.errors,background:"alert-warning"})
    }
  }

  const cancle = ()=>{
     emit('toggleComponent')
     return emit('resetButton')
  }
  
  const editLesson = async ()=>{
      try{
        const data = {
          name : lesson.value,
          questions : questions.value
        }
        const result = await axios.put('lesson/'+props.lessonId,data)
        if(result.status === 200){
          showAlert({message:"Pelajaran diedit",background:"alert-success"})
          emit('updateDom')
          emit('toggleComponent')
          emit('resetButton')
        }
      }catch (err){
        showAlert({message:err.response.data.errors,background:"alert-warning"})
      }
  }

</script>
<style scoped>
@import '/src/assets/main.css';

.container-fluid .card {
  background-color: var(--secondDarkBlue);
}

.text-light-red{
  color: var(--lightRed);
}
.text-coklat{
  color: var(--coklate);
}
</style>
