const fs = require('fs');
const path = require('path');

/**
 * GET /api/templates?specialization=front_end
 * Trả về danh sách templates dựa trên specialization
 */
exports.getTemplates = async (req, res) => {
    try {
        const { specialization } = req.query;
        
        console.log('📚 Getting templates for:', specialization);
        
        if (!specialization) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp specialization query param'
            });
        }

        // Đường dẫn tới folder templates
        const templatesDir = path.join(__dirname, '../templates');
        
        // Đọc tất cả files trong folder
        const files = fs.readdirSync(templatesDir);
        
        // Filter files theo specialization và đuôi .json
        const templateFiles = files.filter(file => 
            file.startsWith(specialization) && file.endsWith('.json')
        );
        
        console.log('📂 Found template files:', templateFiles);
        
        // Parse mỗi file để lấy metadata
        const templates = templateFiles.map(filename => {
            // Parse filename: front_end_landingPage_tasks.json
            // -> specialization: front_end, templateName: landingPage
            const withoutExtension = filename.replace('_tasks.json', '');
            
            // Remove specialization prefix (front_end_ or back_end_)
            const templateName = withoutExtension.replace(`${specialization}_`, '');
            
            // Đọc file để lấy số lượng tasks
            const filePath = path.join(templatesDir, filename);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const tasks = JSON.parse(fileContent);
            
            // Generate display name (capitalize first letter)
            const displayName = templateName
                .split(/(?=[A-Z])/) // Split by capital letters
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            return {
                templateName,
                name: displayName,
                description: `Dự án ${displayName} với ${tasks.length} tasks`,
                technologies: extractTechnologies(templateName, specialization),
                taskCount: tasks.length,
                specialization
            };
        });
        
        console.log('✅ Templates loaded:', templates.length);
        
        res.json({
            success: true,
            data: templates
        });
        
    } catch (error) {
        console.error('❌ Error getting templates:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Hàm helper để extract technologies dựa trên template name
 */
function extractTechnologies(templateName, specialization) {
    const techMap = {
        front_end: {
            landingPage: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
            netflixTasks: ['React', 'CSS', 'API Integration', 'UI/UX'],
            simpleBlog: ['HTML', 'CSS', 'JavaScript', 'LocalStorage']
        },
        back_end: {
            blog: ['Node.js', 'Express', 'MongoDB', 'REST API']
        }
    };
    
    return techMap[specialization]?.[templateName] || ['JavaScript', 'Web Development'];
}

/**
 * POST /api/templates
 * Tạo template mới (optional - cho admin)
 */
exports.createTemplate = async (req, res) => {
    try {
        res.status(501).json({
            success: false,
            message: 'Feature chưa được implement'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
