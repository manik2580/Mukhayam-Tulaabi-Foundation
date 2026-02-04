# Quick Start Guide - Mukhayam Tulaabi Foundation

## What's New?

Your React app has been completely converted to **Vanilla HTML/CSS/JS + Node.js Express + MongoDB**!

## Key Changes

### Backend Structure
- **Server**: `server.js` - Express.js application entry point
- **Models**: MongoDB schemas for Donors, Expenses, and Admin authentication
- **Routes**: RESTful API endpoints for all operations
- **Middleware**: Session management and authentication

### Frontend Structure
- **index.html**: Single page HTML (no bundler needed)
- **styles.css**: Complete CSS styling (1271 lines of responsive design)
- **app.js**: Pure JavaScript (663 lines) handling all UI and API interactions

### Database
- **MongoDB**: Cloud-based or local database for persistent storage
- **Session Storage**: Server-side sessions with MongoDB store
- **Data Persistence**: All donations and expenses are saved permanently

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB
**Option A: MongoDB Atlas (Recommended)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)

**Option B: Local MongoDB**
- Install MongoDB locally
- Use: `mongodb://localhost:27017/mukhayam-tulaabi`

### 3. Create .env File
```bash
cp .env.example .env
```

Edit `.env` and add:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=your-mongodb-connection-string
SESSION_SECRET=any-random-string
```

### 4. Start the Server
```bash
npm start
```

Or for development:
```bash
npm run dev
```

Server will start at `http://localhost:3000`

## Admin Login

- **PIN**: `5022` (default)
- Click "Admin Access" button in bottom-right
- Enter 4-digit PIN to access management console

## File Structure

```
project/
├── server.js                 # Express server
├── models/
│   ├── Donor.js             # Donor model
│   ├── Expense.js           # Expense model
│   └── Admin.js             # Admin model
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── donors.js            # Donor endpoints
│   └── expenses.js          # Expense endpoints
├── public/
│   ├── index.html           # Main page
│   ├── app.js               # Frontend JavaScript
│   └── styles.css           # Styling
├── package.json             # Dependencies
├── .env.example             # Environment template
└── README.md                # Full documentation
```

## API Endpoints

All API calls are made from JavaScript to these endpoints:

- `GET /api/data` - Fetch all donors and expenses
- `POST /api/auth/login` - Login with PIN
- `POST /api/auth/logout` - Logout
- `GET /api/donors` - Get all donors
- `POST /api/donors` - Add donor (admin only)
- `DELETE /api/donors/:id` - Delete donor (admin only)
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add expense (admin only)
- `DELETE /api/expenses/:id` - Delete expense (admin only)

## Deploying to Production

### Vercel (Recommended for Node.js)
1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

### Heroku
```bash
heroku create your-app
heroku config:set MONGODB_URI=your-connection-string
git push heroku main
```

### AWS, DigitalOcean, etc.
- Install Node.js on your server
- Clone repository
- Install dependencies: `npm install`
- Set environment variables
- Run with process manager (pm2, forever, etc.)

## Features Comparison

| Feature | React Version | New Version |
|---------|---------------|-------------|
| Frontend | React + Vite | Vanilla JS |
| Backend | Mock (localStorage) | Express.js |
| Database | localStorage | MongoDB |
| Sessions | Client-side | Server-side |
| Authentication | In-memory | Hashed PIN + Sessions |
| Styling | Tailwind CDN | Custom CSS |
| Bundle Size | Large | Small |
| Dependencies | Many | Few |

## Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "MongoDB connection failed"
- Check MONGODB_URI in .env
- Ensure MongoDB is running (if local)
- Check MongoDB credentials (if Atlas)
- Allow your IP in MongoDB Atlas firewall

### "Port 3000 already in use"
- Change PORT in .env to 3001, 3002, etc.
- Or kill process using port 3000

### Data not persisting
- Check MongoDB connection
- Verify database has collections created
- Check browser console for API errors

## Next Steps

1. Change the default admin PIN in `models/Admin.js`
2. Customize styling in `public/styles.css`
3. Add more features to the API routes
4. Deploy to your hosting platform
5. Set up backups for MongoDB data

## Support

See README.md for complete documentation and API reference.

---

**Congratulations!** Your app is now a production-ready, full-stack application with proper backend and database!
