<script setup lang="ts">
import { Employe } from '@/models/Employe';


const props = defineProps<{
    employe : Employe;
}>();

function getRoleDisplay(role: number): string {
  return role === 1 ? 'Admin' : 'Livreur';
}

</script>

<template>
    <tr>
        <td> {{ props.employe.NomEmploye }}</td>
        <td>{{ getRoleDisplay(employe.RoleEmploye) }}</td>
        <td>{{ props.employe.MailEmploye }}</td>
    </tr>
</template>