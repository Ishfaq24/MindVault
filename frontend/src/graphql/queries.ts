import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      createdAt
    }
  }
`;

export const MY_FILES_QUERY = gql`
  query MyFiles {
    myFiles {
      id
      filename
      originalName
      size
      mimeType
      status
      createdAt
      updatedAt
    }
  }
`;

export const SEMANTIC_SEARCH_QUERY = gql`
  query SemanticSearch($query: String!, $limit: Int) {
    semanticSearch(query: $query, limit: $limit) {
      documentId
      filename: fileName
      chunk: content
      score
    }
  }
`;

export const ASK_AI_QUERY = gql`
  query AskAI($question: String!) {
    askAI(question: $question) {
      answer
      sources: citations {
        documentId
        filename: fileName
        chunk: content
      }
    }
  }
`;
