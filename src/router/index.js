import { createRouter, createWebHistory } from 'vue-router'
import lessonView from '../views/lessonView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'soal',
      component: lessonView
    },
    {
      path: '/kerjakan-soal',
      name: 'kerjakan-soal',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/KerjakanView.vue')
    }
  ]
})

export default router
