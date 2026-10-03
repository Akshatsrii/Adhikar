const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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
  application_url: String,
  deadline: String,
});
const Scheme = mongoose.model('Scheme', SchemeSchema);

mongoose.connect('mongodb+srv://chikusrivastava535_db_user:pzRhXsDFJYAN5NUh@cluster0.lzk9plo.mongodb.net/adhikar?appName=Cluster0&compressors=zlib')
  .then(async () => {
    // Delete all existing dummy schemes
    await Scheme.deleteMany({});
    console.log('Cleared old dummy schemes.');

    const rawData = fs.readFileSync(path.join(__dirname, 'real_schemes.json'));
    const data = JSON.parse(rawData);

    for (let s of data) {
      await Scheme.updateOne({ slug: s.slug }, { $set: s }, { upsert: true });
    }
    console.log(`Seeded ${data.length} REAL schemes into Atlas!`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
