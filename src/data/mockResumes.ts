export interface SampleResume {
  id: string;
  title: string;
  role: string;
  fileName: string;
  resumeText: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'sample-swe',
    title: 'Software Engineer',
    role: 'Full Stack & Backend Developer',
    fileName: 'Tanya_Singh_Resume.pdf',
    resumeText: `Tanya Singh
San Francisco, CA | tanya.singh@email.com | (555) 392-8102 | linkedin.com/in/tanyasingh | github.com/tanyasingh

PROFESSIONAL SUMMARY
Results-driven Full Stack Software Engineer with 3+ years of experience designing, building, and scaling modern web applications and microservices. Proficient in React, Node.js, Python, TypeScript, and SQL databases. Passionate about developer tooling, performance optimization, and clean architecture.

TECHNICAL SKILLS
Languages: JavaScript (ES6+), TypeScript, Python, C++, Java, SQL, HTML5, CSS3
Frameworks & Libraries: React, Node.js, Express, FastAPI, Redux Toolkit, Tailwind CSS
Databases & Cloud: PostgreSQL, MongoDB, MySQL, Redis, AWS (S3, EC2), Docker, Git
Methodologies: Agile/Scrum, CI/CD, Unit Testing (Jest), REST APIs, Microservices

WORK EXPERIENCE
Apex Software Solutions — Full Stack Developer
June 2024 – Present | San Francisco, CA
• Worked on a website using React and Node.js.
• Engineered responsive user interface with React 19 and Tailwind CSS, improving client-side load time by 32%.
• Built RESTful API endpoints with Express and PostgreSQL to serve over 150,000 active monthly user requests.
• Implemented JWT authentication and role-based access control (RBAC) across 12 microservices.
• Assisted in database maintenance and queries for customer records.

Horizon Tech Labs — Software Engineering Intern
May 2023 – May 2024 | San Jose, CA
• Developed a automated Python data scraper to ingest real-time market data into MongoDB.
• Responsible for writing unit tests using Jest and PyTest, increasing overall code test coverage to 88%.
• Refactored legacy monolithic backend modules into lightweight Docker containers.
• Participated in daily Agile standups, code reviews, and sprint planning sessions.

PROJECTS
HireLens Resume Analyzer | React, TypeScript, Express, Gemini AI
• Built a full-stack AI resume checking platform featuring automated ATS evaluation, keyword matching, and job recommendation scoring.
• Implemented server-side Gemini API integration for real-time document analysis and bullet point enhancement.

CloudMetrics Monitoring Dashboard | Node.js, Express, Redis, Chart.js
• Created a real-time server health monitoring dashboard processing 5,000 metrics per second with Redis pub/sub.

EDUCATION
University of California, Berkeley — B.S. in Computer Science
Graduated May 2024 | GPA: 3.8 / 4.0`
  },
  {
    id: 'sample-pm',
    title: 'Product Manager',
    role: 'SaaS Product Lead',
    fileName: 'Alex_Chen_Product_Manager.pdf',
    resumeText: `Alex Chen
New York, NY | alex.chen@email.com | (555) 819-2041 | linkedin.com/in/alexchenpm

PROFESSIONAL SUMMARY
Data-informed Senior Product Manager with 5+ years driving end-to-end B2B SaaS product lifecycle from discovery to scale. Proven track record of launching AI-powered features, optimizing user onboarding funnels, and aligning engineering with executive strategy.

SKILLS & CORE COMPETENCIES
Product Strategy: Roadmap Planning, User Research, Wireframing, A/B Testing, Feature Prioritization
Technical Tools: Figma, Jira, Mixpanel, SQL, Amplitude, Notion, Postman, Tableau
Methodologies: Scrum, Agile Development, OKRs, Customer Discovery, Product Analytics

EXPERIENCE
SaaSMetrics Inc — Product Manager
Jan 2023 – Present | New York, NY
• Led cross-functional team of 8 engineers and 2 designers to launch self-serve enterprise analytics platform.
• Increased user activation rate by 24% by redesigning onboarding workflow based on cohort retention metrics.
• Conducted 40+ customer interviews and synthesized user feedback into high-priority roadmap initiatives.
• Handled sprint planning and backlog grooming sessions.

NextGen Digital — Associate Product Manager
June 2021 – Dec 2022 | Boston, MA
• Managed product requirements documents (PRDs) for mobile app payment flow processing $12M annually.
• Collaborated with UX team to conduct usability testing and reduce checkout drop-off rate by 18%.
• Analyzed feature adoption trends using Amplitude and SQL queries.

EDUCATION
Columbia University — B.A. in Economics & Data Science
Graduated May 2021`
  },
  {
    id: 'sample-ds',
    title: 'Data Scientist / ML Engineer',
    role: 'Machine Learning Specialist',
    fileName: 'Maya_Patel_Data_Science.pdf',
    resumeText: `Maya Patel
Seattle, WA | maya.patel@email.com | (555) 902-1144 | linkedin.com/in/mayapatelds | github.com/mayapatel

PROFESSIONAL SUMMARY
Machine Learning Engineer with 4 years of experience building end-to-end predictive models, NLP algorithms, and computer vision pipelines. Skilled in PyTorch, TensorFlow, Scikit-learn, Python, and SQL.

TECHNICAL SKILLS
Languages & Frameworks: Python, R, SQL, PyTorch, TensorFlow, Scikit-Learn, Pandas, NumPy, FastAPI
Data & Infrastructure: PostgreSQL, Snowflake, Spark, Docker, AWS S3, MLflow, Git
ML Domains: NLP, LLM Fine-tuning, Time Series Analysis, Feature Engineering, Classification

EXPERIENCE
DataIQ Analytics — Machine Learning Engineer
Aug 2023 – Present | Seattle, WA
• Developed customer churn prediction model using Gradient Boosting (XGBoost), improving precision by 19%.
• fine-tuned LLM embeddings for enterprise semantic search over 2M internal documents using PyTorch.
• Worked on data pipelines with Python.

EDUCATION
University of Washington — M.S. in Data Science & Machine Learning (2023)`
  }
];
