// src/services/productService.ts
import api from '@/lib/axios';
import { ProductDetailResponse, ProductFilters, Product, ProductVariant } from '@/types/product.types';
import { shopifyService } from './shopifyService';

function getUniqueSizes(variants: any[]): any[] {
  if (!variants || !Array.isArray(variants)) return [];
  const sizes = variants.map((v: any) => {
    const sizeOpt = v.selectedOptions?.find((o: any) => o.name.toLowerCase() === 'size')?.value;
    return sizeOpt || (v.title === 'Default Title' ? 'Free Size' : v.title);
  });
  return sizes.filter((val, idx, self) => self.indexOf(val) === idx);
}

const filterProductsByCategory = (products: any[], category: string): any[] => {
  const catLower = category.toLowerCase();

  if (catLower === 'men' || catLower === 'mens' || catLower === 'mens-clothing') {
    return products.filter((p: any) => {
      const titleLower = p.title.toLowerCase();
      const tagsLower = (p.tags || []).map((t: string) => t.toLowerCase());

      // Exclude exclusively female items
      const isFemaleItem = titleLower.includes('dress') ||
        titleLower.includes('peplum') ||
        titleLower.includes('skirt') ||
        titleLower.includes('women') ||
        titleLower.includes('lavender dress') ||
        titleLower.includes('tie-up') ||
        titleLower.includes('top') ||
        titleLower.includes('resort set') ||
        titleLower.includes('aura') ||
        titleLower.includes('ur full') ||
        titleLower.includes('pant') && !titleLower.includes('men') ||
        tagsLower.some((t: string) => t.includes('women') || t.includes('female') || t.includes('girl'));

      const isUnisex = titleLower.includes('unisex') || tagsLower.includes('unisex');

      if (isFemaleItem && !isUnisex) return false;
      return true; // Keep shirts, overshirts, pants, unisex items by default
    });
  }

  if (catLower === 'women' || catLower === 'womens' || catLower === 'womens-clothing') {
    return products.filter((p: any) => {
      const titleLower = p.title.toLowerCase();
      const tagsLower = (p.tags || []).map((t: string) => t.toLowerCase());

      const isFemaleItem = titleLower.includes('dress') ||
        titleLower.includes('peplum') ||
        titleLower.includes('skirt') ||
        titleLower.includes('women') ||
        titleLower.includes('lavender dress') ||
        titleLower.includes('tie-up') ||
        titleLower.includes('top') ||
        titleLower.includes('resort set') ||
        titleLower.includes('aura') ||
        titleLower.includes('ur full') ||
        titleLower.includes('pant') && !titleLower.includes('men') || // If it's a pant and not explicitly men's, we can include it or rely on tags
        tagsLower.some((t: string) => t.includes('women') || t.includes('female') || t.includes('girl'));

      const isUnisex = titleLower.includes('unisex') || tagsLower.includes('unisex');

      // Exclude accessories from clothing
      if (tagsLower.includes('accessories') || titleLower.includes('bandana') || titleLower.includes('scarf')) return false;

      // If it is explicitly female or unisex, keep it. Otherwise, exclude it (since default is men's).
      return isFemaleItem || isUnisex;
    });
  }

  if (catLower === 'accessories') {
    return products.filter((p: any) => {
      const titleLower = p.title.toLowerCase();
      const tagsLower = (p.tags || []).map((t: string) => t.toLowerCase());

      return tagsLower.includes('accessories') ||
        titleLower.includes('bandana') ||
        titleLower.includes('scarf') ||
        titleLower.includes('sunglasses');
    });
  }

  return products;
};

export const productService = {
  getProducts: async (filters: ProductFilters = {}) => {
    try {
      let data = [];
      const isLimitedCat = filters.category === 'limited-edition' || filters.category === 'limited_edition';
      const isNewCat = filters.category === 'new-collection' || filters.category === 'new_collection';

      let categoryHandle = filters.category;
      if (categoryHandle === 'men' || categoryHandle === 'mens') {
        categoryHandle = 'mens-clothing';
      } else if (categoryHandle === 'women' || categoryHandle === 'womens') {
        categoryHandle = 'womens-clothing';
      }

      if (isLimitedCat) {
        const res = await shopifyService.getProducts(filters.limit || 50);
        data = res.data || [];
        filters.isLimitedEdition = true;
      } else if (isNewCat) {
        const res = await shopifyService.getProducts(filters.limit || 50);
        data = res.data || [];
        filters.isNewCollection = true;
      } else if (categoryHandle && categoryHandle !== 'all-collection') {
        const res = await shopifyService.getCollectionByHandle(categoryHandle);
        data = res.data?.products || [];

        // Fallback: if collection has 0 products, fetch all products and filter them dynamically
        if (data.length === 0) {
          const allRes = await shopifyService.getProducts(100);
          const allProducts = allRes.data || [];
          data = filterProductsByCategory(allProducts, categoryHandle);
        }
      } else {
        const res = await shopifyService.getProducts(filters.limit || 20);
        data = res.data || [];
      }

      let mappedProducts = data.map((sp: any) => {
        const titleLower = sp.title.toLowerCase();
        const handleLower = sp.handle.toLowerCase();
        let fittingType: 'Fitted' | 'Regular' | 'Oversized' = 'Regular';

        if (titleLower.includes('oversize') || titleLower.includes('loose') || titleLower.includes('baggy') || titleLower.includes('boxy') ||
          handleLower.includes('oversize') || handleLower.includes('loose') || handleLower.includes('baggy') || handleLower.includes('boxy')) {
          fittingType = 'Oversized';
        } else if (titleLower.includes('fitted') || titleLower.includes('slim') || titleLower.includes('tight') || titleLower.includes('crop') ||
          handleLower.includes('fitted') || handleLower.includes('slim') || handleLower.includes('tight') || handleLower.includes('crop')) {
          fittingType = 'Fitted';
        }

        return {
          _id: sp.id,
          name: sp.title,
          slug: sp.handle,
          price: parseFloat(sp.priceRange?.minVariantPrice?.amount || '0'),
          isLimitedEdition: sp.tags?.includes('limited_edition') || sp.tags?.includes('limited-edition') || false,
          isNewCollection: sp.tags?.includes('new_collection') || sp.tags?.includes('new-collection') || false,
          tags: sp.tags || [],
          primaryImage: sp.images?.[0]?.url || '',
          isAvailable: sp.isAvailable,
          category: { _id: 'shopify-cat', name: 'Collection', slug: 'collection' },
          sizesAvailable: getUniqueSizes(sp.variants) as any,
          isFreeShipping: true,
          isCODAvailable: false,
          fittingType,
        };
      });

      // Apply frontend filters
      if (filters.search) {
        const q = filters.search.toLowerCase();
        mappedProducts = mappedProducts.filter((p: any) => p.name.toLowerCase().includes(q));
      }
      if (filters.maxPrice) {
        mappedProducts = mappedProducts.filter((p: any) => p.price <= filters.maxPrice!);
      }
      if (filters.minPrice) {
        mappedProducts = mappedProducts.filter((p: any) => p.price >= filters.minPrice!);
      }
      if (filters.size) {
        const selectedSizes = filters.size.split(',').filter(Boolean);
        if (selectedSizes.length > 0) {
          mappedProducts = mappedProducts.filter((p: any) =>
            p.sizesAvailable?.some((s: string) => selectedSizes.includes(s))
          );
        }
      }
      if (filters.fittingType) {
        mappedProducts = mappedProducts.filter((p: any) => p.fittingType === filters.fittingType);
      }
      if (filters.isNewCollection) {
        mappedProducts = mappedProducts.filter((p: any) => p.isNewCollection);
      }
      if (filters.isLimitedEdition) {
        mappedProducts = mappedProducts.filter((p: any) => p.isLimitedEdition);
      }
      if (filters.sort) {
        switch (filters.sort as string) {
          case 'price-asc':
          case 'price_asc':
            mappedProducts.sort((a: any, b: any) => a.price - b.price);
            break;
          case 'price-desc':
          case 'price_desc':
            mappedProducts.sort((a: any, b: any) => b.price - a.price);
            break;
        }
      }

      return {
        success: true,
        data: mappedProducts,
        total: mappedProducts.length,
        page: 1,
        pages: 1,
      };
    } catch (error) {
      console.error("Error fetching Shopify products:", error);
      return { success: false, data: [], total: 0, page: 1, pages: 1 };
    }
  },

  getProductBySlug: async (slug: string): Promise<ProductDetailResponse> => {
    const res = await shopifyService.getProductByHandle(slug);
    const sp = res.data;
    if (!sp) throw new Error("Product not found");

    // Infer category from product tags and title
    const inferCategory = (tags: string[], title: string) => {
      const tagsLower = (tags || []).map((t: string) => t.toLowerCase());
      const titleLower = (title || '').toLowerCase();

      if (tagsLower.includes('accessories') || tagsLower.includes('accessory') ||
        titleLower.includes('bandana') || titleLower.includes('scarf') || titleLower.includes('sunglass')) {
        return { _id: 'cat-accessories', name: 'Accessories', slug: 'accessories' };
      }
      if (tagsLower.includes('limited_edition') || tagsLower.includes('limited-edition')) {
        return { _id: 'cat-limited', name: 'Limited Edition', slug: 'limited-edition' };
      }
      if (tagsLower.includes('women') || tagsLower.includes('womens') || tagsLower.includes('womens-clothing') ||
        titleLower.includes('dress') || titleLower.includes('peplum') || titleLower.includes('skirt')) {
        return { _id: 'cat-women', name: "Women's Clothing", slug: 'womens-clothing' };
      }
      // Default to men's — most products without explicit women/accessories tags are men's
      return { _id: 'cat-men', name: "Men's Clothing", slug: 'mens-clothing' };
    };

    const inferredCategory = inferCategory(sp.tags, sp.title);

    const product: any = {
      _id: sp.id,
      name: sp.title,
      slug: sp.handle,
      description: sp.description || '',
      productNote: '',
      price: parseFloat(sp.priceRange?.minVariantPrice?.amount || '0'),
      category: inferredCategory,
      subCategory: { _id: 'shopify-sub', name: 'All', slug: 'all' },
      usps: Array.isArray(sp.usps) ? sp.usps.map((t: string) => ({ text: t })) : [],
      media: sp.images?.map((img: any, i: number) => ({
        _id: `img-${i}`,
        url: img.url,
        publicId: `pub-${i}`,
        mediaType: 'model',
        displayOrder: i,
        isPrimary: i === 0,
      })) || [],
      modelInfo: sp.modelInfo || '',
      isActive: true,
      isLimitedEdition: sp.tags?.includes('limited_edition') || sp.tags?.includes('limited-edition') || false,
      isNewCollection: sp.tags?.includes('new_collection') || sp.tags?.includes('new-collection') || false,
      launchedAt: new Date().toISOString(),
      averageRating: 0,
      totalReviews: 0,
      deliveryTimeline: '3-5 days',
      isCODAvailable: false,
      isFreeShipping: true,
      sizesAvailable: getUniqueSizes(sp.variants) as any,
      tags: sp.tags || [],
    };

    const variants: any[] = sp.variants?.map((v: any) => {
      const sizeOpt = v.selectedOptions?.find((o: any) => o.name.toLowerCase() === 'size')?.value;
      const colorOpt = v.selectedOptions?.find((o: any) => o.name.toLowerCase() === 'color')?.value;

      return {
        _id: v.id,
        productId: sp.id,
        color: colorOpt || 'Default',
        colorHex: colorOpt ? colorOpt.toLowerCase() : '#000000',
        size: sizeOpt || (v.title === 'Default Title' ? 'Free Size' : v.title) as any,
        fittingType: 'Regular',
        sku: v.id,
        stockQuantity: v.quantityAvailable !== undefined ? v.quantityAvailable : (v.availableForSale ? 10 : 0),
        price: parseFloat(v.price?.amount || '0'),
        isActive: true,
      };
    }) || [];

    return {
      product,
      variants,
      reviews: [],
    };
  },
};
