import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TableList from '../views/Tables/TableList.vue'
import GenreList from '../views/Genre/GenreList.vue'
import DishesList from '../views/Dishes/DishesList.vue'
import DataTable from '../views/DataTableApp.vue'
import TestView from '../views/TestVue.vue'
import ImageList from '../views/Images/ImageList.vue'
import RateList from '../views/Rates/RateList.vue'
import OrderList from '../views/Orders/OrdersList.vue'





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
    path: '/imagelist/:id?',
    name: 'ImageList',
    component: ImageList,
  },
  {
    path: '/ratelist/:id?',
    name: 'RateList',
    component: RateList,
  },
  {
    path: '/orderlist/',
    name: 'OrderList',
    component: OrderList,
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
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
