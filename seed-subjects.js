require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');

const MONGODB_URI = process.env.MONGODB_URI;

const subjectsByGrade = {
  'Kinder 1': [
    { name: 'Aqeedah & Fiqh (K1)', subject: 'Aqeedah & Fiqh' },
    { name: 'Seerah & Hadith (K1)', subject: 'Seerah & Hadith' },
    { name: 'Qur\'an Reading (K1)', subject: 'Qur\'an Reading' },
    { name: 'Akhlaq (K1)', subject: 'Akhlaq' },
    { name: 'Arabic Language (K1)', subject: 'Arabic Language' },
  ],
  'Kinder 2': [
    { name: 'Aqeedah & Fiqh (K2)', subject: 'Aqeedah & Fiqh' },
    { name: 'Seerah & Hadith (K2)', subject: 'Seerah & Hadith' },
    { name: 'Qur\'an Reading (K2)', subject: 'Qur\'an Reading' },
    { name: 'Akhlaq (K2)', subject: 'Akhlaq' },
    { name: 'Arabic Language (K2)', subject: 'Arabic Language' },
  ],
  'Grade 1': [
    { name: 'Tawheed (Grade 1)', subject: 'Tawheed' },
    { name: 'Fiqh (Grade 1)', subject: 'Fiqh' },
    { name: 'Lugah (Grade 1)', subject: 'Lugah' },
    { name: 'Khat Wa Imla (Grade 1)', subject: 'Khat Wa Imla' },
    { name: 'Hisab (Grade 1)', subject: 'Hisab' },
    { name: 'Hadith (Grade 1)', subject: 'Hadith' },
    { name: 'Qur\'an (Grade 1)', subject: 'Qur\'an' },
  ],
  'Grade 2': [
    { name: 'Tawheed (Grade 2)', subject: 'Tawheed' },
    { name: 'Fiqh (Grade 2)', subject: 'Fiqh' },
    { name: 'Lugah (Grade 2)', subject: 'Lugah' },
    { name: 'Khat Wa Imla (Grade 2)', subject: 'Khat Wa Imla' },
    { name: 'Hisab (Grade 2)', subject: 'Hisab' },
    { name: 'Hadith (Grade 2)', subject: 'Hadith' },
    { name: 'Qur\'an (Grade 2)', subject: 'Qur\'an' },
  ],
  'Grade 3': [
    { name: 'Tawheed (Grade 3)', subject: 'Tawheed' },
    { name: 'Fiqh (Grade 3)', subject: 'Fiqh' },
    { name: 'Lugah (Grade 3)', subject: 'Lugah' },
    { name: 'Khat Wa Imla (Grade 3)', subject: 'Khat Wa Imla' },
    { name: 'Hisab (Grade 3)', subject: 'Hisab' },
    { name: 'Hadith (Grade 3)', subject: 'Hadith' },
    { name: 'Qur\'an (Grade 3)', subject: 'Qur\'an' },
  ],
  'Grade 4': [
    { name: 'Tawheed (Grade 4)', subject: 'Tawheed' },
    { name: 'Fiqh (Grade 4)', subject: 'Fiqh' },
    { name: 'Qawaed (Grade 4)', subject: 'Qawaed' },
    { name: 'Khat Wa Imla (Grade 4)', subject: 'Khat Wa Imla' },
    { name: 'Hadith (Grade 4)', subject: 'Hadith' },
    { name: 'Seerah (Grade 4)', subject: 'Seerah' },
    { name: 'Qur\'an (Grade 4)', subject: 'Qur\'an' },
    { name: 'Qir\'ah (Grade 4)', subject: 'Qir\'ah' },
  ],
  'Grade 5': [
    { name: 'Tawheed (Grade 5)', subject: 'Tawheed' },
    { name: 'Fiqh (Grade 5)', subject: 'Fiqh' },
    { name: 'Qawaed (Grade 5)', subject: 'Qawaed' },
    { name: 'Khat Wa Imla (Grade 5)', subject: 'Khat Wa Imla' },
    { name: 'Hadith (Grade 5)', subject: 'Hadith' },
    { name: 'Seerah (Grade 5)', subject: 'Seerah' },
    { name: 'Qur\'an (Grade 5)', subject: 'Qur\'an' },
    { name: 'Qir\'ah (Grade 5)', subject: 'Qir\'ah' },
  ],
  'Grade 6': [
    { name: 'Tawheed (Grade 6)', subject: 'Tawheed' },
    { name: 'Fiqh (Grade 6)', subject: 'Fiqh' },
    { name: 'Qawaed (Grade 6)', subject: 'Qawaed' },
    { name: 'Khat Wa Imla (Grade 6)', subject: 'Khat Wa Imla' },
    { name: 'Hadith (Grade 6)', subject: 'Hadith' },
    { name: 'Seerah (Grade 6)', subject: 'Seerah' },
    { name: 'Qur\'an (Grade 6)', subject: 'Qur\'an' },
    { name: 'Qir\'ah (Grade 6)', subject: 'Qir\'ah' },
  ],
  'Grade 7': [
    { name: 'Tawheed (Grade 7)', subject: 'Tawheed' },
    { name: 'Fiqh (Grade 7)', subject: 'Fiqh' },
    { name: 'Hadith (Grade 7)', subject: 'Hadith' },
    { name: 'Tafseer (Grade 7)', subject: 'Tafseer' },
    { name: 'Qawaed (Grade 7)', subject: 'Qawaed' },
    { name: 'Tareeh (Grade 7)', subject: 'Tareeh' },
    { name: 'Qur\'an (Grade 7)', subject: 'Qur\'an' },
    { name: 'Imla (Grade 7)', subject: 'Imla' },
  ],
  'Grade 8': [
    { name: 'Tawheed (Grade 8)', subject: 'Tawheed' },
    { name: 'Fiqh (Grade 8)', subject: 'Fiqh' },
    { name: 'Hadith (Grade 8)', subject: 'Hadith' },
    { name: 'Tafseer (Grade 8)', subject: 'Tafseer' },
    { name: 'Qawaed (Grade 8)', subject: 'Qawaed' },
    { name: 'Tareeh (Grade 8)', subject: 'Tareeh' },
    { name: 'Qur\'an (Grade 8)', subject: 'Qur\'an' },
    { name: 'Imla (Grade 8)', subject: 'Imla' },
  ],
  'Grade 9': [
    { name: 'Tawheed (Grade 9)', subject: 'Tawheed' },
    { name: 'Fiqh (Grade 9)', subject: 'Fiqh' },
    { name: 'Qawaed (Grade 9)', subject: 'Qawaed' },
    { name: 'Hadith (Grade 9)', subject: 'Hadith' },
    { name: 'Tareeh (Grade 9)', subject: 'Tareeh' },
    { name: 'Qur\'an (Grade 9)', subject: 'Qur\'an' },
    { name: 'Imla (Grade 9)', subject: 'Imla' },
  ],
  'Grade 10': [
    { name: 'Tawheed (Grade 10)', subject: 'Tawheed' },
    { name: 'Seerah (Grade 10)', subject: 'Seerah' },
    { name: 'Tafseer (Grade 10)', subject: 'Tafseer' },
    { name: 'Ta\'beer (Grade 10)', subject: 'Ta\'beer' },
    { name: 'Mustalahol Hadith (Grade 10)', subject: 'Mustalahol Hadith' },
    { name: 'Fiqh (Grade 10)', subject: 'Fiqh' },
    { name: 'Ulomol Qur\'an (Grade 10)', subject: 'Ulomol Qur\'an' },
    { name: 'Hadith (Grade 10)', subject: 'Hadith' },
    { name: 'Nahu (Grade 10)', subject: 'Nahu' },
    { name: 'Faraidh (Grade 10)', subject: 'Faraidh' },
  ],
  'Grade 11': [
    { name: 'Usolot Tafseer (Grade 11)', subject: 'Usolot Tafseer' },
    { name: 'Fiqh (Grade 11)', subject: 'Fiqh' },
    { name: 'Tawheed (Grade 11)', subject: 'Tawheed' },
    { name: 'Seerah (Grade 11)', subject: 'Seerah' },
    { name: 'Tafseer (Grade 11)', subject: 'Tafseer' },
    { name: 'Ta\'beer (Grade 11)', subject: 'Ta\'beer' },
    { name: 'Ulomol Hadith (Grade 11)', subject: 'Ulomol Hadith' },
    { name: 'Nahu (Grade 11)', subject: 'Nahu' },
    { name: 'Faraidh (Grade 11)', subject: 'Faraidh' },
    { name: 'Hadith (Grade 11)', subject: 'Hadith' },
  ],
  'Grade 12': [
    { name: 'Tawheed (Grade 12)', subject: 'Tawheed' },
    { name: 'Seerah (Grade 12)', subject: 'Seerah' },
    { name: 'Tafseer (Grade 12)', subject: 'Tafseer' },
    { name: 'Ta\'beer (Grade 12)', subject: 'Ta\'beer' },
    { name: 'Usolol Fiqh (Grade 12)', subject: 'Usolol Fiqh' },
    { name: 'Fiqh (Grade 12)', subject: 'Fiqh' },
    { name: 'Hadith (Grade 12)', subject: 'Hadith' },
    { name: 'Faraidh (Grade 12)', subject: 'Faraidh' },
    { name: 'Tareehol Fiqh (Grade 12)', subject: 'Tareehol Fiqh' },
    { name: 'Nahu (Grade 12)', subject: 'Nahu' },
  ],
};

async function seedSubjects() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Get teachers
    const teachers = await User.find({ role: 'staff' }).lean();
    if (teachers.length === 0) {
      console.log('No teachers found. Please create at least one teacher first.');
      process.exit(1);
    }

    let courseCount = 0;
    let teacherIndex = 0;

    // Create subjects for each grade
    for (const [grade, subjects] of Object.entries(subjectsByGrade)) {
      for (const subject of subjects) {
        const teacher = teachers[teacherIndex % teachers.length];
        
        await Course.create({
          name: subject.name,
          description: `${subject.subject} course for ${grade}`,
          subject: subject.subject,
          grade: grade,
          teacher: teacher._id,
          students: [],
          assignments: [],
          announcements: [],
        });

        courseCount++;
        teacherIndex++;
      }
    }

    console.log(`\n✅ Successfully created ${courseCount} subjects across all grades!`);
    console.log('\nSubjects created by grade:');
    for (const [grade, subjects] of Object.entries(subjectsByGrade)) {
      console.log(`  ${grade}: ${subjects.length} subjects`);
    }

    await mongoose.disconnect();
    console.log('\nDatabase connection closed.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seedSubjects();
