import { Session } from "@/types/session.types";
import { FocusArea, Difficulty, QuestionType } from "@prisma/client";

interface SessionWithDetails extends Session {
  version: {
    difficulty: string;
    interview: {
      title: string;
      duration: number;
      focusAreas: string[];
    };
    questions: Array<{
      text: string;
      type: string;
    }>;
  };
}

interface InterviewAgentData {
  type: string;
  role: string;
  level: string;
  techstack: string;
}

interface InterviewData {
  title: string;
  duration: number;
  focusAreas: FocusArea[];
  technologies: Array<{ technology: { name: string } }>;
  technologyNames?: string[];
}

export function buildSessionFeedbackPrompt(session: SessionWithDetails, transcript: string) {
  const sessionDuration = session.version?.interview.duration || 0;

  return `ONLY respond with a JSON object containing feedback details.

  Based on the following interview transcript and questions, generate overall feedback for the interview.

  Session Details:
  - Interview: ${session.version?.interview.title}
  - Difficulty: ${session.version?.difficulty}
  - Focus Areas: ${session.version?.interview.focusAreas.join(", ")}
  - Duration: ${sessionDuration} minutes

  Questions:
  ${session.version.questions
    .map((q, i) => `${i + 1}. ${q.text} (Type: ${q.type})`)
    .join("\n")}

  Transcript:
  ${transcript}

  Required JSON format:
  {
    "technical": 0-100,
    "communication": 0-100,
    "overallScore": 0-100,
    "summary": "Overall feedback summary",
    "questionAnalysis": [
      {
        "question": "Question text",
        "analysis": "Analysis of how well the candidate answered this question",
        "strengths": ["List of strengths in the answer"],
        "improvements": ["List of areas for improvement"]
      }
    ]
  }

  Important:
  - Technical score reflects technical accuracy and depth.
  - Communication score reflects clarity and articulation.
  - Overall score is the average of the technical and communication scores.
  - Analyze how well each question was answered in the transcript.
  - Provide specific strengths and areas for improvement for each question.`;
}

export function buildInterviewDataWithJDPrompt(jobDescription: string) {
  return `Strictly respond with ONLY a object with three keys: title, focusAreas and technologies. The title should be a job title, the focus areas should be an array of focus area names, and the technologies should be an array of technology names. No additional text or formatting.

  Input job description: ${jobDescription}

  Focus Areas: TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN, PROBLEM_SOLVING

  Required output format (ONLY THIS FORMAT):
  {
    "title": "Job title",
    "focusAreas": ["FOCUS_AREA_1", "FOCUS_AREA_2"],
    "technologies": ["TechName_1", "TechName_2"]
  }

  Example:
  {
    "title": "Software Engineer",
    "focusAreas": ["BEHAVIORAL", "TECHNICAL"],
    "technologies": ["React", "Node.js"]
  }`;
}

export function buildInterviewDataWithAgentPrompt(data: InterviewAgentData) {
  return `Strictly respond with ONLY a object with three keys: title, focusAreas and technologies. The title should be a job title, the focus areas should be an array of focus area names, and the technologies should be an array of technology names. No additional text or formatting.

  Input:
  The job role is ${data.role}.
  The job experience level is ${data.level}.
  The tech stack used in the job is: ${data.techstack}.
  The focus areas: ${data.type}.

  Focus Areas: TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN, PROBLEM_SOLVING

  Required output format (ONLY THIS FORMAT):
  {
    "title": "Job title",
    "focusAreas": ["FOCUS_AREA_1", "FOCUS_AREA_2"],
    "technologies": ["TechName_1", "TechName_2"]
  }

  Example:
  {
    "title": "Software Engineer",
    "focusAreas": ["BEHAVIORAL", "TECHNICAL"],
    "technologies": ["React", "Node.js"]
  }`;
}

export function buildTechnologyConfirmationPrompt(technologyNames: string[]) {
  return `Strictly respond with ONLY a JSON array of technology names. No additional text or formatting.

  Input technologies: ${technologyNames.join(", ")}

  Required output format (ONLY THIS FORMAT):
  ["TechnologyName", "TechnologyName"]

  Example:
  ["React", "Node.js"]`;
}

export function buildVersionQuestionsPrompt(interview: InterviewData, difficulty: Difficulty) {
  const technologies = interview.technologies.map(t => t.technology.name);
  
  return `ONLY respond with the JSON array of theoretical interview questions.

  Generate questions based on:
  - Title: ${interview.title}
  - Duration: ${interview.duration} minutes
  - Difficulty: ${difficulty}
  - Focus Areas: ${interview.focusAreas.join(", ")}
  - Technologies: ${technologies.join(", ")}

  Question Types: TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN, PROBLEM_SOLVING

  Required JSON format:
  {
    "questions": [
      {
        "text": "Question text",
        "type": "QUESTION_TYPE",
        "technology": "TechName" // if applicable
      }
    ]
  }

  Important:
  - Only theoretical/conceptual questions
  - No coding problems or examples
  - No sample answers needed
  - Match the specified difficulty level (BEGINNER: basic concepts, INTERMEDIATE: practical applications, ADVANCED: complex scenarios)`;
}

export function buildFallbackQuestionsPrompt(interview: InterviewData, difficulty: Difficulty) {
  return `ONLY respond with a JSON array of ${Math.floor(interview.duration / 5)} basic theoretical interview question strings about ${
    interview.technologyNames?.join(", ") || interview.title
  } for ${difficulty} level. Format: ["question1", "question2"]`;
} 