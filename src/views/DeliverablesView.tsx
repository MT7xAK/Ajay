import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { ProjectFile, VivaQuestion, PptSlide } from '../types';
import {
  Code,
  Download,
  BookOpen,
  HelpCircle,
  Presentation,
  Database,
  FileText,
  Check,
  Copy,
  Terminal,
  Archive,
  ChevronRight,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const DeliverablesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'setup' | 'docs' | 'viva' | 'ppt' | 'sql'>('code');
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [vivaQuestions, setVivaQuestions] = useState<VivaQuestion[]>([]);
  const [pptSlides, setPptSlides] = useState<PptSlide[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('database/schema.sql');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Viva filter state
  const [vivaCategory, setVivaCategory] = useState<string>('ALL');

  // Slide state
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  // SQL Sandbox state
  const [sqlInput, setSqlInput] = useState(`SELECT c.complaint_id, c.title, c.category_code, c.status, cat.assigned_department 
FROM complaints c
JOIN categories cat ON c.category_code = cat.category_code
WHERE c.status = 'PENDING';`);
  const [sqlOutput, setSqlOutput] = useState<any[] | null>(null);

  // Fetch deliverables from backend
  useEffect(() => {
    fetch('/api/bca-project-files')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjectFiles(data.files || []);
          setVivaQuestions(data.vivaQuestions || []);
          setPptSlides(data.pptSlides || []);
        }
      })
      .catch((err) => console.error('Failed to load project files:', err));
  }, []);

  const selectedFile = projectFiles.find((f) => f.path === selectedFilePath) || projectFiles[0];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate & Download ZIP Package using JSZip
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add project source files
      projectFiles.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add README / Setup Guide
      zip.file('README_SETUP_INSTRUCTIONS.txt', `===================================================================
SMART LOCAL PROBLEM REPORTER & AUTO-SOLUTION SUGGESTION SYSTEM
BCA FINAL YEAR MAJOR PROJECT PACKAGE
===================================================================

1. DATABASE SETUP (MySQL 8.0 / Workbench):
-------------------------------------------------------------------
- Open MySQL Workbench or Command Line.
- Run database/schema.sql to create database 'civic_reporter_db' and tables.
- Run database/sample_data.sql to insert categories, admin user, and sample issues.

2. SPRING BOOT BACKEND SETUP:
-------------------------------------------------------------------
- Open Eclipse / STS / IntelliJ IDEA.
- Import backend/springboot as Maven Project.
- Update database credentials in src/main/resources/application.properties.
- Run ComplaintApplication.java as Spring Boot App (Port 8080).

3. SERVLET / JSP ALTERNATIVE SETUP:
-------------------------------------------------------------------
- Import backend/servlets into Eclipse Java EE.
- Configure Apache Tomcat 9.0+ Server.
- Add MySQL Connector JDBC Driver JAR to WEB-INF/lib.

4. FRONTEND SETUP:
-------------------------------------------------------------------
- Static Bootstrap 5 templates available in /frontend folder.
`);

      // Add Viva Q&A
      const vivaText = vivaQuestions
        .map((q) => `Q${q.id} [${q.category}]: ${q.question}\nAns: ${q.answer}\n\n`)
        .join('');
      zip.file('VIVA_VOCE_QUESTIONS_ANSWERS.txt', vivaText);

      // Add PPT Slide Content
      const pptText = pptSlides
        .map((s) => `SLIDE ${s.slideNumber}: ${s.title}\nSubtitle: ${s.subtitle || ''}\nBullets:\n${s.bullets.map(b => ' - ' + b).join('\n')}\nSpeaker Notes: ${s.speakerNotes}\n\n`)
        .join('');
      zip.file('PRESENTATION_PPT_SLIDES_OUTLINE.txt', pptText);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Smart_Civic_Reporter_BCA_Final_Year_Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating project ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  // Run SQL Sandbox Simulation
  const handleExecuteSql = () => {
    // Simulated SQL response table
    setSqlOutput([
      { complaint_id: 'CMP-2026-8913', title: 'Uncollected Garbage Dump Overflowing Near Model School', category_code: 'GARBAGE', status: 'PENDING', assigned_department: 'Department of Municipal Solid Waste & Sanitation' },
      { complaint_id: 'CMP-2026-8914', title: 'Sparking Low Voltage Cable', category_code: 'ELECTRICITY', status: 'PENDING', assigned_department: 'State Electricity Distribution Corporation' }
    ]);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Complete Final Year BCA Project Deliverables Package
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            BCA Project Source Code, Docs & Presentation Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Everything required for college evaluation: Java Spring Boot controllers, JDBC Servlets, MySQL 3NF database schema, setup guides, 25 Viva Q&As, and 12-slide PPT deck.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-4 rounded-2xl shadow-sm flex items-center gap-3 text-sm shrink-0 transition-all cursor-pointer"
        >
          <Archive className="w-5 h-5 text-white" />
          {isZipping ? 'Generating ZIP...' : 'Download Full Project ZIP'}
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap border ${
            activeTab === 'code'
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Code className="w-4 h-4 text-blue-600" />
          Source Code Explorer
        </button>

        <button
          onClick={() => setActiveTab('setup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap border ${
            activeTab === 'setup'
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4 text-amber-600" />
          Setup & Run Instructions
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap border ${
            activeTab === 'docs'
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          System SRS & DFD Docs
        </button>

        <button
          onClick={() => setActiveTab('viva')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap border ${
            activeTab === 'viva'
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-purple-600" />
          25 Viva Voce Q&A
        </button>

        <button
          onClick={() => setActiveTab('ppt')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap border ${
            activeTab === 'ppt'
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Presentation className="w-4 h-4 text-rose-600" />
          PPT Presentation Deck
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap border ${
            activeTab === 'sql'
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4 text-cyan-600" />
          SQL Query Tester
        </button>
      </div>

      {/* TAB 1: SOURCE CODE EXPLORER */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* File Tree Selector */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider px-2">
              Project File Structure:
            </div>
            <div className="space-y-1 text-xs">
              {projectFiles.map((file) => {
                const isSelected = selectedFilePath === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFilePath(file.path)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all border ${
                      isSelected
                        ? 'bg-blue-50 text-blue-800 border-blue-200 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-mono text-[11px] truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{file.path}</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Code Viewer */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
            {selectedFile && (
              <div>
                <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-400" />
                      {selectedFile.path}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</div>
                  </div>

                  <button
                    onClick={() => handleCopyCode(selectedFile.content)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <div className="p-4 bg-slate-950 overflow-x-auto max-h-[600px] text-xs font-mono text-slate-200 leading-relaxed">
                  <pre>{selectedFile.content}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SETUP INSTRUCTIONS */}
      {activeTab === 'setup' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8 text-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-600" />
              Step-by-Step Execution Guide for College Evaluation
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Instructions to import, configure MySQL, compile Java files, and execute the web app on local machines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Step 1: MySQL */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-sm text-blue-700 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Step 1: MySQL Database Setup
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 leading-relaxed font-medium">
                <li>Open <strong>MySQL Workbench</strong> or MySQL Command Line Client.</li>
                <li>Execute the provided <code>database/schema.sql</code> script to create <code>civic_reporter_db</code> database and 5 relational tables.</li>
                <li>Execute <code>database/sample_data.sql</code> to populate initial categories and demo records.</li>
                <li>Verify foreign keys using <code>SHOW TABLES;</code>.</li>
              </ol>
            </div>

            {/* Step 2: Spring Boot */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-sm text-amber-800 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Step 2: Spring Boot Backend (IDE Setup)
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 leading-relaxed font-medium">
                <li>Launch <strong>Eclipse / STS / IntelliJ IDEA</strong>.</li>
                <li>Select <em>File → Import → Existing Maven Project</em> and choose the <code>/backend/springboot</code> directory.</li>
                <li>Open <code>src/main/resources/application.properties</code> and update your MySQL password.</li>
                <li>Run <code>ComplaintApplication.java</code> as a Java Application.</li>
              </ol>
            </div>

            {/* Step 3: Servlets / JSP */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-sm text-purple-700 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Step 3: Servlet / JSP Setup (Alternative)
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 leading-relaxed font-medium">
                <li>Import <code>/backend/servlets</code> into Eclipse IDE for Enterprise Java.</li>
                <li>Add <code>mysql-connector-j-8.x.jar</code> to <code>WEB-INF/lib</code> directory.</li>
                <li>Target runtime: <strong>Apache Tomcat 9.0+</strong>.</li>
                <li>Right-click project → <em>Run As → Run on Server</em>.</li>
              </ol>
            </div>

            {/* Step 4: Verification */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-sm text-emerald-700 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Step 4: Verification & Demo Testing
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 leading-relaxed font-medium">
                <li>Navigate to <code>http://localhost:8080</code> (or <code>3000</code>).</li>
                <li>Log in with Demo Admin credentials: <code>admin@civic.gov.in</code> / <code>admin123</code>.</li>
                <li>File a sample complaint under <strong>Water Supply</strong> or <strong>Roads</strong>.</li>
                <li>Observe instant Auto-Suggestion SLA & department assignment.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM SRS & DFD DOCS */}
      {activeTab === 'docs' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 text-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Software Requirements Specification (SRS) & Architecture
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Project design documentation for BCA thesis</p>
          </div>

          <div className="space-y-6 text-xs leading-relaxed font-medium">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-blue-700 uppercase">1. System Overview & Scope</h3>
              <p className="text-slate-700">
                The Smart Local Problem Reporter is a web-based public grievance management portal designed to streamline civic issue reporting (garbage accumulation, pothole hazards, water pipe leaks, electricity line faults). The core innovation lies in the <strong>Rule-Based Auto-Suggestion Engine</strong>, which dynamically assigns issues to municipal departments and computes SLA timeframes.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-amber-800 uppercase">2. Data Flow Diagram (DFD) Specs</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li><strong>DFD Level 0 (Context Level):</strong> Citizen and Admin external entities interacting with the Central CivicReporter System.</li>
                <li><strong>DFD Level 1:</strong> User Authentication, Complaint Registration, Rule-Engine Auto-Suggestion Calculation, Admin Triage & Status Audit, Citizen Feedback Processing.</li>
                <li><strong>DFD Level 2:</strong> Detailed mapping of Complaint Data Store writes and status_history table updates.</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-emerald-700 uppercase">3. Entity-Relationship (ER) Diagram Schema</h3>
              <p className="text-slate-700">
                Normalized to 3rd Normal Form (3NF). Entities include <code>users</code> (1:N) <code>complaints</code>, <code>categories</code> (1:N) <code>complaints</code>, <code>complaints</code> (1:N) <code>status_history</code>, and <code>complaints</code> (1:1) <code>feedback</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 25 VIVA VOCE QUESTIONS & ANSWERS */}
      {activeTab === 'viva' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                25 Viva Voce Examination Questions & Answers
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Frequently asked questions by college viva examiners with comprehensive answers</p>
            </div>

            {/* Viva Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['ALL', 'Java/Spring', 'MySQL/SQL', 'Servlets/JSP', 'Architecture/Security'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setVivaCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                    vivaCategory === cat
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vivaQuestions
              .filter((q) => vivaCategory === 'ALL' || q.category === vivaCategory)
              .map((q) => (
                <div key={q.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                      Q{q.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {q.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {q.question}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                    <strong className="text-emerald-700 font-bold">Answer:</strong> {q.answer}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: PPT PRESENTATION DECK */}
      {activeTab === 'ppt' && pptSlides.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Presentation className="w-5 h-5 text-rose-600" />
                Project Presentation Slide Deck (12 Slides)
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Ready-to-present slide structure with bullet points and speaker notes</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlideIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentSlideIdx === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-700 border border-slate-200"
              >
                Previous
              </button>
              <span className="text-xs font-mono font-bold text-slate-600">
                Slide {currentSlideIdx + 1} / {pptSlides.length}
              </span>
              <button
                onClick={() => setCurrentSlideIdx((prev) => Math.min(pptSlides.length - 1, prev + 1))}
                disabled={currentSlideIdx === pptSlides.length - 1}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-xs font-bold text-white shadow-2xs"
              >
                Next
              </button>
            </div>
          </div>

          {/* Current Slide Display */}
          {pptSlides[currentSlideIdx] && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-rose-700 uppercase">
                    Slide #{pptSlides[currentSlideIdx].slideNumber}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {pptSlides[currentSlideIdx].title}
                  </h3>
                  {pptSlides[currentSlideIdx].subtitle && (
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {pptSlides[currentSlideIdx].subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-800">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Slide Bullet Points:</h4>
                <ul className="space-y-2.5">
                  {pptSlides[currentSlideIdx].bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs leading-relaxed font-medium text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        •
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-900 block">🎤 Speaker Notes for Student:</span>
                <p className="text-slate-700 italic font-medium">"{pptSlides[currentSlideIdx].speakerNotes}"</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SQL QUERY TESTER */}
      {activeTab === 'sql' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-600" />
              MySQL Query Sandbox
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Test MySQL queries against simulated database tables
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                SQL Query Statement:
              </label>
              <textarea
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                rows={4}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleExecuteSql}
              className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-2xs"
            >
              <Terminal className="w-4 h-4" />
              Execute Query
            </button>

            {sqlOutput && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs font-mono">
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-2">Query Result Set (2 Rows Returned):</div>
                <pre className="text-slate-200">{JSON.stringify(sqlOutput, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
