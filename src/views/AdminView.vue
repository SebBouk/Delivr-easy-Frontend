<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
const router = useRouter();
const route = useRoute();

const logout = () => {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  router.push('/');
};

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

const username = computed(() => {
  const token = getCookie('token');
  if (token) {
    try {
      const user = JSON.parse(atob(token.split('.')[1]));
      return user.NomEmploye || 'Utilisateur';
    } catch (e) {
      console.error('Erreur de décodage du token', e);
      return 'Utilisateur';
    }
  }
  return 'Utilisateur';
});

const isMenuOpen = ref(false);


</script>

<template>

    <div class="hidden md:block text-gray-700">
        <span>Bienvenue, {{ username }}</span>
      </div>
  <nav class="bg-white shadow-md p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-lg font-bold text-blue-500">Delivr'easy</h1>

      <button
        @click="isMenuOpen = !isMenuOpen"
        class="block md:hidden text-gray-700 focus:outline-none"
      >
        ☰
      </button>

      <div
        :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}"
        class="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0"
      >
        <RouterLink to="/admin" class="nav-link block text-gray-700 hover:text-blue-500">Accueil</RouterLink>
        <RouterLink to="/clients" class="nav-link block text-gray-700 hover:text-blue-500">Clients</RouterLink>
        <RouterLink to="/colis" class="nav-link block text-gray-700 hover:text-blue-500">Colis</RouterLink>
        <RouterLink to="/commandes" class="nav-link block text-gray-700 hover:text-blue-500">Commandes</RouterLink>
        <RouterLink to="/livraison" class="nav-link block text-gray-700 hover:text-blue-500">Livraisons</RouterLink>
        <RouterLink to="/Tournee" class="nav-link block text-gray-700 hover:text-blue-500">Tournées</RouterLink>
        <RouterLink to="/Employe" class="nav-link block text-gray-700 hover:text-blue-500">Employés</RouterLink>
        <button
          @click="logout"
          class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full md:w-auto"
        >
          Déconnexion
        </button>
      </div>
    </div>
  </nav>
  <div v-if="route.path === '/admin'">
    <img src="/src/assets/Image_DelivrEasy.jpg" alt="Image de la page d'accueil" class="w-full h-full object-contain">
  </div>

  <RouterView></RouterView>
</template>

<style scoped>
.nav-link {
  transition: color 0.3s ease, background-color 0.3s ease;
}

.nav-link:hover {
  color: #3b82f6; 
  background-color: #f1f5f9; 
}
</style>




