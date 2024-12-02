<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { Colis } from '@/models/Colis';
import { jwtDecode } from 'jwt-decode';

// Interface pour le payload du token
interface TokenPayload {
  IdEmploye: string;
  NomEmploye: string;
  RoleEmploye: number;
}

const router = useRouter();
const mesColis = ref<Colis[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// État pour suivre les commentaires en cours d'édition
const editingComments = ref<{ [key: string]: { text: string; isEditing: boolean } }>({});

// Méthode centralisée pour récupérer le token
const getToken = (): string | null => {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1] || null
  );
};

// Méthode sécurisée de décodage du token
const decodeToken = (): TokenPayload | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error('Erreur de décodage du token', error);
    return null;
  }
};

// Utilisateur courant
const currentUser = computed(() => {
  const tokenPayload = decodeToken();
  return tokenPayload
    ? {
        id: tokenPayload.IdEmploye,
        name: tokenPayload.NomEmploye || 'Utilisateur'
      }
    : null;
});

// Déconnexion
const logout = () => {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  router.push('/');
};

// Récupération des colis
const fetchColis = async () => {
  const tokenPayload = decodeToken();
  if (!tokenPayload) {
    error.value = 'Authentification requise';
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const response = await fetch(`/api/livreur/get-colis/${tokenPayload.IdEmploye}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Impossible de récupérer les colis');
    }

    const colis = await response.json();
    mesColis.value = colis.map((c: Colis) => ({
      ...c,
      DateLivColis: formatDate(c.DateLivColis)
    }));

    // Initialiser l'état des commentaires
    mesColis.value.forEach((colis) => {
      editingComments.value[colis.NumColis] = {
        text: colis.Commentaire || '',
        isEditing: false
      };
    });
  } catch (fetchError) {
    console.error('Erreur lors de la récupération des colis', fetchError);
    error.value = 'Erreur de chargement des colis';
  } finally {
    isLoading.value = false;
  }
};

// Ajouter/Modifier un commentaire
const ajouterCommentaire = async (colis: Colis) => {
  const commentaireInfo = editingComments.value[colis.NumColis];
  const commentaire = commentaireInfo.text;

  if (!commentaire.trim()) {
    alert('Le commentaire ne peut pas être vide');
    return;
  }

  try {
    const response = await fetch('/api/livreur/colis/commentaire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commentaire,
        IdColis: colis.NumColis
      })
    });

    if (!response.ok) {
      throw new Error("Échec de l'ajout du commentaire");
    }

    // Mettre à jour localement le commentaire
    const index = mesColis.value.findIndex((c) => c.NumColis === colis.NumColis);
    if (index !== -1) {
      mesColis.value[index].Commentaire = commentaire;
    }

    // Désactiver le mode édition
    commentaireInfo.isEditing = false;

    alert('Commentaire ajouté avec succès');
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire", error);
    alert("Impossible d'ajouter le commentaire");
  }
};

// Annuler l'édition du commentaire
const annulerCommentaire = (colis: Colis) => {
  const commentaireInfo = editingComments.value[colis.NumColis];
  commentaireInfo.text = colis.Commentaire || '';
  commentaireInfo.isEditing = false;
};

// Activer le mode édition
const editerCommentaire = (colis: Colis) => {
  editingComments.value[colis.NumColis].isEditing = true;
};

// Navigation vers la signature
const navigateToSignature = (colis: Colis) => {
  router.push({ path: `/signature/${colis.NumColis}` });
};

// Formater la date
function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Charger les colis au montage du composant
onMounted(fetchColis);
</script>

<template>
  <div class="container mx-auto px-4 py-6 bg-gray-100 min-h-screen">
    <div class="mb-4 text-gray-700">
      <span>Bienvenue, {{ currentUser?.name || 'Utilisateur' }}</span>
    </div>

    <!-- Gestion des états de chargement et d'erreur -->
    <div v-if="isLoading" class="text-center text-gray-500">Chargement des colis...</div>

    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>

    <div v-else-if="mesColis.length === 0" class="text-center text-gray-500">
      Aucun colis trouvé
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="colis in mesColis"
        :key="colis.NumColis"
        class="bg-white shadow-lg rounded-lg p-4 border-l-4 transition-all hover:scale-105 hover:shadow-xl"
        :class="{
          'border-blue-500': !colis.SignatureClient,
          'border-green-500': colis.SignatureClient
        }"
      >
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-bold text-gray-800">Num de colis: {{ colis.NumColis }}</h3>
          <span class="text-sm text-gray-500">{{ colis.DateLivColis }}</span>
        </div>

        <div class="space-y-2">
          <div class="flex items-center">
            <svg
              class="w-5 h-5 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <p class="text-gray-700">{{ colis.AdresseColis }}</p>
          </div>

          <div class="flex items-center">
            <svg
              class="w-5 h-5 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              ></path>
            </svg>
            <p class="text-gray-700">{{ colis.ContactColis }}</p>
          </div>

          <div class="flex items-center">
            <svg
              class="w-5 h-5 mr-2 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
            <p class="text-gray-700">Poids: {{ colis.PoidColis }} kg</p>
          </div>

          <div
            class="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
            @click="navigateToSignature(colis)"
          >
            <svg
              class="w-5 h-5 mr-2"
              :class="{
                'text-red-500': !colis.SignatureClient,
                'text-green-500': colis.SignatureClient
              }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              ></path>
            </svg>
            <p
              class="text-gray-700"
              :class="{
                'font-bold text-red-600': !colis.SignatureClient,
                'text-green-600': colis.SignatureClient
              }"
            >
              {{ colis.SignatureClient ? 'Signé' : 'À signer' }}
            </p>
          </div>

          <div class="mt-3">
            <!-- Mode non-édition -->
            <div v-if="!editingComments[colis.NumColis].isEditing" class="flex items-center">
              <p class="flex-grow mr-2">
                {{ colis.Commentaire || 'Aucun commentaire' }}
              </p>
              <button
                @click="editerCommentaire(colis)"
                class="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition-all"
              >
                Éditer
              </button>
            </div>

            <!-- Mode édition -->
            <div v-else class="space-y-2">
              <textarea
                v-model="editingComments[colis.NumColis].text"
                class="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ajouter ou modifier un commentaire"
              ></textarea>

              <div class="flex justify-between">
                <button
                  @click="ajouterCommentaire(colis)"
                  class="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition-all"
                >
                  Valider
                </button>
                <button
                  @click="annulerCommentaire(colis)"
                  class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 text-center">
      <button
        @click="logout"
        class="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-all"
      >
        Déconnexion
      </button>
    </div>
  </div>
</template>
