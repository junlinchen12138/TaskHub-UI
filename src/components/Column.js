import React, { useState } from "react";
import { createTaskInColumn } from "../api";
import { Draggable } from "react-beautiful-dnd";

const Column = ({ projectId, columnName, tasks, refreshProjects }) => {
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");

    // Debugging the column and tasks data
    console.log("Column Rendered: ", columnName);
    console.log("Tasks in Column:", columnName, tasks);

    const handleAddTask = async () => {
        if (!newTaskTitle || !newTaskDescription) {
            alert("Please enter both task title and description.");
            return;
        }

        const newTask = {
            title: newTaskTitle,
            description: newTaskDescription,
            column: columnName,
        };

        try {
            console.log("Adding Task:", newTask); // Debugging task to be added
            await createTaskInColumn(projectId, newTask, columnName);
            refreshProjects();
            setNewTaskTitle("");
            setNewTaskDescription("");
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    return (
        <div style={{ margin: "10px", padding: "10px", border: "1px solid gray" }}>
            <h3>{columnName}</h3>
            <div>
                {tasks.map((task, index) => {
                    console.log("Rendering Task in Draggable:", task); // Debugging task being rendered
                    return (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                        padding: "5px",
                                        marginBottom: "5px",
                                        border: "1px solid lightgray",
                                        ...provided.draggableProps.style,
                                    }}
                                >
                                    <strong>{task.title}</strong>
                                    <p>{task.description}</p>
                                </div>
                            )}
                        </Draggable>
                    );
                })}
            </div>

            {/* Form to add a new task */}
            <div style={{ marginTop: "10px" }}>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    style={{ marginRight: "5px" }}
                />
                <input
                    type="text"
                    placeholder="Task Description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    style={{ marginRight: "5px" }}
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>
        </div>
    );
};

export default Column;
