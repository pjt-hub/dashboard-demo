# -*- coding: utf-8 -*-
"""
集成脚本：将远程平台功能嵌入到dashboard项目中
新增"园所综合数据统计"模块（schoolData），包含7个子标签页
"""
import os

BASE_DIR = r"D:\绘本阅读机器人\dashboard"

# ============================================================
# 1. 读取现有文件
# ============================================================
def read_file(filename):
    path = os.path.join(BASE_DIR, filename)
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filename, content):
    path = os.path.join(BASE_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# ============================================================
# 2. 修改 index.html - 添加导航和页面模板
# ============================================================
def patch_index_html():
    html = read_file('index.html')
    
    # 2a. 在导航栏中添加"园所综合数据统计"按钮（在"高级数据分析"按钮之后）
    nav_insert_marker = 'data-page="advancedAnalysis"'
    nav_marker_pos = html.find(nav_insert_marker)
    if nav_marker_pos == -1:
        print("WARNING: Could not find advancedAnalysis nav button")
        return
    
    # 找到该按钮的结束标签 </button>
    btn_end = html.find('</button>', nav_marker_pos)
    if btn_end == -1:
        print("WARNING: Could not find closing </button> after advancedAnalysis")
        return
    btn_end += len('</button>')
    
    school_data_nav = '''
                    <button class="nav-btn flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-700/50" data-page="schoolData">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        园所综合数据
                    </button>'''
    
    html = html[:btn_end] + school_data_nav + html[btn_end:]
    
    # 2b. 在页面模板区域添加 schoolData 模板（在 </main> 之后的模板区域）
    # 找到最后一个 </template> 标签
    last_template_end = html.rfind('</template>')
    if last_template_end == -1:
        print("WARNING: Could not find any </template> tag")
        return
    last_template_end += len('</template>')
    
    school_data_template = '''

    <!-- 园所综合数据统计页面模板 -->
    <template id="schoolData-template">
        <div class="school-data-page">
            <!-- 页面头部 -->
            <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-2xl font-bold text-white">园所综合数据统计</h1>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-slate-400" id="sd-kindergarten-name">淘云实验园</span>
                    </div>
                </div>
                <div class="text-sm text-slate-500">首页 &gt; 园所综合数据统计</div>
            </div>

            <!-- 子标签页导航 -->
            <div class="mb-6 bg-slate-800/40 backdrop-blur rounded-2xl p-2 border border-slate-700/50">
                <div class="flex flex-wrap gap-2">
                    <button class="sd-tab-btn active-sd-tab px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-blue-500/20 text-blue-400 border border-blue-500/30" data-sd-tab="sdOverview">数据概述</button>
                    <button class="sd-tab-btn px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent" data-sd-tab="sdActivity">绘本活动</button>
                    <button class="sd-tab-btn px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent" data-sd-tab="sdBooks">绘本</button>
                    <button class="sd-tab-btn px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent" data-sd-tab="sdDevice">设备使用</button>
                    <button class="sd-tab-btn px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent" data-sd-tab="sdClass">班级</button>
                    <button class="sd-tab-btn px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent" data-sd-tab="sdTeacher">教师</button>
                    <button class="sd-tab-btn px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent" data-sd-tab="sdStudent">幼儿</button>
                </div>
            </div>

            <!-- 子标签页内容区域 -->
            <div id="sd-tab-content">
                <!-- 动态渲染 -->
            </div>
        </div>
    </template>'''
    
    html = html[:last_template_end] + school_data_template + html[last_template_end:]
    
    write_file('index.html', html)
    print("index.html patched successfully")


# ============================================================
# 3. 修改 mockData.js - 添加园所综合数据
# ============================================================
def patch_mock_data():
    data = read_file('js/mockData.js')
    
    # 在文件末尾的最后一个 }; 之前插入新数据
    # 找到 MockData 对象的结尾
    insert_marker = "// 推荐理由映射"
    pos = data.find(insert_marker)
    if pos == -1:
        # 尝试在文件末尾插入
        pos = data.rfind('};')
        if pos == -1:
            print("WARNING: Could not find insertion point in mockData.js")
            return
    
    new_data = '''
    // ========== 园所综合数据统计 ==========
    schoolData: {
        // 数据概述
        overview: {
            activityTotal: 212,
            activityDuration: 99.38,
            bookTotal: 75,
            bookReadCount: 147,
            bookReadDuration: 7.37,
            deviceTotal: 13,
            deviceUseCount: 632,
            deviceUseDuration: 292.32,
            classTotal: 18,
            teacherTotal: 42,
            studentTotal: 249,
            bookByType: [
                { type: '日常生活', count: 44, duration: 2.03 },
                { type: '科普百科', count: 9, duration: 0.45 },
                { type: '语言学习', count: 4, duration: 0.32 },
                { type: '国学文化', count: 14, duration: 0.65 },
                { type: '情商品格', count: 20, duration: 1.11 },
                { type: '人际交往', count: 60, duration: 3.16 }
            ]
        },
        // 绘本活动列表
        activities: [
            { id: 1, startTime: '2025-03-01 09:00', endTime: '2025-03-01 09:35', teacher: '张晓梅', className: '大一班', studentCount: 32, bookName: '永远永远爱你' },
            { id: 2, startTime: '2025-03-01 09:40', endTime: '2025-03-01 10:10', teacher: '李文华', className: '大二班', studentCount: 28, bookName: '团圆' },
            { id: 3, startTime: '2025-03-01 10:20', endTime: '2025-03-01 10:55', teacher: '王秀英', className: '中一班', studentCount: 25, bookName: '我爸爸' },
            { id: 4, startTime: '2025-03-02 09:00', endTime: '2025-03-02 09:30', teacher: '赵丽', className: '小一班', studentCount: 22, bookName: '猜猜我有多爱你' },
            { id: 5, startTime: '2025-03-02 09:35', endTime: '2025-03-02 10:05', teacher: '陈静', className: '大三班', studentCount: 30, bookName: '母鸡萝丝去散步' },
            { id: 6, startTime: '2025-03-02 10:15', endTime: '2025-03-02 10:50', teacher: '张晓梅', className: '大一班', studentCount: 32, bookName: '花婆婆' },
            { id: 7, startTime: '2025-03-03 09:00', endTime: '2025-03-03 09:40', teacher: '李文华', className: '大二班', studentCount: 28, bookName: '哇哦，鳄鱼也想要惊喜' },
            { id: 8, startTime: '2025-03-03 09:45', endTime: '2025-03-03 10:20', teacher: '王秀英', className: '中一班', studentCount: 25, bookName: '爱跳舞的小龙' },
            { id: 9, startTime: '2025-03-03 10:30', endTime: '2025-03-03 11:00', teacher: '赵丽', className: '小一班', studentCount: 22, bookName: '胆小鬼威利' },
            { id: 10, startTime: '2025-03-04 09:00', endTime: '2025-03-04 09:35', teacher: '陈静', className: '大三班', studentCount: 30, bookName: '古利和古拉' },
            { id: 11, startTime: '2025-03-04 09:40', endTime: '2025-03-04 10:15', teacher: '张晓梅', className: '大一班', studentCount: 32, bookName: '永远永远爱你' },
            { id: 12, startTime: '2025-03-04 10:20', endTime: '2025-03-04 10:55', teacher: '李文华', className: '大二班', studentCount: 28, bookName: '团圆' },
            { id: 13, startTime: '2025-03-05 09:00', endTime: '2025-03-05 09:30', teacher: '王秀英', className: '中一班', studentCount: 25, bookName: '我爸爸' },
            { id: 14, startTime: '2025-03-05 09:35', endTime: '2025-03-05 10:10', teacher: '赵丽', className: '小一班', studentCount: 22, bookName: '猜猜我有多爱你' },
            { id: 15, startTime: '2025-03-05 10:15', endTime: '2025-03-05 10:50', teacher: '陈静', className: '大三班', studentCount: 30, bookName: '永远永远爱你' },
            { id: 16, startTime: '2025-03-06 09:00', endTime: '2025-03-06 09:35', teacher: '张晓梅', className: '大一班', studentCount: 32, bookName: '母鸡萝丝去散步' },
            { id: 17, startTime: '2025-03-06 09:40', endTime: '2025-03-06 10:10', teacher: '李文华', className: '大二班', studentCount: 28, bookName: '花婆婆' },
            { id: 18, startTime: '2025-03-06 10:20', endTime: '2025-03-06 10:55', teacher: '王秀英', className: '中一班', studentCount: 25, bookName: '哇哦，鳄鱼也想要惊喜' },
            { id: 19, startTime: '2025-03-07 09:00', endTime: '2025-03-07 09:30', teacher: '赵丽', className: '小一班', studentCount: 22, bookName: '永远永远爱你' },
            { id: 20, startTime: '2025-03-07 09:35', endTime: '2025-03-07 10:10', teacher: '陈静', className: '大三班', studentCount: 30, bookName: '团圆' },
            { id: 21, startTime: '2025-03-07 10:15', endTime: '2025-03-07 10:50', teacher: '张晓梅', className: '大一班', studentCount: 32, bookName: '我爸爸' },
            { id: 22, startTime: '2025-03-08 09:00', endTime: '2025-03-08 09:35', teacher: '李文华', className: '大二班', studentCount: 28, bookName: '猜猜我有多爱你' },
            { id: 23, startTime: '2025-03-08 09:40', endTime: '2025-03-08 10:10', teacher: '王秀英', className: '中一班', studentCount: 25, bookName: '永远永远爱你' },
            { id: 24, startTime: '2025-03-08 10:20', endTime: '2025-03-08 10:55', teacher: '赵丽', className: '小一班', studentCount: 22, bookName: '团圆' },
            { id: 25, startTime: '2025-03-09 09:00', endTime: '2025-03-09 09:35', teacher: '陈静', className: '大三班', studentCount: 30, bookName: '永远永远爱你' }
        ],
        // 绘本库
        books: [
            { id: 1, name: '永远永远爱你', author: '宫西达也', type: '情商品格', readCount: 19, readDuration: '1.2h', cover: '🦕' },
            { id: 2, name: '团圆', author: '余丽琼', type: '国学文化', readCount: 11, readDuration: '0.8h', cover: '🏮' },
            { id: 3, name: '我爸爸', author: '安东尼·布朗', type: '人际交往', readCount: 9, readDuration: '0.6h', cover: '👨' },
            { id: 4, name: '猜猜我有多爱你', author: '山姆·麦克布雷尼', type: '情商品格', readCount: 8, readDuration: '0.5h', cover: '🐰' },
            { id: 5, name: '哇哦，鳄鱼也想要惊喜', author: '乔尼·兰伯特', type: '日常生活', readCount: 7, readDuration: '0.4h', cover: '🐊' },
            { id: 6, name: '母鸡萝丝去散步', author: '佩特·哈群斯', type: '语言学习', readCount: 5, readDuration: '0.3h', cover: '🐔' },
            { id: 7, name: '花婆婆', author: '芭芭拉·库尼', type: '日常生活', readCount: 4, readDuration: '0.25h', cover: '🌸' },
            { id: 8, name: '爱跳舞的小龙', author: '乔·洛奇', type: '情商品格', readCount: 3, readDuration: '0.2h', cover: '🐉' },
            { id: 9, name: '胆小鬼威利', author: '安东尼·布朗', type: '情商品格', readCount: 3, readDuration: '0.2h', cover: '🐵' },
            { id: 10, name: '古利和古拉', author: '中川李枝子', type: '日常生活', readCount: 3, readDuration: '0.2h', cover: '🐭' },
            { id: 11, name: '大卫不可以', author: '大卫·香农', type: '日常生活', readCount: 6, readDuration: '0.35h', cover: '👦' },
            { id: 12, name: '好饿的毛毛虫', author: '艾瑞·卡尔', type: '科普百科', readCount: 5, readDuration: '0.3h', cover: '🐛' },
            { id: 13, name: '三字经', author: '王应麟', type: '国学文化', readCount: 4, readDuration: '0.25h', cover: '📜' },
            { id: 14, name: '小蝌蚪找妈妈', author: '方惠珍', type: '科普百科', readCount: 3, readDuration: '0.2h', cover: '🐸' },
            { id: 15, name: '逃家小兔', author: '玛格丽特·怀兹·布朗', type: '人际交往', readCount: 8, readDuration: '0.5h', cover: '🐇' }
        ],
        // 设备使用数据
        devices: [
            { id: 1, name: 'AI绘本机-A01', location: '大一班', useCount: 86, useDuration: 42.5, status: '在线', lastUse: '2025-03-09 10:30' },
            { id: 2, name: 'AI绘本机-A02', location: '大二班', useCount: 72, useDuration: 35.8, status: '在线', lastUse: '2025-03-09 10:15' },
            { id: 3, name: 'AI绘本机-A03', location: '中一班', useCount: 65, useDuration: 31.2, status: '在线', lastUse: '2025-03-09 09:50' },
            { id: 4, name: 'AI绘本机-A04', location: '小一班', useCount: 58, useDuration: 28.6, status: '在线', lastUse: '2025-03-09 09:30' },
            { id: 5, name: 'AI绘本机-A05', location: '大三班', useCount: 54, useDuration: 26.4, status: '离线', lastUse: '2025-03-08 16:20' },
            { id: 6, name: 'AI绘本机-B01', location: '中二班', useCount: 48, useDuration: 23.1, status: '在线', lastUse: '2025-03-09 10:00' },
            { id: 7, name: 'AI绘本机-B02', location: '小二班', useCount: 45, useDuration: 21.8, status: '在线', lastUse: '2025-03-09 09:45' },
            { id: 8, name: 'AI绘本机-B03', location: '大四班', useCount: 42, useDuration: 20.5, status: '在线', lastUse: '2025-03-09 09:20' },
            { id: 9, name: 'AI绘本机-C01', location: '阅读室1', useCount: 52, useDuration: 25.3, status: '在线', lastUse: '2025-03-09 10:25' },
            { id: 10, name: 'AI绘本机-C02', location: '阅读室2', useCount: 38, useDuration: 18.6, status: '离线', lastUse: '2025-03-07 15:40' },
            { id: 11, name: 'AI绘本机-C03', location: '阅读室3', useCount: 32, useDuration: 15.2, status: '在线', lastUse: '2025-03-09 09:10' },
            { id: 12, name: 'AI绘本机-D01', location: '多功能厅', useCount: 25, useDuration: 12.8, status: '在线', lastUse: '2025-03-08 14:30' },
            { id: 13, name: 'AI绘本机-D02', location: '图书馆', useCount: 15, useDuration: 10.5, status: '维护中', lastUse: '2025-03-06 11:00' }
        ],
        // 班级数据
        classes: [
            { id: 1, name: '大一班', teacherName: '张晓梅', studentCount: 35, activityCount: 42, readCount: 156, avgDuration: 28.5 },
            { id: 2, name: '大二班', teacherName: '李文华', studentCount: 32, activityCount: 38, readCount: 142, avgDuration: 26.8 },
            { id: 3, name: '大三班', teacherName: '陈静', studentCount: 30, activityCount: 35, readCount: 138, avgDuration: 25.2 },
            { id: 4, name: '大四班', teacherName: '周芳', studentCount: 28, activityCount: 30, readCount: 125, avgDuration: 24.6 },
            { id: 5, name: '中一班', teacherName: '王秀英', studentCount: 28, activityCount: 28, readCount: 118, avgDuration: 23.8 },
            { id: 6, name: '中二班', teacherName: '刘敏', studentCount: 26, activityCount: 25, readCount: 105, avgDuration: 22.5 },
            { id: 7, name: '中三班', teacherName: '孙丽', studentCount: 25, activityCount: 22, readCount: 98, avgDuration: 21.2 },
            { id: 8, name: '小一班', teacherName: '赵丽', studentCount: 22, activityCount: 20, readCount: 85, avgDuration: 20.5 },
            { id: 9, name: '小二班', teacherName: '吴婷', studentCount: 20, activityCount: 18, readCount: 78, avgDuration: 19.8 },
            { id: 10, name: '小小班', teacherName: '郑雪', studentCount: 18, activityCount: 15, readCount: 65, avgDuration: 18.2 }
        ],
        // 教师数据
        teachers: [
            { id: 1, name: '张晓梅', className: '大一班', activityCount: 42, totalDuration: 28.5, studentCount: 35, bookCount: 18, avgRating: 4.9 },
            { id: 2, name: '李文华', className: '大二班', activityCount: 38, totalDuration: 26.8, studentCount: 32, bookCount: 16, avgRating: 4.8 },
            { id: 3, name: '陈静', className: '大三班', activityCount: 35, totalDuration: 25.2, studentCount: 30, bookCount: 15, avgRating: 4.7 },
            { id: 4, name: '王秀英', className: '中一班', activityCount: 28, totalDuration: 23.8, studentCount: 28, bookCount: 14, avgRating: 4.8 },
            { id: 5, name: '赵丽', className: '小一班', activityCount: 20, totalDuration: 20.5, studentCount: 22, bookCount: 12, avgRating: 4.6 },
            { id: 6, name: '周芳', className: '大四班', activityCount: 30, totalDuration: 24.6, studentCount: 28, bookCount: 13, avgRating: 4.7 },
            { id: 7, name: '刘敏', className: '中二班', activityCount: 25, totalDuration: 22.5, studentCount: 26, bookCount: 11, avgRating: 4.5 },
            { id: 8, name: '孙丽', className: '中三班', activityCount: 22, totalDuration: 21.2, studentCount: 25, bookCount: 10, avgRating: 4.6 },
            { id: 9, name: '吴婷', className: '小二班', activityCount: 18, totalDuration: 19.8, studentCount: 20, bookCount: 9, avgRating: 4.5 },
            { id: 10, name: '郑雪', className: '小小班', activityCount: 15, totalDuration: 18.2, studentCount: 18, bookCount: 8, avgRating: 4.4 }
        ],
        // 幼儿数据
        students: [
            { id: 1, name: '小明', className: '大一班', readCount: 28, readDuration: '4.2h', favoriteType: '情商品格', lastActive: '2025-03-09', level: '阅读达人' },
            { id: 2, name: '小红', className: '大一班', readCount: 25, readDuration: '3.8h', favoriteType: '人际交往', lastActive: '2025-03-09', level: '阅读达人' },
            { id: 3, name: '小刚', className: '大二班', readCount: 22, readDuration: '3.5h', favoriteType: '科普百科', lastActive: '2025-03-08', level: '阅读小能手' },
            { id: 4, name: '小丽', className: '大二班', readCount: 20, readDuration: '3.2h', favoriteType: '日常生活', lastActive: '2025-03-09', level: '阅读小能手' },
            { id: 5, name: '小华', className: '中一班', readCount: 18, readDuration: '2.8h', favoriteType: '国学文化', lastActive: '2025-03-08', level: '阅读新星' },
            { id: 6, name: '小芳', className: '中一班', readCount: 16, readDuration: '2.5h', favoriteType: '语言学习', lastActive: '2025-03-07', level: '阅读新星' },
            { id: 7, name: '小强', className: '小一班', readCount: 15, readDuration: '2.3h', favoriteType: '情商品格', lastActive: '2025-03-09', level: '阅读新星' },
            { id: 8, name: '小美', className: '大三班', readCount: 24, readDuration: '3.6h', favoriteType: '人际交往', lastActive: '2025-03-09', level: '阅读达人' },
            { id: 9, name: '小龙', className: '大三班', readCount: 21, readDuration: '3.3h', favoriteType: '科普百科', lastActive: '2025-03-08', level: '阅读小能手' },
            { id: 10, name: '小雪', className: '大四班', readCount: 19, readDuration: '3.0h', favoriteType: '日常生活', lastActive: '2025-03-09', level: '阅读小能手' },
            { id: 11, name: '小杰', className: '中二班', readCount: 14, readDuration: '2.1h', favoriteType: '情商品格', lastActive: '2025-03-07', level: '阅读新星' },
            { id: 12, name: '小琳', className: '小二班', readCount: 12, readDuration: '1.8h', favoriteType: '人际交往', lastActive: '2025-03-08', level: '阅读种子' }
        ]
    },

'''
    
    data = data.replace(insert_marker, new_data + '\n    ' + insert_marker)
    write_file('js/mockData.js', data)
    print("mockData.js patched successfully")


# ============================================================
# 4. 创建 schoolData.js - 园所综合数据统计模块
# ============================================================
def create_school_data_js():
    content = r'''// 园所综合数据统计模块
const SchoolData = {
    currentTab: 'sdOverview',
    activityPage: 1,
    activityPageSize: 10,
    bookPage: 1,
    bookPageSize: 10,
    studentPage: 1,
    studentPageSize: 10,

    // 筛选状态
    filters: {
        activity: { dateEnd: '', className: '', teacher: '' },
        book: { name: '', type: '' },
        student: { name: '', className: '' }
    },

    // 初始化
    init() {
        this.bindTabEvents();
        this.renderTab('sdOverview');
    },

    // 绑定标签页切换事件
    bindTabEvents() {
        document.querySelectorAll('.sd-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.sd-tab-btn').forEach(b => {
                    b.classList.remove('active-sd-tab', 'bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
                    b.classList.add('text-slate-400', 'border-transparent');
                });
                e.target.classList.add('active-sd-tab', 'bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
                e.target.classList.remove('text-slate-400', 'border-transparent');
                const tab = e.target.dataset.sdTab;
                this.currentTab = tab;
                this.renderTab(tab);
            });
        });
    },

    // 渲染标签页
    renderTab(tab) {
        const container = document.getElementById('sd-tab-content');
        if (!container) return;
        Charts.dispose();

        switch(tab) {
            case 'sdOverview': this.renderOverview(container); break;
            case 'sdActivity': this.renderActivity(container); break;
            case 'sdBooks': this.renderBooks(container); break;
            case 'sdDevice': this.renderDevice(container); break;
            case 'sdClass': this.renderClass(container); break;
            case 'sdTeacher': this.renderTeacher(container); break;
            case 'sdStudent': this.renderStudent(container); break;
        }
    },

    // ========== 数据概述 ==========
    renderOverview(container) {
        const d = MockData.schoolData.overview;
        container.innerHTML = `
            <!-- 绘本活动概况 -->
            <section class="mb-6">
                <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span class="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full"></span>
                    园所绘本活动概况
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 metric-card">
                        <div class="text-sm text-slate-400 mb-1">绘本活动总次数</div>
                        <div class="text-3xl font-bold text-blue-400">${d.activityTotal}<span class="text-sm text-slate-400 ml-1">次</span></div>
                    </div>
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 metric-card">
                        <div class="text-sm text-slate-400 mb-1">绘本活动总时长</div>
                        <div class="text-3xl font-bold text-emerald-400">${d.activityDuration}<span class="text-sm text-slate-400 ml-1">小时</span></div>
                    </div>
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 metric-card">
                        <div class="text-sm text-slate-400 mb-1">参与活动人次</div>
                        <div class="text-3xl font-bold text-amber-400">191<span class="text-sm text-slate-400 ml-1">人次</span></div>
                    </div>
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 metric-card">
                        <div class="text-sm text-slate-400 mb-1">绘本阅读时长</div>
                        <div class="text-3xl font-bold text-purple-400">${d.bookReadDuration}<span class="text-sm text-slate-400 ml-1">小时</span></div>
                    </div>
                </div>
            </section>

            <!-- 园所绘本概况 -->
            <section class="mb-6">
                <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span class="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-400 rounded-full"></span>
                    园所绘本概况
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                        <div class="text-sm text-slate-400 mb-1">绘本总数</div>
                        <div class="text-2xl font-bold text-white">${d.bookTotal}<span class="text-sm text-slate-400 ml-1">本</span></div>
                    </div>
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                        <div class="text-sm text-slate-400 mb-1">阅读次数</div>
                        <div class="text-2xl font-bold text-white">${d.bookReadCount}<span class="text-sm text-slate-400 ml-1">次</span></div>
                    </div>
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                        <div class="text-sm text-slate-400 mb-1">阅读时长</div>
                        <div class="text-2xl font-bold text-white">${d.bookReadDuration}<span class="text-sm text-slate-400 ml-1">小时</span></div>
                    </div>
                    <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                        <div class="text-sm text-slate-400 mb-1">绘本类型</div>
                        <div class="text-2xl font-bold text-white">6<span class="text-sm text-slate-400 ml-1">种</span></div>
                    </div>
                </div>
                <!-- 按类型分类统计表 -->
                <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                    <h3 class="text-sm font-semibold text-slate-300 mb-3">按类型分类统计</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        ${d.bookByType.map(item => `
                            <div class="bg-slate-700/40 rounded-xl p-3 text-center hover:bg-slate-600/40 transition-colors cursor-pointer">
                                <div class="text-sm font-medium text-white mb-2">${item.type}</div>
                                <div class="text-lg font-bold text-blue-400">${item.count}<span class="text-xs text-slate-400">次</span></div>
                                <div class="text-xs text-slate-400 mt-1">${item.duration}小时</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- 设备概况和基础信息 -->
            <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                    <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span class="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-400 rounded-full"></span>
                        园所设备概况
                    </h2>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-amber-400">${d.deviceTotal}</div>
                            <div class="text-xs text-slate-400 mt-1">设备总数(台)</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-400">${d.deviceUseCount}</div>
                            <div class="text-xs text-slate-400 mt-1">总使用次数</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-emerald-400">${d.deviceUseDuration}</div>
                            <div class="text-xs text-slate-400 mt-1">总使用时长(h)</div>
                        </div>
                    </div>
                    <div id="sd-device-pie-chart" class="h-64 mt-4"></div>
                </div>
                <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                    <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span class="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-400 rounded-full"></span>
                        园所基础信息
                    </h2>
                    <div class="grid grid-cols-3 gap-4 mb-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-400">${d.classTotal}</div>
                            <div class="text-xs text-slate-400 mt-1">班级总数</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-pink-400">${d.teacherTotal}</div>
                            <div class="text-xs text-slate-400 mt-1">教师总数</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-cyan-400">${d.studentTotal}</div>
                            <div class="text-xs text-slate-400 mt-1">幼儿总数</div>
                        </div>
                    </div>
                    <div id="sd-base-info-chart" class="h-64 mt-4"></div>
                </div>
            </section>
        `;

        // 初始化图表
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.initOverviewCharts();
            });
        });
    },

    initOverviewCharts() {
        // 设备使用饼图
        const pieEl = document.getElementById('sd-device-pie-chart');
        if (pieEl) {
            const chart = echarts.init(pieEl);
            const devices = MockData.schoolData.devices;
            const statusCount = { '在线': 0, '离线': 0, '维护中': 0 };
            devices.forEach(d => statusCount[d.status]++);
            chart.setOption({
                backgroundColor: 'transparent',
                tooltip: { trigger: 'item', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', textStyle: { color: '#fff' } },
                legend: { bottom: 0, textStyle: { color: '#94a3b8', fontSize: 12 } },
                series: [{
                    type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
                    itemStyle: { borderRadius: 6, borderColor: '#1e293b', borderWidth: 2 },
                    label: { show: true, color: '#fff', formatter: '{b}: {c}台' },
                    data: [
                        { value: statusCount['在线'], name: '在线', itemStyle: { color: '#22c55e' } },
                        { value: statusCount['离线'], name: '离线', itemStyle: { color: '#ef4444' } },
                        { value: statusCount['维护中'], name: '维护中', itemStyle: { color: '#f59e0b' } }
                    ]
                }]
            });
            Charts.instances.sdDevicePie = chart;
            window.addEventListener('resize', () => chart.resize());
        }

        // 基础信息柱状图
        const barEl = document.getElementById('sd-base-info-chart');
        if (barEl) {
            const chart = echarts.init(barEl);
            const classes = MockData.schoolData.classes;
            chart.setOption({
                backgroundColor: 'transparent',
                tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', textStyle: { color: '#fff' } },
                grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
                xAxis: { type: 'category', data: classes.map(c => c.name), axisLabel: { color: '#94a3b8', fontSize: 11 }, axisLine: { lineStyle: { color: '#334155' } } },
                yAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#1e293b' } } },
                series: [{
                    name: '学生数', type: 'bar', data: classes.map(c => c.studentCount),
                    itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#818cf8' }, { offset: 1, color: '#6366f1' }]), borderRadius: [4, 4, 0, 0] },
                    barWidth: '50%'
                }]
            });
            Charts.instances.sdBaseInfo = chart;
            window.addEventListener('resize', () => chart.resize());
        }
    },

    // ========== 绘本活动 ==========
    renderActivity(container) {
        const data = this.getFilteredActivities();
        const total = data.length;
        const totalPages = Math.ceil(total / this.activityPageSize);
        const start = (this.activityPage - 1) * this.activityPageSize;
        const pageData = data.slice(start, start + this.activityPageSize);
        const classNames = [...new Set(MockData.schoolData.activities.map(a => a.className))];
        const teacherNames = [...new Set(MockData.schoolData.activities.map(a => a.teacher))];

        container.innerHTML = `
            <!-- 筛选器 -->
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 mb-6">
                <div class="flex flex-wrap items-end gap-4">
                    <div>
                        <label class="text-xs text-slate-400 block mb-1">活动结束时间</label>
                        <input type="date" id="sd-act-date" value="${this.filters.activity.dateEnd}" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label class="text-xs text-slate-400 block mb-1">参与班级</label>
                        <select id="sd-act-class" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">全部班级</option>
                            ${classNames.map(c => `<option value="${c}" ${this.filters.activity.className === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="text-xs text-slate-400 block mb-1">教师</label>
                        <select id="sd-act-teacher" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">全部教师</option>
                            ${teacherNames.map(t => `<option value="${t}" ${this.filters.activity.teacher === t ? 'selected' : ''}>${t}</option>`).join('')}
                        </select>
                    </div>
                    <button id="sd-act-search" class="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">查询</button>
                    <button id="sd-act-reset" class="bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg px-4 py-2 transition-colors">重置</button>
                </div>
            </div>

            <!-- 数据表格 -->
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-slate-700/50">
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">序号</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">活动开始时间</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">活动结束时间</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">教师</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">参与班级</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">参与幼儿</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">绘本名称</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pageData.map((item, idx) => `
                                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors table-row-hover">
                                    <td class="px-4 py-3 text-sm text-slate-300">${start + idx + 1}</td>
                                    <td class="px-4 py-3 text-sm text-slate-300">${item.startTime}</td>
                                    <td class="px-4 py-3 text-sm text-slate-300">${item.endTime}</td>
                                    <td class="px-4 py-3 text-sm text-white font-medium">${item.teacher}</td>
                                    <td class="px-4 py-3 text-sm text-slate-300">${item.className}</td>
                                    <td class="px-4 py-3 text-sm text-slate-300">${item.studentCount}人</td>
                                    <td class="px-4 py-3 text-sm text-slate-300">${item.bookName}</td>
                                    <td class="px-4 py-3 text-center">
                                        <button class="sd-act-view-btn text-blue-400 hover:text-blue-300 text-sm transition-colors" data-id="${item.id}">查看</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <!-- 分页 -->
                <div class="flex items-center justify-between px-4 py-3 bg-slate-700/30">
                    <div class="text-sm text-slate-400">共 ${total} 条记录，每页 ${this.activityPageSize} 条</div>
                    <div class="flex items-center gap-2">
                        <button class="sd-page-btn px-3 py-1 rounded text-sm ${this.activityPage <= 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'}" data-action="prev" ${this.activityPage <= 1 ? 'disabled' : ''}>上一页</button>
                        ${this.renderPageNumbers(this.activityPage, totalPages, 'activity')}
                        <button class="sd-page-btn px-3 py-1 rounded text-sm ${this.activityPage >= totalPages ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'}" data-action="next" ${this.activityPage >= totalPages ? 'disabled' : ''}>下一页</button>
                        <span class="text-sm text-slate-400 ml-2">第 ${this.activityPage}/${totalPages} 页</span>
                    </div>
                </div>
            </div>
        `;

        this.bindActivityEvents(totalPages);
    },

    getFilteredActivities() {
        let data = [...MockData.schoolData.activities];
        const f = this.filters.activity;
        if (f.dateEnd) data = data.filter(a => a.endTime.split(' ')[0] <= f.dateEnd);
        if (f.className) data = data.filter(a => a.className === f.className);
        if (f.teacher) data = data.filter(a => a.teacher === f.teacher);
        return data;
    },

    bindActivityEvents(totalPages) {
        const searchBtn = document.getElementById('sd-act-search');
        const resetBtn = document.getElementById('sd-act-reset');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.filters.activity.dateEnd = document.getElementById('sd-act-date')?.value || '';
                this.filters.activity.className = document.getElementById('sd-act-class')?.value || '';
                this.filters.activity.teacher = document.getElementById('sd-act-teacher')?.value || '';
                this.activityPage = 1;
                this.renderTab('sdActivity');
            });
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.filters.activity = { dateEnd: '', className: '', teacher: '' };
                this.activityPage = 1;
                this.renderTab('sdActivity');
            });
        }
        // 分页
        document.querySelectorAll('.sd-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const page = btn.dataset.page;
                if (action === 'prev' && this.activityPage > 1) this.activityPage--;
                else if (action === 'next' && this.activityPage < totalPages) this.activityPage++;
                else if (page) this.activityPage = parseInt(page);
                this.renderTab('sdActivity');
            });
        });
        // 查看按钮
        document.querySelectorAll('.sd-act-view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.showActivityDetail(id);
            });
        });
    },

    showActivityDetail(id) {
        const item = MockData.schoolData.activities.find(a => a.id === id);
        if (!item) return;
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]';
        modal.id = 'sd-modal';
        modal.innerHTML = `
            <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 max-w-lg w-full mx-4 shadow-2xl">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-white">绘本活动详情</h3>
                    <button id="sd-modal-close" class="text-slate-400 hover:text-white transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="space-y-3">
                    <div class="flex justify-between py-2 border-b border-slate-700/50">
                        <span class="text-slate-400">绘本名称</span><span class="text-white font-medium">${item.bookName}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-slate-700/50">
                        <span class="text-slate-400">授课教师</span><span class="text-white">${item.teacher}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-slate-700/50">
                        <span class="text-slate-400">参与班级</span><span class="text-white">${item.className}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-slate-700/50">
                        <span class="text-slate-400">参与人数</span><span class="text-white">${item.studentCount}人</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-slate-700/50">
                        <span class="text-slate-400">开始时间</span><span class="text-white">${item.startTime}</span>
                    </div>
                    <div class="flex justify-between py-2">
                        <span class="text-slate-400">结束时间</span><span class="text-white">${item.endTime}</span>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-slate-700/40 rounded-xl">
                    <div class="text-sm text-slate-400 mb-2">活动评价</div>
                    <div class="flex items-center gap-1">
                        ${'★'.repeat(4)}${'☆'.repeat(1)}
                        <span class="text-sm text-amber-400 ml-1">4.0</span>
                    </div>
                    <div class="text-xs text-slate-400 mt-1">幼儿参与度高，互动积极</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('sd-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    },

    renderPageNumbers(current, total, type) {
        let html = '';
        const maxShow = 5;
        let start = Math.max(1, current - Math.floor(maxShow / 2));
        let end = Math.min(total, start + maxShow - 1);
        if (end - start < maxShow - 1) start = Math.max(1, end - maxShow + 1);
        for (let i = start; i <= end; i++) {
            html += `<button class="sd-page-btn px-3 py-1 rounded text-sm ${i === current ? 'bg-blue-500 text-white' : 'text-slate-300 hover:bg-slate-600'}" data-page="${i}">${i}</button>`;
        }
        return html;
    },

    // ========== 绘本 ==========
    renderBooks(container) {
        const data = this.getFilteredBooks();
        const total = data.length;
        const totalPages = Math.ceil(total / this.bookPageSize) || 1;
        const start = (this.bookPage - 1) * this.bookPageSize;
        const pageData = data.slice(start, start + this.bookPageSize);
        const types = [...new Set(MockData.schoolData.books.map(b => b.type))];

        container.innerHTML = `
            <!-- 筛选器 -->
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 mb-6">
                <div class="flex flex-wrap items-end gap-4">
                    <div>
                        <label class="text-xs text-slate-400 block mb-1">绘本名称</label>
                        <input type="text" id="sd-book-name" value="${this.filters.book.name}" placeholder="搜索绘本名称" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 w-48">
                    </div>
                    <div>
                        <label class="text-xs text-slate-400 block mb-1">绘本类型</label>
                        <select id="sd-book-type" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">全部类型</option>
                            ${types.map(t => `<option value="${t}" ${this.filters.book.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                        </select>
                    </div>
                    <button id="sd-book-search" class="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">查询</button>
                    <button id="sd-book-reset" class="bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg px-4 py-2 transition-colors">重置</button>
                </div>
            </div>

            <!-- 绘本列表 -->
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-slate-700/50">
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">序号</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">绘本</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">作者</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">类型</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">阅读次数</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">阅读时长</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pageData.map((item, idx) => `
                                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors table-row-hover">
                                    <td class="px-4 py-3 text-sm text-slate-300">${start + idx + 1}</td>
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xl">${item.cover}</span>
                                            <span class="text-sm text-white font-medium">${item.name}</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-slate-300">${item.author}</td>
                                    <td class="px-4 py-3"><span class="text-xs px-2 py-1 rounded-full ${this.getTypeColor(item.type)}">${item.type}</span></td>
                                    <td class="px-4 py-3 text-sm text-center text-white font-medium">${item.readCount}</td>
                                    <td class="px-4 py-3 text-sm text-center text-slate-300">${item.readDuration}</td>
                                    <td class="px-4 py-3 text-center">
                                        <button class="sd-book-view-btn text-blue-400 hover:text-blue-300 text-sm transition-colors" data-id="${item.id}">详情</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between px-4 py-3 bg-slate-700/30">
                    <div class="text-sm text-slate-400">共 ${total} 条记录</div>
                    <div class="flex items-center gap-2">
                        <button class="sd-book-page-btn px-3 py-1 rounded text-sm ${this.bookPage <= 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'}" data-action="prev" ${this.bookPage <= 1 ? 'disabled' : ''}>上一页</button>
                        ${this.renderPageNumbers(this.bookPage, totalPages, 'book')}
                        <button class="sd-book-page-btn px-3 py-1 rounded text-sm ${this.bookPage >= totalPages ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'}" data-action="next" ${this.bookPage >= totalPages ? 'disabled' : ''}>下一页</button>
                    </div>
                </div>
            </div>
        `;

        this.bindBookEvents(totalPages);
    },

    getFilteredBooks() {
        let data = [...MockData.schoolData.books];
        const f = this.filters.book;
        if (f.name) data = data.filter(b => b.name.includes(f.name));
        if (f.type) data = data.filter(b => b.type === f.type);
        return data;
    },

    bindBookEvents(totalPages) {
        document.getElementById('sd-book-search')?.addEventListener('click', () => {
            this.filters.book.name = document.getElementById('sd-book-name')?.value || '';
            this.filters.book.type = document.getElementById('sd-book-type')?.value || '';
            this.bookPage = 1;
            this.renderTab('sdBooks');
        });
        document.getElementById('sd-book-reset')?.addEventListener('click', () => {
            this.filters.book = { name: '', type: '' };
            this.bookPage = 1;
            this.renderTab('sdBooks');
        });
        document.querySelectorAll('.sd-book-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const page = btn.dataset.page;
                if (action === 'prev' && this.bookPage > 1) this.bookPage--;
                else if (action === 'next' && this.bookPage < totalPages) this.bookPage++;
                else if (page) this.bookPage = parseInt(page);
                this.renderTab('sdBooks');
            });
        });
        document.querySelectorAll('.sd-book-view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.showBookDetail(id);
            });
        });
    },

    showBookDetail(id) {
        const item = MockData.schoolData.books.find(b => b.id === id);
        if (!item) return;
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]';
        modal.id = 'sd-modal';
        modal.innerHTML = `
            <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 max-w-lg w-full mx-4 shadow-2xl">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-white">绘本详情</h3>
                    <button id="sd-modal-close" class="text-slate-400 hover:text-white transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center text-3xl">${item.cover}</div>
                    <div>
                        <div class="text-lg font-semibold text-white">${item.name}</div>
                        <div class="text-sm text-slate-400">${item.author}</div>
                        <span class="text-xs px-2 py-1 rounded-full ${this.getTypeColor(item.type)} mt-1 inline-block">${item.type}</span>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-slate-700/40 rounded-xl p-3 text-center">
                        <div class="text-2xl font-bold text-blue-400">${item.readCount}</div>
                        <div class="text-xs text-slate-400">阅读次数</div>
                    </div>
                    <div class="bg-slate-700/40 rounded-xl p-3 text-center">
                        <div class="text-2xl font-bold text-emerald-400">${item.readDuration}</div>
                        <div class="text-xs text-slate-400">阅读时长</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('sd-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    },

    getTypeColor(type) {
        const colors = {
            '日常生活': 'bg-blue-500/20 text-blue-400',
            '科普百科': 'bg-emerald-500/20 text-emerald-400',
            '语言学习': 'bg-amber-500/20 text-amber-400',
            '国学文化': 'bg-red-500/20 text-red-400',
            '情商品格': 'bg-purple-500/20 text-purple-400',
            '人际交往': 'bg-pink-500/20 text-pink-400'
        };
        return colors[type] || 'bg-slate-500/20 text-slate-400';
    },

    // ========== 设备使用 ==========
    renderDevice(container) {
        const devices = MockData.schoolData.devices;
        container.innerHTML = `
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-slate-700/50">
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">序号</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">设备名称</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">所在位置</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">使用次数</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">使用时长(h)</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">状态</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">最后使用</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${devices.map((d, idx) => `
                                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors table-row-hover">
                                    <td class="px-4 py-3 text-sm text-slate-300">${idx + 1}</td>
                                    <td class="px-4 py-3 text-sm text-white font-medium">${d.name}</td>
                                    <td class="px-4 py-3 text-sm text-slate-300">${d.location}</td>
                                    <td class="px-4 py-3 text-sm text-center text-white">${d.useCount}</td>
                                    <td class="px-4 py-3 text-sm text-center text-slate-300">${d.useDuration}</td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="text-xs px-2 py-1 rounded-full ${d.status === '在线' ? 'bg-emerald-500/20 text-emerald-400' : d.status === '离线' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}">${d.status}</span>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-slate-400">${d.lastUse}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="px-4 py-3 bg-slate-700/30 text-sm text-slate-400">共 ${devices.length} 台设备</div>
            </div>

            <!-- 设备使用趋势图 -->
            <div class="mt-6 bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span class="w-2 h-5 bg-amber-500 rounded-full"></span>
                    设备使用排行
                </h3>
                <div id="sd-device-bar-chart" class="h-80"></div>
            </div>
        `;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const el = document.getElementById('sd-device-bar-chart');
                if (el) {
                    const chart = echarts.init(el);
                    const sorted = [...devices].sort((a, b) => b.useCount - a.useCount);
                    chart.setOption({
                        backgroundColor: 'transparent',
                        tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', textStyle: { color: '#fff' } },
                        grid: { left: '3%', right: '4%', bottom: '3%', top: '5%', containLabel: true },
                        xAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#1e293b' } } },
                        yAxis: { type: 'category', data: sorted.map(d => d.name), axisLabel: { color: '#94a3b8', fontSize: 11 }, axisLine: { lineStyle: { color: '#334155' } } },
                        series: [{
                            name: '使用次数', type: 'bar', data: sorted.map(d => d.useCount),
                            itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#f97316' }]), borderRadius: [0, 4, 4, 0] },
                            barWidth: '55%'
                        }]
                    });
                    Charts.instances.sdDeviceBar = chart;
                    window.addEventListener('resize', () => chart.resize());
                }
            });
        });
    },

    // ========== 班级 ==========
    renderClass(container) {
        const classes = MockData.schoolData.classes;
        container.innerHTML = `
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden mb-6">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-slate-700/50">
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">序号</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">班级名称</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">班主任</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">学生人数</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">活动次数</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">阅读次数</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">平均时长(min)</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${classes.map((c, idx) => `
                                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors table-row-hover">
                                    <td class="px-4 py-3 text-sm text-slate-300">${idx + 1}</td>
                                    <td class="px-4 py-3 text-sm text-white font-medium">${c.name}</td>
                                    <td class="px-4 py-3 text-sm text-slate-300">${c.teacherName}</td>
                                    <td class="px-4 py-3 text-sm text-center text-white">${c.studentCount}</td>
                                    <td class="px-4 py-3 text-sm text-center text-blue-400 font-medium">${c.activityCount}</td>
                                    <td class="px-4 py-3 text-sm text-center text-emerald-400 font-medium">${c.readCount}</td>
                                    <td class="px-4 py-3 text-sm text-center text-slate-300">${c.avgDuration}</td>
                                    <td class="px-4 py-3 text-center">
                                        <button class="sd-class-view-btn text-blue-400 hover:text-blue-300 text-sm transition-colors" data-id="${c.id}">查看详情</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="px-4 py-3 bg-slate-700/30 text-sm text-slate-400">共 ${classes.length} 个班级</div>
            </div>

            <!-- 班级活动对比图 -->
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span class="w-2 h-5 bg-blue-500 rounded-full"></span>
                    班级活动数据对比
                </h3>
                <div id="sd-class-compare-chart" class="h-80"></div>
            </div>
        `;

        // 班级详情弹窗
        document.querySelectorAll('.sd-class-view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const c = classes.find(cl => cl.id === id);
                if (!c) return;
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]';
                modal.innerHTML = `
                    <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 max-w-lg w-full mx-4 shadow-2xl">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-white">${c.name} 详情</h3>
                            <button class="sd-modal-close-btn text-slate-400 hover:text-white transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-slate-700/40 rounded-xl p-4 text-center"><div class="text-2xl font-bold text-white">${c.studentCount}</div><div class="text-xs text-slate-400">学生人数</div></div>
                            <div class="bg-slate-700/40 rounded-xl p-4 text-center"><div class="text-2xl font-bold text-blue-400">${c.activityCount}</div><div class="text-xs text-slate-400">活动次数</div></div>
                            <div class="bg-slate-700/40 rounded-xl p-4 text-center"><div class="text-2xl font-bold text-emerald-400">${c.readCount}</div><div class="text-xs text-slate-400">阅读次数</div></div>
                            <div class="bg-slate-700/40 rounded-xl p-4 text-center"><div class="text-2xl font-bold text-amber-400">${c.avgDuration}min</div><div class="text-xs text-slate-400">平均时长</div></div>
                        </div>
                        <div class="mt-4 text-sm text-slate-400">班主任：${c.teacherName}</div>
                    </div>
                `;
                document.body.appendChild(modal);
                modal.querySelector('.sd-modal-close-btn').addEventListener('click', () => modal.remove());
                modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
            });
        });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const el = document.getElementById('sd-class-compare-chart');
                if (el) {
                    const chart = echarts.init(el);
                    chart.setOption({
                        backgroundColor: 'transparent',
                        tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', textStyle: { color: '#fff' } },
                        legend: { data: ['活动次数', '阅读次数'], textStyle: { color: '#94a3b8' }, bottom: 0 },
                        grid: { left: '3%', right: '4%', bottom: '12%', top: '5%', containLabel: true },
                        xAxis: { type: 'category', data: classes.map(c => c.name), axisLabel: { color: '#94a3b8', fontSize: 11 }, axisLine: { lineStyle: { color: '#334155' } } },
                        yAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#1e293b' } } },
                        series: [
                            { name: '活动次数', type: 'bar', data: classes.map(c => c.activityCount), itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] }, barWidth: '30%' },
                            { name: '阅读次数', type: 'bar', data: classes.map(c => c.readCount), itemStyle: { color: '#22c55e', borderRadius: [4, 4, 0, 0] }, barWidth: '30%' }
                        ]
                    });
                    Charts.instances.sdClassCompare = chart;
                    window.addEventListener('resize', () => chart.resize());
                }
            });
        });
    },

    // ========== 教师 ==========
    renderTeacher(container) {
        const teachers = MockData.schoolData.teachers;
        container.innerHTML = `
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden mb-6">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-slate-700/50">
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">序号</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">教师姓名</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">所带班级</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">活动次数</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">总时长(h)</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">学生数</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">使用绘本数</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">平均评分</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${teachers.map((t, idx) => `
                                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors table-row-hover">
                                    <td class="px-4 py-3 text-sm text-slate-300">${idx + 1}</td>
                                    <td class="px-4 py-3 text-sm text-white font-medium">${t.name}</td>
                                    <td class="px-4 py-3 text-sm text-slate-300">${t.className}</td>
                                    <td class="px-4 py-3 text-sm text-center text-blue-400 font-medium">${t.activityCount}</td>
                                    <td class="px-4 py-3 text-sm text-center text-slate-300">${t.totalDuration}</td>
                                    <td class="px-4 py-3 text-sm text-center text-slate-300">${t.studentCount}</td>
                                    <td class="px-4 py-3 text-sm text-center text-slate-300">${t.bookCount}</td>
                                    <td class="px-4 py-3 text-center">
                                        <div class="flex items-center justify-center gap-1">
                                            <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                            <span class="text-sm text-amber-400">${t.avgRating}</span>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="px-4 py-3 bg-slate-700/30 text-sm text-slate-400">共 ${teachers.length} 位教师</div>
            </div>

            <!-- 教师活动排行图 -->
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span class="w-2 h-5 bg-purple-500 rounded-full"></span>
                    教师活动排行
                </h3>
                <div id="sd-teacher-rank-chart" class="h-80"></div>
            </div>
        `;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const el = document.getElementById('sd-teacher-rank-chart');
                if (el) {
                    const chart = echarts.init(el);
                    const sorted = [...teachers].sort((a, b) => b.activityCount - a.activityCount);
                    chart.setOption({
                        backgroundColor: 'transparent',
                        tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#334155', textStyle: { color: '#fff' } },
                        grid: { left: '3%', right: '4%', bottom: '3%', top: '5%', containLabel: true },
                        xAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#1e293b' } } },
                        yAxis: { type: 'category', data: sorted.map(t => t.name), axisLabel: { color: '#94a3b8', fontSize: 12 }, axisLine: { lineStyle: { color: '#334155' } }, inverse: true },
                        series: [{
                            name: '活动次数', type: 'bar', data: sorted.map(t => t.activityCount),
                            itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#a855f7' }, { offset: 1, color: '#ec4899' }]), borderRadius: [0, 4, 4, 0] },
                            barWidth: '55%',
                            label: { show: true, position: 'right', color: '#fff', fontSize: 12 }
                        }]
                    });
                    Charts.instances.sdTeacherRank = chart;
                    window.addEventListener('resize', () => chart.resize());
                }
            });
        });
    },

    // ========== 幼儿 ==========
    renderStudent(container) {
        const data = this.getFilteredStudents();
        const total = data.length;
        const totalPages = Math.ceil(total / this.studentPageSize) || 1;
        const start = (this.studentPage - 1) * this.studentPageSize;
        const pageData = data.slice(start, start + this.studentPageSize);
        const classNames = [...new Set(MockData.schoolData.students.map(s => s.className))];

        container.innerHTML = `
            <!-- 筛选器 -->
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 mb-6">
                <div class="flex flex-wrap items-end gap-4">
                    <div>
                        <label class="text-xs text-slate-400 block mb-1">幼儿姓名</label>
                        <input type="text" id="sd-stu-name" value="${this.filters.student.name}" placeholder="搜索姓名" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 w-40">
                    </div>
                    <div>
                        <label class="text-xs text-slate-400 block mb-1">所在班级</label>
                        <select id="sd-stu-class" class="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">全部班级</option>
                            ${classNames.map(c => `<option value="${c}" ${this.filters.student.className === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </div>
                    <button id="sd-stu-search" class="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg px-4 py-2 transition-colors">查询</button>
                    <button id="sd-stu-reset" class="bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg px-4 py-2 transition-colors">重置</button>
                </div>
            </div>

            <!-- 幼儿列表 -->
            <div class="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-slate-700/50">
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">序号</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">姓名</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">班级</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">阅读次数</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">阅读时长</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">偏好类型</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">阅读等级</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">最近活跃</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pageData.map((s, idx) => `
                                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors table-row-hover">
                                    <td class="px-4 py-3 text-sm text-slate-300">${start + idx + 1}</td>
                                    <td class="px-4 py-3 text-sm text-white font-medium">${s.name}</td>
                                    <td class="px-4 py-3 text-sm text-slate-300">${s.className}</td>
                                    <td class="px-4 py-3 text-sm text-center text-blue-400 font-medium">${s.readCount}</td>
                                    <td class="px-4 py-3 text-sm text-center text-slate-300">${s.readDuration}</td>
                                    <td class="px-4 py-3 text-center"><span class="text-xs px-2 py-1 rounded-full ${this.getTypeColor(s.favoriteType)}">${s.favoriteType}</span></td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="text-xs px-2 py-1 rounded-full ${s.level === '阅读达人' ? 'bg-amber-500/20 text-amber-400' : s.level === '阅读小能手' ? 'bg-blue-500/20 text-blue-400' : s.level === '阅读新星' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}">${s.level}</span>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-slate-400">${s.lastActive}</td>
                                    <td class="px-4 py-3 text-center">
                                        <button class="sd-stu-view-btn text-blue-400 hover:text-blue-300 text-sm transition-colors" data-id="${s.id}">查看</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between px-4 py-3 bg-slate-700/30">
                    <div class="text-sm text-slate-400">共 ${total} 条记录</div>
                    <div class="flex items-center gap-2">
                        <button class="sd-stu-page-btn px-3 py-1 rounded text-sm ${this.studentPage <= 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'}" data-action="prev" ${this.studentPage <= 1 ? 'disabled' : ''}>上一页</button>
                        ${this.renderPageNumbers(this.studentPage, totalPages, 'student')}
                        <button class="sd-stu-page-btn px-3 py-1 rounded text-sm ${this.studentPage >= totalPages ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'}" data-action="next" ${this.studentPage >= totalPages ? 'disabled' : ''}>下一页</button>
                    </div>
                </div>
            </div>
        `;

        this.bindStudentEvents(totalPages);
    },

    getFilteredStudents() {
        let data = [...MockData.schoolData.students];
        const f = this.filters.student;
        if (f.name) data = data.filter(s => s.name.includes(f.name));
        if (f.className) data = data.filter(s => s.className === f.className);
        return data;
    },

    bindStudentEvents(totalPages) {
        document.getElementById('sd-stu-search')?.addEventListener('click', () => {
            this.filters.student.name = document.getElementById('sd-stu-name')?.value || '';
            this.filters.student.className = document.getElementById('sd-stu-class')?.value || '';
            this.studentPage = 1;
            this.renderTab('sdStudent');
        });
        document.getElementById('sd-stu-reset')?.addEventListener('click', () => {
            this.filters.student = { name: '', className: '' };
            this.studentPage = 1;
            this.renderTab('sdStudent');
        });
        document.querySelectorAll('.sd-stu-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const page = btn.dataset.page;
                if (action === 'prev' && this.studentPage > 1) this.studentPage--;
                else if (action === 'next' && this.studentPage < totalPages) this.studentPage++;
                else if (page) this.studentPage = parseInt(page);
                this.renderTab('sdStudent');
            });
        });
        document.querySelectorAll('.sd-stu-view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const s = MockData.schoolData.students.find(st => st.id === id);
                if (!s) return;
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]';
                modal.innerHTML = `
                    <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 max-w-lg w-full mx-4 shadow-2xl">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-white">${s.name} 的阅读档案</h3>
                            <button class="sd-modal-close-btn text-slate-400 hover:text-white transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div class="bg-slate-700/40 rounded-xl p-4 text-center"><div class="text-2xl font-bold text-blue-400">${s.readCount}</div><div class="text-xs text-slate-400">阅读次数</div></div>
                            <div class="bg-slate-700/40 rounded-xl p-4 text-center"><div class="text-2xl font-bold text-emerald-400">${s.readDuration}</div><div class="text-xs text-slate-400">阅读时长</div></div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between py-2 border-b border-slate-700/50"><span class="text-slate-400">班级</span><span class="text-white">${s.className}</span></div>
                            <div class="flex justify-between py-2 border-b border-slate-700/50"><span class="text-slate-400">偏好类型</span><span class="text-white">${s.favoriteType}</span></div>
                            <div class="flex justify-between py-2 border-b border-slate-700/50"><span class="text-slate-400">阅读等级</span><span class="text-white">${s.level}</span></div>
                            <div class="flex justify-between py-2"><span class="text-slate-400">最近活跃</span><span class="text-white">${s.lastActive}</span></div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
                modal.querySelector('.sd-modal-close-btn').addEventListener('click', () => modal.remove());
                modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
            });
        });
    }
};
'''
    write_file('js/schoolData.js', content)
    print("js/schoolData.js created successfully")


# ============================================================
# 5. 修改 app.js - 添加 schoolData 页面的路由
# ============================================================
def patch_app_js():
    app = read_file('js/app.js')
    
    # 5a. 在 rolePages 中添加 schoolData 页面权限
    # admin
    app = app.replace(
        "admin: ['overview', 'statistics', 'dataOverview', 'advancedAnalysis', 'schoolManage', 'teacherManage', 'studentManage', 'bookManage', 'deviceManage', 'accountManage']",
        "admin: ['overview', 'statistics', 'dataOverview', 'advancedAnalysis', 'schoolData', 'schoolManage', 'teacherManage', 'studentManage', 'bookManage', 'deviceManage', 'accountManage']"
    )
    # principal
    app = app.replace(
        "principal: ['overview', 'statistics', 'dataOverview', 'advancedAnalysis', 'analysis', 'readingReport', 'teacherManage', 'studentManage', 'bookManage', 'deviceManage', 'attendanceManage']",
        "principal: ['overview', 'statistics', 'dataOverview', 'advancedAnalysis', 'schoolData', 'analysis', 'readingReport', 'teacherManage', 'studentManage', 'bookManage', 'deviceManage', 'attendanceManage']"
    )
    # teacher
    app = app.replace(
        "teacher: ['dataOverview', 'advancedAnalysis', 'personal', 'readingReport', 'studentManage', 'attendanceManage']",
        "teacher: ['dataOverview', 'advancedAnalysis', 'schoolData', 'personal', 'readingReport', 'studentManage', 'attendanceManage']"
    )
    
    # 5b. 在 initPageContent 的 switch 中添加 schoolData case
    # 找到 case 'advancedAnalysis': 后面的 break;
    switch_insert = "case 'advancedAnalysis':\n                        this.initAdvancedAnalysisPage();\n                        break;"
    new_case = switch_insert + "\n                    case 'schoolData':\n                        this.initSchoolDataPage();\n                        break;"
    app = app.replace(switch_insert, new_case)
    
    # 5c. 添加 initSchoolDataPage 方法
    # 在 initStatisticsPage 方法之前插入
    init_stats_marker = "initStatisticsPage()"
    pos = app.find(init_stats_marker)
    if pos == -1:
        # 尝试另一个位置
        init_stats_marker = "// 初始化统计页面"
        pos = app.find(init_stats_marker)
    
    if pos != -1:
        # 往前找到方法开始的位置（找到前一个换行）
        insert_pos = app.rfind('\n', 0, pos)
        new_method = '''
    // 初始化园所综合数据统计页面
    initSchoolDataPage() {
        SchoolData.init();
    },

'''
        app = app[:insert_pos] + new_method + app[insert_pos:]
    
    write_file('js/app.js', app)
    print("app.js patched successfully")


# ============================================================
# 6. 修改 index.html - 引入 schoolData.js
# ============================================================
def add_script_tag():
    html = read_file('index.html')
    
    # 在 app.js 引入之前添加 schoolData.js
    app_script = '<script src="js/app.js"></script>'
    new_scripts = '<script src="js/schoolData.js"></script>\n    ' + app_script
    html = html.replace(app_script, new_scripts)
    
    write_file('index.html', html)
    print("Script tag added to index.html")


# ============================================================
# 主函数
# ============================================================
if __name__ == '__main__':
    print("Starting integration...")
    print("=" * 50)
    
    # 1. 创建 schoolData.js
    create_school_data_js()
    
    # 2. 修改 mockData.js
    patch_mock_data()
    
    # 3. 修改 app.js
    patch_app_js()
    
    # 4. 修改 index.html (导航 + 模板)
    patch_index_html()
    
    # 5. 添加 script 标签
    add_script_tag()
    
    print("=" * 50)
    print("Integration complete!")
    print("New features added:")
    print("  - 园所综合数据统计 (schoolData) with 7 sub-tabs:")
    print("    1. 数据概述 - Overview with metrics and charts")
    print("    2. 绘本活动 - Activity list with filters, pagination, detail modal")
    print("    3. 绘本 - Book library with search, type filter, detail modal")
    print("    4. 设备使用 - Device list with status and usage chart")
    print("    5. 班级 - Class list with comparison chart and detail modal")
    print("    6. 教师 - Teacher list with ranking chart")
    print("    7. 幼儿 - Student list with search, filter, detail modal")
'''
