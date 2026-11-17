import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './models/User.js';
import { Item } from './models/Item.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed] Connected to MongoDB Atlas');

    const email = 'alice@gmail.com';
    const password = 'Abc@123';
    const name = 'Alice Johnson';

    // Remove existing Alice account if present to avoid duplication
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await Item.deleteMany({ user: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
      console.log(`[Seed] Cleared existing data for ${email}`);
    }

    // Create User Alice
    const user = await User.create({
      name,
      email,
      password,
    });

    console.log(`[Seed] Created user: ${user.email} (Password: ${password})`);

    // Create 12 realistic, diverse demo tasks
    const items = [
      {
        user: user._id,
        title: 'Design E-Commerce Product Catalog UI',
        description: 'Build a mobile-responsive grid layout with product card skeletons and badge filters using Tailwind CSS.',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        user: user._id,
        title: 'Implement JWT Authentication & Refresh Tokens',
        description: 'Develop secure sign-up, sign-in, and auth middleware with bcrypt password hashing in Node.js & Express.',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // yesterday
      },
      {
        user: user._id,
        title: 'Configure MongoDB Atlas Cloud Database',
        description: 'Set up M0 cluster, configure network IP access, define Mongoose schemas, and create automated seed scripts.',
        status: 'completed',
        priority: 'medium',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        title: 'Build RESTful API for Shopping Cart',
        description: 'Implement endpoints for adding, updating quantities, and removing items with total price calculation.',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
      },
      {
        user: user._id,
        title: 'Integrate Stripe Payment Gateway',
        description: 'Set up Stripe checkout sessions and webhook listener for verifying successful payment transactions.',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // in 4 days
      },
      {
        user: user._id,
        title: 'Implement Global Search & Filter Bar',
        description: 'Add real-time client-side debouncing with regex MongoDB search query support across item titles & categories.',
        status: 'in-progress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        title: 'Set Up Automated Unit Tests with Jest & Supertest',
        description: 'Write integration test suites for authentication routes, protected endpoint authorization, and validation rules.',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        title: 'Optimize Database Query Indexes',
        description: 'Create compound indexes on user ID, status, and createdAt fields to ensure sub-50ms query response times.',
        status: 'pending',
        priority: 'low',
        dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        title: 'Implement Dark Mode Theme Support',
        description: 'Add a theme toggle button using Tailwind dark classes and store user preference in localStorage.',
        status: 'pending',
        priority: 'low',
        dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        title: 'Dockerize Backend & Frontend Applications',
        description: 'Write multi-stage Dockerfiles and docker-compose.yml for one-command containerized local development.',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        title: 'Set Up CI/CD Pipeline on GitHub Actions',
        description: 'Configure automated linting, test execution, and deployment triggers upon merging pull requests to main.',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      },
      {
        user: user._id,
        title: 'Prepare Final Project Presentation & Live Demo',
        description: 'Create slide deck highlighting system architecture, performance metrics, API documentation, and future roadmap.',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
    ];

    await Item.insertMany(items);
    console.log(`[Seed] Successfully inserted ${items.length} demo items for ${email}!`);

    await mongoose.disconnect();
    console.log('[Seed] Database disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
