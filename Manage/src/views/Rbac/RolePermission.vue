<template>
    <div class="page role-permission">
        <div class="intro es-card">
            <div class="icon"><el-icon :size="20"><Key /></el-icon></div>
            <div>
                <h3>角色权限配置</h3>
                <p>勾选权限后点「保存」，左侧菜单与页面按钮会立刻按新权限显示（重新登录后同样生效）。</p>
            </div>
        </div>

        <div class="role-grid">
            <div class="role-card es-card" v-for="role in roleList" :key="role.id">
                <div class="head">
                    <div>
                        <div class="name-row">
                            <h3>{{ role.name }}</h3>
                            <el-tag :type="role.code === 'ADMIN' ? 'danger' : 'primary'" size="small" effect="light" round>
                                {{ role.code }}
                            </el-tag>
                            <el-tag v-if="role.builtIn" size="small" type="info" effect="plain">内置</el-tag>
                        </div>
                        <p class="desc">{{ role.desc }}</p>
                    </div>
                </div>
                <div class="stats">
                    <span><b>{{ role.permissionCount }}</b>项权限</span>
                    <el-divider direction="vertical" />
                    <span><b>{{ role.userCount }}</b>个账号</span>
                </div>
                <div class="foot">
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        v-permission="'role:update'"
                        @click="openPermission(role)"
                    ><el-icon><Key /></el-icon>配置权限</el-button>
                    <el-button
                        size="small"
                        v-permission="'role:update'"
                        :disabled="role.builtIn"
                        @click="openEdit(role)"
                    >编辑信息</el-button>
                </div>
            </div>

            <div class="role-card add" v-permission="'role:update'" @click="openCreate">
                <el-icon><Plus /></el-icon>
                <span>新增角色</span>
            </div>
        </div>

        <!-- 配置权限 -->
        <el-dialog v-model="permVisible" :title="`配置权限 · ${current?.name}`" width="620" :close-on-click-modal="false">
            <el-tree
                ref="treeRef"
                :data="permissionTree"
                show-checkbox
                node-key="code"
                default-expand-all
                :props="{ label: 'name', children: 'items' }"
            />
            <template #footer>
                <el-button @click="permVisible = false">取消</el-button>
                <el-button type="primary" :loading="saving" v-permission="'role:update'" @click="savePermissions">保存权限</el-button>
            </template>
        </el-dialog>

        <!-- 新增 / 编辑角色 -->
        <el-dialog v-model="editVisible" :title="editForm.id ? '编辑角色' : '新增角色'" width="480" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="90px">
                <el-form-item label="角色名称" required>
                    <el-input v-model="editForm.name" maxlength="20" placeholder="如：内容运营" :disabled="Boolean(editForm.id && currentBuiltIn)" />
                </el-form-item>
                <el-form-item label="角色编码" required v-if="!editForm.id">
                    <el-input v-model="editForm.code" maxlength="20" placeholder="如：OPERATOR" />
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="editForm.desc" type="textarea" :rows="3" maxlength="60" show-word-limit placeholder="这个角色负责什么" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" :loading="saving" v-permission="'role:update'" @click="saveRole">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="RolePermission">
    import { computed, onMounted, reactive, ref } from 'vue'
    import type { ElTree } from 'element-plus'
    import { ElMessage } from 'element-plus'
    import { getPermissionListAPI } from '@/apis/auth.ts'
    import {
        createRoleAPI,
        getRoleListAPI,
        updateRoleAPI,
        updateRolePermissionsAPI,
    } from '@/apis/admin.ts'

    const loading = ref(false);
    const saving = ref(false);
    const roleList = ref<any[]>([]);
    const permissionGroups = ref<any[]>([]);
    const current = ref<any>(null);
    const currentBuiltIn = ref(false);
    const permVisible = ref(false);
    const editVisible = ref(false);
    const treeRef = ref<InstanceType<typeof ElTree>>();

    const editForm = reactive({ id: '', name: '', code: '', desc: '' });

    const permissionTree = computed(() =>
        permissionGroups.value.map((group) => ({ code: `group-${group.group}`, name: group.group, items: group.items })),
    );

    async function getList() {
        loading.value = true;
        try {
            const result = await getRoleListAPI() as any;
            roleList.value = result.result;
        } finally {
            loading.value = false;
        }
    }

    async function getPermissions() {
        const result = await getPermissionListAPI() as any;
        permissionGroups.value = result.result;
    }

    async function openPermission(role: any) {
        current.value = role;
        permVisible.value = true;
        await getPermissions();
        // 等树渲染完再回填勾选（只勾叶子节点，父级自动半选/全选）
        requestAnimationFrame(() => {
            const codes = role.permissions;
            codes.forEach((code: string) => treeRef.value?.setChecked(code, true, false));
        });
    }

    async function savePermissions() {
        if (!current.value) return;
        // 只提交叶子节点的权限码
        const leaves = treeRef.value?.getCheckedKeys(true) as string[];
        if (!leaves.length) {
            ElMessage.warning('请至少勾选一项权限');
            return;
        }
        saving.value = true;
        try {
            await updateRolePermissionsAPI(current.value.id, leaves);
            ElMessage.success('权限已保存，相关账号重新登录或刷新后生效');
            permVisible.value = false;
            getList();
        } finally {
            saving.value = false;
        }
    }

    function openCreate() {
        current.value = null;
        currentBuiltIn.value = false;
        editForm.id = '';
        editForm.name = '';
        editForm.code = '';
        editForm.desc = '';
        editVisible.value = true;
    }

    function openEdit(role: any) {
        current.value = role;
        currentBuiltIn.value = role.builtIn;
        editForm.id = role.id;
        editForm.name = role.name;
        editForm.code = role.code;
        editForm.desc = role.desc;
        editVisible.value = true;
    }

    async function saveRole() {
        if (!editForm.name.trim()) {
            ElMessage.warning('请输入角色名称');
            return;
        }
        if (!editForm.id && !editForm.code.trim()) {
            ElMessage.warning('请输入角色编码');
            return;
        }
        saving.value = true;
        try {
            if (editForm.id) {
                await updateRoleAPI(editForm.id, { name: editForm.name.trim(), desc: editForm.desc });
            } else {
                await createRoleAPI({ name: editForm.name.trim(), code: editForm.code.trim(), desc: editForm.desc });
            }
            ElMessage.success('角色已保存');
            editVisible.value = false;
            getList();
        } finally {
            saving.value = false;
        }
    }

    onMounted(() => {
        getList();
        getPermissions();
    });
</script>

<style scoped lang="scss">
    .role-permission {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }
    .intro {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 18px 22px;

        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            color: $brandColor;
            background: $brandColorSoft;
            flex-shrink: 0;
        }
        h3 {
            font-size: 16px;
            font-weight: 500;
            color: $inkColor;
        }
        p {
            margin-top: 5px;
            font-size: 13px;
            color: $inkColor3;
        }
    }
    .role-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
    }
    .role-card {
        padding: 20px 22px;

        .name-row {
            display: flex;
            align-items: center;
            gap: 8px;

            h3 {
                font-size: 16px;
                font-weight: 600;
                color: $inkColor;
            }
        }
        .desc {
            margin-top: 8px;
            font-size: 12px;
            color: $inkColor3;
            min-height: 18px;
        }
        .stats {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 14px 0;
            padding: 10px 14px;
            border-radius: 10px;
            background: #f7f8fa;
            font-size: 12px;
            color: $inkColor3;

            b {
                margin-right: 3px;
                font-size: 15px;
                color: $brandColor;
            }
        }
        .foot {
            display: flex;
            gap: 10px;
        }
        &.add {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            min-height: 170px;
            border: 1px dashed #d9dce3;
            background: #fff;
            color: $inkColor3;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.25s ease;

            .el-icon { font-size: 26px; }
            &:hover {
                color: $brandColor;
                border-color: $brandColor;
            }
        }
    }
</style>
