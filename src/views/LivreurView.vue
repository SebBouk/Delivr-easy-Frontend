<script setup lang ="ts">

import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import ColisComponent from '@/components/ColisComponent.vue';
import { Colis } from '@/models/Colis';
import { jwtDecode } from 'jwt-decode';

const router = useRouter();

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
  <div class="p-4 space-y-4">
    <div class="w-full">
      <table class="min-w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="p-2 text-xs sm:text-sm md:text-base">Num Livraison</th>
            <th class="p-2 text-xs sm:text-sm md:text-base">Adresse</th>
            <th class="p-2 text-xs sm:text-sm md:text-base">Contact</th>
            <th class="p-2 text-xs sm:text-sm md:text-base">Date de Livraison</th>
            <th class="p-2 text-xs sm:text-sm md:text-base">Poid</th>
            <th class="p-2 text-xs sm:text-sm md:text-base">Livraison</th>
            <th class="p-2 text-xs sm:text-sm md:text-base">Signature</th>
            <th class="p-2 text-xs sm:text-sm md:text-base"></th>
          </tr>
        </thead>
        <tbody>
          <ColisComponent
            v-for="(element, index) in mesColis"
            :colis="element"
            :key="index"
          />
        </tbody>
      </table>
    </div>
    <button
      @click="logout"
      class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full md:w-auto"
    >
      Déconnexion
    </button>
  </div>
</template>

