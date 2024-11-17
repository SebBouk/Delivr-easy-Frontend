<script setup lang="ts">
import { TourneeAvecEmploye } from '@/models/TourneeAvecEmploye';
import { useRouter } from 'vue-router';
import { computed, ref, onMounted, defineEmits } from 'vue';

const props = defineProps<{
  tournee: TourneeAvecEmploye;
}>();

const livRouteur = useRouter();
const isEditing = ref(false);
const DateTournee = ref(props.tournee.DateTournee || '');
const IdTournee = ref(props.tournee.IdTournee);

const employes = ref<{ IdEmploye: number; NomEmploye: string }[]>([]); // Liste des employés
const selectedEmployeId = ref<number | null>(props.tournee.IdEmploye || null); // Employé sélectionné
const emit = defineEmits(['create-livraison']);

async function createLivraison() {
  if (!props.tournee.IdEmploye) {
    alert('Aucun employé assigné à cette tournée.');
    return;
  }

  try {
    const response = await fetch('/api/admin/create-livraison', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        IdTournee: props.tournee.IdTournee,
        IdEmploye: props.tournee.IdEmploye
      })
    });

    if (!response.ok) {
      alert('Erreur lors de la création de la livraison.');
    }
  } catch (error) {
    console.error('Erreur lors de la création de la livraison :', error);
    alert('Erreur serveur. Veuillez réessayer plus tard.');
  }
}


function goToLivraison() {
  livRouteur.push(`/livraison/${props.tournee.IdTournee}`);
}

onMounted(async () => {
  try {
    const response = await fetch('/api/admin/get-livreurs'); // Correction de la route
    if (!response.ok) throw new Error('Erreur lors du chargement des livreurs');
    employes.value = await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des employés :', error);
    alert('Impossible de charger la liste des livreurs. Veuillez réessayer plus tard.');
  }
});

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
    } else {
      alert('Erreur lors de l’ajout de la date');
    }
  } catch (error) {
    console.error('Erreur :', error);
  }
}
function cancelEdit() {
  isEditing.value = false;
  DateTournee.value = props.tournee.DateTournee;
  selectedEmployeId.value = props.tournee.IdEmploye; // Annule les changements non enregistrés
}
async function updateEmploye() {
  if (selectedEmployeId.value === props.tournee.IdEmploye) {
    alert('Aucune modification détectée.');
    return;
  }

  try {
    const response = await fetch(`/api/admin/${props.tournee.IdTournee}/update-employe`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IdEmploye: selectedEmployeId.value })
    });

    if (response.ok) {
      alert('Employé mis à jour avec succès !');
      props.tournee.IdEmploye = selectedEmployeId.value;
      props.tournee.NomEmploye =
        employes.value.find((e) => e.IdEmploye === selectedEmployeId.value)?.NomEmploye || '';
      isEditing.value = false;
    } else {
      alert("Erreur lors de la mise à jour de l'employé.");
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'employé :", error);
    alert('Erreur serveur. Veuillez réessayer plus tard.');
  }
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
      <button v-if="isEditing" @click="updateEmploye">Sauvegarder</button>
    </td>
    <td>
      <span v-if="!isEditing">{{ props.tournee.NomEmploye }}</span>
      <select v-else v-model="selectedEmployeId">
        <option v-for="employe in employes" :key="employe.IdEmploye" :value="employe.IdEmploye">
          {{ employe.NomEmploye }}
        </option>
      </select>
    </td>
    <td>
      <button @click="goToLivraison">Livraisons</button>
    </td>
    <td>
      <button @click="createLivraison">Créé une livraisons</button>
    </td>
  </tr>
</template>
