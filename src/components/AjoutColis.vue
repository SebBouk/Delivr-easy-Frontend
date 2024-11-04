<script setup lang="ts">
import AdminView from '@/views/AdminView.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const AdresseColis = ref('');
const ContactColis = ref('');
const PoidColis = ref('');
const DateLivColis = ref('');
const router = useRouter(); 

async function addColis() {
  try {
    const response = await fetch('/api/admin/ajoutColis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        AdresseColis: AdresseColis.value,
        ContactColis: ContactColis.value,
        PoidColis: PoidColis.value,
        DateLivColis: DateLivColis.value,
      }),
    });

    if (response.ok) {
      alert('Colis ajouté avec succès !');
      router.push('/colis'); 
    } else {
      alert('Erreur lors de l’ajout du colis');
    }
  } catch (error) {
    console.error('Erreur lors de l’ajout du colis :', error);
    alert('Erreur de serveur');
  }
}
</script>

<template>
     <AdminView/>
  <div class="container">
    <h2>Ajouter un Colis</h2>
    <form @submit.prevent="addColis">

      <label for="adresseColis">Adresse</label>
      <input type="text" id="adresseColis" v-model="AdresseColis" required />

      <label for="contactColis">Contact</label>
      <input type="text" id="contactColis" v-model="ContactColis" required />

      <label for="poidsColis">Poids</label>
      <input type="text" id="poidColis" v-model="PoidColis" required />

      <label for="dateLivraisonColis">Date de Livraison</label>
      <input type="date" id="dateLivColis" v-model="DateLivColis" required />

      <button type="submit">Ajouter Colis</button>
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
input[type="date"] {
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
