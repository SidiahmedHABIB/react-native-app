interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  ok: any;
  message: string;
  userId: string;
  fname: string;
  lname: string;
  score: number;
}

interface RegisterRequest {
  fname: string;
  lname: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  email: string;
  latitude: number;
  longitude: number;
  description: string;
  skills: string[];
  distance?: number; // Add optional distance property
}
interface GenerateResumeData {
  id: string | null;
  userId: string;
  fname: string;
  lname: string;
  request: string | null;
  portfolio: boolean;
  contact: {
    id: string | null;
    email: string;
    phone: string;
    location: string;
    linkedin: string | null;
    github: string | null;
  };
  profile: {
    id: string | null;
    title: string;
    description: string;
  };
  education: {
    id: string | null;
    degree: string;
    major: string;
    university: string;
    location: string;
    startDate: string;
    endDate: string;
    relevantCourses: string[];
  }[];
  experience: {
    id: string | null;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    skills: string[];
  }[];
  projects: {
    id: string | null;
    title: string;
    description: string;
    technologies: string[];
  }[];
  skills: {
    id: string | null;
    technical: string[];
    tools: string[];
    others: string[];
  };
  languages: string[];
  interests: string[];
}
