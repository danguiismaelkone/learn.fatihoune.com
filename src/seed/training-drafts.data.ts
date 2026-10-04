/**
 * DRAFT content for the first 15 detailed training pages (lot 5).
 * Written from the training titles only: every line must be reviewed by FATIHOUNE before
 * « Publier la fiche détaillée » is ticked in the admin. Nothing here is published automatically.
 */
export type TrainingDraft = {
  domain: string
  title: string
  audience: string
  prerequisites?: string
  objectives: string[]
  program: string[]
}

export const trainingDrafts: TrainingDraft[] = [
  {
    domain: 'management',
    title: 'Manager avec performance',
    audience: 'Managers, chefs de service et responsables d’équipe qui veulent améliorer les résultats de leur équipe.',
    prerequisites: 'Encadrer ou s’apprêter à encadrer une équipe.',
    objectives: [
      'Clarifier son rôle de manager et ses priorités',
      'Fixer des objectifs clairs et mesurables à son équipe',
      'Suivre la performance avec des indicateurs simples',
      'Conduire des entretiens de suivi et de recadrage',
    ],
    program: [
      'Le rôle du manager : missions, responsabilités, posture',
      'Fixer et décliner les objectifs de l’équipe',
      'Organiser le travail et répartir les tâches',
      'Suivre la performance : indicateurs et tableau de bord',
      'Motiver, reconnaître et recadrer',
      'Mises en situation à partir des cas des participants',
    ],
  },
  {
    domain: 'management',
    title: 'Management du changement',
    audience: 'Dirigeants, managers et chefs de projet qui conduisent une réorganisation, un nouvel outil ou une nouvelle façon de travailler.',
    objectives: [
      'Comprendre les réactions individuelles et collectives face au changement',
      'Construire un plan d’accompagnement du changement',
      'Communiquer pour faire adhérer les équipes',
      'Suivre la mise en œuvre et ajuster',
    ],
    program: [
      'Les différents types de changement dans l’entreprise',
      'Les réactions face au changement et les résistances',
      'Diagnostiquer la situation et les acteurs concernés',
      'Bâtir le plan d’accompagnement : étapes, rôles, calendrier',
      'Communiquer et impliquer les équipes',
      'Suivre, mesurer et consolider le changement',
    ],
  },
  {
    domain: 'ressources-humaines',
    title: 'Les techniques de recrutement',
    audience: 'Responsables et chargés des ressources humaines, managers qui participent aux recrutements.',
    objectives: [
      'Définir précisément le poste et le profil recherché',
      'Choisir les bons canaux pour trouver des candidats',
      'Trier les candidatures avec des critères objectifs',
      'Conduire un entretien et prendre une décision argumentée',
    ],
    program: [
      'Analyser le besoin et rédiger la description de poste',
      'Rédiger et diffuser l’offre d’emploi',
      'Présélectionner les candidatures : grille de critères',
      'Préparer et conduire l’entretien de recrutement',
      'Tests, mises en situation et prise de références',
      'Décider, intégrer le nouveau collaborateur',
    ],
  },
  {
    domain: 'comptabilite-finance-fiscalite',
    title: 'Le SYSCOHADA révisé',
    audience: 'Comptables, aides-comptables, responsables administratifs et financiers des entreprises de l’espace OHADA.',
    prerequisites: 'Connaître les bases de la comptabilité générale.',
    objectives: [
      'Connaître les principaux changements du SYSCOHADA révisé',
      'Appliquer les nouvelles règles de comptabilisation',
      'Produire les états financiers selon le référentiel révisé',
    ],
    program: [
      'Le cadre conceptuel et les principes du SYSCOHADA révisé',
      'Les changements dans le plan de comptes',
      'Les opérations courantes et leurs nouvelles règles de traitement',
      'Les opérations de fin d’exercice',
      'Les états financiers et les notes annexes',
      'Exercices pratiques sur des cas d’entreprise',
    ],
  },
  {
    domain: 'comptabilite-finance-fiscalite',
    title: 'Analyse financière',
    audience: 'Responsables financiers, comptables, contrôleurs de gestion et managers qui lisent ou présentent des états financiers.',
    prerequisites: 'Savoir lire un bilan et un compte de résultat.',
    objectives: [
      'Analyser l’activité et la rentabilité d’une entreprise',
      'Évaluer sa structure financière et sa trésorerie',
      'Calculer et interpréter les principaux ratios',
      'Présenter un diagnostic financier clair',
    ],
    program: [
      'Les documents de base : bilan, compte de résultat, tableau des flux',
      'Les soldes intermédiaires de gestion',
      'Le bilan fonctionnel : fonds de roulement, besoin en fonds de roulement, trésorerie',
      'Les ratios de rentabilité, de structure et de liquidité',
      'Construire et rédiger un diagnostic financier',
      'Étude de cas complète',
    ],
  },
  {
    domain: 'marketing-vente',
    title: 'Négociation commerciale',
    audience: 'Commerciaux, chargés de clientèle, acheteurs et managers commerciaux.',
    objectives: [
      'Préparer une négociation avec méthode',
      'Défendre ses prix et ses conditions',
      'Traiter les objections du client',
      'Conclure un accord durable pour les deux parties',
    ],
    program: [
      'Les étapes d’une négociation commerciale',
      'Préparer : objectifs, marges de manœuvre, arguments',
      'Comprendre les besoins et les motivations du client',
      'Argumenter et traiter les objections',
      'Défendre le prix et négocier les contreparties',
      'Conclure et assurer le suivi ; jeux de rôle filmés ou observés',
    ],
  },
  {
    domain: 'marketing-vente',
    title: 'Les fondamentaux de la relation client',
    audience: 'Personnel en contact avec la clientèle : accueil, service client, vente, après-vente.',
    objectives: [
      'Comprendre les attentes des clients',
      'Accueillir et communiquer avec professionnalisme',
      'Gérer les réclamations et les clients mécontents',
      'Contribuer à la fidélisation des clients',
    ],
    program: [
      'Les enjeux de la relation client pour l’entreprise',
      'Les attentes du client et la qualité de service',
      'L’accueil physique et téléphonique',
      'Écouter, questionner, reformuler',
      'Traiter une réclamation et désamorcer un conflit',
      'Fidéliser : suivi et petites attentions qui comptent',
    ],
  },
  {
    domain: 'informatique-bureautique',
    title: 'Excel',
    audience: 'Toute personne qui utilise Excel au travail, du débutant à l’utilisateur régulier qui veut gagner du temps.',
    prerequisites: 'Savoir utiliser un ordinateur sous Windows.',
    objectives: [
      'Créer et mettre en forme des tableaux propres',
      'Utiliser les formules et fonctions courantes',
      'Trier, filtrer et analyser des données',
      'Présenter des résultats avec des graphiques et des tableaux croisés dynamiques',
    ],
    program: [
      'Prise en main : classeur, feuilles, saisie, mise en forme',
      'Formules et fonctions de base : SOMME, MOYENNE, SI…',
      'Fonctions de recherche et références',
      'Trier, filtrer, mise en forme conditionnelle',
      'Graphiques',
      'Tableaux croisés dynamiques ; exercices sur les fichiers des participants',
    ],
  },
  {
    domain: 'qhse',
    title: 'Santé et sécurité au travail selon la norme ISO 45001',
    audience: 'Responsables QHSE, animateurs sécurité, managers et membres des comités de santé et sécurité.',
    objectives: [
      'Comprendre les exigences de la norme ISO 45001',
      'Identifier les dangers et évaluer les risques professionnels',
      'Contribuer à la mise en place d’un système de management de la santé et sécurité',
    ],
    program: [
      'Les enjeux de la santé et sécurité au travail',
      'Structure et exigences de la norme ISO 45001',
      'Identification des dangers et évaluation des risques',
      'Consultation et participation des travailleurs',
      'Préparation aux situations d’urgence, suivi des incidents',
      'Amélioration continue ; études de cas',
    ],
  },
  {
    domain: 'qhse',
    title: 'Compréhension et Mise en Place de l\'ISO 9001 v2015',
    audience: 'Responsables qualité, dirigeants et managers d’une entreprise qui prépare ou fait vivre une démarche qualité.',
    objectives: [
      'Comprendre les exigences de l’ISO 9001 version 2015',
      'Identifier les étapes de mise en place d’un système de management de la qualité',
      'Rédiger les éléments essentiels du système',
    ],
    program: [
      'Les principes du management de la qualité',
      'Structure et exigences de l’ISO 9001 v2015',
      'Approche processus et approche par les risques',
      'Planifier la mise en place : étapes et acteurs',
      'Informations documentées, indicateurs, audits internes',
      'Revue de direction et amélioration continue',
    ],
  },
  {
    domain: 'maintenance-logistique',
    title: 'Formation approfondie sur le logiciel de maintenance GMAO',
    audience: 'Techniciens, agents de méthodes et responsables de maintenance.',
    prerequisites: 'Connaître l’organisation d’un service de maintenance ; être à l’aise avec l’ordinateur.',
    objectives: [
      'Comprendre le rôle d’une GMAO dans l’organisation de la maintenance',
      'Paramétrer le parc d’équipements et les plans de maintenance',
      'Gérer les interventions, les pièces et les coûts',
      'Exploiter les indicateurs de maintenance',
    ],
    program: [
      'Rôle et fonctions d’une GMAO',
      'Structurer le parc : arborescence des équipements',
      'Maintenance préventive : plans et déclenchements',
      'Demandes et ordres de travail',
      'Gestion des stocks de pièces et des coûts',
      'Indicateurs et tableaux de bord ; exercices sur le logiciel',
    ],
  },
  {
    domain: 'mines-geologie',
    title: 'Introduction à l\'exploitation des mines',
    audience: 'Nouveaux collaborateurs du secteur minier, personnel administratif et technique qui veut comprendre le cycle d’une mine.',
    objectives: [
      'Comprendre les grandes étapes d’un projet minier',
      'Connaître les principales méthodes d’exploitation',
      'Identifier les enjeux de sécurité et d’environnement',
    ],
    program: [
      'Le cycle de vie d’une mine : de l’exploration à la fermeture',
      'Notions de géologie et de gisement',
      'Exploitation à ciel ouvert et exploitation souterraine',
      'Traitement du minerai',
      'Sécurité, santé et environnement sur un site minier',
      'Aspects économiques et réglementaires',
    ],
  },
  {
    domain: 'ingenierie-formation',
    title: 'Elaboration et mise en œuvre d\'un plan de formation',
    audience: 'Responsables formation, responsables RH et dirigeants de PME.',
    objectives: [
      'Recenser et analyser les besoins de formation',
      'Construire un plan de formation aligné sur les objectifs de l’entreprise',
      'Budgéter le plan et préparer sa prise en charge par le FDFP',
      'Suivre et évaluer les actions réalisées',
    ],
    program: [
      'Le plan de formation : rôle et enjeux',
      'Recueillir et analyser les besoins',
      'Prioriser et construire le plan',
      'Budget et financement : le rôle du FDFP',
      'Mettre en œuvre : calendrier, prestataires, logistique',
      'Évaluer les actions et préparer le plan suivant',
    ],
  },
  {
    domain: 'developpement-personnel',
    title: 'Gérer efficacement son temps',
    audience: 'Tout collaborateur qui veut mieux organiser son travail et réduire la pression des urgences.',
    objectives: [
      'Analyser l’usage actuel de son temps',
      'Distinguer l’urgent de l’important et fixer ses priorités',
      'Planifier sa semaine et ses journées',
      'Limiter les interruptions et savoir dire non',
    ],
    program: [
      'Diagnostic : où passe mon temps ?',
      'Priorités : urgent et important',
      'Outils de planification',
      'Gérer les interruptions, les réunions et les e-mails',
      'S’affirmer et savoir dire non',
      'Plan d’action personnel',
    ],
  },
  {
    domain: 'langues',
    title: 'Anglais niveau professionnel',
    audience: 'Collaborateurs qui utilisent l’anglais dans leur travail : échanges écrits, réunions, appels, présentations.',
    prerequisites: 'Niveau intermédiaire en anglais. Un test de positionnement est proposé avant la formation.',
    objectives: [
      'Communiquer avec aisance dans les situations professionnelles courantes',
      'Rédiger des e-mails et des documents professionnels',
      'Participer à des réunions et faire une présentation',
      'Enrichir le vocabulaire de son métier',
    ],
    program: [
      'Test de positionnement et objectifs individuels',
      'Écrit professionnel : e-mails, comptes rendus, rapports',
      'Oral : téléphone, réunions, négociation',
      'Présenter un projet ou des résultats',
      'Vocabulaire du secteur des participants',
      'Mises en situation et bilan de progression',
    ],
  },
]
