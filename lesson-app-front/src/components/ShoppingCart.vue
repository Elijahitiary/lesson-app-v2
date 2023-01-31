<template>
  <div class="shopping-card-container">
    <img :src="item.image" :alt="item.subject + ' image'" />
    <p>{{ item.topic }}</p>
    <p>{{ item.location }}</p>
    <p>{{ '£' + item.price }}</p>
    <button @click="$emit('remove-item', item.lessonId)" class="remove-btn">
      remove
    </button>
  </div>
</template>

<script>
export default {
  name: 'ShoppingCart',
  props: {
    item: Object,
    index: Number,
  },
}
</script>

<style scoped>
.shopping-card-container:first-child {
  padding-top: 0;
}

.shopping-card-container:last-child {
  border-bottom: none;
}

.shopping-card-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: #dcdbdb44 solid 1px;
}

.shopping-card-container img {
  width: 80px;
  height: 50px;
  object-fit: cover;
  box-shadow: 2px 2px 5px #58585844;
}
p {
  width: 100px;
}

.remove-btn {
  cursor: pointer;
  border: none;
  padding: 10px 25px;
  background-color: #eb5e60;
  color: white;
  transition: all 0.1s ease-in-out;
}

.remove-btn:hover {
  background-color: #e74042;
  transform: rotate(3deg);
}
</style>
