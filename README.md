# Dépôt à temps – mise en route

1. **Supabase** : crée un projet, ouvre SQL Editor, colle `schema.sql`, exécute.
   Récupère l'URL et la clé `service_role` (Settings > API).
2. **Vercel** : importe ce dossier (ou `vercel deploy`), puis ajoute chaque variable de `.env.example` dans Settings > Environment Variables.
3. **Twilio** : WhatsApp (sandbox pour tester, expéditeur officiel pour la production) + un numéro SMS.
4. **Resend** : crée une clé API (ajoute ton domaine pour envoyer à d'autres adresses).
5. Redéploie, ouvre le site, Paramètres > Espace propriétaire.

Limites : PDF de 3 Mo maximum ; en production WhatsApp exige des modèles de message approuvés.
