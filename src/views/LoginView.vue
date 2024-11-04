<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginView',
  data() {
    return {
      MailEmploye: '',
      MdpEmploye: '',
      errorMessage: null as string | null 
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            MailEmploye: this.MailEmploye,
            MdpEmploye: this.MdpEmploye
          })
        });
        const data = await response.json();

        if (response.ok) {
        
          console.log('Réponse du serveur :', data);
          alert('Connexion réussie !');
          document.cookie = `token=${data.token};path=/; max-age=${60 * 60}; secure; `;
          console.log(document.cookie);
         
          if(data.RoleEmploye === 0){
            this.$router.push(`/livreur/get-colis/${data.IdEmploye}`);
          }else if (data.RoleEmploye === 1) {
          this.$router.push('/admin');
          } else{
            this.errorMessage = 'Rôle inconnu, redirection impossible.';
          }
        } else {
         
          this.errorMessage = data.message || 'Erreur lors de la connexion';
        }
      } catch (error) {
       
        console.error('Erreur de connexion :', error);
        this.errorMessage = 'Erreur de connexion. Veuillez réessayer.';
      }
    }
  }
});
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
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
      </form>
    </div>
  </div>
</template>

