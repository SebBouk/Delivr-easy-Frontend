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
  <AdminView />
  <table>
    <button @click="createTournee" class="btn-create-tournee">Créer une Tournée</button>
    <tbody>
      <tr>
        <th>Id Tournée</th>
        <th>Date programée</th>
        <th>Modifier la date</th>
        <th>Assignation tournée</th>
        <th>Livraisons</th>
      </tr>
      <TourneeComponent
        v-for="(element, index) in mesTournee"
        :tournee="element"
        v-bind:key="index"
        @create-livraison="createLivraison"
      />
    </tbody>
  </table>
  <FooterComponent />
</template>
