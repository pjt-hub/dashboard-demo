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
        { id: 1, name: '大一班', kindergartenId: 1, studentCount: 35, teacherCount: 3, teacherName: '张晓梅', activityCount: 42, activityDuration: '18.5h', deviceUseCount: 86, participantCount: 32, 
          teachers: [{name: '张晓梅', activityCount: 20, activityDuration: '8.5h'}, {name: '王芳', activityCount: 12, activityDuration: '5.2h'}, {name: '李丽', activityCount: 10, activityDuration: '4.8h'}],
          bookTypeStats: {'情商品格': 15, '国学文化': 8, '人际交往': 12, '日常生活': 7},
          abilityStats: {'语言表达': 85, '社交能力': 78, '想象创造': 82, '逻辑思维': 75, '情感认知': 88} },
        { id: 2, name: '大二班', kindergartenId: 1, studentCount: 32, teacherCount: 3, teacherName: '李文华', activityCount: 38, activityDuration: '16.2h', deviceUseCount: 78, participantCount: 30,
          teachers: [{name: '李文华', activityCount: 18, activityDuration: '7.8h'}, {name: '赵敏', activityCount: 11, activityDuration: '4.6h'}, {name: '孙丽', activityCount: 9, activityDuration: '3.8h'}],
          bookTypeStats: {'科普百科': 10, '情商品格': 12, '语言学习': 8, '日常生活': 8},
          abilityStats: {'语言表达': 80, '社交能力': 82, '想象创造': 78, '逻辑思维': 85, '情感认知': 79} },
        { id: 3, name: '中一班', kindergartenId: 1, studentCount: 28, teacherCount: 2, teacherName: '王秀英', activityCount: 31, activityDuration: '13.8h', deviceUseCount: 65, participantCount: 26,
          teachers: [{name: '王秀英', activityCount: 18, activityDuration: '8.2h'}, {name: '周芳', activityCount: 13, activityDuration: '5.6h'}],
          bookTypeStats: {'情商品格': 10, '日常生活': 12, '人际交往': 9},
          abilityStats: {'语言表达': 75, '社交能力': 80, '想象创造': 72, '逻辑思维': 70, '情感认知': 78} },
        { id: 4, name: '中二班', kindergartenId: 1, studentCount: 30, teacherCount: 2, teacherName: '赵丽娟', activityCount: 28, activityDuration: '12.1h', deviceUseCount: 58, participantCount: 27,
          teachers: [{name: '赵丽娟', activityCount: 16, activityDuration: '7.1h'}, {name: '吴芳', activityCount: 12, activityDuration: '5.0h'}],
          bookTypeStats: {'国学文化': 8, '情商品格': 10, '日常生活': 10},
          abilityStats: {'语言表达': 72, '社交能力': 75, '想象创造': 70, '逻辑思维': 73, '情感认知': 76} },
        { id: 5, name: '小一班', kindergartenId: 1, studentCount: 25, teacherCount: 2, teacherName: '陈美玲', activityCount: 22, activityDuration: '9.6h', deviceUseCount: 45, participantCount: 22,
          teachers: [{name: '陈美玲', activityCount: 14, activityDuration: '6.2h'}, {name: '郑芳', activityCount: 8, activityDuration: '3.4h'}],
          bookTypeStats: {'日常生活': 12, '情商品格': 10},
          abilityStats: {'语言表达': 65, '社交能力': 70, '想象创造': 68, '逻辑思维': 62, '情感认知': 72} },
        { id: 6, name: '小二班', kindergartenId: 1, studentCount: 24, teacherCount: 2, teacherName: '周雪梅', activityCount: 19, activityDuration: '8.3h', deviceUseCount: 40, participantCount: 20,
          teachers: [{name: '周雪梅', activityCount: 12, activityDuration: '5.3h'}, {name: '王芳', activityCount: 7, activityDuration: '3.0h'}],
          bookTypeStats: {'情商品格': 8, '日常生活': 11},
          abilityStats: {'语言表达': 62, '社交能力': 68, '想象创造': 65, '逻辑思维': 60, '情感认知': 70} },
        { id: 7, name: '大三班', kindergartenId: 1, studentCount: 33, teacherCount: 3, teacherName: '刘芳', activityCount: 15, activityDuration: '6.5h', deviceUseCount: 52, participantCount: 18,
          teachers: [{name: '刘芳', activityCount: 8, activityDuration: '3.5h'}, {name: '陈丽', activityCount: 4, activityDuration: '1.8h'}, {name: '杨芳', activityCount: 3, activityDuration: '1.2h'}],
          bookTypeStats: {},
          abilityStats: {} },
        { id: 8, name: '中三班', kindergartenId: 1, studentCount: 26, teacherCount: 2, teacherName: '孙婷', activityCount: 10, activityDuration: '4.2h', deviceUseCount: 38, participantCount: 15,
          teachers: [{name: '孙婷', activityCount: 6, activityDuration: '2.5h'}, {name: '黄芳', activityCount: 4, activityDuration: '1.7h'}],
          bookTypeStats: {},
          abilityStats: {} },
        { id: 9, name: '小三班', kindergartenId: 1, studentCount: 22, teacherCount: 2, teacherName: '吴敏', activityCount: 7, activityDuration: '3.1h', deviceUseCount: 32, participantCount: 12,
          teachers: [{name: '吴敏', activityCount: 5, activityDuration: '2.2h'}, {name: '林芳', activityCount: 2, activityDuration: '0.9h'}],
          bookTypeStats: {},
          abilityStats: {} },
        { id: 10, name: '大四班', kindergartenId: 1, studentCount: 30, teacherCount: 3, teacherName: '郑慧', activityCount: 0, activityDuration: '0h', deviceUseCount: 28, participantCount: 0,
          teachers: [{name: '郑慧', activityCount: 0, activityDuration: '0h'}, {name: '何丽', activityCount: 0, activityDuration: '0h'}, {name: '罗芳', activityCount: 0, activityDuration: '0h'}],
          bookTypeStats: {},
          abilityStats: {} },
        { id: 11, name: '中四班', kindergartenId: 1, studentCount: 27, teacherCount: 2, teacherName: '黄丽', activityCount: 0, activityDuration: '0h', deviceUseCount: 22, participantCount: 0,
          teachers: [{name: '黄丽', activityCount: 0, activityDuration: '0h'}, {name: '谢芳', activityCount: 0, activityDuration: '0h'}],
          bookTypeStats: {},
          abilityStats: {} },
        { id: 12, name: '小四班', kindergartenId: 1, studentCount: 20, teacherCount: 2, teacherName: '林静', activityCount: 0, activityDuration: '0h', deviceUseCount: 18, participantCount: 0,
          teachers: [{name: '林静', activityCount: 0, activityDuration: '0h'}, {name: '徐芳', activityCount: 0, activityDuration: '0h'}],
          bookTypeStats: {},
          abilityStats: {} },
        { id: 13, name: '大五班', kindergartenId: 1, studentCount: 31, teacherCount: 3, teacherName: '徐萍', activityCount: 0, activityDuration: '0h', deviceUseCount: 25, participantCount: 0,
          teachers: [{name: '徐萍', activityCount: 0, activityDuration: '0h'}, {name: '马芳', activityCount: 0, activityDuration: '0h'}, {name: '何丽', activityCount: 0, activityDuration: '0h'}],
          bookTypeStats: {},
          abilityStats: {} },
        { id: 14, name: '中五班', kindergartenId: 1, studentCount: 25, teacherCount: 2, teacherName: '马丽', activityCount: 0, activityDuration: '0h', deviceUseCount: 20, participantCount: 0,
          teachers: [{name: '马丽', activityCount: 0, activityDuration: '0h'}, {name: '罗芳', activityCount: 0, activityDuration: '0h'}],
          bookTypeStats: {},
          abilityStats: {} },
        { id: 15, name: '小五班', kindergartenId: 1, studentCount: 21, teacherCount: 2, teacherName: '何芳', activityCount: 0, activityDuration: '0h', deviceUseCount: 15, participantCount: 0,
          teachers: [{name: '何芳', activityCount: 0, activityDuration: '0h'}, {name: '谢丽', activityCount: 0, activityDuration: '0h'}],
          bookTypeStats: {},
          abilityStats: {} },
        { id: 16, name: '大六班', kindergartenId: 1, studentCount: 29, teacherCount: 3, teacherName: '罗敏', activityCount: 0, activityDuration: '0h', deviceUseCount: 30, participantCount: 0,
          teachers: [{name: '罗敏', activityCount: 0, activityDuration: '0h'}, {name: '杨芳', activityCount: 0, activityDuration: '0h'}, {name: '韩丽', activityCount: 0, activityDuration: '0h'}],
          bookTypeStats: {},
          abilityStats: {} },
        { id: 17, name: '中六班', kindergartenId: 1, studentCount: 24, teacherCount: 2, teacherName: '谢芳', activityCount: 0, activityDuration: '0h', deviceUseCount: 18, participantCount: 0,
          teachers: [{name: '谢芳', activityCount: 0, activityDuration: '0h'}, {name: '唐丽', activityCount: 0, activityDuration: '0h'}],
          bookTypeStats: {},
          abilityStats: {} },
        { id: 18, name: '小小班', kindergartenId: 1, studentCount: 17, teacherCount: 2, teacherName: '杨静', activityCount: 0, activityDuration: '0h', deviceUseCount: 12, participantCount: 0,
          teachers: [{name: '杨静', activityCount: 0, activityDuration: '0h'}, {name: '韩芳', activityCount: 0, activityDuration: '0h'}],
          bookTypeStats: {},
          abilityStats: {} }
    ],

    // 学生数据
    students: [
        { id: 1, name: '张小明', code: 'S20240001', classId: 1, className: '大一班', activityCount: 18, activityDuration: '5.2h', bookCount: 12, 
          readDurationMinutes: 312, readTimes: 33, completedBooks: 9,
          bookTypeStats: {'日常生活': 10, '人际交往': 8, '情商品格': 7},
          abilityStats: {'习惯养成': 85, '情绪管理': 78, '想象力': 82, '科学认知': 75, '品格养成': 88, '社交力': 80},
          favoriteBooks: ['大卫上学去', '幼儿园的一天', '约瑟夫有件旧外套'],
          interestBooks: ['好饿的毛毛虫', '猜猜我有多爱你', '我爸爸'],
          recommendBooks: ['神奇校车', '不一样的卡梅拉', '爱心树'] },
        { id: 2, name: '李小红', code: 'S20240002', classId: 1, className: '大一班', activityCount: 16, activityDuration: '4.8h', bookCount: 11,
          readDurationMinutes: 288, readTimes: 28, completedBooks: 8,
          bookTypeStats: {'情商品格': 8, '国学文化': 6, '人际交往': 5},
          abilityStats: {'习惯养成': 80, '情绪管理': 82, '想象力': 78, '科学认知': 70, '品格养成': 85, '社交力': 83},
          favoriteBooks: ['团圆', '我爸爸', '我妈妈'],
          interestBooks: ['逃家小兔', '猜猜我有多爱你', '彩虹色的花'],
          recommendBooks: ['花婆婆', '爱心树', '石头汤'] },
        { id: 3, name: '王小刚', code: 'S20240003', classId: 1, className: '大一班', activityCount: 15, activityDuration: '4.5h', bookCount: 10,
          readDurationMinutes: 270, readTimes: 25, completedBooks: 7,
          bookTypeStats: {'科普百科': 6, '情商品格': 5, '语言学习': 4},
          abilityStats: {'习惯养成': 75, '情绪管理': 70, '想象力': 85, '科学认知': 88, '品格养成': 78, '社交力': 75},
          favoriteBooks: ['神奇校车', '十万个为什么', '昆虫记'],
          interestBooks: ['好饿的毛毛虫', '小蝌蚪找妈妈', '三只小猪'],
          recommendBooks: ['海底两万里', '不一样的卡梅拉', '神奇校车'] },
        { id: 4, name: '赵小丽', code: 'S20240004', classId: 2, className: '大二班', activityCount: 14, activityDuration: '4.1h', bookCount: 9,
          readDurationMinutes: 246, readTimes: 24, completedBooks: 7,
          bookTypeStats: {'情商品格': 7, '日常生活': 5, '人际交往': 4},
          abilityStats: {'习惯养成': 78, '情绪管理': 80, '想象力': 75, '科学认知': 72, '品格养成': 82, '社交力': 79},
          favoriteBooks: ['永远永远爱你', '猜猜我有多爱你', '逃家小兔'],
          interestBooks: ['我爸爸', '我妈妈', '大卫不可以'],
          recommendBooks: ['爱心树', '花婆婆', '团圆'] },
        { id: 5, name: '陈小华', code: 'S20240005', classId: 2, className: '大二班', activityCount: 13, activityDuration: '3.9h', bookCount: 8,
          readDurationMinutes: 234, readTimes: 22, completedBooks: 6,
          bookTypeStats: {'国学文化': 5, '情商品格': 5, '日常生活': 4},
          abilityStats: {'习惯养成': 72, '情绪管理': 75, '想象力': 70, '科学认知': 68, '品格养成': 80, '社交力': 76},
          favoriteBooks: ['弟子规', '三字经', '唐诗三百首'],
          interestBooks: ['成语故事', '论语故事', '孔融让梨'],
          recommendBooks: ['铁杵磨针', '愚公移山', '精卫填海'] },
        { id: 6, name: '刘小芳', code: 'S20240006', classId: 3, className: '中一班', activityCount: 12, activityDuration: '3.6h', bookCount: 8,
          readDurationMinutes: 216, readTimes: 20, completedBooks: 6,
          bookTypeStats: {'日常生活': 6, '情商品格': 5, '人际交往': 4},
          abilityStats: {'习惯养成': 70, '情绪管理': 72, '想象力': 68, '科学认知': 65, '品格养成': 75, '社交力': 73},
          favoriteBooks: ['母鸡萝丝去散步', '花婆婆', '爱跳舞的小龙'],
          interestBooks: ['胆小鬼威利', '古利和古拉', '好饿的毛毛虫'],
          recommendBooks: ['爷爷一定有办法', '逃家小兔', '彩虹色的花'] },
        { id: 7, name: '孙小伟', code: 'S20240007', classId: 3, className: '中一班', activityCount: 11, activityDuration: '3.3h', bookCount: 7,
          readDurationMinutes: 198, readTimes: 18, completedBooks: 5,
          bookTypeStats: {'情商品格': 5, '科普百科': 4, '语言学习': 3},
          abilityStats: {'习惯养成': 68, '情绪管理': 70, '想象力': 72, '科学认知': 75, '品格养成': 70, '社交力': 68},
          favoriteBooks: ['神奇校车', '好饿的毛毛虫', '大卫不可以'],
          interestBooks: ['昆虫记', '十万个为什么', '小蝌蚪找妈妈'],
          recommendBooks: ['海底两万里', '不一样的卡梅拉', '神奇校车'] },
        { id: 8, name: '周小琳', code: 'S20240008', classId: 4, className: '中二班', activityCount: 10, activityDuration: '3.0h', bookCount: 7,
          readDurationMinutes: 180, readTimes: 16, completedBooks: 5,
          bookTypeStats: {'国学文化': 4, '情商品格': 4, '日常生活': 4},
          abilityStats: {'习惯养成': 65, '情绪管理': 68, '想象力': 65, '科学认知': 62, '品格养成': 70, '社交力': 67},
          favoriteBooks: ['小蝌蚪找妈妈', '三只小猪', '丑小鸭'],
          interestBooks: ['龟兔赛跑', '狐狸和葡萄', '白雪公主'],
          recommendBooks: ['灰姑娘', '小王子', '夏洛的网'] },
        { id: 9, name: '吴小杰', code: 'S20240009', classId: 5, className: '小一班', activityCount: 9, activityDuration: '2.7h', bookCount: 6,
          readDurationMinutes: 162, readTimes: 15, completedBooks: 4,
          bookTypeStats: {'日常生活': 5, '情商品格': 4},
          abilityStats: {'习惯养成': 60, '情绪管理': 62, '想象力': 58, '科学认知': 55, '品格养成': 65, '社交力': 61},
          favoriteBooks: ['鳄鱼怕怕牙医怕怕', '爱心树', '失落的一角'],
          interestBooks: ['你看起来好像很好吃', '我是霸王龙', '遇到你真好'],
          recommendBooks: ['小猪佩奇', '汪汪队', '超级飞侠'] },
        { id: 10, name: '郑小雪', code: 'S20240010', classId: 5, className: '小一班', activityCount: 8, activityDuration: '2.4h', bookCount: 5,
          readDurationMinutes: 144, readTimes: 13, completedBooks: 4,
          bookTypeStats: {'情商品格': 4, '日常生活': 4},
          abilityStats: {'习惯养成': 58, '情绪管理': 60, '想象力': 55, '科学认知': 52, '品格养成': 62, '社交力': 59},
          favoriteBooks: ['小猪佩奇', '汪汪队', '超级飞侠'],
          interestBooks: ['海底小纵队', '小马宝莉', '不一样的卡梅拉'],
          recommendBooks: ['神奇校车', '十万个为什么', '昆虫记'] },
        { id: 11, name: '黄小龙', code: 'S20240011', classId: 1, className: '大一班', activityCount: 7, activityDuration: '2.1h', bookCount: 5,
          readDurationMinutes: 126, readTimes: 12, completedBooks: 3,
          bookTypeStats: {'人际交往': 4, '情商品格': 3},
          abilityStats: {'习惯养成': 55, '情绪管理': 58, '想象力': 60, '科学认知': 62, '品格养成': 58, '社交力': 65},
          favoriteBooks: ['不一样的卡梅拉', '神奇校车', '海底小纵队'],
          interestBooks: ['汪汪队', '超级飞侠', '小马宝莉'],
          recommendBooks: ['十万个为什么', '昆虫记', '海底两万里'] },
        { id: 12, name: '林小燕', code: 'S20240012', classId: 2, className: '大二班', activityCount: 6, activityDuration: '1.8h', bookCount: 4,
          readDurationMinutes: 108, readTimes: 10, completedBooks: 3,
          bookTypeStats: {'情商品格': 3, '日常生活': 3},
          abilityStats: {'习惯养成': 52, '情绪管理': 55, '想象力': 50, '科学认知': 48, '品格养成': 58, '社交力': 54},
          favoriteBooks: ['小熊维尼', '米老鼠', '唐老鸭'],
          interestBooks: ['白雪公主', '睡美人', '木偶奇遇记'],
          recommendBooks: ['爱丽丝梦游仙境', '彼得潘', '长袜子皮皮'] },
        { id: 13, name: '徐小鹏', code: 'S20240013', classId: 3, className: '中一班', activityCount: 5, activityDuration: '1.5h', bookCount: 4,
          readDurationMinutes: 90, readTimes: 8, completedBooks: 2,
          bookTypeStats: {'科普百科': 3, '情商品格': 2},
          abilityStats: {'习惯养成': 50, '情绪管理': 52, '想象力': 55, '科学认知': 58, '品格养成': 52, '社交力': 50},
          favoriteBooks: ['十万个为什么', '昆虫记', '神奇校车'],
          interestBooks: ['海底两万里', '不一样的卡梅拉', '爱心树'],
          recommendBooks: ['草房子', '青铜葵花', '曹冲称象'] },
        { id: 14, name: '马小丽', code: 'S20240014', classId: 4, className: '中二班', activityCount: 4, activityDuration: '1.2h', bookCount: 3,
          readDurationMinutes: 72, readTimes: 7, completedBooks: 2,
          bookTypeStats: {'国学文化': 3, '情商品格': 2},
          abilityStats: {'习惯养成': 48, '情绪管理': 50, '想象力': 45, '科学认知': 42, '品格养成': 52, '社交力': 49},
          favoriteBooks: ['司马光砸缸', '孔融让梨', '铁杵磨针'],
          interestBooks: ['愚公移山', '精卫填海', '女娲补天'],
          recommendBooks: ['嫦娥奔月', '后羿射日', '大禹治水'] },
        { id: 15, name: '何小文', code: 'S20240015', classId: 6, className: '小二班', activityCount: 3, activityDuration: '0.9h', bookCount: 3,
          readDurationMinutes: 54, readTimes: 5, completedBooks: 2,
          bookTypeStats: {'情商品格': 2, '日常生活': 2},
          abilityStats: {'习惯养成': 45, '情绪管理': 48, '想象力': 42, '科学认知': 40, '品格养成': 50, '社交力': 46},
          favoriteBooks: ['盘古开天', '哪吒闹海', '嫦娥奔月'],
          interestBooks: ['后羿射日', '大禹治水', '精卫填海'],
          recommendBooks: ['女娲补天', '愚公移山', '铁杵磨针'] }
    ],

    // ========== 大数据总览 - 对标远程平台 ==========
    // 核心指标卡片（对标远程平台4个指标）
    dataOverviewStats: {
        activityCount: 212,       // 绘本活动次数
        activityDuration: 99.38,  // 绘本活动时长(h)
        participantCount: 191,    // 参与活动人次
        readingDuration: 7.37,    // 绘本阅读时长(h)
        llmBookCount: 168,        // 大模型绘本次数
        llmChatCount: 542         // 大模型对话次数
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

    // ========== 绘本库数据（包含能力标签）==========
    books: [
        { id: 1, name: '永远永远爱你', type: '情商品格', abilityTags: ['情感认知', '社交能力'], ageRange: '4-6岁' },
        { id: 2, name: '团圆', type: '国学文化', abilityTags: ['文化素养', '情感认知'], ageRange: '4-6岁' },
        { id: 3, name: '我爸爸', type: '人际交往', abilityTags: ['社交能力', '语言表达'], ageRange: '3-5岁' },
        { id: 4, name: '猜猜我有多爱你', type: '情商品格', abilityTags: ['情感认知', '语言表达'], ageRange: '3-5岁' },
        { id: 5, name: '哇哦，鳄鱼也想要惊喜', type: '日常生活', abilityTags: ['想象创造', '语言表达'], ageRange: '4-6岁' },
        { id: 6, name: '母鸡萝丝去散步', type: '日常生活', abilityTags: ['逻辑思维', '想象创造'], ageRange: '3-5岁' },
        { id: 7, name: '花婆婆', type: '日常生活', abilityTags: ['情感认知', '文化素养'], ageRange: '5-7岁' },
        { id: 8, name: '爱跳舞的小龙', type: '人际交往', abilityTags: ['社交能力', '想象创造'], ageRange: '4-6岁' },
        { id: 9, name: '胆小鬼威利', type: '情商品格', abilityTags: ['情感认知', '社交能力'], ageRange: '4-6岁' },
        { id: 10, name: '古利和古拉', type: '日常生活', abilityTags: ['社交能力', '逻辑思维'], ageRange: '3-5岁' },
        { id: 11, name: '好饿的毛毛虫', type: '科普百科', abilityTags: ['逻辑思维', '语言表达'], ageRange: '3-5岁' },
        { id: 12, name: '爷爷一定有办法', type: '日常生活', abilityTags: ['逻辑思维', '情感认知'], ageRange: '4-6岁' },
        { id: 13, name: '逃家小兔', type: '情商品格', abilityTags: ['情感认知', '语言表达'], ageRange: '3-5岁' },
        { id: 14, name: '活了100万次的猫', type: '情商品格', abilityTags: ['情感认知', '想象创造'], ageRange: '5-7岁' },
        { id: 15, name: '小蝌蚪找妈妈', type: '国学文化', abilityTags: ['文化素养', '语言表达'], ageRange: '3-5岁' },
        { id: 16, name: '三只小猪', type: '国学文化', abilityTags: ['逻辑思维', '语言表达'], ageRange: '3-5岁' },
        { id: 17, name: '鳄鱼怕怕牙医怕怕', type: '日常生活', abilityTags: ['情感认知', '社交能力'], ageRange: '3-5岁' },
        { id: 18, name: '爱心树', type: '情商品格', abilityTags: ['情感认知', '文化素养'], ageRange: '5-7岁' },
        { id: 19, name: '神奇校车', type: '科普百科', abilityTags: ['逻辑思维', '想象创造'], ageRange: '5-7岁' },
        { id: 20, name: '不一样的卡梅拉', type: '人际交往', abilityTags: ['社交能力', '想象创造'], ageRange: '4-6岁' }
    ],

    // ========== 阅读记录数据 ==========
    readingRecords: [
        // 大一班学生阅读记录
        { studentId: 1, bookId: 1, duration: 25, date: '2026-03-10' },
        { studentId: 1, bookId: 3, duration: 20, date: '2026-03-09' },
        { studentId: 1, bookId: 2, duration: 18, date: '2026-03-08' },
        { studentId: 1, bookId: 4, duration: 22, date: '2026-03-07' },
        { studentId: 1, bookId: 11, duration: 15, date: '2026-03-06' },
        { studentId: 2, bookId: 4, duration: 22, date: '2026-03-10' },
        { studentId: 2, bookId: 7, duration: 25, date: '2026-03-09' },
        { studentId: 2, bookId: 13, duration: 18, date: '2026-03-08' },
        { studentId: 3, bookId: 1, duration: 18, date: '2026-03-10' },
        { studentId: 3, bookId: 6, duration: 15, date: '2026-03-09' },
        { studentId: 3, bookId: 10, duration: 20, date: '2026-03-08' },
        { studentId: 4, bookId: 3, duration: 16, date: '2026-03-10' },
        { studentId: 4, bookId: 8, duration: 18, date: '2026-03-09' },
        { studentId: 5, bookId: 5, duration: 20, date: '2026-03-10' },
        { studentId: 5, bookId: 9, duration: 15, date: '2026-03-09' },
        // 大二班学生阅读记录
        { studentId: 6, bookId: 2, duration: 20, date: '2026-03-10' },
        { studentId: 6, bookId: 14, duration: 22, date: '2026-03-09' },
        { studentId: 7, bookId: 4, duration: 18, date: '2026-03-10' },
        { studentId: 7, bookId: 15, duration: 16, date: '2026-03-09' },
        { studentId: 8, bookId: 11, duration: 15, date: '2026-03-10' },
        { studentId: 8, bookId: 16, duration: 18, date: '2026-03-09' },
        // 中一班学生阅读记录
        { studentId: 9, bookId: 6, duration: 18, date: '2026-03-10' },
        { studentId: 9, bookId: 17, duration: 15, date: '2026-03-09' },
        { studentId: 10, bookId: 10, duration: 20, date: '2026-03-10' },
        { studentId: 10, bookId: 18, duration: 18, date: '2026-03-09' },
        // 小一班学生阅读记录
        { studentId: 11, bookId: 13, duration: 15, date: '2026-03-10' },
        { studentId: 11, bookId: 19, duration: 12, date: '2026-03-09' },
        { studentId: 12, bookId: 15, duration: 18, date: '2026-03-10' },
        { studentId: 12, bookId: 20, duration: 15, date: '2026-03-09' }
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
            const studentNames = ['张小明', '李小红', '王小刚', '赵小芳', '陈小华', '周小杰', '刘小燕', '孙小婷', '吴小敏', '郑小强'];
            const deviceIds = ['DEV001', 'DEV002', 'DEV003', 'DEV004', 'DEV005'];
            for (let i = 0; i < 212; i++) {
                const classIdx = i % classNames.length;
                const day = Math.floor(i / 8) + 1;
                const month = day > 28 ? '01' : '02';
                const d = day > 28 ? day - 28 : day;
                const hour = 8 + (i % 8);
                const startTime = `2026-${month}-${String(d).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00:00`;
                const endTime = `2026-${month}-${String(d).padStart(2, '0')} ${String(hour + 2).padStart(2, '0')}:00:00`;
                
                // 生成参与学生列表（带详细信息）
                const studentCount = 15 + (i % 20);
                const participatingStudents = [];
                const actualCount = Math.min(studentCount, 3 + (i % 5)); // 实际参与人数
                for (let j = 0; j < actualCount; j++) {
                    participatingStudents.push({
                        name: studentNames[j % studentNames.length],
                        code: `S2024${String(j + 1).padStart(3, '0')}`,
                        deviceId: deviceIds[j % deviceIds.length]
                    });
                }
                
                // 生成阅读绘本信息
                const readBooks = [];
                const bookCount = i % 4; // 0-3本
                const bookTypes = ['日常生活', '人际交往', '情商品格', '国学文化'];
                for (let k = 0; k < bookCount; k++) {
                    readBooks.push({
                        name: `绘本${k + 1}`,
                        type: bookTypes[k % bookTypes.length]
                    });
                }
                
                activities.push({
                    id: i + 1,
                    startTime: startTime,
                    endTime: endTime,
                    teacher: teacherNames[classIdx],
                    className: classNames[classIdx],
                    studentCount: studentCount,
                    participatingStudents: participatingStudents,
                    readBooks: readBooks,
                    pushStatus: i % 3 === 0 ? '已推送' : '未推送给家长', // 推送状态
                    hasReadingData: bookCount > 0
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
            const studentNames = ['张小明', '李小红', '王小刚', '赵小芳', '陈小华', '周小杰', '刘小燕', '孙小婷', '吴小敏', '郑小强', '黄小乐', '林小静'];
            const classNames = ['大班3班', '大班2班', '中班1班', '小班2班', '大班1班', '中班2班'];
            
            return bookNames.map((name, i) => {
                // 生成该绘本的幼儿阅读记录
                const readingStudents = [];
                const recordCount = Math.max(0, 5 - Math.floor(i * 0.15)); // 0-5条记录
                for (let r = 0; r < recordCount; r++) {
                    const startHour = 9 + (r * 2) % 8;
                    const startMin = (r * 13) % 60;
                    const endMin = startMin + 5 + (r * 3) % 25;
                    const duration = ((endMin - startMin) / 60).toFixed(2);
                    
                    readingStudents.push({
                        name: studentNames[(i + r) % studentNames.length],
                        code: `S2024${String((i + r) % 100 + 1).padStart(3, '0')}`,
                        className: classNames[(i + r) % classNames.length],
                        startTime: `2024-08-${20 + (r % 10)} ${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00`,
                        endTime: `2024-08-${20 + (r % 10)} ${String(startHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`,
                        duration: `${duration}h`,
                        isCompleted: r % 3 === 0 ? '已读完' : '未读完'
                    });
                }
                
                return {
                    id: i + 1,
                    name: name,
                    isbn: `978-7-5448-${String(1000 + i).padStart(4, '0')}-${i % 10}`,
                    type: types[i % types.length],
                    readCount: Math.max(0, 19 - Math.floor(i * 0.3)),
                    readDuration: `${(Math.max(0.1, 5.7 - i * 0.08)).toFixed(2)}h`,
                    readingStudents: readingStudents
                };
            });
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

    // ========== 设备数据（园所数据页签） ==========
    devices: [
        { id: 1, sn: 'PR02241CC1500885', code: '13', useCount: 2, useDuration: '0.10h', lastUseTime: '2026-04-10 15:50:53' },
        { id: 2, sn: 'PR02241CC1500064', code: '1', useCount: 6, useDuration: '0.23h', lastUseTime: '2026-04-10 15:49:26' },
        { id: 3, sn: 'PR02241CC1500698', code: '2', useCount: 5, useDuration: '0.29h', lastUseTime: '2026-04-10 15:45:29' },
        { id: 4, sn: 'PR02241CC1400072', code: '11', useCount: 1, useDuration: '0.00h', lastUseTime: '2026-04-10 15:24:26' },
        { id: 5, sn: 'PR02241CC1500856', code: '28', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 6, sn: 'PR02241CC1500252', code: '20', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 7, sn: 'PR02241CC1400002', code: '21', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 8, sn: 'PR02241CC1500513', code: '22', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 9, sn: 'PR02241CC1500564', code: '23', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 10, sn: 'PR02241CC1500636', code: '24', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 11, sn: 'PR02241CC1500701', code: '3', useCount: 3, useDuration: '0.15h', lastUseTime: '2026-04-10 14:30:00' },
        { id: 12, sn: 'PR02241CC1500745', code: '4', useCount: 4, useDuration: '0.18h', lastUseTime: '2026-04-10 13:20:00' },
        { id: 13, sn: 'PR02241CC1500789', code: '5', useCount: 7, useDuration: '0.32h', lastUseTime: '2026-04-10 12:10:00' },
        { id: 14, sn: 'PR02241CC1500812', code: '6', useCount: 1, useDuration: '0.05h', lastUseTime: '2026-04-09 16:40:00' },
        { id: 15, sn: 'PR02241CC1500901', code: '7', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 16, sn: 'PR02241CC1400123', code: '8', useCount: 2, useDuration: '0.12h', lastUseTime: '2026-04-09 11:30:00' },
        { id: 17, sn: 'PR02241CC1500345', code: '9', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 18, sn: 'PR02241CC1500456', code: '10', useCount: 5, useDuration: '0.21h', lastUseTime: '2026-04-10 10:15:00' },
        { id: 19, sn: 'PR02241CC1400234', code: '12', useCount: 3, useDuration: '0.14h', lastUseTime: '2026-04-08 17:00:00' },
        { id: 20, sn: 'PR02241CC1500567', code: '14', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 21, sn: 'PR02241CC1500678', code: '15', useCount: 8, useDuration: '0.35h', lastUseTime: '2026-04-10 16:00:00' },
        { id: 22, sn: 'PR02241CC1400345', code: '16', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 23, sn: 'PR02241CC1500789', code: '17', useCount: 2, useDuration: '0.08h', lastUseTime: '2026-04-09 09:30:00' },
        { id: 24, sn: 'PR02241CC1500890', code: '18', useCount: 6, useDuration: '0.27h', lastUseTime: '2026-04-10 14:00:00' },
        { id: 25, sn: 'PR02241CC1500912', code: '19', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 26, sn: 'PR02241CC1400456', code: '25', useCount: 4, useDuration: '0.19h', lastUseTime: '2026-04-09 15:20:00' },
        { id: 27, sn: 'PR02241CC1500123', code: '26', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 28, sn: 'PR02241CC1500234', code: '27', useCount: 1, useDuration: '0.03h', lastUseTime: '2026-04-07 10:00:00' },
        { id: 29, sn: 'PR02241CC1500345', code: '29', useCount: 3, useDuration: '0.16h', lastUseTime: '2026-04-10 11:45:00' },
        { id: 30, sn: 'PR02241CC1400567', code: '30', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 31, sn: 'PR02241CC1500456', code: '31', useCount: 5, useDuration: '0.22h', lastUseTime: '2026-04-10 13:00:00' },
        { id: 32, sn: 'PR02241CC1500567', code: '32', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 33, sn: 'PR02241CC1400678', code: '33', useCount: 2, useDuration: '0.11h', lastUseTime: '2026-04-08 14:30:00' },
        { id: 34, sn: 'PR02241CC1500678', code: '34', useCount: 9, useDuration: '0.41h', lastUseTime: '2026-04-10 16:20:00' },
        { id: 35, sn: 'PR02241CC1500789', code: '35', useCount: 0, useDuration: '0.00h', lastUseTime: '' },
        { id: 36, sn: 'PR02241CC1400789', code: '36', useCount: 1, useDuration: '0.04h', lastUseTime: '2026-04-06 09:00:00' }
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

    // AI总览（园长视角）：基于 history 自动派生 summary 与 bookInteractions
    // ========== 学生AI对话记录（按活动→绘本→对话→轮次层级组织）==========
    studentChatRecords: (() => {
        // 为每个学生构建结构化的对话记录
        // 数据结构：{ studentId: [ activity, ... ] }
        // activity: { date, activityLabel, books: [ { bookName, bookType, conversations: [ { convIndex, page, time, turns: [ {q, a} ] } ] } ] }
        const records = {
            // ===== 张小明 (id:1) =====
            1: [
                {
                    date: '2026-05-10',
                    activityLabel: '第12次绘本活动',
                    books: [
                        {
                            bookName: '猜猜我有多爱你',
                            bookType: '情商品格',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第1页',
                                    time: '09:15',
                                    turns: [
                                        { q: '小兔子和大兔子在比什么呀？', a: '它们在比谁更爱对方呀～就像你有时候会跟好朋友说"我比你更喜欢巧克力"一样，小兔子和大兔子在比谁的爱更多更多！' }
                                    ]
                                },
                                {
                                    convIndex: 2,
                                    page: '第3页',
                                    time: '09:28',
                                    turns: [
                                        { q: '小兔子为什么要跳那么高？', a: '因为它想告诉大兔子："我的爱有那么高！"小兔子拼命地跳呀跳，想跳到最高的地方，就像你想把最好的东西给最爱的人一样～' },
                                        { q: '我也能跳那么高吗？', a: '你现在可能还跳不到那么高，但你的爱已经很高很高啦～等你长大了，一定可以跳得更高哦！' }
                                    ]
                                },
                                {
                                    convIndex: 3,
                                    page: '全文',
                                    time: '09:42',
                                    turns: [
                                        { q: '大兔子为什么每次都比小兔子更多？', a: '因为爸爸妈妈的爱呀，总是比我们想象的还要大还要多～就像小兔子使出全部力气，大兔子还是能更多一点点，因为大人的爱是无穷无尽的！' },
                                        { q: '那我是不是永远都比不过爸爸妈妈？', a: '不是哦～小兔子最后说"我爱你一直到月亮那里"，大兔子说"到月亮再绕回来"，虽然大兔子多一点，但小兔子的爱已经非常非常了不起了！你的爱也是一样棒的～' },
                                        { q: '我今晚也要跟妈妈比！', a: '太好啦！你可以张开手臂说"我爱你有这么多"，再跳一跳说"我爱你有那么高"，妈妈一定会特别特别开心的！' }
                                    ]
                                }
                            ]
                        },
                        {
                            bookName: '小蓝和小黄',
                            bookType: '日常生活',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '全文',
                                    time: '10:10',
                                    turns: [
                                        { q: '小蓝和小黄抱在一起为什么变绿了？', a: '因为蓝色和黄色是好朋友呀～它们紧紧拥抱的时候，会变成一种新的颜色——绿色！就像我们把颜料混在一起一样，会有奇妙的变化哦。' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    date: '2026-05-09',
                    activityLabel: '第11次绘本活动',
                    books: [
                        {
                            bookName: '猜猜我有多爱你',
                            bookType: '情商品格',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第2页',
                                    time: '10:05',
                                    turns: [
                                        { q: '小兔子说我爱你一直到我的手指头尖，是什么意思？', a: '就是小兔子把手臂和手指都伸得长长的，从脚趾头一直量到手指头尖——意思就是"我的爱有这么长！"你试试伸伸手，是不是也量出一个好大的爱？' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    date: '2026-05-07',
                    activityLabel: '第10次绘本活动',
                    books: [
                        {
                            bookName: '好饿的毛毛虫',
                            bookType: '科普百科',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第2页',
                                    time: '09:30',
                                    turns: [
                                        { q: '毛毛虫为什么那么饿呀？', a: '因为它刚从蛋里出来，肚肚空空的呀～就像你早上起床也是饿饿的，要吃早餐才有力气玩呢！' }
                                    ]
                                },
                                {
                                    convIndex: 2,
                                    page: '全文',
                                    time: '09:48',
                                    turns: [
                                        { q: '毛毛虫为什么会变成蝴蝶？', a: '小朋友你观察得真仔细！毛毛虫吃了很多很多东西，长大了就会找一片叶子，结一个茧，在里面静静地睡觉、慢慢地变。等它醒来，就像变魔法一样，长出了漂亮的翅膀，变成了蝴蝶啦！' },
                                        { q: '那它在茧里面会害怕吗？', a: '不会哦～茧就像毛毛虫的小睡袋，又温暖又安全，它在里面舒舒服服地睡觉，等着惊喜的那一天～' }
                                    ]
                                }
                            ]
                        },
                        {
                            bookName: '大卫不可以',
                            bookType: '日常生活',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第1页',
                                    time: '10:20',
                                    turns: [
                                        { q: '大卫为什么总是捣蛋？', a: '大卫不是故意捣蛋哦～他只是太好奇了，什么都想试一试。不过妈妈说"不可以"是为了保护大卫不受伤，因为妈妈很爱他呀！' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            // ===== 李小红 (id:2) =====
            2: [
                {
                    date: '2026-05-09',
                    activityLabel: '第11次绘本活动',
                    books: [
                        {
                            bookName: '好饿的毛毛虫',
                            bookType: '科普百科',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第1页',
                                    time: '14:10',
                                    turns: [
                                        { q: '毛毛虫从蛋里面出来的时候那么小，它会害怕吗？', a: '可能有一点点怕哦～但是毛毛虫很勇敢，它马上就开始找东西吃啦！就像小朋友第一天上幼儿园，虽然有点紧张，但很快就找到好玩的事情了～' }
                                    ]
                                },
                                {
                                    convIndex: 2,
                                    page: '第3页',
                                    time: '14:25',
                                    turns: [
                                        { q: '毛毛虫星期六吃了好多好多，有巧克力蛋糕还有冰淇淋！', a: '是呀！毛毛虫太贪嘴了～蛋糕、冰淇淋、酸黄瓜、瑞士奶酪……它什么都想尝一口，结果肚子好痛好痛。所以吃东西要适量哦，不然肚肚会生气的！' },
                                        { q: '那星期天它吃了什么？', a: '星期天它只吃了一片绿绿的叶子，肚子就好多了～原来毛毛虫也需要吃健康的东西才能肚子舒服呢！' }
                                    ]
                                },
                                {
                                    convIndex: 3,
                                    page: '全文',
                                    time: '14:50',
                                    turns: [
                                        { q: '毛毛虫变成蝴蝶以后还会饿吗？', a: '蝴蝶也要吃东西哦～不过蝴蝶不再吃叶子了，它用长长的嘴巴吸花蜜，甜甜的，像喝果汁一样～' },
                                        { q: '蝴蝶飞到哪里去呀？', a: '蝴蝶会飞到有花的地方，一边喝花蜜一边帮花朵传花粉，花朵就会结出果子来～蝴蝶是不是很厉害的小帮手？' },
                                        { q: '我也能帮花朵传花粉吗？', a: '哈哈，你没有蝴蝶那样的小翅膀呀～但是你可以帮大人浇花、种花，让花朵长得漂漂亮亮的，那也是很棒的帮助哦！' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    date: '2026-05-08',
                    activityLabel: '第10次绘本活动',
                    books: [
                        {
                            bookName: '好饿的毛毛虫',
                            bookType: '科普百科',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第5页',
                                    time: '15:30',
                                    turns: [
                                        { q: '毛毛虫的茧是跟蚕宝宝的茧一样吗？', a: '很像哦～它们都是用丝把自己包起来，在里面悄悄变化。蚕宝宝变成飞蛾，毛毛虫变成蝴蝶，都是神奇的大变身呢！' }
                                    ]
                                }
                            ]
                        },
                        {
                            bookName: '彩虹色的花',
                            bookType: '情商品格',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第1页',
                                    time: '16:00',
                                    turns: [
                                        { q: '彩虹色的花为什么有那么多颜色的花瓣？', a: '因为它是一朵特别特别神奇的花呀～每一片花瓣都不一样，红色、橙色、黄色……像把彩虹穿在了身上，特别漂亮！' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            // ===== 王小刚 (id:3) =====
            3: [
                {
                    date: '2026-05-08',
                    activityLabel: '第9次绘本活动',
                    books: [
                        {
                            bookName: '彩虹色的花',
                            bookType: '情商品格',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第1页',
                                    time: '09:20',
                                    turns: [
                                        { q: '彩虹色的花为什么有那么多颜色的花瓣？', a: '因为它是一朵特别特别神奇的花呀～每一片花瓣都不一样，红色、橙色、黄色……像把彩虹穿在了身上，特别漂亮！' }
                                    ]
                                },
                                {
                                    convIndex: 2,
                                    page: '第4页',
                                    time: '09:35',
                                    turns: [
                                        { q: '花瓣都送完了，花会死掉吗？', a: '花瓣虽然送完了，但是花的种子会落进泥土里，等到第二年春天，又会开出一朵新的彩虹色的花～就像爱不会消失，会一直一直传下去！' },
                                        { q: '那小鸟会记得这朵花吗？', a: '会呀～每一片花瓣都帮助过一个好朋友，大家都会记得这朵善良的花。即使看不见它了，它也一直住在大家的心里哦～' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    date: '2026-05-07',
                    activityLabel: '第8次绘本活动',
                    books: [
                        {
                            bookName: '彩虹色的花',
                            bookType: '情商品格',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '全文',
                                    time: '14:15',
                                    turns: [
                                        { q: '我也要像彩虹色的花一样帮助别人！', a: '太棒啦！你可以把零食分给没有带的小朋友，也可以帮老师收拾玩具，每做一件好事，就像送出了一片彩色的花瓣～' },
                                        { q: '帮助别人以后会变少吗？', a: '不会哦～就像彩虹色的花，虽然花瓣送出去了，但是它的心变得越来越温暖。帮助别人不会让你变少，反而会让你变得更幸福呢！' }
                                    ]
                                }
                            ]
                        },
                        {
                            bookName: '爷爷一定有办法',
                            bookType: '日常生活',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第2页',
                                    time: '14:50',
                                    turns: [
                                        { q: '爷爷为什么总能变出新的东西？', a: '因为爷爷很聪明又很爱孙子呀～他把旧的东西变废为宝，一块旧毯子变成了外套，外套变成了背心……爷爷的爱心就是最好的魔法！' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            // ===== 黄小龙 (id:4) =====
            4: [
                {
                    date: '2026-05-09',
                    activityLabel: '第10次绘本活动',
                    books: [
                        {
                            bookName: '小蓝和小黄',
                            bookType: '日常生活',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第2页',
                                    time: '16:00',
                                    turns: [
                                        { q: '小蓝的爸爸妈妈为什么跟小蓝长一样？', a: '因为他们都是蓝色的呀～就像你长得像爸爸妈妈一样，小蓝也长得像它的蓝爸爸妈妈！' }
                                    ]
                                },
                                {
                                    convIndex: 2,
                                    page: '全文',
                                    time: '16:15',
                                    turns: [
                                        { q: '小蓝和小黄变成绿色以后，爸爸妈妈都不认识它们了怎么办？', a: '它们好伤心好伤心，哭啊哭啊，眼泪流啊流，把绿色都哭掉了，又变回了蓝色和黄色！爸爸妈妈终于认出它们了，大家抱在一起，太开心啦！' },
                                        { q: '如果我变了个样子，妈妈还认识我吗？', a: '一定认识呀！因为妈妈是用心在看你，不是只看外表。不管你穿什么衣服、剪什么头发，妈妈永远都能认出你～' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    date: '2026-05-08',
                    activityLabel: '第9次绘本活动',
                    books: [
                        {
                            bookName: '小蓝和小黄',
                            bookType: '日常生活',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第3页',
                                    time: '09:45',
                                    turns: [
                                        { q: '颜色混在一起就会变色吗？', a: '是呀～蓝色和黄色抱在一起就变绿色，红色和黄色抱在一起就变橙色。你可以试试用颜料混一混，会有好多好多惊喜哦！' }
                                    ]
                                }
                            ]
                        },
                        {
                            bookName: '胆小鬼威利',
                            bookType: '情商品格',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '全文',
                                    time: '10:15',
                                    turns: [
                                        { q: '威利后来为什么不胆小了？', a: '因为威利发现自己其实很厉害呀～他开始锻炼身体，变强壮了，就有了勇气。其实勇敢不是不害怕，而是害怕了还愿意试试看！' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            // ===== 赵小丽 (id:5) =====
            5: [
                {
                    date: '2026-05-10',
                    activityLabel: '第11次绘本活动',
                    books: [
                        {
                            bookName: '爱心树',
                            bookType: '情商品格',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第2页',
                                    time: '10:10',
                                    turns: [
                                        { q: '小男孩为什么老是找大树要东西？', a: '因为大树每次都愿意给他呀～小男孩从小就习惯了找大树帮忙。不过后来小男孩长大以后，也慢慢明白大树的爱有多珍贵了。' }
                                    ]
                                },
                                {
                                    convIndex: 2,
                                    page: '全文',
                                    time: '10:30',
                                    turns: [
                                        { q: '大树只剩下一个树墩了，为什么还开心？', a: '因为大树看到小男孩回来了，就觉得很开心很满足了。对大树来说，小男孩在身边就是最大的幸福～虽然只有一个树墩，但它还可以让累了的小男孩坐下来休息。' },
                                        { q: '大树是不是太傻了？', a: '大树不傻哦～大树只是太爱小男孩了。爱一个人就会愿意把自己最好的都给他，就像爸爸妈妈对你一样，他们给你的一切都是心甘情愿的～' },
                                        { q: '我要对妈妈好一点！', a: '说得太好啦！你可以今天回家就给妈妈一个大大的拥抱，告诉她你很爱她，妈妈一定会特别特别开心的！' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    date: '2026-05-09',
                    activityLabel: '第10次绘本活动',
                    books: [
                        {
                            bookName: '爱心树',
                            bookType: '情商品格',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第3页',
                                    time: '15:00',
                                    turns: [
                                        { q: '大树把树枝都砍掉了会疼吗？', a: '大树可能会有一点疼，但它想到小男孩可以用树枝盖房子，就忍住了。就像妈妈虽然辛苦，但看到你开心，就会觉得一切都值得～' }
                                    ]
                                }
                            ]
                        },
                        {
                            bookName: '花婆婆',
                            bookType: '日常生活',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第1页',
                                    time: '15:30',
                                    turns: [
                                        { q: '花婆婆小时候住在哪里呀？', a: '花婆婆小时候住在海边的城市，每天能看到蓝蓝的大海和白色的海鸥，特别漂亮～你有没有见过大海呀？' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            // ===== 陈小华 (id:6) =====
            6: [
                {
                    date: '2026-05-10',
                    activityLabel: '第9次绘本活动',
                    books: [
                        {
                            bookName: '花婆婆',
                            bookType: '日常生活',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第1页',
                                    time: '14:00',
                                    turns: [
                                        { q: '花婆婆小时候住在哪里呀？', a: '花婆婆小时候住在海边的城市，每天能看到蓝蓝的大海和白色的海鸥，特别漂亮～你有没有见过大海呀？' }
                                    ]
                                },
                                {
                                    convIndex: 2,
                                    page: '第5页',
                                    time: '14:18',
                                    turns: [
                                        { q: '花婆婆做了第三件事是什么？', a: '就是做一件让世界变得更美丽的事情！花婆婆选择了撒花种子，让到处都开满了漂亮的花。你想想看，你可以做一件什么让世界变美的事呢？' },
                                        { q: '我可以画一幅漂亮的画！', a: '太棒了！画一幅美丽的画就是让世界变美呀～如果你把画送给朋友，他们看到会开心，世界就又多了一份美丽呢！' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    date: '2026-05-09',
                    activityLabel: '第8次绘本活动',
                    books: [
                        {
                            bookName: '花婆婆',
                            bookType: '日常生活',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '全文',
                                    time: '11:30',
                                    turns: [
                                        { q: '花婆婆的爷爷告诉她的三件事她都做到了吗？', a: '都做到了哦～第一件是去很远的地方旅行，第二件是住在海边，第三件是让世界变美丽。花婆婆用了好长好长的时间，但她一件一件全都做到了，真了不起！' }
                                    ]
                                }
                            ]
                        },
                        {
                            bookName: '猜猜我有多爱你',
                            bookType: '情商品格',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第1页',
                                    time: '12:00',
                                    turns: [
                                        { q: '为什么小兔子要抓住大兔子的耳朵呀？', a: '因为小兔子要睡觉啦，想要紧紧地抓着大兔子的耳朵，就像你睡觉的时候要抱着喜欢的小玩偶一样，会觉得特别安心～' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            // ===== 郑小雪 (id:9) =====
            9: [
                {
                    date: '2026-05-09',
                    activityLabel: '第8次绘本活动',
                    books: [
                        {
                            bookName: '逃家小兔',
                            bookType: '情商品格',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第1页',
                                    time: '10:05',
                                    turns: [
                                        { q: '小兔子为什么要逃跑呀？', a: '小兔子不是真的想逃跑哦～它在和妈妈玩一个追逐游戏呢！就像你跟妈妈玩捉迷藏一样，其实你心里是想让妈妈来找到你的对不对？' }
                                    ]
                                },
                                {
                                    convIndex: 2,
                                    page: '第4页',
                                    time: '10:22',
                                    turns: [
                                        { q: '小兔子变成小鸟，妈妈变成什么了？', a: '妈妈变成了一棵大树！不管小鸟飞到哪里，大树都在那里等着它回家～你看，妈妈的爱就像大树一样，永远等着你。' },
                                        { q: '那小兔子变成帆船呢？', a: '妈妈就变成了风，轻轻推着小帆船往前走～不管小兔子变成什么，妈妈都会变成能陪着它、照顾它的东西呢！' }
                                    ]
                                }
                            ]
                        },
                        {
                            bookName: '我爸爸',
                            bookType: '人际交往',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第1页',
                                    time: '10:50',
                                    turns: [
                                        { q: '你爸爸最厉害的地方是什么呀？', a: '我爸爸像大猩猩一样强壮，像马一样吃得多，还像猫头鹰一样聪明！你爸爸最厉害的是什么呢？' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    date: '2026-05-08',
                    activityLabel: '第7次绘本活动',
                    books: [
                        {
                            bookName: '逃家小兔',
                            bookType: '情商品格',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '全文',
                                    time: '16:20',
                                    turns: [
                                        { q: '最后小兔子还逃不逃了？', a: '不逃啦～小兔子发现不管逃到哪里，妈妈的爱都会追上它，所以它决定乖乖待在妈妈身边。因为和妈妈在一起才是最温暖最安全的呀！' },
                                        { q: '我也不想离开妈妈', a: '那太好了！妈妈最想就是和你在一起～不管你在哪里，妈妈都会像故事里的兔妈妈一样，永远永远爱着你。' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            // ===== 吴小杰 (id:10) =====
            10: [
                {
                    date: '2026-05-09',
                    activityLabel: '第9次绘本活动',
                    books: [
                        {
                            bookName: '我爸爸',
                            bookType: '人际交往',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第1页',
                                    time: '09:10',
                                    turns: [
                                        { q: '为什么书里说爸爸像大猩猩一样强壮？', a: '因为大猩猩是力气最大的动物之一呀～小朋友觉得爸爸力气特别大，什么都能搬动，就像大猩猩一样厉害！你爸爸力气大不大？' }
                                    ]
                                },
                                {
                                    convIndex: 2,
                                    page: '第3页',
                                    time: '09:30',
                                    turns: [
                                        { q: '爸爸真的会走钢丝吗？', a: '哈哈，走钢丝是杂技演员才会的本领～不过书里是把爸爸比作最厉害的人，什么困难都难不倒他！就像你的爸爸在你心里也是无所不能的超级英雄吧？' },
                                        { q: '我爸爸会修玩具！', a: '哇，那你的爸爸好厉害！修玩具可不容易哦，要很聪明很有耐心才行。你的爸爸就是你的超级英雄呀～' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    date: '2026-05-08',
                    activityLabel: '第8次绘本活动',
                    books: [
                        {
                            bookName: '我爸爸',
                            bookType: '人际交往',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '全文',
                                    time: '10:15',
                                    turns: [
                                        { q: '书的最后说爸爸很爱我，我也很爱他，我好感动！', a: '是呀～这才是最重要的一句话！不管爸爸像什么，最最关键的是——你们彼此相爱。你有这样的爸爸真幸福呢！' }
                                    ]
                                }
                            ]
                        },
                        {
                            bookName: '鳄鱼怕怕牙医怕怕',
                            bookType: '日常生活',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第2页',
                                    time: '10:45',
                                    turns: [
                                        { q: '鳄鱼为什么怕牙医呀？', a: '因为牙医要给鳄鱼看牙齿，要张大嘴巴，鳄鱼害怕疼呀～但是牙医也怕鳄鱼的大嘴巴呢！两个都害怕，太有趣了！' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    date: '2026-05-07',
                    activityLabel: '第7次绘本活动',
                    books: [
                        {
                            bookName: '我爸爸',
                            bookType: '人际交往',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第2页',
                                    time: '14:40',
                                    turns: [
                                        { q: '爸爸真的什么都不怕吗？连大野狼都不怕？', a: '书里说爸爸像房子一样高大，连大野狼都要躲开他！其实爸爸也会有害怕的时候，但为了保护你，他会变得特别特别勇敢～' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        // 为没有手动编写数据的学生，基于 aiOverview.history 自动生成记录
        const allStudentIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        const studentNameMap = {};
        // 从 students 数组建立 id→name 映射
        // (students 数组在 mockData 前面已定义)
        allStudentIds.forEach(id => {
            const stu = [/* placeholder - 会在运行时从 MockData.students 取 */][0];
        });

        // 用已有的 aiOverview.history 为缺失学生补充数据
        // 但由于 aiOverview 是 IIFE，此时已计算完毕，可以直接引用
        // 这里我们直接为常见学生补充数据
        const supplemental = {
            // ===== 林小燕 (id:7) =====
            7: [
                {
                    date: '2026-05-08',
                    activityLabel: '第10次绘本活动',
                    books: [
                        {
                            bookName: '猜猜我有多爱你',
                            bookType: '情商品格',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第4页',
                                    time: '10:20',
                                    turns: [
                                        { q: '小兔子说我爱你像小河一样长是什么意思？', a: '就是爱像河水一样，一直流啊流，流到好远好远的地方，没有尽头～小兔子在说它的爱是永远不会停下来的！' }
                                    ]
                                },
                                {
                                    convIndex: 2,
                                    page: '全文',
                                    time: '10:38',
                                    turns: [
                                        { q: '小兔子每次说爱大兔子，大兔子总是更多，小兔子会不会难过？', a: '不会哦～小兔子虽然比不过大兔子，但它很开心，因为它知道大兔子那么那么爱它！其实爱不是比赛，只是想告诉对方"我很爱你"而已～' },
                                        { q: '我也想跟我的好朋友比谁更爱谁！', a: '好主意！你可以跟好朋友说"我爱你有从教室到操场那么远"，说不定他会说"我爱你有从教室到家那么远"呢！比来比去，你们都会发现对方好爱你～' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            // ===== 刘小芳 (id:8) =====
            8: [
                {
                    date: '2026-05-10',
                    activityLabel: '第8次绘本活动',
                    books: [
                        {
                            bookName: '母鸡萝丝去散步',
                            bookType: '日常生活',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '全文',
                                    time: '16:18',
                                    turns: [
                                        { q: '狐狸为什么一直跟着萝丝？', a: '因为狐狸饿啦，它想偷偷地抓住萝丝当晚餐～不过呀，狐狸总是不小心摔跟头，特别好笑！' },
                                        { q: '萝丝看到狐狸了吗？', a: '没有哦～萝丝一直悠闲地散步，根本没有发现狐狸在身后呢。狐狸却总是被各种东西绊倒，是不是很有趣？' }
                                    ]
                                }
                            ]
                        },
                        {
                            bookName: '古利和古拉',
                            bookType: '日常生活',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第1页',
                                    time: '16:50',
                                    turns: [
                                        { q: '古利和古拉在做什么呀？', a: '它们在做好吃的蛋糕呢！两个好朋友一起合作，你搅面糊我加糖，一起做出来的蛋糕特别香特别好吃～' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            // ===== 周小琳 (id:13) =====
            13: [
                {
                    date: '2026-05-10',
                    activityLabel: '第7次绘本活动',
                    books: [
                        {
                            bookName: '团圆',
                            bookType: '国学文化',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '全文',
                                    time: '15:30',
                                    turns: [
                                        { q: '爸爸为什么过年才回家？', a: '因为爸爸在很远的地方工作，要靠他赚钱养家。虽然平时见不到，但过年的时候爸爸会回来和我们团圆，就像故事里一样～' },
                                        { q: '小朋友会等爸爸回来吗？', a: '会哦～就像故事里的毛毛一样，把对爸爸的思念都藏在心里，等着团圆的那一天。' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            // ===== 孙小伟 (id:11) =====
            11: [
                {
                    date: '2026-05-10',
                    activityLabel: '第9次绘本活动',
                    books: [
                        {
                            bookName: '花婆婆',
                            bookType: '日常生活',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '第4页',
                                    time: '15:55',
                                    turns: [
                                        { q: '花婆婆为什么要撒花种子？', a: '因为花婆婆想让这个世界变得更美丽呀～她相信，如果每个人都做一件让世界变美的事，世界就会越来越温暖、越来越美好。你想做哪件让世界变美的事呀？' }
                                    ]
                                }
                            ]
                        },
                        {
                            bookName: '三只小猪',
                            bookType: '国学文化',
                            conversations: [
                                {
                                    convIndex: 1,
                                    page: '全文',
                                    time: '16:20',
                                    turns: [
                                        { q: '第三只小猪的房子为什么吹不倒？', a: '因为第三只小猪用砖头一块一块地砌，砌得又结实又牢固！大灰狼怎么吹都吹不倒～所以做事情要认真、不能偷懒哦！' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        // 合并数据
        Object.assign(records, supplemental);

        return records;
    })(),

    aiOverview: (() => {
        const students = [
            { name: '张小明', className: '大一班' },
            { name: '李小红', className: '大一班' },
            { name: '王小刚', className: '大一班' },
            { name: '黄小龙', className: '大一班' },
            { name: '赵小丽', className: '大二班' },
            { name: '陈小华', className: '大二班' },
            { name: '林小燕', className: '大二班' },
            { name: '柳小晴', className: '大二班' },
            { name: '刘小芳', className: '中一班' },
            { name: '孙小伟', className: '中一班' },
            { name: '徐小鹏', className: '中一班' },
            { name: '周小琳', className: '中二班' },
            { name: '马小丽', className: '中二班' },
            { name: '宋小诗', className: '中二班' },
            { name: '吴小杰', className: '小一班' },
            { name: '郑小雪', className: '小一班' },
            { name: '罗小宇', className: '小一班' },
            { name: '何小文', className: '小二班' },
            { name: '韩小奇', className: '小二班' },
            { name: '高小阳', className: '大三班' },
            { name: '田小默', className: '中三班' },
            { name: '叶小婉', className: '小三班' }
        ];
        const books = [
            '猜猜我有多爱你', '好饿的毛毛虫', '彩虹色的花', '爱心树', '母鸡萝丝去散步',
            '花婆婆', '团圆', '我爸爸', '逃家小兔', '小蓝和小黄',
            '永远永远爱你', '哇哦，鳄鱼也想要惊喜', '胆小鬼威利', '古利和古拉', '大卫不可以',
            '爷爷一定有办法', '我妈妈', '蚯蚓的日记', '活了100万次的猫', '石头汤',
            '失落的一角', '你看起来好像很好吃', '我是霸王龙', '遇到你真好', '神奇校车',
            '弟子规', '三字经', '不一样的卡梅拉'
        ];
        const qaPool = [
            { q: '为什么大树会长那么高？', a: '因为大树喝足了水分，又每天晒太阳，慢慢就长得又高又大啦～就像小朋友吃饭饭、好好睡觉就会长高一样哦！' },
            { q: '小动物冬天会去哪里？', a: '有的小动物会找一个温暖的小窝，睡一个长长的觉，叫做"冬眠"；有的会换上厚厚的毛衣保暖；还有的会飞到温暖的南方过冬呢～' },
            { q: '蝴蝶为什么有那么漂亮的翅膀？', a: '蝴蝶的翅膀上有许多许多小鳞片，阳光照着会反射出漂亮的颜色，就像戴上了彩虹做的小披风～' },
            { q: '为什么要分享呀？', a: '因为分享会让快乐变成两倍呀！当我们把好东西和好朋友一起享用，大家都开心，自己也会觉得心里暖暖的～' },
            { q: '为什么晚上要睡觉？', a: '因为白天我们玩了好多好多，小身体也累啦～晚上睡一个好觉，身体才会悄悄长大，第二天又有满满的力气啦！' },
            { q: '雨是怎么下下来的？', a: '云朵装满了水珠以后就变得沉沉的，水珠就一颗颗掉下来啦～这就是下雨。是不是像云朵在洒水呢？' },
            { q: '彩虹有几种颜色？', a: '彩虹有七种颜色：红、橙、黄、绿、青、蓝、紫～像一座漂亮的小桥挂在天上！' },
            { q: '为什么我们要刷牙？', a: '小牙齿是吃饭饭的好帮手呀～如果不刷牙，小细菌就会偷偷躲进去捣蛋。每天早晚刷牙，小牙齿会闪闪发亮哦！' },
            { q: '为什么要爱护小动物？', a: '小动物也有家人，也会害怕、也会开心。我们温柔地对待它们，世界就会多一份温暖～' },
            { q: '太阳晚上去哪了？', a: '太阳要去地球的另一边，给那里的小朋友送光啦～等他给小朋友们说完晚安，第二天就会回来啦！' },
            { q: '风是从哪里来的？', a: '风是空气在悄悄跑步呀～你看，树叶被它一吹就跳起舞，连小朋友的头发也会被它逗得飞起来！' },
            { q: '勇敢是什么呀？', a: '勇敢是当你害怕的时候，还愿意往前走一步的小心心～就像故事里的小英雄们，他们也会害怕，但还是选择保护朋友。' },
            { q: '为什么花朵颜色不一样？', a: '不同的花朵有不同的"魔法颜料"，所以才有了红的、黄的、紫的……每一朵都独一无二，就像我们每个小朋友都是特别的～' },
            { q: '我可以变成超人吗？', a: '可以呀！你的善良和爱心就是最厉害的超能力～保护小动物、帮助小朋友，你就已经是了不起的小超人啦！' },
            { q: '为什么妈妈那么辛苦？', a: '因为妈妈想把最好的爱给你呀～如果你给她一个大大的拥抱，告诉她你爱她，她就不觉得辛苦啦！' },
            { q: '小兔子为什么不肯睡觉？', a: '小兔子是想多陪一会儿大兔子呀～就像有时候你也舍不得放下喜欢的玩具一样，因为太喜欢啦～' },
            { q: '小毛毛虫吃饱了会怎么样？', a: '它会找一片大大的叶子，结一个温暖的小茧，然后悄悄地变成漂亮的蝴蝶哦～' },
            { q: '为什么我们要听老师的话？', a: '老师就像幼儿园的妈妈，希望大家平平安安、快快乐乐～如果你有不一样的想法，可以举手悄悄告诉老师哦！' },
            { q: '小鸟会唱歌吗？', a: '会呀～每只小鸟都有自己的小歌曲，清晨的时候它们会一起开"音乐会"，是不是很好听？' },
            { q: '小蝌蚪会变成什么？', a: '小蝌蚪长大以后会变成可爱的小青蛙哦～它们的尾巴慢慢消失，长出小腿，就能在荷叶上跳来跳去啦～' }
        ];

        // ===== 同一孩子同一绘本的多次对话（同日 + 跨日，带针对绘本内容的专属问答） =====
        const repeatHistory = [
            // --- 张小明 · 猜猜我有多爱你 · 同日3次对话 ---
            { id: 'ai-r01', time: '2026-05-10 09:15', book: '猜猜我有多爱你', page: '第1页', scope: 'page', student: '张小明', className: '大一班',
              session: [
                { q: '小兔子和大兔子在比什么呀？', a: '它们在比谁更爱对方呀～就像你有时候会跟好朋友说"我比你更喜欢巧克力"一样，小兔子和大兔子在比谁的爱更多更多！' }
              ] },
            { id: 'ai-r02', time: '2026-05-10 09:28', book: '猜猜我有多爱你', page: '第3页', scope: 'page', student: '张小明', className: '大一班',
              session: [
                { q: '小兔子为什么要跳那么高？', a: '因为它想告诉大兔子："我的爱有那么高！"小兔子拼命地跳呀跳，想跳到最高的地方，就像你想把最好的东西给最爱的人一样～' },
                { q: '我也能跳那么高吗？', a: '你现在可能还跳不到那么高，但你的爱已经很高很高啦～等你长大了，一定可以跳得更高哦！' }
              ] },
            { id: 'ai-r03', time: '2026-05-10 09:42', book: '猜猜我有多爱你', page: '全文', scope: 'full', student: '张小明', className: '大一班',
              session: [
                { q: '大兔子为什么每次都比小兔子更多？', a: '因为爸爸妈妈的爱呀，总是比我们想象的还要大还要多～就像小兔子使出全部力气，大兔子还是能更多一点点，因为大人的爱是无穷无尽的！' },
                { q: '那我是不是永远都比不过爸爸妈妈？', a: '不是哦～小兔子最后说"我爱你一直到月亮那里"，大兔子说"到月亮再绕回来"，虽然大兔子多一点，但小兔子的爱已经非常非常了不起了！你的爱也是一样棒的～' },
                { q: '我今晚也要跟妈妈比！', a: '太好啦！你可以张开手臂说"我爱你有这么多"，再跳一跳说"我爱你有那么高"，妈妈一定会特别特别开心的！' }
              ] },
            // --- 张小明 · 猜猜我有多爱你 · 前一天又读 ---
            { id: 'ai-r04', time: '2026-05-09 10:05', book: '猜猜我有多爱你', page: '第2页', scope: 'page', student: '张小明', className: '大一班',
              session: [
                { q: '小兔子说我爱你一直到我的手指头尖，是什么意思？', a: '就是小兔子把手臂和手指都伸得长长的，从脚趾头一直量到手指头尖——意思就是"我的爱有这么长！"你试试伸伸手，是不是也量出一个好大的爱？' }
              ] },

            // --- 李小红 · 好饿的毛毛虫 · 同日3次对话 ---
            { id: 'ai-r05', time: '2026-05-09 14:10', book: '好饿的毛毛虫', page: '第1页', scope: 'page', student: '李小红', className: '大一班',
              session: [
                { q: '毛毛虫从蛋里面出来的时候那么小，它会害怕吗？', a: '可能有一点点怕哦～但是毛毛虫很勇敢，它马上就开始找东西吃啦！就像小朋友第一天上幼儿园，虽然有点紧张，但很快就找到好玩的事情了～' }
              ] },
            { id: 'ai-r06', time: '2026-05-09 14:25', book: '好饿的毛毛虫', page: '第3页', scope: 'page', student: '李小红', className: '大一班',
              session: [
                { q: '毛毛虫星期六吃了好多好多，有巧克力蛋糕还有冰淇淋！', a: '是呀！毛毛虫太贪嘴了～蛋糕、冰淇淋、酸黄瓜、瑞士奶酪……它什么都想尝一口，结果肚子好痛好痛。所以吃东西要适量哦，不然肚肚会生气的！' },
                { q: '那星期天它吃了什么？', a: '星期天它只吃了一片绿绿的叶子，肚子就好多了～原来毛毛虫也需要吃健康的东西才能肚子舒服呢！' }
              ] },
            { id: 'ai-r07', time: '2026-05-09 14:50', book: '好饿的毛毛虫', page: '全文', scope: 'full', student: '李小红', className: '大一班',
              session: [
                { q: '毛毛虫变成蝴蝶以后还会饿吗？', a: '蝴蝶也要吃东西哦～不过蝴蝶不再吃叶子了，它用长长的嘴巴吸花蜜，甜甜的，像喝果汁一样～' },
                { q: '蝴蝶飞到哪里去呀？', a: '蝴蝶会飞到有花的地方，一边喝花蜜一边帮花朵传花粉，花朵就会结出果子来～蝴蝶是不是很厉害的小帮手？' },
                { q: '我也能帮花朵传花粉吗？', a: '哈哈，你没有蝴蝶那样的小翅膀呀～但是你可以帮大人浇花、种花，让花朵长得漂漂亮亮的，那也是很棒的帮助哦！' }
              ] },
            // --- 李小红 · 好饿的毛毛虫 · 再前一天又读 ---
            { id: 'ai-r08', time: '2026-05-08 15:30', book: '好饿的毛毛虫', page: '第5页', scope: 'page', student: '李小红', className: '大一班',
              session: [
                { q: '毛毛虫的茧是跟蚕宝宝的茧一样吗？', a: '很像哦～它们都是用丝把自己包起来，在里面悄悄变化。蚕宝宝变成飞蛾，毛毛虫变成蝴蝶，都是神奇的大变身呢！' }
              ] },

            // --- 王小刚 · 彩虹色的花 · 同日2次 + 跨日1次 ---
            { id: 'ai-r09', time: '2026-05-08 09:20', book: '彩虹色的花', page: '第1页', scope: 'page', student: '王小刚', className: '大一班',
              session: [
                { q: '彩虹色的花为什么有那么多颜色的花瓣？', a: '因为它是一朵特别特别神奇的花呀～每一片花瓣都不一样，红色、橙色、黄色……像把彩虹穿在了身上，特别漂亮！' }
              ] },
            { id: 'ai-r10', time: '2026-05-08 09:35', book: '彩虹色的花', page: '第4页', scope: 'page', student: '王小刚', className: '大一班',
              session: [
                { q: '花瓣都送完了，花会死掉吗？', a: '花瓣虽然送完了，但是花的种子会落进泥土里，等到第二年春天，又会开出一朵新的彩虹色的花～就像爱不会消失，会一直一直传下去！' },
                { q: '那小鸟会记得这朵花吗？', a: '会呀～每一片花瓣都帮助过一个好朋友，大家都会记得这朵善良的花。即使看不见它了，它也一直住在大家的心里哦～' }
              ] },
            { id: 'ai-r11', time: '2026-05-07 14:15', book: '彩虹色的花', page: '全文', scope: 'full', student: '王小刚', className: '大一班',
              session: [
                { q: '我也要像彩虹色的花一样帮助别人！', a: '太棒啦！你可以把零食分给没有带的小朋友，也可以帮老师收拾玩具，每做一件好事，就像送出了一片彩色的花瓣～' },
                { q: '帮助别人以后会变少吗？', a: '不会哦～就像彩虹色的花，虽然花瓣送出去了，但是它的心变得越来越温暖。帮助别人不会让你变少，反而会让你变得更幸福呢！' }
              ] },

            // --- 赵小丽 · 爱心树 · 同日2次 + 跨日1次 ---
            { id: 'ai-r12', time: '2026-05-10 10:10', book: '爱心树', page: '第2页', scope: 'page', student: '赵小丽', className: '大二班',
              session: [
                { q: '小男孩为什么老是找大树要东西？', a: '因为大树每次都愿意给他呀～小男孩从小就习惯了找大树帮忙。不过后来小男孩长大以后，也慢慢明白大树的爱有多珍贵了。' }
              ] },
            { id: 'ai-r13', time: '2026-05-10 10:30', book: '爱心树', page: '全文', scope: 'full', student: '赵小丽', className: '大二班',
              session: [
                { q: '大树只剩下一个树墩了，为什么还开心？', a: '因为大树看到小男孩回来了，就觉得很开心很满足了。对大树来说，小男孩在身边就是最大的幸福～虽然只有一个树墩，但它还可以让累了的小男孩坐下来休息。' },
                { q: '大树是不是太傻了？', a: '大树不傻哦～大树只是太爱小男孩了。爱一个人就会愿意把自己最好的都给他，就像爸爸妈妈对你一样，他们给你的一切都是心甘情愿的～' },
                { q: '我要对妈妈好一点！', a: '说得太好啦！你可以今天回家就给妈妈一个大大的拥抱，告诉她你很爱她，妈妈一定会特别特别开心的！' }
              ] },
            { id: 'ai-r14', time: '2026-05-09 15:00', book: '爱心树', page: '第3页', scope: 'page', student: '赵小丽', className: '大二班',
              session: [
                { q: '大树把树枝都砍掉了会疼吗？', a: '大树可能会有一点疼，但它想到小男孩可以用树枝盖房子，就忍住了。就像妈妈虽然辛苦，但看到你开心，就会觉得一切都值得～' }
              ] },

            // --- 郑小雪 · 逃家小兔 · 同日2次 + 跨日1次 ---
            { id: 'ai-r15', time: '2026-05-09 10:05', book: '逃家小兔', page: '第1页', scope: 'page', student: '郑小雪', className: '小一班',
              session: [
                { q: '小兔子为什么要逃跑呀？', a: '小兔子不是真的想逃跑哦～它在和妈妈玩一个追逐游戏呢！就像你跟妈妈玩捉迷藏一样，其实你心里是想让妈妈来找到你的对不对？' }
              ] },
            { id: 'ai-r16', time: '2026-05-09 10:22', book: '逃家小兔', page: '第4页', scope: 'page', student: '郑小雪', className: '小一班',
              session: [
                { q: '小兔子变成小鸟，妈妈变成什么了？', a: '妈妈变成了一棵大树！不管小鸟飞到哪里，大树都在那里等着它回家～你看，妈妈的爱就像大树一样，永远等着你。' },
                { q: '那小兔子变成帆船呢？', a: '妈妈就变成了风，轻轻推着小帆船往前走～不管小兔子变成什么，妈妈都会变成能陪着它、照顾它的东西呢！' }
              ] },
            { id: 'ai-r17', time: '2026-05-08 16:20', book: '逃家小兔', page: '全文', scope: 'full', student: '郑小雪', className: '小一班',
              session: [
                { q: '最后小兔子还逃不逃了？', a: '不逃啦～小兔子发现不管逃到哪里，妈妈的爱都会追上它，所以它决定乖乖待在妈妈身边。因为和妈妈在一起才是最温暖最安全的呀！' },
                { q: '我也不想离开妈妈', a: '那太好了！妈妈最想就是和你在一起～不管你在哪里，妈妈都会像故事里的兔妈妈一样，永远永远爱着你。' }
              ] },

            // --- 吴小杰 · 我爸爸 · 同日2次 + 跨日2次 ---
            { id: 'ai-r18', time: '2026-05-09 09:10', book: '我爸爸', page: '第1页', scope: 'page', student: '吴小杰', className: '小一班',
              session: [
                { q: '为什么书里说爸爸像大猩猩一样强壮？', a: '因为大猩猩是力气最大的动物之一呀～小朋友觉得爸爸力气特别大，什么都能搬动，就像大猩猩一样厉害！你爸爸力气大不大？' }
              ] },
            { id: 'ai-r19', time: '2026-05-09 09:30', book: '我爸爸', page: '第3页', scope: 'page', student: '吴小杰', className: '小一班',
              session: [
                { q: '爸爸真的会走钢丝吗？', a: '哈哈，走钢丝是杂技演员才会的本领～不过书里是把爸爸比作最厉害的人，什么困难都难不倒他！就像你的爸爸在你心里也是无所不能的超级英雄吧？' },
                { q: '我爸爸会修玩具！', a: '哇，那你的爸爸好厉害！修玩具可不容易哦，要很聪明很有耐心才行。你的爸爸就是你的超级英雄呀～' }
              ] },
            { id: 'ai-r20', time: '2026-05-08 10:15', book: '我爸爸', page: '全文', scope: 'full', student: '吴小杰', className: '小一班',
              session: [
                { q: '书的最后说爸爸很爱我，我也很爱他，我好感动！', a: '是呀～这才是最重要的一句话！不管爸爸像什么，最最关键的是——你们彼此相爱。你有这样的爸爸真幸福呢！' }
              ] },
            { id: 'ai-r21', time: '2026-05-07 14:40', book: '我爸爸', page: '第2页', scope: 'page', student: '吴小杰', className: '小一班',
              session: [
                { q: '爸爸真的什么都不怕吗？连大野狼都不怕？', a: '书里说爸爸像房子一样高大，连大野狼都要躲开他！其实爸爸也会有害怕的时候，但为了保护你，他会变得特别特别勇敢～' }
              ] },

            // --- 陈小华 · 花婆婆 · 同日2次 + 跨日1次 ---
            { id: 'ai-r22', time: '2026-05-10 14:00', book: '花婆婆', page: '第1页', scope: 'page', student: '陈小华', className: '大二班',
              session: [
                { q: '花婆婆小时候住在哪里呀？', a: '花婆婆小时候住在海边的城市，每天能看到蓝蓝的大海和白色的海鸥，特别漂亮～你有没有见过大海呀？' }
              ] },
            { id: 'ai-r23', time: '2026-05-10 14:18', book: '花婆婆', page: '第5页', scope: 'page', student: '陈小华', className: '大二班',
              session: [
                { q: '花婆婆做了第三件事是什么？', a: '就是做一件让世界变得更美丽的事情！花婆婆选择了撒花种子，让到处都开满了漂亮的花。你想想看，你可以做一件什么让世界变美的事呢？' },
                { q: '我可以画一幅漂亮的画！', a: '太棒了！画一幅美丽的画就是让世界变美呀～如果你把画送给朋友，他们看到会开心，世界就又多了一份美丽呢！' }
              ] },
            { id: 'ai-r24', time: '2026-05-09 11:30', book: '花婆婆', page: '全文', scope: 'full', student: '陈小华', className: '大二班',
              session: [
                { q: '花婆婆的爷爷告诉她的三件事她都做到了吗？', a: '都做到了哦～第一件是去很远的地方旅行，第二件是住在海边，第三件是让世界变美丽。花婆婆用了好长好长的时间，但她一件一件全都做到了，真了不起！' }
              ] },

            // --- 黄小龙 · 小蓝和小黄 · 同日2次 + 跨日1次 ---
            { id: 'ai-r25', time: '2026-05-09 16:00', book: '小蓝和小黄', page: '第2页', scope: 'page', student: '黄小龙', className: '大一班',
              session: [
                { q: '小蓝的爸爸妈妈为什么跟小蓝长一样？', a: '因为他们都是蓝色的呀～就像你长得像爸爸妈妈一样，小蓝也长得像它的蓝爸爸妈妈！' }
              ] },
            { id: 'ai-r26', time: '2026-05-09 16:15', book: '小蓝和小黄', page: '全文', scope: 'full', student: '黄小龙', className: '大一班',
              session: [
                { q: '小蓝和小黄变成绿色以后，爸爸妈妈都不认识它们了怎么办？', a: '它们好伤心好伤心，哭啊哭啊，眼泪流啊流，把绿色都哭掉了，又变回了蓝色和黄色！爸爸妈妈终于认出它们了，大家抱在一起，太开心啦！' },
                { q: '如果我变了个样子，妈妈还认识我吗？', a: '一定认识呀！因为妈妈是用心在看你，不是只看外表。不管你穿什么衣服、剪什么头发，妈妈永远都能认出你～' }
              ] },
            { id: 'ai-r27', time: '2026-05-08 09:45', book: '小蓝和小黄', page: '第3页', scope: 'page', student: '黄小龙', className: '大一班',
              session: [
                { q: '颜色混在一起就会变色吗？', a: '是呀～蓝色和黄色抱在一起就变绿色，红色和黄色抱在一起就变橙色。你可以试试用颜料混一混，会有好多好多惊喜哦！' }
              ] },

            // --- 林小燕 · 猜猜我有多爱你 · 同日2次 + 跨日1次 ---
            { id: 'ai-r28', time: '2026-05-08 10:20', book: '猜猜我有多爱你', page: '第4页', scope: 'page', student: '林小燕', className: '大二班',
              session: [
                { q: '小兔子说我爱你像小河一样长是什么意思？', a: '就是爱像河水一样，一直流啊流，流到好远好远的地方，没有尽头～小兔子在说它的爱是永远不会停下来的！' }
              ] },
            { id: 'ai-r29', time: '2026-05-08 10:38', book: '猜猜我有多爱你', page: '全文', scope: 'full', student: '林小燕', className: '大二班',
              session: [
                { q: '小兔子每次说爱大兔子，大兔子总是更多，小兔子会不会难过？', a: '不会哦～小兔子虽然比不过大兔子，但它很开心，因为它知道大兔子那么那么爱它！其实爱不是比赛，只是想告诉对方"我很爱你"而已～' },
                { q: '我也想跟我的好朋友比谁更爱谁！', a: '好主意！你可以跟好朋友说"我爱你有从教室到操场那么远"，说不定他会说"我爱你有从教室到家那么远"呢！比来比去，你们都会发现对方好爱你～' }
              ] },
            { id: 'ai-r30', time: '2026-05-07 15:50', book: '猜猜我有多爱你', page: '第2页', scope: 'page', student: '林小燕', className: '大二班',
              session: [
                { q: '大兔子把小兔子举到头顶是什么意思？', a: '大兔子在说"我爱你有你举起来那么高"！因为大兔子比小兔子高大很多，所以一举就举到好高好高，这就是大人比小朋友多的那一点点爱呀～' }
              ] }
        ];

        // 固定 12 条原始精彩对话（保留之前的真实剧本）
        const seedHistory = [
            { id: 'ai-001', time: '2026-05-11 10:32', book: '猜猜我有多爱你', page: '第3页', scope: 'page', student: '张小明', className: '大一班',
              session: [
                { q: '为什么小兔子要把手臂张得开开的呀？', a: '因为小兔子想用自己的小身体告诉大兔子，他对爸爸的爱有这么多——大到张开手都装不下呢～你试试也张开手抱一抱爸爸妈妈，他们一定能感受到你的爱！' },
                { q: '那他是把手张多开呀？', a: '他把小手臂张得像小翅膀一样开开的，开到不能再开啦！就像我们想要拥抱整个世界一样～' }
              ] },
            { id: 'ai-002', time: '2026-05-11 10:18', book: '好饿的毛毛虫', page: '全文', scope: 'full', student: '李小红', className: '大一班',
              session: [
                { q: '毛毛虫为什么会变成蝴蝶？', a: '小朋友你观察得真仔细！毛毛虫吃了很多很多东西，长大了就会找一片叶子，结一个茧，在里面静静地睡觉、慢慢地变。等它醒来，就像变魔法一样，长出了漂亮的翅膀，变成了蝴蝶啦！' },
                { q: '那它在茧里面会害怕吗？', a: '不会哦～茧就像毛毛虫的小睡袋，又温暖又安全，它在里面舒舒服服地睡觉，等着惊喜的那一天～' },
                { q: '我也想看毛毛虫', a: '可以呀！下次去公园的时候，可以让爸爸妈妈带你找找树叶背面，说不定就能看到正在悄悄长大的小毛毛虫呢～' }
              ] },
            { id: 'ai-003', time: '2026-05-11 09:55', book: '彩虹色的花', page: '第2页', scope: 'page', student: '王小刚', className: '大一班',
              session: [
                { q: '花朵为什么要把自己的花瓣送给别人？', a: '因为彩虹色的花朵心里装满了爱呀～它觉得能帮到别人是一件特别开心的事情。就像你把好吃的零食分给好朋友一样，分享让大家都很快乐！' }
              ] },
            { id: 'ai-004', time: '2026-05-11 09:40', book: '爱心树', page: '全文', scope: 'full', student: '赵小丽', className: '大二班',
              session: [
                { q: '大树为什么要把所有东西都给那个小男孩？', a: '因为大树非常非常爱那个小男孩，就像妈妈爱你一样，愿意把最好的东西都送给你～这是一种很温柔很温柔的爱哦。' },
                { q: '那大树自己什么都没有了，会难过吗？', a: '小朋友你想得真好～大树虽然只剩下一个树墩，但它看到自己最爱的小男孩开心，它就觉得自己也很幸福啦。这就是爱的力量～' }
              ] },
            { id: 'ai-005', time: '2026-05-11 09:22', book: '猜猜我有多爱你', page: '第1页', scope: 'page', student: '陈小华', className: '大二班',
              session: [
                { q: '为什么小兔子要抓住大兔子的耳朵呀？', a: '因为小兔子要睡觉啦，想要紧紧地抓着大兔子的耳朵，就像你睡觉的时候要抱着喜欢的小玩偶一样，会觉得特别安心～' }
              ] },
            { id: 'ai-006', time: '2026-05-10 16:18', book: '母鸡萝丝去散步', page: '全文', scope: 'full', student: '刘小芳', className: '中一班',
              session: [
                { q: '狐狸为什么一直跟着萝丝？', a: '因为狐狸饿啦，它想偷偷地抓住萝丝当晚餐～不过呀，狐狸总是不小心摔跟头，特别好笑！' },
                { q: '萝丝看到狐狸了吗？', a: '没有哦～萝丝一直悠闲地散步，根本没有发现狐狸在身后呢。狐狸却总是被各种东西绊倒，是不是很有趣？' }
              ] },
            { id: 'ai-007', time: '2026-05-10 15:55', book: '花婆婆', page: '第4页', scope: 'page', student: '孙小伟', className: '中一班',
              session: [
                { q: '花婆婆为什么要撒花种子？', a: '因为花婆婆想让这个世界变得更美丽呀～她相信，如果每个人都做一件让世界变美的事，世界就会越来越温暖、越来越美好。你想做哪件让世界变美的事呀？' }
              ] },
            { id: 'ai-008', time: '2026-05-10 15:30', book: '团圆', page: '全文', scope: 'full', student: '周小琳', className: '中二班',
              session: [
                { q: '爸爸为什么过年才回家？', a: '因为爸爸在很远的地方工作，要靠他赚钱养家。虽然平时见不到，但过年的时候爸爸会回来和我们团圆，就像故事里一样～' },
                { q: '小朋友会等爸爸回来吗？', a: '会哦～就像故事里的毛毛一样，把对爸爸的思念都藏在心里，等着团圆的那一天。' }
              ] },
            { id: 'ai-009', time: '2026-05-10 14:48', book: '我爸爸', page: '第2页', scope: 'page', student: '吴小杰', className: '小一班',
              session: [
                { q: '为什么爸爸什么都不怕？', a: '因为爸爸长大了，有很多本领～在小朋友眼里，爸爸就是最勇敢、最厉害的超级英雄哦！你的爸爸最厉害的地方是什么呀？' }
              ] },
            { id: 'ai-010', time: '2026-05-10 14:25', book: '逃家小兔', page: '第3页', scope: 'page', student: '郑小雪', className: '小一班',
              session: [
                { q: '小兔子为什么要变成鱼跑走？', a: '小兔子和妈妈在玩一个特别好玩的游戏呀～他变成什么，妈妈就变成能找到他的东西。你看，不管小兔子变成什么，妈妈的爱总能找到他～' },
                { q: '那妈妈变成了什么？', a: '妈妈变成了一个钓鱼的人，握着长长的钓竿，永远都能找到她的小兔子呢～是不是很温暖？' }
              ] },
            { id: 'ai-011', time: '2026-05-10 11:12', book: '小蓝和小黄', page: '全文', scope: 'full', student: '黄小龙', className: '大一班',
              session: [
                { q: '小蓝和小黄抱在一起为什么变绿了？', a: '因为蓝色和黄色是好朋友呀～它们紧紧拥抱的时候，会变成一种新的颜色——绿色！就像我们把颜料混在一起一样，会有奇妙的变化哦。' }
              ] },
            { id: 'ai-012', time: '2026-05-09 16:40', book: '猜猜我有多爱你', page: '全文', scope: 'full', student: '林小燕', className: '大二班',
              session: [
                { q: '小兔子最后说爱大兔子有多远？', a: '小兔子说，它爱大兔子一直到——月亮——那里。月亮非常非常远，所以这是非常非常大的爱呀！' },
                { q: '那大兔子爱小兔子有多远呢？', a: '大兔子悄悄地告诉小兔子：我爱你，一直到月亮——再绕回来这么远～是不是更远啦？这是爸爸妈妈对小朋友深深的爱。' },
                { q: '我也要这么爱妈妈', a: '好棒呀！下次见到妈妈，可以紧紧抱住她，告诉她"我爱你一直到月亮再绕回来"，妈妈一定会特别开心的～' }
              ] }
        ];

        // 自动生成更多历史对话（覆盖 2026-03-01 ~ 2026-05-08，每天 4-9 条）
        const generated = [];
        let idCounter = 100;
        const startDate = new Date(2026, 2, 1);  // 3月1日
        const endDate = new Date(2026, 4, 8);    // 5月8日
        const cursor = new Date(startDate);
        while (cursor <= endDate) {
            const dayKey = cursor.getDate();
            const monthKey = cursor.getMonth() + 1;
            const day = cursor.getDay();
            // 工作日 6-9 条，周末 4-6 条
            const dailyCount = (day === 0 || day === 6) ? 4 + (dayKey % 3) : 6 + (dayKey % 4);
            for (let i = 0; i < dailyCount; i++) {
                const studentIdx = (dayKey * 7 + i * 3 + monthKey * 5) % students.length;
                const bookIdx = (dayKey * 5 + i * 2 + monthKey * 3) % books.length;
                const isFull = (dayKey + i) % 4 === 0;
                const pageNum = isFull ? '全文' : `第${1 + ((dayKey + i) % 5)}页`;
                const hour = 9 + (i + (dayKey % 3)) % 9;
                const min = (i * 11 + dayKey * 3) % 60;
                const time = `${cursor.getFullYear()}-${String(monthKey).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                const stu = students[studentIdx];
                const book = books[bookIdx];
                const turnsCount = 1 + ((dayKey + i) % 4); // 1-4 轮
                const qaStart = (dayKey * 3 + i + monthKey) % qaPool.length;
                const session = [];
                for (let t = 0; t < turnsCount; t++) {
                    const qa = qaPool[(qaStart + t * 2) % qaPool.length];
                    session.push({ q: qa.q, a: qa.a });
                }
                generated.push({
                    id: `ai-${++idCounter}`, time, book, page: pageNum,
                    scope: isFull ? 'full' : 'page',
                    student: stu.name, className: stu.className,
                    session
                });
            }
            cursor.setDate(cursor.getDate() + 1);
        }

        const history = [...seedHistory, ...repeatHistory, ...generated]
            .sort((a, b) => b.time.localeCompare(a.time));

        // 派生 summary
        const totalChats = history.length;
        const totalBooks = new Set(history.map(h => h.book)).size;
        const activeStudents = new Set(history.map(h => h.student)).size;
        const totalTurns = history.reduce((sum, h) => sum + (h.session?.length || 0), 0);
        const avgTurns = (totalTurns / Math.max(history.length, 1)).toFixed(1);

        // 派生 bookInteractions（按 book 统计 top10）
        const bookCount = new Map();
        history.forEach(h => bookCount.set(h.book, (bookCount.get(h.book) || 0) + 1));
        const bookInteractions = [...bookCount.entries()]
            .map(([book, count]) => ({ book, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // 派生 hotQuestions（按 q 统计 top10）
        const qCount = new Map();
        history.forEach(h => (h.session || []).forEach(t => {
            if (t.q) qCount.set(t.q, (qCount.get(t.q) || 0) + 1);
        }));
        const hotQuestions = [...qCount.entries()]
            .map(([q, count]) => ({ q, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        return {
            summary: {
                totalChats,
                totalBooks,
                activeStudents,
                avgTurnsPerSession: avgTurns
            },
            hotQuestions,
            bookInteractions,
            history
        };
    })()
};
