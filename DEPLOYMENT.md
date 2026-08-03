# DigitalOcean Droplet Auto-Deployment & CI/CD Guide

This project includes a GitHub Actions workflow configured in `.github/workflows/deploy.yml` that automatically builds and deploys updates to your DigitalOcean Droplet whenever changes are pushed to the `main` branch.

---

## 1. Required GitHub Secrets

To allow GitHub Actions to connect to your DigitalOcean Droplet via SSH, add the following **Secrets** in your GitHub repository (**Settings > Secrets and variables > Actions > Repository secrets**):

| Secret Name | Description | Example / Default |
| --- | --- | --- |
| `DROPLET_HOST` | Public IP address or domain of your DigitalOcean Droplet | `164.90.x.x` or `api.uxhub.in` |
| `DROPLET_USER` | SSH username on the droplet | `root` or `deploy` |
| `DROPLET_SSH_KEY` | Private SSH key (`~/.ssh/id_rsa` or `~/.ssh/id_ed25519`) matching the public key on the droplet (`~/.ssh/authorized_keys`) | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `PROJECT_PATH` | *(Optional)* Target path on droplet where code resides | `/var/www/brandswamy_accounts_s_w` |
| `DROPLET_PORT` | *(Optional)* SSH port (if custom) | `22` |

---

## 2. Server Setup on DigitalOcean Droplet

Run these setup commands once on your DigitalOcean Droplet:

```bash
# 1. Update system & install Node.js (v20) and Git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx

# 2. Install PM2 globally for process management
sudo npm install -g pm2

# 3. Create deployment directory
sudo mkdir -p /var/www/brandswamy_accounts_s_w
sudo chown -R $USER:$USER /var/www/brandswamy_accounts_s_w

# 4. Clone repository initially
git clone https://github.com/huxhub/brandswamy_accounts_s_w.git /var/www/brandswamy_accounts_s_w
cd /var/www/brandswamy_accounts_s_w

# 5. Create backend .env file on droplet
cat << 'EOF' > backend/.env
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=brandswamy_db
JWT_SECRET=your_jwt_secret_here
CORS_ORIGINS=https://brandsway.uxhub.in,https://chisel.uxhub.in
EOF

# 6. Start backend process with PM2
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

---

## 3. Nginx Reverse Proxy Configuration Example

Point Nginx to serve the Vite frontend static build (`frontend/dist`) and proxy `/api` requests to the Express backend (`http://127.0.0.1:3001`):

`/etc/nginx/sites-available/brandswamy`:
```nginx
server {
    listen 80;
    server_name brandsway.uxhub.in;

    # Serve Vite Frontend static files
    root /var/www/brandswamy_accounts_s_w/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node Backend
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site & restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/brandswamy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 4. Automatic Workflow Execution

Every time code is pushed to `main`:
1. GitHub Actions runs `Build & Verify` (installs dependencies, builds frontend).
2. Connects via SSH to your DigitalOcean Droplet.
3. Pulls latest code from `main`.
4. Re-installs dependencies & builds frontend assets.
5. Zero-downtime reloads backend server via `pm2 reload`.
