import React, { useState } from 'react';
import { SearchResult } from '../../types';
import { searchService } from '../../services/searchService';
import { SearchBar } from '../../components/SearchBar';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Skeleton } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { FileText, Sparkles, ExternalLink, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const SearchContainer: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotImplemented, setIsNotImplemented] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setIsNotImplemented(false);
    setHasSearched(true);
    try {
      const data = await searchService.semanticSearch(searchQuery);
      setResults(data);
    } catch (err: any) {
      if (err.message === 'NOT_IMPLEMENTED') {
        setIsNotImplemented(true);
      } else {
        toast.error('Search query failed');
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search Header Banner */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Neural Vector Indexing
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Semantic Knowledge Search
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Query your personal knowledge base conceptually rather than just by keyword matching.
        </p>
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        isLoading={isLoading}
        placeholder="Ask a question or enter concepts e.g. 'RAG architecture benchmarking'..."
      />

      {/* NOT_IMPLEMENTED Feature State */}
      {isNotImplemented && (
        <Card className="p-6 text-center border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
          <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">
            Feature Temporarily Unavailable
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            The semantic search vector resolver is undergoing scheduled maintenance. Please try again shortly.
          </p>
        </Card>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton width={180} height={20} />
                <Skeleton width={60} height={20} />
              </div>
              <Skeleton width="100%" height={16} />
              <Skeleton width="80%" height={16} />
            </Card>
          ))}
        </div>
      )}

      {/* Results List */}
      {!isLoading && !isNotImplemented && results && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Ranked Results ({results.length})</span>
            <span>Sorted by Neural Cosine Similarity</span>
          </div>

          <div className="grid gap-4">
            {results.map((result, index) => (
              <Card key={index} hoverable className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => navigate(`/files/${result.documentId}`)}
                    className="flex items-center gap-2 group cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {result.filename}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <Badge variant="info" size="sm" className="font-bold">
                    <Percent className="w-3 h-3" /> Math.round({result.score * 100})% Match
                  </Badge>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  "{result.chunk}"
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isNotImplemented && hasSearched && results && results.length === 0 && (
        <EmptyState
          title="No Matching Knowledge Chunks"
          description={`We couldn't find any relevant snippets in your documents matching "${query}". Try broadening your prompt.`}
        />
      )}
    </div>
  );
};
