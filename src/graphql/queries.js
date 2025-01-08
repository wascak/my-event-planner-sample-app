import { API, graphqlOperation } from 'aws-amplify';

export const listEvents = `query ListEvents(
  $filter: ModelEventFilterInput
  $limit: Int
  $nextToken: String
) {
  listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      description
      date
      owner
    }
    nextToken
  }
}`;

export const listCalendars = `query ListCalendars(
  $filter: ModelCalendarFilterInput
  $limit: Int
  $nextToken: String
) {
  listCalendars(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      owner
      events {
        items {
          id
          title
          description
          date
        }
      }
    }
    nextToken
  }
}`;