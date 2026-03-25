// 假数据生成器 - 对标远程平台真实数据
const MockData = {
    // 当前角色
    currentRole: 'admin', // admin-教育局管理员, principal-园长, teacher-教师

    // 角色数据
    roles: {
        admin: {
            id: 'admin',
            name: '教育局管理员',
            icon: '👔',
            description: '查看全区数据'
        },
        principal: {
            id: 'principal',
            name: '园长',
            icon: '🏫',
            description: '查看本园数据'
        },
        teacher: {
            id: 'teacher',
            name: '教师',
            icon: '👩‍🏫',
            description: '查看本班数据'
        }
    },

    // 园所数据（教育局管理员可见）
    kindergartens: [
        { id: 1, name: '阳光幼儿园', district: '朝阳区', studentCount: 249, classCount: 18, teacherCount: 42 },
        { id: 2, name: '彩虹幼儿园', district: '朝阳区', studentCount: 186, classCount: 12, teacherCount: 28 },
        { id: 3, name: '花朵幼儿园', district: '海淀区', studentCount: 312, classCount: 20, teacherCount: 45 },
        { id: 4, name: '希望幼儿园', district: '海淀区', studentCount: 178, classCount: 10, teacherCount: 22 },
        { id: 5, name: '童星幼儿园', district: '西城区', studentCount: 225, classCount: 15, teacherCount: 35 }
    ],

    kindergartenClassUsageComparison: [
        { kindergartenId: 1, name: '阳光幼儿园', avgActivityCount: 10.6, avgActivityDuration: 4.9, avgDeviceUseCount: 28.1, avgParticipantCount: 16.8 },
        { kindergartenId: 2, name: '彩虹幼儿园', avgActivityCount: 8.9, avgActivityDuration: 4.1, avgDeviceUseCount: 24.6, avgParticipantCount: 15.2 },
        { kindergartenId: 3, name: '花朵幼儿园', avgActivityCount: 11.8, avgActivityDuration: 5.3, avgDeviceUseCount: 30.4, avgParticipantCount: 17.6 },
        { kindergartenId: 4, name: '希望幼儿园', avgActivityCount: 7.6, avgActivityDuration: 3.7, avgDeviceUseCount: 21.3, avgParticipantCount: 13.9 },
        { kindergartenId: 5, name: '童星幼儿园', avgActivityCount: 9.7, avgActivityDuration: 4.5, avgDeviceUseCount: 26.8, avgParticipantCount: 16.1 }
    ],

    currentKindergarten: null,
    currentClass: null,
    currentStudent: null,

    // 班级数据
    classes: [
        { id: 1, name: '大一班', kindergartenId: 1, studentCount: 35, teacherCount: 3, teacherName: '张晓梅', activityCount: 42, activityDuration: '18.5h', deviceUseCount: 86, participantCount: 32 },
        { id: 2, name: '大二班', kindergartenId: 1, studentCount: 32, teacherCount: 3, teacherName: '李文华', activityCount: 38, activityDuration: '16.2h', deviceUseCount: 78, participantCount: 30 },
        { id: 3, name: '中一班', kindergartenId: 1, studentCount: 28, teacherCount: 2, teacherName: '王秀英', activityCount: 31, activityDuration: '13.8h', deviceUseCount: 65, participantCount: 26 },
        { id: 4, name: '中二班', kindergartenId: 1, studentCount: 30, teacherCount: 2, teacherName: '赵丽娟', activityCount: 28, activityDuration: '12.1h', deviceUseCount: 58, participantCount: 27 },
        { id: 5, name: '小一班', kindergartenId: 1, studentCount: 25, teacherCount: 2, teacherName: '陈美玲', activityCount: 22, activityDuration: '9.6h', deviceUseCount: 45, participantCount: 22 },
        { id: 6, name: '小二班', kindergartenId: 1, studentCount: 24, teacherCount: 2, teacherName: '周雪梅', activityCount: 19, activityDuration: '8.3h', deviceUseCount: 40, participantCount: 20 },
        { id: 7, name: '大三班', kindergartenId: 1, studentCount: 33, teacherCount: 3, teacherName: '刘芳', activityCount: 15, activityDuration: '6.5h', deviceUseCount: 52, participantCount: 18 },
        { id: 8, name: '中三班', kindergartenId: 1, studentCount: 26, teacherCount: 2, teacherName: '孙婷', activityCount: 10, activityDuration: '4.2h', deviceUseCount: 38, participantCount: 15 },
        { id: 9, name: '小三班', kindergartenId: 1, studentCount: 22, teacherCount: 2, teacherName: '吴敏', activityCount: 7, activityDuration: '3.1h', deviceUseCount: 32, participantCount: 12 },
        { id: 10, name: '大四班', kindergartenId: 1, studentCount: 30, teacherCount: 3, teacherName: '郑慧', activityCount: 0, activityDuration: '0h', deviceUseCount: 28, participantCount: 0 },
        { id: 11, name: '中四班', kindergartenId: 1, studentCount: 27, teacherCount: 2, teacherName: '黄丽', activityCount: 0, activityDuration: '0h', deviceUseCount: 22, participantCount: 0 },
        { id: 12, name: '小四班', kindergartenId: 1, studentCount: 20, teacherCount: 2, teacherName: '林静', activityCount: 0, activityDuration: '0h', deviceUseCount: 18, participantCount: 0 },
        { id: 13, name: '大五班', kindergartenId: 1, studentCount: 31, teacherCount: 3, teacherName: '徐萍', activityCount: 0, activityDuration: '0h', deviceUseCount: 25, participantCount: 0 },
        { id: 14, name: '中五班', kindergartenId: 1, studentCount: 25, teacherCount: 2, teacherName: '马丽', activityCount: 0, activityDuration: '0h', deviceUseCount: 20, participantCount: 0 },
        { id: 15, name: '小五班', kindergartenId: 1, studentCount: 21, teacherCount: 2, teacherName: '何芳', activityCount: 0, activityDuration: '0h', deviceUseCount: 15, participantCount: 0 },
        { id: 16, name: '大六班', kindergartenId: 1, studentCount: 29, teacherCount: 3, teacherName: '罗敏', activityCount: 0, activityDuration: '0h', deviceUseCount: 30, participantCount: 0 },
        { id: 17, name: '中六班', kindergartenId: 1, studentCount: 24, teacherCount: 2, teacherName: '谢芳', activityCount: 0, activityDuration: '0h', deviceUseCount: 18, participantCount: 0 },
        { id: 18, name: '小小班', kindergartenId: 1, studentCount: 17, teacherCount: 2, teacherName: '杨静', activityCount: 0, activityDuration: '0h', deviceUseCount: 12, participantCount: 0 }
    ],

    // 学生数据
    students: [
        { id: 1, name: '张小明', code: 'S20240001', classId: 1, className: '大一班', activityCount: 18, activityDuration: '5.2h', bookCount: 12 },
        { id: 2, name: '李小红', code: 'S20240002', classId: 1, className: '大一班', activityCount: 16, activityDuration: '4.8h', bookCount: 11 },
        { id: 3, name: '王小刚', code: 'S20240003', classId: 1, className: '大一班', activityCount: 15, activityDuration: '4.5h', bookCount: 10 },
        { id: 4, name: '赵小丽', code: 'S20240004', classId: 2, className: '大二班', activityCount: 14, activityDuration: '4.1h', bookCount: 9 },
        { id: 5, name: '陈小华', code: 'S20240005', classId: 2, className: '大二班', activityCount: 13, activityDuration: '3.9h', bookCount: 8 },
        { id: 6, name: '刘小芳', code: 'S20240006', classId: 3, className: '中一班', activityCount: 12, activityDuration: '3.6h', bookCount: 8 },
        { id: 7, name: '孙小伟', code: 'S20240007', classId: 3, className: '中一班', activityCount: 11, activityDuration: '3.3h', bookCount: 7 },
        { id: 8, name: '周小琳', code: 'S20240008', classId: 4, className: '中二班', activityCount: 10, activityDuration: '3.0h', bookCount: 7 },
        { id: 9, name: '吴小杰', code: 'S20240009', classId: 5, className: '小一班', activityCount: 9, activityDuration: '2.7h', bookCount: 6 },
        { id: 10, name: '郑小雪', code: 'S20240010', classId: 5, className: '小一班', activityCount: 8, activityDuration: '2.4h', bookCount: 5 },
        { id: 11, name: '黄小龙', code: 'S20240011', classId: 1, className: '大一班', activityCount: 7, activityDuration: '2.1h', bookCount: 5 },
        { id: 12, name: '林小燕', code: 'S20240012', classId: 2, className: '大二班', activityCount: 6, activityDuration: '1.8h', bookCount: 4 },
        { id: 13, name: '徐小鹏', code: 'S20240013', classId: 3, className: '中一班', activityCount: 5, activityDuration: '1.5h', bookCount: 4 },
        { id: 14, name: '马小丽', code: 'S20240014', classId: 4, className: '中二班', activityCount: 4, activityDuration: '1.2h', bookCount: 3 },
        { id: 15, name: '何小文', code: 'S20240015', classId: 6, className: '小二班', activityCount: 3, activityDuration: '0.9h', bookCount: 3 }
    ],

    // ========== 大数据总览 - 对标远程平台 ==========
    // 核心指标卡片（对标远程平台4个指标）
    dataOverviewStats: {
        activityCount: 212,       // 绘本活动次数
        activityDuration: 99.38,  // 绘本活动时长(h)
        participantCount: 191,    // 参与活动人次
        readingDuration: 7.37     // 绘本阅读时长(h)
    },

    // 绘本类型占比（对标远程平台饼图）
    bookTypes: [
        { name: '日常生活', value: 44, color: '#3b82f6' },
        { name: '人际交往', value: 60, color: '#06b6d4' },
        { name: '情商品格', value: 20, color: '#8b5cf6' },
        { name: '国学文化', value: 14, color: '#f59e0b' },
        { name: '科普百科', value: 9, color: '#10b981' },
        { name: '语言学习', value: 4, color: '#ef4444' }
    ],

    // 能力分布（对标远程平台雷达图）
    abilityDistribution: [
        { name: '语言表达', value: 85 },
        { name: '社交能力', value: 92 },
        { name: '情感认知', value: 78 },
        { name: '想象创造', value: 88 },
        { name: '逻辑思维', value: 72 },
        { name: '文化素养', value: 68 }
    ],

    // 近七日园所绘本活动次数
    weeklyActivity: {
        dates: ['03-04', '03-05', '03-06', '03-07', '03-08', '03-09', '03-10'],
        values: [28, 35, 32, 41, 22, 18, 36]
    },

    // 绘本活动次数排名前十班级
    classRanking: [
        { name: '大一班', count: 42, teacher: '张晓梅' },
        { name: '大二班', count: 38, teacher: '李文华' },
        { name: '中一班', count: 31, teacher: '王秀英' },
        { name: '中二班', count: 28, teacher: '赵丽娟' },
        { name: '小一班', count: 22, teacher: '陈美玲' },
        { name: '小二班', count: 19, teacher: '周雪梅' },
        { name: '大三班', count: 15, teacher: '刘芳' },
        { name: '中三班', count: 10, teacher: '孙婷' },
        { name: '小三班', count: 7, teacher: '吴敏' },
        { name: '大四班', count: 0, teacher: '郑慧' }
    ],

    // 绘本活动次数排名前十教师
    teacherRanking: [
        { name: '张晓梅', class: '大一班', count: 42 },
        { name: '李文华', class: '大二班', count: 38 },
        { name: '王秀英', class: '中一班', count: 31 },
        { name: '赵丽娟', class: '中二班', count: 28 },
        { name: '陈美玲', class: '小一班', count: 22 },
        { name: '周雪梅', class: '小二班', count: 19 },
        { name: '刘芳', class: '大三班', count: 15 },
        { name: '孙婷', class: '中三班', count: 10 },
        { name: '吴敏', class: '小三班', count: 7 },
        { name: '郑慧', class: '大四班', count: 0 }
    ],

    // 绘本活动推送及家长阅读次数
    parentReading: {
        dates: ['03-04', '03-05', '03-06', '03-07', '03-08', '03-09', '03-10'],
        pushCount: [15, 22, 18, 25, 12, 8, 20],
        readCount: [8, 14, 11, 18, 7, 5, 13]
    },

    // 阅读次数排名前十绘本
    bookRanking: [
        { rank: 1, name: '永远永远爱你', type: '情商品格', reads: 19, duration: '5.7h', isbn: '978-7-5448-1234-5' },
        { rank: 2, name: '团圆', type: '国学文化', reads: 11, duration: '3.3h', isbn: '978-7-5448-2345-6' },
        { rank: 3, name: '我爸爸', type: '人际交往', reads: 9, duration: '2.7h', isbn: '978-7-5448-3456-7' },
        { rank: 4, name: '猜猜我有多爱你', type: '情商品格', reads: 8, duration: '2.4h', isbn: '978-7-5448-4567-8' },
        { rank: 5, name: '哇哦，鳄鱼也想要惊喜', type: '日常生活', reads: 7, duration: '2.1h', isbn: '978-7-5448-5678-9' },
        { rank: 6, name: '母鸡萝丝去散步', type: '日常生活', reads: 5, duration: '1.5h', isbn: '978-7-5448-6789-0' },
        { rank: 7, name: '花婆婆', type: '日常生活', reads: 4, duration: '1.2h', isbn: '978-7-5448-7890-1' },
        { rank: 8, name: '爱跳舞的小龙', type: '人际交往', reads: 3, duration: '0.9h', isbn: '978-7-5448-8901-2' },
        { rank: 9, name: '胆小鬼威利', type: '情商品格', reads: 3, duration: '0.9h', isbn: '978-7-5448-9012-3' },
        { rank: 10, name: '古利和古拉', type: '日常生活', reads: 3, duration: '0.9h', isbn: '978-7-5448-0123-4' }
    ],

    // ========== 园所数据 - 对标远程平台7个标签页 ==========
    schoolData: {
        // 数据概述
        overview: {
            activityTotal: 212,
            activityDuration: 99.38,
            bookTotal: 75,
            bookReadCount: 147,
            bookReadDuration: 7.37,
            deviceTotal: 13,
            deviceUseCount: 634,
            deviceUseDuration: 292.57,
            classTotal: 18,
            teacherTotal: 42,
            studentTotal: 249,
            // 分类阅读数据
            categoryData: [
                { name: '日常生活', readCount: 44, duration: '2.03h' },
                { name: '科普百科', readCount: 9, duration: '0.45h' },
                { name: '语言学习', readCount: 4, duration: '0.32h' },
                { name: '国学文化', readCount: 14, duration: '0.65h' },
                { name: '情商品格', readCount: 20, duration: '1.11h' },
                { name: '人际交往', readCount: 60, duration: '3.16h' }
            ]
        },

        // 绘本活动列表
        activities: (() => {
            const activities = [];
            const classNames = ['大一班', '大二班', '中一班', '中二班', '小一班', '小二班', '大三班', '中三班', '小三班'];
            const teacherNames = ['张晓梅', '李文华', '王秀英', '赵丽娟', '陈美玲', '周雪梅', '刘芳', '孙婷', '吴敏'];
            for (let i = 0; i < 212; i++) {
                const classIdx = i % classNames.length;
                const day = Math.floor(i / 8) + 1;
                const month = day > 28 ? '01' : '02';
                const d = day > 28 ? day - 28 : day;
                activities.push({
                    id: i + 1,
                    startTime: `2026-${month}-${String(d).padStart(2, '0')} ${8 + (i % 8)}:00:00`,
                    endTime: `2026-${month}-${String(d).padStart(2, '0')} ${8 + (i % 8)}:30:00`,
                    teacher: teacherNames[classIdx],
                    className: classNames[classIdx],
                    studentCount: 15 + (i % 20),
                    students: ['张小明', '李小红', '王小刚'].slice(0, 2 + (i % 3))
                });
            }
            return activities;
        })(),

        // 绘本列表（75本）
        books: (() => {
            const types = ['日常生活', '人际交往', '情商品格', '国学文化', '科普百科', '语言学习'];
            const bookNames = [
                '永远永远爱你', '团圆', '我爸爸', '猜猜我有多爱你', '哇哦，鳄鱼也想要惊喜',
                '母鸡萝丝去散步', '花婆婆', '爱跳舞的小龙', '胆小鬼威利', '古利和古拉',
                '好饿的毛毛虫', '大卫不可以', '逃家小兔', '爷爷一定有办法', '彩虹色的花',
                '小蓝和小黄', '我妈妈', '蚯蚓的日记', '活了100万次的猫', '石头汤',
                '三只小猪', '小红帽', '丑小鸭', '龟兔赛跑', '狐狸和葡萄',
                '白雪公主', '灰姑娘', '小王子', '夏洛的网', '绿野仙踪',
                '爱心树', '失落的一角', '你看起来好像很好吃', '我是霸王龙', '遇到你真好',
                '小猪佩奇', '汪汪队', '超级飞侠', '海底小纵队', '小马宝莉',
                '不一样的卡梅拉', '神奇校车', '十万个为什么', '昆虫记', '海底两万里',
                '弟子规', '三字经', '唐诗三百首', '论语故事', '成语故事',
                '小熊维尼', '米老鼠', '唐老鸭', '白雪公主', '睡美人',
                '木偶奇遇记', '爱丽丝梦游仙境', '彼得潘', '长袜子皮皮', '淘气包马小跳',
                '窗边的小豆豆', '草房子', '青铜葵花', '曹冲称象', '司马光砸缸',
                '孔融让梨', '铁杵磨针', '愚公移山', '精卫填海', '女娲补天',
                '嫦娥奔月', '后羿射日', '大禹治水', '盘古开天', '哪吒闹海'
            ];
            return bookNames.map((name, i) => ({
                id: i + 1,
                name: name,
                isbn: `978-7-5448-${String(1000 + i).padStart(4, '0')}-${i % 10}`,
                type: types[i % types.length],
                readCount: Math.max(0, 19 - Math.floor(i * 0.3)),
                readDuration: `${(Math.max(0.1, 5.7 - i * 0.08)).toFixed(2)}h`
            }));
        })(),

        // 教师列表（42人）
        teachers: (() => {
            const names = ['张晓梅', '李文华', '王秀英', '赵丽娟', '陈美玲', '周雪梅', '刘芳', '孙婷', '吴敏', '郑慧',
                '黄丽', '林静', '徐萍', '马丽', '何芳', '罗敏', '谢芳', '杨静', '韩雪', '唐敏',
                '曹丽', '许芳', '邓静', '萧雪', '任敏', '姚丽', '彭芳', '潘静', '蒋雪', '蔡敏',
                '田丽', '董芳', '袁静', '邹雪', '陆敏', '石丽', '崔芳', '贾静', '夏雪', '魏敏',
                '方丽', '侯芳'];
            return names.map((name, i) => ({
                id: i + 1,
                name: name,
                activityCount: Math.max(0, 42 - i * 1),
                activityDuration: `${Math.max(0, 18.5 - i * 0.45).toFixed(1)}h`
            }));
        })()
    },

    // ========== 设备管理数据 ==========
    devices: [
        { id: 1, sn: 'DEV-2024-001', code: 'A001', status: '在线', useCount: 86, useDuration: '38.5h', lastUseTime: '2026-03-10 15:30:00', bindSchool: '阳光幼儿园', bindClass: '大一班' },
        { id: 2, sn: 'DEV-2024-002', code: 'A002', status: '在线', useCount: 78, useDuration: '35.2h', lastUseTime: '2026-03-10 14:45:00', bindSchool: '阳光幼儿园', bindClass: '大二班' },
        { id: 3, sn: 'DEV-2024-003', code: 'A003', status: '在线', useCount: 65, useDuration: '29.8h', lastUseTime: '2026-03-10 16:00:00', bindSchool: '阳光幼儿园', bindClass: '中一班' },
        { id: 4, sn: 'DEV-2024-004', code: 'A004', status: '离线', useCount: 58, useDuration: '26.1h', lastUseTime: '2026-03-09 17:30:00', bindSchool: '阳光幼儿园', bindClass: '中二班' },
        { id: 5, sn: 'DEV-2024-005', code: 'A005', status: '在线', useCount: 45, useDuration: '20.3h', lastUseTime: '2026-03-10 13:20:00', bindSchool: '阳光幼儿园', bindClass: '小一班' },
        { id: 6, sn: 'DEV-2024-006', code: 'A006', status: '在线', useCount: 40, useDuration: '18.0h', lastUseTime: '2026-03-10 11:50:00', bindSchool: '阳光幼儿园', bindClass: '小二班' },
        { id: 7, sn: 'DEV-2024-007', code: 'A007', status: '离线', useCount: 52, useDuration: '23.4h', lastUseTime: '2026-03-08 16:40:00', bindSchool: '阳光幼儿园', bindClass: '大三班' },
        { id: 8, sn: 'DEV-2024-008', code: 'A008', status: '在线', useCount: 38, useDuration: '17.1h', lastUseTime: '2026-03-10 10:30:00', bindSchool: '阳光幼儿园', bindClass: '中三班' },
        { id: 9, sn: 'DEV-2024-009', code: 'A009', status: '在线', useCount: 32, useDuration: '14.4h', lastUseTime: '2026-03-10 09:15:00', bindSchool: '阳光幼儿园', bindClass: '小三班' },
        { id: 10, sn: 'DEV-2024-010', code: 'A010', status: '离线', useCount: 28, useDuration: '12.6h', lastUseTime: '2026-03-07 15:00:00', bindSchool: '阳光幼儿园', bindClass: '大四班' },
        { id: 11, sn: 'DEV-2024-011', code: 'A011', status: '在线', useCount: 22, useDuration: '9.9h', lastUseTime: '2026-03-10 08:45:00', bindSchool: '阳光幼儿园', bindClass: '中四班' },
        { id: 12, sn: 'DEV-2024-012', code: 'A012', status: '在线', useCount: 18, useDuration: '8.1h', lastUseTime: '2026-03-10 14:10:00', bindSchool: '阳光幼儿园', bindClass: '小四班' },
        { id: 13, sn: 'DEV-2024-013', code: 'A013', status: '离线', useCount: 72, useDuration: '39.2h', lastUseTime: '2026-03-06 12:30:00', bindSchool: '阳光幼儿园', bindClass: '大五班' }
    ],

    // ========== 用户管理数据 ==========
    users: [
        { id: 1, account: 'admin001', name: '系统管理员', role: '管理员', phone: '138****1234', status: '启用', createTime: '2025-09-01 10:00:00' },
        { id: 2, account: 'jtpeng', name: '彭老师', role: '管理员', phone: '139****5678', status: '启用', createTime: '2025-09-01 10:00:00' },
        { id: 3, account: 'principal01', name: '李园长', role: '园长', phone: '137****9012', status: '启用', createTime: '2025-09-15 14:30:00' },
        { id: 4, account: 'teacher01', name: '张晓梅', role: '教师', phone: '136****3456', status: '启用', createTime: '2025-10-01 09:00:00' },
        { id: 5, account: 'teacher02', name: '李文华', role: '教师', phone: '135****7890', status: '启用', createTime: '2025-10-01 09:00:00' },
        { id: 6, account: 'teacher03', name: '王秀英', role: '教师', phone: '134****2345', status: '启用', createTime: '2025-10-05 11:00:00' },
        { id: 7, account: 'teacher04', name: '赵丽娟', role: '教师', phone: '133****6789', status: '停用', createTime: '2025-10-10 08:30:00' },
        { id: 8, account: 'parent01', name: '张先生', role: '家长', phone: '132****0123', status: '启用', createTime: '2025-11-01 16:00:00' },
        { id: 9, account: 'parent02', name: '李女士', role: '家长', phone: '131****4567', status: '启用', createTime: '2025-11-05 10:00:00' },
        { id: 10, account: 'parent03', name: '王先生', role: '家长', phone: '130****8901', status: '停用', createTime: '2025-11-10 14:00:00' }
    ],

    // 时间范围数据（保留兼容）
    timeRanges: {
        today: { label: '今日', totalActivities: 36, activitiesGrowth: '+8.3%', totalDuration: 16.5, durationGrowth: '+5.2%', totalParticipants: 28, participantsGrowth: '+12.1%', avgDuration: 27.5, avgGrowth: '+3.1%' },
        week: { label: '本周', totalActivities: 212, activitiesGrowth: '+15.6%', totalDuration: 99.38, durationGrowth: '+12.3%', totalParticipants: 191, participantsGrowth: '+18.5%', avgDuration: 28.1, avgGrowth: '+5.7%' },
        month: { label: '本月', totalActivities: 212, activitiesGrowth: '+22.4%', totalDuration: 99.38, durationGrowth: '+18.7%', totalParticipants: 191, participantsGrowth: '+25.3%', avgDuration: 28.1, avgGrowth: '+7.2%' }
    },

    // 高级分析数据
    advancedAnalysis: {
        comparisonData: {
            classComparison: [
                { className: '大一班', activityCount: 42, avgDuration: 26.4, completionRate: 92.5, engagementScore: 88 },
                { className: '大二班', activityCount: 38, avgDuration: 25.6, completionRate: 89.3, engagementScore: 85 },
                { className: '中一班', activityCount: 31, avgDuration: 26.7, completionRate: 87.8, engagementScore: 82 },
                { className: '小一班', activityCount: 22, avgDuration: 26.2, completionRate: 88.9, engagementScore: 80 }
            ],
            timePeriodComparison: [
                { period: '上午(8:00-11:00)', activityCount: 125, avgDuration: 25.3, participationRate: 78 },
                { period: '下午(14:00-17:00)', activityCount: 68, avgDuration: 28.7, participationRate: 72 },
                { period: '傍晚(17:00-19:00)', activityCount: 19, avgDuration: 32.1, participationRate: 65 }
            ],
            typeComparison: [
                { type: '人际交往', totalCount: 60, avgRating: 4.7, popularityIndex: 92 },
                { type: '日常生活', totalCount: 44, avgRating: 4.5, popularityIndex: 88 },
                { type: '情商品格', totalCount: 20, avgRating: 4.8, popularityIndex: 85 },
                { type: '国学文化', totalCount: 14, avgRating: 4.6, popularityIndex: 82 }
            ]
        },
        trendPrediction: {
            future30Days: { dates: [], predictedActivities: [], confidenceInterval: [] },
            seasonalTrends: [
                { season: '春季', avgActivities: 250, growthRate: 15.2 },
                { season: '夏季', avgActivities: 180, growthRate: -8.5 },
                { season: '秋季', avgActivities: 320, growthRate: 28.3 },
                { season: '冬季', avgActivities: 210, growthRate: 5.1 }
            ]
        }
    },

    // ========== AI分析数据 - 深度分析版 v1.2 ==========
    aiAnalysis: {
        // ========== 园长视角 - 园所深度分析 ==========
        school: {
            // 园所健康度评分
            healthScore: 82,
            healthDimensions: [
                { name: '活动活跃度', score: 88 },
                { name: '参与质量', score: 76 },
                { name: '设备利用', score: 72 },
                { name: '教师投入', score: 85 },
                { name: '绘本覆盖', score: 70 }
            ],

            // 趋势洞察 - 周月对比
            trendInsight: {
                weekComparison: {
                    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    thisWeek: [28, 35, 32, 41, 22, 18, 36],
                    lastWeek: [24, 30, 28, 35, 19, 15, 31],
                    lastMonth: [20, 26, 24, 30, 16, 12, 26]
                },
                monthlyTrend: {
                    labels: ['11月', '12月', '1月', '2月', '3月', '4月(预)'],
                    actual: [120, 145, 168, 180, 212, null],
                    predicted: [null, null, null, 180, 212, 235]
                }
            },

            // 异常检测
            anomalyDetection: {
                lowActivityClasses: [
                    { name: '大四班', activityRate: 12 },
                    { name: '中四班', activityRate: 18 },
                    { name: '大三班', activityRate: 35 }
                ],
                alerts: [
                    { icon: '🔴', title: '大四班连续2周无活动', description: '建议与郑慧老师沟通了解情况', level: 'high' },
                    { icon: '🟡', title: '周末活动量偏低', description: '可考虑设计亲子阅读活动', level: 'medium' },
                    { icon: '🔵', title: '科普类绘本利用率低', description: '仅为平均的45%', level: 'low' }
                ]
            },

            // 预测分析
            prediction: {
                nextWeekForecast: [
                    { day: '周一', predicted: 32, change: 14 },
                    { day: '周二', predicted: 28, change: -20 },
                    { day: '周三', predicted: 35, change: 9 },
                    { day: '周四', predicted: 30, change: -27 },
                    { day: '周五', predicted: 33, change: 50 },
                    { day: '周六', predicted: 12, change: -33 },
                    { day: '周日', predicted: 10, change: -44 }
                ],
                bestPeriods: [
                    { time: '周四 上午', participationRate: 92 },
                    { time: '周二 上午', participationRate: 88 },
                    { time: '周三 下午', participationRate: 85 }
                ]
            },

            // AI深度建议
            deepSuggestions: [
                {
                    title: '立即跟进大四班',
                    description: '大四班已连续2周无活动记录，需要立即了解情况并提供支持。',
                    priority: 'high',
                    actionItems: ['与郑慧老师进行一对一谈话', '了解活动中断原因', '提供设备使用培训', '制定恢复计划']
                },
                {
                    title: '启动周末阅读计划',
                    description: '设计亲子阅读任务卡，提高周末活跃度，缩小周间与周末差距。',
                    priority: 'medium',
                    actionItems: ['设计亲子阅读任务卡', '组织周末阅读打卡活动', '建立家长激励机制']
                },
                {
                    title: '科普绘本推广月',
                    description: '科普类绘本利用率仅为平均的45%，建议组织科学探索主题活动。',
                    priority: 'medium',
                    actionItems: ['组织科学探索主题周', '推荐科普绘本书单', '开展科普小故事分享会']
                }
            ]
        },

        // ========== 园长视角 - 班级深度分析 ==========
        classByPrincipal: {
            1: {
                name: '大一班',
                teacherName: '张晓梅',
                studentCount: 35,

                // 班级对比矩阵数据
                comparisonMatrix: {
                    classNames: ['大一班', '大二班', '园平均'],
                    indicators: [
                        { name: '活动量' },
                        { name: '完成质量' },
                        { name: '参与度' },
                        { name: '持续性' },
                        { name: '多样性' }
                    ],
                    data: [
                        { value: [95, 90, 92, 88, 85], name: '大一班', areaStyle: { color: 'rgba(16,185,129,0.3)' }, lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' } },
                        { value: [88, 92, 95, 82, 80], name: '大二班', areaStyle: { color: 'rgba(59,130,246,0.3)' }, lineStyle: { color: '#3b82f6' }, itemStyle: { color: '#3b82f6' } },
                        { value: [82, 78, 80, 75, 72], name: '园平均', areaStyle: { color: 'rgba(148,163,184,0.2)' }, lineStyle: { color: '#94a3b8', type: 'dashed' }, itemStyle: { color: '#94a3b8' } }
                    ]
                },

                // 进步追踪
                progressTracking: {
                    weeks: ['第1周', '第2周', '第3周', '第4周'],
                    labels: ['语言表达', '社交能力', '情感认知', '想象创造', '逻辑思维'],
                    series: [
                        { name: '语言表达', values: [82, 85, 88, 90] },
                        { name: '社交能力', values: [88, 90, 93, 95] },
                        { name: '情感认知', values: [78, 80, 82, 84] },
                        { name: '想象创造', values: [86, 88, 90, 92] },
                        { name: '逻辑思维', values: [72, 75, 76, 78] }
                    ]
                },

                // 学生分层
                studentSegments: {
                    high: { count: 12, percent: 34, description: '持续高参与，建议提供拓展阅读' },
                    medium: { count: 18, percent: 51, description: '参与良好，建议保持当前节奏' },
                    low: { count: 5, percent: 14, description: '需要鼓励，建议一对一关注' },
                    studentList: [
                        { name: '张小明', segment: 'high', activityCount: 18, engagement: 95, trend: 'up' },
                        { name: '李小红', segment: 'high', activityCount: 16, engagement: 90, trend: 'up' },
                        { name: '王小刚', segment: 'medium', activityCount: 15, engagement: 85, trend: 'stable' },
                        { name: '赵小丽', segment: 'medium', activityCount: 14, engagement: 82, trend: 'up' },
                        { name: '陈小华', segment: 'low', activityCount: 8, engagement: 60, trend: 'down' },
                        { name: '黄小龙', segment: 'low', activityCount: 7, engagement: 55, trend: 'up' }
                    ]
                },

                // 给教师的建议
                teacherSuggestions: [
                    { title: '关注低活跃学生', description: '班内有5名学生活跃度较低，建议安排一对一阅读时间。' },
                    { title: '增加逻辑思维活动', description: '班级逻辑思维维度相对较弱，建议每周增加1次逻辑思维主题活动。' },
                    { title: '建立阅读小组', description: '让活跃学生带动其他学生，形成良好的阅读氛围。' }
                ]
            },
            2: {
                name: '大二班',
                teacherName: '李文华',
                studentCount: 32,
                comparisonMatrix: {
                    classNames: ['大二班', '大一班', '园平均'],
                    indicators: [
                        { name: '活动量' },
                        { name: '完成质量' },
                        { name: '参与度' },
                        { name: '持续性' },
                        { name: '多样性' }
                    ],
                    data: [
                        { value: [88, 92, 95, 82, 80], name: '大二班', areaStyle: { color: 'rgba(59,130,246,0.3)' }, lineStyle: { color: '#3b82f6' }, itemStyle: { color: '#3b82f6' } },
                        { value: [95, 90, 92, 88, 85], name: '大一班', areaStyle: { color: 'rgba(16,185,129,0.3)' }, lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' } },
                        { value: [82, 78, 80, 75, 72], name: '园平均', areaStyle: { color: 'rgba(148,163,184,0.2)' }, lineStyle: { color: '#94a3b8', type: 'dashed' }, itemStyle: { color: '#94a3b8' } }
                    ]
                },
                progressTracking: {
                    weeks: ['第1周', '第2周', '第3周', '第4周'],
                    labels: ['语言表达', '社交能力', '情感认知', '想象创造', '逻辑思维'],
                    series: [
                        { name: '语言表达', values: [80, 83, 86, 88] },
                        { name: '社交能力', values: [85, 87, 89, 90] },
                        { name: '情感认知', values: [76, 78, 80, 82] },
                        { name: '想象创造', values: [80, 82, 84, 86] },
                        { name: '逻辑思维', values: [70, 72, 74, 76] }
                    ]
                },
                studentSegments: {
                    high: { count: 10, percent: 31, description: '持续高参与' },
                    medium: { count: 17, percent: 53, description: '参与良好' },
                    low: { count: 5, percent: 16, description: '需要鼓励' },
                    studentList: [
                        { name: '赵小丽', segment: 'high', activityCount: 14, engagement: 88, trend: 'up' },
                        { name: '陈小华', segment: 'high', activityCount: 13, engagement: 85, trend: 'stable' },
                        { name: '林小燕', segment: 'medium', activityCount: 10, engagement: 78, trend: 'up' },
                        { name: '其他...', segment: 'low', activityCount: 5, engagement: 58, trend: 'stable' }
                    ]
                },
                teacherSuggestions: [
                    { title: '增加创意阅读活动', description: '创意类活动偏少，建议增加绘画、故事创编等活动。' },
                    { title: '设计周末亲子任务', description: '周末活动较少，可设计简单的亲子阅读任务。' }
                ]
            },
            3: {
                name: '中一班',
                teacherName: '王秀英',
                studentCount: 28,
                comparisonMatrix: {
                    classNames: ['中一班', '大一班', '园平均'],
                    indicators: [
                        { name: '活动量' },
                        { name: '完成质量' },
                        { name: '参与度' },
                        { name: '持续性' },
                        { name: '多样性' }
                    ],
                    data: [
                        { value: [75, 88, 90, 85, 78], name: '中一班', areaStyle: { color: 'rgba(245,158,11,0.3)' }, lineStyle: { color: '#f59e0b' }, itemStyle: { color: '#f59e0b' } },
                        { value: [95, 90, 92, 88, 85], name: '大一班', areaStyle: { color: 'rgba(16,185,129,0.3)' }, lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' } },
                        { value: [82, 78, 80, 75, 72], name: '园平均', areaStyle: { color: 'rgba(148,163,184,0.2)' }, lineStyle: { color: '#94a3b8', type: 'dashed' }, itemStyle: { color: '#94a3b8' } }
                    ]
                },
                progressTracking: {
                    weeks: ['第1周', '第2周', '第3周', '第4周'],
                    labels: ['语言表达', '社交能力', '情感认知', '想象创造', '逻辑思维'],
                    series: [
                        { name: '语言表达', values: [76, 78, 80, 82] },
                        { name: '社交能力', values: [82, 84, 86, 88] },
                        { name: '情感认知', values: [74, 76, 77, 78] },
                        { name: '想象创造', values: [78, 80, 82, 84] },
                        { name: '逻辑思维', values: [68, 70, 71, 73] }
                    ]
                },
                studentSegments: {
                    high: { count: 8, percent: 29, description: '持续高参与' },
                    medium: { count: 15, percent: 54, description: '参与良好' },
                    low: { count: 5, percent: 18, description: '需要鼓励' },
                    studentList: [
                        { name: '刘小芳', segment: 'high', activityCount: 12, engagement: 86, trend: 'up' },
                        { name: '孙小伟', segment: 'medium', activityCount: 11, engagement: 80, trend: 'stable' },
                        { name: '徐小鹏', segment: 'low', activityCount: 5, engagement: 55, trend: 'down' }
                    ]
                },
                teacherSuggestions: [
                    { title: '增加活动频率', description: '活动频率可适当增加，保持阅读连贯性。' },
                    { title: '开展语言表达训练', description: '语言表达有提升空间，建议多开展故事分享活动。' }
                ]
            }
        },

        // ========== 教师视角 - 班级深度分析 ==========
        teacherClass: {
            className: '大一班',
            teacherName: '张晓梅',
            studentCount: 35,

            // 课堂洞察
            lessonInsights: {
                completionQuality: {
                    labels: ['周一', '周二', '周三', '周四', '周五'],
                    excellent: [5, 6, 4, 7, 5],
                    good: [4, 3, 5, 3, 4],
                    average: [2, 1, 2, 0, 1],
                    needsImprovement: [0, 0, 0, 0, 0]
                },
                bestTimeSlots: [
                    { timeSlot: '上午 9:00-10:00', description: '最佳阅读时段，适合安排核心共读活动' },
                    { timeSlot: '下午 15:00-16:00', description: '孩子状态较稳定，适合安排轻互动阅读' },
                    { timeSlot: '上午 10:00-11:00', description: '课程衔接自然，可灵活安排延展活动' }
                ],
                bookTypeEffectiveness: [
                    { type: '人际交往', suggestion: '孩子接受度高，可继续作为班级高频主题' },
                    { type: '日常生活', suggestion: '内容容易代入，适合作为稳定的常规阅读素材' },
                    { type: '情商品格', suggestion: '适合放在情绪表达和讨论环节中使用' },
                    { type: '国学文化', suggestion: '建议从简单节日故事和生活化情境切入' },
                    { type: '科普百科', suggestion: '更适合搭配小实验或动手探索活动一起使用' }
                ]
            },

            // 互动模式
            interactionPatterns: {
                chartData: [
                    { value: 65, name: '师生问答' },
                    { value: 25, name: '小组共读' },
                    { value: 10, name: '自主阅读' }
                ],
                patterns: [
                    '师生问答互动效果最佳，参与度高',
                    '3-4人小组共读形式受欢迎',
                    '自主阅读需要更多引导'
                ]
            },

            // 最佳实践建议
            bestPractices: [
                { title: '固定上午9点阅读', description: '该时段参与率比其他时段高15%，建议固定为主要阅读时间。' },
                { title: '人际交往主题优先', description: '这类绘本完成率达95%，可适当增加占比。' },
                { title: '采用小组阅读模式', description: '3-4人小组共读比全班共读参与率高20%。' }
            ],

            // 教学改进建议
            teachingImprovements: [
                {
                    area: '科普阅读',
                    urgency: 'high',
                    currentStatus: '当前科普类绘本在班级中的参与度偏低，孩子容易出现分心情况。',
                    suggestion: '先从《好饿的毛毛虫》等简单趣味科普开始，结合科学探索小游戏，每周1个小知识分享。'
                },
                {
                    area: '文化素养',
                    urgency: 'medium',
                    currentStatus: '文化素养类内容已有基础反馈，但还有较大的拓展空间。',
                    suggestion: '引入传统节日绘本，每周1个小故事，请家长配合讲传统故事。'
                },
                {
                    area: '自主阅读引导',
                    urgency: 'medium',
                    currentStatus: '自主阅读占比仅10%，需要更多引导。',
                    suggestion: '设计简单的阅读任务卡，逐步培养自主阅读习惯。'
                }
            ]
        },

        // ========== 教师视角 - 学生深度分析 ==========
        student: {
            1: {
                name: '张小明',
                code: 'S20240001',
                className: '大一班',
                personalityTags: ['开朗外向', '乐于助人', '喜欢交朋友'],

                // 成长轨迹
                growthPath: {
                    weeks: ['第1周', '第2周', '第3周', '第4周'],
                    labels: ['语言表达', '社交能力', '情感认知', '想象创造', '逻辑思维'],
                    series: [
                        { name: '语言表达', values: [85, 88, 90, 92] },
                        { name: '社交能力', values: [92, 94, 96, 98] },
                        { name: '情感认知', values: [82, 84, 86, 88] },
                        { name: '想象创造', values: [88, 90, 92, 94] },
                        { name: '逻辑思维', values: [72, 75, 78, 80] }
                    ]
                },

                // 学习风格
                learningStyle: {
                    type: '社交型学习者',
                    strengths: ['通过互动学习效果最佳', '喜欢小组活动', '善于模仿和交流'],
                    preferences: ['人物角色丰富的绘本', '有对话内容的故事', '可以角色扮演的书']
                },

                // 社交参与
                socialEngagement: {
                    metrics: [
                        { name: '同伴互动', score: 95 },
                        { name: '领导倾向', score: 88 },
                        { name: '合作能力', score: 90 },
                        { name: '分享意愿', score: 92 }
                    ],
                    summary: '在社交方面表现突出，总是主动帮助同学，在小组中常担任组织者角色。'
                },

                // 最近阅读
                recentBooks: [
                    { name: '永远永远爱你', type: '情商品格', readTime: '3月10日', duration: '25分钟', engagement: 95 },
                    { name: '我爸爸', type: '人际交往', readTime: '3月9日', duration: '20分钟', engagement: 92 },
                    { name: '团圆', type: '国学文化', readTime: '3月8日', duration: '18分钟', engagement: 78 }
                ],

                // 个性化阅读方案
                personalizedPlan: {
                    shortTerm: ['推荐情感类绘本，如《猜猜我有多爱你》', '鼓励担任故事讲述者', '每周1次故事分享'],
                    mediumTerm: ['逐步引入简单逻辑思维绘本', '尝试《神奇校车》入门科普', '与家长配合进行亲子共读'],
                    longTerm: ['建立个人阅读记录', '培养多元阅读兴趣', '发展综合阅读能力']
                },

                // 家园共育建议
                homeCollaboration: [
                    { title: '鼓励亲子共读', description: '每天15分钟固定阅读时间，讨论故事中的人物和情节。' },
                    { title: '关注社交能力发展', description: '邀请小朋友来家里一起阅读，鼓励分享玩具和书籍。' },
                    { title: '让孩子复述故事', description: '读完书后问问孩子"今天学到了什么"，培养表达能力。' }
                ]
            },
            2: {
                name: '李小红',
                code: 'S20240002',
                className: '大一班',
                personalityTags: ['文静认真', '细心', '有创造力'],
                growthPath: {
                    weeks: ['第1周', '第2周', '第3周', '第4周'],
                    labels: ['语言表达', '社交能力', '情感认知', '想象创造', '逻辑思维'],
                    series: [
                        { name: '语言表达', values: [82, 84, 86, 88] },
                        { name: '社交能力', values: [86, 88, 89, 90] },
                        { name: '情感认知', values: [78, 80, 82, 85] },
                        { name: '想象创造', values: [84, 86, 88, 90] },
                        { name: '逻辑思维', values: [70, 72, 74, 76] }
                    ]
                },
                learningStyle: {
                    type: '观察型学习者',
                    strengths: ['安静观察学习', '注重细节', '艺术感强'],
                    preferences: ['画面精美的绘本', '温馨的故事', '日常生活主题']
                },
                socialEngagement: {
                    metrics: [
                        { name: '同伴互动', score: 80 },
                        { name: '领导倾向', score: 65 },
                        { name: '合作能力', score: 78 },
                        { name: '分享意愿', score: 82 }
                    ],
                    summary: '细心观察型，喜欢与1-2个好朋友互动，不喜欢成为焦点。'
                },
                recentBooks: [
                    { name: '猜猜我有多爱你', type: '情商品格', readTime: '3月10日', duration: '22分钟', engagement: 90 },
                    { name: '花婆婆', type: '日常生活', readTime: '3月9日', duration: '25分钟', engagement: 88 }
                ],
                personalizedPlan: {
                    shortTerm: ['继续温馨日常绘本', '鼓励涂鸦表达感受', '一对一交流时间'],
                    mediumTerm: ['引入传统文化绘本', '鼓励故事画创作', '小范围分享'],
                    longTerm: ['逐步扩大舒适区', '培养自信心', '多元发展']
                },
                homeCollaboration: [
                    { title: '创造安静阅读环境', description: '固定睡前阅读时间，一起画画故事，鼓励表达想法。' },
                    { title: '尊重学习节奏', description: '不催促，给予充分时间理解，肯定细致的观察。' }
                ]
            },
            3: {
                name: '王小刚',
                code: 'S20240003',
                className: '大一班',
                personalityTags: ['爱思考', '好奇', '内敛'],
                growthPath: {
                    weeks: ['第1周', '第2周', '第3周', '第4周'],
                    labels: ['语言表达', '社交能力', '情感认知', '想象创造', '逻辑思维'],
                    series: [
                        { name: '语言表达', values: [76, 78, 79, 80] },
                        { name: '社交能力', values: [78, 80, 82, 85] },
                        { name: '情感认知', values: [72, 74, 75, 75] },
                        { name: '想象创造', values: [80, 82, 83, 85] },
                        { name: '逻辑思维', values: [88, 90, 91, 92] }
                    ]
                },
                learningStyle: {
                    type: '逻辑型学习者',
                    strengths: ['喜欢探索和发现', '爱问为什么', '喜欢动手操作'],
                    preferences: ['科普百科', '有因果关系的故事', '可以探索的书']
                },
                socialEngagement: {
                    metrics: [
                        { name: '同伴互动', score: 70 },
                        { name: '领导倾向', score: 72 },
                        { name: '合作能力', score: 75 },
                        { name: '分享意愿', score: 78 }
                    ],
                    summary: '喜欢研究事物，与有共同兴趣的同学交流，科学主题时特别活跃。'
                },
                recentBooks: [
                    { name: '好饿的毛毛虫', type: '科普百科', readTime: '3月10日', duration: '30分钟', engagement: 95 },
                    { name: '母鸡萝丝去散步', type: '日常生活', readTime: '3月8日', duration: '18分钟', engagement: 82 }
                ],
                personalizedPlan: {
                    shortTerm: ['继续科普主题', '科学小实验', '自然观察活动'],
                    mediumTerm: ['组建科学探索小组', '分享发现', '简单社交任务'],
                    longTerm: ['社交技能提升', '表达能力培养', '全面发展']
                },
                homeCollaboration: [
                    { title: '鼓励探索', description: '一起做简单实验，去户外观察自然，鼓励问"为什么"。' }
                ]
            },
            11: {
                name: '黄小龙',
                code: 'S20240011',
                className: '大一班',
                personalityTags: ['慢热', '需要引导'],
                growthPath: {
                    weeks: ['第1周', '第2周', '第3周', '第4周'],
                    labels: ['语言表达', '社交能力', '情感认知', '想象创造', '逻辑思维'],
                    series: [
                        { name: '语言表达', values: [65, 67, 69, 70] },
                        { name: '社交能力', values: [68, 70, 72, 75] },
                        { name: '情感认知', values: [66, 68, 70, 72] },
                        { name: '想象创造', values: [70, 72, 74, 78] },
                        { name: '逻辑思维', values: [62, 64, 66, 68] }
                    ]
                },
                learningStyle: {
                    type: '需要引导型学习者',
                    strengths: ['熟悉后参与度不错', '需要安全感', '周末积极性高'],
                    preferences: ['简单温馨的故事', '重复读同一本书', '日常生活主题']
                },
                socialEngagement: {
                    metrics: [
                        { name: '同伴互动', score: 55 },
                        { name: '领导倾向', score: 45 },
                        { name: '合作能力', score: 58 },
                        { name: '分享意愿', score: 60 }
                    ],
                    summary: '慢热型，需要老师单独关注，慢慢建立信任，熟悉后能积极参与。'
                },
                recentBooks: [
                    { name: '哇哦，鳄鱼也想要惊喜', type: '日常生活', readTime: '3月10日', duration: '15分钟', engagement: 75 }
                ],
                personalizedPlan: {
                    shortTerm: ['一对一阅读计划', '从感兴趣的书开始', '固定阅读伙伴'],
                    mediumTerm: ['慢慢扩大阅读范围', '小范围互动', '建立自信'],
                    longTerm: ['逐步融入集体', '培养阅读习惯', '全面发展']
                },
                homeCollaboration: [
                    { title: '建立固定阅读习惯', description: '每天固定时间，从喜欢的书开始，慢慢增加难度。' },
                    { title: '与老师密切配合', description: '同步阅读内容，在家强化，及时反馈情况。' }
                ]
            }
        }
    }
};
