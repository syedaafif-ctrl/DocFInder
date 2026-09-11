// src/app/blog/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Health Blog | DocFinder BD',
  description: 'Expert health tips, medical guides, and wellness articles from Bangladesh\'s top doctors.',
};

const SAMPLE_POSTS = [
  {
    slug: 'diabetes-prevention-bangladesh',
    title: '10 Ways to Prevent Diabetes in Bangladesh',
    excerpt: 'With rising diabetes rates in Bangladesh, here are proven strategies to prevent and manage this condition effectively.',
    category: 'Health Tips',
    readTime: '5 min read',
    date: 'May 10, 2026',
    image: '🩺',
  },
  {
    slug: 'heart-health-tips',
    title: 'How to Keep Your Heart Healthy',
    excerpt: 'Cardiologists share simple lifestyle changes that dramatically reduce your risk of heart disease.',
    category: 'Cardiology',
    readTime: '4 min read',
    date: 'May 8, 2026',
    image: '❤️',
  },
  {
    slug: 'child-vaccination-guide',
    title: 'Complete Vaccination Guide for Children in Bangladesh',
    excerpt: 'Everything parents need to know about the EPI schedule and keeping their children protected.',
    category: 'Pediatrics',
    readTime: '6 min read',
    date: 'May 5, 2026',
    image: '👶',
  },
  {
    slug: 'mental-health-awareness',
    title: 'Breaking the Stigma Around Mental Health in Bangladesh',
    excerpt: 'Mental health disorders affect millions of Bangladeshis. Here\'s how we can talk about it openly.',
    category: 'Mental Health',
    readTime: '7 min read',
    date: 'May 2, 2026',
    image: '🧠',
  },
  {
    slug: 'dengue-fever-prevention',
    title: 'Dengue Fever: Prevention and Treatment',
    excerpt: 'As dengue season approaches, learn how to protect your family and what to do if symptoms appear.',
    category: 'Infectious Disease',
    readTime: '5 min read',
    date: 'April 28, 2026',
    image: '🦟',
  },
  {
    slug: 'womens-health-checkups',
    title: 'Essential Health Checkups Every Woman Should Get',
    excerpt: 'A complete guide to routine screening tests that help women stay healthy at every age.',
    category: "Women's Health",
    readTime: '6 min read',
    date: 'April 25, 2026',
    image: '🤱',
  },
];

const CATEGORIES = ['All', 'Health Tips', 'Cardiology', 'Pediatrics', 'Mental Health', "Women's Health", 'Nutrition'];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-20">
        {/* Hero */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-widest mb-2">
              <BookOpen className="w-4 h-4" /> Health Blog
            </div>
            <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 mb-2">
              Expert Health Tips & Guides
            </h1>
            <p className="text-slate-500 text-sm max-w-xl">
              Evidence-based health articles written and reviewed by Bangladesh's top doctors and specialists.
            </p>
            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mt-5">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat}
                  className={`text-xs px-4 py-1.5 rounded-full border font-medium transition-colors ${
                    i === 0
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600 bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SAMPLE_POSTS.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                {/* Placeholder image */}
                <div className="h-36 bg-gradient-to-br from-sky-50 to-slate-100 flex items-center justify-center text-5xl">
                  {post.image}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <h2 className="font-bold text-slate-900 text-sm leading-snug mb-2 group-hover:text-sky-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">{post.date}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
                    >
                      Read more <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}