# 🚀 ApplyFlow

### Intelligent Application Processing & Validation Platform

**Submit Once. Validate Automatically. Correct Smarter.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ApplyFlow-2563EB?style=for-the-badge)](https://applyflow-navy.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge\&logo=github)](https://github.com/MonaliPawar26/ApplyFlow)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge\&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge\&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?style=for-the-badge\&logo=tailwindcss)](https://tailwindcss.com/)

> ApplyFlow is an intelligent application-processing platform designed to transform fragmented, manual application workflows into a transparent, validation-first digital experience.

---

## 🌐 Live Demo

### 👉 [Launch ApplyFlow](https://applyflow-navy.vercel.app/)

### 👉 [View Source Code](https://github.com/MonaliPawar26/ApplyFlow)

---

## 🎯 Problem

Application processing often involves repetitive form filling, document uploads, manual verification, inconsistent information, unclear rejection reasons, and limited visibility into processing status.

Applicants may not know:

* What information is missing
* Which document is incorrect
* Why their application was flagged
* What they need to correct
* What stage their application is currently in
* What happens after submitting a correction

For officers and administrators, manually reviewing incomplete or inconsistent applications increases processing effort and makes bottlenecks harder to identify.

### The result

**More manual work → more correction cycles → slower processing → poor transparency.**

---

# 💡 Our Solution

## ApplyFlow

ApplyFlow introduces an intelligent, correction-first application-processing workflow.

Instead of simply rejecting an incomplete or inconsistent application, ApplyFlow:

```text
SUBMIT
   ↓
UNDERSTAND
   ↓
PROCESS DOCUMENTS
   ↓
VALIDATE
   ↓
IDENTIFY ISSUES
   ↓
EXPLAIN
   ↓
CORRECT
   ↓
REVALIDATE
   ↓
CATEGORIZE
   ↓
PROCESS
   ↓
COMPLETE
```

The system combines structured validation, document intelligence, workflow simulation, explainable issue handling, applicant correction, officer review, auditability and real-time interface feedback.

---

# ⭐ Why ApplyFlow?

### Traditional Experience

```text
Submit Application
        ↓
Manual Review
        ↓
Issue Found
        ↓
Application Returned / Rejected
        ↓
Applicant Finds Out What Went Wrong
        ↓
Correction
        ↓
Resubmission
        ↓
Another Review
```

### ApplyFlow Experience

```text
Submit
  ↓
Automated Validation
  ↓
Issue Detected
  ↓
Explain Why
  ↓
Fix Exactly What Is Wrong
  ↓
Revalidate
  ↓
Validated
  ↓
Categorized
  ↓
Officer Processing
  ↓
Completed
```

### Core Principle

> **Don't just reject the application. Explain the problem, guide the correction, and move the application forward.**

---

# 🧠 Key Features

## 1. Intelligent Application Intake

A structured multi-step application wizard guides users through:

* Basic information
* Application details
* Required documents
* Review
* Submission

Applications are assigned unique application IDs and tracked throughout their lifecycle.

---

## 2. Document Intelligence

ApplyFlow simulates an intelligent document-processing pipeline.

For each document, the system can represent:

* OCR status
* Extracted fields
* OCR confidence
* Required-document status
* Validation status
* Document replacement
* Extracted field matching

Example:

```text
PAN_CARD.pdf

OCR STATUS
✓ Extracted

OCR CONFIDENCE
96%

Extracted Name
Rahul Sharma

Validation
✓ PAN format
✓ Date format
✕ Name consistency
```

---

## 3. Validation Center

The Validation Center provides structured validation results across multiple categories:

* Identity verification
* Application data
* Mandatory documents
* Cross-document consistency
* Field formatting
* OCR confidence

Instead of presenting a generic error, ApplyFlow connects the issue to its underlying validation rule.

---

# 🔎 4. Validation Graph

One of ApplyFlow's signature experiences.

The system visually connects:

```text
DOCUMENT
    ↓
EXTRACTED DATA
    ↓
VALIDATION RULE
    ↓
RESULT
    ↓
SYSTEM ACTION
```

Example:

```text
PAN_CARD.pdf
     ↓
Rahul Sharma
     ↓
NAME_MATCH_001
     ↓
Mismatch
     ↓
Correction Required
```

This makes validation easier to understand and demonstrates explainability.

---

# 🩻 5. Application X-Ray

ApplyFlow includes an application intelligence layer that allows users to inspect an application through multiple layers:

```text
APPLICATION
     ↓
DOCUMENTS
     ↓
EXTRACTED DATA
     ↓
VALIDATION RULES
     ↓
ISSUES
     ↓
WORKFLOW
     ↓
AUDIT HISTORY
```

The X-Ray experience is designed to make the internal processing journey visible without overwhelming the user.

---

# 🧬 6. Application Health Score

Each application has a dynamic health score based on its validation state.

Example:

```text
APPLICATION HEALTH

82 / 100

Document Completeness      92%
Field Validity             86%
Cross-Document Consistency 71%
OCR Confidence             94%
```

When issues are corrected, the score updates dynamically.

Example:

```text
64
 ↓
72
 ↓
86
 ↓
98
```

This gives applicants and officers an immediate understanding of application quality.

---

# 🛠️ 7. Correction-First Workflow

This is one of the core ideas behind ApplyFlow.

Instead of simply saying:

> ❌ Application Invalid

ApplyFlow identifies the exact problem.

Example:

```text
CORRECTION REQUIRED

1. Name mismatch
2. Missing address proof
3. Invalid phone number
```

The user can open an issue and see:

```text
WHAT IS WRONG?
Name mismatch

APPLICATION VALUE
Rahul Kumar

DOCUMENT VALUE
Rahul Sharma

RULE
NAME_MATCH_001

RECOMMENDED ACTION
Verify and correct the applicant name.
```

The user can then correct the information and revalidate.

---

# 🔄 8. Dynamic Revalidation

After corrections, ApplyFlow runs a simulated multi-stage validation pipeline.

```text
Checking required fields       ✓
Checking document completeness ✓
Running format rules          ✓
Running consistency checks    ✓
Running business rules        ✓
Finalizing validation         ✓
```

If all issues are resolved:

```text
CORRECTION REQUIRED
        ↓
     VALIDATED
```

The application health score and status are updated automatically.

---

# 👨‍💼 9. Officer Dashboard

ApplyFlow provides a dedicated officer experience.

The Officer Dashboard focuses on applications that require attention.

Key indicators include:

* Applications
* Processing
* Correction Required
* Manual Review
* SLA Risk
* Completed

Officers can:

* Search applications
* Filter the queue
* Open application details
* Review documents
* Inspect validation
* Request correction
* Approve applications
* Send applications for manual review
* Complete processing

---

# 🏢 10. Control Room

The Control Room provides a high-level view of application processing.

Applications can be viewed through stages such as:

```text
INBOX
  ↓
PROCESSING
  ↓
VALIDATION
  ↓
CORRECTION / PASS
  ↓
REVALIDATION
  ↓
CATEGORIZATION
  ↓
PROCESSING
  ↓
COMPLETE
```

This gives officers and administrators a system-level understanding of application movement.

---

# 📊 11. Analytics Dashboard

ApplyFlow includes an administrative analytics experience for monitoring:

* Application volume
* Processing activity
* Validation outcomes
* Correction activity
* Manual review
* SLA risk
* Completion
* Processing trends

The goal is to shift the view from individual applications to overall workflow performance.

---

# ⚙️ 12. Rule Engine

Administrators can manage validation rules.

Example:

```text
RULE ID
NAME_MATCH_001

CATEGORY
Cross-document validation

SEVERITY
High

TRIGGER
Application name != Identity document name

ACTION
Request Correction

STATUS
Active
```

Rules can be enabled/disabled and configured through the interface.

---

# 🧪 13. Rule Simulator

Administrators can test a validation rule against sample data.

Example:

```text
Application Name:
Rahul Kumar

Document Name:
Rahul Sharma

        ↓

RUN SIMULATION

        ↓

RESULT:
FAIL

ACTION:
Correction Required
```

This demonstrates how validation logic can be tested before being applied to live workflows.

---

# 🕐 14. Application Time Machine

ApplyFlow provides an audit replay experience that allows the application lifecycle to be inspected over time.

Example:

```text
10:42  Submitted
10:43  OCR Completed
10:44  Validation Started
10:44  Issue Detected
10:51  Correction Submitted
10:52  Revalidation
10:52  Validated
```

This provides a transparent history of what happened to an application.

---

# 📜 15. Audit Logs

Important application actions are recorded with:

* Timestamp
* Application ID
* User
* Role
* Action
* Category
* Details
* Severity

This improves traceability and accountability.

---

# 🔔 16. Notifications

ApplyFlow provides contextual notifications for events such as:

* Application submission
* Validation completion
* Correction requests
* Successful revalidation
* Application approval
* Manual review
* Processing completion

Notifications can be marked as read individually or collectively.

---

# 🔐 17. Role-Based Experience

ApplyFlow provides three primary role experiences:

### 👤 Applicant

Focus:

```text
Submit
Correct
Track
```

### 👨‍💼 Officer

Focus:

```text
Review
Validate
Process
```

### 🛠️ Administrator

Focus:

```text
Rules
Analytics
Audit
System Monitoring
```

Switching roles updates the interface and navigation accordingly.

---

# 🎬 18. Demo Scenarios

ApplyFlow includes controlled demo scenarios designed for presentations and evaluations.

Examples include:

* Incomplete application
* Document mismatch
* Low OCR confidence
* Manual review
* SLA risk
* Successfully validated application

The demo state can be reset and scenarios can be loaded for repeatable demonstrations.

---

# 🌐 19. Network Failure Simulation

The prototype includes a simulated network-offline state to demonstrate how the interface communicates connection problems and recovery.

Example:

```text
Connection Interrupted

Your current work is safe.

Retrying...
```

When restored:

```text
Connection Restored

Changes synchronized.
```

---

# 🌙 20. Dark Mode

ApplyFlow supports a dedicated dark interface with:

* Navy/near-black surfaces
* Blue accent system
* Accessible status colors
* Dark cards and borders
* Consistent typography

Dark mode is implemented using Tailwind's class-based dark mode.

---

# ⌘ 21. Command Palette

Use:

```text
CTRL + K
```

or

```text
CMD + K
```

to open the global command palette.

This provides quick access to application navigation and system actions.

The shortcut is implemented in the application's central state layer.

---

# ✨ 22. Motion & Micro-Interactions

ApplyFlow uses motion to communicate state changes rather than decoration.

Examples include:

* Page transitions
* Modal transitions
* Validation state changes
* Score updates
* Toast notifications
* Sidebar transitions
* Processing states
* Revalidation feedback

Framer Motion is included in the current project dependencies.

---

# 🏗️ Architecture

```text
                         APPLYFLOW
                             │
                 ┌───────────┴───────────┐
                 │                       │
             APPLICANT                 OFFICER
                 │                       │
                 └───────────┬───────────┘
                             │
                    APPLICATION STATE
                             │
                ┌────────────┼────────────┐
                │            │            │
            DOCUMENTS    VALIDATION    WORKFLOW
                │            │            │
                │       RULE ENGINE       │
                │            │            │
                └────────────┼────────────┘
                             │
                     INTELLIGENCE LAYER
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
       X-RAY            TIME MACHINE        PASSPORT
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                     AUDIT + TELEMETRY
                             │
                         ANALYTICS
```

---

# 🧩 Technical Architecture

The current prototype is built as a client-side React application with centralized application state and simulated processing workflows.

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS

### UI / Interaction

* Framer Motion
* Lucide React
* Custom reusable components
* Responsive layouts
* Dark mode

### State & Business Logic

* React Context API
* React state management
* Centralized application state
* Dynamic validation state
* Application lifecycle transitions
* Mock telemetry
* Audit state
* Notification state

### Deployment

* Vercel

The repository's current `package.json` confirms React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React and the associated build/lint tooling.

---

# 🗂️ Project Structure

```text
ApplyFlow/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AnalyticsDashboard
│   │   │   ├── RuleEngine
│   │   │   └── AuditLogsView
│   │   │
│   │   ├── applicant/
│   │   │   ├── ApplicantDashboard
│   │   │   ├── NewApplicationWizard
│   │   │   ├── ValidationCenter
│   │   │   ├── CorrectionWorkspace
│   │   │   └── DocumentIntelligenceWorkspace
│   │   │
│   │   ├── officer/
│   │   │   ├── OfficerDashboard
│   │   │   └── ApplicationReviewDetail
│   │   │
│   │   ├── intelligence/
│   │   │   └── ControlRoomBoard
│   │   │
│   │   ├── pipeline/
│   │   │   └── ValidationGraph
│   │   │
│   │   ├── notifications/
│   │   │   └── NotificationCenter
│   │   │
│   │   ├── landing/
│   │   │   ├── LandingPage
│   │   │   └── AuthPage
│   │   │
│   │   └── layout/
│   │       └── Shell
│   │
│   ├── context/
│   │   └── AppContext.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   ├── types/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── vercel.json
```

The current application routing explicitly connects the landing page, authentication, applicant dashboard, application wizard, validation center, validation graph, correction workspace, document intelligence, control room, officer dashboard, officer review, analytics, rule engine, audit logs and notification center.

---

# 🔄 Core Application State Flow

ApplyFlow models the application lifecycle through structured states:

```text
DRAFT
  ↓
SUBMITTED
  ↓
PROCESSING
  ↓
VALIDATING
  ↓
CORRECTION REQUIRED
  ↓
REVALIDATING
  ↓
VALIDATED
  ↓
CATEGORIZED
  ↓
MANUAL REVIEW / PROCESSING
  ↓
COMPLETED
```

The central application context manages applications, active application state, validation rules, notifications, telemetry, audit logs, demo scenarios, role switching and workflow actions.

---

# 🧠 Intelligent Workflow

A simplified ApplyFlow decision model:

```text
                    APPLICATION
                         │
                         ↓
                 DOCUMENT INGESTION
                         │
                         ↓
                    OCR / EXTRACTION
                         │
                         ↓
                    VALIDATION
                         │
             ┌───────────┴───────────┐
             │                       │
          PASSED                  ISSUES
             │                       │
             ↓                       ↓
        CATEGORIZE              EXPLAIN
             │                       │
             ↓                       ↓
         PROCESS                  CORRECT
             │                       │
             ↓                       ↓
        COMPLETED              REVALIDATE
                                     │
                                     ↓
                                  PASSED
                                     │
                                     ↓
                                 PROCESS
```

---

# 🔬 Validation Philosophy

ApplyFlow separates **assistance** from **validation authority**.

### AI / Intelligence Layer

Can assist with:

* Document understanding
* OCR assistance
* Issue explanation
* Application summaries
* Categorization suggestions
* Correction guidance

### Validation / Rule Layer

Responsible for:

* Required fields
* Required documents
* Format validation
* Cross-document consistency
* Validation outcomes
* Workflow transitions

This separation is intentional: intelligent assistance helps users understand the process while deterministic rules maintain predictable validation behavior.

---

# 🎥 Recommended Demo Flow

For a short product demonstration:

```text
Landing Page
      ↓
Applicant Dashboard
      ↓
Open Application
      ↓
Application X-Ray
      ↓
Validation Issues
      ↓
Explain Why
      ↓
Correction Workspace
      ↓
Fix Issues
      ↓
Revalidate
      ↓
Health Score Improves
      ↓
Validated
      ↓
Officer Control Room
      ↓
Review
      ↓
Complete
      ↓
Notification
```

### Hero moment

```text
64 / 100
CORRECTION REQUIRED

        ↓
     CORRECT

        ↓
    REVALIDATE

        ↓

98 / 100
VALIDATED
```

---

# 🛠️ Getting Started

## Prerequisites

Make sure you have:

* Node.js 18+
* npm

---

## Installation

Clone the repository:

```bash
git clone https://github.com/MonaliPawar26/ApplyFlow.git
```

Move into the project:

```bash
cd ApplyFlow
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will provide a local URL, typically:

```text
http://localhost:5173
```

---

# 📦 Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

These scripts correspond to the current repository configuration.

---

# ☁️ Deployment

The project is configured for deployment on Vercel.

### Live deployment

👉 https://applyflow-navy.vercel.app/

### Deployment flow

```text
GitHub Repository
       ↓
     Vercel
       ↓
Production Build
       ↓
Live Application
```

---

# 🧪 Demo Credentials / Demo Mode

ApplyFlow is designed to support role-based demonstration.

Available experiences:

```text
Applicant
Officer
Admin
```

For presentations, use the built-in demo scenarios to demonstrate:

### Scenario 1

Incomplete application

### Scenario 2

Document mismatch

### Scenario 3

Low OCR confidence

### Scenario 4

Manual review

### Scenario 5

SLA risk

### Scenario 6

Successful validation

---

# 📈 Example End-to-End Scenario

### Initial State

```text
Application:
APP-1024

Applicant:
Rahul Sharma

Status:
Correction Required

Health:
64 / 100
```

Issues:

```text
✕ Name mismatch
✕ Missing address proof
✕ Invalid phone number
```

### Correction

Applicant:

```text
✓ Corrects name
✓ Uploads address proof
✓ Corrects phone number
```

### Revalidation

```text
Required Fields          ✓
Documents                ✓
Format Rules             ✓
Consistency Checks       ✓
Business Rules           ✓
```

### Final State

```text
Health:
98 / 100

Status:
Validated

Category:
Standard Processing
```

The current application context implements issue resolution, health recalculation, document replacement/OCR simulation and the revalidation transition into a validated state.

---

# 🏆 Why This Prototype Stands Out

### 01 — Correction First

Instead of stopping at an error, ApplyFlow guides the user toward resolution.

### 02 — Explainable Validation

Every issue can be connected to:

```text
Document
→ Extracted Value
→ Rule
→ Result
→ Action
```

### 03 — Applicant + Officer Experience

The platform is designed around both sides of the processing workflow.

### 04 — Application Intelligence

X-Ray, Validation Graph, Health Score, Time Machine and Control Room experiences provide deeper visibility into application processing.

### 05 — Dynamic Prototype

Actions are connected through centralized state rather than being isolated static screens.

### 06 — Auditability

Application actions and workflow changes can be represented through timelines, telemetry and audit logs.

---

# 🔮 Future Scope

The current prototype focuses on demonstrating the complete application-processing experience. A production deployment could extend it with:

* Production OCR services
* LLM/Gemini integration for document understanding and explanations
* PostgreSQL/Supabase persistence
* Secure cloud document storage
* Production authentication
* Government/API integrations
* Email/SMS/WhatsApp notifications
* Digital identity integration
* Advanced workflow orchestration
* Department-specific rule configuration
* Real-time officer queues
* SLA escalation
* Multi-language support
* Advanced analytics
* Production-grade observability
* Encryption and security hardening

These are future production extensions rather than claims about the current client-side prototype.

---

# 🔐 Security Considerations

For production deployment, ApplyFlow should implement:

* Role-based access control
* Secure authentication
* Encrypted document storage
* Signed document URLs
* Input validation
* File-type validation
* Malware scanning
* Audit logging
* Data encryption
* Rate limiting
* Secure API authentication
* Sensitive-data masking
* Least-privilege access

The current repository should be treated as a prototype/demo application rather than a production government-grade processing system.

---

# 📚 Tech Stack

| Layer               | Technology                        |
| ------------------- | --------------------------------- |
| Frontend            | React 19                          |
| Language            | TypeScript                        |
| Build Tool          | Vite                              |
| Styling             | Tailwind CSS                      |
| Animation           | Framer Motion                     |
| Icons               | Lucide React                      |
| State               | React Context + Hooks             |
| Validation Workflow | Client-side rule/state simulation |
| Data                | Structured mock data              |
| Deployment          | Vercel                            |
| Code Quality        | Oxlint                            |
| Package Manager     | npm                               |

The listed technologies are based on the repository's current package configuration.

---

# 🌟 Project Vision

ApplyFlow aims to move application processing from:

> **“Submit → Wait → Find Out What's Wrong”**

to:

> **“Submit → Understand → Validate → Correct → Revalidate → Complete.”**

The long-term vision is a processing experience where applicants always know:

**What happened?**

**Why did it happen?**

**What needs to be fixed?**

**What happens next?**

And officers always know:

**What needs attention?**

**Why is it blocked?**

**What is the current SLA risk?**

**What action should happen next?**

---

# 👥 Project

**ApplyFlow — Intelligent Application Processing Platform**

Built for **ALGOTHON'26 — Smart Application Processing**

Problem Statement:

**ALG-AUTO-02 — Smart Application Processing**

---

# 🔗 Links

🌐 **Live Demo**
https://applyflow-navy.vercel.app/

💻 **GitHub Repository**
https://github.com/MonaliPawar26/ApplyFlow

---

# 📄 License

This project is currently maintained as a hackathon/prototype project.

License terms can be added here when the project is formally released under an open-source license.

---

<div align="center">

### ApplyFlow

**Submit Once. Validate Automatically. Correct Smarter.**

Built to make application processing
**clearer • faster • more transparent**

⭐ If you find the project interesting, consider starring the repository.

</div>

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
