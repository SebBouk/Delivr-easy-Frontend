// models/CommandeAvecClient.ts
import { Commande } from './Commande';

export interface CommandeAvecClient extends Commande {
  NomClient: string;
}
