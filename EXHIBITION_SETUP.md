# 🎯 RoomTopia Exhibition Setup Guide

## 🚀 Quick Start for Exhibition Day

### 1. **One-Command Setup** (Recommended)
```bash
cd server
npm run seed-exhibition
```

This single command will populate your database with **everything** needed for exhibition:
- ✅ 25 UiTM student users with complete profiles
- ✅ 15+ realistic property listings across Shah Alam
- ✅ 13+ diverse roommate requests
- ✅ 30 days of analytics data for charts
- ✅ Admin accounts for demonstration

### 2. **Manual Step-by-Step** (If needed)
```bash
# Step 1: Create users
npm run seed-users

# Step 2: Create admin accounts
npm run create-admin

# Step 3: Add property listings
npm run seed-properties

# Step 4: Add roommate requests
npm run seed-roommates

# Step 5: Generate analytics data
npm run seed-analytics
```

## 🔐 Demo Login Credentials

### **Admin Accounts**
- **Main Admin**: `admin@roomtopia.com` / `admin123`
- **Supervisor**: `supervisor@uitm.edu.my` / `admin123`

### **Student Accounts** (All use password: `password123`)
- `2018101000@student.uitm.edu.my` - Zainab (Computer Science)
- `2019019000@student.uitm.edu.my` - Hafiz (Engineering)
- `2020378000@student.uitm.edu.my` - Liyana (Business)
- `2021282000@student.uitm.edu.my` - Omar (Information Management)
- `2022325000@student.uitm.edu.my` - Nurul (Pharmacy)
- *(20 more student accounts available)*

## 🎪 Exhibition Demo Features

### **🏠 Property Listings**
- **15+ Properties** across popular Shah Alam locations
- **Price Range**: RM 300 - RM 1,200
- **Types**: Single Room, Master Room, Shared Room, Studio, Apartment
- **Locations**: Seksyen 1-25, i-City, Ken Rimba, Setia Alam, Kota Kemuning

### **👥 Roommate Matching**
- **13+ Diverse Profiles** with complete information
- **AI Matching** with compatibility percentages
- **Various Faculties**: Computer Science, Engineering, Business, Medicine, etc.
- **Different Preferences**: Study habits, lifestyle, budget, religion

### **📊 Analytics Dashboard**
- **30 Days** of realistic user activity data
- **Search Trends** by location and property type
- **User Behavior** tracking and insights
- **Real-time Statistics** for demonstration

## 🎯 Exhibition Demo Script

### **1. Homepage Demo** (2 minutes)
- Show analytics cards with real data
- Demonstrate trending locations
- Highlight user activity statistics

### **2. Property Search Demo** (3 minutes)
- Search for "Seksyen 7" (most popular location)
- Filter by price range (RM 400-600)
- Show AI matching percentages
- Demonstrate bookmark functionality

### **3. Roommate Matching Demo** (3 minutes)
- Login as student account
- Browse roommate profiles
- Show AI compatibility calculations
- Demonstrate filtering options

### **4. Admin Panel Demo** (2 minutes)
- Login as admin
- Show user management
- Display analytics dashboard
- Demonstrate system monitoring

## 🔧 Troubleshooting

### **If Seeding Fails:**
1. **Check MongoDB**: Ensure MongoDB is running on port 27017
2. **Database Connection**: Verify connection string in scripts
3. **Clear Database**: Drop collections if needed
4. **Run Individual Scripts**: Use manual step-by-step approach

### **Common Issues:**
- **Duplicate Key Errors**: Clear existing data first
- **Connection Timeout**: Check MongoDB service
- **Missing Models**: Ensure all model files exist

## 📈 Data Statistics

After seeding, your database will contain:
- **👥 Users**: 25 complete student profiles + 2 admin accounts
- **🏠 Properties**: 15+ listings with photos and details
- **🤝 Roommate Requests**: 13+ diverse profiles
- **📊 Analytics**: 300+ events over 30 days
- **🔖 Sample Bookmarks**: Pre-populated favorites

## 🎊 Exhibition Success Tips

1. **Start Fresh**: Run seeding 1 day before exhibition
2. **Test Everything**: Login with different accounts
3. **Prepare Scenarios**: Know which searches show best results
4. **Backup Data**: Export database before exhibition
5. **Have Fallbacks**: Keep screenshots of key features

## 🆘 Emergency Contacts

If you encounter issues during exhibition:
1. **Check server logs** for error messages
2. **Restart MongoDB** service if needed
3. **Re-run seeding** if data is corrupted
4. **Use fallback analytics** data in frontend

---

**🎯 You're now ready for a successful exhibition! Good luck! 🚀**
