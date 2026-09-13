import type { Education } from "@/features/portfolio/types/education";

export const EDUCATION: Education[] = [
  {
    id: "ppsu",
    school: "P P Savani University",
    degree: "Bachelor of Technology (B.Tech)",
    fieldOfStudy: "Information Technology",
    period: {
      start: "09.2021",
      end: "04.2025",
    },
    description: `- Completed a Bachelor of Technology in Information Technology.
- Developed strong foundations in data structures, databases, object-oriented programming, web development, and software engineering.
- Turned academic learning into production experience by starting professional full-stack development work before graduation.

Selected projects:
- [Plura](https://github.com/Yash-Tibadiya/Plura) — Built a multi-tenant SaaS platform with a drag-and-drop website and funnel builder, agency and sub-account management, Stripe subscriptions and Connect payments, dashboards, and a Kanban project board.
- [Community](https://github.com/Yash-Tibadiya/Community) — Built a real-time community platform with customizable channels, direct messaging, file attachments, audio and video calls, roles, invitations, and responsive light and dark interfaces.

Achievements:
- Built and shipped custom business websites and e-commerce experiences while completing the degree.
- Created [creative.yash14.com](https://github.com/Yash-Tibadiya/Old-Portfolio), an open-source mac os inspired developer portfolio.
- Progressed from independent projects and freelance work into full-time full-stack development.`,
    skills: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "Prisma",
      "PostgreSQL",
      "Socket.io",
      "Stripe",
      "Data Structures",
      "DBMS",
      "OOP",
      "Software Engineering",
    ],
    isExpanded: true,
  },
];
