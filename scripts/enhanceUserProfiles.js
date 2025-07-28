const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to database
mongoose.connect('mongodb://localhost:27017/roomtopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Enhanced profile data for existing users
const userEnhancements = [
  {
    email: '2018101000@student.uitm.edu.my',
    name: 'Zainab',
    enhancements: {
      age: 22,
      gender: 'Female',
      religion: 'Muslim',
      university: 'UiTM Shah Alam',
      faculty: 'Faculty of Computer and Mathematical Sciences',
      year: 'Final Year',
      course: 'Computer Science',
      matricNumber: '2018101000',
      bio: 'Final year Computer Science student passionate about software development and AI. Looking for a quiet, studious roommate who respects study time.',
      interests: ['Programming', 'Reading', 'Islamic Studies', 'Technology', 'Cooking'],
      budgetMin: 400,
      budgetMax: 600,
      smoking: false,
      lifestylePreferences: {
        sleepSchedule: 'early_bird',
        cleanliness: 9,
        socialLevel: 6,
        studyHabits: 'quiet_studious',
        guestPolicy: 'rarely'
      }
    }
  },
  {
    email: '2018115000@student.uitm.edu.my',
    name: 'Yusof',
    enhancements: {
      age: 22,
      gender: 'Male',
      religion: 'Muslim',
      university: 'UiTM Shah Alam',
      faculty: 'Faculty of Engineering',
      year: 'Final Year',
      course: 'Mechanical Engineering',
      matricNumber: '2018115000',
      bio: 'Engineering student with a passion for innovation and problem-solving. Enjoys working on projects and collaborating with others.',
      interests: ['Engineering', 'Technology', 'Sports', 'Innovation', 'Teamwork'],
      budgetMin: 450,
      budgetMax: 650,
      smoking: false,
      lifestylePreferences: {
        sleepSchedule: 'night_owl',
        cleanliness: 7,
        socialLevel: 8,
        studyHabits: 'collaborative',
        guestPolicy: 'occasionally'
      }
    }
  },
  {
    email: '2018173000@student.uitm.edu.my',
    name: 'Amir',
    enhancements: {
      age: 22,
      gender: 'Male',
      religion: 'Muslim',
      university: 'UiTM Shah Alam',
      faculty: 'Faculty of Business and Management',
      year: 'Final Year',
      course: 'Business Administration',
      matricNumber: '2018173000',
      bio: 'Business student with entrepreneurial aspirations. Active in student organizations and enjoys networking events.',
      interests: ['Business', 'Entrepreneurship', 'Networking', 'Leadership', 'Finance'],
      budgetMin: 500,
      budgetMax: 700,
      smoking: false,
      lifestylePreferences: {
        sleepSchedule: 'flexible',
        cleanliness: 8,
        socialLevel: 9,
        studyHabits: 'flexible',
        guestPolicy: 'frequently'
      }
    }
  },
  {
    email: '2018175000@student.uitm.edu.my',
    name: 'Iskandar',
    enhancements: {
      age: 22,
      gender: 'Male',
      religion: 'Muslim',
      university: 'UiTM Shah Alam',
      faculty: 'Faculty of Law',
      year: 'Final Year',
      course: 'Law',
      matricNumber: '2018175000',
      bio: 'Law student with strong analytical skills. Enjoys debates and intellectual discussions. Prefers a quiet study environment.',
      interests: ['Law', 'Debate', 'Reading', 'Politics', 'Research'],
      budgetMin: 450,
      budgetMax: 650,
      smoking: false,
      lifestylePreferences: {
        sleepSchedule: 'night_owl',
        cleanliness: 9,
        socialLevel: 5,
        studyHabits: 'quiet_studious',
        guestPolicy: 'rarely'
      }
    }
  },
  {
    email: '2018187000@student.uitm.edu.my',
    name: 'Qistina',
    enhancements: {
      age: 22,
      gender: 'Female',
      religion: 'Muslim',
      university: 'UiTM Shah Alam',
      faculty: 'Faculty of Medicine',
      year: 'Final Year',
      course: 'Medicine',
      matricNumber: '2018187000',
      bio: 'Medical student with a demanding schedule. Very organized and clean due to medical training. Looking for understanding roommate.',
      interests: ['Medicine', 'Healthcare', 'Volunteering', 'Reading', 'Fitness'],
      budgetMin: 500,
      budgetMax: 800,
      smoking: false,
      lifestylePreferences: {
        sleepSchedule: 'early_bird',
        cleanliness: 10,
        socialLevel: 6,
        studyHabits: 'quiet_studious',
        guestPolicy: 'rarely'
      }
    }
  },
  {
    email: '2018327000@student.uitm.edu.my',
    name: 'Yahya',
    enhancements: {
      age: 22,
      gender: 'Male',
      religion: 'Muslim',
      university: 'UiTM Shah Alam',
      faculty: 'Faculty of Art and Design',
      year: 'Final Year',
      course: 'Graphic Design',
      matricNumber: '2018327000',
      bio: 'Creative design student who loves expressing ideas through visual art. Sometimes works late on creative projects.',
      interests: ['Design', 'Art', 'Photography', 'Creativity', 'Digital Media'],
      budgetMin: 400,
      budgetMax: 600,
      smoking: false,
      lifestylePreferences: {
        sleepSchedule: 'night_owl',
        cleanliness: 7,
        socialLevel: 7,
        studyHabits: 'creative_flexible',
        guestPolicy: 'occasionally'
      }
    }
  },
  {
    email: '2018513000@student.uitm.edu.my',
    name: 'Wan',
    enhancements: {
      age: 22,
      gender: 'Female',
      religion: 'Muslim',
      university: 'UiTM Shah Alam',
      faculty: 'Faculty of Accountancy',
      year: 'Final Year',
      course: 'Accounting',
      matricNumber: '2018513000',
      bio: 'Accounting student preparing for professional exams. Disciplined and focused on career goals. Prefers organized living.',
      interests: ['Accounting', 'Finance', 'Professional Development', 'Reading', 'Planning'],
      budgetMin: 400,
      budgetMax: 600,
      smoking: false,
      lifestylePreferences: {
        sleepSchedule: 'early_bird',
        cleanliness: 9,
        socialLevel: 5,
        studyHabits: 'quiet_studious',
        guestPolicy: 'rarely'
      }
    }
  },
  {
    email: '2018866000@student.uitm.edu.my',
    name: 'Khalid',
    enhancements: {
      age: 22,
      gender: 'Male',
      religion: 'Muslim',
      university: 'UiTM Shah Alam',
      faculty: 'Faculty of Sports Science and Recreation',
      year: 'Final Year',
      course: 'Sports Science',
      matricNumber: '2018866000',
      bio: 'Sports Science student and athlete. Maintains healthy lifestyle with regular training. Early riser and disciplined.',
      interests: ['Sports', 'Fitness', 'Nutrition', 'Coaching', 'Health'],
      budgetMin: 450,
      budgetMax: 650,
      smoking: false,
      lifestylePreferences: {
        sleepSchedule: 'early_bird',
        cleanliness: 8,
        socialLevel: 8,
        studyHabits: 'active_learner',
        guestPolicy: 'occasionally'
      }
    }
  }
];

async function enhanceUserProfiles() {
  try {
    console.log('👤 Starting user profile enhancement...');
    
    let updatedCount = 0;
    
    for (const userUpdate of userEnhancements) {
      const result = await User.updateOne(
        { email: userUpdate.email },
        {
          $set: {
            fullName: userUpdate.name,
            age: userUpdate.enhancements.age,
            gender: userUpdate.enhancements.gender,
            religion: userUpdate.enhancements.religion,
            university: userUpdate.enhancements.university,
            faculty: userUpdate.enhancements.faculty,
            year: userUpdate.enhancements.year,
            course: userUpdate.enhancements.course,
            matricNumber: userUpdate.enhancements.matricNumber,
            bio: userUpdate.enhancements.bio,
            interests: userUpdate.enhancements.interests,
            budgetMin: userUpdate.enhancements.budgetMin,
            budgetMax: userUpdate.enhancements.budgetMax,
            smoking: userUpdate.enhancements.smoking,
            lifestylePreferences: userUpdate.enhancements.lifestylePreferences,
            profileComplete: true,
            lastUpdated: new Date()
          }
        }
      );
      
      if (result.modifiedCount > 0) {
        updatedCount++;
        console.log(`✅ Enhanced profile for ${userUpdate.name} (${userUpdate.email})`);
      }
    }
    
    console.log(`\n🎉 Successfully enhanced ${updatedCount} user profiles!`);
    console.log('👤 Enhanced profiles include:');
    console.log('   - Complete academic information');
    console.log('   - Detailed lifestyle preferences');
    console.log('   - Budget ranges for roommate matching');
    console.log('   - Interests and hobbies');
    console.log('   - Bio descriptions');
    console.log('   - AI matching compatibility data');
    
    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error enhancing user profiles:', error);
    process.exit(1);
  }
}

// Run the enhancement
enhanceUserProfiles();
