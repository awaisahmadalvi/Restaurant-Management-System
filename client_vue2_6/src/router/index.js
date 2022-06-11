import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TableList from '../views/Tables/TableList.vue'
import GenreList from '../views/Genre/GenreList.vue'
import DishesList from '../views/Dishes/DishesList.vue'
import ImagesList from '../views/Dishes/Images/ImageList.vue'
import DataTable from '../views/DataTableApp.vue'
import TestView from '../views/TestVue.vue'
import ImageList from '../views/Dishes/Images/ImageList.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/tables',
    name: 'Tables',
    component: TableList
  },
  {
    path: '/genre',
    name: 'Genres',
    component: GenreList
  },
  {
    path: '/dishes',
    name: 'Dishes',
    component: DishesList
  },
  {
    path: '/images',
    name: 'Images',
    component: ImagesList
  },
  {
    path: '/datatable',
    name: 'Data Table',
    component: DataTable
  },
  {
    path: '/test',
    name: 'TestView',
    component: TestView
  },
  {
    path: '/imagelist/:id?',
    name: 'ImageList',
    component: ImageList,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
