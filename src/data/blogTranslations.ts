import { BlogPost } from '../types';

export type BlogLanguage = 'en' | 'bn';

export interface BlogTranslationData {
  title: string;
  excerpt: string;
  content: string;
  keywords: string[];
  read_time_minutes?: number;
}

export const BLOG_TRANSLATIONS: Record<string, BlogTranslationData> = {
  'optimizing-3d-web-experiences-webgl-threejs-performance': {
    title: 'থ্রিডি ওয়েব অপটিমাইজেশন: ওয়েবজিএল, থ্রি.জেএস এবং আধুনিক ফ্রন্টএন্ড পারফরম্যান্স',
    excerpt: 'ওয়েব অ্যাপ্লিকেশনে পেজ লোড স্পিড বা মোবাইল রেসপন্সিভনেস না কমিয়ে মসৃণ ৬০ এফপিএস গ্রাফিক্স তৈরির কার্যকর স্থাপত্য কৌশল।',
    content: `আধুনিক ওয়েব প্রোডাক্টে থ্রিডি গ্রাফিক্স সাধারণ ভিজ্যুয়াল ডেমো থেকে পরিণত হয়েছে আকর্ষণীয় ডিজিটাল ব্র্যান্ডিংয়ের অন্যতম প্রধান মাধ্যমে। তবে থ্রি.জেএস (Three.js) বা কাস্টম ওয়েবজিএল (WebGL) পাইপলাইন প্রডাকশন অ্যাপে ব্যবহারের সময় পারফরম্যান্স ব্যালান্স করা অত্যন্ত জরুরি।

### প্রধান নিয়ম: জিপিইউ (GPU) ও সিপিইউ (CPU) সাইকেলের সঠিক বাজেট

ব্রাউজার যখন একটি থ্রিডি সিন রেন্ডার করে, তখন সিপিইউ-তে জাভাস্ক্রিপ্ট কোড এক্সিকিউট হয় এবং জিপিইউ-তে শেডার রাস্টারাইজেশন সম্পন্ন হয়। মসৃণ ৬০ ফ্রেম পার সেকেন্ড (বা ১২০ হার্টজ ডিসপ্লেতে ১২০ এফপিএস) ধরে রাখতে প্রতিটি ফ্রেমের হিসাব ও পেইন্টিং ১৬.৬ মিলিমেকেন্ডের মধ্যে সম্পন্ন হতে হয়।

১. **ড্র কল (Draw Calls) কমান**: অতিরিক্ত ম্যাটেরিয়াল ও জিওমেট্রি ইনস্ট্যান্স এড়িয়ে চলুন। ইনস্ট্যান্সড মেশ (Instanced Mesh) ব্যবহার করলে শত শত উপাদান একটিমাত্র ড্র কলেই রেন্ডার করা সম্ভব।
২. **ক্যানভাস ইনিশিয়ালাইজেশন ডিফার করুন**: ব্রাউজারের ফার্স্ট কনটেন্টফুল পেইন্ট (FCP) কখনোই ভারী টেক্সচার বা শেডার কম্পাইলেশন দিয়ে আটকে রাখবেন না। \`requestIdleCallback\` বা ইন্টারসেকশন অবজারভারের সাহায্যে অলসভাবে (lazily) ক্যানভাস লোড করুন।
৩. **জিওমেট্রি ও টেক্সচার পরিষ্কার (Dispose) করুন**: সিঙ্গেল পেজ অ্যাপ্লিকেশনে আনমাউন্ট হলে ওয়েবজিএল বাফার স্বয়ংক্রিয়ভাবে মেমরি থেকে মুছে যায় না। সবসময় অব্যবহৃত বাফার ও টেক্সচারে \`.dispose()\` কল করুন।

### মোবাইল-ফার্স্ট স্কেলিং ও ডিভাইস প্রোফাইলিং

সব ভিজিটরের কাছে শক্তিশালী জিপিইউ সমৃদ্ধ কম্পিউটার নাও থাকতে পারে। ডিভাইস পিক্সেল রেশিও (\`window.devicePixelRatio\`) সনাক্ত করে রেন্ডার রেজোলিউশন ১.০x থেকে ১.৫x এর মধ্যে সীমাবদ্ধ রাখলে ব্যাটারি খরচ কম হয় এবং ডিভাইস অতিরিক্ত গরম হওয়া থেকে রক্ষা পায়।`,
    keywords: ['ওয়েবজিএল', 'থ্রিজেএস', 'পারফরম্যান্স', 'ফ্রন্টএন্ড', 'থ্রিডি-গ্রাফিক্স', 'ক্রিয়েটিভ-টেক'],
    read_time_minutes: 4,
  },

  'modern-web-animation-architecture-css-canvas-motion': {
    title: 'আধুনিক ওয়েব অ্যানিমেশন আর্কিটেকচার: সিএসএস বনাম ক্যানভাস বনাম মোশন ফিজিক্স',
    excerpt: 'আধুনিক ওয়েব অ্যাপে হার্ডওয়্যার-অ্যাক্সিলারেটেড সিএসএস, জিপিইউ ক্যানভাস লুপ এবং কম্পোনেন্ট জেস্টার ফিজিক্স ব্যবহারের তুলনামূলক বিশ্লেষণ।',
    content: `সাবলীল ও মসৃণ অ্যানিমেশন যেকোনো সাধারণ ইউজার ইন্টারফেসকে অত্যন্ত জীবন্ত ও প্রিমিয়াম অভিজ্ঞতায় রূপান্তর করে। তবে ভুল এনিমেশন টেকনোলজি বাছাই করলে ইন্টারফেসে ল্যাগ এবং ব্যাটারি ড্রেইন দেখা দিতে পারে।

### অ্যানিমেশন টেকনোলজির তুলনামূলক পর্যালোচনা

- **সিএসএস ট্রানজিশন ও ট্রান্সফর্ম**: ছোটখাটো ইন্টারেকশন, বাটন হোভার এফেক্ট এবং ফেড-ইন ভিজ্যুয়ালের জন্য আদর্শ। সিএসএস \`transform\` এবং \`opacity\` কম্পোজিটর থ্রেডে চলে, ফলে লেআউট রিফ্লো তৈরি করে না।
- **স্প্রিং ও ফিজিক্স লাইব্রেরি (Motion)**: জেসচার-ভিত্তিক ইন্টারঅ্যাকশন যেমন স্লাইডার, ড্রয়ার বা ম্যাগনেটিক বাটনের জন্য সেরা। এতে অ্যানিমেশন রোবোটিক না হয়ে প্রাকৃতিক মনে হয়।
- **ক্যানভাস ও ওয়েবজিএল রেন্ডারার**: পার্টিকেল গ্রিড, ফ্লুইড সিমুলেশন বা ব্যাকগ্রাউন্ড আর্ট যেখানে একসাথে হাজার হাজার উপাদান নড়াচড়া করে, সেগুলোর জন্য ক্যানভাস অপরিহার্য।

### মসৃণ অ্যানিমেশনের সেরা উপায়

- অ্যানিমেটেড লেয়ারে সতর্কভাবে \`will-change: transform\` ব্যবহার করুন।
- যেকোনো ম্যানুয়াল ক্যালকুলেশনে \`setInterval\`-এর বদলে \`requestAnimationFrame\` ব্যবহার করুন।
- স্ক্রোল ইভেন্টে প্যাসিভ লিসেনার (\`{ passive: true }\`) যুক্ত করুন।`,
    keywords: ['ওয়েব-অ্যানিমেশন', 'সিএসএস', 'রিঅ্যাক্ট', 'মোশন', 'ইউআই-ইউএক্স'],
    read_time_minutes: 5,
  },

  'building-next-generation-interactive-portfolios-that-convert': {
    title: 'ক্লায়েন্ট আকৃষ্ট করার মতো আধুনিক ইন্টারঅ্যাক্টিভ পোর্টফোলিও তৈরি',
    excerpt: 'কীভাবে ডেভেলপাররা দৃষ্টিনন্দন ভিজ্যুয়ালের সাথে চমৎকার কোর ওয়েব ভাইটাল বজায় রেখে ক্লায়েন্টদের আকৃষ্ট করার মতো পোর্টফোলিও বানাতে পারেন।',
    content: `একজন ডেভেলপারের পোর্টফোলিও শুধুমাত্র রিজিউমির তালিকা নয়; এটি তার কাজের মান, প্রযুক্তিগত দক্ষতা এবং বাস্তব প্রকল্পে বাস্তবায়নের সক্ষমতার প্রমাণ।

### ১. মুখে না বলে কাজে প্রমাণ দিন

বড় ক্লায়েন্ট বা ডিজাইন এজেন্সি বাস্তব প্রমাণের দিকে নজর দেয়। শুধু স্ট্যাটিক স্ক্রিনশট না দেখিয়ে ইন্টারঅ্যাক্টিভ প্রোটোটাইপ, লাইভ ডেমো এবং জটিল সমস্যা কীভাবে সমাধান করেছেন তার কেস স্টাডি তুলে ধরুন।

### ২. দ্রুতগতির ফার্স্ট ইম্প্রেশন (২ সেকেন্ডের নিচে লোড টাইম)

যে পোর্টফোলিও লোড হতে অতিরিক্ত সময় নেয়, তার ভেতরের কাজ যতই ভালো হোক না কেন ভিজিটর পেজ ছেড়ে চলে যায়। কোর ওয়েব ভাইটাল (Core Web Vitals) বিশেষ করে এলসিপি (LCP) এবং সিএলএস (CLS) উন্নত রাখা জরুরি।

### ৩. স্পষ্ট কল টু অ্যাকশন (CTA)

প্রতিটি প্রজেক্ট বা শোকেসের সাথে যোগাযোগের সুস্পষ্ট মাধ্যম রাখুন। ক্লায়েন্ট যেন সহজেই ইমেইল, ফর্ম বা সোশ্যাল মিডিয়ার মাধ্যমে যোগাযোগ করতে পারে তা নিশ্চিত করুন।`,
    keywords: ['পোর্টফোলিও', 'কোর-ওয়েব-ভাইটাল', 'ফ্রিল্যান্সিং', 'ফ্রন্টএন্ড', 'ওয়েব-ডেভেলপার'],
    read_time_minutes: 5,
  },

  'seo-strategies-single-page-applications-spa-2026': {
    title: '২০২৬ সালে সিঙ্গেল পেজ অ্যাপ্লিকেশনের (SPA) জন্য কার্যকারী এসইও কৌশল',
    excerpt: 'স্ট্রাকচার্ড ডাটা, ডায়নামিক ওপেন গ্রাফ মেটা ট্যাগ এবং স্মার্ট সাইটম্যাপের মাধ্যমে ক্লায়েন্ট-সাইড অ্যাপ্লিকেশনের সার্চ ইঞ্জিন অপটিমাইজেশন গাইড।',
    content: `সিঙ্গেল পেজ অ্যাপ্লিকেশন (SPA) ব্যবহারকারীদের অত্যন্ত দ্রুতগতির ডেস্কটপ-সম অভিজ্ঞতা দেয়, কিন্তু সার্চ ইঞ্জিনের ক্রলিং ও ইনডেক্সিংয়ের জন্য কিছু বাড়তি কৌশল প্রয়োগ করতে হয়।

### এসপিএ এসইওর প্রধান স্তম্ভসমূহ

১. **ডায়নামিক মেটা ট্যাগ সিঙ্ক্রোনাইজেশন**: ক্লায়েন্ট-সাইড রাউটে প্রতিবার পেজ পরিবর্তনের সাথে সাথে ডকুমেন্ট টাইটেল, মেটা ডেসক্রিপশন এবং ক্যানোনিকাল ট্যাগ আপডেট হতে হবে।
২. **Schema.org স্ট্রাকচার্ড ডাটা**: গুগল যেন সার্চ রেজাল্টে রিচ স্নিপেট দেখাতে পারে সেজন্য JSON-LD ফরম্যাটে পার্সন, আর্টিকেল এবং ওয়েবসাইট স্কিমা যুক্ত করুন।
৩. **হালনাগাদ সাইটম্যাপ (sitemap.xml)**: সার্চ ইঞ্জিন রোবট যেন সহজে পেজ আবিষ্কার করতে পারে সেজন্য সাইটম্যাপ নিয়মিত আপডেট রাখুন।
৪. **সিম্যান্টিক এইচটিএমএল**: সঠিক হেডিং হায়ারার্কি (H1, H2, H3) এবং অর্থপূর্ণ টেক্সট ব্যবহার করুন।`,
    keywords: ['এসইও', 'এসপিএ', 'সার্চ-ইঞ্জিন', 'রিঅ্যাক্ট', 'মেটা-ট্যাগ', 'ওয়েব-ডেভেলপমেন্ট'],
    read_time_minutes: 5,
  },
};

/**
 * Convert western numerals (0-9) to Bengali numerals (০-৯)
 */
export function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bengaliDigits[parseInt(d, 10)]);
}

/**
 * Format publication date according to selected language
 */
export function formatPostDate(dateStr: string, lang: BlogLanguage): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    if (lang === 'bn') {
      const bengaliMonths = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const day = toBengaliNumber(d.getDate());
      const month = bengaliMonths[d.getMonth()];
      const year = toBengaliNumber(d.getFullYear());
      return `${day} ${month}, ${year}`;
    }

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format read time according to selected language
 */
export function formatReadTime(minutes: number, lang: BlogLanguage): string {
  if (lang === 'bn') {
    return `${toBengaliNumber(minutes)} মিনিট পাঠ`;
  }
  return `${minutes} min read`;
}

/**
 * Returns a translated version of a BlogPost if available for the given language
 */
export function getTranslatedPost(post: BlogPost, lang: BlogLanguage): BlogPost {
  if (lang === 'en') {
    // If post is natively English or has explicit English fields
    return post;
  }

  // Language is 'bn'
  // 1. Check if post has explicit Bengali fields
  if (post.title_bn || post.excerpt_bn || post.content_bn) {
    return {
      ...post,
      title: post.title_bn || post.title,
      excerpt: post.excerpt_bn || post.excerpt,
      content: post.content_bn || post.content,
      keywords: post.keywords_bn || post.keywords,
    };
  }

  // 2. Check static translation mapping by slug or id
  const translation = BLOG_TRANSLATIONS[post.slug] || BLOG_TRANSLATIONS[post.id];
  if (translation) {
    return {
      ...post,
      title: translation.title,
      excerpt: translation.excerpt,
      content: translation.content || post.content,
      keywords: translation.keywords || post.keywords,
      read_time_minutes: translation.read_time_minutes || post.read_time_minutes,
    };
  }

  // 3. If post content is already written in Bengali (contains Bengali Unicode range)
  const isAlreadyBengali = /[\u0980-\u09FF]/.test(post.title);
  if (isAlreadyBengali) {
    return post;
  }

  return post;
}
