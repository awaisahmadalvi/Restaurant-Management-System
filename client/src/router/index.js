import { createRouter, createWebHistory } from 'vue-router'
import GenreList from '../views/GenreList.vue'
import TableList from '../views/TableList.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: TableList
  },
  {
    path: '/tables',
    name: 'Tables',
    component: TableList
  },
  {
    path: '/genre',
    name: 'Genre',
    component: GenreList
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
