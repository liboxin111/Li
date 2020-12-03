<!--商家销量统计横向柱状图-->
<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据,
      mapData: {},
    };
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "mapData",
      chartName: "map",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    //页面加载完成时,主动进行屏幕的适配
    this.screenAdapter();
  },
  created() {
    //进行回调函数的注册
    this.$socket.registerCallBack("mapData", this.getData);
  },
  destroyed() {
    //在组件销毁时,取消监听器
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("mapData");
  },
  methods: {
    revertMap() {
      const revertOption = {
        geo: {
          map: "china",
        },
      };
      this.chartInstance.setOption(revertOption);
    },
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme);
      //获取中国地图矢量数据
      //http://localhost:8999/static/map/china.json
      const ret = await axios.get(
        "http://localhost:8999/static/map/china.json"
      );
      // console.log(ret);
      this.$echarts.registerMap("china", ret.data);
      //对图表初始化配置的控制
      const initOption = {
        title: {
          text: "丨商家分布",
          left: 20,
          top: 20,
        },
        geo: {
          type: "map",
          map: "china",
          top: "3%",
          bottom: "3%",
          itemStyle: {
            areaColor: "#2E72BF",
            borderColor: "#333",
          },
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("click", async (arg) => {
        // console.log(arg);
        // arg.name  所点击的省份
        const provinceInfo = getProvinceMapInfo(arg.name);
        // console.log(provinceInfo);
        //获取省份的地图矢量数据

        // console.log(ret);

        if (!this.mapData[provinceInfo.key]) {
          const ret = await axios.get(
            "http://localhost:8999" + provinceInfo.path
          );
          this.mapData[provinceInfo.key] = ret.data;
          this.$echarts.registerMap(provinceInfo.key, ret.data);
        }
        const changOption = {
          geo: {
            map: provinceInfo.key,
          },
        };
        this.chartInstance.setOption(changOption);
      });
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get("map");
      this.allData = ret;
      // console.log(ret);
      this.updateChart();
    },
    updateChart() {
      //图例的数据
      const legendArr = this.allData.map((item) => {
        return item.name;
      });
      const seriesArr = this.allData.map((item) => {
        //return的这个对象代表的是一个类别下的所有散点
        //如果想在地图中显示散点数据  给散点图表配置  coordinateSystem"'geo'使用地图坐标
        return {
          type: "effectScatter",
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
        };
      });
      const dataOption = {
        series: seriesArr,
        legend: {
          data: legendArr,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    //当浏览器的大小发生变化时,调用的方法,来完成适配
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adpterOpiton = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
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
      this.screenAdapter(); //重新进行屏幕适配
      this.updateChart(); //更新图表的展示
    },
  },
};
</script>

<style lang='less' scoped>
</style>