import { createRouter, createWebHistory } from 'vue-router'
import LessonsList from '../view/LessonsList.vue'
import ShoppingList from '../view/ShoppingList.vue'
const routes = [
    {
        path: '/',
        name: 'LessonsList',
        component: LessonsList
    },
    {
        path: '/Shopping',
        name: 'ShoppingList',
        component: ShoppingList,
    }
]


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
