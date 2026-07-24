/**
 * Twin Profile Service
 * Consumes structured resume analysis JSON and deterministically generates
 * a high-level Career Twin profile with scores, insights, gaps, and recommendations.
 */

export class TwinProfileService {
  static generateProfile(analysisData = {}) {
    const personal = analysisData.personal || {};
    const education = analysisData.education || [];
    const skillsObj = analysisData.skills || {};
    const experience = analysisData.experience || [];
    const projects = analysisData.projects || [];
    const certifications = analysisData.certifications || [];
    const achievements = analysisData.achievements || [];

    // All extracted skills combined
    const allSkills = Array.from(new Set([
      ...(skillsObj.programmingLanguages || []),
      ...(skillsObj.frameworks || []),
      ...(skillsObj.libraries || []),
      ...(skillsObj.databases || []),
      ...(skillsObj.tools || []),
      ...(skillsObj.cloud || [])
    ]));

    // 1. Primary Domain Determination
    const primaryDomain = this.determinePrimaryDomain(skillsObj, projects);

    // 2. Headline Generation
    const headline = this.generateHeadline(primaryDomain, allSkills, education, experience);

    // 3. Career Stage
    const careerStage = this.determineCareerStage(education, experience);

    // 4. Experience Level
    const experienceLevel = this.determineExperienceLevel(experience, projects, allSkills);

    // 5. Top 5 Skills
    const topSkills = allSkills.slice(0, 5);

    // 6. Professional Summary (2-3 sentences)
    const summary = this.generateSummary(personal, headline, primaryDomain, allSkills, projects, education);

    // 7. Strengths Inference
    const strengths = this.inferStrengths(allSkills, projects, experience, education, personal, achievements);

    // 8. Skill Gaps Inference
    const skillGaps = this.inferSkillGaps(primaryDomain, allSkills);

    // 9. Recommended Roles
    const recommendedRoles = this.recommendRoles(primaryDomain, allSkills);

    // 10. Career Readiness Score (0-100)
    const careerReadiness = this.calculateCareerReadiness({
      projectsCount: projects.length,
      skillsCount: allSkills.length,
      experienceCount: experience.length,
      certificationsCount: certifications.length,
      educationCount: education.length
    });

    // 11. Confidence Score (0-100) based on completeness
    const confidence = this.calculateConfidence({
      hasName: Boolean(personal.fullName),
      hasEmail: Boolean(personal.email),
      hasSkills: allSkills.length > 0,
      hasEducation: education.length > 0,
      hasProjects: projects.length > 0,
      hasExperience: experience.length > 0
    });

    return {
      headline,
      careerStage,
      experienceLevel,
      primaryDomain,
      summary,
      topSkills,
      strengths,
      skillGaps,
      recommendedRoles,
      careerReadiness,
      confidence
    };
  }

  static determinePrimaryDomain(skillsObj, projects) {
    const counts = {
      'Artificial Intelligence': (skillsObj.libraries || []).filter(s => ['TensorFlow', 'PyTorch', 'Keras', 'Scikit-Learn', 'OpenCV'].includes(s)).length,
      'Data Science': (skillsObj.libraries || []).filter(s => ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-Learn'].includes(s)).length,
      'Web Development': (skillsObj.frameworks || []).filter(s => ['React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express', 'Django'].includes(s)).length,
      'Backend Development': (skillsObj.databases || []).length + (skillsObj.programmingLanguages || []).filter(s => ['Python', 'Java', 'Go', 'Rust', 'C++', 'SQL'].includes(s)).length,
      'Frontend Development': (skillsObj.frameworks || []).filter(s => ['React', 'Vue', 'Angular', 'Svelte'].includes(s)).length + (skillsObj.programmingLanguages || []).filter(s => ['HTML', 'CSS', 'JavaScript', 'TypeScript'].includes(s)).length,
      'Cloud Computing': (skillsObj.cloud || []).length + (skillsObj.tools || []).filter(s => ['Docker', 'Kubernetes', 'Jenkins'].includes(s)).length
    };

    let highest = 'Software Engineering';
    let maxCount = 0;
    for (const [domain, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        highest = domain;
      }
    }
    return highest;
  }

  static generateHeadline(domain, topSkills, education, experience) {
    if (domain === 'Artificial Intelligence') return 'AI & Machine Learning Engineer';
    if (domain === 'Data Science') return 'Data Analyst & ML Specialist';
    if (domain === 'Frontend Development') return 'Frontend Web Developer';
    if (domain === 'Backend Development') return 'Backend & Systems Engineer';
    if (domain === 'Web Development') return 'Full Stack Web Developer';
    if (domain === 'Cloud Computing') return 'Cloud & DevOps Engineer';
    if (education.some(e => e.degree && e.degree.toLowerCase().includes('computer science'))) {
      return 'Software Engineering Scholar & Developer';
    }
    return topSkills.length > 0 ? `${topSkills[0]} Developer & Specialist` : 'Software Engineer';
  }

  static determineCareerStage(education, experience) {
    const expCount = experience.length;
    const isStudent = education.some(e => e.graduationYear && parseInt(e.graduationYear, 10) >= new Date().getFullYear());

    if (isStudent && expCount === 0) return 'Student';
    if (expCount === 0) return 'Fresher';
    if (expCount <= 2) return 'Early Career';
    if (expCount <= 5) return 'Mid Level';
    return 'Senior';
  }

  static determineExperienceLevel(experience, projects, skills) {
    const score = (experience.length * 2) + projects.length + Math.floor(skills.length / 3);
    if (score >= 8) return 'Advanced';
    if (score >= 4) return 'Intermediate';
    return 'Beginner';
  }

  static generateSummary(personal, headline, domain, skills, projects, education) {
    const name = personal.fullName || 'The candidate';
    const top3 = skills.slice(0, 3).join(', ') || 'modern software technologies';
    const degree = education[0] ? education[0].degree : 'Computer Science';

    return `${name} is an aspiring ${headline} with expertise in ${top3}. Grounded in ${degree}, they have built practical work in ${domain}. Focused on continuous technical growth and shipping high-impact software.`;
  }

  static inferStrengths(skills, projects, experience, education, personal, achievements) {
    const strengths = [];
    if (skills.length >= 5) strengths.push('Strong programming foundation');
    if (projects.length >= 2) strengths.push('Multiple technical projects completed');
    if (skills.length >= 7) strengths.push('Good technology diversity');
    if (personal.gitHub) strengths.push('Active GitHub presence');
    if (education.length > 0) strengths.push('Solid academic background');
    if (achievements.length > 0) strengths.push('Demonstrated competitive achievements');
    if (strengths.length === 0) strengths.push('Eager to learn and expand technical skills');
    return strengths;
  }

  static inferSkillGaps(domain, skills) {
    const set = new Set(skills.map(s => s.toLowerCase()));
    const gaps = [];

    if (domain === 'Frontend Development' || domain === 'Web Development') {
      if (!set.has('typescript')) gaps.push('TypeScript');
      if (!set.has('next.js') && !set.has('nextjs')) gaps.push('Next.js');
    }
    if (domain === 'Backend Development' || domain === 'Software Engineering') {
      if (!set.has('docker')) gaps.push('Docker');
      if (!set.has('redis')) gaps.push('Redis');
      if (!set.has('aws')) gaps.push('AWS / Cloud Infrastructure');
    }
    if (domain === 'Artificial Intelligence' || domain === 'Data Science') {
      if (!set.has('pytorch')) gaps.push('PyTorch');
      if (!set.has('docker')) gaps.push('MLOps / Docker');
    }

    if (gaps.length === 0) gaps.push('System Architecture', 'CI/CD Pipelines');
    return gaps;
  }

  static recommendRoles(domain, skills) {
    if (domain === 'Artificial Intelligence') {
      return ['AI Engineer', 'Machine Learning Engineer', 'Data Scientist'];
    }
    if (domain === 'Data Science') {
      return ['Data Analyst', 'Data Engineer', 'BI Analyst'];
    }
    if (domain === 'Frontend Development') {
      return ['Frontend Developer', 'UI Engineer', 'React Developer'];
    }
    if (domain === 'Backend Development') {
      return ['Backend Engineer', 'Software Developer', 'API Engineer'];
    }
    return ['Full Stack Developer', 'Software Engineer', 'Web Developer'];
  }

  static calculateCareerReadiness({ projectsCount, skillsCount, experienceCount, certificationsCount, educationCount }) {
    let score = 40;
    score += Math.min(projectsCount * 10, 25);
    score += Math.min(skillsCount * 3, 20);
    score += Math.min(experienceCount * 10, 15);
    score += Math.min(certificationsCount * 5, 10);
    score += Math.min(educationCount * 5, 10);
    return Math.min(score, 100);
  }

  static calculateConfidence({ hasName, hasEmail, hasSkills, hasEducation, hasProjects, hasExperience }) {
    let score = 20;
    if (hasName) score += 15;
    if (hasEmail) score += 15;
    if (hasSkills) score += 20;
    if (hasEducation) score += 15;
    if (hasProjects) score += 15;
    if (hasExperience) score += 10;
    return Math.min(score, 100);
  }
}
