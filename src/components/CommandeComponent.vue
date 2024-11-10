<script setup lang="ts">
import { CommandeAvecClient } from '@/models/CommandeAvecClient';
import { useRouter } from 'vue-router';


const props = defineProps<{
    commande : CommandeAvecClient;
}>();

const colisCommandeRouteur = useRouter()

function goToColis() {
    colisCommandeRouteur.push(`/colis/Com/${props.commande.IdCommande}`);
}
</script>

<template>
    <tr>
        <td> {{ props.commande.IdCommande }}</td>
        <td>{{ props.commande.NomClient }}</td>
        <td><button @click="goToColis">Colis</button></td>
    </tr>
</template>