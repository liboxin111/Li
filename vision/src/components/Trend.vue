<!--商家销量统计横向柱状图-->
<template>
  <div class="com-container">
    <!-- 显示柱状图的div -->
    <div class="title" :style="comStyle">
      <span>{{ "丨" + showTitle }}</span>
      <span
        class="iconfont title-icon"
        :style="comStyle"
        @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
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
      showChoice: false,
      choiceType: "map",
      titleFontSize: 0,
    };
  },

  mounted() {
    this.initChart();
    // this.getData();
    //发送数据给服务器，告诉服务器 需要数据
    this.$socket.send({
      action: "getData",
      socketType: "trendData",
      chartName: "trend",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    //页面加载完成时,主动进行屏幕的适配
    this.screenAdapter();
  },
  created() {
    //进行回调函数的注册
    this.$socket.registerCallBack("trendData", this.getData);
  },
  destroyed() {
    //在组件销毁时,取消监听器
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("trendData");
  },
  computed: {
     ...mapState(["theme"]),
    selectTypes() {
      if (!this.allData) {
        return [];
      } else {
        return this.allData.type.filter((item) => {
          return item.key !== this.choiceType;
        });
      }
    },
    showTitle() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.choiceType].title;
      }
    },
    //设置给标题的样式
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color:getThemeValue(this.theme).titleColor
      };
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + "px",
      };
    },
  },
  methods: {
    handleSelect(currentTyep) {
      this.choiceType = currentTyep;
      this.updateChart();
      this.showChoice = false;
    },
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme);
      //对图表初始化配置的控制
      const initOption = {
        grid: {
          left: "3%",
          top: "35%",
          right: "4%",
          bottom: "1%",
          containLabel: true, //距离包含坐标轴文字
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          left: 20,
          top: "15%",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        series: {
          type: "line",
        },
      };
      this.chartInstance.setOption(initOption);
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get("trend");
      this.allData = ret;
      // console.log(1111);
      this.updateChart();
    },
    updateChart() {
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];
      const timeArr = this.allData.common.month;
      console.log(timeArr);
      const valueArr = this.allData[this.choiceType].data;
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,

          stack: "map",
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              //0%
              {
                offset: 0,
                color: colorArr1[index],
              },
              //100%
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });
      //图例的数据
      const legendArr = valueArr.map((item) => {
        return item.name;
      });
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    //当浏览器的大小发生变化时,调用的方法,来完成适配
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize *0.6,
          },
        },
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
      this.screenAdapter();//重新进行屏幕适配
      this.updateChart();//更新图表的展示
    },
  },
};
</script>

<style lang='less' scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 1;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-con {
    background-color: #222733;
  }
}
</style>