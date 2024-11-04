<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const router = useRouter();

const logout = () => {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  router.push('/');
};


const isMenuOpen = ref(false);


</script>

<template>
  <nav class="bg-white shadow-md p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-lg font-bold">Delivr'easy</h1>
      

      <button 
        @click="isMenuOpen = !isMenuOpen"
        class="block md:hidden text-gray-700 focus:outline-none"
      >
        ☰
      </button>
    

      <div :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}" class="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
        <RouterLink to="/admin" class="nav-link block text-gray-700 hover:text-blue-500">Accueil</RouterLink>
        <RouterLink to="/clients" class="nav-link block text-gray-700 hover:text-blue-500">Clients</RouterLink>
        <RouterLink to="/colis" class="nav-link block text-gray-700 hover:text-blue-500">Colis</RouterLink>
        <RouterLink to="/commandes" class="nav-link block text-gray-700 hover:text-blue-500">Commandes</RouterLink>
        <RouterLink to="/livraison" class="nav-link block text-gray-700 hover:text-blue-500">Livraisons</RouterLink>
        <RouterLink to="/Tournee" class="nav-link block text-gray-700 hover:text-blue-500">Tournées</RouterLink>
        <button @click="logout" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full md:w-auto">Déconnexion</button>
      </div>
    </div>
  </nav>
  <RouterView></RouterView>
  <body>
    <div><RouterLink to="/admin/ajoutClient" >Ajouter un Client</RouterLink><RouterLink to="/admin/ajoutColis" >  Ajouter un colis</RouterLink></div>
  </body>
</template>




