<!--商家销量统计横向柱状图-->
<template>
  <div class="com-container">
    <!-- 显示柱状图的div -->
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据,
      currentPage: 1,
      totalPage: 0,
      timerId: null, //定时器标识
    };
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "sellerData",
      chartName: "seller",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    //页面加载完成时,主动进行屏幕的适配
    this.screenAdapter();
  },
  created() {
    //进行回调函数的注册
    this.$socket.registerCallBack("sellerData", this.getData);
  },
  destroyed() {
    clearInterval(this.timerId);
    //在组件销毁时,取消监听器
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("sellerData");
  },
  components: {},

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.seller_ref,
        this.theme
      );
      //对图表初始化配置的控制
      const initOption = {
        title: {
          text: "丨 商家销售统计",
          left: 20,
          top: 20,
        },
        //坐标轴位置
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true, //距离包含坐标轴文字
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          // data: sellerNames,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              color: "#2D3443",
            },
          },
        },
        series: {
          type: "bar",
          // data: sellerValues,
          label: {
            show: true,
            position: "right",
            textStyle: {
              color: "white",
            },
          },
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
      // const { data: ret } = await this.$http.get("seller");
      this.allData = ret;
      // console.log(ret);
      // console.log(this.allData);
      this.allData.sort((a, b) => {
        return a.value - b.value;
      });
      //5个为一页
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1;
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);
      const sellerNames = showData.map((item) => {
        return item.name;
      });
      const sellerValues = showData.map((item) => {
        return item.value;
      });
      //拆分option
      const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: {
          data: sellerValues,
          itemStyle: {
            //左上  右上 右下  左下
            //线性渐变  指明渐变方向  不同百分比的颜色
            //color:new this.$echarts.graphic.LinearGradient(x1,y1,x2,y2,[])
            color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
              //0%
              {
                offset: 0,
                color: "#5052EE",
              },
              //100%
              {
                offset: 1,
                color: "#AB6EE5",
              },
            ]),
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
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 3000);
    },
    //当浏览器的大小发生变化时,调用的方法,来完成适配
    screenAdapter() {
      // this.$refs.seller_ref.offsetWidth
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      const adpterOpiton = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          lineStyle: {
            width: titleFontSize,
          },
        },
        series: {
          barWidth: titleFontSize,

          itemStyle: {
            barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
          },
        },
      };
      this.chartInstance.setOption(adpterOpiton);
      this.chartInstance.resize();
    },
  },
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
};
</script>

<style>
</style>