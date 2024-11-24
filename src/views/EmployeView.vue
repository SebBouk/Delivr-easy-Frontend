<script setup lang="ts">
import FooterComponent from '@/components/FooterComponent.vue';
import { onMounted, ref } from 'vue';
import AdminView from './AdminView.vue';
import { Employe } from '@/models/Employe';
import EmployeComponent from '@/components/EmployeComponent.vue';

const mesEmploye = ref<Employe[]>([]);
const isModalOpen= ref(false);

function openModal(){
  isModalOpen.value=true;
}

function closeModal(){
  isModalOpen.value=false;
}

async function fetchClients() {
  const employeRequest = await fetch('/api/admin/get-employe');
  const employes = await employeRequest.json();
  mesEmploye.value = [...employes];
  console.log(mesEmploye.value);
}

onMounted(() => {
  fetchClients();
});

const NomEmploye = ref('');
const RoleEmploye = ref<number | null>(null);
const MailEmploye = ref('');

async function addEmploye() {
  try{
    const response = await fetch('/api/admin/ajoutEmploye',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        NomEmploye: NomEmploye.value,
        RoleEmploye: RoleEmploye.value,
        MailEmploye: MailEmploye.value,
    })
  })
  if (response.ok) {
      alert('Employe ajouté avec succès !');
      closeModal(); // Ferme le modale
      fetchClients(); // Recharge les clients
    } else {
      alert('Erreur lors de l’ajout de l\'employé');
    }
  } catch (error) {
    console.error('Erreur :', error);
  }
}
</script>

<template>
  <div>
    <AdminView />
    <div><h1>Gestion des Employés</h1></div>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="p-3 text-sm font-medium">Nom</th>
            <th class="p-3 text-sm font-medium">Rôle</th>
            <th class="p-3 text-sm font-medium">Mail</th>
            <th class="col-span-3 p-3 text-sm font-medium "></th>
          </tr>
        </thead>
        <tbody>
          <EmployeComponent
            v-for="(element, index) in mesEmploye"
            :employe="element"
            :key="index"
            class="odd:bg-white even:bg-gray-50"
          />
        </tbody>
      </table>
    </div>
    <div class="flex justify-end mt-4">
      <button
        @click="openModal"
        class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
      >
        Ajouter un Employé
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-xl font-semibold mb-4">Ajouter un Employé</h2>
        <form @submit.prevent="addEmploye">
          <div class="mb-4">
            <label for="nom" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              v-model="NomEmploye"
              type="text"
              id="nom"
              class="w-full border rounded-md p-2"
              placeholder="Entrez le nom"
              required
            />
          </div>
          <div class="mb-4">
            <label for="role" class="block text-sm font-medium text-gray-700">Rôle</label>
            <select
              v-model="RoleEmploye"
              id="role"
              class="w-full border rounded-md p-2"
              required
            >
              <option value="1">Admin</option>
              <option value="0">Livreur</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="mail" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="MailEmploye"
              type="email"
              id="mail"
              class="w-full border rounded-md p-2"
              placeholder="Entrez l'email"
              required
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
              type="submit"
              class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <FooterComponent />
  </div>
</template>

