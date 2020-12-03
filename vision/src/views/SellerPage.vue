<!--
  写路由  sellerpage
  通过注册子组件的方式来显示seller.vue
-->
<template>
  <div class="com-page">
    <seller></seller>
  </div>
</template>

<script>
import Seller from '@/components/Seller';
export default {
  data () {
    return {};
  },

  components: {
    seller: Seller,
  },

  methods: {},
};
</script>

</style>