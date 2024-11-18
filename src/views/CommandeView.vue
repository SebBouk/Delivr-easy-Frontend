<script setup lang="ts">
import CommandeComponent from '@/components/CommandeComponent.vue';
import { onMounted, ref } from 'vue';
import { CommandeAvecClient } from '@/models/CommandeAvecClient';
import FooterComponent from '@/components/FooterComponent.vue';
import AdminView from './AdminView.vue';

const mesCommandes = ref<CommandeAvecClient[]>([]);

onMounted(async () => {
  const commandeRequest = await fetch('/api/admin/get-commandes');
  const commande = await commandeRequest.json();
  mesCommandes.value = [...commande];
  console.log(mesCommandes.value);
});
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen space-y-6">
    <AdminView />
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="p-3 text-sm font-medium">Id Commande</th>
            <th class="p-3 text-sm font-medium">Nom Client</th>
            <th class="p-3 text-sm font-medium">Colis</th>
          </tr>
        </thead>
        <tbody>
          <CommandeComponent
            v-for="(element, index) in mesCommandes"
            :commande="element"
            :key="index"
            class="odd:bg-white even:bg-gray-50"
          />
        </tbody>
      </table>
    </div>
    <FooterComponent />
  </div>
</template>

