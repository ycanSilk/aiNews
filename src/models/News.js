import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  semanticId: { type: String, required: true, unique: true },
  title: {
    zh: String,
    en: String
  },
  summary: {
    zh: String,
    en: String
  },
  category: String,
  readTime: Number,
  publishTime: Date,
  date: String,
  weekday: String,
  views: Number,
  comments: Number,
  isBreaking: Boolean,
  isImportant: Boolean,
  tags: [String],
  locales: {
    zh: {
      title: String,
      summary: String,
      tags: [String]
    },
    en: {
      title: String,
      summary: String,
      tags: [String]
    }
  }
}, { timestamps: true });

export default mongoose.model('News', newsSchema);