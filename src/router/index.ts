import { createRouter, createWebHistory } from 'vue-router'
import CPUPage from '../views/CPUPage.vue' // Import the CPU page component
import HomePage from '../views/HomePage.vue' // (Optional) Main page
import RamPage from '../views/RamPage.vue' // Import the RAM page component
import Dashboard from '../views/DashBoard.vue' // Import the Dashboard page component
import User from '../views/user.vue' // Import the User page component

const routes = [
  { path: '/', component: HomePage }, // Default route (optional)
  { path: '/cpu', component: CPUPage },
  {path: '/ram', component: RamPage},
  {path: '/dashboard', component: Dashboard},
  {path: '/user', component: User},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
