/**
 * 用户相关假接口：登录、会员中心「猜你喜欢」
 */
import { buildUserInfo } from '../data/seed';
import { fail, toText, type MockContext } from '../types';

export const userRoutes = {
    /**
     * 登录：演示环境不做真实校验
     * 账号随便填，密码长度 ≥ 6 位即可登录成功
     */
    'POST /login': (ctx: MockContext) => {
        const data = ctx.data ?? {};
        const account = toText(data.account).trim();
        const password = toText(data.password);
        if (!account) fail(400, '账号不能为空');
        if (password.length < 6) fail(400, '密码长度至少 6 位');
        return buildUserInfo(account);
    },
};
