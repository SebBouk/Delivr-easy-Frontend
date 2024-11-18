<script setup lang="ts">
import TourneeComponent from '@/components/TourneeComponent.vue';
import { onMounted, ref } from 'vue';
import { TourneeAvecEmploye } from '@/models/TourneeAvecEmploye';
import FooterComponent from '@/components/FooterComponent.vue';
import AdminView from './AdminView.vue';

const mesTournee = ref<TourneeAvecEmploye[]>([]);

async function fetchTournees() {
  try {
    const tourneeRequest = await fetch('/api/admin/get-tournee');
    if (!tourneeRequest.ok) throw new Error('Erreur lors de la récupération des tournées');
    const tournee = await tourneeRequest.json();
    mesTournee.value = [...tournee];
    console.log(mesTournee.value);
  } catch (error) {
    console.error('Erreur :', error);
    alert('Impossible de charger les tournées.');
  }
}

async function createTournee() {
  try {
    const response = await fetch('/api/admin/create-tournee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      alert('Tournée créée avec succès !');
      fetchTournees(); // Recharge la liste des tournées
    } else {
      alert('Erreur lors de la création de la tournée.');
    }
  } catch (error) {
    console.error('Erreur :', error);
    alert('Erreur serveur. Veuillez réessayer.');
  }
}

async function createLivraison(IdTournee: number, IdEmploye: number | null) {
  if (!IdEmploye) {
    alert("Aucun employé assigné à cette tournée.");
    return;
  }
  try {
    const response = await fetch('/api/admin/create-livraison', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IdTournee, IdEmploye }),
    });
    if (response.ok) {
      alert('Livraison créée avec succès !');
    } else {
      alert('Erreur lors de la création de la livraison.');
    }
  } catch (error) {
    console.error('Erreur :', error);
    alert('Erreur serveur. Veuillez réessayer.');
  }
}

onMounted(() => {
  fetchTournees();
});

</script>


<template>
  <div class="p-6 bg-gray-100 min-h-screen flex flex-col space-y-6">
    <AdminView />
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">Gestion des Tournées</h1>
        <button
          @click="createTournee"
          class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Créer une Tournée
        </button>
      </div>
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="p-3 text-sm font-medium">Id Tournée</th>
            <th class="p-3 text-sm font-medium">Date programmée</th>
            <th class="p-3 text-sm font-medium">Modifier la date</th>
            <th class="p-3 text-sm font-medium">Assignation tournée</th>
            <th class="p-3 text-sm font-medium">Livraisons</th>
          </tr>
        </thead>
        <tbody>
          <TourneeComponent
            v-for="(element, index) in mesTournee"
            :tournee="element"
            v-bind:key="index"
            @create-livraison="createLivraison"
            class="odd:bg-white even:bg-gray-50"
          />
        </tbody>
      </table>
    </div>
    <FooterComponent class="mt-6" />
  </div>
</template>
