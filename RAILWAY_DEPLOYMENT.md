# EventHub Backend Deployment on Railway

## Quick Deployment Steps

### 1. Prepare Your Repository
✅ All files are ready for deployment

### 2. Deploy to Railway

#### Option A: Using Railway CLI (Recommended)
1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Deploy from backend directory**:
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

#### Option B: Using Railway Dashboard (Easier)
1. **Go to Railway**: https://railway.app/
2. **Sign up/Login** with GitHub
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select Repository**: `Muler8905/Event_Registration_System`
5. **Set Root Directory**: `backend`
6. **Deploy**

### 3. Configure Environment Variables

In Railway Dashboard → Your Project → Variables, add:

```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@hostname:port/database
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters-long
FRONTEND_URL=https://muler8905.github.io/Event_Registration_System
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mulukenugamo8@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### 4. Add PostgreSQL Database

1. **In Railway Dashboard** → **Add Service** → **Database** → **PostgreSQL**
2. **Copy the DATABASE_URL** from the database service
3. **Update DATABASE_URL** in your environment variables

### 5. Deploy and Test

1. **Railway will automatically deploy** after configuration
2. **Your API will be available** at: `https://your-app-name.railway.app`
3. **Test the health endpoint**: `https://your-app-name.railway.app/api/health`

## Important Notes

### Database Setup
- Railway provides PostgreSQL database automatically
- Database URL is automatically generated
- Prisma will run migrations on deployment

### Environment Variables Required
- `NODE_ENV=production`
- `DATABASE_URL` (provided by Railway PostgreSQL)
- `JWT_SECRET` (generate a secure 32+ character string)
- `FRONTEND_URL=https://muler8905.github.io/Event_Registration_System`
- `EMAIL_USER=mulukenugamo8@gmail.com`
- `EMAIL_PASS` (Gmail App Password)

### Gmail App Password Setup
1. **Enable 2FA** on your Gmail account
2. **Go to Google Account Settings** → Security → 2-Step Verification
3. **Generate App Password** for "Mail"
4. **Use this password** in EMAIL_PASS variable

## After Deployment

### 1. Update Frontend API URL
Update `frontend/.env.production`:
```env
VITE_API_URL=https://your-app-name.railway.app/api
```

### 2. Rebuild and Redeploy Frontend
```bash
cd frontend
npm run build
git add .
git commit -m "Update API URL for production backend"
git push origin main
```

### 3. Test Full Application
- **Frontend**: https://muler8905.github.io/Event_Registration_System/
- **Backend**: https://your-app-name.railway.app/api
- **Health Check**: https://your-app-name.railway.app/api/health

## Troubleshooting

### Common Issues:
1. **Database Connection Error**: Check DATABASE_URL format
2. **CORS Error**: Verify FRONTEND_URL is correct
3. **Build Failure**: Check Node.js version (18+)
4. **Email Not Working**: Verify Gmail App Password

### Debug Commands:
```bash
# Check Railway logs
railway logs

# Check environment variables
railway variables

# Restart service
railway up --detach
```

## Alternative Deployment Options

### Heroku
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set FRONTEND_URL=https://muler8905.github.io/Event_Registration_System
git subtree push --prefix backend heroku main
```

### Render
1. Connect GitHub repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables
5. Deploy

## Security Checklist
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] Secure database credentials
- [ ] Gmail App Password (not regular password)
- [ ] HTTPS enabled (automatic on Railway)
- [ ] CORS properly configured
- [ ] Rate limiting active