import { apolloClient } from './apolloClient';
import { ASK_AI_QUERY } from '../graphql/queries';
import { AskAIResponse } from '../types';

export const aiService = {
  async askAI(question: string): Promise<AskAIResponse> {
    try {
      const { data } = await apolloClient.query<any>({
        query: ASK_AI_QUERY,
        variables: { question },
        fetchPolicy: 'no-cache',
      });
      return data.askAI;
    } catch (error: any) {
      if (error?.graphQLErrors?.some((e: any) => e?.extensions?.code === 'NOT_IMPLEMENTED')) {
        throw new Error('NOT_IMPLEMENTED');
      }
      throw error;
    }
  },
};
