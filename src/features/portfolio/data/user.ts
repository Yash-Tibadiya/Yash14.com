import type { User } from "@/features/portfolio/types/user";

export const USER: User = {
  firstName: "Yash",
  lastName: "Timbadiya",
  displayName: "Yash Timbadiya",
  username: "Yash_1434",
  gender: "male",
  pronouns: "he/him",
  bio: "Creating with code. Small details matter.",
  flipSentences: [
    "Creating with code. Small details matter.",
    "Full Stack Developer",
    "Open Source Contributor",
  ],
  address: "Surat, India",
  //TODO: Add phone number and email
  phoneNumberB64: "Kzg0Nzc3ODg4MTQ4", // E.164 format, base64 encoded (https://t.io.vn/base64-string-converter)
  emailB64: "ZGFpQGNoYW5oZGFpLmNvbQ==", // base64 encoded
  //TODO: Add website
  website: "",
  jobTitle: "Full Stack Developer",
  jobs: [
    {
      title: "Full Stack Developer",
      company: "EnactOn",
      website: "https://www.enacton.com/?atp=ncdai",
      experienceId: "EnactOn",
    },
  ],
  about: `
- I'm Yash Timbadiya (call me Yash) — a Full Stack Developer with 1+ years of experience, known for pixel-perfect execution and an obsessive attention to detail.
- Passionate about exploring new technologies and turning ideas into reality through polished, thoughtfully crafted projects.
`,
  //TODO: Add name pronunciation url
  avatar: "",
  avatarVariants: {
    lightOff: "",
    lightOn: "",
    darkOff: "",
    darkOn: "",
  },
  ogImage: "",
  namePronunciationUrl: "",
  timeZone: "Asia/Kolkata",
  keywords: [
    "Full Stack Developer",
    "Open Source Contributor",
    "Yash",
    "Yash_1434",
    "Yash Timbadiya",
    "Yash Timbadiya Portfolio",
    "Yash Timbadiya Projects",
    "Yash Timbadiya Skills",
    "Yash Timbadiya Experience",
    "Yash Timbadiya Education",
    "Yash Timbadiya Contact",
    "Yash Timbadiya About",
  ],
  dateCreated: "2026-6-11", // YYYY-MM-DD
};
