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
  <AdminView/>
  <table>
    <tbody>
      <tr>
        <th>Id Commande</th>
        <th>Nom Client</th>
        <th>Colis</th>
      </tr>
      <CommandeComponent
        v-for="(element, index) in mesCommandes"
        :commande="element"
        v-bind:key="index"
      />
    </tbody>
  </table>
  <FooterComponent/>
</template>
