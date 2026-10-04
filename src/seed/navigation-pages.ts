/**
 * Pages added with the « Solutions » and « Vous êtes » menus (2026-10-04).
 * DRAFT copy assembled from the validated content of the other pages (project/3-content):
 * to be reviewed by FATIHOUNE. `imageKey` points to a photo of images.json.
 */
import { rich } from './lexical'

const quote = (label: string, topic?: string) => ({ label, kind: 'quote' as const, topic })
const info = (label: string, topic?: string) => ({ label, kind: 'info' as const, topic })
const partner = (label: string, topic?: string) => ({ label, kind: 'partnership' as const, topic })
const wa = { label: 'Écrire sur WhatsApp', kind: 'whatsapp' as const }
const link = (label: string, href: string) => ({ label, kind: 'link' as const, href })

const card = (title: string, text: string, href: string, eyebrow?: string) => ({ title, text, href, eyebrow })

/** Steps reused from the domain pages (« Comment se passe une formation avec FATIHOUNE »). */
const method = {
  blockType: 'steps' as const,
  title: 'Comment se passe une formation avec FATIHOUNE',
  items: [
    { title: 'On analyse votre besoin', body: 'Nos experts analysent la situation de votre équipe et les compétences à renforcer.' },
    { title: 'On adapte le programme', body: 'Contenu, durée, lieu et calendrier : chaque thème est adapté à votre secteur et à vos cas réels. Vous recevez une fiche technique détaillée pour chaque formation retenue.' },
    { title: 'On forme vos équipes', body: 'Dans vos locaux ou dans les nôtres. Votre formation peut être financée par le FDFP.' },
  ],
}

export const navigationPages = [
  {
    path: 'solutions',
    title: 'Solutions',
    imageKey: 'home',
    stickyCta: 'quote' as const,
    seo: { title: 'Solutions de formation et d’accompagnement | FATIHOUNE', description: 'Formation sur mesure, sessions inter-entreprises, certificats, digitalisation des PME, programmes d’insertion : les solutions FATIHOUNE à Abidjan.' },
    layout: [
      { blockType: 'hero', eyebrow: 'Entreprises · PME · institutions', title: 'Nos solutions de formation et d’accompagnement', lead: 'Former une équipe, digitaliser une PME, faire financer un plan de formation ou mener un programme d’insertion : choisissez la solution adaptée à votre situation.', buttons: [link('Être conseillé', '/contact?type=advice&from=solutions'), wa], withPhotoSlot: true },
      { blockType: 'linkCards', title: 'Choisissez votre solution', style: 'cards', items: [
        card('Digitalisation des PME', 'Audit de votre organisation, choix des outils, formation des équipes et outils sur mesure.', '/digitalisation', 'PME · numérique'),
        card('Formation sur mesure en entreprise', 'Un programme conçu à partir des besoins de votre équipe, dans vos locaux ou dans les nôtres.', '/formations#sur-mesure', 'Entreprises'),
        card('Formation inter-entreprises', 'Des sessions qui réunissent des participants de plusieurs entreprises.', '/solutions/formation-inter-entreprises', 'Entreprises · salariés'),
        card('Certificats de spécialisation', 'Cinq cycles longs de 100 à 120 heures pour se spécialiser.', '/certificats', 'Salariés · particuliers'),
        card('Programmes d’insertion et d’entrepreneuriat', 'Pour les jeunes diplômés, les porteurs de projet et les femmes, avec nos partenaires.', '/programmes', 'Institutions · partenaires'),
        card('Financement FDFP', 'Cabinet habilité par le FDFP, nous vous aidons à faire financer vos formations.', '/financement-fdfp', 'Entreprises'),
      ] },
      { blockType: 'demand', title: 'Vous ne savez pas quelle solution choisir ?', text: 'Décrivez votre situation : un conseiller vous oriente.', buttons: [link('Être conseillé', '/contact?type=advice&from=solutions'), wa] },
    ],
  },
  {
    path: 'solutions/formation-inter-entreprises',
    title: 'Formation inter-entreprises',
    parentLabel: 'solutions' as const,
    imageKey: 'ressources-humaines',
    stickyCta: 'info' as const,
    seo: { title: 'Formation inter-entreprises à Abidjan | FATIHOUNE', description: 'Formez un ou plusieurs collaborateurs en rejoignant une session inter-entreprises FATIHOUNE. Plus de 200 thèmes, finançables par le FDFP.' },
    layout: [
      { blockType: 'hero', eyebrow: 'Solution · sessions ouvertes', title: 'Formation inter-entreprises à Abidjan', lead: 'Formez un ou plusieurs collaborateurs en rejoignant une session qui réunit des participants de différentes entreprises.', buttons: [info('Demander les prochaines dates', 'Formation inter-entreprises'), wa], withPhotoSlot: true },
      { blockType: 'text', title: 'Pour qui ?', body: rich('Les entreprises qui ont peu de personnes à former sur un même thème, et les salariés qui veulent se perfectionner. Les échanges entre participants de secteurs différents enrichissent la formation.') },
      { blockType: 'text', tone: 'white', title: 'Les thèmes', body: rich('Les sessions portent sur les thèmes de notre catalogue : plus de 200 formations dans 11 domaines, du management à l’informatique en passant par la comptabilité et la QHSE.', 'Contactez-nous pour connaître les prochaines sessions et leurs dates.') },
      { blockType: 'text', tone: 'callout', title: 'Finançable par le FDFP', body: rich('FATIHOUNE est un cabinet habilité par le FDFP : si votre entreprise est à jour de ses cotisations, la formation peut être prise en charge.') },
      { blockType: 'demand', title: 'Connaître les prochaines sessions', buttons: [info('Demander les prochaines dates', 'Formation inter-entreprises'), link('Voir les formations', '/formations')] },
    ],
  },
  {
    path: 'vous-etes/entreprise',
    title: 'Une entreprise',
    parentLabel: 'vous-etes' as const,
    imageKey: 'management',
    stickyCta: 'quote' as const,
    seo: { title: 'Formation des salariés pour les entreprises | FATIHOUNE', description: 'Entreprises de Côte d’Ivoire : faites former vos équipes en management, RH, comptabilité, informatique, QHSE… Sur mesure, finançable par le FDFP.' },
    layout: [
      { blockType: 'hero', eyebrow: 'Vous êtes une entreprise', title: 'Développer les compétences de vos équipes', lead: 'Management, ressources humaines, comptabilité, informatique, QHSE, maintenance… FATIHOUNE forme vos collaborateurs dans vos locaux ou dans les nôtres, avec des programmes adaptés à votre métier.', buttons: [quote('Demander un devis'), link('Voir les formations', '/formations')], showProof: true, withPhotoSlot: true },
      { blockType: 'linkCards', title: 'Ce que nous vous proposons', style: 'cards', items: [
        card('Plus de 200 formations', 'Onze domaines, du management à l’informatique et à la QHSE.', '/formations'),
        card('Formation sur mesure', 'Un programme conçu pour votre équipe et vos cas réels.', '/formations#sur-mesure'),
        card('Formation inter-entreprises', 'Pour former une ou deux personnes sur un thème.', '/solutions/formation-inter-entreprises'),
        card('Financement FDFP', 'Nous vous aidons à faire financer vos formations.', '/financement-fdfp'),
      ] },
      method,
      { blockType: 'stats', title: 'FATIHOUNE en chiffres' },
      { blockType: 'demand', title: 'Un besoin de formation pour votre équipe ?', buttons: [quote('Demander un devis'), wa] },
    ],
  },
  {
    path: 'vous-etes/pme',
    title: 'Une PME ou une TPE',
    parentLabel: 'vous-etes' as const,
    imageKey: 'digitalisation',
    stickyCta: 'quote' as const,
    seo: { title: 'PME et TPE : digitalisation et formation | FATIHOUNE', description: 'PME et TPE de Côte d’Ivoire : digitalisez votre organisation, formez dirigeants et salariés, faites financer vos formations (Projet TPE du FDFP).' },
    layout: [
      { blockType: 'hero', eyebrow: 'Vous êtes une PME ou une TPE', title: 'Digitaliser votre entreprise et former vos équipes', lead: 'Trop de papier, des fichiers Excel partout, des clients difficiles à suivre ? FATIHOUNE accompagne les PME vers le numérique et forme dirigeants et salariés, avec des solutions adaptées à votre taille.', buttons: [quote('Demander un diagnostic', 'Digitalisation — diagnostic'), link('Découvrir la digitalisation', '/digitalisation')], withPhotoSlot: true },
      { blockType: 'linkCards', title: 'Nos solutions pour les PME', style: 'cards', items: [
        card('Digitalisation', 'Audit, choix des outils, formation des équipes, outils sur mesure.', '/digitalisation', 'Solution phare'),
        card('Comptabilité et gestion', 'Comptabilité simplifiée, SYSCOHADA révisé, analyse financière.', '/formations/comptabilite-finance-fiscalite'),
        card('Formation sur mesure', 'Un programme conçu pour votre équipe, à votre rythme.', '/formations#sur-mesure'),
        card('Financement FDFP', 'Faire financer la formation de vos équipes.', '/financement-fdfp'),
      ] },
      { blockType: 'text', tone: 'callout', title: 'Le Projet TPE du FDFP', body: rich('Les très petites entreprises (TPE) bénéficient d’un dispositif dédié, le **Projet TPE**, pour former leurs dirigeants et leur personnel à la gestion. FATIHOUNE, cabinet habilité par le FDFP, vous accompagne.') },
      { blockType: 'demand', title: 'Où en est votre entreprise avec le numérique ?', buttons: [quote('Demander un diagnostic', 'Digitalisation — diagnostic'), wa] },
    ],
  },
  {
    path: 'vous-etes/institution',
    title: 'Une institution ou un partenaire',
    parentLabel: 'vous-etes' as const,
    imageKey: 'programmes',
    stickyCta: 'partnership' as const,
    seo: { title: 'Institutions et partenaires : programmes de formation | FATIHOUNE', description: 'Ministères, collectivités, associations : FATIHOUNE conçoit et met en œuvre vos programmes de formation, d’insertion et d’entrepreneuriat en Côte d’Ivoire.' },
    layout: [
      { blockType: 'hero', eyebrow: 'Vous êtes une institution ou un partenaire', title: 'Concevoir et mener vos programmes de formation et d’insertion', lead: 'Ministères, collectivités, associations et organisations de jeunesse : nous montons et supervisons vos projets de formation et d’insertion, et nous vous aidons à rechercher des financements.', buttons: [partner('Proposer un partenariat'), link('Voir nos références', '/references')], withPhotoSlot: true },
      { blockType: 'linkCards', title: 'Nos programmes', style: 'cards', items: [
        card('Insertion professionnelle des jeunes', 'Préparer les jeunes diplômés à trouver un emploi, grâce à notre méthode T.M.O.C.', '/programmes/insertion-professionnelle'),
        card('Entrepreneuriat', 'Former, accompagner et suivre les porteurs de projet jusqu’à la réussite de leur entreprise.', '/programmes/entrepreneuriat'),
        card('Autonomisation des femmes', 'Former les femmes pour renforcer leur autonomie économique.', '/programmes#femmes'),
        card('Nos références', 'Les institutions et entreprises qui nous font confiance.', '/references'),
      ] },
      { blockType: 'stats', title: 'Quelques résultats' },
      { blockType: 'demand', title: 'Un programme à concevoir ou à mettre en œuvre ?', buttons: [partner('Proposer un partenariat'), wa] },
    ],
  },
  {
    path: 'vous-etes/particulier',
    title: 'Un particulier ou un jeune diplômé',
    parentLabel: 'vous-etes' as const,
    imageKey: 'programmes/insertion-professionnelle',
    stickyCta: 'info' as const,
    seo: { title: 'Particuliers et jeunes diplômés : se former | FATIHOUNE', description: 'Certificats de spécialisation, méthode T.M.O.C. pour trouver un emploi, accompagnement à la création d’entreprise, anglais : se former avec FATIHOUNE à Abidjan.' },
    layout: [
      { blockType: 'hero', eyebrow: 'Vous êtes un particulier ou un jeune diplômé', title: 'Vous former pour évoluer ou trouver un emploi', lead: 'Certificats de spécialisation pour progresser dans votre métier, méthode T.M.O.C. pour proposer vos compétences à un employeur, accompagnement à la création d’entreprise.', buttons: [info('Demander des informations'), wa], withPhotoSlot: true },
      { blockType: 'linkCards', title: 'Pour vous', style: 'cards', items: [
        card('Certificats de spécialisation', 'Cinq cycles longs de 100 à 120 heures.', '/certificats'),
        card('Insertion professionnelle', 'Apprendre à proposer vos compétences et réussir vos entretiens.', '/programmes/insertion-professionnelle'),
        card('Entrepreneuriat', 'De l’idée à l’entreprise qui tourne.', '/programmes/entrepreneuriat'),
        card('Langues', 'Anglais du niveau débutant au niveau professionnel, et arabe.', '/formations/langues'),
      ] },
      { blockType: 'demand', title: 'Une question sur une formation ?', buttons: [info('Demander des informations'), wa] },
    ],
  },
]

/** Home page highlight for Digitalisation, inserted right after the domain index. */
export const digitalisationHighlight = {
  blockType: 'hero' as const,
  variant: 'fullbleed' as const,
  imageKey: 'digitalisation',
  eyebrow: 'Solution pour les PME',
  title: 'Digitalisez votre entreprise, pas à pas',
  lead: 'Audit de votre organisation, choix des outils adaptés à votre budget, formation de vos équipes et outils sur mesure si nécessaire.',
  buttons: [link('Découvrir la digitalisation', '/digitalisation'), quote('Demander un diagnostic', 'Digitalisation — diagnostic')],
}

export const navigationSettings = {
  popularSearches: ['Excel', 'Management', 'ISO 45001', 'Fiscalité', 'Anglais'],
  featuredSolution: {
    eyebrow: 'Solution phare pour les PME',
    title: 'Digitalisation des PME',
    text: 'De l’audit à l’adoption des outils : nous accompagnons votre entreprise vers le numérique.',
    href: '/digitalisation',
    imageKey: 'digitalisation',
  },
}
