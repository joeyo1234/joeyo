import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const essaysDirectory = path.join(process.cwd(), 'content/essays');

export interface Essay {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  featured?: boolean;
  externalUrl?: string;
  content: string;
}

export function getAllEssays(): Essay[] {
  const fileNames = fs.readdirSync(essaysDirectory);
  const essays = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(essaysDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        tags: data.tags || [],
        featured: data.featured || false,
        externalUrl: data.externalUrl || undefined,
        content,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return essays;
}

export function getEssayBySlug(slug: string): Essay | undefined {
  const essays = getAllEssays();
  return essays.find((essay) => essay.slug === slug);
}
