const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  state: { type: String, enum: ['draft', 'published'], default: 'draft' },
  like_count: { type: Number, default: 0 },
  comment_count: { type: Number, default: 0 }
}, { timestamps: true });

// Indexing for the search requirement (author, title, tags)
postSchema.index({ title: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);