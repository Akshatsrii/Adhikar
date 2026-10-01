const mongoose = require('mongoose');
const SchemeSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: String,
  category: String,
  level: { type: String },
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
    name: `PM ${cat} Vikas Yojana ${i}`,
    department: `Department of ${cat}`,
    category: cat,
    level: i % 2 === 0 ? 'Central' : 'State',
    state: i % 2 === 0 ? null : 'Rajasthan',
    benefit: `Up to ₹1${(i * 100) + 5000} financial assistance`,
    description: `A flagship scheme by the government to provide support and benefits to citizens in the ${cat.toLowerCase()} sector. Provides subsidies and direct benefit transfers.`,
    source_url: 'https://www.myscheme.gov.in',
  });
}

mongoose.connect('mongodb+srv://chikusrivastava535_db_user:pzRhXsDFJYAN5NUh@cluster0.lzk9plo.mongodb.net/adhikar?appName=Cluster0&compressors=zlib')
  .then(async () => {
    for (let s of data) {
      await Scheme.updateOne({ slug: s.slug }, { $set: s }, { upsert: true });
    }
    console.log('Seeded 50 dummy schemes into Atlas!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
