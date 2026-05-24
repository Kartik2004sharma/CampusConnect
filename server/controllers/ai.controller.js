const Anthropic = require('@anthropic-ai/sdk');
const { Grievance, Notice, Event } = require('../models');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
});

exports.analyzeIssue = async (req, res) => {
  try {
    const { issueDescription } = req.body;

    if (!issueDescription) {
      return res.status(400).json({ error: 'Issue description is required' });
    }

    // Check if the dummy key is used
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'dummy_key') {
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

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      temperature: 0.2,
      messages: [
        { role: "user", content: prompt }
      ]
    });

    let aiResult;
    try {
      aiResult = JSON.parse(response.content[0].text);
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
      category: category || 'Other',
      priority: urgency === 'Critical' ? 'high' : (urgency === 'Medium' ? 'medium' : 'low'),
      status: 'pending',
      timeline: [{
        status: 'pending',
        note: 'Quick-submitted via AI Assistant',
        date: new Date()
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
