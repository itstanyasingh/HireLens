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
    id: 'job-swe-benchmark',
    title: 'Backend Software Engineer (Benchmark Spec)',
    company: 'Fintech Infrastructure Spec',
    location: 'Remote / US',
    type: 'Full-time Benchmark',
    salary: 'Industry Standard Range',
    tags: ['Backend', 'Python', 'SQL', 'Microservices', 'AWS'],
    requiredSkills: ['Python', 'SQL', 'REST API', 'PostgreSQL', 'Docker', 'AWS'],
    preferredSkills: ['Redis', 'Kubernetes', 'CI/CD', 'System Design'],
    education: 'Bachelor degree in Computer Science or equivalent',
    description: `Role Overview:
Fintech infrastructure role requiring high-volume distributed backend services and APIs.

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
    id: 'job-fullstack-benchmark',
    title: 'Full Stack Engineer (Benchmark Spec)',
    company: 'Web Platform Spec',
    location: 'Remote',
    type: 'Full-time Benchmark',
    salary: 'Industry Standard Range',
    tags: ['React', 'TypeScript', 'Node.js', 'Tailwind', 'Vite'],
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Tailwind CSS', 'REST API'],
    preferredSkills: ['Next.js', 'GraphQL', 'Jest', 'Serverless'],
    education: 'Bachelor in CS or equivalent field experience',
    description: `Role Overview:
Developer platform role building modern web applications, high-performance interfaces, and serverless runtime systems.

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
    id: 'job-ml-benchmark',
    title: 'Machine Learning Engineer (Benchmark Spec)',
    company: 'Applied ML Research Spec',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time Benchmark',
    salary: 'Industry Standard Range',
    tags: ['Python', 'PyTorch', 'LLMs', 'FastAPI', 'Docker'],
    requiredSkills: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'Git', 'SQL'],
    preferredSkills: ['Transformers', 'Vector DBs', 'CUDA', 'AWS'],
    education: 'Degree in Computer Science, Data Science or AI',
    description: `Role Overview:
Applied AI engineering role building robust data pipelines, model evaluation harnesses, and inference APIs.

Responsibilities:
• Implement data preprocessing, tokenization, and model evaluation pipelines in PyTorch.
• Build API endpoints using FastAPI for internal LLM benchmarking tools.
• Optimize model inference latency and containerized deployments.

Requirements:
• Hands-on proficiency with Python, PyTorch, and Linux environments.
• Experience building RESTful APIs with FastAPI or Flask.
• Solid background in vector databases and model evaluation metrics.`
  },
  {
    id: 'job-pm-benchmark',
    title: 'Product Manager (Benchmark Spec)',
    company: 'SaaS Workflow Tools Spec',
    location: 'Remote',
    type: 'Full-time Benchmark',
    salary: 'Industry Standard Range',
    tags: ['Product Strategy', 'Figma', 'Agile', 'Analytics', 'SQL'],
    requiredSkills: ['Product Strategy', 'Figma', 'Agile', 'SQL', 'A/B Testing'],
    preferredSkills: ['Mixpanel', 'Jira', 'Developer Tools'],
    education: 'Bachelor degree or equivalent experience',
    description: `Role Overview:
Modern issue tracking and project management product leadership role.

Responsibilities:
• Define product requirements, user flows, and roadmap features for integrations.
• Work directly with engineering and design to ship polished software experiences.
• Analyze user churn, activation funnels, and customer feedback.

Requirements:
• 3+ years of product management experience shipping technical software products.
• Proven ability to translate complex user workflows into intuitive specifications.
• Strong data analysis skills using SQL and product analytics platforms.`
  }
];
