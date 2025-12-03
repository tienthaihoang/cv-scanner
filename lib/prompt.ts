export function buildPrompt(cvText: string, jdText: string) {
const cvSnippet = cvText.slice(0, 45_000);
return `You are an expert recruiter. Compare the candidate CV and the Job Description. Return JSON ONLY with fields: match_score (0-100), summary, strengths (array), weak_points (array), skill_gap (array), recommendations (array), highlighted_keywords (array).


JD:
${jdText}


CV:
${cvSnippet}`;
}