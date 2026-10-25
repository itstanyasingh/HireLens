import { ResumeData } from '../types/resumeBuilder';

export interface RolePreset {
  id: string;
  name: string;
  category: string;
  recommendedTemplate: 'executive-dark' | 'enhancv-two-column' | 'modern-clean' | 'classic-ats';
  accentColor: '#16B889' | '#1E3A8A' | '#4F46E5' | '#991B1B' | '#334155';
  data: ResumeData;
}

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: 'software-engineer',
    name: 'Senior Software Engineer',
    category: 'Engineering',
    recommendedTemplate: 'executive-dark',
    accentColor: '#16B889',
    data: {
      personal: {
        fullName: 'Alex Morgan',
        targetTitle: 'Senior Full Stack Engineer',
        email: 'alex.morgan@email.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexmorgan-dev',
        github: 'github.com/alexmorgan',
        website: 'alexmorgan.dev'
      },
      summary: 'Performance-driven Full Stack Engineer with 6+ years of experience architecting high-scale React, TypeScript, and Node.js systems. Proven record of cutting API latency by 35% and accelerating release velocity across distributed microservices.',
      keyAchievements: [
        {
          id: 'ach-1',
          title: 'Latency Optimization',
          metric: '35% Latency Drop',
          description: 'Engineered Redis caching layer for heavy SQL query endpoints, cutting median response time from 320ms to 45ms.'
        },
        {
          id: 'ach-2',
          title: 'User Scale & Uptime',
          metric: '45k+ Daily Users',
          description: 'Maintained 99.98% SLA across multi-region AWS infrastructure serving high-throughput enterprise traffic.'
        },
        {
          id: 'ach-3',
          title: 'Frontend Modernization',
          metric: '96 Lighthouse Score',
          description: 'Spearheaded migration to Next.js and Tailwind CSS, increasing core web vitals and client engagement by 32%.'
        }
      ],
      experience: [
        {
          id: 'exp-1',
          role: 'Senior Software Engineer',
          company: 'TechFlow Systems',
          dates: '2022 – Present',
          location: 'San Francisco, CA',
          bullets: [
            'Architected high-throughput RESTful microservices in Node.js/TypeScript serving 45,000+ daily active users with 99.98% uptime.',
            'Engineered Redis caching layer for heavy SQL query endpoints, cutting median response time from 320ms to 45ms.',
            'Built responsive React dashboard with modular state management, boosting daily active session time by 28%.'
          ]
        },
        {
          id: 'exp-2',
          role: 'Full Stack Engineer',
          company: 'Nexus Digital',
          dates: '2020 – 2022',
          location: 'Austin, TX',
          bullets: [
            'Spearheaded frontend migration to Next.js and Tailwind CSS, increasing Lighthouse performance score from 68 to 96.',
            'Integrated Stripe payment workflows and webhook reconciliation pipeline processing $1.2M in annual transactions.',
            'Authored automated unit and integration test suites in Jest/Playwright, boosting test coverage from 45% to 88%.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'B.S. in Computer Science',
          institution: 'University of California, Berkeley',
          year: '2016 – 2020',
          location: 'Berkeley, CA',
          honors: 'Cum Laude · Dean\'s Honors'
        }
      ],
      skills: [
        'React', 'TypeScript', 'Next.js', 'Node.js', 'Express', 'Python',
        'PostgreSQL', 'Redis', 'Docker', 'AWS (S3/EC2/Lambda)', 'REST APIs',
        'GraphQL', 'Tailwind CSS', 'CI/CD Pipelines', 'Vitest / Jest'
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'CloudQueue Open Source SDK',
          role: 'Creator & Maintainer',
          link: 'github.com/alexmorgan/cloudqueue',
          bullets: [
            'Authored lightweight distributed task queue library with 1,200+ GitHub stars.',
            'Zero dependencies, full TypeScript definitions, and automatic exponential backoff retry.'
          ]
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          year: '2023'
        }
      ],
      languages: [
        { id: 'lang-1', language: 'English', proficiency: 'Native', levelScore: 5 },
        { id: 'lang-2', language: 'Spanish', proficiency: 'Professional Working', levelScore: 4 }
      ]
    }
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst / Data Insights',
    category: 'Analytics',
    recommendedTemplate: 'executive-dark',
    accentColor: '#1E3A8A',
    data: {
      personal: {
        fullName: 'Violet Rodriguez',
        targetTitle: 'Business Analyst | Data Insights | Visualization',
        email: 'violet.rodriguez@email.com',
        phone: '+1 (555) 345-6789',
        location: 'Dallas, TX',
        linkedin: 'linkedin.com/in/violet-rodriguez-data',
        github: 'github.com/vrodriguez',
        website: ''
      },
      summary: 'Data-driven Business Analyst with 5+ years of experience transforming complex datasets into actionable executive insights. Expert in Power BI, SQL, and predictive modeling, delivering reporting pipelines that cut reconciliation time by 40%.',
      keyAchievements: [
        {
          id: 'ach-1',
          title: 'Revenue Enhancement',
          metric: '15% Revenue Lift',
          description: 'Identified client attrition drivers via cohort analysis, enabling sales teams to retain $420k in recurring revenue.'
        },
        {
          id: 'ach-2',
          title: 'Reporting Automation',
          metric: '40% Time Saved',
          description: 'Automated weekly executive reporting dashboards in Tableau, saving 16 analyst hours each sprint.'
        },
        {
          id: 'ach-3',
          title: 'Forecast Accuracy',
          metric: '94% Model Accuracy',
          description: 'Built multi-variable demand forecast model in Python, reducing inventory holding costs by 18%.'
        }
      ],
      experience: [
        {
          id: 'exp-1',
          role: 'Senior Business Analyst',
          company: 'Data Solutions Corp',
          dates: '2022 – Present',
          location: 'Dallas, TX',
          bullets: [
            'Collaborated with stakeholders to gather business requirements, leading to 40% increase in cross-functional project alignment.',
            'Developed 12+ interactive executive dashboards in Tableau, improving reporting accessibility by 50% across department leaders.',
            'Conducted SQL data pipeline audits to validate data integrity, slashing discrepancy resolution time from 4 days to 4 hours.'
          ]
        },
        {
          id: 'exp-2',
          role: 'Data Analyst',
          company: 'Innovative Analytics LLC',
          dates: '2019 – 2022',
          location: 'Fort Worth, TX',
          bullets: [
            'Analyzed consumer transaction data across 350k customer accounts, uncovering behavioral patterns that guided product revamp.',
            'Automated ETL pipelines in Python and PostgreSQL, eliminating manual CSV exports and increasing data freshness to real-time.',
            'Delivered quarterly presentations to VP-level stakeholders, aligning strategic OKRs with quantitative market benchmarks.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'B.B.A. in Information Systems',
          institution: 'University of Texas at Austin',
          year: '2015 – 2019',
          location: 'Austin, TX',
          honors: 'Beta Gamma Sigma Honor Society'
        }
      ],
      skills: [
        'Power BI', 'Tableau', 'SQL (PostgreSQL/Snowflake)', 'Python (Pandas/NumPy)',
        'Excel (VBA/PowerQuery)', 'Data Modeling', 'ETL Pipelines', 'A/B Testing',
        'Requirements Gathering', 'Cross-Functional Stakeholder Alignment'
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'Customer Lifetime Value Predictor',
          role: 'Lead Analyst',
          link: '',
          bullets: [
            'Engineered churn prediction pipeline achieving 89% precision, adopted by customer success teams nationwide.'
          ]
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'Certified Business Analysis Professional (CBAP)',
          issuer: 'IIBA',
          year: '2023'
        },
        {
          id: 'cert-2',
          name: 'Tableau Desktop Certified Specialist',
          issuer: 'Tableau',
          year: '2021'
        }
      ],
      languages: [
        { id: 'lang-1', language: 'English', proficiency: 'Native', levelScore: 5 },
        { id: 'lang-2', language: 'Spanish', proficiency: 'Bilingual / Native', levelScore: 5 }
      ]
    }
  },
  {
    id: 'product-manager',
    name: 'Technical Product Manager',
    category: 'Product',
    recommendedTemplate: 'enhancv-two-column',
    accentColor: '#4F46E5',
    data: {
      personal: {
        fullName: 'Vanessa Ford',
        targetTitle: 'Senior Product Manager | Growth & B2B Platforms',
        email: 'vanessa.ford@email.com',
        phone: '+1 (555) 456-7890',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/vanessaford-pm',
        github: '',
        website: 'vanessaford.co'
      },
      summary: 'Results-oriented Product Manager with 6+ years driving platform products from discovery to scale. Proven expertise in user telemetry, API monetization, and cross-functional agile leadership that lifted active conversion by 26%.',
      keyAchievements: [
        {
          id: 'ach-1',
          title: 'Product Growth',
          metric: '+$1.4M ARR Added',
          description: 'Launched self-serve enterprise tier with tiered usage billing, adding $1.4M ARR within 9 months of release.'
        },
        {
          id: 'ach-2',
          title: 'Funnel Optimization',
          metric: '26% Onboarding Lift',
          description: 'Redesigned user onboarding flow based on Hotjar user recordings and Mixpanel drop-off analytics.'
        },
        {
          id: 'ach-3',
          title: 'Feature Velocity',
          metric: '35% Faster Cycles',
          description: 'Introduced dual-track discovery and clear acceptance criteria, reducing sprint spillover by 35%.'
        }
      ],
      experience: [
        {
          id: 'exp-1',
          role: 'Senior Product Manager',
          company: 'ScaleMetric Inc',
          dates: '2021 – Present',
          location: 'San Francisco, CA',
          bullets: [
            'Spearheaded the developer platform roadmap, managing a dedicated squad of 11 engineers and 2 product designers.',
            'Conducted 45+ customer discovery interviews with enterprise clients, identifying unmet workflow automation needs.',
            'Orchestrated phased beta rollouts and canary releases, driving adoption to 12,000+ teams with 94% CSAT score.'
          ]
        },
        {
          id: 'exp-2',
          role: 'Product Manager',
          company: 'CloudVentures',
          dates: '2018 – 2021',
          location: 'Seattle, WA',
          bullets: [
            'Led integration partnerships with Slack, Microsoft Teams, and Jira, increasing ecosystem stickiness by 34%.',
            'Defined sprint backlogs, PRDs, and quantitative success metrics for core notification and alert dispatch engine.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'B.S. in Industrial Engineering',
          institution: 'University of Washington',
          year: '2014 – 2018',
          location: 'Seattle, WA',
          honors: 'Magna Cum Laude'
        }
      ],
      skills: [
        'Product Strategy', 'Roadmapping', 'Agile / Scrum', 'User Discovery',
        'Mixpanel / Amplitude', 'SQL Data Querying', 'A/B Testing Frameworks',
        'API Product Management', 'Go-To-Market Execution', 'Jira / Linear'
      ],
      projects: [],
      certifications: [
        {
          id: 'cert-1',
          name: 'Certified Scrum Product Owner (CSPO)',
          issuer: 'Scrum Alliance',
          year: '2021'
        }
      ],
      languages: [
        { id: 'lang-1', language: 'English', proficiency: 'Native', levelScore: 5 },
        { id: 'lang-2', language: 'French', proficiency: 'Conversational', levelScore: 3 }
      ]
    }
  },
  {
    id: 'operations-executive',
    name: 'Operations & Strategy Manager',
    category: 'Operations',
    recommendedTemplate: 'modern-clean',
    accentColor: '#334155',
    data: {
      personal: {
        fullName: 'Johnatan Alexander Carrillo',
        targetTitle: 'Operations Manager & Strategic Execution Lead',
        email: 'johnatan.carrillo@email.com',
        phone: '+1 (555) 789-0123',
        location: 'Austin, TX',
        linkedin: 'linkedin.com/in/johnatan-carrillo-ops',
        github: '',
        website: ''
      },
      summary: 'High-impact Operations Manager with 7+ years optimizing supply chain logistics and fulfillment workflows. Expert in Kaizen, Lean Six Sigma, and cost modeling, delivering $1.5M in operational savings while maintaining 99.8% quality standards.',
      keyAchievements: [
        {
          id: 'ach-1',
          title: 'Productivity Gain',
          metric: '35% YoY Productivity',
          description: 'Overhauled fulfillment line dispatch processes, lifting total units processed per hour by 35%.'
        },
        {
          id: 'ach-2',
          title: 'Quality Benchmark',
          metric: '99.8% SLA Quality',
          description: 'Implemented automated QA checkpoints, reducing defect return rates to record company lows.'
        },
        {
          id: 'ach-3',
          title: 'Cost Reduction',
          metric: '$1.5M Annual Savings',
          description: 'Renegotiated 3PL freight agreements and optimized warehouse slotting algorithms.'
        }
      ],
      experience: [
        {
          id: 'exp-1',
          role: 'Senior Operations Manager',
          company: 'Apex Distribution Group',
          dates: '2021 – Present',
          location: 'Austin, TX',
          bullets: [
            'Oversaw day-to-day operations across 3 regional distribution hubs with 140+ team members and $18M operating budget.',
            'Pioneered Lean continuous improvement sprints that reduced dispatch turnaround from 48 hours to same-day delivery.',
            'Collaborated with HR to revamp employee onboarding and safety protocols, decreasing lost-time incidents by 60%.'
          ]
        },
        {
          id: 'exp-2',
          role: 'Logistics Coordinator',
          company: 'OmniFreight Global',
          dates: '2017 – 2021',
          location: 'Dallas, TX',
          bullets: [
            'Managed inbound freight scheduling and customs clearance documentation across 50+ international suppliers.',
            'Built real-time inventory tracking dashboard using SQL and Tableau, preventing overstocking holding costs.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'B.S. in Business Administration',
          institution: 'Texas A&M University',
          year: '2013 – 2017',
          location: 'College Station, TX'
        }
      ],
      skills: [
        'Operations Management', 'Supply Chain Optimization', 'Lean Six Sigma',
        'Vendor Management', 'Cost-Benefit Analysis', 'Warehouse Automation',
        'Cross-Functional Leadership', 'OSHA Compliance', 'ERP Systems (SAP/NetSuite)'
      ],
      projects: [],
      certifications: [
        {
          id: 'cert-1',
          name: 'Six Sigma Green Belt',
          issuer: 'ASQ',
          year: '2020'
        }
      ],
      languages: [
        { id: 'lang-1', language: 'English', proficiency: 'Native', levelScore: 5 },
        { id: 'lang-2', language: 'Italian', proficiency: 'Intermediate', levelScore: 3 }
      ]
    }
  }
];

export const EXPERIENCE_LEVEL_PROFILES = [
  {
    id: 'senior-executive',
    title: 'Senior & Executive',
    description: 'Concise one-page summary highlighting scale, multi-million P&L, leadership, and high-impact metric bullets.',
    focusTips: [
      'Focus on revenue growth, operational scale, and team expansion',
      'Replace execution tasks with executive action verbs (Spearheaded, Architected, Steered)',
      'Highlight 2-3 prominent quantified achievements at the top of the resume'
    ]
  },
  {
    id: 'mid-level',
    title: 'Entry- & Mid-Level',
    description: 'Highlights technical competence, hands-on project delivery, verifiable credentials, and rapid learning velocity.',
    focusTips: [
      'Spotlight technical stack competencies and concrete deliverables',
      'Include capstone projects, open-source work, and specialized certifications',
      'Emphasize collaboration, sprint participation, and velocity improvements'
    ]
  },
  {
    id: 'career-changers',
    title: 'Career Changers',
    description: 'Emphasizes transferable skills, domain crossover, accelerated learning milestones, and adaptable problem-solving.',
    focusTips: [
      'Group competencies by functional capabilities rather than strict historical job titles',
      'Demonstrate fast upskilling through completed certifications and portfolio builds',
      'Lead with a tailored professional summary explaining the strategic value of your cross-disciplinary background'
    ]
  }
];
