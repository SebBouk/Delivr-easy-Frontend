<script setup lang="ts">
import TourneeComponent from '@/components/TourneeComponent.vue';
import { onMounted, ref } from 'vue';
import { TourneeAvecEmploye } from '@/models/TourneeAvecEmploye';
import FooterComponent from '@/components/FooterComponent.vue';
import AdminView from './AdminView.vue';

const mesTournee = ref<TourneeAvecEmploye[]>([]);

onMounted(async () => {
  const tourneeRequest = await fetch('/api/admin/get-tournee');
  const tournee = await tourneeRequest.json();
  mesTournee.value = [...tournee];
  console.log(mesTournee.value);
});
</script>

<template>
  <AdminView/>
  <table>
    <tbody>
      <tr>
        <th>Id Tournée</th>
        <th>Date programée</th>
        <th>Assignation tournée</th>
        <th>Livraisons</th>
      </tr>
      <TourneeComponent v-for="(element, index) in mesTournee" :tournee="element" v-bind:key="index"
      />
    </tbody>
  </table>
  <FooterComponent/>
</template>
