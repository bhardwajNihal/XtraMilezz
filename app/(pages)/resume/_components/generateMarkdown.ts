import { resumeType } from "./ResumeForm";

export function generateMarkdown(resume: resumeType): string {
  let md = `# ${resume.fullname}\n\n`;

  md += `**Email:** ${resume.email}\n\n`;
  md += `**Phone:** ${resume.phone ?? "N/A"}\n\n`;
  md += `**LinkedIn:** [${resume.linkedin}](${resume.linkedin})\n\n`;
  if (resume.github)
    md += `**GitHub:** [${resume.github}](${resume.github})\n\n`;
  if (resume.twitter)
    md += `**Twitter:** [${resume.twitter}](${resume.twitter})\n\n`;

  md += `## Bio\n${resume.bio}\n\n`;

  md += `## Skills\n${resume.skills
    .split(",")
    .map((s) => `- ${s.trim()}`)
    .join("\n")}\n\n`;

  if (resume.experience?.length) {
    md += `## Experience\n`;
    resume.experience.forEach((exp) => {
      md += `### ${exp.role} at ${exp.organization}\n`;
      md += `📅 ${exp.startDate} – ${
        exp.currentlyWorking ? "Present" : exp.endDate
      }\n\n`;
      md += `${exp.description}\n\n`;
    });
  }

  if (resume.projects?.length) {
    md += `## Projects\n`;
    resume.projects.forEach((proj,index) => {
      md += `### ${index+1}. ${proj.title}\n`;
      md += `${proj.description}\n`;
    });
  }

  if (resume.certifications?.length) {
    md += `## Certifications\n`;
    resume.certifications.forEach((cert,index) => {
      md += `### ${index+1}. ${cert.title}\n`;
      md += `${cert.description}\n`;
      md += `📅 ${cert.issuedOn}\n\n`;
    });
  }

  if (resume.achievements?.length) {
    md += `## Achievements\n`;
    resume.achievements.forEach((ach, index) => {
      md += `### ${index+1}. ${ach.title}\n`;
      md += `${ach.description}\n\n`;
    });
  }

  return md;
}
