<template>
  <div class="cm-expression-input" :id="'editor' + codeId"></div>
</template>

<script lang="ts">
import {inject, onMounted, ref} from "vue";
import {PromQLExtension} from "codemirror-promql";
import {HighlightStyle, tags} from "@codemirror/highlight";
import {EditorView, keymap, placeholder, ViewUpdate} from "@codemirror/view";
import {EditorState, Prec} from "@codemirror/state";
import {basicSetup} from "@codemirror/basic-setup";
import {exprParser, queryExpr} from "@/utils/common";
import bus from "@/utils/bus";

export default {
  name: "PromQLCodeMirror",
  props: ['codeId', 'expr'],
  emits: ['codeMirrorUpdate'],
  setup(props, content) {
    const exprValue = ref()
    const promQL = new PromQLExtension().setComplete({
      remote: {
        url: 'http://prometheus.proxy.sumscope.com:8000',
      }
    })
    const promQLHighlightMaterialTheme = HighlightStyle.define([
      {
        tag: tags.deleted,
        textDecoration: 'line-through',
      },
      {
        tag: tags.inserted,
        textDecoration: 'underline',
      },
      {
        tag: tags.link,
        textDecoration: 'underline',
      },
      {
        tag: tags.strong,
        fontWeight: 'bold',
      },
      {
        tag: tags.emphasis,
        fontStyle: 'italic',
      },
      {
        tag: tags.invalid,
        color: '#f00',
      },
      {
        tag: tags.keyword,
        color: '#C792EA',
      },
      {
        tag: tags.operator,
        color: '#89DDFF',
      },
      {
        tag: tags.atom,
        color: '#F78C6C',
      },
      {
        tag: tags.number,
        color: '#FF5370',
      },
      {
        tag: tags.string,
        color: '#99b867',
      },
      {
        tag: [tags.escape, tags.regexp],
        color: '#e40',
      },
      {
        tag: tags.definition(tags.variableName),
        color: '#f07178',
      },
      {
        tag: tags.labelName,
        color: '#f07178',
      },
      {
        tag: tags.typeName,
        color: '#085',
      },
      {
        tag: tags.function(tags.variableName),
        color: '#C792EA',
      },
      {
        tag: tags.definition(tags.propertyName),
        color: '#00c',
      },
      {
        tag: tags.comment,
        color: '#546e7a',
      }
    ])

    const parseExpr = async (v) => {
      console.log('返回结果去修改promql 表单查询', v.state.doc)
      try {
        await bus.emit('busQuery', props.codeId)
        const data = exprParser(v.state.doc.text[0])
        if (data) {
          await content.emit('codeMirrorUpdate', [data, props.codeId])
        }
      } catch (e) {
        console.log(e)
      }
    }

    const inputExpr = (codeId) => {
      const doc = document.getElementById('editor' + codeId)
      if (doc !== null) {
        new EditorView({
          state: EditorState.create({
            extensions: [
              basicSetup,
              promQL.asExtension(),
              EditorView.lineWrapping,
              promQLHighlightMaterialTheme,
              placeholder('Enter query or edit tree view below...'),
              Prec.override(
                  keymap.of([
                    {
                      key: 'Enter',
                      run: (v: EditorView): boolean => {
                        parseExpr(v)
                        return true
                      }
                    }
                  ])
              ),
              // EditorView.updateListener.of((update: ViewUpdate) => {
              //   console.log('xxx', update.state.doc)
              // })
            ],
            doc: exprValue.value,
          }),
          parent: doc,
        })
      }
    }

    onMounted(() => {
      console.log(props.expr, 'expr')
      if (props.expr) {
        exprValue.value = queryExpr(props.expr)
      }
      inputExpr(props.codeId)
    })

    return {

    }

  }
}
</script>

<style lang="less">
@import "../components/index.less";
.cm-completionIcon {
  font-size: 16px !important;
  line-height: 1;
  margin-right: 10px;
  vertical-align: top;
  font-family: codicon;
  padding-right: 0 !important;
  opacity: 1 !important;
  color: #007acc;
}
.cm-completionMatchedText {
  color: #0066bf;
}
.cm-completionDetail {
  float: right;
  color: #999;
}
// 不显示几行
.cm-gutters {
  display: none !important;
}
.cm-activeLine {
  background-color: transparent !important;
}
// 去掉虚线
.ͼ1.cm-focused {
  outline: 0
}
</style>
