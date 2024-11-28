import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getProjects, createProject, createTaskInColumn, moveTask } from "./api";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projectsData = await getProjects();
      projectsData.forEach((project) => {
        project.columns = project.columns || [];
        project.tasks = project.tasks || [];
      });
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects");
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName || !newProjectDescription) {
      alert("Please enter both project name and description.");
      return;
    }

    const newProject = {
      projectName: newProjectName,
      description: newProjectDescription,
      columns: ["To Do", "In Progress", "Done"],
      tasks: [],
    };

    try {
      await createProject(newProject);
      fetchProjects();
      setNewProjectName("");
      setNewProjectDescription("");
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to create a new project");
    }
  };

  const handleDragEnd = async (result, project) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
    ) {
      return;
    }

    const task = project.tasks.find((t) => t.id === draggableId);

    if (!task) {
      console.error("Task not found for draggableId:", draggableId);
      return;
    }

    try {
      await moveTask(project.id, task.id, destination.droppableId);
      fetchProjects(); // Refresh the project data
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  return (
      <div style={{ padding: "20px" }}>
        <h1>Task Management Board</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ marginBottom: "20px" }}>
          <h2>Create a New Project</h2>
          <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              style={{ marginRight: "10px" }}
          />
          <input
              type="text"
              placeholder="Project Description"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              style={{ marginRight: "10px" }}
          />
          <button onClick={handleCreateProject}>Create Project</button>
        </div>

        <div>
          <h2>Projects</h2>
          {projects.length > 0 ? (
              projects.map((project) => (
                  <div key={project.id}>
                    <h3>{project.projectName}</h3>
                    <p>{project.description}</p>
                    <DragDropContext
                        onDragEnd={(result) => handleDragEnd(result, project)}
                    >
                      <div style={{ display: "flex" }}>
                        {project.columns.map((column) => (
                            <Droppable key={column} droppableId={column}>
                              {(provided) => (
                                  <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      style={{
                                        margin: "0 10px",
                                        padding: "10px",
                                        border: "1px solid black",
                                        width: "200px",
                                      }}
                                  >
                                    <h4>{column}</h4>
                                    {project.tasks
                                        .filter((task) => task.column === column)
                                        .map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                              {(provided) => (
                                                  <div
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      ref={provided.innerRef}
                                                      style={{
                                                        padding: "10px",
                                                        margin: "5px 0",
                                                        border: "1px solid gray",
                                                        backgroundColor: "lightgray",
                                                        ...provided.draggableProps.style,
                                                      }}
                                                  >
                                                    {task.title}
                                                  </div>
                                              )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                  </div>
                              )}
                            </Droppable>
                        ))}
                      </div>
                    </DragDropContext>

                  </div>
              ))
          ) : (
              <p>No projects available.</p>
          )}
        </div>
      </div>
  );
};

export default App;
