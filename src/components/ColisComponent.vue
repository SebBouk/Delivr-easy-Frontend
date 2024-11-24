<script setup lang="ts">
import { Colis } from '@/models/Colis';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
    colis : Colis;
}>();

const LivRouteur = useRouter()
const SignRouter = useRouter()

const allLivraisons = ref<any[]>([]); // Liste des livraisons
const selectedLivraisonId = ref<number | null>(null); // Livraison sélectionnée

function gotoLiv(){
    LivRouteur.push(`/livraison`)
}


function goToSign() {
  SignRouter.push(`/signature/${props.colis.NumColis}`);
}

const isSigned = ref(false);

onMounted(async () => {
  // Récupération des livraisons
  try {
    const response = await fetch('/api/admin/get-livraison');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des livraisons');
    }
    allLivraisons.value = await response.json();
  } catch (error) {
    console.error('Erreur :', error);
    }

  // Vérifie si le colis a une signature
  isSigned.value = props.colis.SignatureClient !== null;
});

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

async function assignLivraison() {
  if (selectedLivraisonId.value === null) {
    alert('Veuillez sélectionner une livraison');
    return;
  }

  try {
    const response = await fetch('/api/admin/assign-colis-to-livraison', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        IdColis: props.colis.NumColis,
        IdLivraison: selectedLivraisonId.value,
      }),
    });

    if (response.ok) {
      alert('Colis assigné à la livraison avec succès !');
      props.colis.IdLivraison = selectedLivraisonId.value;
    } else {
      alert('Erreur lors de l\'assignation du colis à la livraison');
    }
  } catch (error) {
    console.error('Erreur :', error);
    alert('Erreur serveur. Veuillez réessayer plus tard.');
  }
}
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
        <td>
      <select v-model="selectedLivraisonId">
        <option value="" disabled>Choisir une livraison</option>
        <option v-for="livraison in allLivraisons" :key="livraison.IdLivraison" :value="livraison.IdLivraison">
          {{ livraison.IdLivraison }}
        </option>
      </select>
    </td>
    <td><button @click="assignLivraison">Assigner à la livraison</button></td>
  
    </tr>
</template>