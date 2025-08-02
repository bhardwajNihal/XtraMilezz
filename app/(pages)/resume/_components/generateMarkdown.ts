import { resumeType } from "./ResumeForm";

export function generateMarkdown(resume: resumeType): string {
  let md = "";

  // 1. Header: Full Name and Contact Information
  // The header uses a single line for contact info, making it compact and easy to scan.
  md += `# ${resume.fullname}\n\n`;
  const contactInfo: string[] = [];
  if (resume.email) contactInfo.push(`**Email:** ${resume.email}`);
  if (resume.phone) contactInfo.push(`**Phone:** ${resume.phone}`);
  if (resume.linkedin)
    contactInfo.push(
      `**LinkedIn:** [${resume.linkedin.replace(/(^\w+:|^)\/\//, "")}](${
        resume.linkedin
      })`
    );
  if (resume.github)
    contactInfo.push(
      `**GitHub:** [${resume.github.replace(/(^\w+:|^)\/\//, "")}](${
        resume.github
      })`
    );
  if (resume.twitter)
    contactInfo.push(
      `**Twitter:** [${resume.twitter.replace(/(^\w+:|^)\/\//, "")}](${
        resume.twitter
      })`
    );
  md += contactInfo.join(" | ") + "\n\n";

  // 2. Summary/Bio
  // A clean, standalone section for the professional summary.
  md += "---" + "\n";
  md += `## Professional Summary\n\n`;
  md += `${resume.bio}\n\n`;

  // 3. Skills
  // Formats skills as a comma-separated list for a clean, compact appearance.
  md += "---" + "\n";
  md += `## Skills\n\n`;
  const skillsList = resume.skills
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");
  md += skillsList.join(" | ") + "\n\n";

  // 4. Experience
  // Each experience is a separate block with a consistent heading and bullet points
  // for the description, which is crucial for ATS parsing.
  if (resume.experience?.length) {
    md += "---" + "\n";
    md += `## Experience\n\n`;
    resume.experience.forEach((exp) => {
      // Use consistent subheadings for each role
      md += `### ${exp.role} at ${exp.organization}\n`;
      md += `*${exp.startDate} – ${
        exp.currentlyWorking ? "Present" : exp.endDate
      }*\n\n`;
      // Convert description into a bulleted list for better readability
      const descriptionLines = exp.description
        .split("\n")
        .filter((line) => line.trim() !== "");
      descriptionLines.forEach((line) => {
        md += `- ${line.trim()}\n`;
      });
      md += "\n";
    });
  }

  // 5. Projects
  // Formatted similarly to experience with clear headings and bullet points.
  if (resume.projects?.length) {
    md += "---" + "\n";
    md += `## Projects\n\n`;
    resume.projects.forEach((proj) => {
      md += `### ${proj.title}\n`;
      const descriptionLines = proj.description
        .split("\n")
        .filter((line) => line.trim() !== "");
      descriptionLines.forEach((line) => {
        md += `- ${line.trim()}\n`;
      });
      md += "\n";
    });
  }

  // 6. Certifications
  // A clean list of certifications with dates.
  if (resume.certifications?.length) {
    md += "---" + "\n";
    md += `## Certifications\n\n`;
    resume.certifications.forEach((cert) => {
      md += `- **${cert.title}**\n`;
      md += `  *Issued on: ${cert.issuedOn}*\n`;
      md += `  ${cert.description}\n\n`;
    });
  }

  // 7. Achievements
  // A clean list of achievements.
  if (resume.achievements?.length) {
    md += "---" + "\n";
    md += `## Achievements\n\n`;
    resume.achievements.forEach((ach) => {
      md += `- **${ach.title}**\n`;
      if (ach.description) {
        const descriptionLines = ach.description
          .split("\n")
          .filter((line) => line.trim() !== "");
        descriptionLines.forEach((line) => {
          md += `  - ${line.trim()}\n`;
        });
      }
      md += "\n";
    });
  }

  return md.trim(); // Trim any trailing whitespace
}
