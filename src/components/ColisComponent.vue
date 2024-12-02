<script setup lang="ts">
import { Colis } from '@/models/Colis';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';

const props = defineProps<{
  colis: Colis;
}>();

const isEditing = ref(false);
const commentaire = ref(props.colis.Commentaire || '');
const route = useRoute();
const LivRouteur = useRouter();
const SignRouter = useRouter();
const localColis = ref({ ...props.colis });
const allLivraisons = ref<any[]>([]); // Liste des livraisons
const selectedLivraisonId = ref<number | null>(null); // Livraison sélectionnée



const token = document.cookie
  .split(';')
  .find((c) => c.trim().startsWith('token='))
  ?.split('=')[1];
const decoded = token ? jwtDecode<{ RoleEmploye: number }>(token) : null;
const userRole = decoded?.RoleEmploye;

const baseURL = userRole === 0 ? '/api/livreur' : '/api/admin';

function editCommentaire() {
  isEditing.value = true;
}

function gotoLiv() {
  LivRouteur.push(`/livraison`);
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
        IdLivraison: selectedLivraisonId.value
      })
    });

    if (response.ok) {
      alert('Colis assigné à la livraison avec succès !');
      localColis.value.IdLivraison = selectedLivraisonId.value;
        } else {
      alert("Erreur lors de l'assignation du colis à la livraison");
    }
  } catch (error) {
    console.error('Erreur :', error);
    alert('Erreur serveur. Veuillez réessayer plus tard.');
  }
}
async function ajouterCommentaire() {
  if (!commentaire.value) {
    alert('Veuillez entrer un commentaire.');
    return;
  }

  try {
    const response = await fetch(`${baseURL}/colis/commentaire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentaire: commentaire.value, IdColis: props.colis.NumColis })
    });

    if (response.ok) {
      alert('Commentaire ajouté avec succès !');
      localColis.value.Commentaire = commentaire.value;
      cancelEdit();
    } else {
      const data = await response.json();
      alert(data.message || "Erreur lors de l'ajout du commentaire.");
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    alert("Impossible d'ajouter le commentaire. Réessayez plus tard.");
  }
}
function cancelEdit() {
  commentaire.value = localColis.value.Commentaire || ''; // Rétablir le commentaire initial
  isEditing.value = false;
}
</script>

<template>
  <tr>
    <td>{{ props.colis.NumColis }}</td>
    <td>{{ props.colis.AdresseColis }}</td>
    <td>{{ props.colis.ContactColis }}</td>
    <td>{{ formattedDate }}</td>
    <td>{{ props.colis.PoidColis }}</td>
    <td>
      <button @click="gotoLiv">{{ localColis.IdLivraison }}</button>
    </td>
    <td><input type="checkbox" v-model="isSigned" /></td>
    <td><button @click="goToSign">Signature</button></td>
    <td v-if="route.path === '/colis'">
      <select v-model="selectedLivraisonId">
        <option value="" disabled>Choisir une livraison</option>
        <option
          v-for="livraison in allLivraisons"
          :key="livraison.IdLivraison"
          :value="livraison.IdLivraison"
        >
          {{ livraison.IdLivraison }}
        </option>
      </select>
    </td>
    <td v-if="route.path === '/colis'">
      <button @click="assignLivraison">Assigner à la livraison</button>
    </td>
    <td>    
      <div v-if="isEditing">
      <textarea
        v-model="commentaire"
        placeholder="Ajouter un commentaire..."
        rows="2"
        class="border rounded-md p-2 resize-none w-full"
      ></textarea>
      <button
        @click="ajouterCommentaire"
        class="bg-blue-500 text-white py-1 px-3 mt-2 rounded-md hover:bg-blue-600"
      >
        Enregistrer
      </button>
      <button
        @click="cancelEdit"
        class="bg-gray-500 text-white py-1 px-3 mt-2 rounded-md hover:bg-gray-600"
      >
        Annuler
      </button>
    </div>

    <!-- Sinon, afficher le commentaire existant ou un texte "Ajouter un commentaire..." -->
    <div v-else @click="editCommentaire" class="cursor-pointer">
      <p v-if="props.colis.Commentaire" class="bg-gray-100 p-2 rounded-md">
        {{ localColis.Commentaire }}
      </p>
      <p v-else class="text-gray-500 italic">Ajouter un commentaire...</p>
    </div>
    </td>
  </tr>
</template>
