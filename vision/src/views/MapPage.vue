<!--
  写路由  sellerpage
  通过注册子组件的方式来显示seller.vue
-->
<template>
  <div class="com-page">
    <Map></Map>
  </div>
</template>

<script>
import Map from '@/components/Map';
export default {
  data () {
    return {};
  },

  components: {
    Map
  },

  methods: {},
};
</script>

</style>