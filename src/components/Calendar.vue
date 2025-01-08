&lt;template&gt;
  &lt;div class="calendar"&gt;
    &lt;div class="calendar-header"&gt;
      &lt;div class="nav-section"&gt;
        &lt;button @click="previousMonth"&gt;&lt;span&gt;&amp;lt;&lt;/span&gt;&lt;/button&gt;
        &lt;h2&gt;{{ currentMonthName }} {{ currentYear }}&lt;/h2&gt;
        &lt;button @click="nextMonth"&gt;&lt;span&gt;&amp;gt;&lt;/span&gt;&lt;/button&gt;
      &lt;/div&gt;
      &lt;div class="actions-section"&gt;
        &lt;button class="add-event-btn" @click="showAddEventModal = true"&gt;Add Event&lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="weekdays"&gt;
      &lt;div v-for="day in weekDays" :key="day" class="weekday"&gt;{{ day }}&lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="calendar-grid"&gt;
      &lt;div 
        v-for="(day, index) in calendarDays" 
        :key="index" 
        class="calendar-day"
        :class="{ 'other-month': !day.isCurrentMonth }"
      &gt;
        &lt;div class="day-number"&gt;{{ day.number }}&lt;/div&gt;
        &lt;div class="events"&gt;
          &lt;div v-for="event in getDayEvents(day)" :key="event.id" class="event-dot"&gt;
            &lt;span class="event-title"&gt;{{ event.title }}&lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;EventModal 
      v-if="showAddEventModal"
      :event="selectedEvent"
      @close="closeEventModal"
      @saved="onEventSaved"
    /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
import { API, graphqlOperation } from 'aws-amplify';
import { listEvents } from '../graphql/queries';
import EventModal from './EventModal.vue';

export default {
  name: 'Calendar',
  components: {
    EventModal
  },
  data() {
    return {
      currentDate: new Date(),
      events: [],
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      showAddEventModal: false,
      selectedEvent: {}
    }
  },
  computed: {
    currentMonthName() {
      return this.currentDate.toLocaleString('default', { month: 'long' });
    },
    currentYear() {
      return this.currentDate.getFullYear();
    },
    calendarDays() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      
      const days = [];
      
      // Add days from previous month
      const firstDayWeekday = firstDayOfMonth.getDay();
      const prevMonth = new Date(year, month, 0);
      for (let i = firstDayWeekday - 1; i >= 0; i--) {
        days.push({
          number: prevMonth.getDate() - i,
          isCurrentMonth: false,
          date: new Date(year, month - 1, prevMonth.getDate() - i)
        });
      }
      
      // Add days from current month
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        days.push({
          number: i,
          isCurrentMonth: true,
          date: new Date(year, month, i)
        });
      }
      
      // Add days from next month
      const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          number: i,
          isCurrentMonth: false,
          date: new Date(year, month + 1, i)
        });
      }
      
      return days;
    }
  },
  async created() {
    await this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        const eventData = await API.graphql(graphqlOperation(listEvents));
        this.events = eventData.data.listEvents.items;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },
    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    },
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    },
    getDayEvents(day) {
      return this.events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day.date.getDate() &&
               eventDate.getMonth() === day.date.getMonth() &&
               eventDate.getFullYear() === day.date.getFullYear();
      });
    },
    closeEventModal() {
      this.showAddEventModal = false;
      this.selectedEvent = {};
    },
    async onEventSaved() {
      await this.fetchEvents();
    },
    addEvent(day) {
      this.selectedEvent = {
        date: day.date.toISOString().slice(0, 16)
      };
      this.showAddEventModal = true;
    }
  }
}
&lt;/script&gt;

&lt;style scoped&gt;
.calendar {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header button {
  padding: 5px 10px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  cursor: pointer;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}

.weekday {
  text-align: center;
  font-weight: bold;
  padding: 5px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  min-height: 100px;
  padding: 5px;
  border: 1px solid #ddd;
  background: white;
}

.other-month {
  background: #f9f9f9;
  color: #999;
}

.day-number {
  font-size: 14px;
  margin-bottom: 5px;
}

.events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-dot {
  background: #4CAF50;
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 12px;
  margin: 1px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.add-event-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-event-btn:hover {
  background: #45a049;
}
&lt;/style&gt;