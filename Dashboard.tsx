import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Buscar, LogOut, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Produto } from '../types';
import toast from 'react-hot-toast';

export default function Painel() {
  const { signOut, user } = useAuth();
  const [products, setProdutos] = useState<Produto[]>([]);
  const [searchTerm, setBuscarTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProdutos();
    
    // Subscribe to realtime changes
    const subscription = supabase
      .channel('products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, 
        (payload) => {
          console.log('Change received!', payload);
          fetchProdutos();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          variations (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProdutos = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-1 flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-yellow-600">Controle de Estoque Control</h1>
              </div>
              <div className="ml-6 flex-1 flex items-center">
                <div className="max-w-lg w-full">
                  <label htmlFor="search" className="sr-only">Buscar</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Buscar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      placeholder="Buscar products"
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setBuscarTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user?.email}</span>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Produto
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="spinner"></div>
              <p className="mt-2 text-sm text-gray-500">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProdutos.map((product) => (
                <div
                  key={product.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-4">
                    <div className="aspect-w-3 aspect-h-2 mb-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Variations</h4>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {product.variations.map((variation) => (
                          <div
                            key={variation.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm text-gray-700">
                              {variation.color} - {variation.size}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {variation.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}