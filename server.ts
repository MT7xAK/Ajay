import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_COMPLAINTS } from './src/data/mockComplaints';
import { getAutoSuggestion } from './src/data/rules';
import { BCA_PROJECT_FILES, VIVA_QUESTIONS, PPT_SLIDES } from './src/data/projectDeliverables';
import { Complaint, ComplaintCategory, ComplaintStatus, User } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client on Server Side
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Database Store initialized with realistic sample data
let complaintsDb: Complaint[] = [...INITIAL_COMPLAINTS];
let usersDb: User[] = [
  {
    id: 'usr-admin',
    name: 'System Administrator',
    email: 'admin@civic.gov.in',
    phone: '+91 98765 43210',
    role: 'ADMIN',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-101',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'USER',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-102',
    name: 'Priya Ananth',
    email: 'priya.a@example.com',
    phone: '+91 91234 56789',
    role: 'USER',
    createdAt: new Date().toISOString()
  }
];

// Helper to generate unique complaint ID
function generateComplaintId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CMP-${year}-${randomNum}`;
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'Smart Local Problem Reporter Backend Engine',
    timestamp: new Date().toISOString(),
    geminiEnabled: !!process.env.GEMINI_API_KEY
  });
});

// 2. Authentication: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Admin Check
  if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@civic.gov.in') {
    const adminUser = usersDb.find(u => u.role === 'ADMIN') || usersDb[0];
    return res.json({
      success: true,
      message: 'Admin Authentication Successful',
      user: adminUser,
      token: 'jwt-mock-admin-token-2026'
    });
  }

  // Standard User
  let existingUser = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!existingUser) {
    existingUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      phone: '+91 98000 12345',
      role: 'USER',
      createdAt: new Date().toISOString()
    };
    usersDb.push(existingUser);
  }

  return res.json({
    success: true,
    message: 'Login Successful',
    user: existingUser,
    token: `jwt-mock-user-token-${existingUser.id}`
  });
});

// 3. Authentication: Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: `usr-${Date.now().toString().slice(-4)}`,
    name,
    email,
    phone: phone || '+91 90000 00000',
    role: 'USER',
    createdAt: new Date().toISOString()
  };

  usersDb.push(newUser);
  res.json({
    success: true,
    message: 'User registered successfully',
    user: newUser
  });
});

// 4. Forgot Password Simulation
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: `Password reset instructions sent to ${email}. (Demo simulation mode)`
  });
});

// 5. Get Complaints (Filtered or User-Specific)
app.get('/api/complaints', (req: Request, res: Response) => {
  const { userId, category, status, search } = req.query;

  let result = [...complaintsDb];

  if (userId) {
    result = result.filter(c => c.userId === String(userId));
  }

  if (category && category !== 'ALL') {
    result = result.filter(c => c.category === String(category));
  }

  if (status && status !== 'ALL') {
    result = result.filter(c => c.status === String(status));
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(c =>
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.locationText.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    success: true,
    count: result.length,
    complaints: result
  });
});

// 6. Submit Complaint (with Rule Engine & Optional AI Vision Enhancement)
app.post('/api/complaints', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      category,
      title,
      description,
      locationText,
      latitude,
      longitude,
      imageUrl,
      priority
    } = req.body;

    if (!category || !title || !description || !locationText) {
      return res.status(400).json({ error: 'Category, title, description, and location are required' });
    }

    const categoryEnum = category as ComplaintCategory;
    const ruleSuggestion = getAutoSuggestion(categoryEnum, description);

    let aiAnalysisText = '';
    // Optional AI Multimodal Analysis via Gemini on server side
    if (aiClient && (imageUrl || description.length > 20)) {
      try {
        const promptText = `You are an AI Civic Inspector analyzing a public complaint report.
Complaint Category: ${category}
Title: ${title}
Description: ${description}
Location: ${locationText}

Provide a concise 2-sentence official assessment of this issue including:
1) Estimated severity (Low, Medium, High, Urgent).
2) Key safety recommendation or municipal action required.`;

        let contents: any = promptText;
        if (imageUrl && imageUrl.startsWith('data:image/')) {
          const matches = imageUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
          if (matches) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            contents = {
              parts: [
                { text: promptText },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data
                  }
                }
              ]
            };
          }
        }

        const aiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.6-flash',
          contents
        });

        aiAnalysisText = aiResponse.text || '';
      } catch (err) {
        console.warn('Gemini AI analysis skipped or failed:', err);
      }
    }

    const newComplaint: Complaint = {
      id: generateComplaintId(),
      userId: userId || 'usr-guest',
      userName: userName || 'Citizen',
      userEmail: userEmail || 'citizen@example.com',
      userPhone: userPhone || '+91 90000 00000',
      category: categoryEnum,
      title,
      description,
      locationText,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      imageUrl: imageUrl || undefined,
      status: 'PENDING',
      priority: priority || (description.toLowerCase().includes('urgent') ? 'HIGH' : 'MEDIUM'),
      assignedDepartment: ruleSuggestion.department,
      autoSuggestion: {
        department: ruleSuggestion.department,
        contactPhone: ruleSuggestion.contactPhone,
        contactEmail: ruleSuggestion.contactEmail,
        timeframe: ruleSuggestion.timeframe,
        steps: ruleSuggestion.steps,
        safetyAdvice: ruleSuggestion.safetyAdvice,
        aiAnalysis: aiAnalysisText || undefined
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    complaintsDb.unshift(newComplaint);

    res.json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint: newComplaint
    });
  } catch (error: any) {
    console.error('Error in POST /api/complaints:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// 7. Update Complaint Status & Notes (Admin Only)
app.put('/api/complaints/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes, assignedOfficer } = req.body;

  const complaint = complaintsDb.find(c => c.id === id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  if (status) {
    complaint.status = status as ComplaintStatus;
    if (status === 'RESOLVED') {
      complaint.resolvedAt = new Date().toISOString();
    }
  }

  if (adminNotes !== undefined) {
    complaint.adminNotes = adminNotes;
  }

  if (assignedOfficer !== undefined) {
    complaint.assignedOfficer = assignedOfficer;
  }

  complaint.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: `Complaint ${id} status updated to ${complaint.status}`,
    complaint
  });
});

// 8. Submit Feedback
app.post('/api/complaints/:id/feedback', (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const complaint = complaintsDb.find(c => c.id === id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  complaint.feedback = {
    rating: Number(rating) || 5,
    comment: comment || 'Issue resolved satisfactorily.',
    createdAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Thank you for your feedback!',
    complaint
  });
});

// 9. Auto-Suggestion Standalone API
app.post('/api/suggest', (req: Request, res: Response) => {
  const { category, description } = req.body;
  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }
  const suggestion = getAutoSuggestion(category as ComplaintCategory, description || '');
  res.json({ success: true, suggestion });
});

// 10. AI Auto-Analysis Endpoint using Gemini
app.post('/api/ai/analyze-issue', async (req: Request, res: Response) => {
  try {
    const { title, description, category, imageData } = req.body;

    if (!aiClient) {
      // Fallback mock response if GEMINI_API_KEY is not configured
      return res.json({
        success: true,
        aiAnalysis: `[Rule-Engine Assessment] Category: ${category || 'General'}. Estimated severity: High. Recommended immediate dispatch to ${getAutoSuggestion((category as ComplaintCategory) || 'GARBAGE', description || '').department}.`,
        suggestedPriority: description?.toLowerCase().includes('urgent') ? 'URGENT' : 'HIGH'
      });
    }

    const promptText = `Analyze this civic issue report for municipal action:
Category: ${category}
Title: ${title}
Description: ${description}

Output JSON format:
{
  "detectedCategory": "GARBAGE|ROAD|WATER|ELECTRICITY|SEWAGE|TRAFFIC",
  "severity": "LOW|MEDIUM|HIGH|URGENT",
  "summary": "Short 1-sentence technical summary of the issue",
  "recommendedAction": "Action steps for the municipal team",
  "publicSafetyNotice": "Short caution advice for citizens near the area"
}`;

    let contents: any = promptText;
    if (imageData && imageData.startsWith('data:image/')) {
      const matches = imageData.match(/^data:(image\/[a-z]+);base64,(.+)$/);
      if (matches) {
        contents = {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: matches[1],
                data: matches[2]
              }
            }
          ]
        };
      }
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents
    });

    const outputText = response.text || '';
    res.json({
      success: true,
      rawAiText: outputText
    });
  } catch (error: any) {
    console.error('AI Analysis Endpoint Error:', error);
    res.status(500).json({ error: error.message || 'AI analysis failed' });
  }
});

// 11. Project Deliverables API (Java Spring Boot, Servlets, MySQL Schema, Viva Q&A, PPT)
app.get('/api/bca-project-files', (req: Request, res: Response) => {
  res.json({
    success: true,
    files: BCA_PROJECT_FILES,
    vivaQuestions: VIVA_QUESTIONS,
    pptSlides: PPT_SLIDES
  });
});

// ==========================================
// VITE MIDDLEWARE / STATIC FILE SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
