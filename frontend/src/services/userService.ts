import { apolloClient } from './apolloClient';
import { ME_QUERY } from '../graphql/queries';
import { User } from '../types';

export const userService = {
  async getCurrentUser(): Promise<User> {
    const { data } = await apolloClient.query<any>({
      query: ME_QUERY,
      fetchPolicy: 'network-only',
    });
    return data.me;
  },
};
