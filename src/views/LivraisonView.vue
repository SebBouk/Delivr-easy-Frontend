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
  <AdminView/>
  <table>
    <tbody>
      <tr>
        <th>Numero de livraison</th>
        <th>Signature</th>
      </tr>
      <LivraisonComponent v-for="(element, index) in mesLivraison" :livraison="element" v-bind:key="index" />
    </tbody>
  </table>
  <FooterComponent />
</template>
