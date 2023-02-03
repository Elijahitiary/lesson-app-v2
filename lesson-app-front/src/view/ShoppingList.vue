<template>
  <div>
    <div class="shopping-card-cart">
      <button class="card-btn" @click="openLessons">
        Cart: {{ items.length }}
      </button>
    </div>
    <div class="shopping-list">
      <h3 v-if="items.length === 0">The shopping cart is empty.</h3>
      <img
        v-if="items.length === 0"
        src="../assets/shopping.png"
        alt="404 error"
        class="empty-cart"
      />
      <ShoppingCart
        v-on:remove-item="removeFromCart($event)"
        v-for="(item, index) in items"
        :item="item"
        :key="index"
        :index="index"
      />
    </div>
    <p class="total-price">Total Price: £{{ totalPrice }}</p>

    <div class="user-details">
      <div class="user-name-container">
        <p class="user-name">Your Name is: {{ username }}</p>
        <input v-model="username" placeholder="enter your name" />
        <p v-if="nameEmpty" class="error">name is required*</p>
      </div>
      <div class="user-phone-container">
        <p class="user-phone">Your Phone is: {{ userphone }}</p>
        <input v-model="userphone" placeholder="enter your phone" />
        <p v-if="phoneEmpty" class="error">phone is required*</p>
      </div>
      <button @click="checkoutOrder()" class="checkout">checkout</button>
    </div>
    <div v-if="isOpen" class="modal-container">
      <div class="modal-content-container">
        <h4>Successful Operation</h4>
        <p>The order has been submitted successfully</p>
        <button @click="closeModal">home page</button>
      </div>
    </div>
  </div>
</template>

<script>
import ShoppingCart from '@/components/ShoppingCart.vue'
export default {
  name: 'ShoppingList',
  components: {
    ShoppingCart,
  },
  data() {
    return {
      isOpen: false,
      username: '',
      userphone: '',
      phoneEmpty: false,
      nameEmpty: false,
      items: [],
    }
  },
  async created() {
    const url = '/api/users/test1/cart'
    fetch(url)
      .then(res => res.json())
      .then(cartItems => (this.items = cartItems))
  },
  methods: {
    async removeFromCart(lessonId) {
      const url = `/api/users/test1/cart/${lessonId}`
      fetch(url, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(newCart => {
          this.items = newCart
          this.$store.state.cart.splice(this.index, 1)
          localStorage.setItem('cartCount', (this.$store.state.cardCount -= 1))
        })
    },
    async clearShoppingCart() {
      const url = '/api/users/test1/clear-cart'
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(_ => {})
    },
    openLessons() {
      this.$router.push({ path: '/Lesson' })
    },
    checkoutOrder() {
      var name = /^[a-zA-Z ]+$/.test(this.username)
      var phone = /^\d*$/.test(this.userphone)

      if (this.username.length == 0) {
        this.nameEmpty = true
      } else if (this.username.length != 0) {
        this.nameEmpty = false
      }

      if (this.userphone.length == 0) {
        this.phoneEmpty = true
      } else if (this.userphone.length != 0) {
        this.phoneEmpty = false
      }

      if (!this.username.length == 0 && !this.userphone.length == 0) {
        if (name && phone) {
          this.$store.state.cart.length > 0
            ? (this.isOpen = true)
            : alert('shopping cart is empty')
        } else {
          if (!name) {
            alert('Name must be letters only')
          } else {
            alert('Phone must be numbers')
          }
        }
      }
    },
    closeModal() {
      this.isOpen = false
      localStorage.setItem('cartCount', 0)
      this.$router.push({ path: '/Lesson' }).then(() => this.$router.go())
      this.$store.state.cart = []
      this.clearShoppingCart()
    },
  },
  computed: {
    totalPrice() {
      const sum = this.items.reduce((accumulator, object) => {
        return accumulator + object.price
      }, 0)
      return sum
    },
  },
}
</script>

<style>
.empty-cart {
  width: 200px;
}

.shopping-card-cart {
  position: fixed;
  top: 20px;
  right: 20px;
}

.shopping-card-cart .card-btn {
  cursor: pointer;
  border: none;
  padding: 10px 25px;
  font-weight: bold;
  border-radius: 3px;
  color: white;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(to right, #588de5, #3ac7dd);
  transition: all 0.2s ease;
}

.shopping-card-cart .card-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0px 10px 15px rgba(46, 156, 229, 0.4);
}

.shopping-list {
  border: 1px solid rgba(210, 210, 210, 0.575);
  max-width: 1000px;
  margin: 0 auto;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.07);
  padding: 30px;
  padding-bottom: 10px;
}

.total-price {
  /* font-size: 22px; */
  font-weight: bold;
  max-width: 1060px;
  margin: 0 auto;
  text-align: left;
  margin-top: 15px;
}

.user-details {
  border-radius: 2px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  /* background-color: #2c3e50; */
  text-align: left;
  color: #2c3e50;
  max-width: 1060px;
  margin: 50px auto;
  padding: 30px 0;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.07);
}

.user-name-container {
  margin-bottom: 25px;
}

.user-phone-container {
  margin-bottom: 35px;
}

.user-name-container p,
.user-phone-container p {
  margin: 0;
  margin-bottom: 5px;
}
.user-name-container input,
.user-phone-container input {
  width: 300px;
  outline: none;
  padding: 10px 15px;
  border-radius: 5px;
  border: #c5cace5c solid 1px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.07);
}

.checkout {
  width: 335px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  border: #c5cace5c solid 1px;
  transition: all 0.2s ease;
}

.checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 1px 5px rgba(145, 145, 145, 0.07),
    0 1px 4px rgba(145, 145, 145, 0.07);
}

.error {
  color: #eb5e60;
  font-size: 12px;
}

.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  background-color: #06131fd7;
  width: 100vw;
  height: 100vh;
}

.modal-content-container {
  background-color: aliceblue;
  width: 500px;
  margin: 50px auto;
}

.modal-content-container h4 {
  padding-top: 20px;
  font-size: 32px;
  margin: 0;
}

.modal-content-container button {
  padding: 10px 25px;
  margin-bottom: 20px;
  background-color: #0b73da;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.1s ease;
}

.modal-content-container button:hover {
  background-color: #0d5aa7;
}
</style>
