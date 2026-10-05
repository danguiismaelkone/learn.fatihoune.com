# Déploiement — FATIHOUNE Formation

Convention de l'équipe : **Makefile** + `docker-compose.yml` (application + nginx interne) + `.env.production`,
derrière **Nginx Proxy Manager** (NPM) qui gère les domaines et le HTTPS. Portainer sert à surveiller les conteneurs.

| Conteneur | Rôle |
|---|---|
| `app` | le site (Next.js + Payload), image construite depuis le `Dockerfile` |
| `nginx_proxy` | nginx interne (`nginx/nginx.conf`), publie le port donné à NPM |
| `backup` | sauvegarde quotidienne de la base et des médias dans `backups/` (14 jours) |

Pas de conteneur de base de données : le site utilise **SQLite**, un fichier rangé avec les médias dans le volume
Docker `data`.

## Prérequis
- Docker + Docker Compose v2 (`docker compose` ou `docker-compose` v2), `make`, `openssl`.
- 2 Go de RAM libres pendant la construction de l'image (quelques minutes).
- Un **port libre**, par exemple 3018 : `ss -ltn | grep :3018` ne doit rien afficher.
- DNS : enregistrement **A** du domaine vers l'IP du serveur (pour le certificat Let's Encrypt de NPM).

## 1. Premier déploiement

```bash
git clone https://github.com/danguiismaelkone/learn.fatihoune.com.git fatihoune-formation
cd fatihoune-formation
make env                 # crée .env.production avec un PAYLOAD_SECRET généré
nano .env.production     # remplir les valeurs ci-dessous
make deploy              # alias : make run-dev
```

| Variable | Valeur |
|---|---|
| `APP_PORT` | le port libre choisi (ex. `3018`) |
| `APP_BIND` | laisser `172.17.0.1` (voir « Réseau ») |
| `PAYLOAD_SECRET` | déjà généré par `make env` ; **ne plus jamais le changer** |
| `SMTP_HOST` / `SMTP_PASS` | OVH : `ssl0.ovh.net` et le mot de passe de la boîte `infos@fatihoune.com` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | compte administrateur créé au premier démarrage ; à vider ensuite |

Ne mettez jamais de commentaire sur la même ligne qu'une valeur (`SMTP_HOST=  # ...`) : Docker Compose lirait le
commentaire comme valeur.

`make deploy` construit l'image, recrée les conteneurs, attend que le site réponde sur `/healthz` et affiche la cible à
saisir dans NPM. Au premier démarrage : création de la base (migrations) et import des contenus de départ.

Préproduction : mêmes commandes avec `ENV=preprod` (`make env ENV=preprod`, `make deploy ENV=preprod`), fichier
`.env.preprod`, autre `APP_PORT`. Elle est protégée par mot de passe (`PREVIEW_PASSWORD`) et jamais indexée.
Préproduction et production peuvent tourner sur le même serveur (projets Docker et volumes distincts).

## 2. Nginx Proxy Manager

*Proxy Hosts › Add Proxy Host* :
- **Domain Names** : `formation.fatihoune.com` (ou le sous-domaine de préproduction) ;
- **Scheme** `http`, **Forward Hostname / IP** `172.17.0.1`, **Forward Port** = `APP_PORT` ;
- *Block Common Exploits* activé ;
- onglet **SSL** : nouveau certificat Let's Encrypt, **Force SSL**, **HTTP/2**, **HSTS**.

Vérifier `https://<domaine>/healthz` → `{"status":"ok"}`, se connecter sur `/admin`, créer les comptes de l'équipe,
puis vider `SEED_ADMIN_*` dans le `.env`.

**Bascule de l'ancien site (au GO de lancement uniquement)** : second Proxy Host `fatihoune.com` +
`www.fatihoune.com` vers la même cible. Le site applique lui-même les redirections de l'ancien site d'après le nom de
domaine, que NPM et le nginx interne transmettent (en-tête `Host`).

### Réseau
Le port est publié sur `172.17.0.1`, l'adresse du serveur sur le réseau Docker : NPM l'atteint, Internet non.
Un `"3018:80"` classique publierait sur toutes les interfaces ; comme Docker contourne le pare-feu (ufw), le site serait
alors accessible en HTTP sur `http://<ip-du-serveur>:3018`, sans NPM ni HTTPS. Si NPM ne joint pas `172.17.0.1`
(réseau Docker personnalisé), lire l'adresse avec `ip -4 addr show docker0` et la reporter dans `APP_BIND` et NPM.

## 3. Reprendre les contenus saisis en local

Au premier démarrage, le serveur importe les contenus de départ, **pas** ce qui a été saisi ou téléversé dans
l'administration locale. Pour reprendre ce travail :

1. **Poste local** (dossier `website/site`, serveur de dev lancé au moins une fois avec le dernier code) :
   `make export-content` → `content-export/fatihoune-content-<date>.tar.gz`. Le script vérifie que la base locale
   correspond exactement aux migrations du dépôt et les marque comme appliquées dans la copie.
2. **Envoyer l'archive** (FTP ou `scp`) dans `content-import/` du dossier cloné sur le serveur.
3. **Serveur** : `make import-content ARCHIVE=content-import/fatihoune-content-<date>.tar.gz`
   Taper `IMPORT` pour confirmer. Les données en place sont d'abord sauvegardées dans `backups/pre-import-<date>.tar.gz`.

## 4. Mettre à jour le site

```bash
git pull && make deploy
```
Rien à changer dans NPM. Les migrations s'appliquent au démarrage ; le contenu saisi dans l'administration n'est
jamais écrasé.

## 5. Commandes utiles

```bash
make help          # liste des commandes
make ps            # état des conteneurs
make logs          # journaux du site (chaque demande reçue : « Lead stored »)
make restart       # redémarrer sans reconstruire
make stop          # arrêter (les données sont conservées)
make backup-now    # sauvegarde immédiate dans backups/
```

## 6. Sauvegardes et restauration
- `backups/fatihoune-AAAA-MM-JJ.db` et `backups/media-AAAA-MM-JJ.tar.gz` chaque jour (14 jours).
  **Les copier régulièrement hors du serveur.**
- Restaurer une sauvegarde quotidienne :
```bash
docker compose --env-file .env.production stop app
docker compose --env-file .env.production run --rm --no-deps -v "$PWD/backups:/backups" --entrypoint sh app \
  -c "cp /backups/fatihoune-AAAA-MM-JJ.db /data/fatihoune.db && rm -rf /data/media && tar -xzf /backups/media-AAAA-MM-JJ.tar.gz -C /data"
docker compose --env-file .env.production start app
```
- Annuler un import : `make import-content ARCHIVE=backups/pre-import-<date>.tar.gz`.

## Surveiller
- `https://<domaine>/healthz` → `{"status":"ok"}` (à brancher sur un service de surveillance).
- Portainer : `fatihoune-production-app-1` doit être *healthy* ; `-nginx_proxy-1` et `-backup-1` *running*.
