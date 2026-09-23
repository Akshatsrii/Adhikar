const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: String,
  category: String,
  level: { type: String, enum: ['Central', 'State'] },
  state: String,
  benefit: String,
  description: String,
  source_url: String,
});

const Scheme = mongoose.model('Scheme', SchemeSchema);

const categories = ['Agriculture', 'Employment', 'Housing', 'Disability', 'Women', 'Healthcare', 'Education', 'Social Welfare'];

const data = [];
for (let i = 0; i < 50; i++) {
  const cat = categories[i % categories.length];
  data.push({
    slug: `scheme-${cat.toLowerCase()}-${i}`,
    name: `${cat} Scheme ${i}`,
    department: `Department of ${cat}`,
    category: cat,
    level: i % 2 === 0 ? 'Central' : 'State',
    state: i % 2 === 0 ? null : 'Rajasthan',
    benefit: `Up to ₹${(i * 1000) + 5000} financial assistance`,
    description: `A scheme to help citizens with ${cat.toLowerCase()} related issues.`,
    source_url: 'https://www.myscheme.gov.in',
  });
}

mongoose.connect('mongodb://127.0.0.1:27017/adhikar')
  .then(async () => {
    // Only insert if missing
    for (let s of data) {
      await Scheme.updateOne({ slug: s.slug }, { $set: s }, { upsert: true });
    }
    console.log('Seeded 50 schemes');
    process.exit(0);
  })
  .catch(console.error);
