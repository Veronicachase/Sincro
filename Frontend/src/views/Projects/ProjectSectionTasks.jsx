import { Box, Typography } from "@mui/material";
import { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import getProjectById from "../../api/getProjectById"
import getTaskById from "../../api/getTaskById";
import IconColors from "../../components/IconColors";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import deleteTaskById from "../../api/deleteTaskById"
import deleteSectionById from "../../api/deleteSeccionById"

export default function ProjectSectionTasks() {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null); 
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    getProjectById().then(setProjectData); 
    getTaskById().then(setTaskData); 
  }, []);

  if (!projectData) { 
    return <div>Loading...</div>; 
  }

  return (
    <Box>
      <Box>
        <Typography variant="body">{projectData.projectName}</Typography>
        <Typography variant="body">{projectData.constructionType}</Typography>
        <Typography variant="body">{projectData.section}</Typography>
      </Box>
      {projectData.sections && Object.entries(projectData.sections).map(([sectionKey, isActive]) => (
        isActive && (
          <Box key={sectionKey}> 
            <IconColors/>
            <Typography variant="h6">{sectionKey}</Typography>
            <EditIcon onClick={() => console.log('Agregar función de editar sección')}/>
            <DeleteForeverIcon onClick={() => deleteSectionById(projectData.projectId, sectionKey)} />
          </Box>
        )
      ))}
      <Box>
        {taskData.map((task) => (
          <Box key={task.taskId}>
            <IconColors/>
            <Typography variant="h5">{task}</Typography>
            <EditIcon onClick={() => navigate("/project-info-task")}/>
            <DeleteForeverIcon onClick={() => deleteTaskById(task.taskId)}/>
          </Box>
        ))}
      </Box>
    </Box>
  );
}