<script setup lang="ts">
import { Client } from '@/models/Client';
import { useRouter } from 'vue-router';

const props = defineProps<{
    client : Client;
}>();
 const clientCommandeRouteur= useRouter();

function goToCommandes() {
    clientCommandeRouteur.push(`/commandes/Client/${props.client.IdClient}`);
}
</script>

<template>
    <tr>
        <td> {{ props.client.NomClient }}</td>
        <td> {{ props.client.AdresseFacture }}</td>
        <td>{{ props.client.CoordonneesClient }}</td>
        <td><button @click="goToCommandes">Commandes</button></td>
    </tr>
</template>