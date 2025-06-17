import { gql } from '@apollo/client';

export const GET_MY_NOTES = gql`
  query GetMyNotes {
    myNotes {
      _id
      title
      content
      contentHtml
      createdAt
      updatedAt
    }
  }
`;

export const SEARCH_NOTES = gql`
  query SearchNotes($searchTerm: String!) {
    searchNotes(searchTerm: $searchTerm) {
      _id
      title
      content
      contentHtml
      createdAt
      updatedAt
    }
  }
`;