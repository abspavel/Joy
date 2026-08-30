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
  language?: 'en' | 'bn';
  title_bn?: string;
  excerpt_bn?: string;
  content_bn?: string;
  keywords_bn?: string[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
  source?: string;
  message_id?: string;
}

