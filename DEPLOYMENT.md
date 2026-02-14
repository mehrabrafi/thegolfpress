# Deploying The Golf Press on Hostinger KVM1 VPS

This guide will help you deploy your Next.js frontend, NestJS backend, and PostgreSQL database on your Hostinger KVM1 VPS (Ubuntu 20.04/22.04 recommended).

## Prerequisites
- SSH Access to your VPS (IP Address, Username `root`, and Password).
- A domain name pointing to your VPS IP (e.g., `thegolfpress.com` and `api.thegolfpress.com`).

---

## Step 1: Initial Server Setup
Login to your VPS via SSH:
```bash
ssh root@YOUR_VPS_IP
```

Update the system:
```bash
apt update && apt upgrade -y
```

Install common tools:
```bash
apt install -y curl git unzip build-essential
```

## Step 2: Install Node.js (v20)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```
Verify installation:
```bash
node -v
npm -v
```

Install PM2 (Process Manager) globally:
```bash
npm install -g pm2
```

## Step 3: Install & Configure PostgreSQL
```bash
apt install -y postgresql postgresql-contrib
```
Start and enable the service:
```bash
systemctl start postgresql
systemctl enable postgresql
```

Create a database and user:
```bash
sudo -u postgres psql
```
Inside the SQL shell:
```sql
CREATE DATABASE golfpress;
CREATE USER admin WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE golfpress TO admin;
\q
```
*Note down this password for your .env file.*

## Step 4: Clone the Project
Navigate to the web directory:
```bash
cd /var/www
git clone https://github.com/mehrabrafi/thegolfpress.git
cd thegolfpress
```

## Step 5: Backend Deployment (NestJS)
Navigate to backend:
```bash
cd backend
npm install
```

Create `.env` file:
```bash
nano .env
```
Paste your backend environment variables:
```env
DATABASE_URL="postgresql://admin:your_secure_password@localhost:5432/golfpress?schema=public"
JWT_SECRET="your_jwt_secret_64_hex_chars"
NODE_ENV=production
PORT=5001
ALLOW_REGISTRATION=false
FRONTEND_URL=https://thegolfpress.com
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=thegolfpress
NEXT_PUBLIC_IMAGE_URL=https://cdn.thegolfpress.com
```
Save and exit (`Ctrl+X`, `Y`, `Enter`).

Run Prisma migrations:
```bash
npx prisma generate
npx prisma migrate deploy
```

Build and Start with PM2:
```bash
npm run build
pm2 start dist/main.js --name "golfpress-backend"
```

## Step 6: Frontend Deployment (Next.js)
Navigate to frontend:
```bash
cd ../frontend
npm install
```

Create `.env` file:
```bash
nano .env.local
```
Paste your frontend environment variables:
```env
NEXT_PUBLIC_API_URL="https://api.thegolfpress.com"
NEXT_PUBLIC_IMAGE_URL="https://cdn.thegolfpress.com" 
# Or your R2 public URL
```

Build and Start with PM2:
```bash
npm run build
pm2 start npm --name "golfpress-frontend" -- start -- -p 3000
```

Save PM2 list so it restarts on reboot:
```bash
pm2 save
pm2 startup
```

## Step 7: Configure Nginx (Reverse Proxy)
Install Nginx:
```bash
apt install -y nginx
```

Create a configuration file:
```bash
nano /etc/nginx/sites-available/golfpress
```

Paste the following (replace `thegolfpress.com` with your actual domain):

```nginx
# Backend Config (api.thegolfpress.com)
server {
    server_name api.thegolfpress.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend Config (thegolfpress.com)
server {
    server_name thegolfpress.com www.thegolfpress.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
ln -s /etc/nginx/sites-available/golfpress /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

## Step 8: Setup SSL (HTTPS)
Install Certbot:
```bash
apt install -y certbot python3-certbot-nginx
```

Obtain certificates:
```bash
certbot --nginx -d thegolfpress.com -d www.thegolfpress.com -d api.thegolfpress.com
```

Follow the prompts. Your site is now live with HTTPS!
