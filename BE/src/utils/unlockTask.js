const unlockTask = async (task) => {
    if (!task.isLocked) return; // đã mở thì khỏi mở lại

    task.isLocked = false;
    task.deadline = new Date(Date.now() + task.duration * 60 * 60 * 1000);

    await task.save();
};

module.exports = unlockTask;
