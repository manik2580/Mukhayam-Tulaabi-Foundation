# Mukhayam Tulaabi Foundation - Transparency Portal

A modern, transparent donation and expense tracking platform built with vanilla HTML/CSS/JavaScript and Node.js Express backend with MongoDB database.

## Features

- **Public Dashboard**: Real-time visualization of donations and expenses
- **Admin Console**: Secure PIN-protected management panel
- **Live Sync**: Real-time database synchronization
- **Financial Overview**: Interactive charts showing donation and expense data
- **Donor Tracking**: Complete list of benefactors and contributions
- **Expense Management**: Track all allocations and disbursements

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript ES6
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Session-based with bcryptjs PIN hashing
- **Styling**: Custom CSS with responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database (local or MongoDB Atlas)

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/mukhayam-tulaabi
SESSION_SECRET=your-secret-key-change-in-production
```

### 3. MongoDB Setup

**Option A: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string and add it to `.env`

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Use connection string: `mongodb://localhost:27017/mukhayam-tulaabi`

### 4. Run the Application

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Default Credentials

- **Admin PIN**: `5022`

## Project Structure

```
├── server.js                 # Express server entry point
├── models/
│   ├── Donor.js             # Donor schema
│   ├── Expense.js           # Expense schema
│   └── Admin.js             # Admin authentication
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── donors.js            # Donor CRUD routes
│   └── expenses.js          # Expense CRUD routes
├── public/
│   ├── index.html           # Main HTML
│   ├── app.js               # Frontend JavaScript
│   └── styles.css           # Styling
├── package.json             # Dependencies
└── .env.example             # Environment template
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with PIN
- `POST /api/auth/logout` - Logout
- `GET /api/auth/status` - Check authentication status

### Donors
- `GET /api/donors` - Get all donors
- `POST /api/donors` - Add new donor (admin only)
- `DELETE /api/donors/:id` - Delete donor (admin only)

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add new expense (admin only)
- `DELETE /api/expenses/:id` - Delete expense (admin only)

### General
- `GET /api/data` - Get all donors and expenses

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Heroku
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your-connection-string
git push heroku main
```

## Security Notes

- Always use HTTPS in production
- Change the default admin PIN
- Use strong SESSION_SECRET
- Enable environment-specific CORS
- Implement rate limiting for production
- Keep dependencies updated

## Features to Add

- Email notifications on donations
- Custom admin PIN creation
- Transaction history export
- Multi-admin support
- Two-factor authentication
- Donation receipts

## License

MIT

## Support

For issues or questions, please open a GitHub issue.
