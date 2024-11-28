const BASE_URL = "http://localhost:80/API/v1/projects";

// Fetch all projects
export const getProjects = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};

// Create a new project
export const createProject = async (project) => {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
};

// Create a task in a column
export const createTaskInColumn = async (projectId, task, column) => {
    try {
        const response = await fetch(
            `${BASE_URL}/${projectId}/tasks?column=${encodeURIComponent(column)}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};
export const moveTask = async (projectId, taskId, newColumn) => {
    try {
        const response = await fetch(
            `http://localhost:80/API/v1/projects/${projectId}/tasks/${taskId}/move`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newColumn }),
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error moving task:", error);
        throw error;
    }
};