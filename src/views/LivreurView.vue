<script setup lang ="ts">

import { useRouter } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import ColisComponent from '@/components/ColisComponent.vue';
import { Colis } from '@/models/Colis';
import { jwtDecode } from 'jwt-decode';

const router = useRouter();

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

const logout = () => {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  router.push('/');
};

function getIdEmployeFromCookie(): string | null {
  const cookies = document.cookie.split('; ').map(cookie => cookie.trim());
  const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
  console.log('Cookie trouvé :', tokenCookie);
  if (!tokenCookie) return null;

  const token = tokenCookie.split('=')[1];
  try {
    const decodedToken = jwtDecode<{ IdEmploye: string }>(token);
    console.log('Token décodé :', decodedToken);
    return decodedToken.IdEmploye;
  } catch (error) {
    console.error('Erreur lors du décodage du token :', error);
    return null;
  }
}

const mesColis = ref<Colis[]>([]);

onMounted(async () => {
  const idEmploye = getIdEmployeFromCookie();
  if (!idEmploye) {
    console.error('IdEmploye non trouvé dans le cookie');
    return;
  }

  try {

    const colisRequest = await fetch(`/api/livreur/get-colis/${idEmploye}`, {
  method: 'GET',
  credentials: 'include' });

    const colis = await colisRequest.json();
    mesColis.value = [...colis];
    console.log(mesColis.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des colis :', error);
  }
});

</script>

<template>
   <div class="hidden md:block text-gray-700">
        <span>Bienvenue, {{ username }}</span>
      </div>
  <div class="p-6 space-y-6 bg-gray-100 min-h-screen">
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="p-3 text-left text-xs sm:text-sm md:text-base font-medium">Num Livraison</th>
            <th class="p-3 text-left text-xs sm:text-sm md:text-base font-medium">Adresse</th>
            <th class="p-3 text-left text-xs sm:text-sm md:text-base font-medium">Contact</th>
            <th class="p-3 text-left text-xs sm:text-sm md:text-base font-medium">Date de Livraison</th>
            <th class="p-3 text-left text-xs sm:text-sm md:text-base font-medium">Poids</th>
            <th class="p-3 text-left text-xs sm:text-sm md:text-base font-medium">Livraison</th>
            <th class="p-3 text-left text-xs sm:text-sm md:text-base font-medium">Signature</th>
            <th class="p-3 text-left text-xs sm:text-sm md:text-base font-medium"></th>
          </tr>
        </thead>
        <tbody>
          <ColisComponent
            v-for="(element, index) in mesColis"
            :colis="element"
            :key="index"
            class="odd:bg-white even:bg-gray-50"
          />
        </tbody>
      </table>
    </div>
    <button
      @click="logout"
      class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all w-full md:w-auto"
    >
      Déconnexion
    </button>
  
  </div>
</template>

