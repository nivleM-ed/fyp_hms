
// GeneralViews
import NotFound from '../pages/NotFoundPage.vue'
import DashboardLayout from '../layout/DashboardLayout.vue'

// Admin pages
// import Overview from 'src/pages/Overview.vue'
import Login from '@/pages/Login.vue'
import MainOverview from '@/pages/MainOverview.vue'

import DataEntryRecipe from '@/pages/Recipe/DataEntryRecipe.vue'
import SearchRecipe from '@/pages/Recipe/SearchRecipe.vue'
import ViewRecipe from '@/pages/Recipe/ViewRecipe.vue'

import InventoryOverview from '@/pages/Inventory/InventoryOverview.vue'
import FoodInventory from '@/pages/Inventory/FoodInventory.vue'
import HomeAssets from '@/pages/Inventory/HomeAssets.vue'

import TaskOverview from '@/pages/Task/TaskOverview.vue'

import ExpensesOverview from '@/pages/Expenses/ExpensesOverview.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/main',
    component: DashboardLayout,
    redirect: '/main/overview',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: MainOverview
      },
      //Recipe
      {
        path: 'dataentry_recipe',
        name: 'dataEntryRecipe',
        component: DataEntryRecipe
      },
      {
        path: 'search_recipe',
        name: 'SearchRecipe',
        component: SearchRecipe
      },
      {
        path: 'view_recipe',
        name: 'ViewRecipe',
        component: ViewRecipe
      },
      //Inventory
      {
        path: 'inv_ov',
        name: 'InventoryOverview',
        component: InventoryOverview
      },
      {
        path: 'inv_food',
        name: 'FoodInventory',
        component: FoodInventory
      },
      {
        path: 'inv_assets',
        name: 'HomeAssets',
        component: HomeAssets
      },
      //Task
      {
        path: 'task_ov',
        name: 'TaskOverview',
        component: TaskOverview
      },
      //Expenses
      {
        path: 'expense_ov',
        name: 'ExpensesOverview',
        component: ExpensesOverview
      },
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
