import LoginView from '@/views/LoginView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ClientView from '@/views/ClientView.vue';
import AdminView from '@/views/AdminView.vue';
import ColisView from '@/views/ColisView.vue';
import CommandeView from '@/views/CommandeView.vue';
import LivraisonView from '@/views/LivraisonView.vue';
import TourneeView from '@/views/TourneeView.vue';
import TestLivraisonEmployeView from '@/views/LivraisonTourneeView.vue';
import ColisParLivView from '@/views/ColisParLivView.vue';
import LivreurView from '@/views/LivreurView.vue';
import PageSignature from '@/components/PageSignature.vue';
import LivLivreurComponent from '@/components/LivLivreurComponent.vue';
import AjoutClient from '@/components/AjoutClient.vue';
import AjoutColis from '@/components/AjoutColis.vue';
import ColisParCommandeView from '@/views/ColisParCommandeView.vue';
import CommandeClientView from '@/views/CommandeClientView.vue';
import EmployeView from '@/views/EmployeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/clients',
      name: 'clients',
      component: ClientView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/colis',
      name: 'colis',
      component: ColisView
    },
    {
      path: '/commandes',
      name: 'commande',
      component: CommandeView
    },
    {
      path: '/commandes/Client/:IdClient',
      name: 'commande-Client',
      component: CommandeClientView
    },
    {
      path: '/livraison',
      name: 'livraison',
      component: LivraisonView
    },
    {
      path: '/tournee',
      name: 'tournee',
      component: TourneeView
    },
    {
      path: '/livraison/:IdTournee',
      name: 'livraison_Tournee',
      component: TestLivraisonEmployeView
    },
    {
      path: '/colis/Liv/:IdLivraison',
      name: 'colis_Liv',
      component: ColisParLivView
    },
    {
      path: '/colis/Com/:IdCommande',
      name: 'colis_Commande',
      component: ColisParCommandeView
    },
    {
      path:'/employe',
      name:'employe',
      component: EmployeView
      },
    {
      path: '/signature/:NumColis',
      name: 'PageSignature',
      component: PageSignature
    },
    {
      path: '/livreur/livraison',
      name: 'liv-livreur',
      component: LivLivreurComponent
    },
    {
      path: '/livreur/colis',
      name: 'colis-livreur',
      component: ColisParLivView
    },
    {
      path: '/livreur/get-colis/:IdEmploye',
      name: 'colis_employe',
      component: LivreurView
    },
    {
      path: '/admin/ajoutClient',
      name: 'ajout_client',
      component: AjoutClient
    },
    {
      path: '/admin/ajoutColis/:IdCommande',
      name: 'ajout_colis',
      component: AjoutColis
    }
  ]
});

export default router;
