/**
 * 商品 / 分类「原始数据表」
 * ---------------------------------------------------------------------------
 * 这里只维护最核心的信息（分类名、商品名、价格、卖点），
 * 其余的图片、SKU、详情长图、销量等，都在 products.ts 里按规则自动生成，
 * 这样数据量够大、页面够饱满，又不用手写上万行。
 */

/** 规格模板：[规格名, [规格值...]] */
export type SpecSeed = [string, string[]];

export interface GoodsSeed {
    /** 商品名 */
    name: string;
    /** 现价（元） */
    price: number;
    /** 划线原价，不传则按现价的 1.25 倍估算 */
    oldPrice?: number;
    /** 商品卖点（列表页会展示） */
    desc: string;
}

export interface SubSeed {
    /** 二级分类名 */
    name: string;
    goods: GoodsSeed[];
}

export interface CatSeed {
    /** 一级分类名 */
    name: string;
    /** 该分类下商品的规格模板（颜色/尺码/口味…） */
    specs: SpecSeed[];
    subs: SubSeed[];
}

/** 10 个一级分类、23 个二级分类、138 件商品 —— 参考小兔鲜的分类结构 */
export const CATALOG: CatSeed[] = [
    {
        name: '居家',
        specs: [
            ['颜色', ['象牙白', '雾霾蓝', '原木色']],
            ['规格', ['标准款', '加大款']],
        ],
        subs: [
            {
                name: '收纳整理',
                goods: [
                    { name: '可折叠收纳箱', price: 59, desc: '加厚耐压 折叠省空间' },
                    { name: '布艺收纳袋', price: 29.9, desc: '可水洗 大容量' },
                    { name: '免钉壁挂置物架', price: 45, desc: '免打孔 承重强' },
                    { name: '防尘透明鞋盒', price: 19.9, desc: '可叠加 一目了然' },
                    { name: '抽屉分隔收纳盒', price: 25.5, desc: '自由组合 分类整齐' },
                    { name: '加厚防滑衣架', price: 35, desc: '防滑不伤衣 省空间' },
                ],
            },
            {
                name: '清洁用品',
                goods: [
                    { name: '超细纤维平板拖把', price: 69, desc: '免手洗 吸水强' },
                    { name: '多效地板清洁剂', price: 29.9, desc: '清新去污 一擦即净' },
                    { name: '抗菌洗碗巾三件装', price: 15.9, desc: '不沾油 干得快' },
                    { name: '厨房重油污清洁剂', price: 39.9, desc: '快速溶解 免反复擦' },
                    { name: '衣物除螨柔顺喷雾', price: 49, desc: '留香持久 温和不刺激' },
                    { name: '加厚橡胶清洁手套', price: 19.9, desc: '贴合手型 防滑耐磨' },
                ],
            },
            {
                name: '厨房用具',
                goods: [
                    { name: '麦饭石不粘炒锅', price: 199, desc: '少油不粘 受热均匀' },
                    { name: '日式陶瓷餐具套装', price: 129, desc: '釉下彩 可微波' },
                    { name: '硅胶厨房铲勺套装', price: 59, desc: '耐高温 不伤锅' },
                    { name: '玻璃保鲜盒三件套', price: 79, desc: '密封保鲜 可冷冻' },
                    { name: '天然实木砧板', price: 89, desc: '整木无拼接 抗菌耐用' },
                    { name: '不锈钢双层沥水篮', price: 39.9, desc: '洗滤两用 沥水迅速' },
                ],
            },
        ],
    },
    {
        name: '美食',
        specs: [
            ['口味', ['原味', '香辣味']],
            ['规格', ['500g', '1kg']],
        ],
        subs: [
            {
                name: '新鲜水果',
                goods: [
                    { name: '智利进口车厘子2斤', price: 129, desc: '果肉饱满 脆甜多汁' },
                    { name: '云南高原蓝莓4盒', price: 59.9, desc: '果粉浓郁 酸甜可口' },
                    { name: '海南贵妃芒5斤', price: 49.9, desc: '皮薄核小 香甜软糯' },
                    { name: '广西沃柑10斤', price: 39.9, desc: '皮薄多汁 化渣清甜' },
                    { name: '山东红富士苹果5斤', price: 35.9, desc: '脆甜爽口 果香浓郁' },
                    { name: '新疆西州蜜瓜2个', price: 45, desc: '清甜多汁 入口化渣' },
                ],
            },
            {
                name: '休闲零食',
                goods: [
                    { name: '每日坚果30包', price: 89, desc: '独立小包 营养搭配' },
                    { name: '手撕软欧包6个', price: 29.9, desc: '柔软拉丝 麦香十足' },
                    { name: '海盐芝士曲奇', price: 39.9, desc: '咸甜交织 酥到掉渣' },
                    { name: '冻干水果脆片', price: 25.9, desc: '非油炸 保留原味' },
                    { name: '黑巧克力礼盒', price: 69, desc: '可可浓郁 微苦回甘' },
                    { name: '原切薯片组合装', price: 29.9, desc: '厚切酥脆 三种口味' },
                ],
            },
            {
                name: '粮油调味',
                goods: [
                    { name: '高山茶油1L', price: 158, desc: '冷压初榨 清淡不腻' },
                    { name: '五常稻花香大米10斤', price: 89, desc: '米香浓郁 粒粒分明' },
                    { name: '零添加特级酱油', price: 29.9, desc: '古法酿造 鲜味自然' },
                    { name: '冷榨亚麻籽油500ml', price: 79, desc: '低温冷榨 营养保留' },
                    { name: '云南单山蘸水', price: 19.9, desc: '香辣开胃 蘸什么都香' },
                    { name: '手工古法红糖', price: 35, desc: '甘蔗熬制 醇厚回甘' },
                ],
            },
        ],
    },
    {
        name: '服饰',
        specs: [
            ['颜色', ['经典黑', '米白', '雾霾蓝']],
            ['尺码', ['S', 'M', 'L', 'XL']],
        ],
        subs: [
            {
                name: '女装',
                goods: [
                    { name: '纯棉基础款圆领T恤', price: 89, desc: '柔软亲肤 不易变形' },
                    { name: '宽松垂感阔腿裤', price: 159, desc: '显瘦垂顺 舒适百搭' },
                    { name: '慵懒风针织开衫', price: 229, desc: '柔软细腻 一穿就爱' },
                    { name: '收腰显瘦连衣裙', price: 299, desc: '法式剪裁 温柔高级' },
                    { name: '羊毛混纺半身裙', price: 259, desc: '挺括有型 秋冬必备' },
                    { name: '轻薄防晒衣', price: 159, desc: 'UPF50+ 透气不闷' },
                ],
            },
            {
                name: '男装',
                goods: [
                    { name: '商务免烫衬衫', price: 199, desc: '免烫抗皱 挺括有型' },
                    { name: '针织圆领毛衣', price: 239, desc: '细腻不扎 内搭外穿' },
                    { name: '直筒休闲长裤', price: 199, desc: '弹力舒适 版型正' },
                    { name: '宽松工装夹克', price: 399, desc: '多口袋设计 硬朗耐穿' },
                    { name: '纯棉短袖POLO衫', price: 129, desc: '透气吸汗 商务休闲' },
                    { name: '加厚连帽卫衣', price: 259, desc: '抓绒内里 保暖有型' },
                ],
            },
            {
                name: '鞋靴',
                goods: [
                    { name: '轻便透气运动鞋', price: 269, desc: '回弹缓震 久走不累' },
                    { name: '复古低帮帆布鞋', price: 199, desc: '经典百搭 鞋型挺拔' },
                    { name: '软底静音居家拖鞋', price: 59, desc: '静音防滑 柔软回弹' },
                    { name: '真皮软底乐福鞋', price: 399, desc: '头层牛皮 一脚蹬' },
                    { name: '高帮休闲板鞋', price: 299, desc: '加厚鞋底 街头风' },
                    { name: '保暖加绒雪地靴', price: 359, desc: '抗寒保暖 防滑耐磨' },
                ],
            },
        ],
    },
    {
        name: '母婴',
        specs: [
            ['尺码', ['S码', 'M码', 'L码']],
            ['数量', ['单件装', '两件装']],
        ],
        subs: [
            {
                name: '婴儿服饰',
                goods: [
                    { name: '婴儿纯棉连体衣', price: 69, desc: 'A类面料 无骨缝制' },
                    { name: '新生儿和尚服套装', price: 89, desc: '系带设计 方便穿脱' },
                    { name: '儿童加绒卫衣套装', price: 129, desc: '柔软保暖 活动自如' },
                    { name: '婴儿防踢睡袋', price: 159, desc: '分腿设计 整夜安睡' },
                    { name: '宝宝纯棉包屁衣3件装', price: 99, desc: '亲肤透气 好换尿布' },
                    { name: '儿童纯棉袜子5双', price: 39, desc: '松口不勒 吸汗透气' },
                ],
            },
            {
                name: '喂养用品',
                goods: [
                    { name: '宽口径玻璃奶瓶240ml', price: 99, desc: '耐高温 防胀气' },
                    { name: '智能恒温调奶器', price: 259, desc: '恒温出水 冲奶更快' },
                    { name: '婴儿辅食机', price: 199, desc: '蒸煮搅拌 一键完成' },
                    { name: '食品级硅胶软勺套装', price: 45, desc: '柔软不伤牙龈' },
                    { name: '有机高铁米粉400g', price: 69, desc: '强化铁锌 易冲调' },
                    { name: '防漏学饮杯', price: 59, desc: '重力球吸管 怎么喝都不漏' },
                ],
            },
        ],
    },
    {
        name: '个护',
        specs: [
            ['规格', ['单瓶装', '两瓶装', '三瓶装']],
            ['香型', ['清新型', '滋润型']],
        ],
        subs: [
            {
                name: '洗发护发',
                goods: [
                    { name: '氨基酸温和洗发水', price: 69, desc: '温和清洁 蓬松不塌' },
                    { name: '生姜防脱洗发露', price: 89, desc: '清爽控油 强韧发根' },
                    { name: '深层修护发膜', price: 79, desc: '顺滑不打结 一梳到底' },
                    { name: '免洗护发精油', price: 59, desc: '抚平毛躁 光泽自然' },
                    { name: '控油蓬松洗发水', price: 75, desc: '无硅油 清爽一整天' },
                    { name: '头皮清洁按摩膏', price: 89, desc: '深层清洁 舒缓头皮' },
                ],
            },
            {
                name: '口腔护理',
                goods: [
                    { name: '声波电动牙刷', price: 199, desc: '五档模式 长续航' },
                    { name: '软毛护龈牙刷4支装', price: 39, desc: '细软刷毛 温和呵护' },
                    { name: '清新薄荷漱口水', price: 45, desc: '温和不辣口 长效清新' },
                    { name: '益生菌清新牙膏', price: 39.9, desc: '温和去渍 口气清新' },
                    { name: '便携式冲牙器', price: 299, desc: '脉冲水流 深层清洁' },
                    { name: '细滑牙线棒100支', price: 19.9, desc: '不易断 顺滑入缝' },
                ],
            },
        ],
    },
    {
        name: '严选',
        specs: [
            ['颜色', ['原色', '米白', '墨绿']],
            ['规格', ['标准款', '礼盒装']],
        ],
        subs: [
            {
                name: '家居好物',
                goods: [
                    { name: '棉麻质感抱枕套', price: 49, desc: '粗粝手感 自然质朴' },
                    { name: '手工冷制皂', price: 39, desc: '植物油脂 温和洁净' },
                    { name: '香薰蜡烛礼盒', price: 129, desc: '植物大豆蜡 缓慢燃烧' },
                    { name: '手作陶瓷花瓶', price: 89, desc: '手工拉坯 独一无二' },
                    { name: '北欧复古挂钟', price: 119, desc: '静音机芯 简约耐看' },
                    { name: '加厚帆布托特包', price: 69, desc: '能装耐造 通勤好用' },
                ],
            },
            {
                name: '精选食品',
                goods: [
                    { name: '云南小粒咖啡豆', price: 99, desc: '中深烘焙 醇厚回甘' },
                    { name: '明前特级龙井茶', price: 189, desc: '豆香明显 鲜爽甘醇' },
                    { name: '手工黑糖姜茶', price: 59, desc: '真材实料 暖身暖心' },
                    { name: '深山原蜜500g', price: 79, desc: '自然成熟 花香浓郁' },
                    { name: '原味即食燕麦片', price: 35, desc: '无蔗糖 冲泡即食' },
                    { name: '冻干柠檬片', price: 29, desc: '冷萃锁鲜 酸甜清香' },
                ],
            },
        ],
    },
    {
        name: '数码',
        specs: [
            ['颜色', ['曜石黑', '极光白']],
            ['版本', ['标准版', '升级版']],
        ],
        subs: [
            {
                name: '影音娱乐',
                goods: [
                    { name: '真无线蓝牙耳机', price: 299, desc: '低延迟 长续航' },
                    { name: '便携蓝牙音箱', price: 199, desc: '360°环绕 防水防泼' },
                    { name: '有线入耳式耳机', price: 89, desc: '重低音 佩戴稳固' },
                    { name: '头戴式降噪耳机', price: 599, desc: '主动降噪 沉浸聆听' },
                    { name: '高清无线投屏器', price: 199, desc: '即插即投 稳定不掉线' },
                    { name: '桌面USB麦克风', price: 259, desc: '心形指向 收音清晰' },
                ],
            },
            {
                name: '智能设备',
                goods: [
                    { name: '智能运动手表', price: 499, desc: '心率血氧 多项运动' },
                    { name: '智能体脂秤', price: 129, desc: '多项数据 App记录' },
                    { name: '移动电源20000mAh', price: 159, desc: '双向快充 可上飞机' },
                    { name: '无线快充充电器', price: 89, desc: '15W快充 智能控温' },
                    { name: '智能温湿度计', price: 59, desc: '墨水屏 超长待机' },
                    { name: '桌面无线充电支架', price: 119, desc: '边充边看 一放即充' },
                ],
            },
        ],
    },
    {
        name: '运动',
        specs: [
            ['颜色', ['经典黑', '荧光绿']],
            ['尺码', ['S', 'M', 'L', 'XL']],
        ],
        subs: [
            {
                name: '健身器材',
                goods: [
                    { name: '加厚防滑瑜伽垫', price: 129, desc: '不打滑 回弹好' },
                    { name: '可调节哑铃20kg', price: 299, desc: '快速调重 家用省空间' },
                    { name: '弹力带套装', price: 59, desc: '五档阻力 居家塑形' },
                    { name: '智能计数跳绳', price: 45, desc: '自动计数 不打结' },
                    { name: '仰卧起坐辅助器', price: 79, desc: '稳固吸盘 助力卷腹' },
                    { name: '泡沫轴肌肉放松棒', price: 69, desc: '深层放松 缓解酸痛' },
                ],
            },
            {
                name: '户外装备',
                goods: [
                    { name: '轻量折叠登山杖', price: 99, desc: '超轻便携 减震护膝' },
                    { name: '便携保温水壶', price: 89, desc: '316内胆 长效保温' },
                    { name: '户外速干毛巾', price: 39, desc: '吸水速干 轻巧便携' },
                    { name: '便携露营折叠椅', price: 159, desc: '铝合金架 承重稳固' },
                    { name: '户外双肩包30L', price: 229, desc: '多隔层 透气背负' },
                    { name: '防风防雨冲锋衣', price: 499, desc: '防泼水 透气不闷' },
                ],
            },
        ],
    },
    {
        name: '杂货',
        specs: [
            ['颜色', ['原木色', '奶油白', '高级灰']],
            ['规格', ['标准款', '加大款']],
        ],
        subs: [
            {
                name: '文具办公',
                goods: [
                    { name: '简约按动中性笔10支', price: 25, desc: '顺滑速干 不易断墨' },
                    { name: '加厚A5笔记本', price: 29, desc: '纸质顺滑 不洇墨' },
                    { name: '桌面文件收纳架', price: 59, desc: '多层分区 桌面整洁' },
                    { name: '大容量多功能笔袋', price: 39, desc: '多变收纳 手感柔软' },
                    { name: '桌面木架台历', price: 29, desc: '素雅耐看 可换内芯' },
                    { name: '透明书籍收纳盒', price: 45, desc: '防尘防潮 取用方便' },
                ],
            },
            {
                name: '家居装饰',
                goods: [
                    { name: '北欧风装饰画', price: 89, desc: '高清微喷 装点墙面' },
                    { name: '仿真绿植盆栽', price: 59, desc: '免打理 四季常青' },
                    { name: '棉麻遮光窗帘', price: 159, desc: '遮光透气 垂感自然' },
                    { name: '落地多层置物架', price: 199, desc: '承重稳固 收纳有型' },
                    { name: '简约几何地毯', price: 129, desc: '短绒柔软 防滑底背' },
                    { name: '香薰加湿器', price: 129, desc: '细雾静音 夜灯氛围' },
                ],
            },
        ],
    },
    {
        name: '品牌',
        specs: [
            ['规格', ['标准装', '礼盒装', '限量装']],
            ['款式', ['经典款', '联名款']],
        ],
        subs: [
            {
                name: '品牌联名',
                goods: [
                    { name: '联名限定礼盒', price: 299, desc: '限定包装 送礼有面' },
                    { name: '品牌定制帆布包', price: 89, desc: '厚实帆布 印花细腻' },
                    { name: '联名款马克杯', price: 79, desc: '釉面细腻 手感温润' },
                    { name: '限量收藏手办', price: 399, desc: '细节精致 收藏摆件' },
                    { name: '品牌周边卫衣', price: 259, desc: '宽松版型 舒适耐穿' },
                    { name: '联名香薰套装', price: 199, desc: '气味层次 持久萦绕' },
                ],
            },
            {
                name: '经典系列',
                goods: [
                    { name: '经典款纯棉浴巾', price: 99, desc: '加厚吸水 柔软亲肤' },
                    { name: '经典款保温杯', price: 129, desc: '长效保温 一键弹盖' },
                    { name: '经典款香薰蜡烛', price: 159, desc: '淡雅香气 舒缓身心' },
                    { name: '经典款真丝眼罩', price: 89, desc: '柔滑亲肤 全遮光' },
                    { name: '经典款羊毛围巾', price: 299, desc: '柔软保暖 显气质' },
                    { name: '经典款皮具钥匙扣', price: 69, desc: '真皮压印 精致耐用' },
                ],
            },
        ],
    },
];
