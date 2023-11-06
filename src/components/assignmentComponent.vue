<template>
  <div class="card bg-color text-white" >
    <div class="card-body">
      <table class="table text-center table-dark">
        <thead>
          <tr>
            <th scope="col">benar</th>
            <th scope="col">salah</th>
            <th scope="col">tidak menjawab</th>
            <th scope="col">skor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{{ props.assignmentResult.truth }}</th>
            <td>{{ wrongAnswer }}</td>
            <td>{{ notAnswer }}</td>
            <td>{{ score }}</td>
          </tr>
        </tbody>
      </table>  
      <button @click="close" class="btn btn-sm orange border"><i class="bi bi-x-lg"></i></button>
    </div>
  </div>
  <div class="overflow-scroll text-white h-25  w-100 mt-3  bg-color px-3 py-3">
    <div v-for="q in props.assignmentResult.data" :key="q" class="card bg-dark text-white mt-1" >
      <div class="card-body">
        <h5 class="card-title">{{ q.question }}</h5>
        <ul>
          <p class="my-0" v-html="printResult(q.choice,'a')"></p>
          <p class="my-0" v-html="printResult(q.choice,'b')"></p>
          <p class="my-0" v-html="printResult(q.choice,'c')"></p>
          <p class="my-0" v-html="printResult(q.choice,'d')"></p>
          <p class="my-0" v-if="q.choice.hasOwnProperty('null') || q.choice.hasOwnProperty('undefined')"><span class="text-warning">tidak menjawab</span></p>
        </ul>
      </div>
    </div>
 </div>
</template>
<script setup>
import {computed} from 'vue'

const emit = defineEmits(['toggleComponent'])
const props = defineProps({
  assignmentResult:Object
  })
const close =  ()=>{
  emit('toggleComponent')
}

const printResult = (choice, prop) => {
  if (typeof choice[prop] === 'object' && choice[prop].answer === true) {
    return `<span class="text-success">${prop}. ${choice[prop].text}</span>`;
  } else if (typeof choice[prop] === 'object' && choice[prop].answer === false) {
    return `<span class="text-danger">${prop}. ${choice[prop].text} <i class="text-danger bi bi-x"></i></span>`;
  } else {
    return `<span class="text-white">${prop}. ${choice[prop]}</span>`;
  }
};

const wrongAnswer = computed(()=> {
  const removeChoiceNullPropery = props.assignmentResult.data.filter((item) => {
    return !('null' in item.choice)
  })

  const wrongAnswer = removeChoiceNullPropery.reduce((acc,curr)=>{
    for (let prop in curr.choice) {
      if (typeof curr.choice[prop] === 'object' && curr.choice[prop].answer === false) {
        acc +=1
      }
    }
    return acc
  },0)
  
  return wrongAnswer
})

const notAnswer = computed(() =>{
  const notAnswer = props.assignmentResult.data.reduce((acc,curr)=>{
    acc = 'null' in curr.choice === true ? acc + 1 : acc
    return acc
  },0)
  return notAnswer
})

const score = computed(() => {
  const maxScore = 100
  const score = (props.assignmentResult.truth / props.assignmentResult.data.length) * maxScore;
  return score;
})

</script>


<style scoped>
.bg-color {
  background-color: var(--secondDarkBlue);
}

.orange {
  color: var(--orange);
}
</style>
