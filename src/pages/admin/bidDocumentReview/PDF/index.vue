<template>
  <div class="pdf-container">
    <div class="container-left">
      <PdfPreview />
    </div>
    <div class="container-right">
      <div class="templateName nameColor">模版一：软件采购</div>
      <div class="container-right-main">
        <div class="container-right-main-header divMB10">
          <div class="nameColor">问题拆解</div>
          <div class="container-right-main-header-right">
            <div>
              <n-icon>
                <RefreshOutline />
              </n-icon>
              <div class="iconLeft">重新生成</div>
            </div>
            <div>
              <n-icon>
                <CopyOutline />
              </n-icon>
              <div class="iconLeft">复制</div>
            </div>
          </div>
        </div>
        <div class="divMB10">根据审核模版一，一共匹配12个问题，其中匹配正确的有6条，错误的有6条:</div>
        <div class="displayFlex divMB10">
          <div @click="isConforming = true"><n-tag :type="isConforming ? 'info' : ''"> 符合项(3) </n-tag></div>
          <div class="marginLeft20" @click="isConforming = false">
            <n-tag :type="!isConforming ? 'info' : ''"> 不符合项(3) </n-tag>
          </div>
        </div>
        <div v-for="index in 5" :key="index" class="mian-item">
          <div style="padding: 10px">
            <n-collapse :default-expanded-names="['1']">
              <n-collapse-item
                title="1.建议五防系统(独立五防)、川型网路安全装置在新工程中应更换，不再继续使用。"
                name="1"
              >
                <n-collapse>
                  <n-collapse-item title="规则提问:" name="1">
                    <div>
                      根据《变电工程强制性条文》中提到在建设新工程时，五防系统、I型网路安全装置应当更换，不再继续使用。
                    </div>
                  </n-collapse-item>
                  <n-collapse-item title="共2处引用" name="2">
                    <div class="divMB10">
                      <n-icon> <Attach /> </n-icon>《新建变电站工程可行性研究报告》第1页中提到在建设新工程时，设备应更换
                    </div>
                    <div class="divMB10">
                      <n-icon> <Attach /> </n-icon>《新建变电站工程可行性研究报告》第1页中提到在建设新工程时，设备应更换
                    </div>
                  </n-collapse-item>
                </n-collapse>
              </n-collapse-item>
              <div style="padding: 10px 0 0 10px">
                <n-icon color="#999" size="20">
                  <EllipsisHorizontal />
                </n-icon>
                <n-icon style="margin: 0 10px" color="red" size="20">
                  <HeartCircleOutline />
                </n-icon>
                <n-icon size="20">
                  <HeartDislikeCircleOutline />
                </n-icon>
              </div>
            </n-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NIcon, NTag, NCollapse, NCollapseItem } from 'naive-ui'
import {
  RefreshOutline,
  CopyOutline,
  EllipsisHorizontal,
  HeartCircleOutline,
  HeartDislikeCircleOutline,
  Attach,
} from '@vicons/ionicons5'
import { ref, h } from 'vue'
import PdfPreview from './PDF.vue'

const isConforming = ref(true)
const questions = ref([
  {
    title: '建议五防系统（独立五防）、II型网路安全装置在新工程中应更换，不再继续使用。',
    rule: '根据《变电工程强制性条文》中提到在建设新工程时，五防系统、II型网路安全装置应当更换，不再继续使用。',
    references: [
      '《新建变电站工程可行性研究报告》第1页中提到在建设新工程时，设备应更换。',
      '《新建变电站工程可行性研究报告》第1页中提到在建设新工程时，设备应更换。',
    ],
  },
  {
    title: '变电站的负荷电力标准，应根据电力系统规划设计的范围来进行，范围按照国家电力标准文件GB 19517-2023执行。',
    rule: '判断依据',
    references: ['共2处引用'],
  },
])
</script>
<style scoped>
.pdf-container {
  display: flex;
}
.container-left {
  flex: 1;
  border-right: 1px solid #999;
  padding: 10px;
}
.container-right {
  flex: 1;
  padding: 10px;
  height: 100%;
}
.container-right-main {
  border: 1px solid #999;
  border-radius: 5px;
  padding: 10px;
  height: 55%;
  overflow-y: auto;
}

.container-right-main-header {
  display: flex;
  justify-content: space-between;
}
.container-right-main-header-right {
  display: flex;
}
.container-right-main-header-right div {
  display: flex;
  align-items: center;
  color: #999;
  margin-right: 10px;
}
.container-right-main-header-right div:hover {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #229afd;
}
.mian-item {
  border-color: #999;
  border: 1px solid #999;
  border-radius: 10px;
  margin-bottom: 10px;
}
.mian-item :hover {
  background-color: #e0f1ff;
  border-radius: 10px;
}

.displayFlex {
  display: flex;
}
.divMB10 {
  margin-bottom: 10px;
}
.marginLeft20 {
  margin-left: 20px;
}
.iconLeft {
  margin-left: 5px;
}
.nameColor {
  color: #229afd;
}
</style>
