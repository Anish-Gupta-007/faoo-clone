'use client';

import { useQuery } from '@tanstack/react-query';
import { shopifyService, ShopifyBlog } from '@/services/shopifyService';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { useParams } from 'next/navigation';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['shopify-blog', slug],
    queryFn: () => shopifyService.getBlogByHandle(slug),
    enabled: !!slug,
  });

  const blog = data?.data as ShopifyBlog | undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <h1 className="font-display text-4xl text-[#151515] mb-4">Blog not found</h1>
        <p className="text-[#525252] font-sans mb-8">The entry you're looking for doesn't exist or has been removed.</p>
        <Link href="/blogs" className="font-sans text-sm font-semibold uppercase tracking-widest border border-[#151515] px-6 py-3 rounded-full hover:bg-[#151515] hover:text-white transition-colors">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/blogs"
          className="inline-flex items-center text-[#525252] hover:text-[#151515] transition-colors font-sans text-sm uppercase tracking-widest font-medium mb-12"
        >
          <ArrowLeft size={14} className="mr-2" /> Back to Journal
        </Link>

        <header className="mb-12">
          {blog.date && (
            <time className="block text-sm text-[#525252] font-sans mb-4 uppercase tracking-widest">
              {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          )}
          <h1 className="font-display text-4xl md:text-5xl lg:text-[64px] leading-[1.1] text-[#151515] mb-8">
            {blog.title || 'Untitled Entry'}
          </h1>
          
          {blog.author && (
            <p className="font-sans text-[#525252]">By {blog.author}</p>
          )}
        </header>

        {(blog.image || blog.featured_image) && (
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#F5F5F5] mb-16">
            <img 
              src={blog.image || blog.featured_image} 
              alt={blog.title || 'Blog featured image'}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-normal prose-a:text-[#151515] prose-img:rounded-xl font-sans text-[#333333] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content || blog.body || '<p>No content available for this entry.</p>' }}
        />
      </div>
    </article>
  );
}
