<script setup lang="ts">
import { Colis } from '../models/Colis';
import ColisComponent from '@/components/ColisComponent.vue';
import { onMounted, ref } from 'vue';
import FooterComponent from '@/components/FooterComponent.vue';
import AdminView from './AdminView.vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const mesColis = ref<Colis[]>([]);

onMounted(async () => {
  const idCommande = route.params.IdCommande;
  const colisRequest = await fetch(`/api/admin/get-colis/Com/${idCommande}`);
  const colis = await colisRequest.json();
  mesColis.value = [...colis];
  console.log(mesColis.value);
});


</script>

<template>
  <div>
    <AdminView />
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="p-3 text-sm font-medium">Numéro de Colis</th>
            <th class="p-3 text-sm font-medium">Adresse de livraison</th>
            <th class="p-3 text-sm font-medium">Contact</th>
            <th class="p-3 text-sm font-medium">Date de livraison prévue</th>
            <th class="p-3 text-sm font-medium">Poids</th>
            <th class="p-3 text-sm font-medium">Livraison</th>
            <th class="col-span-3 p-3 text-sm font-medium "></th>
            <th></th>
            <th></th>
            <th></th>
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
    <div class="flex justify-end mt-4">
      <RouterLink
        :to="`/admin/ajoutColis/${route.params.IdCommande}`"
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Ajouter un colis
      </RouterLink>
    </div>
    <FooterComponent />
  </div>
</template>
