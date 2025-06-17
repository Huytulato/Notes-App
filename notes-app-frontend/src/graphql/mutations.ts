import { gql } from '@apollo/client';

export const CREATE_NOTE = gql`
  mutation CreateNote($title: String!, $content: String!) {
    createNote(title: $title, content: $content) {
      _id
      title
      content
      contentHtml
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: ID!, $title: String, $content: String) {
    updateNote(id: $id, title: $title, content: $content) {
      _id
      title
      content
      contentHtml
      updatedAt
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        _id
        email
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      _id
      email
    }
  }
`;