const cron = require("node-cron");
const Task = require("../models/Task");
const Project = require("../models/Project");

cron.schedule("* * * * *", async () => {
    try {
        console.log("[CRON] Kiểm tra task hết hạn...");

        const now = Date.now();

        const expiredTasks = await Task.find({
            isLocked: false,
            deadline: { $lt: now },
            isExpired: false
        });

        for (const task of expiredTasks) {
            task.isLocked = true;
            task.isExpired = true;
            await task.save();

            // Kiểm tra nếu đây là task cuối → project expired
            const maxTask = await Task.findOne({ projectId: task.projectId }).sort({ order: -1 });

            if (task.order === maxTask.order) {
                const project = await Project.findById(task.projectId);
                project.status = "expired";
                await project.save();
            }
        }

    } catch (err) {
        console.error("Cron error:", err.message);
    }
});
