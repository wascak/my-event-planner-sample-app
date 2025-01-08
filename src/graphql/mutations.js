import { API, graphqlOperation } from 'aws-amplify';

export const createEvent = `mutation CreateEvent(
  $input: CreateEventInput!
) {
  createEvent(input: $input) {
    id
    title
    description
    date
    owner
  }
}`;

export const updateEvent = `mutation UpdateEvent(
  $input: UpdateEventInput!
) {
  updateEvent(input: $input) {
    id
    title
    description
    date
    owner
  }
}`;

export const deleteEvent = `mutation DeleteEvent(
  $input: DeleteEventInput!
) {
  deleteEvent(input: $input) {
    id
  }
}`;

export const createCalendar = `mutation CreateCalendar(
  $input: CreateCalendarInput!
) {
  createCalendar(input: $input) {
    id
    name
    owner
  }
}`;