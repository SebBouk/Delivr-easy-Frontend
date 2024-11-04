<script setup lang="ts">
import { Colis } from '@/models/Colis';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
    colis : Colis;
}>();

const LivRouteur = useRouter()
const SignRouter = useRouter()

function gotoLiv(){
    LivRouteur.push(`/livraison`)
}


function goToSign() {
  SignRouter.push(`/signature/${props.colis.NumColis}`);
}

const isSigned = ref(false);

onMounted(() => {

  isSigned.value = props.colis.SignatureClient !== null;
});
const formattedDate = computed(() => {
    const date = new Date(props.colis.DateLivColis);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; 
});
</script>

<template>
    <tr>
        <td> {{ props.colis.NumColis }}</td>
        <td> {{ props.colis.AdresseColis }}</td>
        <td>{{ props.colis.ContactColis }}</td>
        <td>{{ formattedDate  }}</td>
        <td>{{ props.colis.PoidColis }}</td>
        <td><button @click="gotoLiv">{{ props.colis.IdLivraison }}</button></td>
        <td><input type="checkbox" v-model="isSigned" ></td>
        <td><button @click="goToSign">Signature</button></td>
    </tr>
</template>