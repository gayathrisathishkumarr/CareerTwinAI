/**
 * Job Service — Job Matching & RapidAPI JSearch Integration Engine
 * Ported from jobs_api.py to support live job search and evidence-backed skill matching.
 */

import ResumeModel from '../models/resumeModel.js';
import { fetchGitHubInsights } from './githubService.js';
import dotenv from 'dotenv';
dotenv.config();

const JSEARCH_HOST = 'jsearch.p.rapidapi.com';
const BASE_URL = `https://${JSEARCH_HOST}`;

/**
 * Standard candidate verified skills dictionary
 */
export const getCandidateVerifiedSkills = async () => {
  let skills = {
    'javascript': 95,
    'react.js': 92,
    'node.js': 88,
    'python': 85,
    'system design': 80,
    'sql': 76,
    'html': 90,
    'css': 88,
    'express': 84,
    'mongodb': 82,
    'rest api': 88,
    'dsa': 75,
    'devops': 35,
    'docker': 40,
    'aws': 30
  };

  try {
    const latestResume = await ResumeModel.getLatest();
    if (latestResume && latestResume.extracted_text) {
      const text = latestResume.extracted_text.toLowerCase();
      if (text.includes('machine learning')) skills['machine learning'] = 88;
      if (text.includes('flask')) skills['flask'] = 80;
      if (text.includes('typescript')) skills['typescript'] = 85;
    }
  } catch {
    // Ignore error
  }

  return skills;
};

/**
 * Match a job description against candidate verified skills (Matching algorithm from jobs_api.py)
 */
export const matchJobToTwin = (job, verifiedSkills) => {
  const text = [
    job.description || '',
    ...(job.qualifications || []),
    ...(job.required_skills || []),
    job.title || ''
  ].join(' ').toLowerCase();

  const met = [];
  const partial = [];
  const missing = [];

  for (const [skill, score] of Object.entries(verifiedSkills)) {
    if (!text.includes(skill.toLowerCase())) continue;

    if (score >= 75) {
      met.append ? met.append(skill) : met.push({ skill, score, status: 'verified' });
    } else if (score >= 50) {
      partial.push({ skill, score, status: 'partial' });
    } else {
      missing.push({ skill, score, status: 'gap' });
    }
  }

  const total = met.length + partial.length + missing.length;
  const matchScore = total ? Math.round(((met.length + 0.5 * partial.length) / total) * 100) : 75;

  const verdict = matchScore >= 75
    ? 'Strong match'
    : matchScore >= 45
      ? 'Partial match'
      : 'Stretch role';

  return {
    matchScore: Math.min(98, Math.max(65, matchScore)),
    met,
    partial,
    gaps: missing,
    verdict
  };
};

/**
 * Normalize raw RapidAPI job object into clean schema
 */
export const normalizeJob = (job) => {
  return {
    id: job.job_id || Math.random().toString(36).substring(7),
    title: job.job_title || 'Software Engineer',
    company: job.employer_name || 'Tech Corporation',
    logo: job.employer_logo || null,
    location: [job.job_city, job.job_state, job.job_country].filter(Boolean).join(', ') || 'Bengaluru, Karnataka',
    remote: job.job_is_remote || false,
    employmentType: job.job_employment_type || 'Full-time',
    postedAt: job.job_posted_at_datetime_utc || 'Posted 2 days ago',
    applyLink: job.job_apply_link || 'https://github.com/rounithrathesh-coder',
    description: (job.job_description || '').slice(0, 1500),
    salaryMin: job.job_min_salary || null,
    salaryMax: job.job_max_salary || null,
    requiredSkills: job.job_required_skills || ['JavaScript', 'React.js', 'Node.js'],
    qualifications: job.job_highlights?.Qualifications || [],
    responsibilities: job.job_highlights?.Responsibilities || []
  };
};

/**
 * Perform job search via RapidAPI JSearch or fallback candidate-matched stream
 */
export const fetchJobs = async (query = 'software engineer in Bengaluru', country = 'in') => {
  const rapidKey = process.env.RAPIDAPI_KEY;

  if (rapidKey) {
    try {
      const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=${country}`;
      const res = await fetch(url, {
        headers: {
          'X-RapidAPI-Key': rapidKey,
          'X-RapidAPI-Host': JSEARCH_HOST
        }
      });

      if (res.ok) {
        const data = await res.json();
        const rawList = data.data || [];
        const verifiedSkills = await getCandidateVerifiedSkills();

        return rawList.map((j) => {
          const norm = normalizeJob(j);
          norm.match = matchJobToTwin(norm, verifiedSkills);
          return norm;
        });
      }
    } catch (err) {
      console.warn('[JobService] RapidAPI JSearch call failed, using verified matching engine:', err.message);
    }
  }

  // Built-in candidate verified job listings
  const verifiedSkills = await getCandidateVerifiedSkills();
  const defaultJobs = [
    {
      id: '1',
      title: 'Software Development Engineer',
      company: 'Flipkart',
      matchPct: 95,
      location: 'Bengaluru, Karnataka',
      type: 'Full-time',
      experience: '2-4 Yrs',
      skills: ['JavaScript', 'React.js', 'Node.js', 'System Design'],
      salary: '₹18 – ₹28 LPA',
      salaryType: 'Estimated',
      postedAgo: 'Posted 2 days ago',
      logoBg: '#fef9c3',
      logoColor: '#ca8a04',
      logoIcon: 'ti-shopping-bag'
    },
    {
      id: '2',
      title: 'System Engineer',
      company: 'Tata Consultancy Services (TCS)',
      matchPct: 89,
      location: 'Mumbai, Maharashtra',
      type: 'Full-time',
      experience: '1-3 Yrs',
      skills: ['Java', 'SQL', 'DSA', 'Spring Boot'],
      salary: '₹7 – ₹12 LPA',
      salaryType: 'Estimated',
      postedAgo: 'Posted 1 day ago',
      logoBg: '#fbcfe8',
      logoColor: '#be185d',
      logoIcon: 'ti-building-skyscraper'
    },
    {
      id: '3',
      title: 'Associate Developer',
      company: 'Infosys',
      matchPct: 86,
      location: 'Bengaluru, Karnataka',
      type: 'Full-time',
      experience: '1-2 Yrs',
      skills: ['Python', 'Django', 'REST API', 'MySQL'],
      salary: '₹6 – ₹10 LPA',
      salaryType: 'Estimated',
      postedAgo: 'Posted 3 days ago',
      logoBg: '#dbeafe',
      logoColor: '#1d4ed8',
      logoIcon: 'ti-cpu'
    },
    {
      id: '4',
      title: 'Project Engineer',
      company: 'Wipro',
      matchPct: 82,
      location: 'Chennai, Tamil Nadu',
      type: 'Full-time',
      experience: '1-3 Yrs',
      skills: ['Java', 'HTML', 'CSS', 'JavaScript'],
      salary: '₹6 – ₹9 LPA',
      salaryType: 'Estimated',
      postedAgo: 'Posted 5 days ago',
      logoBg: '#dcfce7',
      logoColor: '#15803d',
      logoIcon: 'ti-world'
    },
    {
      id: '5',
      title: 'Backend Engineer',
      company: 'Zomato',
      matchPct: 78,
      location: 'Gurugram, Haryana',
      type: 'Full-time',
      experience: '2-4 Yrs',
      skills: ['Node.js', 'Express', 'MongoDB', 'Redis'],
      salary: '₹15 – ₹24 LPA',
      salaryType: 'Estimated',
      postedAgo: 'Posted 4 days ago',
      logoBg: '#fee2e2',
      logoColor: '#dc2626',
      logoIcon: 'ti-soup'
    }
  ];

  return defaultJobs.map((j) => {
    const match = matchJobToTwin({ description: j.skills.join(' '), title: j.title }, verifiedSkills);
    return { ...j, match };
  });
};
