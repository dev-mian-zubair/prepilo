import { google } from "@ai-sdk/google";

export const MODEL = google("gemini-2.0-flash-001");

export const SYSTEM_MESSAGES = {
  INTERVIEW_QUESTIONS: "You are an interview question generator for theoretical/conceptual questions only. Never provide coding questions or examples.",
  INTERVIEW_FEEDBACK: "You are an interview feedback generator. Analyze the interview transcript and provide constructive feedback on technical knowledge, communication skills, and overall performance.",
  INTERVIEW_DATA: "You are an interview data analyzer. Extract relevant job title, focus areas, and technologies from the provided information.",
  TECHNOLOGY_CONFIRMATION: "You are a technology validator. Confirm and standardize technology names from the provided list.",
  FALLBACK_QUESTIONS: "You are a basic interview question generator. Create simple theoretical questions based on the given topic and difficulty level."
} as const;
