<!--
  写路由  sellerpage
  通过注册子组件的方式来显示seller.vue
-->
<template>
  <div class="com-page">
    <rank></rank>
  </div>
</template>

<script>
import Rank from '@/components/Rank';
export default {
  data () {
    return {};
  },

  components: {
    rank: Rank,
  },

  methods: {},
};
</script>

</style>