import { apolloClient } from './apolloClient';
import { MY_FILES_QUERY } from '../graphql/queries';
import { FileMeta } from '../types';

export const fileService = {
  async getMyFiles(): Promise<FileMeta[]> {
    const { data } = await apolloClient.query<any>({
      query: MY_FILES_QUERY,
      fetchPolicy: 'network-only',
    });
    return data.myFiles || [];
  },
};
