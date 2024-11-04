<script setup lang="ts">

import { EmployeAvecLivraison } from '@/models/EmployeAvecLivraison';


const props = defineProps<{
  livreur: EmployeAvecLivraison;
}>();


</script>
<template>
  <tr>
    <td>{{ props.livreur.NomEmploye }}</td>
    <td><button >Signature</button></td>
  </tr>
</template>
