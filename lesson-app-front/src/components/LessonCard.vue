<template>
  <div class="lesson-card">
    <img :src="lesson.image" :alt="lesson.topic + ' image'" />
    <h4>Topic: {{ lesson.topic }} <i :class="lesson.icon"></i></h4>

    <hr />
    <p>Location: {{ lesson.location }}</p>
    <hr />
    <p>Price: {{ '£' + lesson.price }}</p>

    <hr />
    <button @click="handleAddToCart()">Add to Cart</button>
  </div>
</template>

<script>
export default {
  name: 'LessonCard',
  props: {
    lesson: Object,
  },
  data() {
    return {}
  },
  methods: {
    handleAddToCart() {
      console.log('NO THING RIGHT NOW...')
    },
  },
}
</script>

<style scoped>
.lesson-card {
  border: #f4f4f400 solid 1px;
  border-radius: 20px;
  width: 20%;
  box-shadow: 0px 0px 25px #cfcfcf74;
  margin-bottom: 2em;
  transition: all 0.2s ease;
}

.lesson-card:hover {
  transform: scale(1.03);
  box-shadow: 0px 0px 20px #cfcfcfdf;
}

h4 {
  font-size: 1.4em;
  position: relative;
  margin: 0;
  margin-top: 0.5em;
}

p {
  font-size: 1.2rem;
  margin: 0;
  padding: 5px;
}

img {
  margin: 0;
  padding: 0;
  max-width: 100%;
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 20px 20px 0 0;
}

button {
  cursor: pointer;
  margin: 10px 0px 15px 0px;
  border: none;
  padding: 10px 25px;
  font-family: 'Poppins', sans-serif;
  background-color: #e5e7eb;
  transition: all 0.2s ease;
  font-weight: bold;
  border-radius: 3px;
}

button:hover {
  background-color: #b7bbc3d3;
}

hr {
  border: #f9f7f7 solid 0.1px;
}
</style>
