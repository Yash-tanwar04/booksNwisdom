import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')       // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '');          // Trim - from end of text
}

export function extractTextFromContent(content: any): string {
  if (!content) return "";
  if (typeof content === "string") {
    // Strip HTML tags
    return content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }
  if (typeof content === "object") {
    let text = "";
    const traverse = (node: any) => {
      if (!node) return;
      if (node.type === "text" && node.text) {
        text += " " + node.text;
      }
      if (Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };
    traverse(content);
    return text.replace(/\s+/g, " ").trim();
  }
  return "";
}

export function calculateReadingTime(content: any): number {
  const text = extractTextFromContent(content);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes || 1);
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "Recently";
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    return format(date, "d MMM yyyy");
  } catch (err) {
    return "Recently";
  }
}
