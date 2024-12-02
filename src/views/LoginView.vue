<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Variables réactives
const MailEmploye = ref('');
const MdpEmploye = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const adminPassword = ref('');
const isModalOpen = ref(false);
const errorMessage = ref<string | null>(null);

// Valeur correcte pour le mot de passe admin
const adminPasswordCorrect = 'admin123';

// Accès au routeur
const router = useRouter();

// Méthodes
const submitForm = async () => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        MailEmploye: MailEmploye.value,
        MdpEmploye: MdpEmploye.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Connexion réussie !');
      document.cookie = `token=${data.token};path=/; max-age=${60 * 60}; secure;`;
      if (data.RoleEmploye === 0) {
        router.push(`/livreur/get-colis/${data.IdEmploye}`);
      } else if (data.RoleEmploye === 1) {
        router.push('/admin');
      } else {
        errorMessage.value = 'Rôle inconnu, redirection impossible.';
      }
    } else {
      errorMessage.value = data.message || 'Erreur lors de la connexion';
    }
  } catch (error) {
    console.error('Erreur de connexion :', error);
    errorMessage.value = 'Erreur de connexion. Veuillez réessayer.';
  }
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const updatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('Les mots de passe ne correspondent pas.');
    return;
  }

  if (adminPassword.value !== adminPasswordCorrect) {
    alert('Le mot de passe administrateur est incorrect.');
    return;
  }

  try {
    const response = await fetch('/api/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        MailEmploye: MailEmploye.value,
        newPassword: newPassword.value,
      }),
    });

    if (response.ok) {
      alert('Mot de passe mis à jour avec succès.');
      closeModal();
    } else {
      const data = await response.json();
      alert( data.message || 'Erreur lors de la mise à jour du mot de passe.');
    }
  } catch (error) {
    console.error('Erreur :', error);
    alert( 'Erreur lors de la mise à jour du mot de passe.');
  }
};
</script>

<template>
  <div class="login-background">
    <div class="flex justify-center items-center min-h-screen">
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold mb-6 text-center">Connexion</h1>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Adresse e-mail</label>
            <input
              type="email"
              id="email"
              v-model="MailEmploye"
              required
              placeholder="Entrez votre adresse e-mail"
              class="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              v-model="MdpEmploye"
              required
              placeholder="Entrez votre mot de passe"
              class="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Se connecter
          </button>

          <p v-if="errorMessage" class="text-red-500 text-sm mt-4 text-center">{{ errorMessage }}</p>

          <button
            type="button"
            @click="openModal"
            class="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors mt-4"
          >
            Modifier le mot de passe
          </button>
        </form>
      </div>
    </div>

    <!-- Modal pour modifier le mot de passe -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-xl font-semibold mb-4">Modifier le mot de passe</h2>
        <div class="mb-4">
          <label for="admin-password" class="block text-sm font-medium text-gray-700"
            >Mot de passe administrateur</label
          >
          <input
            type="password"
            id="admin-password"
            v-model="adminPassword"
            required
            class="w-full border rounded-md p-2"
          />
        </div>
        <div class="mb-4">
          <label for="new-password" class="block text-sm font-medium text-gray-700"
            >Nouveau mot de passe</label
          >
          <input
            type="password"
            id="new-password"
            v-model="newPassword"
            required
            class="w-full border rounded-md p-2"
          />
        </div>
        <div class="mb-4">
          <label for="confirm-password" class="block text-sm font-medium text-gray-700"
            >Confirmer le mot de passe</label
          >
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            required
            class="w-full border rounded-md p-2"
          />
        </div>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="closeModal"
            class="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            @click="updatePassword"
            class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-background {
  background-image: url('@/assets/Designer.jpeg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  height: 100vh;
  width: 100vw;
}

/* .flex {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
} */

.max-w-md {
  max-width: 500px;
}
</style>
