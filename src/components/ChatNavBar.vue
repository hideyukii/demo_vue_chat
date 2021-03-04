<template>
  <b-navbar id="chat-navbar" toggleable="md" type="dark" variant="info">
    <b-navbar-brand href="#">
      Vue Chat
    </b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-text>{{ user.name }} | </b-nav-text>
      <b-nav-item href="#" @click="onLogout" active>Logout</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { chatModule } from '@/store/index'

  @Component({
    name: 'ChatNavBar',
  })

  export default class ChatNavBar extends Vue {
    get user() {
      return chatModule.user
    }

    get reconnect() {
      return chatModule.reconnect
    }

    onLogout() {
      this.$router.push({ path: '/' });
      chatModule.logout();
    }

    unload() {
      if(chatModule.user.username) { // User hasn't logged out
        chatModule.setReconnect(true);
      }
    }

    mounted() {
      window.addEventListener('beforeunload', this.unload);
      if(chatModule.reconnect) {
        chatModule.login(chatModule.user.username);
      }
    }
  }
</script>

<style>
  #chat-navbar {
    margin-bottom: 15px;
  }
</style>