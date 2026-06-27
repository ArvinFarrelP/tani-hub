import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';

/**
 * Fetches products from the backend with server-side filtering.
 * Replaces the old mock-data version entirely.
 */
export function useProducts() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('');
  const [quality, setQuality]     = useState('');
  const [sort, setSort]           = useState('newest');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search)   params.search   = search;
      if (category) params.category = category;
      if (quality)  params.quality  = quality;
      if (sort)     params.sort     = sort;

      const result = await productService.getAll(params);
      setProducts(result.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  }, [search, category, quality, sort]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchProducts, search]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    search,    setSearch,
    category,  setCategory,
    quality,   setQuality,
    sort,      setSort,
  };
}
