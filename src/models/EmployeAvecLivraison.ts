// models/CommandeAvecClient.ts
import { Employe } from './Employe';

export interface EmployeAvecLivraison extends Employe {
  IdLivraison: number;
}
