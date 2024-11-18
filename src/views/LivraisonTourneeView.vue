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
  <div>
    <AdminView />
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="p-3 text-sm font-medium">Numéro de livraison</th>
          </tr>
        </thead>
        <tbody>
          <LivraisonComponent
            v-for="(element, index) in mesLivraisons"
            :livraison="element"
            :key="index"
            class="odd:bg-white even:bg-gray-50"
          />
        </tbody>
      </table>
    </div>
    <FooterComponent />
  </div>
</template>
