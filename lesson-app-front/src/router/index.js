import { createRouter, createWebHistory } from 'vue-router'
import LessonsList from '../view/LessonsList.vue'
import ShoppingList from '../view/ShoppingList.vue'
import NotFoundPage from '../view/NotFoundPage.vue'
import LoginPage from '../view/Login.vue'

const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/Lesson',
    name: 'LessonsList',
    component: LessonsList,
  },
  {
    path: '/Shopping',
    name: 'ShoppingList',
    component: ShoppingList,
  },
  {
    path: '/:catchAll(.*)',
    component: NotFoundPage,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
