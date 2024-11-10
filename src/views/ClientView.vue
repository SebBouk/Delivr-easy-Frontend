<script setup lang="ts">
import { Client } from '../models/Client';
import ClientComponent from '@/components/ClientComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { onMounted, ref } from 'vue';
import AdminView from './AdminView.vue';

const mesClients = ref<Client[]>([]);

onMounted(async () => {
  const clientRequest = await fetch('/api/admin/get-clients');
  const clients = await clientRequest.json();
  mesClients.value = [...clients];
  console.log(mesClients.value);
});
</script>

<template>
  <AdminView/>
  <table>
    <tbody>
      <tr>
        <th>Nom Client</th>
        <th>Adresse de facturation</th>
        <th>Contact</th>
      </tr>
      <ClientComponent
        v-for="(element, index) in mesClients"
        :client="element"
        v-bind:key="index"
      />
    </tbody>
  </table>
  <div><RouterLink to="/admin/ajoutClient" >Ajouter un Client</RouterLink></div>
  <FooterComponent />
</template>
