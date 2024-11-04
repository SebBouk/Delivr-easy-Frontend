<script setup lang="ts">
import { Client } from '@/models/Client';

const props = defineProps<{
    client : Client;
}>();
</script>

<template>
    <tr>
        <td> {{ props.client.NomClient }}</td>
        <td> {{ props.client.AdresseFacture }}</td>
        <td>{{ props.client.CoordonneesClient }}</td>
        <td><button @click="$router.push('/commandes')">Commandes</button></td>
    </tr>
</template>