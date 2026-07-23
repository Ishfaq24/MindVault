import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  Observable,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GRAPHQL_URL } from '../constants';
import { tokenStorage } from './tokenStorage';
import { REFRESH_TOKEN_MUTATION } from '../graphql/mutations';
import toast from 'react-hot-toast';

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = tokenStorage.getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

let isRefreshing = false;
let pendingRequestsQueue: Array<() => void> = [];

const processQueue = () => {
  pendingRequestsQueue.forEach(callback => callback());
  pendingRequestsQueue = [];
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }: any) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED' || err.message?.toLowerCase().includes('unauthenticated')) {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
          tokenStorage.clearTokens();
          if (window.location.pathname !== '/login') {
            toast.error('Session expired. Please log in again.');
            window.location.href = '/login';
          }
          return;
        }

        if (!isRefreshing) {
          isRefreshing = true;

          return new Observable(observer => {
            apolloClient
              .mutate<any>({
                mutation: REFRESH_TOKEN_MUTATION,
                variables: { input: { refreshToken } },
              })
              .then(({ data }) => {
                if (data?.refreshToken) {
                  tokenStorage.setTokens({
                    accessToken: data.refreshToken.accessToken,
                    refreshToken: data.refreshToken.refreshToken,
                  });
                  processQueue();
                  // Retry original operation
                  const subscriber = forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  });
                  return subscriber;
                } else {
                  throw new Error('Refresh failed');
                }
              })
              .catch(refreshErr => {
                tokenStorage.clearTokens();
                pendingRequestsQueue = [];
                toast.error('Session expired. Please log in again.');
                if (window.location.pathname !== '/login') {
                  window.location.href = '/login';
                }
                observer.error(refreshErr);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        } else {
          // Queue request while refresh is in progress
          return new Observable(observer => {
            pendingRequestsQueue.push(() => {
              const subscriber = forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
              return subscriber;
            });
          });
        }
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          myFiles: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});
