import Vue from 'vue'
import Vuex from 'vuex'
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"
import chatkit from '../chatkit'

Vue.use(Vuex)

interface State {
  loading: boolean;
  sending: boolean;
  error: any;
  user: any;
  reconnect: boolean;
  activeRoom: any;
  rooms: any;
  users: any;
  messages: any;
  userTyping: any;
}

@Module({ name: "chatModule", namespaced: true})
export class ChatModule extends VuexModule implements State {
  loading = false
  sending = false
  error: any = null
  user: any = null
  reconnect = false
  activeRoom: any = null
  rooms: any = []
  users: any = []
  messages: any = []
  userTyping: any = null

  @Mutation setError(error: any) {
    this.error = error;
  }
  @Mutation setLoading(loading: boolean) {
    this.loading = loading;
  }
  @Mutation setUser(user: any) {
    this.user = user;
  }
  @Mutation setReconnect(reconnect: boolean) {
    this.reconnect = reconnect;
  }
  @Mutation setActiveRoom(roomId: any) {
    this.activeRoom = roomId;
  }
  @Mutation setRooms(rooms: any) {
    this.rooms = rooms
  }
  @Mutation setUsers(users: any) {
    this.users = users
  }
  @Mutation clearChatRoom() {
    this.users = [];
    this.messages = [];
  }
  @Mutation setMessages(messages: string) {
    this.messages = messages
  }
  @Mutation addMessage(message: any) {
    this.messages.push(message)
  }
  @Mutation setSending(status: any) {
    this.sending = status
  }
  @Mutation setUserTyping(userId: string | null) {
    this.userTyping = userId
  }
  @Mutation reset() {
    this.error = null;
    this.users = [];
    this.messages = [];
    this.rooms = [];
    this.user = null
  }

  @Mutation setHandleError(error: any) {
    let message = error.message || error.info.error_description;
    if(message === 'The requested user does not exist') message = 'このユーザーは存在しません'
    this.error = message
  }

  @Action({ rawError: true })
  async login(userId: string) {
		try {
      this.setError('')
      this.setLoading(true)

			// Connect user to ChatKit service
      const currentUser = await chatkit.connectUser(userId);

      // Save user info in store
      this.setUser({
				username: currentUser.id,
				name: currentUser.name
      })
      
      this.setReconnect(false) // now it dose not reconnect

			// Save list of user's rooms in store
			const rooms = currentUser.rooms.map((room: any) => ({
					id: room.id,
					name: room.name
      }))
      this.setRooms(rooms)

			// Subscribe user to a room
			const activeRoom = this.activeRoom || rooms[0]; // pick last used room, or the first one
      this.setActiveRoom({
				id: activeRoom.id,
				name: activeRoom.name
			})

			await chatkit.subscribeToRoom(activeRoom.id);

			return true;
		} catch (error) {
			this.setHandleError(error)
		} finally {
			this.setLoading(false)
		}
  }

  @Action({ rawError: true })
	async changeRoom(roomId: any) {
		try {
			const { id } = await chatkit.subscribeToRoom(roomId)
			this.setActiveRoom({ id })
		} catch (error) {
			this.setHandleError(error)
		}
  }
  
  @Action({ rawError: true })
  async sendMessage(message: string) {
		try {
      this.setError('');
      this.setSending(true)
			const messageId = await chatkit.sendMessage(message);
			return messageId;
		} catch (error) {
			this.setHandleError(error)
		} finally {
			this.setSending(false);
		}
	}

  @Action({ rawError: true })
  async logout() {
    this.reset()
    //Disconnect user to ChatKit service
    chatkit.disconnectUser()
    window.localStorage.clear();
  }

  get hasError() { return this.error ? true : false }
}