<script setup lang="ts">
import { TourneeAvecEmploye } from '@/models/TourneeAvecEmploye';
import { useRouter } from 'vue-router';


const props = defineProps<{
    tournee : TourneeAvecEmploye;
}>();

const livRouteur = useRouter()

function goToLivraison() {
    livRouteur.push(`/livraison/${props.tournee.IdTournee}`);
}
</script>

<template>
    <tr>
        <td> {{ props.tournee.IdTournee }}</td>
        <td> {{ props.tournee.DateTournee }}</td>
        <td> {{ props.tournee.NomEmploye }}</td>
        <td><button @click="goToLivraison">Livraisons</button></td>
    </tr>
</template>