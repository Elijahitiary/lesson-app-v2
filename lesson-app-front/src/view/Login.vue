<template>
  <div>
    <h1>Welcome to lessons app</h1>
    <img src="../assets/welcome.png" alt="welcome" />
    <form @submit="loginAuth" method="post" action="">
      <div class="user-details">
        <div class="user-name-container">
          <p class="user-name">Email</p>
          <input v-model="email" placeholder="enter your email" />
          <p v-if="emailEmpty" class="error">email is required*</p>
        </div>
        <div class="user-phone-container">
          <p class="user-phone">Password</p>
          <div class="field has-addons">
            <div class="control is-expanded">
              <input
                v-if="showPassword"
                type="text"
                class="input"
                v-model="password"
              />
              <input
                v-else
                type="password"
                class="input-pass"
                v-model="password"
              />
              <button class="button" @click="toggleShow">
                <span class="icon is-small is-right">
                  <i
                    class="fas"
                    :class="{
                      'fa-eye-slash': showPassword,
                      'fa-eye': !showPassword,
                    }"
                  ></i>
                </span>
              </button>
              <p v-if="passwordEmpty" class="error">password is required*</p>
            </div>
          </div>
        </div>
        <button type="submit" id="login" class="checkout">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'

export default {
  name: 'LoginPage',

  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      email: '',
      showPassword: false,
      password: '',
      emailEmpty: false,
      passwordEmpty: false,
    }
  },
  computed: {
    buttonLabel() {
      return this.showPassword ? 'Hide' : 'Show'
    },
  },
  methods: {
    async loginAuth(event) {
      event.preventDefault()
      this.disabled = true

      // Re-enable after 5 seconds
      this.timeout = setTimeout(() => {
        this.disabled = false
      }, 5000)

      if (this.email.length == 0) {
        this.emailEmpty = true
      } else if (this.email.length != 0) {
        this.emailEmpty = false
      }

      if (this.password.length == 0) {
        this.passwordEmpty = true
      } else if (this.password.length != 0) {
        this.passwordEmpty = false
      }

      if (!this.email.length == 0 && !this.password.length == 0) {
        const url = '/api/login'
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: this.email, password: this.password }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.success === true) {
              console.log('Y')
              this.$router.push({ path: '/Lesson' })
            } else {
              this.toast.error(`${data.msg}`, {
                timeout: 1000,
                position: 'bottom-center',
              })
            }
          })
      }
    },

    toggleShow(e) {
      e.preventDefault()
      this.showPassword = !this.showPassword
    },
  },
}
</script>

<style scoped>
#login {
  background-color: #48c774;
  color: white;
}

img {
  width: 200px;
}

.button {
  position: absolute;
  width: 60px;
  outline: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  background-color: white;
  border: #c5cace5c solid 1px;
}
</style>
