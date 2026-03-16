# -*- coding: utf-8 -*-
import os

BASE_DIR = r"D:\绘本阅读机器人\dashboard"

def read_file(filename):
    path = os.path.join(BASE_DIR, filename)
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filename, content):
    path = os.path.join(BASE_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Step 1: Patch mockData.js
print("Step 1: Patching mockData.js...")
data = read_file('js/mockData.js')
insert_marker = "// 推荐理由映射"
pos = data.find(insert_marker)
if pos == -1:
    print("WARNING: marker not found, trying end of file")
    pos = data.rfind('};')

new_data_block = """
    // ========== 园所综合数据统计 ==========
    schoolData: {
        overview: {
            activityTotal: 212, activityDuration: 99.38,
            bookTotal: 75, bookReadCount: 147, bookReadDuration: 7.37,
            deviceTotal: 13, deviceUseCount: 632, deviceUseDuration: 292.32,
            classTotal: 18, teacherTotal: 42, studentTotal: 249,
            bookByType: [
                { type: '日常生活', count: 44, duration: 2.03 },
                { type: '科普百科', count: 9, duration: 0.45 },
                { type: '语言学习', count: 4, duration: 0.32 },
                { type: '国学文化', count: 14, duration: 0.65 },
                { type: '情商品格', count: 20, duration: 1.11 },
                { type: '人际交往', count: 60, duration: 3.16 }
            ]
        },
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
        books: [
            { id: 1, name: '永远永远爱你', author: '宫西达也', type: '情商品格', readCount: 19, readDuration: '1.2h', cover: '\\ud83e\\udd95' },
            { id: 2, name: '团圆', author: '余丽琼', type: '国学文化', readCount: 11, readDuration: '0.8h', cover: '\\ud83c\\udfee' },
            { id: 3, name: '我爸爸', author: '安东尼\\u00b7布朗', type: '人际交往', readCount: 9, readDuration: '0.6h', cover: '\\ud83d\\udc68' },
            { id: 4, name: '猜猜我有多爱你', author: '山姆\\u00b7麦克布雷尼', type: '情商品格', readCount: 8, readDuration: '0.5h', cover: '\\ud83d\\udc30' },
            { id: 5, name: '哇哦，鳄鱼也想要惊喜', author: '乔尼\\u00b7兰伯特', type: '日常生活', readCount: 7, readDuration: '0.4h', cover: '\\ud83d\\udc0a' },
            { id: 6, name: '母鸡萝丝去散步', author: '佩特\\u00b7哈群斯', type: '语言学习', readCount: 5, readDuration: '0.3h', cover: '\\ud83d\\udc14' },
            { id: 7, name: '花婆婆', author: '芭芭拉\\u00b7库尼', type: '日常生活', readCount: 4, readDuration: '0.25h', cover: '\\ud83c\\udf38' },
            { id: 8, name: '爱跳舞的小龙', author: '乔\\u00b7洛奇', type: '情商品格', readCount: 3, readDuration: '0.2h', cover: '\\ud83d\\udc09' },
            { id: 9, name: '胆小鬼威利', author: '安东尼\\u00b7布朗', type: '情商品格', readCount: 3, readDuration: '0.2h', cover: '\\ud83d\\udc35' },
            { id: 10, name: '古利和古拉', author: '中川李枝子', type: '日常生活', readCount: 3, readDuration: '0.2h', cover: '\\ud83d\\udc2d' },
            { id: 11, name: '大卫不可以', author: '大卫\\u00b7香农', type: '日常生活', readCount: 6, readDuration: '0.35h', cover: '\\ud83d\\udc66' },
            { id: 12, name: '好饿的毛毛虫', author: '艾瑞\\u00b7卡尔', type: '科普百科', readCount: 5, readDuration: '0.3h', cover: '\\ud83d\\udc1b' },
            { id: 13, name: '三字经', author: '王应麟', type: '国学文化', readCount: 4, readDuration: '0.25h', cover: '\\ud83d\\udcdc' },
            { id: 14, name: '小蝌蚪找妈妈', author: '方惠珍', type: '科普百科', readCount: 3, readDuration: '0.2h', cover: '\\ud83d\\udc38' },
            { id: 15, name: '逃家小兔', author: '玛格丽特\\u00b7怀兹\\u00b7布朗', type: '人际交往', readCount: 8, readDuration: '0.5h', cover: '\\ud83d\\udc07' }
        ],
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

"""

data = data.replace(insert_marker, new_data_block + '    ' + insert_marker)
write_file('js/mockData.js', data)
print("  mockData.js patched OK")

# Step 2: Patch app.js
print("Step 2: Patching app.js...")
app = read_file('js/app.js')

# Add schoolData to role pages
app = app.replace(
    "admin: ['overview', 'statistics', 'dataOverview', 'advancedAnalysis', 'schoolManage', 'teacherManage', 'studentManage', 'bookManage', 'deviceManage', 'accountManage']",
    "admin: ['overview', 'statistics', 'dataOverview', 'advancedAnalysis', 'schoolData', 'schoolManage', 'teacherManage', 'studentManage', 'bookManage', 'deviceManage', 'accountManage']"
)
app = app.replace(
    "principal: ['overview', 'statistics', 'dataOverview', 'advancedAnalysis', 'analysis', 'readingReport', 'teacherManage', 'studentManage', 'bookManage', 'deviceManage', 'attendanceManage']",
    "principal: ['overview', 'statistics', 'dataOverview', 'advancedAnalysis', 'schoolData', 'analysis', 'readingReport', 'teacherManage', 'studentManage', 'bookManage', 'deviceManage', 'attendanceManage']"
)
app = app.replace(
    "teacher: ['dataOverview', 'advancedAnalysis', 'personal', 'readingReport', 'studentManage', 'attendanceManage']",
    "teacher: ['dataOverview', 'advancedAnalysis', 'schoolData', 'personal', 'readingReport', 'studentManage', 'attendanceManage']"
)

# Add switch case
old_switch = "case 'advancedAnalysis':\n                        this.initAdvancedAnalysisPage();\n                        break;"
new_switch = old_switch + "\n                    case 'schoolData':\n                        this.initSchoolDataPage();\n                        break;"
app = app.replace(old_switch, new_switch)

# Add initSchoolDataPage method - find a good insertion point
# Insert before initStatisticsPage
marker = "    initStatisticsPage()"
pos = app.find(marker)
if pos != -1:
    insert_pos = app.rfind('\n', 0, pos)
    new_method = """
    // 初始化园所综合数据统计页面
    initSchoolDataPage() {
        SchoolData.init();
    },
"""
    app = app[:insert_pos] + new_method + app[insert_pos:]
    print("  initSchoolDataPage method added")
else:
    print("  WARNING: Could not find initStatisticsPage marker")

write_file('js/app.js', app)
print("  app.js patched OK")

# Step 3: Patch index.html
print("Step 3: Patching index.html...")
html = read_file('index.html')

# Add nav button
nav_marker = 'data-page="advancedAnalysis"'
nav_pos = html.find(nav_marker)
if nav_pos != -1:
    btn_end = html.find('</button>', nav_pos)
    if btn_end != -1:
        btn_end += len('</button>')
        school_nav = """
                    <button class="nav-btn flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-700/50" data-page="schoolData">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        园所综合数据
                    </button>"""
        html = html[:btn_end] + school_nav + html[btn_end:]
        print("  Nav button added")

# Add template
last_template = html.rfind('</template>')
if last_template != -1:
    last_template += len('</template>')
    template_html = """

    <!-- 园所综合数据统计页面模板 -->
    <template id="schoolData-template">
        <div class="school-data-page">
            <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-2xl font-bold text-white">园所综合数据统计</h1>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-slate-400" id="sd-kindergarten-name">淘云实验园</span>
                    </div>
                </div>
                <div class="text-sm text-slate-500">首页 &gt; 园所综合数据统计</div>
            </div>
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
            <div id="sd-tab-content"></div>
        </div>
    </template>"""
    html = html[:last_template] + template_html + html[last_template:]
    print("  Template added")

# Add script tag
app_script = '<script src="js/app.js"></script>'
new_scripts = '<script src="js/schoolData.js"></script>\n    ' + app_script
html = html.replace(app_script, new_scripts)
print("  Script tag added")

write_file('index.html', html)
print("  index.html patched OK")

print("=" * 50)
print("All patches applied successfully!")
