# Déploiement — FATIHOUNE Formation

Serveur Linux avec Docker, **Nginx Proxy Manager** (NPM) pour les domaines et le HTTPS, Portainer pour surveiller
les conteneurs. Le site tourne dans un conteneur `app` (Next.js + Payload + SQLite) avec un conteneur `backup`
(sauvegarde quotidienne). Il écoute sur un port du serveur que NPM relaie.

## Prérequis
- Docker + Docker Compose v2 ; 2 Go de RAM libres pendant la construction de l'image (quelques minutes).
- Un **port libre** sur le serveur, par exemple 3010 : `ss -ltn | grep :3010` ne doit rien afficher.
- DNS : enregistrement **A** du domaine vers l'IP du serveur (nécessaire pour le certificat Let's Encrypt de NPM).

## 1. Premier déploiement

```bash
git clone https://github.com/danguiismaelkone/learn.fatihoune.com.git fatihoune-formation
cd fatihoune-formation
cp deploy/env.preprod.example .env.preprod        # ou env.production.example → .env.production
nano .env.preprod
```

À remplir dans le fichier `.env` :

| Variable | Valeur |
|---|---|
| `APP_PORT` | le port libre choisi (ex. `3010`) |
| `APP_BIND` | laisser `172.17.0.1` (voir « Réseau » plus bas) |
| `PAYLOAD_SECRET` | `openssl rand -hex 32` ; **ne plus jamais le changer** (sessions et données chiffrées en dépendent) |
| `PREVIEW_PASSWORD` | préproduction seulement : mot de passe d'accès au site |
| `SMTP_*` | OVH : `SMTP_HOST=ssl0.ovh.net`, `SMTP_PORT=587`, `SMTP_USER`/`SMTP_FROM=infos@fatihoune.com`, `SMTP_PASS` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | compte administrateur créé au premier démarrage ; à vider ensuite |

Ne mettez jamais de commentaire sur la même ligne qu'une valeur (`SMTP_HOST=  # ...`) : Docker Compose lirait le
commentaire comme valeur.

Puis :

```bash
./deploy/deploy.sh preprod
```

Le script construit l'image, démarre les conteneurs, attend que le site réponde sur `/healthz` et affiche la cible à
saisir dans NPM. Au premier démarrage, la base est créée (migrations) et les contenus de départ sont importés.

## 2. Nginx Proxy Manager

*Proxy Hosts › Add Proxy Host* :
- **Domain Names** : `preprod.formation.fatihoune.com` (ou `formation.fatihoune.com` en production) ;
- **Scheme** `http`, **Forward Hostname / IP** `172.17.0.1`, **Forward Port** = `APP_PORT` ;
- *Block Common Exploits* activé ;
- onglet **SSL** : *Request a new SSL Certificate* (Let's Encrypt), **Force SSL**, **HTTP/2**, **HSTS**.

Vérification : `https://<domaine>/healthz` répond `{"status":"ok"}`, puis connexion sur `https://<domaine>/admin`,
création des comptes de l'équipe et suppression de `SEED_ADMIN_*` dans le `.env`.

**Bascule de l'ancien site (production, au GO de lancement uniquement)** : ajouter un second Proxy Host
`fatihoune.com` + `www.fatihoune.com` vers la même cible. Le site applique lui-même les redirections de l'ancien site ;
NPM transmet le nom de domaine d'origine (en-tête `Host`) par défaut, ce dont ces redirections ont besoin.

### Réseau
Le port est publié sur `172.17.0.1`, l'adresse du serveur sur le réseau Docker : NPM (dans Docker) l'atteint, Internet
non. Ne pas publier sur `0.0.0.0` : Docker contourne le pare-feu (ufw), le site serait accessible en HTTP sans NPM.
Si NPM ne joint pas cette adresse (réseau Docker personnalisé), vérifier l'adresse de l'hôte avec
`ip -4 addr show docker0` et la reporter dans `APP_BIND` et dans NPM.

## 3. Reprendre les contenus saisis en local

Au premier démarrage, le serveur importe les contenus de départ, **pas** ce qui a été saisi ou téléversé dans
l'administration locale. Pour reprendre ce travail :

**Sur le poste local** (dans `website/site`, serveur de dev lancé au moins une fois avec le dernier code) :
```bash
./deploy/export-content.sh
```
Le script copie la base sans arrêter le serveur de dev, vérifie que son schéma correspond exactement aux migrations
du dépôt, les marque comme appliquées dans la copie (une base de développement n'en garde pas trace) et produit
`content-export/fatihoune-content-<date>.tar.gz` (base + médias).

**Envoyer l'archive** sur le serveur (FTP ou `scp`) dans `fatihoune-formation/content-import/`, puis **sur le serveur** :
```bash
./deploy/import-content.sh preprod content-import/fatihoune-content-<date>.tar.gz
```
Le script demande de taper `IMPORT`, sauvegarde les données en place dans `backups/pre-import-<date>.tar.gz`, remplace
la base et les médias, puis redémarre le site. Les comptes administrateur sont ceux de la base importée.

## 4. Mettre à jour le site

```bash
git pull && ./deploy/deploy.sh preprod      # ou production
```
Rien à changer dans NPM. Les migrations s'appliquent au démarrage ; le contenu saisi dans l'administration n'est
jamais écrasé (l'import des contenus de départ ne s'exécute que sur une base vide).

## 5. Sauvegardes et restauration
- Le conteneur `backup` écrit chaque jour `backups/fatihoune-AAAA-MM-JJ.db` et `backups/media-AAAA-MM-JJ.tar.gz`
  (14 jours). **Copiez-les régulièrement hors du serveur.**
- Restaurer une sauvegarde quotidienne :
```bash
docker compose --env-file .env.production stop app
docker compose --env-file .env.production run --rm --no-deps -v "$PWD/backups:/backups" --entrypoint sh app \
  -c "cp /backups/fatihoune-AAAA-MM-JJ.db /data/fatihoune.db && rm -rf /data/media && tar -xzf /backups/media-AAAA-MM-JJ.tar.gz -C /data"
docker compose --env-file .env.production start app
```
- Revenir à l'état d'avant un import : `./deploy/import-content.sh production backups/pre-import-<date>.tar.gz`.

## 6. Surveiller
- `https://<domaine>/healthz` → `{"status":"ok"}` (à brancher sur un service de surveillance).
- Portainer : conteneurs `fatihoune-production-app-1` / `-backup-1` (ou `fatihoune-preview-…`), état *healthy*.
- Journaux : `docker compose --env-file .env.production logs -f app` (chaque demande reçue : `Lead stored`).

## Préproduction et production sur le même serveur
Elles cohabitent : chacune a son nom de projet Docker (`fatihoune-preview`, `fatihoune-production`), son volume de
données et son `APP_PORT` (ex. 3010 et 3011). `SITE_ENV=production` rend le site indexable : ne l'utiliser que pour
`formation.fatihoune.com`.

## Serveur sans reverse proxy
Ajouter `COMPOSE_PROFILES=caddy` au `.env` : le conteneur Caddy fourni prend les ports 80/443 et obtient le certificat
lui-même (`deploy/Caddyfile.*`). Inutile avec Nginx Proxy Manager.
