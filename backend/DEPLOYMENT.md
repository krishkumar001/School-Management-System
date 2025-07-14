# School Management System - Backend Deployment Guide

## 🚀 Deploy to Render (Recommended)

### Prerequisites
1. **MongoDB Atlas Database** (Free tier)
2. **GitHub Repository** with your code
3. **Render Account** (Free)

### Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user
5. Get your connection string
6. Add your IP to the whitelist (or use 0.0.0.0/0 for all IPs)

### Step 2: Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name:** school-management-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. **Add Environment Variables:**
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/school-management
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-secret-key-here
   ```

6. **Click "Create Web Service"**

### Step 3: Update Frontend Configuration

Once deployed, update your frontend environment variables:

```env
VITE_BASE_URL=https://your-render-app.onrender.com
```

## 🔧 Alternative Deployment Options

### Railway
- Similar to Render
- Good free tier
- Easy MongoDB integration

### Heroku
- More established platform
- Requires credit card for free tier
- Good for production apps

### DigitalOcean App Platform
- More control
- Pay-as-you-go pricing
- Good for scaling

## 📊 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URL` | MongoDB connection string | ✅ |
| `NODE_ENV` | Environment (production/development) | ✅ |
| `PORT` | Server port | ✅ |
| `JWT_SECRET` | Secret for JWT tokens | ✅ |

## 🔒 Security Checklist

- ✅ Password hashing implemented
- ✅ JWT authentication
- ✅ CORS configured
- ✅ Input validation
- ✅ Error handling
- ✅ Environment variables
- ✅ HTTPS enabled

## 🐛 Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed:**
   - Check connection string
   - Verify IP whitelist
   - Check database user credentials

2. **Build Fails:**
   - Check Node.js version (requires 16+)
   - Verify package.json
   - Check for missing dependencies

3. **Runtime Errors:**
   - Check environment variables
   - Verify file paths
   - Check logs in Render dashboard

### Debug Commands:
```bash
# Local testing
npm run dev

# Check logs
npm start

# Test database connection
node -e "console.log(process.env.MONGO_URL)"
```

## 📈 Monitoring

Render provides:
- Build logs
- Runtime logs
- Performance metrics
- Error tracking
- Uptime monitoring

## 🔄 Continuous Deployment

Render automatically deploys when you push to your main branch.

## 🌐 Custom Domain

After deployment:
1. Go to Render Dashboard
2. Select your service
3. Go to "Settings" → "Custom Domains"
4. Add your domain
5. Configure DNS

---

**🎉 Your backend is now live and ready to serve your frontend!** 