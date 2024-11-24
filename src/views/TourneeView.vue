<script setup lang="ts">
import TourneeComponent from '@/components/TourneeComponent.vue';
import { onMounted, ref } from 'vue';
import { TourneeAvecEmploye } from '@/models/TourneeAvecEmploye';
import FooterComponent from '@/components/FooterComponent.vue';
import AdminView from './AdminView.vue';

const mesTournee = ref<TourneeAvecEmploye[]>([]);
const feedback = ref({ message: '', class: '' });

function showFeedback(message: string, type: 'success' | 'error') {
  feedback.value = {
    message,
    class: type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
  };
  // Supprimer le message après 3 secondes
  setTimeout(() => {
    feedback.value.message = '';
  }, 3000);
}

async function fetchTournees() {
  try {
    const tourneeRequest = await fetch('/api/admin/get-tournee');
    if (!tourneeRequest.ok) throw new Error('Erreur lors de la récupération des tournées');
    const tournee = await tourneeRequest.json();
    mesTournee.value = [...tournee];
    console.log(mesTournee.value);
  } catch (error) {
    console.error('Erreur :', error);
    showFeedback('Impossible de charger les tournées.', 'error');
  }
}

async function createTournee() {
  try {
    const response = await fetch('/api/admin/create-tournee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      showFeedback('Tournée créée avec succès !', 'success');
      fetchTournees(); // Recharge la liste des tournées
    } else {
      showFeedback('Erreur lors de la création de la tournée.', 'error');
    }
  } catch (error) {
    console.error('Erreur :', error);
    showFeedback('Erreur serveur. Veuillez réessayer.', 'error');
  }
}

async function createLivraison(IdTournee: number, IdEmploye: number | null) {
  if (!IdEmploye) {
    showFeedback('Aucun employé assigné à cette tournée.', 'error');
    return;
  }
  try {
    const response = await fetch('/api/admin/create-livraison', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IdTournee, IdEmploye })
    });
    if (response.ok) {
      showFeedback('Livraison créée avec succès !', 'success');
    } else {
      showFeedback('Erreur lors de la création de la livraison.', 'error');
    }
  } catch (error) {
    console.error('Erreur :', error);
    showFeedback('Erreur serveur. Veuillez réessayer.', 'error');
  }
}

onMounted(() => {
  fetchTournees();
});
</script>

<template>
  <div>
    <AdminView />
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <div v-if="feedback.message" :class="feedback.class" class="p-4 rounded mb-4">
        {{ feedback.message }}
      </div>
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">Gestion des Tournées</h1>
      </div>
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="p-3 text-sm font-medium">Id Tournée</th>
            <th class="p-3 text-sm font-medium">Date programmée</th>
            <th class="p-3 text-sm font-medium">Modifier la date</th>
            <th class="p-3 text-sm font-medium">Assignation tournée</th>
            <th class="p-3 text-sm font-medium">Livraisons</th>
            <th class="col-span-3 p-3 text-sm font-medium"></th>
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
    <div class="flex">
  <button
    @click="createTournee"
    class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors ml-auto"
  >
    Créer une Tournée
  </button>
</div>
    <FooterComponent class="mt-6" />
  </div>
</template>

<style scoped>
.bg-green-100 {
  background-color: #d1fae5;
}

.text-green-700 {
  color: #047857;
}

.bg-red-100 {
  background-color: #fee2e2;
}

.text-red-700 {
  color: #b91c1c;
}
</style>
