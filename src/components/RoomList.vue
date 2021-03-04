<template>
  <div class="room-list">
    <h4>Channels</h4>
    <hr>
    <b-list-group v-if="activeRoom">
      <b-list-group-item v-for="room in rooms"
                        :key="room.name"
                        :active="activeRoom.id === room.id"
                        href="#"
                        @click="onChange(room)">
        # {{ room.name }}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { chatModule } from '@/store/index'


  @Component({
    name: 'RoomList',
  })

  export default class RoomList extends Vue {
    get rooms() {
      return chatModule.rooms
    }

    get activeRoom() {
      return chatModule.activeRoom
    }

    onChange(room: any) {
      chatModule.changeRoom(room.id)
    }
  }
</script>