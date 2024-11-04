<script setup lang="ts">
import { TourneeAvecEmploye } from '@/models/TourneeAvecEmploye';
import { jwtDecode } from 'jwt-decode';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const signaturePad = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);

function startDrawing(event: MouseEvent | TouchEvent) {
  isDrawing.value = true;
  draw(event); 
}

function draw(event: MouseEvent | TouchEvent) {
  if (!isDrawing.value) return;

  const canvas = signaturePad.value;
  const ctx = canvas?.getContext('2d');
  if (ctx && canvas) {
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    const rect = canvas.getBoundingClientRect();
    const x =
      event instanceof MouseEvent
        ? event.clientX - rect.left
        : event.touches[0].clientX - rect.left;
    const y =
      event instanceof MouseEvent ? event.clientY - rect.top : event.touches[0].clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
}

function stopDrawing() {
  isDrawing.value = false;
}

function clearCanvas() {
  const canvas = signaturePad.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  }
}

const colisRouteur = useRouter();
const props = defineProps<{
  tournee: TourneeAvecEmploye;
}>();
function getIdEmployeFromCookie(): string | null {
  const cookies = document.cookie.split('; ').map((cookie) => cookie.trim());
  const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));
  console.log('Cookie trouvé :', tokenCookie);
  if (!tokenCookie) return null;

  const token = tokenCookie.split('=')[1];
  try {
    const decodedToken = jwtDecode<{ IdEmploye: string }>(token);
    console.log('Token décodé :', decodedToken);
    return decodedToken.IdEmploye;
  } catch (error) {
    console.error('Erreur lors du décodage du token :', error);
    return null;
  }
}
async function saveSignature() {
  const NumColis = route.params.NumColis;
  const canvas = signaturePad.value;
  const idTournee = route.params.IdTournee;
  const idEmploye = getIdEmployeFromCookie();

  console.log(NumColis);
  if (canvas && NumColis) {
    const dataUrl = canvas.toDataURL('image/png');

    try {
      const response = await fetch(`/api/livreur/signature/${NumColis}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: dataUrl })
      });

      if (response.ok) {
        alert('Signature enregistrée avec succès !');
        colisRouteur.push(`/livreur/get-colis/${idEmploye}'`);
      } else {
        alert('Erreur lors de l’enregistrement de la signature');
      }
    } catch (error) {
      console.error('Erreur de requête', error);
      alert('Erreur lors de l’enregistrement de la signature');
    }
  } else {
    alert('Erreur : numColis manquant');
  }
}
</script>

<template>
  <div class="flex flex-col items-center p-4 space-y-4">
    <h2 class="text-lg font-semibold text-center">Signez ci-dessous :</h2>
    <canvas
      ref="signaturePad"
      class="border border-gray-700 w-full max-w-xs sm:max-w-md"
      width="300"
      height="150"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @touchstart="startDrawing"
      @touchmove="draw"
      @touchend="stopDrawing"
    ></canvas>
    <div class="flex space-x-4">
      <button class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" @click="clearCanvas">
        Effacer
      </button>
      <button
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        @click="saveSignature"
      >
        Enregistrer la Signature
      </button>
    </div>
  </div>
</template>

<style scoped>
canvas {
  touch-action: none; 
}
</style>
