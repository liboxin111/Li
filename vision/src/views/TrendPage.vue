<!--
  写路由  sellerpage
  通过注册子组件的方式来显示seller.vue
-->
<template>
  <div class="com-page">
    <trend></trend>
  </div>
</template>

<script>
import Trend from '@/components/Trend';
export default {
  data () {
    return {};
  },

  components: {
    trend: Trend,
  },

  methods: {},
};
</script>

</style>