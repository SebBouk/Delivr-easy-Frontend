<script setup lang="ts">
import { Colis } from '../models/Colis';
import ColisComponent from '@/components/ColisComponent.vue';
import { onMounted, ref } from 'vue';
import FooterComponent from '@/components/FooterComponent.vue';
import AdminView from './AdminView.vue';


const mesColis = ref<Colis[]>([]);

onMounted(async () => {
  const colisRequest = await fetch('/api/admin/get-colis');
  const colis = await colisRequest.json();
  mesColis.value = [...colis];
  console.log(mesColis.value);
});
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen flex flex-col space-y-6">
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
    <FooterComponent />
  </div>
</template>

