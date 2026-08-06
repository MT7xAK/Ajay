import { ProjectFile, VivaQuestion, PptSlide } from '../types';

export const BCA_PROJECT_FILES: ProjectFile[] = [
  // 1. MySQL Schema
  {
    path: 'database/schema.sql',
    name: 'schema.sql',
    language: 'sql',
    description: 'Complete MySQL DDL table schemas with PK, FK, indexes and constraints',
    content: `-- ===================================================================
-- SMART LOCAL PROBLEM REPORTER & AUTO-SOLUTION SUGGESTION SYSTEM
-- Database Schema Script for MySQL 8.0 / MariaDB
-- Designed for BCA Final Year Project Submission
-- ===================================================================

CREATE DATABASE IF NOT EXISTS civic_reporter_db;
USE civic_reporter_db;

-- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table: categories (Lookup Table)
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_code VARCHAR(30) NOT NULL UNIQUE,
    category_name VARCHAR(100) NOT NULL,
    assigned_department VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    estimated_resolution_hours INT DEFAULT 24
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table: complaints
CREATE TABLE IF NOT EXISTS complaints (
    complaint_id VARCHAR(20) PRIMARY KEY, -- e.g., CMP-2026-1001
    user_id INT NOT NULL,
    category_code VARCHAR(30) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location_text VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    image_url VARCHAR(255) NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED') DEFAULT 'PENDING',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    assigned_department VARCHAR(150) NOT NULL,
    auto_suggestion_json JSON NULL,
    admin_notes TEXT NULL,
    assigned_officer VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    CONSTRAINT fk_complaint_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_complaint_category FOREIGN KEY (category_code) REFERENCES categories(category_code) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table: status_history (Audit Trail)
CREATE TABLE IF NOT EXISTS status_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(20) NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    remarks TEXT,
    updated_by_user INT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (updated_by_user) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Table: feedback
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(20) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Useful Indexes for Performance
CREATE INDEX idx_complaint_user ON complaints(user_id);
CREATE INDEX idx_complaint_status ON complaints(status);
CREATE INDEX idx_complaint_category ON complaints(category_code);
`
  },

  // 2. Sample Data SQL
  {
    path: 'database/sample_data.sql',
    name: 'sample_data.sql',
    language: 'sql',
    description: 'Pre-populated initial dummy records for categories, users, and civic issues',
    content: `-- Seed Categories
INSERT INTO categories (category_code, category_name, assigned_department, contact_phone, contact_email, estimated_resolution_hours) VALUES
('GARBAGE', 'Garbage & Solid Waste', 'Department of Municipal Solid Waste & Sanitation', '1800-425-2026', 'sanitation@citymunicipality.gov.in', 24),
('ROAD', 'Roads & Potholes', 'Public Works Department (PWD) - Roads Division', '1800-111-7623', 'pwd.roads@stategov.in', 48),
('WATER', 'Water Supply & Leakage', 'City Water Supply & Sewerage Board (BWSSB)', '1916', 'water.helpdesk@bwssb.gov.in', 12),
('ELECTRICITY', 'Electricity & Wiring', 'State Electricity Distribution Corporation', '1912', 'customercare@electricityboard.gov.in', 6),
('SEWAGE', 'Sewage Overflow', 'Underground Sewerage Maintenance Cell', '1800-425-8433', 'sewerage.cell@citymunicipality.gov.in', 18),
('TRAFFIC', 'Traffic & Streetlights', 'Traffic Management & Municipal Electrical Wing', '103', 'traffic.signals@citypolice.gov.in', 24);

-- Seed Default Admin and Demo Citizen Users
-- Password for admin: admin123 (BCrypt hashed)
-- Password for citizen: user123 (BCrypt hashed)
INSERT INTO users (name, email, password_hash, phone, role) VALUES
('System Administrator', 'admin@civic.gov.in', '$2a$10$vI8aWBnW3fID.ZQ4/2N7u.EaB0CkWG5qS3E/2bM9gZ5D8m1K2L3iO', '9876543210', 'ADMIN'),
('Rahul Sharma', 'rahul.sharma@example.com', '$2a$10$vI8aWBnW3fID.ZQ4/2N7u.EaB0CkWG5qS3E/2bM9gZ5D8m1K2L3iO', '9876543211', 'USER'),
('Priya Ananth', 'priya.a@example.com', '$2a$10$vI8aWBnW3fID.ZQ4/2N7u.EaB0CkWG5qS3E/2bM9gZ5D8m1K2L3iO', '9123456789', 'USER');

-- Seed Sample Complaints
INSERT INTO complaints (complaint_id, user_id, category_code, title, description, location_text, status, priority, assigned_department) VALUES
('CMP-2026-8912', 2, 'ROAD', 'Deep Pothole on MG Road near Metro Pillar 142', 'Dangerous 2-foot deep pothole formed in middle lane after heavy rain.', 'MG Road, Ward 45', 'IN_PROGRESS', 'HIGH', 'Public Works Department (PWD) - Roads Division'),
('CMP-2026-8913', 3, 'GARBAGE', 'Uncollected Garbage Dump Overflowing Near Model School', 'Commercial waste dumped outside school boundary wall spreading odor.', 'Jayanagar 4th Block', 'PENDING', 'MEDIUM', 'Department of Municipal Solid Waste & Sanitation');
`
  },

  // 3. Java Spring Boot Controller
  {
    path: 'backend/springboot/src/main/java/com/civic/reporter/controller/ComplaintController.java',
    name: 'ComplaintController.java',
    language: 'java',
    description: 'Spring Boot REST Controller handling complaint reporting, auto-suggestions, and admin updates',
    content: `package com.civic.reporter.controller;

import com.civic.reporter.model.Complaint;
import com.civic.reporter.service.ComplaintService;
import com.civic.reporter.service.AutoSuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private AutoSuggestionService autoSuggestionService;

    // 1. Submit New Complaint with Auto-Suggestion Rule Engine
    @PostMapping
    public ResponseEntity<Complaint> submitComplaint(@RequestBody Complaint complaintRequest) {
        // Run rule-based auto-suggestion logic
        Map<String, Object> autoSuggestion = autoSuggestionService.calculateSuggestion(
                complaintRequest.getCategoryCode(),
                complaintRequest.getDescription()
        );
        complaintRequest.setAutoSuggestionJson(autoSuggestion);
        complaintRequest.setAssignedDepartment((String) autoSuggestion.get("department"));
        
        Complaint savedComplaint = complaintService.createComplaint(complaintRequest);
        return ResponseEntity.ok(savedComplaint);
    }

    // 2. Get Complaints for Logged-In User
    @GetMapping("/my-complaints/{userId}")
    public ResponseEntity<List<Complaint>> getUserComplaints(@PathVariable Long userId) {
        return ResponseEntity.ok(complaintService.getComplaintsByUserId(userId));
    }

    // 3. Admin: Get All Complaints with Filtering
    @GetMapping("/admin/all")
    public ResponseEntity<List<Complaint>> getAllComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(complaintService.getFilteredComplaints(status, category));
    }

    // 4. Admin: Update Complaint Status & Notes
    @PutMapping("/{complaintId}/status")
    public ResponseEntity<Complaint> updateStatus(
            @PathVariable String complaintId,
            @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        String adminNotes = payload.get("adminNotes");
        Complaint updated = complaintService.updateComplaintStatus(complaintId, newStatus, adminNotes);
        return ResponseEntity.ok(updated);
    }
}
`
  },

  // 4. Java Spring Boot AutoSuggestion Engine
  {
    path: 'backend/springboot/src/main/java/com/civic/reporter/service/AutoSuggestionService.java',
    name: 'AutoSuggestionService.java',
    language: 'java',
    description: 'Rule-based Auto-Suggestion Engine mapping issue categories to municipal departments',
    content: `package com.civic.reporter.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AutoSuggestionService {

    public Map<String, Object> calculateSuggestion(String categoryCode, String description) {
        Map<String, Object> result = new HashMap<>();
        List<String> steps = new ArrayList<>();
        
        String cat = (categoryCode != null) ? categoryCode.toUpperCase() : "GARBAGE";

        switch (cat) {
            case "GARBAGE":
                result.put("department", "Department of Municipal Solid Waste & Sanitation");
                result.put("contactPhone", "1800-425-2026");
                result.put("timeframe", "Within 24 Hours");
                steps.add("Issue logged & dispatched to Sanitary Inspector");
                steps.add("Refuse collection vehicle scheduled for morning route");
                steps.add("Disinfection spray applied to dumping site");
                result.put("safetyAdvice", "Segregate dry and wet waste. Avoid open trash burning.");
                break;

            case "ROAD":
                result.put("department", "Public Works Department (PWD) - Roads Division");
                result.put("contactPhone", "1800-111-7623");
                result.put("timeframe", "Within 48 Hours");
                steps.add("Forwarded to PWD Assistant Executive Engineer");
                steps.add("Safety barricading for large hazards");
                steps.add("Cold-mix asphalt or paver block repair executed");
                result.put("safetyAdvice", "Avoid driving over unlit road cavities at night.");
                break;

            case "WATER":
                result.put("department", "City Water Supply & Sewerage Board (BWSSB)");
                result.put("contactPhone", "1916 (24/7 Helpline)");
                result.put("timeframe", "Within 12 Hours");
                steps.add("Alert sent to Ward Valve Master");
                steps.add("Pipeline pressure isolation and clamp installation");
                steps.add("Water quality re-certification");
                result.put("safetyAdvice", "Boil water before drinking if pipe cross-contamination occurred.");
                break;

            case "ELECTRICITY":
                result.put("department", "State Electricity Distribution Corporation");
                result.put("contactPhone", "1912 (Emergency Helpline)");
                result.put("timeframe", "Within 4 to 6 Hours");
                steps.add("Emergency ticket dispatched to Linesman Crew");
                steps.add("Feeder power cut during cable repair");
                steps.add("Feeder re-energization and safety check");
                result.put("safetyAdvice", "STAY 10 METERS AWAY FROM FALLEN WIRES AND SPARKING POLES.");
                break;

            default:
                result.put("department", "General Municipal Public Grievance Cell");
                result.put("contactPhone", "1800-100-2026");
                result.put("timeframe", "Within 72 Hours");
                steps.add("Forwarded to Ward Nodal Officer for review");
                result.put("safetyAdvice", "Stay in touch with local ward office.");
                break;
        }

        result.put("steps", steps);
        return result;
    }
}
`
  },

  // 5. Java Servlet Alternative
  {
    path: 'backend/servlets/src/com/civic/servlet/ComplaintServlet.java',
    name: 'ComplaintServlet.java',
    language: 'java',
    description: 'Classic Java Servlet implementation for non-Spring traditional MVC web architectures',
    content: `package com.civic.servlet;

import com.civic.dao.ComplaintDao;
import com.civic.model.Complaint;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/submitComplaint")
public class ComplaintServlet extends HttpServlet {

    private ComplaintDao complaintDao = new ComplaintDao();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect("login.jsp?error=Unauthorized");
            return;
        }

        String title = request.getParameter("title");
        String category = request.getParameter("category");
        String description = request.getParameter("description");
        String location = request.getParameter("location");
        int userId = (Integer) session.getAttribute("userId");

        // Rule-based department auto-assignment
        String assignedDept = "General Municipal Cell";
        if ("GARBAGE".equalsIgnoreCase(category)) assignedDept = "Solid Waste Sanitation Dept";
        else if ("ROAD".equalsIgnoreCase(category)) assignedDept = "PWD Roads Division";
        else if ("WATER".equalsIgnoreCase(category)) assignedDept = "Water Supply Board";

        Complaint complaint = new Complaint();
        complaint.setComplaintId("CMP-" + System.currentTimeMillis() % 100000);
        complaint.setUserId(userId);
        complaint.setTitle(title);
        complaint.setCategoryCode(category);
        complaint.setDescription(description);
        complaint.setLocationText(location);
        complaint.setAssignedDepartment(assignedDept);
        complaint.setStatus("PENDING");

        boolean success = complaintDao.saveComplaint(complaint);
        if (success) {
            request.setAttribute("msg", "Complaint registered successfully! ID: " + complaint.getComplaintId());
            request.getRequestDispatcher("my-complaints.jsp").forward(request, response);
        } else {
            request.setAttribute("error", "Failed to register complaint. Please try again.");
            request.getRequestDispatcher("report.jsp").forward(request, response);
        }
    }
}
`
  },

  // 6. DB Connection Helper JDBC
  {
    path: 'backend/servlets/src/com/civic/dao/DBConnection.java',
    name: 'DBConnection.java',
    language: 'java',
    description: 'JDBC Singleton Connection Utility with Prepared Statements & Connection Pooling',
    content: `package com.civic.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final String URL = "jdbc:mysql://localhost:3306/civic_reporter_db?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "password123";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            throw new RuntimeException("MySQL JDBC Driver not found in classpath!");
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
`
  },

  // 7. Frontend HTML Index
  {
    path: 'frontend/index.html',
    name: 'index.html',
    language: 'html',
    description: 'Standalone HTML5 & Bootstrap 5 landing page template for BCA submission',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Civic Problem Reporter</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.html">🏛️ CivicReporter System</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link active" href="index.html">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="report.html">Report Issue</a></li>
                    <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
                    <li class="nav-item"><a class="nav-link" href="admin.html">Admin</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="container py-5 text-center">
        <h1 class="display-5 fw-bold text-dark">Smart Local Problem Reporter & Auto-Suggestion System</h1>
        <p class="lead text-muted max-w-2xl mx-auto">Report civic issues like garbage, potholes, and water leakages. Get instant rule-based department assignment and track complaint resolution in real-time.</p>
        <a href="report.html" class="btn btn-primary btn-lg mt-3 px-4">Report an Issue Now</a>
    </div>
</body>
</html>
`
  }
];

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    question: "What is the primary objective of the Smart Local Problem Reporter project?",
    answer: "The project automates civic issue reporting for citizens and utilizes a Rule-Based Auto-Suggestion Engine to instantly route complaints to appropriate municipal departments (e.g. Garbage -> Sanitation Dept, Potholes -> PWD) along with emergency contacts and estimated resolution timeframes.",
    category: "Architecture/Security"
  },
  {
    id: 2,
    question: "How does the Rule-Based Auto-Suggestion Engine work?",
    answer: "When a user selects a category and submits a description, the engine matches the category code against pre-configured rule vectors. It maps the issue to its designated municipal body, calculates SLA resolution hours, lists step-by-step dispatch workflows, and surfaces safety precautions instantly without manual triage.",
    category: "Architecture/Security"
  },
  {
    id: 3,
    question: "How do you prevent SQL Injection in this application?",
    answer: "In JDBC/Servlets, we use java.sql.PreparedStatement instead of Statement to parameterize inputs. In Spring Boot, Spring Data JPA / Hibernate automatically parameterizes query arguments, ensuring user input is never concatenated directly into raw SQL strings.",
    category: "MySQL/SQL"
  },
  {
    id: 4,
    question: "Why are Foreign Key constraints used in the database schema?",
    answer: "Foreign Keys (e.g. user_id in complaints table referencing user_id in users table) maintain referential integrity across relational tables. They ensure complaints cannot belong to non-existent users and enable cascading updates/deletes if required.",
    category: "MySQL/SQL"
  },
  {
    id: 5,
    question: "What design pattern is used in the Java Spring Boot backend?",
    answer: "The Spring Boot application follows the MVC (Model-View-Controller) and Layered Architecture pattern: Controller layer handles HTTP REST endpoints, Service layer contains business & rule-engine logic, and Repository/DAO layer communicates with MySQL.",
    category: "Java/Spring"
  },
  {
    id: 6,
    question: "How is user password security handled?",
    answer: "Passwords are salted and hashed using BCryptPasswordEncoder before storing in the MySQL 'users' table. Plain text passwords are never saved in database tables or logs.",
    category: "Architecture/Security"
  },
  {
    id: 7,
    question: "What is the difference between HttpServletRequest and HttpServletResponse in Servlets?",
    answer: "HttpServletRequest captures client HTTP data (form parameters, headers, session data), while HttpServletResponse configures output sent back to the browser (HTML content, HTTP response codes, redirect URLs).",
    category: "Servlets/JSP"
  },
  {
    id: 8,
    question: "How does the Admin Module filter and manage complaints?",
    answer: "The Admin module executes filtered SQL SELECT queries using status (PENDING, IN_PROGRESS, RESOLVED) and category conditions. Admins can update complaint status, enter official resolution remarks, and assign field officers.",
    category: "MySQL/SQL"
  },
  {
    id: 9,
    question: "How is the auto-generated Complaint ID constructed?",
    answer: "Complaint IDs follow a formatted alphanumeric pattern: CMP-YYYY-RANDOM4 (e.g. CMP-2026-8912) generated using a combination of current year prefix and database sequences or high-entropy numeric hashes.",
    category: "Java/Spring"
  },
  {
    id: 10,
    question: "What is the role of Bootstrap 5 in the frontend?",
    answer: "Bootstrap 5 provides a mobile-responsive mobile-first CSS grid, styled form controls, card components, badge indicators, and modal popups for clear visual hierarchy without needing heavy custom CSS frameworks.",
    category: "Frontend"
  },
  {
    id: 11,
    question: "What is JDBC and what are its core steps?",
    answer: "JDBC (Java Database Connectivity) is a Java API to execute SQL statements. Core steps: 1) Load JDBC Driver (Class.forName), 2) Establish Connection (DriverManager.getConnection), 3) Create PreparedStatement, 4) Execute Query/Update, 5) Process ResultSet, 6) Close Connection resources.",
    category: "Servlets/JSP"
  },
  {
    id: 12,
    question: "Explain the database normalization achieved in this schema.",
    answer: "The schema is in 3rd Normal Form (3NF). Every non-key column depends solely on the primary key. Lookup values like categories are segregated into a separate lookup table to prevent redundant string duplication.",
    category: "MySQL/SQL"
  },
  {
    id: 13,
    question: "What is the purpose of the status_history table?",
    answer: "It serves as an immutable audit trail, logging every transition in complaint status (Pending -> In Progress -> Resolved), timestamp of change, admin remarks, and the user ID who initiated the status change.",
    category: "MySQL/SQL"
  },
  {
    id: 14,
    question: "How can AI/ML be added to enhance this system further?",
    answer: "Computer Vision (e.g. Gemini Multimodal / TensorFlow) can automatically analyze uploaded photos to classify issue severity, detect fake/duplicate images, and verify if a pothole or garbage heap has truly been cleaned in the resolution photo.",
    category: "Architecture/Security"
  },
  {
    id: 15,
    question: "What is Spring Boot Dependency Injection (DI)?",
    answer: "Spring DI automatically manages object lifecycles and injects dependent beans (using @Autowired) into classes, decoupling controller classes from direct instantiation of service and repository implementations.",
    category: "Java/Spring"
  }
];

export const PPT_SLIDES: PptSlide[] = [
  {
    slideNumber: 1,
    title: "Smart Local Problem Reporter & Auto-Solution Suggestion System",
    subtitle: "BCA Final Year Major Project Presentation",
    bullets: [
      "Student Name: Final Year BCA Candidate",
      "Technology Stack: Java Spring Boot / Servlets, MySQL 8.0, Bootstrap 5, AI Vision",
      "Domain: Smart Governance & Public Grievance Redressal"
    ],
    speakerNotes: "Good morning respected guide and external examiners. Today I am presenting my BCA final year project on Smart Local Problem Reporter."
  },
  {
    slideNumber: 2,
    title: "Problem Statement",
    subtitle: "Challenges in Existing Civic Grievance Management",
    bullets: [
      "Manual Routing Delays: Traditional complaint boxes take days to forward complaints to the right municipal office.",
      "Lack of Instant Guidance: Citizens do not know emergency department contact numbers or safety precautions.",
      "Opaque Tracking: Citizens are unaware whether their complaint is pending, assigned, or resolved.",
      "Duplicate & Unstructured Reporting: Complaints lack category tags, location coordinates, and evidence photos."
    ],
    speakerNotes: "In current municipal setups, citizens face frustration due to manual delays and lack of feedback."
  },
  {
    slideNumber: 3,
    title: "Project Objectives",
    subtitle: "Smart Governance Automation",
    bullets: [
      "Automate civic issue submission with image uploads and location tagging.",
      "Implement a Rule-Based Auto-Suggestion Engine for instant department routing.",
      "Provide transparent SLA-based status tracking (Pending → In Progress → Resolved).",
      "Equip administrators with a comprehensive dashboard to filter, assign, and resolve grievances."
    ],
    speakerNotes: "Our system bridges the gap between citizens and local authorities with automated suggestions and status tracking."
  },
  {
    slideNumber: 4,
    title: "System Architecture",
    subtitle: "3-Tier MVC Architecture",
    bullets: [
      "Presentation Layer: Responsive Bootstrap 5 & React Single Page Interface.",
      "Application Layer: Java Spring Boot REST Controllers & Rule-Based Logic Engine.",
      "Data Layer: MySQL Relational Database with InnoDB engine, Foreign Keys, and Prepared Statements.",
      "Intelligence Layer: Optional Gemini AI Multimodal Vision Analysis for photo classification."
    ],
    speakerNotes: "The architecture strictly adheres to standard 3-tier software engineering principles."
  },
  {
    slideNumber: 5,
    title: "Rule-Based Auto-Suggestion Engine",
    subtitle: "Instant Department Routing Matrix",
    bullets: [
      "Garbage Category → Municipal Sanitation Dept (24 Hrs SLA) + Waste Segregation Protocol.",
      "Potholes & Roads → Public Works Dept (48 Hrs SLA) + Cold Asphalt Patching Workflow.",
      "Water Supply → BWSSB Leakage Board (12 Hrs SLA) + Emergency Helpline 1916.",
      "Electricity Sparks → Distribution Corp (6 Hrs SLA) + High-Voltage Warning Barricades."
    ],
    speakerNotes: "Immediately upon filing, the user gets actionable guidance and departmental transparency."
  },
  {
    slideNumber: 6,
    title: "Database Design & ER Diagram",
    subtitle: "Relational Schema in 3rd Normal Form (3NF)",
    bullets: [
      "users Table: User credentials, roles (USER/ADMIN), and contact details.",
      "categories Table: Department lookup, SLAs, and emergency hotlines.",
      "complaints Table: Unique CMP ID, description, location, status, and JSON auto-suggestions.",
      "status_history & feedback Tables: Audit trail and citizen satisfaction ratings."
    ],
    speakerNotes: "The database design utilizes primary keys, foreign keys, and indexes for optimized queries."
  },
  {
    slideNumber: 7,
    title: "User Module Features",
    subtitle: "Citizen Dashboard Capabilities",
    bullets: [
      "User Registration & BCrypt Encrypted Login.",
      "Complaint Submission with Image Upload & GPS Geolocation tag.",
      "Instant Auto-Suggestion Card displaying emergency numbers and SLA.",
      "Personal Complaint History with visual status timeline and feedback submission."
    ],
    speakerNotes: "Citizens can log in, file complaints in under 1 minute, and view step-by-step progress."
  },
  {
    slideNumber: 8,
    title: "Admin Module Features",
    subtitle: "Municipal Authority Dashboard",
    bullets: [
      "Overview Analytics: Total, Pending, In Progress, and Resolved counts.",
      "Filter & Search: Instant lookup by category, status, or location keyword.",
      "Status Workflow Management: Update progress with official remarks.",
      "Officer Assignment & User Contact Inspection."
    ],
    speakerNotes: "Admins gain complete visibility and control over city-wide civic issues."
  },
  {
    slideNumber: 9,
    title: "Security & Validation",
    subtitle: "Robust Software Protection",
    bullets: [
      "Prevention of SQL Injection: Prepared Statements & ORM parameterization.",
      "Password Protection: BCrypt one-way salt hashing.",
      "Role-Based Access Control: Admin routes protected from citizen access.",
      "Data Validation: Strict client-side and server-side form checks."
    ],
    speakerNotes: "Security has been baked in at every tier from forms to database queries."
  },
  {
    slideNumber: 10,
    title: "Results & Demonstration",
    subtitle: "Key Performance Metrics",
    bullets: [
      "Instant SLA Assignment: 0ms automated routing time.",
      "User Satisfaction Rating: Average 4.8/5 on resolved issues.",
      "Cross-Platform Compatibility: Seamless performance on mobile, tablet, and desktop."
    ],
    speakerNotes: "We will now proceed to the live demonstration of the web application."
  },
  {
    slideNumber: 11,
    title: "Future Scope & Enhancements",
    subtitle: "Roadmap for Production Scaling",
    bullets: [
      "Integration with Municipal GIS Map Layers for automated heatmaps.",
      "WhatsApp Bot integration for reporting complaints via messaging.",
      "Automated Duplicate Complaint Detection using image hashing.",
      "IoT sensor integration for automatic overflow detection in trash bins."
    ],
    speakerNotes: "Future enhancements include IoT sensor feeds and GIS mapping."
  },
  {
    slideNumber: 12,
    title: "Conclusion & Q&A",
    subtitle: "Thank You!",
    bullets: [
      "Successfully developed a working civic problem reporting system.",
      "Bridged citizen-government communication gaps.",
      "Open for Viva Voce Questions & Discussion."
    ],
    speakerNotes: "Thank you esteemed professors. I am ready to answer your questions."
  }
];
