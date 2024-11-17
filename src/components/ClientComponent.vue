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
const router = useRouter()
async function addCommande() {
  try {
    const response = await fetch('/api/admin/ajoutCommande', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IdClient: props.client.IdClient })
    });

    if (response.ok) {
      alert('Commande ajouté avec succès !');
      router.push('/commande'); 
      
    } else {
      alert('Erreur lors de l’ajout de la commande');
    }
  } catch (error) {
    console.error('Erreur :', error);
  }
}
</script>

<template>
    <tr>
        <td> {{ props.client.NomClient }}</td>
        <td> {{ props.client.AdresseFacture }}</td>
        <td>{{ props.client.CoordonneesClient }}</td>
        <td><button @click="goToCommandes">Commandes</button></td>
        <td><button @click="addCommande">Ajouter une commande</button>   </td>
    </tr>
</template>