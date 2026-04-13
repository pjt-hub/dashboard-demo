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
