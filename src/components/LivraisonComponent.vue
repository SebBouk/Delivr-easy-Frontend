<script setup lang="ts">
import { Livraison } from '@/models/Livraison';
import { useRouter } from 'vue-router';

const props = defineProps<{
    livraison : Livraison;
}>();


const ColisRouteur = useRouter()
const TourneeRouteur = useRouter()


function goToColis() {
    ColisRouteur.push(`/colis/Liv/${props.livraison.IdLivraison}`);
}
function gotoTournee(){
    TourneeRouteur.push(`/tournee`)
}

</script>

<template>
    <tr>
        <td> {{ props.livraison.IdLivraison }}</td>
        <td> {{ props.livraison.NombreColis }}</td>
        <td><button @click="goToColis">Colis</button></td>
        <td><button @click="gotoTournee">Tournee</button></td>
    </tr>
</template>