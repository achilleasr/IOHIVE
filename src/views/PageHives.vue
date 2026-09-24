<template>
  <div class="page-hives">
    <!-- <span id="overview"></span> -->
    <Apiaries />
  </div>
</template>

<script>
import Apiaries from '../components/Apiaries.vue';

export default {
  name: 'PageHives',
  components: { Apiaries },
};
</script>

<style scoped>
/*.page-hives {
  padding: 1.5rem;
}*/

#overview {
  display: block;
  position: relative;
  top: -20px;
}
</style>
