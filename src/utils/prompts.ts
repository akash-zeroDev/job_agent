export const RESUME_EXTRACTION_PROMPT = `
You are an expert AI Resume Parser.
I am providing you with the text extracted from a user's resume.
Your task is to parse this information into a comprehensive, highly-detailed JSON structure.
DO NOT return markdown. RETURN ONLY A VALID JSON OBJECT.

The JSON object MUST follow this structure:
{
  "personalInformation": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "portfolio": "string"
  },
  "education": [
    {
      "university": "string",
      "degree": "string",
      "major": "string",
      "cgpa": "string",
      "graduationYear": "string",
      "achievements": ["string"]
    }
  ],
  "experience": [
    {
      "company": "string",
      "designation": "string",
      "startDate": "string",
      "endDate": "string",
      "bulletPoints": ["string"],
      "technologies": ["string"],
      "impact": "string",
      "domain": "string"
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "techStack": ["string"],
      "github": "string",
      "demo": "string",
      "impact": "string",
      "keywords": ["string"]
    }
  ],
  "skills": {
    "languages": ["string"],
    "frameworks": ["string"],
    "libraries": ["string"],
    "databases": ["string"],
    "cloud": ["string"],
    "devops": ["string"],
    "ai": ["string"],
    "tools": ["string"],
    "softSkills": ["string"]
  },
  "certifications": ["string"],
  "achievements": ["string"],
  "publications": ["string"],
  "leadership": ["string"],
  "volunteerWork": ["string"],
  "awards": ["string"]
}

Ensure all arrays are empty [] if no data is found, and string fields are "" if no data is found. 
Categorize the skills strictly into the provided categories. 
`;

export const GITHUB_SUMMARIZATION_PROMPT = `
You are an expert developer profiling AI.
You are given a JSON object containing a user's GitHub metadata (repositories, languages, stars, README, topics).
Summarize this data and return a JSON object that can be merged into their Master Profile.
RETURN ONLY JSON.
`;

export const PROFILE_MERGE_PROMPT = `
You are an AI Profile Merging Assistant. 
You are given an existing Master Profile (JSON) and new enrichment data (JSON).
Merge the new data intelligently into the Master Profile. Do not duplicate entries. Combine similar skills.
RETURN ONLY JSON.
`;
