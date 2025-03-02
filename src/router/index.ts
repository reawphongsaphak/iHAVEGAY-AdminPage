import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue' // (Optional) Main page
import CPUPage from '../views/CPUPage.vue' // Import the CPU page component
import RamPage from '../views/RamPage.vue' // Import the RAM page component
import MainboardPage from '../views/MainboardPage.vue' 
import SSDPage from '../views/SSDPage.vue' 
import M2Page from '../views/M2Page.vue' 
import GPUPage from '../views/GPUPage.vue' 
import CasePage from '../views/CasePage.vue'
import PSUPage from '../views/PSUPage.vue' 
import Dashboard from '../views/DashBoard.vue' // Import the Dashboard page component
import User from '../views/user.vue' // Import the User page component

const routes = [
  { path: '/', component: HomePage }, // Default route (optional)
  { path: '/cpu', component: CPUPage },
  { path: '/ram', component: RamPage},
  { path: '/mainboard', component: MainboardPage},
  { path: '/ssd', component: SSDPage},
  { path: '/m2', component: M2Page},
  { path: '/gpu', component: GPUPage}, 
  { path: '/case', component: CasePage},
  { path: '/psu', component: PSUPage},
  { path: '/dashboard', component: Dashboard},
  { path: '/user', component: User},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
