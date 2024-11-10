<script setup lang="ts">
import { Colis } from '../models/Colis';
import ColisComponent from '@/components/ColisComponent.vue';
import { onMounted, ref } from 'vue';
import FooterComponent from '@/components/FooterComponent.vue';
import AdminView from './AdminView.vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const mesColis = ref<Colis[]>([]);

onMounted(async () => {
  const idLivraison = route.params.IdLivraison;
  const colisRequest = await fetch(`/api/admin/get-colis/Liv/${idLivraison}`);
  const colis = await colisRequest.json();
  mesColis.value = [...colis];
  console.log(mesColis.value);
});
</script>

<template>
  <AdminView/>
  <table>
    <tbody>
      <tr>
        <th>Numero de Colis</th>
        <th>Adresse de livraison</th>
        <th>Contact</th>
        <th>Date de livraison prévu</th>
        <th>Poid</th>
        <th>Livraison</th>
      </tr>
      <ColisComponent v-for="(element, index) in mesColis" :colis="element" v-bind:key="index" />
    </tbody>
  </table>    
  <div><RouterLink to="/admin/ajoutColis" >  Ajouter un colis</RouterLink></div>
  <FooterComponent />
</template>
