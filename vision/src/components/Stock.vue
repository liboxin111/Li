<!--商家销量统计横向柱状图-->
<template>
  <div class="com-container">
    <!-- 显示柱状图的div -->
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据,
      //区域缩放的起点和终点
      currentIndex: 0,
      timerId: null,
    };
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "stockData",
      chartName: "stock",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    //页面加载完成时,主动进行屏幕的适配
    this.screenAdapter();
  },
  created() {
    //进行回调函数的注册
    this.$socket.registerCallBack("stockData", this.getData);
  },
  destroyed() {
    clearInterval(this.timerId);
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("trendData");
  },
  components: {},
 computed: {
    ...mapState(["theme"]),
  },
  watch: {
    theme() {
      console.log("主题切换了");
      this.chartInstance.dispose(); //销毁当前图表
      this.initChart(); //重新以最新的主题初始化图表
      this.screenAdapter();//重新进行屏幕适配
      this.updateChart();//更新图表的展示
    },
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref,this.theme);
      //对图表初始化配置的控制
      const initOption = {
        title: {
          text: "丨库存和销量分析",
          top: 20,
          left: 20,
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get("stock");
      this.allData = ret;
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      const centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      const colorArr = [
        ["#4FF778", "#0BA82C"],
        ["#E5DD45", "#E8B11C"],
        ["#E8821C", "#E55445"],
        ["#5052EE", "#AB6EE5"],
        ["#23E5E5", "#2E72BF"],
      ];
      const start = this.currentIndex * 5;
      const end = (this.currentIndex + 1) * 5;
      const showData = this.allData.slice(start, end);
      const seriesArr = showData.map((item, index) => {
        return {
          type: "pie",
          center: centerArr[index],
          hoverAnimation: false, //关闭鼠标移入的动画
          labelLine: {
            show: false,
          },
          label: {
            position: "center",
            color: colorArr[index][0],
          },
          data: [
            {
              name: item.name + "\n\n" + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0],
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1],
                  },
                ]),
              },
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#333843",
              },
            },
          ],
        };
      });
      const dataOption = {
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex > 1) {
          this.currentIndex = 0;
        }
        this.updateChart();
      }, 5000);
    },
    //当浏览器的大小发生变化时,调用的方法,来完成适配
    screenAdapter() {
      const titleFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6;
      const innerRadius = titleFontSize * 2.8;
      const outterRadius = innerRadius * 1.125;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
};
</script>
<style lang='less'>
</style>