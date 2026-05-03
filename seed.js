require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const Announcement = require('./models/Announcement');

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Assignment.deleteMany({}),
    Announcement.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // --- Users ---
  const admin = await User.create({
    email: 'admin@mii.edu.ph',
    role: 'admin',
    name: 'Administrator',
    language: 'English',
    permissions: ['manage_users', 'manage_courses', 'manage_announcements'],
  });

  const staff1 = await User.create({
    email: 'ustadh.ali@mii.edu.ph',
    role: 'staff',
    name: 'Ustadh Ali Rahman',
    language: 'Arabic',
  });

  const staff2 = await User.create({
    email: 'teacher.sarah@mii.edu.ph',
    role: 'staff',
    name: 'Teacher Sarah Mendoza',
    language: 'English',
  });

  const dale = await User.create({
    email: 'rodriguezdale364@gmail.com',
    role: 'student',
    roles: ['student', 'admin'],
    name: 'Dale Rodriguez',
    language: 'English',
    permissions: ['manage_users', 'manage_courses', 'manage_announcements'],
    progress: {
      islamic: { quran: 72, hadith: 58, fiqh: 65, arabic: 40 },
      academic: { mathematics: 88, english: 91, science: 79 },
    },
  });

  const student2 = await User.create({
    email: 'ahmad.santos@mii.edu.ph',
    role: 'student',
    name: 'Ahmad Santos',
    language: 'Filipino',
    progress: {
      islamic: { quran: 85, hadith: 70, fiqh: 60, arabic: 55 },
      academic: { mathematics: 75, english: 80, science: 90 },
    },
  });

  const student3 = await User.create({
    email: 'fatima.reyes@mii.edu.ph',
    role: 'student',
    name: 'Fatima Reyes',
    language: 'Filipino',
    progress: {
      islamic: { quran: 90, hadith: 80, fiqh: 75, arabic: 68 },
      academic: { mathematics: 92, english: 88, science: 85 },
    },
  });

  const parent1 = await User.create({
    email: 'parent.santos@mii.edu.ph',
    role: 'parent',
    name: 'Mr. Santos',
    language: 'Filipino',
    children: [student2._id],
  });

  console.log('Users created');

  // --- Courses ---
  const quranCourse = await Course.create({
    name: 'Qur\'an Recitation & Tajweed',
    description: 'Learn proper Qur\'an recitation with Tajweed rules.',
    subject: 'Quran',
    teacher: staff1._id,
    students: [dale._id, student2._id, student3._id],
  });

  const mathCourse = await Course.create({
    name: 'Mathematics',
    description: 'Covers algebra, geometry and number theory.',
    subject: 'Mathematics',
    teacher: staff2._id,
    students: [dale._id, student2._id, student3._id],
  });

  const arabicCourse = await Course.create({
    name: 'Arabic Language',
    description: 'Foundation Arabic language skills for Islamic studies.',
    subject: 'Arabic',
    teacher: staff1._id,
    students: [dale._id, student3._id],
  });

  const englishCourse = await Course.create({
    name: 'English Language',
    description: 'Develop English reading, writing, and communication skills.',
    subject: 'English',
    teacher: staff2._id,
    students: [dale._id, student2._id, student3._id],
  });

  const scienceCourse = await Course.create({
    name: 'Science',
    description: 'General Science covering biology, chemistry, and physics concepts.',
    subject: 'Science',
    teacher: staff2._id,
    students: [dale._id, student2._id, student3._id],
  });

  const hadithCourse = await Course.create({
    name: 'Hadith Studies',
    description: 'Study of authentic prophetic traditions and their applications.',
    subject: 'Hadith',
    teacher: staff1._id,
    students: [dale._id, student2._id],
  });

  const fiqhCourse = await Course.create({
    name: 'Fiqh - Islamic Jurisprudence',
    description: 'Study of Islamic law and principles of jurisprudence.',
    subject: 'Fiqh',
    teacher: staff1._id,
    students: [dale._id, student3._id],
  });

  console.log('Courses created');

  // Enroll students
  dale.enrolledCourses = [quranCourse._id, mathCourse._id, arabicCourse._id, englishCourse._id, scienceCourse._id, hadithCourse._id, fiqhCourse._id];
  dale.grades = [
    { course: quranCourse._id, subject: 'Quran', grade: '92' },
    { course: mathCourse._id, subject: 'Mathematics', grade: '88' },
    { course: arabicCourse._id, subject: 'Arabic', grade: '74' },
    { course: englishCourse._id, subject: 'English', grade: '85' },
    { course: scienceCourse._id, subject: 'Science', grade: '82' },
    { course: hadithCourse._id, subject: 'Hadith', grade: '90' },
    { course: fiqhCourse._id, subject: 'Fiqh', grade: '88' },
  ];
  await dale.save();

  student2.enrolledCourses = [quranCourse._id, mathCourse._id, englishCourse._id, scienceCourse._id, hadithCourse._id];
  student2.grades = [
    { course: quranCourse._id, subject: 'Quran', grade: '85' },
    { course: mathCourse._id, subject: 'Mathematics', grade: '75' },
    { course: englishCourse._id, subject: 'English', grade: '80' },
    { course: scienceCourse._id, subject: 'Science', grade: '90' },
    { course: hadithCourse._id, subject: 'Hadith', grade: '78' },
  ];
  await student2.save();

  student3.enrolledCourses = [quranCourse._id, mathCourse._id, arabicCourse._id, englishCourse._id, scienceCourse._id, fiqhCourse._id];
  student3.grades = [
    { course: quranCourse._id, subject: 'Quran', grade: '95' },
    { course: mathCourse._id, subject: 'Mathematics', grade: '92' },
    { course: arabicCourse._id, subject: 'Arabic', grade: '88' },
    { course: englishCourse._id, subject: 'English', grade: '87' },
    { course: scienceCourse._id, subject: 'Science', grade: '85' },
    { course: fiqhCourse._id, subject: 'Fiqh', grade: '93' },
  ];
  await student3.save();

  // --- Assignments ---
  const now = new Date();
  const a1 = await Assignment.create({
    title: 'Surah Al-Fatihah Recitation',
    description: 'Record yourself reciting Surah Al-Fatihah with proper Tajweed and submit the audio link.',
    course: quranCourse._id,
    dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    startDate: now,
  });

  const a2 = await Assignment.create({
    title: 'Algebra Problem Set 1',
    description: 'Solve problems 1-20 from Chapter 2 of the textbook.',
    course: mathCourse._id,
    dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    startDate: now,
  });

  const a3 = await Assignment.create({
    title: 'Arabic Alphabet Writing Exercise',
    description: 'Write each Arabic letter in its three forms (initial, medial, final).',
    course: arabicCourse._id,
    dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
    startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
  });

  const a4 = await Assignment.create({
    title: 'Essay: My Favorite Book',
    description: 'Write a 500-word essay about your favorite book and why you like it.',
    course: englishCourse._id,
    dueDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
    startDate: now,
  });

  const a5 = await Assignment.create({
    title: 'Science Experiment Report',
    description: 'Conduct an experiment and write a detailed report including hypothesis, method, results, and conclusion.',
    course: scienceCourse._id,
    dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
    startDate: now,
  });

  const a6 = await Assignment.create({
    title: 'Hadith Analysis',
    description: 'Analyze an assigned hadith and discuss its chain of transmission and application.',
    course: hadithCourse._id,
    dueDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
    startDate: now,
  });

  const a7 = await Assignment.create({
    title: 'Fiqh Case Study',
    description: 'Study and present a real-world scenario applying Islamic jurisprudence principles.',
    course: fiqhCourse._id,
    dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
    startDate: now,
  });

  quranCourse.assignments.push(a1._id);
  mathCourse.assignments.push(a2._id);
  arabicCourse.assignments.push(a3._id);
  englishCourse.assignments.push(a4._id);
  scienceCourse.assignments.push(a5._id);
  hadithCourse.assignments.push(a6._id);
  fiqhCourse.assignments.push(a7._id);

  // --- Announcements ---
  const ann1 = await Announcement.create({
    title: 'Welcome to MII VLE!',
    content: 'Assalamu Alaikum! Welcome to the Meba Islamic Institute Virtual Learning Environment. Please review your enrolled courses and complete any pending assignments.',
    author: admin._id,
    isGlobal: true,
  });

  const ann2 = await Announcement.create({
    title: 'Tajweed Quiz Next Week',
    content: 'There will be a Tajweed quiz covering Noon Sakinah and Meem Sakinah rules. Please review Chapter 2.',
    course: quranCourse._id,
    author: staff1._id,
    isGlobal: false,
  });

  quranCourse.announcements.push(ann2._id);

  await quranCourse.save();
  await mathCourse.save();
  await arabicCourse.save();
  await englishCourse.save();
  await scienceCourse.save();
  await hadithCourse.save();
  await fiqhCourse.save();

  console.log('Assignments & Announcements created');
  console.log('\n✓ Seed complete!');
  console.log('Users seeded:');
  console.log('  Admin:    admin@mii.edu.ph');
  console.log('  Dual:     rodriguezdale364@gmail.com (student + admin)');
  console.log('  Staff:    ustadh.ali@mii.edu.ph');
  console.log('  Staff:    teacher.sarah@mii.edu.ph');
  console.log('  Student:  ahmad.santos@mii.edu.ph');
  console.log('  Student:  fatima.reyes@mii.edu.ph');
  console.log('  Parent:   parent.santos@mii.edu.ph');

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
