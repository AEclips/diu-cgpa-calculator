# 🎓 UniGrade — Modern University CGPA & SGPA Calculator

A feature-packed, responsive, and student-focused Cumulative Grade Point Average (CGPA) and Semester GPA (SGPA) calculator web application.

---

## ✨ Key Features

- 📊 **Multi-Semester Breakdown**: Add, edit, collapse, duplicate, and delete semesters with individual course credit weights and grade letter/point mappings.
- 🎯 **Target CGPA & What-If Planner**: Live feasibility calculator computing the exact average GPA required in remaining credits to achieve a target graduation CGPA. Includes alerts for unachievable goals and confetti celebrations for milestones!
- 🏛️ **Multi-Scale Grading Presets**:
  - **Standard 4.0 Scale** (A+, A, A-, B+, B, B-, C+, C, C-, D+, D, F)
  - **4.3 Honors Scale** (with A+ = 4.3)
  - **5.0 Scale** (Singapore NTU/NUS, Nigeria, UK-aligned polytechnics)
  - **10.0 UGC / AICTE Scale** (with percentage conversion `CGPA × 9.5`)
  - **Custom Scale Builder**: Define custom grade letters, points, and scale maximums.
- 📈 **Visual Progress & Analytics**:
  - Semester GPA progression bar chart
  - Overall degree grade distribution breakdown
  - Real-time Academic Honors & Standing badge (Summa Cum Laude, Dean's List, First Class with Distinction, Good Standing)
- 📄 **Academic Transcript PDF Export & Print**: Generate an official formatted printable grade report with student details and full semester breakdown.
- 💾 **100% Client-Side Privacy & Auto-Save**: Real-time auto-saving to `localStorage` with zero login friction, plus JSON backup export & restore.
- 🌓 **Dark & Light Mode**: Smooth theme toggling with glassmorphism design.
- 📚 **Demo Mode**: One-click "Demo Data" button to instantly explore with realistic sample computer science semesters.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm installed.

### Development Server
```bash
# Navigate to the project directory
cd "C:\Users\hp\.gemini\antigravity\scratch\cgpa-calculator"

# Start Vite development server
npm run dev
```

The application will run locally at `http://localhost:3000`.

### Production Build
```bash
npm run build
```

---

## 🧮 Mathematical Formulas

### Semester GPA (SGPA)
$$\text{SGPA} = \frac{\sum (\text{Course Credit Hours} \times \text{Grade Points})}{\sum \text{Course Credit Hours}}$$

### Cumulative GPA (CGPA)
$$\text{CGPA} = \frac{\sum_{\text{all semesters}} \text{Quality Points}}{\sum_{\text{all semesters}} \text{Credit Hours}}$$

### Target Required GPA
$$\text{Required Future GPA} = \frac{(\text{Completed Credits} + \text{Remaining Credits}) \times \text{Target CGPA} - (\text{Completed Credits} \times \text{Current CGPA})}{\text{Remaining Credits}}$$

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **Icons**: Lucide React
- **Document Generation**: jsPDF + html2canvas
- **Animation & Effects**: Canvas Confetti
