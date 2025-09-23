<template>
  <div class="pdf-viewer">
    <header class="pdf-viewer__header box-shadow">
      <div class="pdf-header-left">
        <slot name="resume_download"></slot>
        <div class="pdf_header_tools">
          <!-- <div class="pdf-preview-toggle">
            <a @click.prevent.stop="togglePreview" class="icon"><PreviewIcon /></a>
          </div> -->
          <PDFZoom
            :scale="scale"
            :increment="increment"
            @change="updateScale"
            class="header-item"
          />
          <PDFPaginator
            v-model="currentPage"
            :pageCount="pageCount"
            class="header-item"
          />
        </div>
      </div>
      <div class="resume_header_center">
        <div class="resume_header_tt"><span class="resume_left">知识报告</span> <span class="line"></span> <span class="resume_right">每月可得,即知即用</span></div>
        <slot name="header"></slot>
      </div>
      <div  class="pdf-header-right"></div>
    </header>

    <PDFData
      class="pdf-viewer__main"
      :url="url"
      @page-count="updatePageCount"
      @page-focus="updateCurrentPage"
      @document-rendered="onDocumentRendered"
      @document-errored="onDocumentErrored"
      >
      <template v-slot:preview="{pages}">
        <PDFPreview
          v-show="isPreviewEnabled"
          class="pdf-viewer__preview"
          v-bind="{pages, scale, currentPage, pageCount, isPreviewEnabled}"
          />
      </template>

      <template v-slot:document="{pages}">
        <PDFDocument
          class="pdf-viewer__document"
          :class="{ 'preview-enabled': isPreviewEnabled }"
          v-bind="{pages, scale, optimalScale, fit, currentPage, pageCount, isPreviewEnabled, defaultScale: scale}"
          @scale-change="updateScale"
          />
      </template>
    </PDFData>
  </div>
</template>

<script>
import PreviewIcon from '../../../assets/icon-preview.svg';

import PDFDocument from './PDFDocument';
import PDFData from './PDFData';
import PDFPaginator from './PDFPaginator';
import PDFPreview from './PDFPreview';
import PDFZoom from './PDFZoom';

function floor(value, precision) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.floor(value * multiplier) / multiplier;
}

export default {
  name: 'PDFViewer',

  components: {
    PDFDocument,
    PDFData,
    PDFPaginator,
    PDFPreview,
    PDFZoom,
    PreviewIcon,
  },

  props: {
    url: String,
    scale:  {
      type: Number,
      default: 1.0,
    },
  },

  data() {
    return {

      increment: 0.25,
      optimalScale: undefined,
      fit: undefined,
      currentPage: 1,
      pageCount: undefined,
      isPreviewEnabled: false,
      userInfo: {},
    };
  },

  methods: {
    onDocumentRendered() {
      this.$emit('document-errored', this.url);
    },

    onDocumentErrored(e) {
      this.$emit('document-errored', e);
    },

    updateScale({scale, isOptimal = false}) {
      const roundedScale = floor(scale, 2);
      if (isOptimal) this.optimalScale = roundedScale;
      this.scale = roundedScale;
    },

    updateFit(fit) {
      this.fit = fit;
    },

    updatePageCount(pageCount) {
      this.pageCount = pageCount;
    },

    updateCurrentPage(pageNumber) {
      this.currentPage = pageNumber;
    },

    togglePreview() {
      this.isPreviewEnabled = !this.isPreviewEnabled;
    },
  },

  watch: {
    url() {
      this.currentPage = undefined;
    },
  },

  mounted() {
    document.body.classList.add('overflow-hidden');
  },
};
</script>

<style scoped>
header {
  height: 68px;
  line-height: 68px;
  background: #293746;
  color: #fff;
  font-size: 18px;
  padding: 0 56px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 99;

  .pdf-header-left, .pdf-header-right {
    display: flex;
    align-items: center;
    width: 400px;
  }

  .resume_header_center {
    flex: 1;
    justify-content: center;
  }
}

.pdf_header_tools {
  display: flex;
  align-items: center;
}

.resume_header_center {
  flex: 1;
  display: flex;
  align-items: center;
}

.resume_header_tt {
  display: flex;
  align-items: center;
}

.resume_header_tt .line {
  background: #09958D;
  width: 2px;
  margin: 0 10px;
  height: 26px;
}

.resume_left {
  color: #09958D;
  font-size: 26px;
}

.resume_right {
  color: #09958D;
  font-size: 16px;
}

.header-item {
  margin: 0 1.5em;
}

.pdf-viewer .pdf-viewer__document,
.pdf-viewer .pdf-viewer__preview {
  top: 70px;
}

.pdf-viewer__preview {
  display: block;
  width: 15%;
  right: 85%;
}

.pdf-viewer__document {
  top: 70px;
  width: 100%;
  left: 0;
}

.pdf-viewer__document.preview-enabled {
  width: 85%;
  left: 15%;
}

.downFileResume {
  background-color: #09958d;
  color: #fff;
  border-radius: 6px;
  padding: 0px 25px;
  font-size: 16px;
  height: 41px;
  line-height: 41px;
  cursor: pointer;
}

@media print {
  header {
    display: none;
  }
}
</style>
