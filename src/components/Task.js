import React from "react";

const Task = ({ task }) => {
    return (
        <div style={{ padding: "5px", borderBottom: "1px solid lightgray" }}>
            <strong>{task.title}</strong>
            <p>{task.description}</p>
        </div>
    );
};

export default Task;
