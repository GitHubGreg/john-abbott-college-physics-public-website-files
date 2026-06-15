import { config } from "./config.js";
import { slugifySegment } from "./slug.js";

const COURSE_PATTERN =
  /\b(SN[123]|NYB|NYC|SF2)\b/i;

/** Maps folder codes to display names used in subsection headings. */
const courseLabels: Record<string, string> = {
  SN1: "Physics SN1",
  SN2: "Physics SN2",
  SN3: "Physics SN3",
  NYB: "Physics NYB",
  NYC: "Physics NYC",
  SF2: "Physique SF2",
};

function courseLabel(courseCode: string): string {
  const normalized = courseCode.toUpperCase();
  return courseLabels[normalized] ?? `Physics ${normalized}`;
}

function compareCourseCodes(a: string, b: string): number {
  const order = config.courseOrder as readonly string[];
  const rankA = order.indexOf(a.toUpperCase());
  const rankB = order.indexOf(b.toUpperCase());
  const safeA = rankA === -1 ? order.length : rankA;
  const safeB = rankB === -1 ? order.length : rankB;
  if (safeA !== safeB) {
    return safeA - safeB;
  }
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export function inferCourseFromFilename(filename: string): string {
  const match = filename.match(COURSE_PATTERN);
  return match ? match[1].toUpperCase() : "";
}

export function parseSourcePath(relativePath: string): {
  category: string;
  course: string;
  subsection: string;
} {
  const parts = relativePath.split("/").filter(Boolean);
  const category = parts[0] ?? "General";

  if (parts.length <= 1) {
    return { category, course: "", subsection: "" };
  }

  if (parts.length === 2) {
    return {
      category,
      course: inferCourseFromFilename(parts[1]),
      subsection: "",
    };
  }

  return {
    category,
    course: parts[1],
    subsection: parts.length >= 4 ? parts[2] : "",
  };
}

export function getSubsectionTitle(
  category: string,
  course: string,
  subsection: string,
): string {
  const courseKey = course.toUpperCase();
  const label = courseLabel(courseKey);

  if (category === "Textbook") {
    return `${label} textbook`;
  }

  if (category === "Equations") {
    if (courseKey === "SF2") {
      return `${label} Feuille d'équations`;
    }
    return `${label} Equation Sheet`;
  }

  if (category === "Problem Set Solutions") {
    if (subsection.toLowerCase() === "caroline youtube problems") {
      return "Additional NYB Problems";
    }
    if (subsection.toLowerCase() === "supplementary") {
      if (courseKey === "NYB") {
        return "Solutions to Supplementary NYB Problems";
      }
      if (courseKey === "SN3" || courseKey === "NYC") {
        return `Answers to Supplementary ${courseKey} Problems`;
      }
      return `Supplementary ${courseKey} Problems`;
    }
    return `${label} Problem Set Solutions`;
  }

  if (category === "Sample Final Exams") {
    return `${label} Sample Final Exam`;
  }

  if (course) {
    return label;
  }

  return "General";
}

export function compareSubsections(
  a: { course: string; subsection: string },
  b: { course: string; subsection: string },
): number {
  const courseCompare = compareCourseCodes(a.course, b.course);
  if (courseCompare !== 0) {
    return courseCompare;
  }

  const supplementary = "supplementary";
  const rank = (subsection: string) =>
    subsection.toLowerCase() === supplementary ? 1 : 0;
  return rank(a.subsection) - rank(b.subsection);
}

export function usesCourseSubsections(category: string): boolean {
  return (config.categoriesWithCourseSubfolders as readonly string[]).includes(
    category,
  );
}

export function categoryAnchorId(category: string): string {
  return slugifySegment(category);
}

export function subsectionAnchorId(
  category: string,
  course: string,
  subsection: string,
): string {
  const parts = [category, course];
  if (subsection) {
    parts.push(subsection);
  }
  return slugifySegment(parts.join("-"));
}
