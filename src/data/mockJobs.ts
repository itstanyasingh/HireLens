export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  education: string;
}

export const MOCK_JOBS: JobPosting[] = [
  {
    id: 'job-swe-stripe',
    title: 'Backend Software Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    salary: '$145,000 - $180,000',
    tags: ['Backend', 'Python', 'SQL', 'Microservices', 'AWS'],
    requiredSkills: ['Python', 'SQL', 'REST API', 'PostgreSQL', 'Docker', 'AWS'],
    preferredSkills: ['Redis', 'Kubernetes', 'CI/CD', 'System Design'],
    education: 'Bachelor degree in Computer Science or equivalent',
    description: `About Stripe:
Stripe is a financial infrastructure platform for businesses. Millions of companies—from the world's largest enterprises to the most ambitious startups—use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.

Responsibilities:
• Architect, build, and maintain high-volume distributed backend services and APIs.
• Optimize SQL queries and database schemas for high-concurrency payment transactions.
• Collaborate with security, infra, and product engineering teams.

Requirements:
• 2+ years of software engineering experience in Python, Java, or C++.
• Strong background in relational databases (PostgreSQL, MySQL) and cache layers (Redis).
• Familiarity with containerization (Docker) and cloud deployments (AWS or GCP).`
  },
  {
    id: 'job-fullstack-vercel',
    title: 'Full Stack Engineer (React / Node)',
    company: 'Vercel',
    location: 'Remote',
    type: 'Full-time',
    salary: '$135,000 - $170,000',
    tags: ['React', 'TypeScript', 'Node.js', 'Tailwind', 'Vite'],
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Tailwind CSS', 'REST API'],
    preferredSkills: ['Next.js', 'GraphQL', 'Jest', 'Serverless'],
    education: 'Bachelor in CS or equivalent field experience',
    description: `About Vercel:
Vercel is the developer platform for modern web applications. We build tools that empower developers to create fast, scalable, and beautiful websites.

Responsibilities:
• Build high-performance frontend interfaces in React and TypeScript.
• Develop Node.js serverless functions and backend services.
• Ensure outstanding UI/UX design fidelity, responsive behavior, and accessibility.

Requirements:
• 3+ years experience with modern JavaScript, React, and Node.js.
• Expert understanding of CSS/Tailwind, state management, and browser performance.
• Strong passion for developer experience and clean API design.`
  },
  {
    id: 'job-ml-anthropic',
    title: 'Machine Learning Engineer Intern / Junior',
    company: 'Anthropic',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$150,000 - $190,000',
    tags: ['Python', 'PyTorch', 'LLMs', 'FastAPI', 'Docker'],
    requiredSkills: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'Git', 'SQL'],
    preferredSkills: ['Transformers', 'Vector DBs', 'CUDA', 'AWS'],
    education: 'Degree in Computer Science, Data Science or AI',
    description: `About Anthropic:
Anthropic is an AI safety and research company building reliable, interpretable, and steerable AI systems.

Responsibilities:
• Implement data preprocessing, tokenization, and model evaluation pipelines in PyTorch.
• Build API endpoints using FastAPI for internal LLM benchmarking tools.
• Optimize model inference latency and containerized deployments.`
  },
  {
    id: 'job-pm-linear',
    title: 'Product Manager — Developer Tools',
    company: 'Linear',
    location: 'Remote',
    type: 'Full-time',
    salary: '$150,000 - $185,000',
    tags: ['Product Strategy', 'Figma', 'Agile', 'Analytics', 'SQL'],
    requiredSkills: ['Product Strategy', 'Figma', 'Agile', 'SQL', 'A/B Testing'],
    preferredSkills: ['Mixpanel', 'Jira', 'Developer Tools'],
    education: 'Bachelor degree or equivalent experience',
    description: `About Linear:
Linear is a modern issue tracking and project management tool designed for high-performing software teams.

Responsibilities:
• Define product requirements, user flows, and roadmap features for Linear integrations.
• Work directly with engineering and design to ship polished software experiences.
• Analyze user churn, activation funnels, and customer feedback.`
  }
];
