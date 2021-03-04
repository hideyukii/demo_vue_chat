import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import moment from 'moment'
import { chatModule } from '@/store/index'

const INSTANCE_LOCATOR = process.env.VUE_APP_INSTANCE_LOCATOR;
const TOKEN_URL = process.env.VUE_APP_TOKEN_URL;
const MESSAGE_LIMIT = Number(process.env.VUE_APP_MESSAGE_LIMIT) || 10;

let currentUser: any = null;
let activeRoom: any = null;

async function connectUser(userId: string) {
  const chatManager = new ChatManager({
    instanceLocator: INSTANCE_LOCATOR,
    tokenProvider: new TokenProvider({ url: TOKEN_URL }),
    userId
  });
  currentUser = await chatManager.connect();
  return currentUser;
}

function setMembers() {
    const members = activeRoom.users.map((user: any) => ({
        username: user.id,
        name: user.name,
        presence: user.presence.state
    }));
    chatModule.setUsers(members)
}
  
async function subscribeToRoom(roomId: any) {
    chatModule.clearChatRoom()

    activeRoom = await currentUser.subscribeToRoom({
        roomId,
        messageLimit: MESSAGE_LIMIT,
        hooks: { //reactively pushing on time with computed
            onMessage: (message: any) => {
                chatModule.addMessage({
                    name: message.sender.name,
                    username: message.senderId,
                    text: message.text,
                    date: moment(message.createdAt).format('YYYY年MM月DD日 h:mm')
                });
            },

            onPresenceChanged: () => {
                setMembers();
            },

            onUserStartedTyping: (user: any) => {
                chatModule.setUserTyping(user.id)
            },

            onUserStoppedTyping: () => {
                chatModule.setUserTyping(null)
            }
        }
    });

    setMembers();

    return activeRoom;
}

async function sendMessage(text: string) {
    const messageId = await currentUser.sendMessage({
      text,
      roomId: activeRoom.id
    });
    return messageId;
}
  
export function isTyping(roomId: any) {
    currentUser.isTypingIn({ roomId });
}

function disconnectUser() {
    currentUser.disconnect();
}

export default {
  connectUser,
  subscribeToRoom,
  sendMessage,
  disconnectUser
}