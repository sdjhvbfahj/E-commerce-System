import { defineStore } from 'pinia'
import { loginAPI, getProfileAPI } from '@/apis/auth.ts'

export interface AdminInfo {
    id: string;
    username: string;
    realName: string;
    avatar: string;
    roleCode: string;
    roleName: string;
    permissions: string[];
}

const EMPTY_INFO: AdminInfo = {
    id: '',
    username: '',
    realName: '',
    avatar: '',
    roleCode: '',
    roleName: '',
    permissions: [],
};

/**
 * 管理端登录态
 * ---------------------------------------------------------------------------
 * token + 管理员信息（含权限码数组）都持久化到 localStorage，
 * 刷新页面不丢；退出登录只清这里，路由守卫会把人带回登录页。
 */
export const useUserStore = defineStore('adminUser', {
    state: () => ({
        token: '',
        adminInfo: { ...EMPTY_INFO } as AdminInfo,
    }),
    getters: {
        isLogin: (state) => Boolean(state.token),
        permissions: (state) => state.adminInfo.permissions ?? [],
    },
    actions: {
        /** 登录成功后同时拉取一次最新资料，保证权限码是最新的 */
        async login(username: string, password: string) {
            const result = await loginAPI({ username, password });
            this.token = result.result.token;
            this.adminInfo = result.result.adminInfo;
            await this.refreshProfile();
            return result.result;
        },
        async refreshProfile() {
            if (!this.adminInfo.username) return;
            try {
                const result = await getProfileAPI(this.adminInfo.username);
                this.adminInfo = result.result;
            } catch {
                /* 拉取失败不影响已登录状态 */
            }
        },
        /** 是否拥有某个权限码（超管角色拥有全部权限） */
        hasPermission(code: string) {
            if (!code) return true;
            if (this.adminInfo.roleCode === 'ADMIN') return true;
            return this.permissions.includes(code);
        },
        logout() {
            this.token = '';
            this.adminInfo = { ...EMPTY_INFO };
        },
    },
    persist: true,
});
