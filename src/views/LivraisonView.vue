<script setup lang="ts">

import LivraisonComponent from '@/components/LivraisonComponent.vue';
import { onMounted, ref } from 'vue';
import FooterComponent from '@/components/FooterComponent.vue';
import AdminView from './AdminView.vue';
import { Livraison } from '@/models/Livraison';


const mesLivraison = ref<Livraison[]>([]);

onMounted(async () => {
  const livraisonRequest = await fetch('/api/admin/get-livraison', {
      method: 'GET',
      credentials: 'include', 
    });
  const livraison = await livraisonRequest.json();
  mesLivraison.value = [...livraison];
  console.log(mesLivraison.value);
});
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen space-y-6">
    <AdminView />
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="p-3 text-left text-sm font-medium">Numéro de livraison</th>
            <th class="p-3 text-left text-sm font-medium">Signature</th>
          </tr>
        </thead>
        <tbody>
          <LivraisonComponent
            v-for="(element, index) in mesLivraison"
            :livraison="element"
            :key="index"
            class="odd:bg-white even:bg-gray-50"
          />
        </tbody>
      </table>
    </div>
    <FooterComponent />
  </div>
</template>

