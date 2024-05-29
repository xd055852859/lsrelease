<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";

const props = defineProps<{
  newsKey: string;
}>();
const newInfo = ref<any>(null);
const getNewsInfo = async (key) => {
  let dataRes = (await api.request.get("news/detail", {
    newsKey: key,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    newInfo.value = dataRes.data;
  }
};
watch(
  () => props.newsKey,
  (newKey) => {
    getNewsInfo(newKey);
  },
  { immediate: true }
);
</script>
<template>
  <div class="news-info">
    <template v-if="newInfo?.content">
      <div class="news-info-box ProseMirror" v-html="newInfo.content"></div>
    </template>
  </div>
</template>
<style scoped lang="scss">
.news-info {
  width: 100vw;
  height: 100vh;
  padding-top: 80px;
  padding-bottom: 20px;
  box-sizing: border-box;
  background: #f5f5f5;
  font-size: 18px;
  @include flex(center, null, wrap);
  .news-info-box {
    width: 95vw;
    max-width: 1500px;
    height: 100%;
    @include scroll();
  }
}
</style>
<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  font-size: 18px;
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 15px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin: 15px 0px;
  }

  h1 {
    font-size: 2em;
    font-weight: bold;
  }

  h2 {
    font-size: 1.5em;
    font-weight: bold;
  }

  h3 {
    font-size: 1.17em;
    font-weight: bold;
  }

  h4 {
    font-size: 1em;
    font-weight: bold;
  }

  h5 {
    font-size: 0.83em;
    font-weight: bold;
  }

  h6 {
    font-size: 0.67em;
    font-weight: bold;
  }

  mark {
    background-color: #faf594;
  }

  a {
    color: #68cef8;
    cursor: pointer;
  }

  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: var(--notes-color-gray-4);
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  .hljs-comment,
  .hljs-quote {
    color: #616161;
  }

  .hljs-variable,
  .hljs-template-variable,
  .hljs-attribute,
  .hljs-tag,
  .hljs-name,
  .hljs-regexp,
  .hljs-link,
  .hljs-name,
  .hljs-selector-id,
  .hljs-selector-class {
    color: #f98181;
  }

  .hljs-number,
  .hljs-meta,
  .hljs-built_in,
  .hljs-builtin-name,
  .hljs-literal,
  .hljs-type,
  .hljs-params {
    color: #fbbc88;
  }

  .hljs-string,
  .hljs-symbol,
  .hljs-bullet {
    color: #b9f18d;
  }

  .hljs-title,
  .hljs-section {
    color: #faf594;
  }

  .hljs-keyword,
  .hljs-selector-tag {
    color: #70cff8;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: 700;
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    border-left: 3px solid var(--notes-color-gray-2);
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--notes-color-gray);
    margin: 2rem 0;
  }

  code {
    color: var(--notes-color-gray);
  }
}

/* Placeholder (at the top) */
.ProseMirror h1.is-empty:first-child::before,
.ProseMirror p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.tableWrapper {
  padding: 1rem 0;
  overflow: visible;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

ul[data-type="taskList"] {
  list-style: none;
  padding: 0;

  p {
    margin: 0;
  }

  li {
    display: flex;

    > label {
      flex: 0 0 auto;
      margin-right: 0.5rem;
      user-select: none;
    }

    > div {
      flex: 1 1 auto;
    }
  }
}

/* Color swatches */
.color {
  white-space: nowrap;

  &::before {
    content: " ";
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 1px solid rgba(128, 128, 128, 0.3);
    vertical-align: middle;
    margin-right: 0.1em;
    margin-bottom: 0.15em;
    border-radius: 2px;
    background-color: var(--color);
  }
}

/* 自加 */
:focus-visible {
  outline: none;
}

.ProseMirror-selectednode {
  outline: 3px solid #68cef8;
}

// 标题Placeholder
.ProseMirror .is-empty.paragraph::before,
.ProseMirror .is-empty.heading::before {
  color: var(--notes-color-gray-2);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
.ProseMirror .is-empty.level-1::before {
  font-size: 32px;
  line-height: 32px;
}

.ProseMirror {
  padding: 0 25px;

  // 自定义checkbox样式
  ul[data-type="taskList"] > div > li {
    margin: 6px 0;
    line-height: 19px;
  }

  ul[data-type="taskList"] > div > li > label {
    input {
      display: none;
    }

    span {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 16px;
      border: 1px solid var(--el-color-primary);
      position: relative;
      cursor: pointer;
      margin-top: 2px;
    }

    span::before {
      display: inline-block;
      content: " ";
      width: 8px;
      border: 2px solid #fff;
      height: 4px;
      border-top: none;
      border-right: none;
      transform: rotate(-45deg);
      top: 4px;
      left: 3px;
      position: absolute;
      opacity: 0;
    }

    input:checked + span {
      background: var(--el-color-primary);
    }

    input:checked + span::before {
      opacity: 1;
      transform: all 0.5s;
    }
  }

  .el-progress-bao__inner {
    transition: unset;
  }

  .progress-container {
    padding: unset;
  }

  .mention-card {
    color: #64a1df;
    background-color: #ebf2fb;
    text-decoration: underline;
    cursor: pointer;
  }

  .mention-coop {
    color: #64a1df;
    background-color: #ebf2fb;
  }
}

.column-content > p {
  margin: 0;
}
</style>