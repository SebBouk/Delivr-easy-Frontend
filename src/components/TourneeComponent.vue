<script setup lang="ts">
import { TourneeAvecEmploye } from '@/models/TourneeAvecEmploye';
import { useRouter } from 'vue-router';
import { computed, ref, onMounted } from 'vue';

const props = defineProps<{
  tournee: TourneeAvecEmploye;
}>();


const livRouteur = useRouter();
const isEditing = ref(false);
const DateTournee = ref(props.tournee.DateTournee || '');
const IdTournee = ref(props.tournee.IdTournee);
const localTournee = ref({ ...props.tournee });

const employes = ref<{ IdEmploye: number | null ; NomEmploye: string }[]>([]);
const selectedEmployeId = ref<number | any>(localTournee.value.IdEmploye || null);

const notifications = ref<
  {
    id: number;
    type: 'success' | 'error';
    message: string;
    appearing: boolean;
    disappearing: boolean;
  }[]
>([]);

let notificationId = 0;

function showNotification(type: 'success' | 'error', message: string) {
  const id = ++notificationId;
  const newNotification = { id, type, message, appearing: true, disappearing: false };
  notifications.value.push(newNotification);

  // Supprime la classe `appearing` après l'animation d'apparition (0.5 seconde)
  setTimeout(() => {
    const notif = notifications.value.find((n) => n.id === id);
    if (notif) notif.appearing = false;
  }, 10);

  // Marque la notification pour disparaître après 4 secondes
  setTimeout(() => {
    const notif = notifications.value.find((n) => n.id === id);
    if (notif) notif.disappearing = true;

    // Supprime complètement la notification après la transition (1 seconde)
    setTimeout(() => {
      notifications.value = notifications.value.filter((n) => n.id !== id);
    }, 1000);
  }, 4000);
}

async function createLivraison() {
  if (!props.tournee.IdEmploye) {
    showNotification('error', 'Aucun employé assigné à cette tournée.');
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
      showNotification('error', 'Erreur lors de la création de la livraison.');
    } else {
      showNotification('success', 'Livraison créée avec succès.');
    }
  } catch (error) {
    console.error('Erreur lors de la création de la livraison :', error);
    showNotification('error', 'Erreur serveur. Veuillez réessayer plus tard.');
  }
}

function goToLivraison() {
  livRouteur.push(`/livraison/${props.tournee.IdTournee}`);
}

onMounted(async () => {
  try {
    const response = await fetch('/api/admin/get-livreurs');
    if (!response.ok) throw new Error('Erreur lors du chargement des livreurs');
    employes.value = await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des employés :', error);
    showNotification(
      'error',
      'Impossible de charger la liste des livreurs. Veuillez réessayer plus tard.'
    );
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
      showNotification('success', 'Date ajoutée avec succès.');
      localTournee.value.DateTournee = DateTournee.value;
    } else {
      showNotification('error', 'Erreur lors de l’ajout de la date.');
    }
  } catch (error) {
    console.error('Erreur :', error);
    showNotification('error', 'Erreur serveur. Veuillez réessayer plus tard.');
  }
}

function cancelEdit() {
  isEditing.value = false;
  DateTournee.value = props.tournee.DateTournee;
  selectedEmployeId.value = localTournee.value.IdEmploye;
}

async function updateEmploye() {
  if (selectedEmployeId.value === props.tournee.IdEmploye) {
    showNotification('error', 'Aucune modification détectée.');
    return;
  }

  try {
    const response = await fetch(`/api/admin/${props.tournee.IdTournee}/update-employe`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IdEmploye: selectedEmployeId.value })
    });

    if (response.ok) {
      showNotification('success', 'Employé mis à jour avec succès.');
      localTournee.value.IdEmploye = selectedEmployeId.value;
      localTournee.value.NomEmploye = employes.value.find((e) => e.IdEmploye === selectedEmployeId.value)?.NomEmploye || '';
      isEditing.value = false;
    } else {
      showNotification('error', "Erreur lors de la mise à jour de l'employé.");
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'employé :", error);
    showNotification('error', 'Erreur serveur. Veuillez réessayer plus tard.');
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
      <button @click="createLivraison">Créer une livraison</button>
    </td>
  </tr>
  <div class="notification-container">
    <div
      v-for="notif in notifications"
      :key="notif.id"
      :class="[
        'notification',
        notif.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
        notif.appearing ? 'appearing' : '',
        notif.disappearing ? 'disappearing' : ''
      ]"
    >
      {{ notif.message }}
    </div>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.notification {
  padding: 12px 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 1s ease,
    transform 1s ease;
}

.notification.appearing {
  opacity: 0;
  transform: translateY(-20px);
}

.notification.disappearing {
  opacity: 0;
  transform: translateY(-20px);
}

.bg-green-100 {
  background-color: rgba(209, 250, 229, 0.9);
}

.text-green-700 {
  color: #047857;
}

.bg-red-100 {
  background-color: rgba(254, 226, 226, 0.9);
}

.text-red-700 {
  color: #b91c1c;
}
</style>
