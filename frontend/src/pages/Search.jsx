import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, Package, Newspaper, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { isHindi } = useLanguage();

  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState({ products: [], events: [], blogs: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      api.search(query)
        .then(data => {
          setResults(data || { products: [], events: [], blogs: [] });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    }
  };

  const totalResults = results.products.length + results.events.length + results.blogs.length;

  return (
    <div className="space-y-10 py-12 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-navy">
          {isHindi ? 'वेबसाइट पर खोजें' : 'Site Search'}
        </h1>

        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={isHindi ? "उत्पाद, समाचार, या गाइड खोजें..." : "Search products, news, or articles..."}
              aria-label={isHindi ? "वेबसाइट खोजें" : "Search website"}
              className="w-full pl-10 pr-4 py-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-hidden bg-white shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="bg-navy hover:bg-cyan-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-xs"
          >
            {isHindi ? 'खोजें' : 'Search'}
          </button>
        </form>

        {query && (
          <p className="text-xs text-slate-500">
            {isHindi ? `"${query}" के लिए परिणाम: ${totalResults} मिले` : `Found ${totalResults} results for "${query}"`}
          </p>
        )}
      </div>

      {loading && (
        <div className="py-12 text-center text-xs text-slate-500">
          Searching website catalog...
        </div>
      )}

      {!query && (
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? 'लोकप्रिय खोजें' : 'Popular Searches'}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Gulf', 'Rock', 'Thor', 'Tubeless', 'Truck', 'Dosage', 'Warranty', 'Distributor'].map(term => (
                <button
                  key={term}
                  type="button"
                  onClick={() => { setInputVal(term); setSearchParams({ q: term }); }}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-sm font-medium text-slate-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { to: '/products', icon: Package, title: isHindi ? 'सभी प्रोडक्ट्स' : 'All Products', desc: isHindi ? 'Gulf, Rock और Thor देखें' : 'Browse Gulf, Rock & Thor' },
              { to: '/dosage-guide', icon: BookOpen, title: isHindi ? 'डोसेज कैलकुलेटर' : 'Dosage Calculator', desc: isHindi ? 'अपने वाहन के लिए मात्रा जानें' : 'Find the right quantity for your vehicle' },
              { to: '/events', icon: Newspaper, title: isHindi ? 'इवेंट्स व समाचार' : 'Events & News', desc: isHindi ? 'नवीनतम अपडेट' : 'Latest launches and demo camps' },
            ].map(({ to, icon: Icon, title, desc }) => (
              <Link
                key={to}
                to={to}
                className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all flex items-start gap-3"
              >
                <div className="p-2 bg-cyan-50 text-cyan-700 rounded-lg shrink-0">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-navy text-sm flex items-center gap-1">
                    {title}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">{desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && query && (
        <div className="space-y-10">
          {/* Products Results */}
          {results.products.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <Package size={18} className="text-cyan-700" />
                <h2 className="text-lg font-bold text-navy">
                  {isHindi ? 'उत्पाद (Products)' : 'Matching Products'}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.products.map(p => (
                  <Link
                    key={p.id}
                    to={`/products/${p.code}`}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-cyan-500 flex items-center gap-3 transition-colors"
                  >
                    <img src={p.image_url || '/assets/logo.png'} alt={p.name_en} className="h-16 w-16 object-contain rounded-md" />
                    <div>
                      <h3 className="font-bold text-sm text-navy">{isHindi ? p.name_hi : p.name_en}</h3>
                      <span className="text-xs font-black text-cyan-800">₹{p.mrp}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Events Results */}
          {results.events.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <Newspaper size={18} className="text-cyan-700" />
                <h2 className="text-lg font-bold text-navy">
                  {isHindi ? 'समाचार व इवेंट्स' : 'Matching News & Events'}
                </h2>
              </div>
              <div className="space-y-2">
                {results.events.map(ev => (
                  <Link
                    key={ev.id}
                    to={`/events/${ev.slug}`}
                    className="block p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-cyan-500 transition-colors"
                  >
                    <div className="text-[11px] text-slate-400">{ev.event_date}</div>
                    <h3 className="font-bold text-sm text-navy">{isHindi ? ev.title_hi : ev.title_en}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Blogs Results */}
          {results.blogs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <BookOpen size={18} className="text-cyan-700" />
                <h2 className="text-lg font-bold text-navy">
                  {isHindi ? 'ब्लॉग व गाइड्स' : 'Matching Blog Articles'}
                </h2>
              </div>
              <div className="space-y-2">
                {results.blogs.map(b => (
                  <Link
                    key={b.id}
                    to={`/blog/${b.slug}`}
                    className="block p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-cyan-500 transition-colors"
                  >
                    <h3 className="font-bold text-sm text-navy">{isHindi ? b.title_hi : b.title_en}</h3>
                    <p className="text-xs text-slate-500 mt-1">{isHindi ? b.summary_hi : b.summary_en}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="py-16 text-center text-slate-500 text-sm">
              {isHindi ? 'कोई परिणाम नहीं मिला। कृपया अन्य शब्द का प्रयास करें।' : 'No matching results found. Try another search term.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

