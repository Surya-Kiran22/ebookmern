require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/book');

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.URI);
    console.log('Connected to MongoDB');

    // Categories (6 books each = 42 total)
    const categories = [
      'horrors',
      'comex',
      'journals',
      'general knowledge',
      'advanchers',
      'jsp,servlets',
      'mern larnings',
    ];

    const books = [];

    const lorem =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

    // Simple image set per category (placeholder images)
    const images = [
      'https://picsum.photos/seed/book1/400/600',
      'https://picsum.photos/seed/book2/400/600',
      'https://picsum.photos/seed/book3/400/600',
      'https://picsum.photos/seed/book4/400/600',
      'https://picsum.photos/seed/book5/400/600',
      'https://picsum.photos/seed/book6/400/600',
    ];

    const randomPrice = () => Math.floor(Math.random() * (999 - 199 + 1)) + 199; // 199-999

    // Generate 6 books per category
    categories.forEach((cat) => {
      for (let i = 1; i <= 6; i++) {
        books.push({
          url: images[(i - 1) % images.length],
          title: `${cat} Book ${i}`,
          author: `${cat} Author`,
          price: randomPrice(),
          desc: `${lorem} (${cat} #${i})`,
          language: 'English',
          category: cat,
        });
      }
    });

    // Insert without deleting existing data
    const result = await Book.insertMany(books, { ordered: false });
    console.log(`Inserted ${result.length} books.`);
  } catch (err) {
    // If some duplicates or validation errors occur, log and continue
    console.error('Seeding error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

main();
