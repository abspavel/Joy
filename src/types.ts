export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keywords: string[];
  published: boolean;
  published_at: string;
  read_time_minutes?: number;
  created_at: string;
}
