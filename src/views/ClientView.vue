<script setup lang="ts">
import { Client } from '../models/Client';
import ClientComponent from '@/components/ClientComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { onMounted, ref } from 'vue';
import AdminView from './AdminView.vue';

const mesClients = ref<Client[]>([]);

onMounted(async () => {
  const clientRequest = await fetch('/api/admin/get-clients');
  const clients = await clientRequest.json();
  mesClients.value = [...clients];
  console.log(mesClients.value);
});
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen flex flex-col space-y-6">
    <AdminView />
    
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="p-3 text-sm font-medium">Nom Client</th>
            <th class="p-3 text-sm font-medium">Adresse de facturation</th>
            <th class="p-3 text-sm font-medium">Contact</th>
          </tr>
        </thead>
        <tbody>
          <ClientComponent
            v-for="(element, index) in mesClients"
            :client="element"
            :key="index"
            class="odd:bg-white even:bg-gray-50"
          />
        </tbody>
      </table>
    </div>

    <div class="flex justify-end mt-4">
      <RouterLink
        to="/admin/ajoutClient"
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Ajouter un Client
      </RouterLink>
    </div>
    
    <FooterComponent />
  </div>
</template>

