<template>
  <div class="message-form ld-over">
    <small class="text-muted">@{{ user.username }}</small>
    <b-form @submit.prevent="onSubmit" class="ld-over" v-bind:class="{ running: sending }">
      <div class="ld ld-ring ld-spin"></div>
      <b-alert variant="danger" :show="hasError">{{ error }} </b-alert>
      <b-form-group>
        <b-form-input id="message-input"
                      type="text"
                      v-model="message"
                      @input="isTyping"
                      placeholder="Enter Message"
                      autocomplete="off"
                      required>
        </b-form-input>
      </b-form-group>
      <div class="clearfix">
        <b-button type="submit" variant="primary" class="float-right">
          Send
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { chatModule } from '@/store/index'
  import { isTyping } from '../chatkit'

  @Component({
    name: 'message-form'
  })

  export default class MessageForm extends Vue {
    message = ''

    get user() {
      return chatModule.user
    }

    get sending() {
      return chatModule.sending
    }

    get error() {
      return chatModule.error
    }

    get activeRoom() {
      return chatModule.activeRoom
    }

    get hasError() {
      return chatModule.hasError
    }

    async onSubmit() {
      const result = await chatModule.sendMessage(this.message);
      if(result) {
        this.message = '';
      }
    }
    
    async isTyping() {
      await isTyping(chatModule.activeRoom.id);
    }
  }
</script>
