import type { App, Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/userStore.ts'

/**
 * 按钮级权限指令
 * ---------------------------------------------------------------------------
 * 用法：v-permission="'goods:update'"
 * 没有对应权限码时，元素会在挂载时被移除（菜单、按钮通用）。
 *
 * 说明：超管角色在 userStore.hasPermission 里直接放行。
 */
function check(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const store = useUserStore();
    const codes = Array.isArray(binding.value) ? binding.value : [binding.value];
    const allowed = codes.length === 0 || codes.some((code) => store.hasPermission(code));
    if (!allowed) {
        el.parentNode?.removeChild(el);
    }
}

const permission: Directive = {
    mounted: check,
    updated: check,
};

export const permissionPlugin = {
    install(app: App) {
        app.directive('permission', permission);
    },
};
