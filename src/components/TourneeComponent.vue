<script setup lang="ts">
import { TourneeAvecEmploye } from '@/models/TourneeAvecEmploye';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';

const props = defineProps<{
  tournee: TourneeAvecEmploye;
}>();

const livRouteur = useRouter();

const isEditing = ref(false);

function goToLivraison() {
  livRouteur.push(`/livraison/${props.tournee.IdTournee}`);
}

const DateTournee = ref(props.tournee.DateTournee || '');
const IdTournee = ref(props.tournee.IdTournee);

async function addDate() {
  try {
    const response = await fetch('/api/admin/ajoutDate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ DateTournee: DateTournee.value, IdTournee: IdTournee.value })
    });
    if (response.ok) {
      alert('Date ajouté avec succès !');
      props.tournee.DateTournee = DateTournee.value;
      isEditing.value = false;
    } else {
      alert('Erreur lors de l’ajout de la date');
    }
  } catch (error) {
    console.error('Erreur :', error);
  }
}
function cancelEdit() {
  isEditing.value = false;
  DateTournee.value = props.tournee.DateTournee; // Annule les changements non enregistrés
}
const formattedDate = computed(() => {
  const date = new Date(props.tournee.DateTournee);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
});
</script>

<template>
  <tr>
    <td>{{ props.tournee.IdTournee }}</td>
    <td>
      <span v-if="!isEditing">{{ formattedDate }}</span>
      <input v-else type="date" v-model="DateTournee" @change="addDate" />
    </td>
    <td>
      <button v-if="!isEditing" @click="isEditing = true">Modifier</button>
      <button v-if="isEditing" @click="cancelEdit">Annuler</button>
    </td>
    <td>
      <span v-if="props.tournee.NomEmploye">{{ props.tournee.NomEmploye }}</span>
    </td>
    <td><button @click="goToLivraison">Livraisons</button></td>
  </tr>
</template>
