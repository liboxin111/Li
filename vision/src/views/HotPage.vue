<!--
  写路由  sellerpage
  通过注册子组件的方式来显示seller.vue
-->
<template>
  <div class="com-page">
    <hot></hot>
  </div>
</template>

<script>
import Hot from '@/components/Hot';
export default {
  data () {
    return {};
  },

  components: {
    hot: Hot,
  },

  methods: {},
};
</script>

</style>