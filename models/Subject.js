const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  subject: { type: String, enum: ['Aqeedah & Fiqh', 'Seerah & Hadith', 'Qur\'an Reading', 'Akhlaq', 'Arabic Language', 'Tawheed', 'Fiqh', 'Lugah', 'Khat Wa Imla', 'Hisab', 'Hadith', 'Qur\'an', 'Qawaed', 'Seerah', 'Qir\'ah', 'Tafseer', 'Tareeh', 'Imla', 'Ta\'beer', 'Mustalahol Hadith', 'Ulomol Qur\'an', 'Nahu', 'Faraidh', 'Usolot Tafseer', 'Ulomol Hadith', 'Usolol Fiqh', 'Tareehol Fiqh', 'Other'] },
  grade: { type: String, enum: ['Kinder 1', 'Kinder 2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
  announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Announcement' }],
  courseOutline: [{ title: String, content: String, order: Number }],
  treeView: [{ title: String, children: [{ title: String, type: String, content: String }] }]
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
