<template>
    <div class="page admin-user">
        <!-- 查询区 -->
        <div class="query-card">
            <el-form :inline="true" :model="query" @submit.prevent>
                <el-form-item label="关键词">
                    <el-input
                        v-model="query.keyword"
                        placeholder="账号 / 姓名"
                        clearable
                        style="width: 220px"
                        @keyup.enter="search()"
                        @clear="search()"
                    />
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="query.roleCode" placeholder="全部角色" clearable style="width: 170px" @change="search()">
                        <el-option v-for="item in roleList" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="query.status" placeholder="全部状态" clearable style="width: 140px" @change="search()">
                        <el-option label="启用" :value="1" />
                        <el-option label="停用" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()"><el-icon><Search /></el-icon>查询</el-button>
                    <el-button @click="reset"><el-icon><Refresh /></el-icon>重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 表格 -->
        <div class="table-card">
            <div class="toolbar">
                <div class="toolbar-left">
                    管理员账号
                    <span class="count">共 {{ total }} 个账号 · 超级管理员拥有全部权限</span>
                </div>
                <div class="toolbar-right" v-permission="'admin:update'">
                    <el-button type="primary" @click="openEdit()"><el-icon><Plus /></el-icon>新增账号</el-button>
                </div>
            </div>

            <el-table :data="list" v-loading="loading">
                <el-table-column label="账号" min-width="180">
                    <template #default="{ row }">
                        <div class="user-cell">
                            <span class="avatar">{{ row.realName.slice(0, 1) }}</span>
                            <div>
                                <p class="name">{{ row.realName }}</p>
                                <p class="account">{{ row.username }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="角色" width="130">
                    <template #default="{ row }">
                        <el-tag :type="row.roleCode === 'ADMIN' ? 'danger' : 'primary'" effect="light" round>
                            {{ row.roleName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="permissionCount" label="权限数" width="90" />
                <el-table-column prop="phone" label="手机号" width="130" />
                <el-table-column prop="email" label="邮箱" min-width="170" show-overflow-tooltip />
                <el-table-column label="状态" width="90">
                    <template #default="{ row }">
                        <el-switch
                            :model-value="row.status === 1"
                            :disabled="row.username === 'admin' || !hasPermission('admin:update')"
                            @change="toggle(row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="lastLoginAt" label="最后登录" width="170">
                    <template #default="{ row }">{{ row.lastLoginAt || '从未登录' }}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" v-permission="'admin:update'" @click="openEdit(row)">编辑</el-button>
                        <el-button link type="primary" v-permission="'admin:update'" @click="resetPassword(row)">重置密码</el-button>
                        <el-button
                            link
                            type="danger"
                            v-permission="'admin:update'"
                            v-if="row.username !== 'admin'"
                            @click="remove(row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有找到符合条件的账号" />
                </template>
            </el-table>

            <div class="pager">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :total="total"
                    :current-page="query.page"
                    :page-size="query.pageSize"
                    @current-change="(page: number) => { query.page = page; getList(); }"
                />
            </div>
        </div>

        <!-- 新增 / 编辑弹窗 -->
        <el-dialog v-model="dialogVisible" :title="editForm.id ? '编辑账号' : '新增账号'" width="520" :close-on-click-modal="false">
            <el-form ref="formRef" :model="editForm" :rules="rules" label-width="90px">
                <el-form-item label="登录账号" prop="username">
                    <el-input v-model="editForm.username" :disabled="Boolean(editForm.id)" placeholder="登录用的账号" />
                </el-form-item>
                <el-form-item label="姓名" prop="realName">
                    <el-input v-model="editForm.realName" placeholder="显示在后台的名字" />
                </el-form-item>
                <el-form-item label="初始密码" prop="password" v-if="!editForm.id">
                    <el-input v-model="editForm.password" type="password" show-password placeholder="至少 6 位" />
                </el-form-item>
                <el-form-item label="角色" prop="roleCode">
                    <el-select v-model="editForm.roleCode" placeholder="请选择角色" style="width: 100%">
                        <el-option v-for="item in roleList" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="editForm.phone" placeholder="选填" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="editForm.email" placeholder="选填" />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="editForm.remark" type="textarea" :rows="2" maxlength="60" show-word-limit placeholder="选填" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="saving" @click="save">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="AdminUser">
    import { onMounted, reactive, ref } from 'vue'
    import type { FormInstance, FormRules } from 'element-plus'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import {
        createAdminUserAPI,
        deleteAdminUserAPI,
        getAdminUserListAPI,
        getRoleListAPI,
        resetAdminUserPasswordAPI,
        toggleAdminUserStatusAPI,
        updateAdminUserAPI,
    } from '@/apis/admin.ts'
    import { useUserStore } from '@/stores/userStore.ts'

    const userStore = useUserStore();
    const loading = ref(false);
    const saving = ref(false);
    const list = ref<any[]>([]);
    const total = ref(0);
    const roleList = ref<any[]>([]);
    const dialogVisible = ref(false);
    const formRef = ref<FormInstance>();

    const query = reactive({
        page: 1,
        pageSize: 10,
        keyword: '',
        roleCode: '',
        status: undefined as number | undefined,
    });

    const editForm = reactive({
        id: '',
        username: '',
        password: '',
        realName: '',
        roleCode: '',
        phone: '',
        email: '',
        remark: '',
    });

    const rules = reactive<FormRules>({
        username: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        password: [{ required: true, min: 6, message: '初始密码至少 6 位', trigger: 'blur' }],
        roleCode: [{ required: true, message: '请选择角色', trigger: 'change' }],
    });

    function hasPermission(code: string) {
        return userStore.hasPermission(code);
    }

    async function getList() {
        loading.value = true;
        try {
            const result = await getAdminUserListAPI({ ...query }) as any;
            list.value = result.result.items;
            total.value = result.result.counts;
        } finally {
            loading.value = false;
        }
    }

    async function getRoles() {
        const result = await getRoleListAPI() as any;
        roleList.value = result.result;
    }

    function search() {
        query.page = 1;
        getList();
    }

    function reset() {
        query.keyword = '';
        query.roleCode = '';
        query.status = undefined;
        search();
    }

    function openEdit(row?: any) {
        editForm.id = row?.id ?? '';
        editForm.username = row?.username ?? '';
        editForm.password = '';
        editForm.realName = row?.realName ?? '';
        editForm.roleCode = row?.roleCode ?? '';
        editForm.phone = row?.phone ?? '';
        editForm.email = row?.email ?? '';
        editForm.remark = row?.remark ?? '';
        dialogVisible.value = true;
    }

    async function save() {
        const valid = await formRef.value?.validate().catch(() => false);
        if (!valid) return;
        saving.value = true;
        try {
            if (editForm.id) {
                await updateAdminUserAPI(editForm.id, { ...editForm });
                ElMessage.success('账号已更新');
            } else {
                await createAdminUserAPI({ ...editForm });
                ElMessage.success('账号已创建');
            }
            dialogVisible.value = false;
            await Promise.all([getList(), getRoles()]);
        } finally {
            saving.value = false;
        }
    }

    async function toggle(row: any) {
        try {
            await ElMessageBox.confirm(
                `确定要${row.status === 1 ? '停用' : '启用'}账号「${row.username}」吗？`,
                '账号状态',
                { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' },
            );
        } catch {
            return;
        }
        await toggleAdminUserStatusAPI(row.id);
        ElMessage.success(row.status === 1 ? '已停用' : '已启用');
        getList();
    }

    async function resetPassword(row: any) {
        try {
            const { value } = await ElMessageBox.prompt(`为账号「${row.username}」设置新密码（至少 6 位）`, '重置密码', {
                type: 'warning',
                inputValue: '123456',
                confirmButtonText: '重置',
                cancelButtonText: '取消',
                inputPattern: /^.{6,20}$/,
                inputErrorMessage: '密码长度为 6-20 位',
            });
            await resetAdminUserPasswordAPI(row.id, value);
            ElMessage.success('密码已重置');
        } catch {
            /* 用户取消 */
        }
    }

    async function remove(row: any) {
        try {
            await ElMessageBox.confirm(`删除后该账号将无法登录，确定删除「${row.username}」吗？`, '删除账号', {
                type: 'warning',
                confirmButtonText: '删除',
                cancelButtonText: '取消',
            });
        } catch {
            return;
        }
        await deleteAdminUserAPI(row.id);
        ElMessage.success('删除成功');
        await Promise.all([getList(), getRoles()]);
    }

    onMounted(() => {
        getList();
        getRoles();
    });
</script>

<style scoped lang="scss">
    .user-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        .avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            font-size: 15px;
            color: #fff;
            background: $brandGradient;
            flex-shrink: 0;
        }
        .name {
            font-size: 14px;
            color: $inkColor;
        }
        .account {
            margin-top: 2px;
            font-size: 12px;
            color: $inkColor3;
        }
    }
</style>
