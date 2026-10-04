import { rich } from './lexical'

const quote = (label: string, topic?: string) => ({ label, kind: 'quote' as const, topic })
const info = (label: string, topic?: string) => ({ label, kind: 'info' as const, topic })
const partner = (label: string, topic?: string) => ({ label, kind: 'partnership' as const, topic })
const wa = { label: 'Écrire sur WhatsApp', kind: 'whatsapp' as const }
const link = (label: string, href: string) => ({ label, kind: 'link' as const, href })

/** Validated copy from project/3-content/pages (2026-10-03). Passages marked [À CONFIRMER] are deliberately left out. */
export const pages = [
  {
    path: 'accueil',
    title: 'Accueil',
    stickyCta: 'quote',
    seo: {
      title: 'Cabinet de formation à Abidjan habilité FDFP | FATIHOUNE',
      description: 'Formations pour entreprises, accompagnement au numérique et programmes d’insertion. Cabinet habilité FDFP à Abidjan. Demandez votre devis en ligne.',
    },
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Cabinet de formation · Abidjan',
        title: 'Cabinet de formation à Abidjan, habilité par le FDFP',
        lead: 'Vous voulez des équipes plus compétentes et plus efficaces ? FATIHOUNE forme vos collaborateurs, accompagne votre entreprise vers le numérique et vous aide à faire financer vos formations.',
        buttons: [quote('Demander un devis'), link('Voir nos formations', '/formations')],
        showProof: true,
        withPhotoSlot: true,
        variant: 'fullbleed',
        showSearch: true,
      },
      { blockType: 'domainIndex', title: 'Nos domaines de formation' },
      {
        blockType: 'linkCards',
        title: 'Ce que nous faisons pour vous',
        style: 'doors',
        items: [
          { eyebrow: 'Entreprises', title: 'Former vos équipes', text: 'Plus de 200 formations en management, ressources humaines, comptabilité, informatique, sécurité, maintenance et bien d’autres domaines. Chaque formation peut être adaptée à votre métier et à votre calendrier.', href: '/formations' },
          { eyebrow: 'Entreprises', title: 'Digitaliser votre entreprise', text: 'Audit, choix des outils, formation de vos équipes et outils sur mesure : nous vous accompagnons pas à pas vers le numérique.', href: '/digitalisation' },
          { eyebrow: 'Jeunes, femmes, partenaires', title: 'Insérer et entreprendre', text: 'Des programmes pour les jeunes diplômés, les porteurs de projet et les femmes, menés avec des institutions publiques et des partenaires de développement.', href: '/programmes' },
        ],
      },
      {
        blockType: 'text',
        tone: 'callout',
        title: 'Votre formation peut être financée par le FDFP',
        body: rich('Votre entreprise cotise à la taxe de formation continue. FATIHOUNE est un cabinet habilité par le FDFP : nous vous aidons à monter votre dossier pour que vos formations soient prises en charge.'),
      },
      {
        blockType: 'referencesTeaser',
        title: 'Des institutions et des entreprises nous font confiance',
        intro: 'Ministères, conseils régionaux, mairies, agences publiques et partenaires internationaux : FATIHOUNE intervient partout en Côte d’Ivoire, d’Abidjan à San-Pédro, de Dabou à Danané.',
        showStats: true,
      },
      {
        blockType: 'list',
        title: 'Le professionnalisme comme règle',
        items: [
          { strong: 'Des experts de terrain.', text: 'Nos formateurs sont des praticiens de leur domaine.' },
          { strong: 'Des formations sur mesure.', text: 'Nous partons de vos besoins, pas d’un programme figé.' },
          { strong: 'Un cabinet habilité.', text: 'Habilitation FDFP, membre du Réseau GERME, références publiques vérifiables.' },
        ],
      },
      { blockType: 'demand', title: 'Parlons de vos besoins en formation', text: 'Décrivez-nous votre projet. Nous vous répondons avec une proposition adaptée.', buttons: [quote('Demander un devis'), wa] },
    ],
  },
  {
    path: 'digitalisation',
    title: 'Digitalisation',
    stickyCta: 'quote',
    seo: { title: 'Digitalisation des PME en Côte d’Ivoire | FATIHOUNE', description: 'Audit, choix des outils, formation des équipes, logiciels sur mesure et marketing digital : FATIHOUNE accompagne la digitalisation de votre entreprise.' },
    layout: [
      { blockType: 'hero', eyebrow: 'Entreprises · numérique', title: 'Digitalisation des PME en Côte d’Ivoire : de l’audit à l’adoption des outils', lead: 'Trop de papier, des fichiers Excel partout, des clients difficiles à suivre ? FATIHOUNE analyse votre organisation, choisit avec vous les bons outils numériques, forme vos équipes et crée des solutions sur mesure si nécessaire.', buttons: [quote('Demander un diagnostic', 'Digitalisation — diagnostic')] },
      {
        blockType: 'steps',
        title: 'Une démarche pas à pas, adaptée à votre taille',
        items: [
          { title: 'Audit de votre organisation', body: 'Nous observons comment vous travaillez aujourd’hui : tâches répétitives, circulation de l’information, outils déjà en place. Vous recevez un état des lieux et des priorités claires.' },
          { title: 'Choix des outils', body: 'Nous vous proposons les outils adaptés à votre activité et à votre budget : gestion, facturation, relation client, travail collaboratif. Pas de solution imposée : la bonne solution est celle que votre équipe utilisera.' },
          { title: 'Formation de vos équipes', body: 'Un outil n’apporte rien s’il n’est pas utilisé. Nous formons vos collaborateurs à la prise en main et aux bons réflexes, jusqu’à ce qu’ils soient autonomes.' },
          { title: 'Outils sur mesure', body: 'Quand aucun outil existant ne convient, nous concevons pour vous une application ou un logiciel personnalisé.' },
        ],
      },
      { blockType: 'text', title: 'Être visible en ligne et attirer de nouveaux clients', body: rich('Nous mettons en place votre système de marketing digital : présence en ligne, réseaux sociaux, campagnes et suivi des résultats. Depuis 2020, nous avons formé et incubé 500 jeunes aux métiers du marketing digital.') },
      { blockType: 'linkCards', title: 'Former au numérique et à l’intelligence artificielle', style: 'cards', items: [{ title: 'Formations informatique, bureautique et IA', text: 'Nos formations préparent vos équipes aux outils de demain.', href: '/formations/informatique-bureautique' }, { title: 'Financement FDFP', text: 'Les formations de vos équipes aux outils numériques peuvent être financées par le FDFP.', href: '/financement-fdfp' }] },
      { blockType: 'demand', title: 'Où en est votre entreprise avec le numérique ?', buttons: [quote('Demander un diagnostic', 'Digitalisation — diagnostic'), wa] },
    ],
  },
  {
    path: 'financement-fdfp',
    title: 'Financement FDFP',
    stickyCta: 'quote',
    seo: { title: 'Financement formation FDFP : comment en profiter', description: 'Faites financer la formation de vos salariés par le FDFP. FATIHOUNE, cabinet habilité, vous accompagne du besoin au dossier. Demandez conseil.' },
    layout: [
      { blockType: 'hero', eyebrow: 'Entreprises · financement', title: 'Faites financer la formation de vos équipes par le FDFP', lead: 'Votre entreprise paie chaque année des taxes pour la formation professionnelle. Ces cotisations peuvent financer la formation de vos salariés. FATIHOUNE, cabinet habilité par le FDFP, vous aide à en profiter.', buttons: [quote('Demander un devis', 'Financement FDFP'), wa] },
      { blockType: 'text', title: 'Le Fonds qui finance la formation des salariés en Côte d’Ivoire', body: rich('Le FDFP (Fonds de Développement de la Formation Professionnelle) finance la formation des salariés du secteur privé. Il est alimenté par deux taxes payées par les entreprises : la taxe d’apprentissage et la taxe additionnelle à la formation professionnelle continue.') },
      { blockType: 'text', title: 'Toute entreprise à jour de ses cotisations', body: rich('Pour déposer une demande, votre entreprise doit être à jour du paiement de ces deux taxes. Les très petites entreprises (TPE) bénéficient aussi d’un dispositif dédié, le **Projet TPE**, pour former leurs dirigeants et leur personnel à la gestion.') },
      { blockType: 'linkCards', title: 'Les dispositifs du FDFP', style: 'cards', items: [
        { eyebrow: 'Entreprises', title: 'Plan de formation de l’entreprise', text: 'Vos cotisations financent la formation de vos salariés. Si vous le souhaitez, nous vous aidons à préparer le plan à déposer.', href: '/contact?type=quote&topic=Financement%20FDFP%20%E2%80%94%20plan%20de%20formation&from=financement-fdfp' },
        { eyebrow: 'Très petites entreprises', title: 'Projet TPE', text: 'Former les dirigeants et le personnel des TPE à la gestion.', href: '/contact?type=advice&topic=Financement%20FDFP%20%E2%80%94%20Projet%20TPE&from=financement-fdfp' },
      ] },
      { blockType: 'steps', title: 'Comment ça marche, en 3 étapes', items: [
        { title: 'On analyse vos besoins', body: 'Nous identifions avec vous les compétences à renforcer et les formations utiles.' },
        { title: 'Le dossier', body: 'Vous déposez votre plan de formation auprès du FDFP. Si vous le souhaitez, nous vous aidons à le préparer.' },
        { title: 'On forme vos équipes', body: 'Une fois le plan approuvé par le FDFP, nous réalisons les formations, dans vos locaux ou dans les nôtres.' },
      ] },
      { blockType: 'text', title: 'Un cabinet habilité par le FDFP', body: rich('FATIHOUNE est un cabinet habilité par le FDFP. Nous connaissons les exigences du Fonds et nous avons déjà accompagné des formations financées, y compris au profit de TPE.') },
      { blockType: 'demand', title: 'Faites financer vos prochaines formations', buttons: [quote('Demander un devis', 'Financement FDFP'), wa] },
    ],
  },
  {
    path: 'programmes',
    title: 'Programmes',
    stickyCta: 'partnership',
    seo: { title: 'Programmes insertion, entrepreneuriat et femmes | FATIHOUNE', description: 'Programmes d’insertion des jeunes, d’entrepreneuriat et d’autonomisation des femmes en Côte d’Ivoire, menés avec ministères et partenaires.' },
    layout: [
      { blockType: 'hero', eyebrow: 'Jeunes · porteurs de projet · femmes', title: 'Programmes d’insertion, d’entrepreneuriat et d’autonomisation des femmes en Côte d’Ivoire', lead: 'FATIHOUNE conçoit et met en œuvre des programmes pour les jeunes, les porteurs de projet et les femmes, avec les ministères, les collectivités et les partenaires de développement.', buttons: [partner('Proposer un partenariat')] },
      { blockType: 'linkCards', title: 'Nos trois programmes', style: 'cards', items: [
        { title: 'Insertion professionnelle des jeunes', text: 'Préparer les jeunes diplômés à trouver un emploi, grâce à notre méthode T.M.O.C.', href: '/programmes/insertion-professionnelle' },
        { title: 'Entrepreneuriat', text: 'Former, accompagner et suivre les porteurs de projet jusqu’à la réussite de leur entreprise.', href: '/programmes/entrepreneuriat' },
        { title: 'Autonomisation des femmes', text: 'Former les femmes pour renforcer leur autonomie économique.', href: '/programmes#femmes' },
      ] },
      { blockType: 'text', anchor: 'femmes', tone: 'white', title: 'Former les femmes pour renforcer leur autonomie économique', body: rich('FATIHOUNE accompagne les coopératives et les associations de femmes : techniques de production, hygiène, gestion coopérative et gestion d’activité.', '**Une réalisation :** en 2022, **300 femmes** de la coopérative BANOUDO, à San-Pédro, ont été formées à la transformation du manioc, à l’hygiène alimentaire et à la gestion coopérative.') },
      { blockType: 'stats' },
      { blockType: 'timeline', title: 'Quelques réalisations', items: [
        { year: '2025', text: 'Accompagnement de jeunes entrepreneurs dans la gestion et la formalisation d’entreprise, programme de lutte contre les fragilités dans les zones frontalières du nord.' },
        { year: '2025', text: 'Conception d’un projet d’accompagnement des migrants ivoiriens vers une insertion durable.' },
        { year: '2024', text: 'Renforcement des capacités de dirigeants de PME en management et outils de gestion, zones frontalières du nord.' },
        { year: '2024', text: 'Formation d’acteurs du secteur informel à la gestion et à la formalisation, dans le cadre du FASI.' },
        { year: '2023-2024', text: 'Formation de jeunes du Tchologo aux métiers du commerce et de la caisse, avec le ministère de la Promotion de la Jeunesse.' },
        { year: '2023', text: 'Formation de 200 promoteurs en entrepreneuriat, gestion et formalisation.' },
        { year: '2022', text: 'Formation de 300 femmes de la coopérative BANOUDO.' },
        { year: '2020', text: 'Formation et incubation de 500 jeunes aux métiers du marketing digital.' },
      ] },
      { blockType: 'partners', title: 'Ils sont nos partenaires' },
      { blockType: 'demand', title: 'Vous portez un programme ? Construisons-le ensemble.', buttons: [partner('Proposer un partenariat'), wa] },
    ],
  },
  {
    path: 'programmes/insertion-professionnelle',
    title: 'Insertion professionnelle',
    parentLabel: 'programmes',
    stickyCta: 'info',
    seo: { title: 'Insertion professionnelle des jeunes diplômés | FATIHOUNE', description: 'Jeunes diplômés : apprenez à proposer vos compétences et réussissez vos entretiens grâce à la méthode T.M.O.C. Programmes d’insertion en Côte d’Ivoire.' },
    layout: [
      { blockType: 'hero', eyebrow: 'Programme · jeunes diplômés', title: 'Insertion professionnelle des jeunes : de votre diplôme à votre premier emploi', lead: 'Vous avez un diplôme, mais pas encore d’emploi ? FATIHOUNE vous apprend à présenter vos compétences, à chercher efficacement et à réussir vos entretiens.', buttons: [info('Demander des informations', 'Insertion professionnelle')] },
      { blockType: 'text', title: 'Notre méthode : la Technique et Méthode d’Offre de Compétence (T.M.O.C.)', body: rich('Plutôt que de « chercher un emploi », vous apprenez à **proposer vos compétences** à un employeur. FATIHOUNE a développé la méthode T.M.O.C. pour aider les jeunes diplômés des écoles, grandes écoles et universités à réaliser leur projet professionnel.') },
      { blockType: 'list', title: 'Un accompagnement du CV à l’entretien', items: [
        { text: 'Formation aux techniques et méthodes de recherche d’emploi.' },
        { text: 'Aide à la préparation de votre dossier d’offre de compétence.' },
        { text: 'Préparation aux entretiens d’embauche.' },
        { text: 'Inscription dans notre base de jeunes demandeurs d’emploi.' },
      ] },
      { blockType: 'text', tone: 'white', title: 'Concevoir et piloter vos projets d’insertion', body: rich('Ministères, collectivités, associations et organisations de jeunesse : nous montons et supervisons vos projets de formation et d’insertion, et nous vous aidons à rechercher des financements.', '**Exemple :** en 2023-2024, formation de jeunes du Tchologo aux métiers du commerce et de la caisse, avec le ministère de la Promotion de la Jeunesse, de l’Insertion professionnelle et du Service civique.') },
      { blockType: 'demand', title: 'Prêt à décrocher votre premier emploi ?', buttons: [info('Demander des informations', 'Insertion professionnelle'), partner('Proposer un partenariat', 'Insertion professionnelle')] },
    ],
  },
  {
    path: 'programmes/entrepreneuriat',
    title: 'Entrepreneuriat',
    parentLabel: 'programmes',
    stickyCta: 'info',
    seo: { title: 'Formation en entrepreneuriat à Abidjan | FATIHOUNE', description: 'Créez et développez votre entreprise : formation, montage de projet, recherche de financement et suivi. Approche D.O.I.J.E., plus de 200 promoteurs formés.' },
    layout: [
      { blockType: 'hero', eyebrow: 'Programme · porteurs de projet', title: 'Formation en entrepreneuriat à Abidjan : créez et faites grandir votre entreprise', lead: 'Vous avez une idée ou une petite activité ? FATIHOUNE vous forme à la gestion, vous aide à monter votre projet et à trouver des financements, puis vous accompagne après le lancement.', buttons: [info('Demander des informations', 'Entrepreneuriat')] },
      { blockType: 'text', title: 'Notre approche : le Dispositif Opérationnel d’Insertion des Jeunes par l’Entrepreneuriat (D.O.I.J.E.)', body: rich('Pour répondre aux enjeux de l’entrepreneuriat des jeunes en Afrique, FATIHOUNE a développé l’approche D.O.I.J.E. : former, accompagner le montage du projet, puis suivre l’entrepreneur dans la durée.', 'FATIHOUNE est **membre du Réseau GERME Côte d’Ivoire** (« Gérez mieux votre entreprise », méthodologie du Bureau international du Travail) et peut à ce titre former les entrepreneurs et assurer leur suivi.') },
      { blockType: 'steps', title: 'De l’idée à l’entreprise qui tourne', items: [
        { title: 'Se former', body: 'Formation en entrepreneuriat, gestion et formalisation d’entreprise.' },
        { title: 'Monter le projet', body: 'Aide au montage de projet et au plan d’affaires.' },
        { title: 'Trouver un financement', body: 'Recherche de financement et négociation avec les institutions de financement.' },
        { title: 'Être suivi', body: 'Encadrement des promoteurs pendant la mise en œuvre des projets financés, suivi et évaluation.' },
      ] },
      { blockType: 'timeline', title: 'Quelques résultats', items: [
        { year: '2025', text: 'Accompagnement de jeunes entrepreneurs des zones frontalières du nord dans la gestion et la formalisation de leur entreprise.' },
        { year: '2024', text: 'Formation d’acteurs du secteur informel à la gestion et à la formalisation (FASI).' },
        { year: '2023', text: '200 promoteurs formés en entrepreneuriat, gestion et formalisation d’entreprise.' },
      ] },
      { blockType: 'linkCards', style: 'cards', items: [{ title: 'Certificat de spécialisation en entrepreneuriat', text: 'CS2-ET · 100 h', href: '/certificats' }] },
      { blockType: 'demand', title: 'Votre projet mérite d’être accompagné', buttons: [info('Demander des informations', 'Entrepreneuriat'), partner('Proposer un partenariat', 'Entrepreneuriat')] },
    ],
  },
  {
    path: 'a-propos',
    title: 'Qui sommes-nous',
    stickyCta: 'quote',
    seo: { title: 'Qui sommes-nous | FATIHOUNE, cabinet de formation', description: 'Cabinet de formation et d’accompagnement habilité FDFP en Côte d’Ivoire. Mission, valeurs, méthodes et équipe de FATIHOUNE.' },
    layout: [
      { blockType: 'hero', eyebrow: 'FATIHOUNE SARL', title: 'FATIHOUNE, cabinet de formation et d’accompagnement en Côte d’Ivoire', lead: 'FATIHOUNE aide les entreprises, les administrations et les jeunes à développer leurs compétences. Notre règle : le professionnalisme, dans chaque formation et chaque engagement.', buttons: [quote('Nous contacter'), link('Voir nos références', '/references')], withPhotoSlot: true },
      { blockType: 'text', title: 'Améliorer les compétences pour améliorer la performance', body: rich('Nous apportons aux entreprises et aux administrations une assistance pluridisciplinaire pour renforcer leurs compétences, leur performance et leur compétitivité. Nous accompagnons aussi les jeunes et les femmes vers l’emploi et l’entrepreneuriat.') },
      { blockType: 'list', title: 'Nos engagements envers vous', items: [
        { strong: 'Agir efficacement et durablement.', text: 'Nos formations visent des résultats visibles dans votre travail.' },
        { strong: 'Offrir la qualité au juste coût.', text: 'Nous tenons compte de votre budget et de vos délais.' },
        { strong: 'Respecter les standards internationaux.', text: 'Nos méthodes suivent les normes reconnues de chaque domaine.' },
      ] },
      { blockType: 'list', title: 'Des experts, des méthodes, des moyens adaptés', items: [
        { text: 'Un réseau d’experts et de formateurs de haut niveau, praticiens de leur domaine.' },
        { text: 'Des formations conçues sur mesure, à partir de vos besoins réels.' },
        { text: 'Des méthodes propres : T.M.O.C. pour l’insertion des jeunes, D.O.I.J.E. pour l’entrepreneuriat.' },
        { text: 'Une habilitation FDFP et l’adhésion au Réseau GERME Côte d’Ivoire.' },
      ] },
      { blockType: 'text', tone: 'white', title: 'L’équipe', body: rich('FATIHOUNE SARL est dirigée par Yacouba Kamaté, gérant.') },
      { blockType: 'demand', title: 'Travaillons ensemble', buttons: [quote('Nous contacter'), wa] },
    ],
  },
  {
    path: 'mentions-legales',
    title: 'Mentions légales',
    stickyCta: 'none',
    seo: { title: 'Mentions légales | FATIHOUNE', description: 'Mentions légales du site FATIHOUNE Formation.' },
    layout: [
      { blockType: 'hero', title: 'Mentions légales', lead: 'Informations sur l’éditeur du site FATIHOUNE Formation.' },
      { blockType: 'text', title: 'Éditeur du site', body: rich('**FATIHOUNE SARL** — société à responsabilité limitée unipersonnelle (SARLU) au capital de 500 000 F CFA.', 'Siège social : Abidjan, Yopougon, cité Novalim — BP 92 Dabou, Côte d’Ivoire.', 'RCCM : CI-ABJ-03-2025-B13-01124.', 'Téléphone : +225 07 09 90 16 47 — E-mail : infos@fatihoune.com.', 'Gérant : Yacouba Kamaté.') },
      { blockType: 'text', title: 'Propriété intellectuelle', body: rich('Les textes, le logo FATIHOUNE, les photos et les documents de ce site appartiennent à FATIHOUNE SARL, sauf mention contraire. Toute reproduction sans autorisation écrite est interdite. Les noms et logos des clients et partenaires sont la propriété de leurs titulaires respectifs.') },
      { blockType: 'text', title: 'Données personnelles', body: rich('Voir notre politique de confidentialité, accessible depuis le pied de page.') },
    ],
  },
  {
    path: 'confidentialite',
    title: 'Confidentialité',
    stickyCta: 'none',
    seo: { title: 'Politique de confidentialité | FATIHOUNE', description: 'Comment FATIHOUNE utilise et protège les informations envoyées par le formulaire de contact.' },
    layout: [
      { blockType: 'hero', title: 'Politique de confidentialité', lead: 'Comment nous utilisons les informations que vous nous confiez.' },
      { blockType: 'text', title: 'Qui est responsable de vos données ?', body: rich('FATIHOUNE SARL, Abidjan, Yopougon, cité Novalim — BP 92 Dabou, RCCM CI-ABJ-03-2025-B13-01124, représentée par Yacouba Kamaté, gérant. Contact : infos@fatihoune.com.') },
      { blockType: 'text', title: 'Quelles données collectons-nous ?', body: rich('Uniquement celles que vous nous donnez dans le formulaire de contact : nom, organisme, fonction, téléphone, e-mail, formation qui vous intéresse, nombre de participants et message.') },
      { blockType: 'text', title: 'Pourquoi ?', body: rich('Pour répondre à votre demande (devis, information, partenariat) et, si vous devenez client, pour assurer le suivi de la formation. Nous ne vendons ni ne louons vos données.') },
      { blockType: 'text', title: 'Qui y a accès ?', body: rich('Les seules personnes de FATIHOUNE chargées de traiter votre demande, et notre hébergeur technique, dans la limite de sa mission.') },
      { blockType: 'text', title: 'Vos droits', body: rich('Conformément à la loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel, vous pouvez demander à accéder à vos données, à les corriger ou à les supprimer, et vous opposer à leur utilisation. Écrivez-nous à infos@fatihoune.com. Vous pouvez aussi saisir l’ARTCI (Autorité de Régulation des Télécommunications/TIC de Côte d’Ivoire).') },
    ],
  },
]
