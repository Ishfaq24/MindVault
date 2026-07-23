export function buildPrompt(
  question: string,
  context: string
) {
  return `
You are an AI Knowledge Assistant.

Answer ONLY using the provided context.

If the answer is not contained in the context,
reply:

"I couldn't find that information in your documents."

Context:

${context}

Question:

${question}
`;
}