import { apolloClient } from './apolloClient';
import { SEMANTIC_SEARCH_QUERY } from '../graphql/queries';
import { SearchResult } from '../types';

export const searchService = {
  async semanticSearch(query: string, limit = 10): Promise<SearchResult[]> {
    try {
      const { data } = await apolloClient.query<any>({
        query: SEMANTIC_SEARCH_QUERY,
        variables: { query, limit },
        fetchPolicy: 'no-cache',
      });
      return data.semanticSearch || [];
    } catch (error: any) {
      if (error?.graphQLErrors?.some((e: any) => e?.extensions?.code === 'NOT_IMPLEMENTED')) {
        throw new Error('NOT_IMPLEMENTED');
      }
      throw error;
    }
  },
};
