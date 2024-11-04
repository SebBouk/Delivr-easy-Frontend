<script setup lang="ts">
import AdminView from '@/views/AdminView.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const NomClient = ref('');
const AdresseFacture = ref('');
const CoordonneesClient = ref('');
const router = useRouter();

async function addClient() {
  try {
    const response = await fetch('/api/admin/ajoutClient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ NomClient: NomClient.value, AdresseFacture: AdresseFacture.value, CoordonneesClient: CoordonneesClient.value })
    });

    if (response.ok) {
      alert('Client ajouté avec succès !');
      router.push('/clients'); 
      
    } else {
      alert('Erreur lors de l’ajout du client');
    }
  } catch (error) {
    console.error('Erreur :', error);
  }
}
</script>

<template>
     <AdminView/>
  <div class="container">
    <h2>Ajouter un Client</h2>
    <form @submit.prevent="addClient">
      <div>
        <label for="nom">Nom</label>
        <input v-model="NomClient" type="text" id="nom" required />
      </div>
      <div>
        <label for="adresse">Adresse</label>
        <input v-model="AdresseFacture" type="text" id="adresse" required />
      </div>
      <div>
        <label for="telephone">Téléphone</label>
        <input v-model="CoordonneesClient" type="text" id="telephone" required />
      </div>
      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  background-color: #fff;
  width: fit-content; 
  min-width: 300px; 
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 20px auto; 
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f0f2f5;
  color: #333;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

h2 {
  font-size: 1.5rem;
  color: #4a4a4a;
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}

</style>