import { defineComponent } from 'vue'

const { $i18n } = useI18n()

export default defineComponent({
  name: 'App',
  setup() {
    // js-string
    const title = "标题"
    function getTitle(){
      // js-template
      return `我是${title}`
    }
    return () => (
      <div >
        <header>
            {/* jsx-text */}
            头部
        </header>
        <div>
          {/* js-string */}
          <span title="你是谁" onClick={getTitle()}>
              {/* jsx-text */}
              中文简体
          </span>
        </div>
        <br />
      </div>
    )
  },
})
