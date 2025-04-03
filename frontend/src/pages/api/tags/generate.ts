import { NextApiRequest, NextApiResponse } from 'next';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Classroom-specific tag categories
const TAG_CATEGORIES = [
  'homework', 'assignment', 'worksheet', 
  'lesson', 'study guide', 'notes',
  'quiz', 'test', 'exam',
  'mathematics', 'science', 'history', 'english',
  'project', 'rubric', 'syllabus'
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text content is required' });
  }

  try {
    // Extract first 1000 chars to avoid hitting token limits
    const truncatedText = text.slice(0, 1000);

    const response = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: truncatedText,
      parameters: { candidate_labels: TAG_CATEGORIES }
    });

    // Get top 5 tags with confidence > 50%
    const tags = response.labels
      .filter((_, i) => response.scores[i] > 0.5)
      .slice(0, 5);

    res.status(200).json({ tags });
  } catch (error) {
    console.error('AI Tagging Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate tags',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}