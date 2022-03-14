<template>
    <!-- html-inline -->
    <div>静态的行内国际化文案</div>
    <div>{{ '动态的行内国际化文案-1' + '动态的行内国际化文案-2' }}</div>
    <!-- html-inline-template -->
    <div>{{ `${title}模板类型的行内国际化文案` }}</div>
    <div>{{ `${title}模板类型的行内国际化文案` + '动态的行内国际化文案' }}</div>
    <!-- html-attribute -->
    <div title="静态的属性国际化文案"></div>
    <div :title="'动态的属性国际化文案'"></div>
    <div v-tooltip="'动态的属性国际化文案'"></div>
    <!-- html-attribute-template -->
    <div :title="`${title}模板类型的属性国际化文案`"></div>
</template>
<script>
export default {
    name: 'Vue3',
    setup() {
        // js-string
        const name = '标题'
        function getTitle() {
            // js-template
            return `我是${this.title}`
        }
    }
}
</script>
