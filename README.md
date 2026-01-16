# 🚀 Educational Puzzle App (Eduzzle)

![App Banner](frontend/assets/readme/splashscreen.jpg)  
*A fun and engaging **Educational Puzzle App** built with React Native and Node.js backend to help students learn through solving puzzles!*


## 📸 Screenshots

### Global Screens


| Signup Section | Login Page | Reset Password | OTP verification  |
|-------------|------------|---------------|
| ![Register](frontend/assets/readme/register.jpg) | ![Login](frontend/assets/readme/login.jpg) | ![Signup](frontend/assets/readme/resetpassword.jpg) | [Signup](frontend/assets/readme/verifyotp.jpg) |


### Tab Screens
| Home Screen | Play | Friends  | Profile  |
|-------------|------------|---------------|
| ![Home](frontend/assets/readme/homescreen.jpg) | ![Play](frontend/assets/readme/playscreen.jpg) | ![Friends](frontend/assets/readme/friends.jpg) | [Profile](frontend/assets/readme/profile.jpg) |


## Features

| Quick Quizzes |
|--------------|-------------|---------------|
| ![Popular challenges](frontend/assets/readme/home4.jpg) | ![Quizzes](frontend/assets/readme/quickquizzes2.jpg) | ![Quiz](frontend/assets/readme/quizscreen.jpg) |


| Visual Puzzles |
|--------------|-------------|---------------|
| ![Puzzle](frontend/assets/readme/playscreen.jpg) | ![Visual Puzzle](frontend/assets/readme/visualpuzzle.jpg) | 


| MCQ Bank  |
|--------------|-------------|---------------|
| ![MCQ Bank Screen](frontend/assets/readme/mcqbank1.jpg) | ![Course List](frontend/assets/readme/mcqbank2.jpg) | ![Chapters](frontend/assets/readme/mcqbank3.jpg) | ![Topics](frontend/assets/readme/mcqbank4.jpg) | ![Questions](frontend/assets/readme/mcqbank5.jpg) |


| Friends Screen |
|---------------|---------------|---|
| ![My Friends](frontend/assets/readme/friendscreen1.jpg) | | ![Friend Request](frontend/assets/readme/friendscreen2.jpg) | ![Sent Request](frontend/assets/readme/friendscreen3.jpg) |


| Daily Quest  |
|--------------|-------------|---------------|
| ![Daily Quest](frontend/assets/readme/dailyquest2.jpg) | 


| Gaming Events  |
|--------------|-------------|---------------|
| ![Gaming Event Section](frontend/assets/readme/gamingevent1.jpg) | ![Gaming Event List](frontend/assets/readme/gamingevent2.jpg) | ![Gaming Event](frontend/assets/readme/gamingevent3.jpg) | ![Gaming Event Quiz](frontend/assets/readme/gamingevent4.jpg) |


| Gaming Event - Easy | Gaming Event - Medium | Gaming Event - Hard | Quiz Finish | Play Again | Quiz Result |
|--------------------|----------------------|---------------------|------------|-----------|-------------|
| ![Level-Easy](frontend/assets/PuzzleQuizEasy.jpg) | ![Level-Medium](frontend/assets/PuzzleQuizMed.jpg) | ![Level-Hard](frontend/assets/PuzzleQuizHard.jpg) | ![Finish1](frontend/assets/QuizFinish.jpg) | ![Finish2](frontend/assets/QuizFinish2.jpg) | ![PlayAgain](frontend/assets/PlaysectionPlayAgain.jpg) |


| Friend Leaderboard | Global Leaderboards  | Premium Section |
|--------------|-------------|---------------|
| ![Puzzle](frontend/assets/readme/friendleaderboard.jpg) | ![PlayScreen](frontend/assets/readme/globalleaderboard.jpg) | ![Premium Section](frontend/assets/readme/premium.jpg) |




| Recommended Section | Help Desk | Rating |
|--------------------|---------------------|--------------------|
| ![Help Desk ](frontend/assets/readme/helpdesk1.jpg) | ![Help Desk](frontend/assets/readme/helpdesk2.jpg) | ![Rating ](frontend/assets/readme/rating.jpg) | ![Recommended Section](frontend/assets/readme/RecommendedSection.jpg) |




## ✨ Purpose of the App

> Eduzzle is designed to make learning interactive and fun by offering a variety of educational puzzles and quizzes.  
> It helps students and learners of all ages improve their problem-solving, critical thinking, and subject knowledge in an engaging way.  
> Inspired by the need to combine education with gamification, this app motivates learners to practice regularly, track their progress, compete with friends, and earn rewards.

---

## 🎯 Key Features

### 🔐 User Authentication & Security
- **Secure Registration & Login** - Email-based authentication with password hashing (bcrypt)
- **OTP Verification** - Email verification system for account security
- **Password Recovery** - Forgot password with secure OTP-based reset
- **JWT Token Authentication** - Secure session management
- **Account Lock Protection** - Prevents brute force attacks with automatic account locking
- **Rate Limiting** - API rate limiting to prevent abuse (200 requests per 15 minutes)
- **Profile Management** - Update profile information and profile pictures

### 🧩 Quiz & Puzzle System
- **Quick Quizzes**
  - General Trivia
  - Logic Challenges
  - Visual Puzzles
  - Multiple Choice Questions (MCQs)
  - Difficulty Levels: Easy, Medium, Hard
**Quiz Creation & Management** - Create custom quizzes with questions
**Timed Quizzes** - Challenge yourself with time-limited puzzles
**Quiz Attempts Tracking** - Track all your quiz attempts and scores
**Question Bank** - Vast collection of educational questions
**Result Analysis** - Detailed performance analytics after each quiz

### 🎮 Gaming Events
- **Live Gaming Quiz Events** - Participate in scheduled quiz competitions
- **Event Status Tracking** - Real-time status updates (upcoming, live, completed)
- **Event Leaderboards** - Compete with other players in live events
- **Event Rewards** - Earn special rewards for participating and winning
- **Automatic Status Updates** - Cron jobs automatically update event status

### 🏆 Gamification & Rewards
- **Coins System** - Earn coins by completing quizzes and challenges
- **Badge System** - Unlock achievement badges (Bronze, Silver, Gold, Diamond)
- **Daily Quests** - Complete daily challenges to earn rewards
- **Streak System** - Maintain daily streaks for bonus rewards
- **Leaderboards**
  - Global Leaderboard - Compete with all users
  - Friends Leaderboard - Compare scores with friends
  - Event-specific Leaderboards

### 👥 Social Features
- **Friend System** - Send and receive friend requests
- **Friend Requests Management** - View pending and sent friend requests
- **Friends List** - View all your connected friends
- **Friends Leaderboard** - Compete with your friends
- **Real-time Notifications** - Socket.IO powered instant notifications

### 💳 Subscription & Premium Features
- **Subscription Plans** - Multiple premium subscription options
- **Payment Integration** - Razorpay payment gateway integration
- **Premium User Dashboard** - Exclusive features for premium users
- **Auto-renewal Reminders** - Email notifications for subscription expiry
- **Subscription Management** - Easy plan upgrades and renewals
- **Auto-expiration Handling** - Automatic subscription status updates via cron jobs

### 📊 Analytics & Statistics
- **User Dashboard** - Comprehensive overview of your progress
- **Attempt Statistics** - Detailed stats on all quiz attempts
- **Performance Tracking** - Track improvement over time
- **Achievement History** - View all earned badges and rewards
- **Streak Tracking** - Monitor your daily learning streak

### 🔔 Notifications System
- **Real-time Push Notifications** - Instant updates via Socket.IO
- **Email Notifications** - Subscription reminders and important updates
- **In-app Notifications** - View notification history
- **Friend Request Notifications** - Get notified when someone sends you a friend request
- **Badge Unlock Notifications** - Celebrate achievement unlocks

### 👨‍💼 Admin Features
- **Admin Dashboard** - Complete admin control panel
- **User Management** - Manage user accounts and permissions
- **Content Management** - Create and manage quizzes, questions, and events
- **Event Management** - Schedule and manage gaming events
- **Analytics Overview** - View platform-wide statistics

### 📝 Review & Feedback System
- **Rate the App** - Users can submit reviews and ratings
- **Review Management** - Admin can view and moderate reviews
- **Help Desk** - User support and FAQ system

### 🔒 Security Features
- **Helmet.js** - Security headers for Express application
- **CORS Protection** - Controlled cross-origin resource sharing
- **Input Validation** - Zod schema validation for API inputs
- **Password Hashing** - Argon2 and bcrypt for secure password storage
- **JWT Token Security** - Secure token generation and validation
- **Session Management** - Secure session handling
- **Rate Limiting** - Prevents API abuse and DDoS attacks

### ☁️ Cloud Integration
- **Cloudinary Integration** - Image upload and management
- **Email Service** - SendGrid/Mailgun/Resend for transactional emails
- **MongoDB Atlas** - Cloud database hosting
- **Real-time Updates** - Socket.IO for live features

### 📱 Mobile Features
- **React Native** - Cross-platform mobile app (iOS & Android)
- **Expo Framework** - Easy development and deployment
- **Responsive Design** - Optimized for all screen sizes
- **NativeWind/TailwindCSS** - Modern styling
- **Smooth Animations** - React Native Animatable for engaging UX
- **Confetti Effects** - Celebrate achievements with animations
- **Image Picker** - Upload profile pictures from camera or gallery
- **Document Picker** - File upload capabilities

### 🔄 Background Jobs (Cron)
- **Auto-expire Subscriptions** - Daily check at midnight
- **Subscription Renewal Reminders** - Daily at 9 AM for expiring plans
- **Gaming Event Status Updates** - Every minute to keep events current

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React Native with Expo
- **Navigation:** React Navigation (Stack, Bottom Tabs, Drawer)
- **Styling:** NativeWind (TailwindCSS for React Native)
- **State Management:** React Context API (AuthContext, GameContext)
- **HTTP Client:** Axios
- **Real-time:** Socket.IO Client
- **Animations:** React Native Animatable, Reanimated
- **UI Components:** Expo Vector Icons, Lucide React Native
- **Forms:** React Native Picker
- **Payment:** React Native Razorpay
- **Others:** AsyncStorage, Expo Image Picker, Expo Font

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken), bcrypt, argon2
- **Security:** Helmet, CORS, express-rate-limit, express-slow-down
- **Email:** SendGrid, Mailgun, Nodemailer, Resend
- **File Upload:** Multer, Cloudinary
- **Payment:** Razorpay
- **Real-time:** Socket.IO
- **Validation:** Zod, Validator
- **2FA:** Speakeasy
- **QR Code:** qrcode
- **Scheduling:** node-cron

### Database Models
- User, Quiz, QuizAttempt, MCQ, QuestionBank
- Badge, DailyQuest, Streak
- GamingQuizEvent, GamingQuizEventAttempt
- Notification, Payment, Review
- SubscriptionPlan, Session, Token

---

## 📂 Project Structure

```
EduzzleApp/
├── backend/
│   ├── config/          # Configuration files (DB, Cloudinary, Razorpay)
│   ├── middlewares/     # Authentication, rate limiting, file upload
│   ├── models/          # MongoDB schemas (User, Quiz, Badge, etc.)
│   ├── routes/          # API endpoints (auth, quiz, payment, etc.)
│   ├── seeders/         # Database seed scripts
│   ├── utils/           # Helper functions (email, JWT, security)
│   └── server.js        # Main server file
│
├── frontend/
│   ├── assets/          # Images, fonts, and static files
│   ├── components/      # Reusable UI components
│   ├── config/          # API configuration
│   ├── context/         # React Context (Auth, Game)
│   ├── navigation/      # App navigation setup
│   ├── pages/           # Auth pages (Login, Register, etc.)
│   ├── screens/         # Main app screens
│   └── App.js           # Main app component
│
└── README.md
```

---

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/upload-picture` - Upload profile picture
- `PUT /api/user/change-password` - Change password

### Quiz System
- `GET /api/puzzles` - Get all quizzes
- `GET /api/fetch-puzzles` - Fetch quizzes by category/difficulty
- `POST /api/puzzles` - Create new quiz (Admin)
- `GET /api/puzzles/:id` - Get quiz details
- `POST /api/puzzle-attempts` - Submit quiz attempt
- `GET /api/puzzle-attempts/:userId` - Get user's attempts
- `GET /api/attempts/stats` - Get attempt statistics

### MCQ System
- `GET /api/mcqs/categories` - Get MCQ categories
- `GET /api/mcqs/:category` - Get MCQs by category
- `POST /api/mcqs/attempt` - Submit MCQ attempt

### Gaming Events
- `GET /api/gaming-events` - Get all gaming events
- `GET /api/gaming-events/active` - Get active events
- `GET /api/gaming-events/:id` - Get event details
- `POST /api/gaming-events/:id/attempt` - Submit event attempt
- `GET /api/gaming-events/:id/leaderboard` - Get event leaderboard

### Badges & Rewards
- `GET /api/badges/:userId` - Get user badges
- `POST /api/badges/claim` - Claim badge reward

### Daily Quests
- `GET /api/daily-quests/:userId` - Get daily quest status
- `POST /api/daily-quests/complete` - Complete daily quest

### Streaks
- `GET /api/streaks/:userId` - Get user streak
- `POST /api/streaks/update` - Update streak

### Leaderboard
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/friends/:userId` - Friends leaderboard

### Friends
- `POST /api/friends/send-request` - Send friend request
- `POST /api/friends/accept-request` - Accept friend request
- `POST /api/friends/reject-request` - Reject friend request
- `GET /api/friends/list` - Get friends list
- `GET /api/friends/pending` - Get pending requests
- `GET /api/friends/sent` - Get sent requests
- `DELETE /api/friends/remove` - Remove friend

### Subscriptions & Payments
- `GET /api/subscription/plans` - Get subscription plans
- `POST /api/subscription/subscribe` - Subscribe to plan
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/history` - Get payment history

### Notifications
- `GET /api/notifications/:userId` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

### Reviews
- `POST /api/reviews` - Submit app review
- `GET /api/reviews` - Get all reviews (Admin)

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform statistics
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

---

## 🤝 Collaborators

| Name           | GitHub                                   | Email                  |
|----------------|------------------------------------------|------------------------|
| Abhishek Yadav | [@abhiishek2408](https://github.com/abhiishek2408) | abhishekydv2408@gmail.com   |
| Vishesh Ydav   | [@vishesh2408](https://github.com/vishesh2408)       | visheshyadav62@gmail.com   |


---

## 📚 What We Learned

- How to break down complex problems into smaller, manageable components
- Building a full-stack mobile application with React Native and Node.js
- Implementing secure authentication with JWT and OTP verification
- Integrating payment gateways (Razorpay) for subscription management
- Real-time features using Socket.IO for notifications and live updates
- Database design and optimization with MongoDB and Mongoose
- Implementing gamification features (badges, streaks, leaderboards)
- Cloud services integration (Cloudinary for images, email services)
- Automated tasks with cron jobs for background processing
- API security best practices (rate limiting, CORS, helmet, input validation)
- Collaborating effectively as a team using Git and GitHub
- Handling user authentication, form validations, and proper error handling
- Deploying the backend to cloud platforms and managing environment variables
- Managing sensitive information securely (database credentials, API keys)
- Designing responsive and engaging mobile UI/UX
- Implementing context API for state management in React Native
- Version control workflows and collaborative development


---

## 🚧 Installation & Running Locally

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Expo CLI
- Android Studio / Xcode (for mobile development)
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/abhiishek2408/EduzzleApp-React-Native.git

# Navigate to backend directory
cd EduzzleApp-React-Native/backend

# Install dependencies
npm install

# Create .env file with required variables
# PORT=3000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# JWT_EXPIRES_IN=7d
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_cloudinary_key
# CLOUDINARY_API_SECRET=your_cloudinary_secret
# RAZORPAY_KEY_ID=your_razorpay_key
# RAZORPAY_KEY_SECRET=your_razorpay_secret
# EMAIL_SERVICE=sendgrid # or mailgun, resend, nodemailer
# EMAIL_FROM=your_email@example.com
# SENDGRID_API_KEY=your_sendgrid_key # if using SendGrid

# Start the backend server
npm start
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Update API configuration
# Edit frontend/config/api.js with your backend URL

# Start the Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## 🎮 How to Use

1. **Register/Login** - Create an account or login with existing credentials
2. **Verify Email** - Enter the OTP sent to your email
3. **Explore Quizzes** - Browse different categories and difficulty levels
4. **Attempt Quizzes** - Start solving puzzles and earn coins
5. **Complete Daily Quests** - Maintain streaks and earn bonus rewards
6. **Join Gaming Events** - Participate in live quiz competitions
7. **Add Friends** - Connect with friends and compete on leaderboards
8. **Unlock Badges** - Achieve milestones and unlock achievement badges
9. **Subscribe to Premium** - Get access to exclusive features
10. **Track Progress** - View your dashboard and analytics

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Server
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Email Configuration
EMAIL_SERVICE=sendgrid
EMAIL_FROM=noreply@eduzzle.com
SENDGRID_API_KEY=your-sendgrid-api-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8081

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=200
```

---

## 🌟 Premium Features

Premium subscribers get access to:
- ✨ Unlimited quiz attempts
- 🎯 Exclusive premium quizzes
- 📊 Advanced analytics and insights
- 🏆 Premium-only gaming events
- 💎 Bonus coins and rewards
- 🎨 Custom profile themes
- 📈 Priority leaderboard placement
- 🔔 Priority support
- 📱 Ad-free experience
- ⚡ Early access to new features

---

## 🎯 Gaming Event System

Gaming events are scheduled quiz competitions where users compete in real-time:

### Event Lifecycle
1. **Upcoming** - Event is scheduled but not started
2. **Live** - Event is currently running (users can participate)
3. **Completed** - Event has ended (leaderboard finalized)
4. **Disabled** - Event is inactive

### Automatic Status Updates
A cron job runs every minute to automatically:
- Change upcoming events to "live" when start time is reached
- Change live events to "completed" when end time is reached

---

## 📊 Gamification System

### Coins
- Earn coins by completing quizzes
- Use coins to unlock special features
- Get bonus coins for maintaining streaks

### Badges
- **Bronze Badge** - 7 day streak (50 coins)
- **Silver Badge** - 14 day streak (100 coins)
- **Gold Badge** - 30 day streak (200 coins)
- **Diamond Badge** - 60 day streak (500 coins)

### Daily Quests
- Complete daily challenges to maintain streak
- Earn bonus rewards for consecutive days
- Reset at midnight every day

### Leaderboards
- **Global Leaderboard** - Compete with all users
- **Friends Leaderboard** - Compare with your friends
- **Event Leaderboard** - Rank in specific gaming events

---

## 🔧 Key Technologies Explained

### Socket.IO Integration
Real-time bidirectional communication for:
- Instant notifications
- Live event updates
- Friend request notifications
- Achievement unlocks

### Cron Jobs
Automated background tasks:
- Daily subscription expiration check (midnight)
- Subscription renewal reminders (9 AM daily)
- Gaming event status updates (every minute)

### Payment Integration
Razorpay integration for:
- Secure payment processing
- Order creation and verification
- Payment history tracking
- Auto-renewal handling

### Cloud Storage
Cloudinary integration for:
- Profile picture uploads
- Image optimization
- CDN delivery
- Format transformations

---

## 🐛 Known Issues & Future Enhancements

### Future Features
- [ ] Push notifications for mobile
- [ ] Social media sharing
- [ ] Multiplayer quiz battles
- [ ] Custom quiz creation by users
- [ ] Video explanations for answers
- [ ] Achievement sharing on social media
- [ ] Referral system
- [ ] Voice-based quizzes
- [ ] AR/VR puzzle experiences
- [ ] Offline mode support

---

## 📱 Mobile App Features

- Cross-platform (iOS & Android)
- Smooth animations and transitions
- Responsive design for all screen sizes
- Touch-friendly interface
- Gesture support
- Haptic feedback
- Dark mode support (coming soon)
- Offline quiz caching (coming soon)

---

## 🔒 Security Measures

- Password hashing with bcrypt/argon2
- JWT token authentication
- OTP verification for account security
- Rate limiting to prevent abuse
- CORS protection
- Helmet security headers
- Input validation with Zod
- SQL injection prevention (NoSQL)
- XSS protection
- Account lockout after failed attempts
- Secure session management

---

## 📈 Performance Optimizations

- Database indexing for faster queries
- Lazy loading of images
- Skeleton loaders for better UX
- API response caching
- Optimized database queries
- CDN for static assets
- Gzip compression
- Connection pooling

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Contact

**Abhishek Yadav**
- GitHub: [@abhiishek2408](https://github.com/abhiishek2408)
- Email: abhishekydv2408@gmail.com



**Vishesh Yadav**
- GitHub: [@vishesh2408](https://github.com/vishesh2408)
- Email: visheshyadav62@gmail.com

---

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Expo team for amazing development tools
- MongoDB team for robust database solutions
- All open-source contributors whose packages made this possible

---

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

**Made with ❤️ by Abhishek & Vishesh**
