const OpenAI = require('openai');
const { Grievance, Notice, Event } = require('../models');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

exports.analyzeIssue = async (req, res) => {
  try {
    const { issueDescription } = req.body;

    if (!issueDescription) {
      return res.status(400).json({ error: 'Issue description is required' });
    }
    
    if (issueDescription.length > 1000) {
      return res.status(400).json({ error: 'Description too long (max 1000 chars)' });
    }

    // Check if the dummy key is used
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
      // Mocked AI analysis
      return res.status(200).json({
        category: 'Infrastructure',
        urgency: 'Medium',
        summary: `Mock Analysis: The issue is related to "${issueDescription.slice(0, 30)}..."`,
        suggestedAction: 'Wait for IT response or submit a grievance.',
        confidence: 0.85
      });
    }

    const prompt = `
You are an AI assistant for a campus management system. 
A student has described an issue: "${issueDescription}"

Analyze this issue and provide a JSON response with the following keys:
- category: (e.g., 'Infrastructure', 'Academics', 'Hostel', 'Administrative', 'Other')
- urgency: (e.g., 'Low', 'Medium', 'High', 'Critical')
- summary: (A brief 1-sentence summary of the issue)
- suggestedAction: (A suggestion for the student, e.g., "Submit a formal grievance")

Return ONLY the raw JSON format without any markdown wrapper.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are an AI assistant for a campus management system. Output JSON only." },
        { role: "user", content: prompt }
      ]
    });

    let aiResult;
    try {
      aiResult = JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      aiResult = {
        category: 'Other',
        urgency: 'Medium',
        summary: response.content[0].text.substring(0, 100),
        suggestedAction: 'Submit a grievance for further assistance.'
      };
    }

    res.status(200).json(aiResult);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze issue' });
  }
};

const normalizeCategory = (aiCategory) => {
  const map = {
    'infrastructure': 'facilities',
    'academics': 'academic',
    'hostel': 'hostel',
    'administrative': 'other',
    'ragging': 'ragging',
  };
  return map[(aiCategory || '').toLowerCase()] || 'other';
};

exports.quickSubmit = async (req, res) => {
  try {
    const { issueDescription, category, urgency, title } = req.body;
    const studentId = req.user._id;

    if (!issueDescription) {
      return res.status(400).json({ error: 'Issue description is required' });
    }

    // Create a new Grievance
    const newGrievance = new Grievance({
      studentId,
      title: title || `Issue regarding ${category || 'campus'}`,
      description: issueDescription,
      category: normalizeCategory(category),
      priority: urgency === 'Critical' ? 'high' : (urgency === 'Medium' ? 'medium' : 'low'),
      status: 'pending',
      timeline: [{
        action: 'Grievance submitted',
        updatedBy: studentId,
        timestamp: new Date(),
        note: 'Quick-submitted via AI Assistant'
      }]
    });

    await newGrievance.save();

    res.status(201).json({
      message: 'Grievance submitted successfully',
      grievance: newGrievance
    });
  } catch (error) {
    console.error('Quick Submit Error:', error);
    res.status(500).json({ error: 'Failed to quick submit grievance' });
  }
};
