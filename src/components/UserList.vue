<template>
  <div class="user-list">
    <h4>Members</h4>
    <hr>
    <b-list-group>
      <b-list-group-item v-for="user in users" :key="user.username">
        {{ user.name }}
        <b-badge v-if="user.presence"
        :variant="statusColor(user.presence)"
        pill>
        {{ user.presence }}</b-badge>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { chatModule } from '@/store/index'

  @Component({
    name: 'user-list',
  })

  export default class UserList extends Vue {
    get loading() {
      return chatModule.loading
    }

    get users() {
      return chatModule.users
    }

    statusColor(status: any) {
      return status === 'online' ? 'success' : 'warning'
    }
  }
</script>