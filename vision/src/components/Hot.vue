<!--商家销量统计横向柱状图-->
<template>
  <div class="com-container">
    <!-- 显示柱状图的div -->
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toleft" :style="comStyle"
      >&#xe6eb;</span
    >
    <span class="iconfont arr-right" @click="toright" :style="comStyle"
      >&#xe6ee;</span
    >
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据,
      //区域缩放的起点和终点
      currentIndex: 0,
      titleFontSize: 0,
    };
  },
  computed: {
    ...mapState(["theme"]),
    catName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentIndex].name;
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color:getThemeValue(this.theme).titleColor
      };
    },
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "hotData",
      chartName: "hotproduct",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    //页面加载完成时,主动进行屏幕的适配
    this.screenAdapter();
  },
  created() {
    //进行回调函数的注册
    this.$socket.registerCallBack("hotData", this.getData);
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$scokect.unRegisterCallBack("hotData");
  },
  components: {},

  methods: {
    toleft() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1;
      }

      this.updateChart();
    },
    toright() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0;
      }
      this.updateChart();
    },
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme);
      //对图表初始化配置的控制
      const initOption = {
        title: {
          text: "丨热销商品销售金额占比统计",
          letf: 20,
          top: 20,
          itemStyle: {},
        },
        legend: {
          top: "15%",
          icon: "circle",
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            // console.log(arg)
            const thirdCategory = arg.data.children;
            // 计算出所有三级分类的数值总和
            let total = 0;
            thirdCategory.forEach((item) => {
              total += item.value;
            });
            let retStr = "";
            thirdCategory.forEach((item) => {
              retStr += `
              ${item.name}:${parseInt((item.value / total) * 100) + "%"}
              <br/>
              `;
            });
            return retStr;
          },
        },
        series: [
          {
            type: "pie",
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get("hotproduct");
      this.allData = ret;
      console.log(this.allData);
      this.updateChart();
    },
    updateChart() {
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
          };
        }
      );
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => {
          return item.name;
        }
      );
      const dataOption = {
        legend: {
          data: legendData,
        },
        series: [
          {
            data: seriesData,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    //当浏览器的大小发生变化时,调用的方法,来完成适配
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize /2,
          },
        },
        series: [
          {
            radius: this.titleFontSize *5,
            center: ["50%", "60%"],
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
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
};
</script>
<style lang='less'>
.arr-left {
  position: absolute;
  left: 15%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  right: 15%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  left: 85%;
  bottom: 2%;
  color: white;
}
</style>