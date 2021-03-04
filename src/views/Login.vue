<template>
  <div class="login">
    <b-jumbotron  header="Vue.js Chat"
                  lead="Powered by Chatkit SDK and Bootstrap-Vue"
                  bg-variant="info"
                  text-variant="white">
      <p>For more information visit website</p>
      <b-btn target="_blank" href="https://pusher.com/chatkit">More Info</b-btn>
    </b-jumbotron>
    <b-container>
      <b-row>
        <b-col lg="4" md="3"></b-col>
        <b-col lg="4" md="6">
          <LoginForm />
        </b-col>
        <b-col lg="4" md="3"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import LoginForm from '@/components/LoginForm.vue'

  interface User {
    id: number;
    name: string[];
    address: string[];
    tel: string[];
  }

  @Component({
    name: 'login',
    components: {
      LoginForm
    },
  })

  export default class Login extends Vue {
    users: Array<User> = [
      {
        id: 1,
        name: ['name1'],
        address: ['address1'],
        tel: ['tel1']  
      },
      {
        id: 2,
        name: ['name2'],
        address: ['address2'],
        tel: ['tel2']  
      }
    ]

    created() {
      type Strify<T> = {[P in keyof T]: string};
      type StrArr = Strifiy<User>

      const users = this.users.forEach(function(user: StrArr<Array<User>>){
        console.log(user)
      })
    }

  }
  
</script>