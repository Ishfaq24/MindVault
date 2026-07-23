import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { apolloClient } from '../services/apolloClient';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  className: 'text-xs font-sans font-medium dark:bg-slate-900 dark:text-slate-100 dark:border dark:border-slate-800 shadow-lg rounded-xl',
                }}
              />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
};
