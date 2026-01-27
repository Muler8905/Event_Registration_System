# EventHub Deployment Guide

## GitHub Pages Deployment (Frontend)

### Automatic Deployment
The project is configured with GitHub Actions for automatic deployment to GitHub Pages.

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as the source
   - The workflow will automatically deploy on every push to main branch

2. **Access Your Deployed Site**:
   - URL: `https://muler8905.github.io/Event_Registration_System/`
   - The site will be available after the first successful deployment

### Manual Deployment
If you prefer manual deployment:

```bash
# Build the frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
# Upload these files to your hosting service
```

## Backend Deployment Options

### Option 1: Heroku (Recommended)
1. **Install Heroku CLI**
2. **Create Heroku App**:
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set DATABASE_URL=your-database-url
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set FRONTEND_URL=https://muler8905.github.io/Event_Registration_System
   ```

4. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option 2: Railway
1. **Connect GitHub Repository**
2. **Select backend folder as root**
3. **Set environment variables**
4. **Deploy automatically**

### Option 3: Render
1. **Create new Web Service**
2. **Connect GitHub repository**
3. **Set build command**: `cd backend && npm install`
4. **Set start command**: `cd backend && npm start`

## Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.herokuapp.com/api
VITE_APP_NAME=EventHub
VITE_APP_VERSION=2.1.0
VITE_ENVIRONMENT=production
```

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your-postgresql-database-url
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://muler8905.github.io/Event_Registration_System
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Database Setup

### PostgreSQL (Production)
1. **Create PostgreSQL database** (Heroku Postgres, Railway, or other)
2. **Update DATABASE_URL** in environment variables
3. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## Post-Deployment Steps

1. **Update API URL**: Replace placeholder in `frontend/src/services/api.js`
2. **Test all features**: Registration, login, event creation
3. **Monitor logs**: Check for any runtime errors
4. **Set up monitoring**: Consider using services like Sentry

## Troubleshooting

### Common Issues:
- **CORS errors**: Ensure FRONTEND_URL is set correctly in backend
- **Database connection**: Verify DATABASE_URL format
- **Build failures**: Check Node.js version compatibility
- **API not found**: Verify backend deployment and URL

### Debug Commands:
```bash
# Check build output
npm run build

# Test production build locally
npm run preview

# Check environment variables
echo $VITE_API_URL
```

## Security Checklist

- [ ] JWT_SECRET is secure and unique
- [ ] Database credentials are secure
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] HTTPS is enabled
- [ ] Rate limiting is active

## Monitoring

Consider setting up:
- **Error tracking**: Sentry, Bugsnag
- **Performance monitoring**: New Relic, DataDog
- **Uptime monitoring**: Pingdom, UptimeRobot
- **Analytics**: Google Analytics, Mixpanel