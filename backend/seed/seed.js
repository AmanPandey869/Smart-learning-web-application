const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Quiz.deleteMany({});
    await Progress.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@learn.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular user
    await User.create({
      name: 'John Student',
      email: 'user@learn.com',
      password: 'user123',
      role: 'user',
    });

    console.log('👥 Users created');

    // =====================================================
    // COURSE 1: React Fundamentals (Frontend)
    // =====================================================
    const reactCourse = await Course.create({
      title: 'React Fundamentals',
      description: 'Master the fundamentals of React.js including components, hooks, state management, and building modern user interfaces. This course takes you from zero to hero with hands-on projects.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      category: 'Frontend',
      instructor: 'Sarah Johnson',
      createdBy: admin._id,
      lessons: [
        {
          title: 'Introduction to React',
          type: 'video',
          content: 'https://www.youtube.com/embed/Tn6-PIqc4UM',
          duration: '15:30',
        },
        {
          title: 'Understanding JSX',
          type: 'note',
          content: `# Understanding JSX

JSX stands for JavaScript XML. It allows us to write HTML-like syntax in our JavaScript code.

## Key Points

- JSX is **not valid JavaScript** — it gets compiled by Babel into \`React.createElement()\` calls.
- You can embed JavaScript expressions inside JSX using curly braces \`{}\`.
- JSX must return a **single parent element** — use fragments \`<></>\` to wrap multiple elements.

## Example

\`\`\`jsx
function Welcome({ name }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Welcome to React.</p>
    </div>
  );
}
\`\`\`

## Rules of JSX
1. Always close self-closing tags: \`<img />\`, \`<br />\`
2. Use \`className\` instead of \`class\`
3. Use \`htmlFor\` instead of \`for\`
4. Use camelCase for event handlers: \`onClick\`, \`onChange\``,
          duration: '8 min read',
        },
        {
          title: 'React Hooks Deep Dive',
          type: 'video',
          content: 'https://www.youtube.com/embed/TNhaISOUy6Q',
          duration: '22:15',
        },
        {
          title: 'State Management with useState & useEffect',
          type: 'note',
          content: `# State Management in React

## useState Hook

The \`useState\` hook lets you add state to functional components.

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

## useEffect Hook

useEffect lets you perform side effects in components:

\`\`\`jsx
useEffect(() => {
  document.title = \\\`Count: \\\${count}\\\`;
}, [count]);
\`\`\`

## Rules of Hooks
- Only call hooks at the top level
- Only call hooks from React functions
- Name custom hooks starting with "use"`,
          duration: '10 min read',
        },
      ],
    });

    // =====================================================
    // COURSE 2: Node.js Masterclass (Backend)
    // =====================================================
    const nodeCourse = await Course.create({
      title: 'Node.js Masterclass',
      description: 'Build scalable backend applications with Node.js and Express. Learn RESTful API design, middleware, authentication, database integration, and deployment strategies.',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
      category: 'Backend',
      instructor: 'Mike Chen',
      createdBy: admin._id,
      lessons: [
        {
          title: 'Node.js Basics & Setup',
          type: 'video',
          content: 'https://www.youtube.com/embed/TlB_eWDSMt4',
          duration: '18:45',
        },
        {
          title: 'Building REST APIs with Express',
          type: 'note',
          content: `# REST APIs with Express

## Setting Up Express

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000, () => console.log('Server running'));
\`\`\`

## HTTP Methods
- **GET** — Read data
- **POST** — Create data
- **PUT** — Update data
- **DELETE** — Delete data

## Middleware
Middleware functions have access to request, response, and next middleware:

\`\`\`javascript
const logger = (req, res, next) => {
  console.log(\\\`\\\${req.method} \\\${req.url}\\\`);
  next();
};
\`\`\``,
          duration: '12 min read',
        },
        {
          title: 'Authentication with JWT',
          type: 'video',
          content: 'https://www.youtube.com/embed/mbsmsi7l3r4',
          duration: '25:00',
        },
      ],
    });

    // =====================================================
    // COURSE 3: MongoDB Deep Dive (Database)
    // =====================================================
    const mongoCourse = await Course.create({
      title: 'MongoDB Deep Dive',
      description: 'Master MongoDB from basics to advanced features. Learn schema design, aggregation pipelines, indexing, transactions, and integrate MongoDB with Node.js using Mongoose.',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
      category: 'Database',
      instructor: 'Emma Wilson',
      createdBy: admin._id,
      lessons: [
        {
          title: 'MongoDB Basics & Installation',
          type: 'video',
          content: 'https://www.youtube.com/embed/ofme2o29ngU',
          duration: '14:20',
        },
        {
          title: 'Schema Design Patterns',
          type: 'note',
          content: `# MongoDB Schema Design

## Embedding vs Referencing

### Embedding (Denormalization)
Best for data that is frequently read together:

\`\`\`javascript
{
  name: "John",
  addresses: [
    { street: "123 Main St", city: "NYC" },
    { street: "456 Oak Ave", city: "LA" }
  ]
}
\`\`\`

### Referencing (Normalization)
Best for large, frequently changing documents:

\`\`\`javascript
{
  name: "John",
  orders: [ObjectId("..."), ObjectId("...")]
}
\`\`\`

## When to Embed
- One-to-few relationships
- Data always accessed together
- Data doesn't change independently`,
          duration: '15 min read',
        },
        {
          title: 'Aggregation Pipelines',
          type: 'video',
          content: 'https://www.youtube.com/embed/A3jvoE0jGdE',
          duration: '20:30',
        },
      ],
    });

    // =====================================================
    // COURSE 4: Docker & Kubernetes (DevOps)
    // =====================================================
    const devopsCourse = await Course.create({
      title: 'Docker & Kubernetes Essentials',
      description: 'Learn containerization with Docker and orchestration with Kubernetes. Package applications, manage multi-container deployments, and master CI/CD pipelines for modern cloud-native development.',
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
      category: 'DevOps',
      instructor: 'David Park',
      createdBy: admin._id,
      lessons: [
        {
          title: 'What is Docker?',
          type: 'video',
          content: 'https://www.youtube.com/embed/fqMOX6JJhGo',
          duration: '12:00',
        },
        {
          title: 'Dockerfile & Docker Compose',
          type: 'note',
          content: `# Docker Essentials

## Dockerfile

A Dockerfile defines how to build a container image.

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

## Docker Compose

Use \`docker-compose.yml\` to run multi-container apps:

\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
  db:
    image: mongo:7
    ports:
      - "27017:27017"
\`\`\`

## Key Commands
- \`docker build -t myapp .\` — Build image
- \`docker run -p 3000:3000 myapp\` — Run container
- \`docker-compose up -d\` — Start all services`,
          duration: '10 min read',
        },
        {
          title: 'Kubernetes Crash Course',
          type: 'video',
          content: 'https://www.youtube.com/embed/s_o8dwzRlu4',
          duration: '28:30',
        },
      ],
    });

    // =====================================================
    // COURSE 5: Flutter Mobile Development (Mobile)
    // =====================================================
    const mobileCourse = await Course.create({
      title: 'Flutter Mobile Development',
      description: 'Build beautiful cross-platform mobile apps with Flutter and Dart. Learn widgets, state management, navigation, API integration, and deploy to both iOS and Android from a single codebase.',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      category: 'Mobile',
      instructor: 'Priya Sharma',
      createdBy: admin._id,
      lessons: [
        {
          title: 'Introduction to Flutter & Dart',
          type: 'video',
          content: 'https://www.youtube.com/embed/1ukSR1GRtMU',
          duration: '20:00',
        },
        {
          title: 'Flutter Widget System',
          type: 'note',
          content: `# Flutter Widget System

## Everything is a Widget

In Flutter, the entire UI is built using widgets. Widgets are immutable descriptions of the UI.

## Stateless vs Stateful Widgets

### StatelessWidget
No mutable state — use for static content:

\`\`\`dart
class Greeting extends StatelessWidget {
  final String name;
  const Greeting({required this.name});

  @override
  Widget build(BuildContext context) {
    return Text('Hello, $name!');
  }
}
\`\`\`

### StatefulWidget
Has mutable state — use for interactive content:

\`\`\`dart
class Counter extends StatefulWidget {
  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_count'),
        ElevatedButton(
          onPressed: () => setState(() => _count++),
          child: Text('Increment'),
        ),
      ],
    );
  }
}
\`\`\`

## Common Widgets
- \`Container\`, \`Row\`, \`Column\` — Layout
- \`Text\`, \`Icon\`, \`Image\` — Display
- \`ElevatedButton\`, \`TextField\` — Input`,
          duration: '15 min read',
        },
        {
          title: 'State Management with Provider',
          type: 'video',
          content: 'https://www.youtube.com/embed/d_m5csmrf7I',
          duration: '18:45',
        },
      ],
    });

    // =====================================================
    // COURSE 6: Advanced CSS & Animations (Frontend)
    // =====================================================
    const cssCourse = await Course.create({
      title: 'Advanced CSS & Animations',
      description: 'Master modern CSS including Flexbox, Grid, custom properties, animations, transitions, and responsive design. Learn to create stunning, performant UIs with pure CSS techniques.',
      thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800',
      category: 'Frontend',
      instructor: 'Olivia Martinez',
      createdBy: admin._id,
      lessons: [
        {
          title: 'CSS Grid & Flexbox Mastery',
          type: 'video',
          content: 'https://www.youtube.com/embed/rg7Fvvl3taU',
          duration: '24:00',
        },
        {
          title: 'CSS Custom Properties & Theming',
          type: 'note',
          content: `# CSS Custom Properties

## Defining Variables

\`\`\`css
:root {
  --primary: #6366f1;
  --bg-dark: #0f172a;
  --radius: 12px;
}

.card {
  background: var(--bg-dark);
  border-radius: var(--radius);
  color: var(--primary);
}
\`\`\`

## Dark Mode with Custom Properties

\`\`\`css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --text: #e2e8f0;
}

body {
  background: var(--bg);
  color: var(--text);
}
\`\`\`

## CSS Animations

\`\`\`css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animated {
  animation: slideUp 0.5s ease-out forwards;
}
\`\`\``,
          duration: '12 min read',
        },
        {
          title: 'CSS Transitions & Keyframes',
          type: 'video',
          content: 'https://www.youtube.com/embed/YszONjKpgg4',
          duration: '19:30',
        },
      ],
    });

    console.log('📚 6 Courses created');

    // =====================================================
    // QUIZZES
    // =====================================================

    const reactQuiz = await Quiz.create({
      title: 'React Fundamentals Quiz',
      course: reactCourse._id,
      questions: [
        {
          question: 'What is JSX?',
          options: ['A database query language', 'A JavaScript XML syntax extension', 'A CSS framework', 'A Node.js module'],
          correctAnswer: 1,
        },
        {
          question: 'Which hook is used to manage state in functional components?',
          options: ['useEffect', 'useContext', 'useState', 'useReducer'],
          correctAnswer: 2,
        },
        {
          question: 'What does the useEffect hook do?',
          options: ['Manages state', 'Handles side effects', 'Creates context', 'Renders components'],
          correctAnswer: 1,
        },
        {
          question: 'How do you pass data from parent to child component?',
          options: ['State', 'Props', 'Context', 'Refs'],
          correctAnswer: 1,
        },
        {
          question: 'What is the Virtual DOM?',
          options: [
            'The actual browser DOM',
            'A lightweight copy of the real DOM kept in memory',
            'A database for React',
            'A CSS rendering engine',
          ],
          correctAnswer: 1,
        },
      ],
    });

    const nodeQuiz = await Quiz.create({
      title: 'Node.js Masterclass Quiz',
      course: nodeCourse._id,
      questions: [
        {
          question: 'What is Node.js?',
          options: ['A frontend framework', 'A JavaScript runtime built on V8', 'A database', 'A CSS preprocessor'],
          correctAnswer: 1,
        },
        {
          question: 'Which module is used to create HTTP servers in Node.js?',
          options: ['fs', 'path', 'http', 'url'],
          correctAnswer: 2,
        },
        {
          question: 'What is middleware in Express?',
          options: [
            'A database driver',
            'A function with access to req, res, and next',
            'A frontend component',
            'A CSS processor',
          ],
          correctAnswer: 1,
        },
        {
          question: 'How do you handle asynchronous operations in Node.js?',
          options: ['Only callbacks', 'Only promises', 'Callbacks, promises, and async/await', 'Threads'],
          correctAnswer: 2,
        },
        {
          question: 'What does JWT stand for?',
          options: ['Java Web Token', 'JSON Web Token', 'JavaScript Web Transfer', 'JSON Web Transfer'],
          correctAnswer: 1,
        },
      ],
    });

    const mongoQuiz = await Quiz.create({
      title: 'MongoDB Deep Dive Quiz',
      course: mongoCourse._id,
      questions: [
        {
          question: 'What type of database is MongoDB?',
          options: ['Relational', 'Document-oriented NoSQL', 'Graph', 'Key-value'],
          correctAnswer: 1,
        },
        {
          question: 'What is a MongoDB collection equivalent to in SQL?',
          options: ['Database', 'Table', 'Row', 'Column'],
          correctAnswer: 1,
        },
        {
          question: 'Which Mongoose method finds a single document by ID?',
          options: ['find()', 'findOne()', 'findById()', 'search()'],
          correctAnswer: 2,
        },
        {
          question: 'What is embedding in MongoDB?',
          options: [
            'Linking documents via references',
            'Storing related data inside a single document',
            'Creating indexes',
            'Sharding data',
          ],
          correctAnswer: 1,
        },
        {
          question: 'What is the aggregation pipeline used for?',
          options: ['User authentication', 'Data transformation and analysis', 'File uploads', 'WebSocket connections'],
          correctAnswer: 1,
        },
      ],
    });

    const devopsQuiz = await Quiz.create({
      title: 'Docker & Kubernetes Quiz',
      course: devopsCourse._id,
      questions: [
        {
          question: 'What is Docker?',
          options: ['A programming language', 'A container platform', 'A database', 'A web server'],
          correctAnswer: 1,
        },
        {
          question: 'What file defines how a Docker image is built?',
          options: ['docker-compose.yml', 'package.json', 'Dockerfile', '.dockerignore'],
          correctAnswer: 2,
        },
        {
          question: 'What is Kubernetes used for?',
          options: ['Frontend development', 'Container orchestration', 'Database management', 'Code compilation'],
          correctAnswer: 1,
        },
        {
          question: 'What does "docker-compose up" do?',
          options: [
            'Deletes all containers',
            'Starts services defined in docker-compose.yml',
            'Builds a Dockerfile',
            'Pushes images to registry',
          ],
          correctAnswer: 1,
        },
        {
          question: 'What is a Kubernetes Pod?',
          options: [
            'A Docker image',
            'The smallest deployable unit in Kubernetes',
            'A network configuration',
            'A storage volume',
          ],
          correctAnswer: 1,
        },
      ],
    });

    const mobileQuiz = await Quiz.create({
      title: 'Flutter Development Quiz',
      course: mobileCourse._id,
      questions: [
        {
          question: 'What programming language does Flutter use?',
          options: ['JavaScript', 'Kotlin', 'Dart', 'Swift'],
          correctAnswer: 2,
        },
        {
          question: 'What is the basic building block of Flutter UI?',
          options: ['Components', 'Views', 'Widgets', 'Elements'],
          correctAnswer: 2,
        },
        {
          question: 'What is the difference between StatelessWidget and StatefulWidget?',
          options: [
            'StatelessWidget is faster',
            'StatefulWidget can manage mutable state',
            'They are the same',
            'StatelessWidget supports animations',
          ],
          correctAnswer: 1,
        },
        {
          question: 'Which method rebuilds the UI in a StatefulWidget?',
          options: ['rebuild()', 'refresh()', 'setState()', 'update()'],
          correctAnswer: 2,
        },
        {
          question: 'Flutter compiles to which type of code?',
          options: ['JavaScript', 'Native ARM code', 'Bytecode', 'HTML'],
          correctAnswer: 1,
        },
      ],
    });

    const cssQuiz = await Quiz.create({
      title: 'Advanced CSS Quiz',
      course: cssCourse._id,
      questions: [
        {
          question: 'What is CSS Grid used for?',
          options: ['Animations', 'Two-dimensional layouts', 'Font styling', 'Color management'],
          correctAnswer: 1,
        },
        {
          question: 'What is the syntax for a CSS custom property?',
          options: ['$variable', '@variable', '--variable', '#variable'],
          correctAnswer: 2,
        },
        {
          question: 'Which CSS property creates smooth transitions?',
          options: ['animation', 'transition', 'transform', 'translate'],
          correctAnswer: 1,
        },
        {
          question: 'What does "display: flex" do?',
          options: [
            'Hides the element',
            'Creates a flex container for one-dimensional layout',
            'Makes text bold',
            'Adds a border',
          ],
          correctAnswer: 1,
        },
        {
          question: 'How do you reference a CSS custom property?',
          options: ['use(--name)', 'var(--name)', '@name', '$name'],
          correctAnswer: 1,
        },
      ],
    });

    // Update courses with quiz references
    reactCourse.quizzes.push(reactQuiz._id);
    await reactCourse.save();

    nodeCourse.quizzes.push(nodeQuiz._id);
    await nodeCourse.save();

    mongoCourse.quizzes.push(mongoQuiz._id);
    await mongoCourse.save();

    devopsCourse.quizzes.push(devopsQuiz._id);
    await devopsCourse.save();

    mobileCourse.quizzes.push(mobileQuiz._id);
    await mobileCourse.save();

    cssCourse.quizzes.push(cssQuiz._id);
    await cssCourse.save();

    console.log('📝 6 Quizzes created');

    console.log('\n✅ Seed complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin login:  admin@learn.com / admin123');
    console.log('User login:   user@learn.com / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Courses: React, Node.js, MongoDB, Docker/K8s, Flutter, CSS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
