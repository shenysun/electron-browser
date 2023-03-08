<template>
    <div class="browser-header" ref="header">
        <div class="page-tools">
            <button
                :disabled="!canGoBack"
                class="hover-color btn-tool prev"
                @click="doAction(EventType.goBack)"
            ></button>
            <button
                :disabled="!canGoForward"
                class="hover-color btn-tool next"
                @click="doAction(EventType.goForward)"
            ></button>
            <button class="hover-color btn-tool refresh" @click="doAction(EventType.refresh)"></button>
            <button class="hover-color btn-tool home" @click="doAction(EventType.home)"></button>
            <span class="hover-color" @click="logUrl">打印地址</span>
        </div>
        <div class="web-input">
            <input
                @focus="selectAllInput"
                @keyup.enter="submit"
                class="input-inner"
                type="text"
                placeholder="请输入Web地址"
                v-model="searchUrl"
            />
            <span class="hover-color icon-collect"></span>
        </div>
        <!-- <div class="share-sound">
            <el-switch class="share-switch" active-color="#FA9E00" v-model="shareSound"> </el-switch>
            <span class="title">共享声音</span>
        </div> -->
    </div>
</template>
<script lang="ts" setup>
import { EventType } from 'app/src-electron/events';
import { onMounted, ref } from 'vue';
interface Preload {
    browser: Record<string, (...args: unknown[]) => Promise<unknown>>;
}
const global = window as unknown as Preload;

const searchUrl = ref('');
const canGoBack = ref(false);
const canGoForward = ref(false);
const header = ref<HTMLDivElement>();
function selectAllInput(e: FocusEvent) {
    const target = e.target as HTMLInputElement;
    target.setSelectionRange(0, target.value.length);
}

function submit() {
    let url = searchUrl.value;
    if (!isRemote(searchUrl.value)) {
        url = 'https://cn.bing.com/search?q=' + searchUrl.value;
    }

    global.browser.setUrl(url);
}

function isRemote(url: string) {
    return url.startsWith('https://') || url.startsWith('http://') || url.startsWith('//');
}

async function logUrl() {
    console.log(await global.browser.getUrl());
}

function doAction(type: EventType) {
    global.browser[type]();
}

function resize() {
    const headerEle = header.value;
    if (!headerEle) return;
    const rect = headerEle.getBoundingClientRect();
    global.browser.setBounds(
        0,
        rect.y + rect.height,
        document.documentElement.clientWidth,
        document.documentElement.clientHeight
    );
}

onMounted(() => {
    global.browser.onCanGoBackChange((val: boolean) => {
        canGoBack.value = val;
    });

    global.browser.onCanGoForwardChange((val: boolean) => {
        canGoForward.value = val;
    });

    global.browser.onUrlChange((val: string) => {
        searchUrl.value = val;
    });

    window.addEventListener('resize', resize);
    resize();
});
</script>

<style scoped lang="scss">
.browser-header {
    display: flex;
    align-items: center;
    padding: 6px 42px;
    background-color: #1c1f35;
    color: #fff;

    .page-tools {
        display: flex;
        align-items: center;

        .btn-tool {
            width: 28px;
            height: 28px;
            margin-right: 8px;
            background-size: cover;
            background-color: unset;
            border: none;
            padding: 0;
        }

        .prev {
            background-image: url('../boardMain/assets/img/browser/prev.png');
            &:disabled {
                background-image: url('../boardMain/assets/img/browser/prev-disabled.png');
            }
        }

        .next {
            background-image: url('../boardMain/assets/img/browser/next.png');
            &:disabled {
                background-image: url('../boardMain/assets/img/browser/next-disabled.png');
            }
        }

        .refresh {
            background-image: url('../boardMain/assets/img/browser/refresh.png');
            &:disabled {
                background-image: url('../boardMain/assets/img/browser/refresh-disabled.png');
            }
        }

        .home {
            background-image: url('../boardMain/assets/img/browser/home.png');
            &:disabled {
                background-image: url('../boardMain/assets/img/browser/home-disabled.png');
            }
        }
    }

    .web-input {
        flex: 1;
        margin-left: 16px;
        position: relative;

        .input-inner {
            width: 100%;
            padding: 7px 40px 7px 16px;
            box-sizing: border-box;
            font-size: 14px;
            border-radius: 2px;
            border: none;
            background: #13141f;
            color: rgba(255, 255, 255, 0.5);

            &:focus {
                outline: none;
                color: #ffffff;
            }
        }

        .icon-collect {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            background-size: cover;
            background-image: url('../boardMain/assets/img/browser/collected.png');
        }
    }

    // .share-sound {
    //     display: flex;
    //     align-items: center;
    //     margin-left: 16px;

    //     /deep/ .share-switch {
    //         max-width: 24px;
    //         max-height: 12.8px;
    //         width: 24px;
    //         height: 12.8px;
    //         line-height: 12.8px;
    //         .el-switch__core {
    //             background: #565656;
    //             border-radius: 8.5px;
    //             border: none;
    //             height: 12.8px;
    //             line-height: 12.8px;

    //             &::after {
    //                 height: 12.8px;
    //                 width: 12.8px;
    //                 top: 0;
    //                 left: 0;
    //             }
    //         }

    //         &.is-checked {
    //             .el-switch__core::after {
    //                 left: unset;
    //                 margin-left: 0;
    //             }
    //         }
    //     }

    //     .title {
    //         margin-left: 8px;
    //         font-size: 14px;
    //         color: #ffffff;
    //     }
    // }

    .hover-color {
        cursor: pointer;
        &:hover {
            background-color: #272a3f;
        }
    }
}
</style>
