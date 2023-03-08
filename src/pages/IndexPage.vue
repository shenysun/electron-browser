<template>
    <button @click="click">frame</button>
    <iframe ref="frame" src="https://www.bing.com" frameborder="0"></iframe>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const frame = ref<HTMLIFrameElement>();
onMounted(() => {
    if (!frame.value) {
        return;
    }

    frame.value.onload = (v) => {
        console.log('hashchange', v);
    };
});
function click() {
    console.log(frame.value);
    console.log(frame.value?.contentWindow?.location.href);
}
</script>
