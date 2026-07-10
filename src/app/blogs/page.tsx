'use client';

import { useQuery } from '@tanstack/react-query';
import { shopifyService, ShopifyBlog } from '@/services/shopifyService';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

export default function BlogsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['shopify-blogs'],
    queryFn: () => shopifyService.getBlogs(),
  });

  const blogs = (data?.data as ShopifyBlog[]) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500">
        Failed to load blogs. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#FAFAFA] pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#151515] mb-4">
            Journal
          </h1>
          <p className="text-[#525252] text-lg max-w-2xl font-sans">
            Stories, insights, and inspiration from the Faoo team.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        {blogs.length === 0 ? (
          <div className="text-center py-20 text-[#525252]">
            <p className="text-xl">No journal entries found.</p>
            <p className="mt-2 text-sm">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {blogs.map((blog) => (
              <Link 
                href={`/blogs/${blog.handle}`} 
                key={blog.handle}
                className="group flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#FAFAFA] mb-6">
                  {blog.image || blog.featured_image ? (
                    <img 
                      src={blog.image || blog.featured_image} 
                      alt={blog.title || 'Blog post image'} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F5F5F5]">
                      <span className="font-display text-4xl text-[#151515]/10">F</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-display text-2xl text-[#151515] mb-3 group-hover:text-black transition-colors">
                  {blog.title || 'Untitled Entry'}
                </h3>
                
                {blog.excerpt && (
                  <p className="text-[#525252] font-sans line-clamp-2 mb-4">
                    {blog.excerpt}
                  </p>
                )}

                <div className="flex items-center text-sm font-sans font-medium uppercase tracking-widest text-[#151515] mt-auto">
                  Read More 
                  <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
