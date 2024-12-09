import { isAuthenticated } from '~/shared/is-authenticated';

export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/login' && to.path !== '/register' && !isAuthenticated()) {
    return navigateTo('/login');
  }

  if ((to.path === '/login' || to.path === '/register') && isAuthenticated()) {
    return navigateTo('/dashboard');
  }

});
