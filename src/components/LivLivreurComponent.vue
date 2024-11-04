<script setup lang="ts">
import { Colis } from '@/models/Colis';
import { Livraison } from '@/models/Livraison';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
    livraison : Livraison;
    colis : Colis
}>();

const ColisRouteur = useRouter()
const SignRouter = useRouter();

function goToColis() {
    ColisRouteur.push(`/colis/${props.livraison.IdLivraison}`);
}

function goToSign() {
  SignRouter.push(`/signature/${props.livraison.IdLivraison}`);
}

const isSigned = ref(false);

onMounted(() => {
  isSigned.value = props.livraison.SignatureClient !== null;
});
</script>

<template>
    <tr>
        <td> {{ props.livraison.IdLivraison }}</td>
        <td><button @click="goToColis">Colis</button></td>
        <td><input type="checkbox" v-model="isSigned" ></td>
        <td><button @click="goToSign">Signature</button></td>
    </tr>
</template>