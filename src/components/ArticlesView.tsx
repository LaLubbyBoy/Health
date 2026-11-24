import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Clock, User as UserIcon, Calendar, ArrowRight } from 'lucide-react';
import { HealthArticle } from '../types';

export const ArticlesView: React.FC = () => {
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error('Failed to fetch articles', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Health Education & Resources
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">Expert Medical Articles & Wellness Tips</h1>
        <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-2xl">
          Verified health insights, preventive care guides, nutrition tips, and disease prevention written and reviewed by qualified medical professionals.
        </p>

        <div className="mt-8 flex items-center space-x-3 bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm max-w-xl">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search health articles, nutrition, prevention..."
            className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
          />
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-emerald-100 max-h-[90vh] flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedArticle(null)} className="absolute top-4 right-4 bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg hover:bg-black/80 transition">✕</button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6">
              <div className="flex items-center space-x-3">
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-md uppercase">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedArticle.readTime}</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{selectedArticle.title}</h2>
              <div className="flex items-center space-x-3 text-xs text-gray-600 pb-4 border-b border-gray-100">
                <span className="font-bold text-gray-800">By {selectedArticle.author}</span>
                <span>•</span>
                <span>Published on {selectedArticle.date}</span>
              </div>
              <div className="prose text-gray-700 text-sm sm:text-base leading-relaxed space-y-4">
                <p className="font-semibold text-gray-900">{selectedArticle.summary}</p>
                <p>{selectedArticle.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 mt-3">Loading articles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((art) => (
            <div key={art.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition flex flex-col justify-between">
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded uppercase">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-gray-400">{art.readTime}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-snug">{art.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-3">{art.summary}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-100 mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">By {art.author}</span>
                <button
                  onClick={() => setSelectedArticle(art)}
                  className="text-emerald-700 font-semibold text-xs hover:underline flex items-center space-x-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
