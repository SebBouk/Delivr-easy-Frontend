<script setup lang="ts">
import { CommandeAvecClient } from '@/models/CommandeAvecClient';

const props = defineProps<{
    commande : CommandeAvecClient;
}>();

</script>

<template>
    <tr>
        <td> {{ props.commande.IdCommande }}</td>
        <td>{{ props.commande.NomClient }}</td>
        <td><button @click="$router.push('/colis')">Colis</button></td>
    </tr>
</template>