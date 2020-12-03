<!--商家销量统计横向柱状图-->
<template>
  <div class="com-container">
    <!-- 显示柱状图的div -->
    <div class="com-chart" ref="rank_ref"></div>
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
      startValue: 0,
      endValue: 9,
      timerId: null, //定时器标识
    };
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "rankData",
      chartName: "rank",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    //页面加载完成时,主动进行屏幕的适配
    this.screenAdapter();
  },
  created() {
    //进行回调函数的注册
    this.$socket.registerCallBack("rankData", this.getData);
  },
  destroyed() {
    clearInterval(this.timerId);
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("rankData");
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
      this.screenAdapter(); //重新进行屏幕适配
      this.updateChart(); //更新图表的展示
    },
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme);
      //对图表初始化配置的控制
      const initOption = {
        title: {
          text: "丨 地区销售排行",
          left: 20,
          top: 20,
        },
        grid: {
          top: "40%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true, //距离包含坐标轴文字
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: {
          type: "bar",
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
      // const { data: ret } = await this.$http.get("rank");
      this.allData = ret;
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];
      const provinceArr = this.allData.map((item) => {
        return item.name;
      });
      const valueArr = this.allData.map((item) => {
        return item.value;
      });
      const dataOption = {
        xAxis: {
          data: provinceArr,
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        series: {
          data: valueArr,
          itemStyle: {
            color: (arg) => {
              let targetColorArr = null;
              console.log(arg);
              if (arg.data > 300) {
                targetColorArr = colorArr[0];
              } else if (arg.data > 200) {
                targetColorArr = colorArr[1];
              } else {
                targetColorArr = colorArr[2];
              }
              return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //0%
                {
                  offset: 0,
                  color: targetColorArr[0],
                },
                //100%
                {
                  offset: 1,
                  color: targetColorArr[1],
                },
              ]);
            },
          },
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.updateChart();
      }, 3000);
    },
    //当浏览器的大小发生变化时,调用的方法,来完成适配
    screenAdapter() {
      // this.$refs.rank_ref.offsetWidth
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;
      const adpterOpiton = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: {
          barWidth: titleFontSize,
          itemStyle: {
            barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
          },
        },
      };
      this.chartInstance.setOption(adpterOpiton);
      this.chartInstance.resize();
    },
  },
};
</script>

<style>
</style>