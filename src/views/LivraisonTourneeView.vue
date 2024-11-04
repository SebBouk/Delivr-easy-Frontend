<script setup lang="ts">
import { useRoute } from 'vue-router';
import LivraisonComponent from '@/components/LivraisonComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { onMounted, ref } from 'vue';
import AdminView from './AdminView.vue';
import { Livraison } from '@/models/Livraison';

const route = useRoute();
const mesLivraisons = ref<Livraison[]>([]);

onMounted(async () => {
  const idTournee = route.params.IdTournee;
  const livraisonRequest = await fetch(`/api/admin/get-livraison/${idTournee}`);
  const livraison = await livraisonRequest.json();
  mesLivraisons.value = livraison;
  console.log(mesLivraisons.value);
});

</script>
<template>
  <AdminView/>
  <table>
    <thead>
      <tr>
        <th>Numéro de livraison</th>
      </tr>
    </thead>
    <tbody>
      <LivraisonComponent
        v-for="(element, index) in mesLivraisons"
        :livraison="element"
        :key="index"
      />
    </tbody>
  </table>
  <FooterComponent />
</template>
