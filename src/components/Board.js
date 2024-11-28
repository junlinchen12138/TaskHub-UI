import React, { useState } from "react";
import Column from "./Column";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const Board = ({ project, refreshProjects, moveTask }) => {
    const [newColumnName, setNewColumnName] = useState("");

    const handleAddColumn = () => {
        if (!newColumnName) {
            alert("Please enter a column name.");
            return;
        }

        project.columns = [...project.columns, newColumnName]; // Add new column to the project
        setNewColumnName("");
        refreshProjects(); // Update the board
    };
    const handleDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        const sourceColumn = source.droppableId;
        const destinationColumn = destination.droppableId;

        if (sourceColumn !== destinationColumn) {
            moveTask(project.id, draggableId, destinationColumn);
            refreshProjects();
        }
    };
    {project.columns.map((column) => {
        const columnTasks = project.tasks.filter((task) => task.column === column);
        console.log("Tasks in column:", column, columnTasks); // Log tasks for each column
        return (
            <Column
                key={column}
                columnName={column}
                tasks={columnTasks}
                projectId={project.id}
                refreshProjects={refreshProjects}
            />
        );
    })}


    return (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid black" }}>
            <h2>{project.projectName || "Unnamed Project"}</h2>
            <p>{project.description || "No description provided."}</p>

            {/* Form to add a new column */}
            <div>
                <input
                    type="text"
                    placeholder="New Column Name"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                />
                <button onClick={handleAddColumn}>Add Column</button>
            </div>

            {/* Drag-and-Drop Context */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    {project.columns?.map((columnName, index) => (
                        <Droppable droppableId={columnName} key={index}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{ margin: "10px", padding: "10px", border: "1px solid gray" }}
                                >
                                    <Column
                                        projectId={project.id}
                                        columnName={columnName}
                                        tasks={project.tasks.filter((task) => task.column === columnName)}
                                        refreshProjects={refreshProjects}
                                    />
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};
export default Board;
