&lt;template&gt;
  &lt;div class="modal-backdrop" @click="$emit('close')"&gt;
    &lt;div class="modal" @click.stop&gt;
      &lt;h3&gt;{{ isEdit ? 'Edit Event' : 'New Event' }}&lt;/h3&gt;
      &lt;form @submit.prevent="handleSubmit"&gt;
        &lt;div class="form-group"&gt;
          &lt;label for="title"&gt;Title&lt;/label&gt;
          &lt;input 
            id="title"
            v-model="eventData.title"
            type="text"
            required
          &gt;
        &lt;/div&gt;
        &lt;div class="form-group"&gt;
          &lt;label for="description"&gt;Description&lt;/label&gt;
          &lt;textarea
            id="description"
            v-model="eventData.description"
            rows="3"
          &gt;&lt;/textarea&gt;
        &lt;/div&gt;
        &lt;div class="form-group"&gt;
          &lt;label for="date"&gt;Date&lt;/label&gt;
          &lt;input
            id="date"
            v-model="eventData.date"
            type="datetime-local"
            required
          &gt;
        &lt;/div&gt;
        &lt;div class="button-group"&gt;
          &lt;button type="button" class="cancel" @click="$emit('close')"&gt;Cancel&lt;/button&gt;
          &lt;button type="submit" class="save"&gt;Save&lt;/button&gt;
        &lt;/div&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
import { API, graphqlOperation } from 'aws-amplify';
import { createEvent, updateEvent } from '../graphql/mutations';

export default {
  name: 'EventModal',
  props: {
    event: {
      type: Object,
      default: () => ({
        title: '',
        description: '',
        date: new Date().toISOString().slice(0, 16)
      })
    }
  },
  data() {
    return {
      eventData: { ...this.event }
    }
  },
  computed: {
    isEdit() {
      return !!this.event.id;
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const input = {
          title: this.eventData.title,
          description: this.eventData.description,
          date: new Date(this.eventData.date).toISOString()
        };

        if (this.isEdit) {
          input.id = this.event.id;
          await API.graphql(graphqlOperation(updateEvent, { input }));
        } else {
          await API.graphql(graphqlOperation(createEvent, { input }));
        }

        this.$emit('saved');
        this.$emit('close');
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
  }
}
&lt;/script&gt;

&lt;style scoped&gt;
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.save {
  background: #4CAF50;
  color: white;
  border: none;
}

.cancel {
  background: #f0f0f0;
  border: 1px solid #ddd;
}
&lt;/style&gt;