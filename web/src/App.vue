<template>
  <div class="map" :style="{ background: `url(${bg})` }">
    <div class="map-left">
      <div class="map-left-card">
        <section>
          <div>较上日 + {{ store.chinaAdd.localConfirmH5 }}</div>
          <div>{{ store.chinaTotal.localConfirm }}</div>
          <div>本土现有确诊</div>
        </section>
        <section>
          <div>较上日 + {{ store.chinaAdd.nowConfirm }}</div>
          <div>{{ store.chinaTotal.nowConfirm }}</div>
          <div>现有确诊</div>
        </section>
        <section>
          <div>较上日 + {{ store.chinaAdd.confirm }}</div>
          <div>{{ store.chinaTotal.confirm }}</div>
          <div>累计确诊</div>
        </section>
        <section>
          <div>较上日 + {{ store.chinaAdd.noInfect }}</div>
          <div>{{ store.chinaTotal.noInfect }}</div>
          <div>无症状感染者</div>
        </section>
        <section>
          <div>较上日 + {{ store.chinaAdd.importedCase }}</div>
          <div>{{ store.chinaTotal.importedCase }}</div>
          <div>境外输入</div>
        </section>
        <section>
          <div>较上日 + {{ store.chinaAdd.dead }}</div>
          <div>{{ store.chinaTotal.dead }}</div>
          <div>累计死亡</div>
        </section>
      </div>
      <div class="map-left-pie"></div>
      <div class="map-left-line"></div>
    </div>
    <div id="china" class="map-center"></div>
    <div class="map-right">
      <table class="table" cellspacing="0" border="1">
        <thead>
          <tr>
            <th>地区</th>
            <th>今日新增</th>
            <th>累计患病</th>
            <th>治愈</th>
            <th>死亡</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store.item">
            <td align="center">{{ item.name }}</td>
            <td align="center">{{ item.today.confirm }}</td>
            <td align="center">{{ item.total.confirm }}</td>
            <td align="center">{{ item.total.heal }}</td>
            <td align="center">{{ item.total.dead }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import bg from "./assets/beijing.jpg";
import { useStore } from "./stores";
import { onMounted } from "vue";
import * as echarts from "echarts";
import "./assets/china.js";
import { geoCoordMap } from "./assets/geoMap";

const store = useStore();

onMounted(async () => {
  await store.getList();
  initCharts();
  initPie();
  initLine();
});

const initCharts = () => {
  const city = store.list.diseaseh5Shelf.areaTree[0].children;

  store.item = city[10].children;

  let data = city.map((ele) => {
    return {
      name: ele.name,
      value: geoCoordMap[ele.name].concat(ele.total.nowConfirm),
      children: ele.children,
    };
  });

  const charts = echarts.init(
    document.querySelector("#china") as HTMLDivElement
  );

  charts.setOption({
    geo: {
      map: "china",
      aspectScale: 0.8,
      layoutCenter: ["50%", "50%"],
      layoutSize: "100%",
      itemStyle: {
        areaColor: {
          type: "linear-gradient",
          x: 0,
          y: 1200,
          x2: 1000,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "#152E6E", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#0673AD", // 50% 处的颜色
            },
          ],
          global: true, // 缺省为 false
          shadowColor: "#0f5d9d",
          shadowOffsetX: 0,
          shadowOffsetY: 15,
          opacity: 0.5,
        },
      },
      emphasis: {
        areaColor: "#0f5d9d",
      },

      regions: [
        {
          name: "南海诸岛",
          itemStyle: {
            areaColor: "rgba(0, 10, 52, 1)",
            borderColor: "rgba(0, 10, 52, 1)",
            opacity: 0,
            label: {
              show: true,
              color: "#009cc9",
            },
          },
          label: {
            show: true,
            color: "#FFFFFF",
            fontSize: 12,
          },
        },
      ],
    },
    series: [
      {
        type: "map",
        map: "china",
        aspectScale: 0.8,
        layoutCenter: ["50%", "50%"], //地图位置
        layoutSize: "100%",
        zoom: 1, //当前视角的缩放比例
        // roam: true, //是否开启平游或缩放
        scaleLimit: {
          //滚轮缩放的极限控制
          min: 1,
          max: 2,
        },
        label: {
          show: true,
          color: "#FFFFFF",
          fontSize: 16,
        },
        itemStyle: {
          areaColor: "#0c3653",
          borderColor: "#1cccff",
          borderWidth: 1.8,
        },
        emphasis: {
          areaColor: "#56b1da",
          label: {
            show: true,
            color: "#fff",
          },
        },
        data: data,
      },
      {
        type: "scatter",
        coordinateSystem: "geo",
        symbol: "pin",
        symbolSize: [45, 45],
        label: {
          show: true,
          formatter(value: any) {
            return value.data.value[2];
          },
        },
        itemStyle: {
          color: "#D8BC37", //标志颜色
        },
        data: data,
      },
    ],
  });

  charts.on("click", (ele: any) => {
    store.item = ele.data.children;
  });
};

const initPie = () => {
  const pie = echarts.init(
    document.querySelector(".map-left-pie") as HTMLDivElement
  );
  pie.setOption({
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "15",
          },
        },

        data: store.cityInfo.map((ele) => {
          return {
            name: ele.name,
            value: ele.total.confirm,
          };
        }),
      },
    ],
  });
};

const initLine = () => {
  const charts = echarts.init(
    document.querySelector(".map-left-line") as HTMLDivElement
  );
  charts.setOption({
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: store.cityInfo.map((ele) => {
        return ele.name;
      }),
    },
    yAxis: {
      type: "value",
    },
    label: {
      show: true,
    },
    series: [
      {
        data: store.cityInfo.map((ele) => {
          return ele.total.confirm;
        }),
        type: "line",
      },
    ],
  });
};
</script>

<style lang="less">
@cardBg: #223651;
@cardBorder: #212028;
@cardColor: #41b0db;
* {
  padding: 0;
  margin: 0;
}
html,
body,
#app {
  height: 100%;
  overflow: hidden;
}
.map {
  height: 100%;
  display: flex;
  overflow: hidden;
  &-left {
    width: 400px;
    &-card {
      color: white;
      display: grid;
      grid-template-columns: auto auto auto;
      grid-template-rows: auto auto;
      section {
        padding: 5px;
        background-color: @cardBg;
        border: 1px solid @cardBorder;
        display: flex;
        flex-direction: column;
        align-items: center;
        div:nth-child(2) {
          color: @cardColor;
          font-size: 20px;
          padding: 10px 0;
          font-weight: bold;
        }
      }
    }
    &-pie {
      background-color: @cardBg;
      height: 300px;
      margin-top: 20px;
    }
    &-line {
      background-color: @cardBg;
      height: 300px;
      margin-top: 20px;
    }
  }
  &-center {
    flex: 1;
  }
  &-right {
    width: 400px;
  }
}
.table {
  padding: 5px;
  width: 100%;
  border: rgb(228, 225, 225);
  & * {
    background-color: @cardBg;
    color: white;
    padding: 5px;
    width: 100px;
    white-space: nowrap;
  }
}
</style>
