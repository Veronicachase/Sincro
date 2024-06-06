import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton, Collapse, Modal,  TextField, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PropTypes from 'prop-types';
import { deleteTask } from '../api/deleteTask';
import { getTaskBySection } from '../api/getTaskBySection';
import { useNavigate } from 'react-router-dom';
import { CreatePDFButton } from '../components/CreatePDFButton';
import { getProjectById } from '../api/getProjectById';
import VoiceInputNoFormik from '../components/VoiceInputNoFormik';
import ExpandableImage from '../components/ExpandableImage';

export const SectionsAndTasks = ({ projectId, sectionKey, taskData = [], setTaskData }) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchProject = async () => {
      const projectData = await getProjectById(projectId);
      setProject(projectData);
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (projectId && sectionKey) {
        try {
          const tasks = await getTaskBySection(projectId, sectionKey);
          setTaskData(tasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      }
    };

    fetchTasks();
  }, [projectId, sectionKey, setTaskData]);

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTaskData((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
    } catch (error) {
      console.error('Error eliminando la tarea:', error);
    }
  };

  const handleToggleExpand = useCallback((taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  }, [expandedTaskId]);

  const handleImageClick = useCallback((image) => {
    setSelectedImage(image);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedImage(null);
  }, []);

  const handleModalClick = useCallback((event) => {
    if (event.target.tagName !== 'IMG') {
      handleCloseModal();
    }
  }, [handleCloseModal]);

  const handleAdditionalInfoChange = useCallback((text) => {
    setAdditionalInfo(text);
  }, []);

  return (
    <Box sx={{width:isMobile?"300px" :"100%"}}>
      <Typography sx={{ textAlign: "left", marginBottom: "1em", marginTop:"1em" }} variant={isMobile? "subtitle1":"h5"}>Tareas</Typography>
      {taskData && taskData.length === 0 ? (
        <Typography>No hay tareas para esta sección.</Typography>
      ) : (
        taskData.map((task) => (
          <Box
            key={task.taskId}
            id={`task-${task.taskId}`}
            sx={{
              marginBottom: 3,
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: 2,
              backgroundColor: '#fff',
              justifyContent:"left",
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
              },
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <Box display={isMobile ? "block" : "flex"}  justifyContent="space-between"  alignItems="center">
              <Typography variant={isMobile?"subtitle1":"h6"} sx={{ cursor: 'pointer', textAlign:"left" }}>{task.taskName}</Typography>
              <Box display={isMobile ? "flex" : "block"} justifyContent="space-between" alignItems="center" flexDirection={isMobile?'row-reverse': "none"}>
                <IconButton onClick={() => handleToggleExpand(task.taskId)}>
                  {expandedTaskId === task.taskId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <IconButton onClick={() => navigate(`/edit-task/${task.taskId}`)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteTask(task.taskId)}>
                  <DeleteForeverIcon sx={{ color: 'red' }} />
                </IconButton>
              </Box>
            </Box>
            <Collapse in={expandedTaskId === task.taskId}>
              <Box mt={2}>
                <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Descripción: </strong>{task.taskDescription}</Typography>
                <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Fecha de inicio: </strong>{task.startDate}</Typography>
                <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Fecha de fin: </strong>{task.endDate}</Typography>

                <Box mt={2}>
                  <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Imágenes Iniciales:</strong></Typography>
                  <Box display="flex" flexWrap="wrap" backgroundColor="#edf3f9" borderRadius={"10px"} padding={"1em"}>
                    {task.prevImages && task.prevImages.map((image, index) => (
                      <ExpandableImage
                        src={image}
                        key={index}
                        alt={`Inicial ${index}`}
                        onClick={() => handleImageClick(image)}
                      />
                    ))}
                  </Box>
                </Box>

                <Box mt={2}>
                  <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Imágenes Finales:</strong></Typography>
                  <Box display="flex" flexWrap="wrap" backgroundColor="#edf3f9" borderRadius={"10px"} padding={"1em"}>
                    {task.finalImages && task.finalImages.map((image, index) => (
                      <ExpandableImage
                        src={image}
                        key={index}
                        alt={`Final ${index}`}
                        onClick={() => handleImageClick(image)}
                      />
                    ))}
                  </Box>
                </Box>

                <Box mt={2}>
                  <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Información Adicional:</strong></Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Escribe información adicional aquí..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    InputProps={{
                      endAdornment: <VoiceInputNoFormik onTextChange={handleAdditionalInfoChange} />,
                    }}
                    sx={{ cursor: 'text' }}
                  />
                </Box>

                {project && (
                  <CreatePDFButton
                    project={project}
                    tasks={[task]}
                    additionalInfo={additionalInfo}
                    fileName={`reporte_${project.projectName}_${task.taskName}.pdf`}
                  />
                )}
              </Box>
            </Collapse>
          </Box>
        ))
      )}

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" onClick={handleModalClick}>
          {selectedImage && (
            <ExpandableImage src={selectedImage} alt="Selected" style={{ maxWidth: '90%', maxHeight: '90%' }} />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

SectionsAndTasks.propTypes = {
  projectId: PropTypes.string,
  sectionKey: PropTypes.string,
  taskData: PropTypes.array,
  setTaskData: PropTypes.func,
};






// import  { useState, useEffect, useCallback } from 'react';
// import { Box, Typography, IconButton, Collapse, Modal, Button, TextField } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import PropTypes from 'prop-types';
// import { deleteTask } from '../api/deleteTask';
// import { getTaskBySection } from '../api/getTaskBySection';
// import { useNavigate } from 'react-router-dom';
// import { CreatePDFButton } from '../components/CreatePDFButton';
// import { getProjectById } from '../api/getProjectById';
// import VoiceInputNoFormik from '../components/VoiceInputNoFormik';
// import ExpandableImage from '../components/ExpandableImage'; 

// export const SectionsAndTasks = ({ projectId, sectionKey, taskData = [], setTaskData }) => {
//   const [expandedTaskId, setExpandedTaskId] = useState(null);
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [additionalInfo, setAdditionalInfo] = useState('');

//   useEffect(() => {
//     const fetchProject = async () => {
//       const projectData = await getProjectById(projectId);
//       setProject(projectData);
//     };

//     fetchProject();
//   }, [projectId]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       if (projectId && sectionKey) {
//         try {
//           const tasks = await getTaskBySection(projectId, sectionKey);
//           setTaskData(tasks);
//         } catch (error) {
//           console.error('Error fetching tasks:', error);
//         }
//       }
//     };

//     fetchTasks();
//   }, [projectId, sectionKey, setTaskData]);

//   const handleDeleteTask = async (taskId) => {
//     try {
//       await deleteTask(taskId);
//       setTaskData((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
//     } catch (error) {
//       console.error('Error eliminando la tarea:', error);
//     }
//   };

//   const handleToggleExpand = useCallback((taskId) => {
//     setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
//   }, [expandedTaskId]);

//   const handleImageClick = useCallback((image) => {
//     setSelectedImage(image);
//     setModalOpen(true);
//   }, []);

//   const handleCloseModal = useCallback(() => {
//     setModalOpen(false);
//     setSelectedImage(null);
//   }, []);

//   const handleModalClick = useCallback((event) => {
//     if (event.target.tagName !== 'IMG') {
//       handleCloseModal();
//     }
//   }, [handleCloseModal]);

//   const handleAdditionalInfoChange = useCallback((text) => {
//     setAdditionalInfo(text);
//   }, []);

//   return (
//     <Box>
//       <Typography sx={{ textAlign: "left", marginBottom: "1em" }} variant='h5'>Tareas</Typography>
//       {taskData && taskData.length === 0 ? (
//         <Typography>No hay tareas para esta sección.</Typography>
//       ) : (
//         taskData.map((task) => (
//           <Box
//             key={task.taskId}
//             id={`task-${task.taskId}`}
//             sx={{
//               marginBottom: 3,
//               border: '1px solid #ccc',
//               borderRadius: '5px',
//               padding: 2,
//               backgroundColor: '#fff',
//               transition: 'transform 0.2s, box-shadow 0.2s',
//               '&:hover': {
//                 transform: 'scale(1.02)',
//                 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
//                 cursor: 'pointer',
//               }
//             }}
//           >
//             <Box display="flex" justifyContent="space-between" alignItems="center">
//               <Typography variant="h6" sx={{ cursor: 'pointer' }}>{task.taskName}</Typography>
//               <Box>
//                 <IconButton onClick={() => handleToggleExpand(task.taskId)}>
//                   {expandedTaskId === task.taskId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                 </IconButton>
//                 <IconButton onClick={() => navigate(`/edit-task/${task.taskId}`)}>
//                   <EditIcon />
//                 </IconButton>
//                 <IconButton onClick={() => handleDeleteTask(task.taskId)}>
//                   <DeleteForeverIcon sx={{ color: 'red' }} />
//                 </IconButton>
//               </Box>
//             </Box>
//             <Collapse in={expandedTaskId === task.taskId}>
//               <Box mt={2}>
//                 <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Descripción: </strong>{task.taskDescription}</Typography>
//                 <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Fecha de inicio: </strong>{task.startDate}</Typography>
//                 <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Fecha de fin: </strong>{task.endDate}</Typography>

//                 <Box mt={2}>
//                   <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Imágenes Iniciales:</strong></Typography>
//                   <Box display="flex" flexWrap="wrap" backgroundColor="#edf3f9" borderRadius={"10px"} padding={"1em"}>
//                     {task.prevImages && task.prevImages.map((image, index) => (
//                       <ExpandableImage
//                         src={image}
//                         key={index}
//                         alt={`Inicial ${index}`}
//                         onClick={() => handleImageClick(image)}
//                       />
//                     ))}
//                   </Box>
//                 </Box>

//                 <Box mt={2}>
//                   <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Imágenes Finales:</strong></Typography>
//                   <Box display="flex" flexWrap="wrap" backgroundColor="#edf3f9" borderRadius={"10px"} padding={"1em"}>
//                     {task.finalImages && task.finalImages.map((image, index) => (
//                       <ExpandableImage
//                         src={image}
//                         key={index}
//                         alt={`Final ${index}`}
//                         onClick={() => handleImageClick(image)}
//                       />
//                     ))}
//                   </Box>
//                 </Box>

//                 <Box mt={2}>
//                   <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Información Adicional:</strong></Typography>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     placeholder="Escribe información adicional aquí..."
//                     value={additionalInfo}
//                     onChange={(e) => setAdditionalInfo(e.target.value)}
//                     InputProps={{
//                       endAdornment: <VoiceInputNoFormik onTextChange={handleAdditionalInfoChange} />,
//                     }}
//                     sx={{ cursor: 'text' }}
//                   />
//                 </Box>

//                 {project && (
//                   <CreatePDFButton
//                     project={project}
//                     tasks={[task]}
//                     additionalInfo={additionalInfo}
//                     fileName={`reporte_${project.projectName}_${task.taskName}.pdf`}
//                   />
//                 )}
//               </Box>
//             </Collapse>
//           </Box>
//         ))
//       )}

//       <Modal open={modalOpen} onClose={handleCloseModal}>
//         <Box display="flex" justifyContent="center" alignItems="center" height="100vh" onClick={handleModalClick}>
//           {selectedImage && (
//             <ExpandableImage src={selectedImage} alt="Selected" style={{ maxWidth: '90%', maxHeight: '90%' }} />
//           )}
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// SectionsAndTasks.propTypes = {
//   projectId: PropTypes.string,
//   sectionKey: PropTypes.string,
//   taskData: PropTypes.array,
//   setTaskData: PropTypes.func,
// };





// import { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Collapse, Modal, Button, TextField } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import PropTypes from 'prop-types';
// import { deleteTask } from '../api/deleteTask';
// import { getTaskBySection } from '../api/getTaskBySection';
// import { useNavigate } from 'react-router-dom';
// import { CreatePDFButton } from '../components/CreatePDFButton';
// import { getProjectById } from '../api/getProjectById';
// import VoiceInputNoFormik from '../components/VoiceInputNoFormik'; // Asegúrate de ajustar la ruta según tu estructura de archivos
// import ExpandableImage from '../ui/CloudinaryImg';
// import { HamburgerMenu } from '../components/HamburguerMenu'

// export const SectionsAndTasks = ({ projectId, sectionKey, taskData = [], setTaskData }) => {
//   const [expandedTaskId, setExpandedTaskId] = useState(null);
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [additionalInfo, setAdditionalInfo] = useState('');

//   useEffect(() => {
//     const fetchProject = async () => {
//       const projectData = await getProjectById(projectId);
//       setProject(projectData);
//     };

//     fetchProject();
//   }, [projectId]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       if (projectId && sectionKey) {
//         try {
//           const tasks = await getTaskBySection(projectId, sectionKey);
//           setTaskData(tasks);
//         } catch (error) {
//           console.error('Error fetching tasks:', error);
//         }
//       }
//     };

//     fetchTasks();
//   }, [projectId, sectionKey, setTaskData]);

//   const handleDeleteTask = async (taskId) => {
//     try {
//       await deleteTask(taskId);
//       setTaskData((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
//     } catch (error) {
//       console.error('Error eliminando la tarea:', error);
//     }
//   };

//   const handleToggleExpand = (taskId) => {
//     setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
//   };

//   const handleImageClick = (image) => {
//     setSelectedImage(image);
//     // setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedImage(null);
//   };

//   const handleModalClick = (event) => {
//     if (event.target.tagName !== 'IMG') {
//       handleCloseModal();
//     }
//   };

//   const handleAdditionalInfoChange = (text) => {
//     setAdditionalInfo(text);
//   };

//   return (
//     <Box>
//       <Typography sx={{ textAlign: "left", marginBottom: "1em" }} variant='h5'>Tareas</Typography>
//       {taskData && taskData.length === 0 ? (
//         <Typography>No hay tareas para esta sección.</Typography>
//       ) : (
//         taskData.map((task) => (
//           <Box
//             key={task.taskId}
//             id={`task-${task.taskId}`}
//             sx={{
//               marginBottom: 3,
//               border: '1px solid #ccc',
//               borderRadius: '5px',
//               padding: 2,
//               backgroundColor: '#fff',
//               transition: 'transform 0.2s, box-shadow 0.2s',
//               '&:hover': {
//                 transform: 'scale(1.02)',
//                 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
//                 cursor: 'pointer', 
//               }
      
//             }}
//           >
//             <Box display="flex" justifyContent="space-between" alignItems="center">
//               <Typography variant="h6" sx={{cursor: 'pointer' }}>{task.taskName}</Typography> {/* Asegura cursor default */}
//               <Box>
//                 <IconButton onClick={() => handleToggleExpand(task.taskId)}>
//                   {expandedTaskId === task.taskId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                 </IconButton>
//                 <IconButton onClick={() => navigate(`/edit-task/${task.taskId}`)}>
//                 <EditIcon />
//               </IconButton>
//                 <IconButton onClick={() => handleDeleteTask(task.taskId)}>
//                   <DeleteForeverIcon sx={{ color: 'red' }} />
//                 </IconButton>
               
//               </Box>
//             </Box>
//             <Collapse in={expandedTaskId === task.taskId}>
//               <Box mt={2}>
//                 <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Descripción: </strong>{task.taskDescription}</Typography>
//                 <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Fecha de inicio: </strong>{task.startDate}</Typography>
//                 <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Fecha de fin: </strong>{task.endDate}</Typography>

//                 <Box mt={2}>
//                   <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Imágenes Iniciales:</strong></Typography>
//                   <Box display="flex" flexWrap="wrap" backgroundColor="#edf3f9" borderRadius={"10px"} padding={"1em"}>
//                     {task.prevImages && task.prevImages.map((image, index) => (
//                       <ExpandableImage
//                       uploadedImg={image}
//                       key={index}
//                         alt={`Inicial ${index}`}
//                         style={{ width: '100px', margin: '5px', cursor: 'pointer' }}
//                         onClick={() => handleImageClick(image)}
//                       />
//                     ))}
//                   </Box>
//                 </Box>

//                 <Box mt={2}>
//                   <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Imágenes Finales:</strong></Typography>
//                   <Box display="flex" flexWrap="wrap" backgroundColor="#edf3f9" borderRadius={"10px"} padding={"1em"}>
//                     {task.finalImages && task.finalImages.map((image, index) => (
//                       <ExpandableImage
//                         key={index}
//                         uploadedImg={image}
//                         alt={`Final ${index}`}
//                         style={{ width: '100px', margin: '5px', cursor: 'pointer' }}
//                         onClick={() => handleImageClick(image)}
//                       />
//                     ))}
//                   </Box>
//                 </Box>

//                 <Box mt={2}>
//                   <Typography sx={{ textAlign: "left", cursor: 'default' }} variant="body1"><strong>Información Adicional:</strong></Typography>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     placeholder="Escribe información adicional aquí..."
//                     value={additionalInfo}
//                     onChange={(e) => setAdditionalInfo(e.target.value)}
//                     InputProps={{
//                       endAdornment: <VoiceInputNoFormik onTextChange={handleAdditionalInfoChange} />,
//                     }}
//                     sx={{ cursor: 'text' }} // Asegura que el cursor sea de texto en el TextField
//                   />
//                 </Box>

//                 {project && (
//                   <CreatePDFButton
//                     project={project}
//                     tasks={[task]}
//                     additionalInfo={additionalInfo}
//                     fileName={`reporte_${project.projectName}_${task.taskName}.pdf`}
//                   />
//                 )}
//               </Box>
//             </Collapse>
//           </Box>
//         ))
//       )}

//       <Modal open={modalOpen} onClose={handleCloseModal}>
//         <Box display="flex" justifyContent="center" alignItems="center" height="100vh" onClick={handleModalClick}>
//           <ExpandableImage uploadedImg={selectedImage} alt="Selected" style={{ maxWidth: '90%', maxHeight: '90%' }} />
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// SectionsAndTasks.propTypes = {
//   projectId: PropTypes.string,
//   sectionKey: PropTypes.string,
//   taskData: PropTypes.array,
//   setTaskData: PropTypes.func,
// };


// import { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Collapse, Modal, Button, TextField } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import PropTypes from 'prop-types';
// import { deleteTask } from '../api/deleteTask';
// import { getTaskBySection } from '../api/getTaskBySection';
// import { useNavigate } from 'react-router-dom';
// import { CreatePDFButton } from '../components/CreatePDFButton';
// import { getProjectById } from '../api/getProjectById';
// import VoiceInputNoFormik from '../components/VoiceInputNoFormik'; // Asegúrate de ajustar la ruta según tu estructura de archivos

// export const SectionsAndTasks = ({ projectId, sectionKey, taskData = [], setTaskData }) => {
//   const [expandedTaskId, setExpandedTaskId] = useState(null);
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [additionalInfo, setAdditionalInfo] = useState('');

//   useEffect(() => {
//     const fetchProject = async () => {
//       const projectData = await getProjectById(projectId);
//       setProject(projectData);
//     };

//     fetchProject();
//   }, [projectId]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       if (projectId && sectionKey) {
//         try {
//           const tasks = await getTaskBySection(projectId, sectionKey);
//           setTaskData(tasks);
//         } catch (error) {
//           console.error('Error fetching tasks:', error);
//         }
//       }
//     };

//     fetchTasks();
//   }, [projectId, sectionKey, setTaskData]);

//   const handleDeleteTask = async (taskId) => {
//     try {
//       await deleteTask(taskId);
//       setTaskData((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
//     } catch (error) {
//       console.error('Error eliminando la tarea:', error);
//     }
//   };

//   const handleToggleExpand = (taskId) => {
//     setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
//   };

//   const handleImageClick = (image) => {
//     setSelectedImage(image);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedImage(null);
//   };

//   const handleModalClick = (event) => {
//     if (event.target.tagName !== 'IMG') {
//       handleCloseModal();
//     }
//   };

//   const handleAdditionalInfoChange = (text) => {
//     setAdditionalInfo(text);
//   };

//   return (
//     <Box>
//       <Typography sx={{ textAlign: "left", marginBottom: "1em" }} variant='h5'> Tareas</Typography>
//       {taskData.length === 0 ? (
//         <Typography>No hay tareas para esta sección.</Typography>
//       ) : (
//         taskData.map((task) => (
//           <Box
//             key={task.taskId}
//             id={`task-${task.taskId}`}
//             sx={{
//               marginBottom: 3,
//               border: '1px solid #ccc',
//               borderRadius: '5px',
//               padding: 2,
//               backgroundColor: '#fff',
//               transition: 'transform 0.2s, box-shadow 0.2s',
//               '&:hover': {
//                 transform: 'scale(1.02)',
//                 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
//               },
//             }}
//           >
//             <Box display="flex" justifyContent="space-between" alignItems="center">
//               <Typography variant="h6">{task.taskName}</Typography>
//               <Box>
//                 <IconButton onClick={() => handleToggleExpand(task.taskId)}>
//                   {expandedTaskId === task.taskId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                 </IconButton>
//                 <IconButton onClick={() => handleDeleteTask(task.taskId)}>
//                   <DeleteForeverIcon sx={{ color: 'red' }} />
//                 </IconButton>
//                 <IconButton onClick={() => navigate(`/edit-task/${task.taskId}`)}>
//                   <EditIcon />
//                 </IconButton>
//               </Box>
//             </Box>
//             <Collapse in={expandedTaskId === task.taskId}>
//               <Box mt={2}>
//                 <Typography sx={{ textAlign: "left" }} variant="body1"><strong>Descripción: </strong>{task.taskDescription}</Typography>
//                 <Typography sx={{ textAlign: "left" }} variant="body1"><strong>Fecha de inicio: </strong>{task.startDate}</Typography>
//                 <Typography sx={{ textAlign: "left" }} variant="body1"><strong>Fecha de fin: </strong>{task.endDate}</Typography>

//                 <Box mt={2}>
//                   <Typography sx={{ textAlign: "left" }} variant="body1"><strong>Imágenes Iniciales:</strong></Typography>
//                   <Box display="flex" flexWrap="wrap" backgroundColor="#edf3f9" borderRadius={"10px"} padding={"1em"}>
//                     {task.prevImages && task.prevImages.map((image, index) => (
//                       <img
//                         key={index}
//                         src={image}
//                         alt={`Inicial ${index}`}
//                         style={{ width: '100px', margin: '5px', cursor: 'pointer' }}
//                         onClick={() => handleImageClick(image)}
//                       />
//                     ))}
//                   </Box>
//                 </Box>

//                 <Box mt={2}>
//                   <Typography sx={{ textAlign: "left" }} variant="body1"><strong>Imágenes Finales:</strong></Typography>
//                   <Box display="flex" flexWrap="wrap" backgroundColor="#edf3f9" borderRadius={"10px"} padding={"1em"}>
//                     {task.finalImages && task.finalImages.map((image, index) => (
//                       <img
//                         key={index}
//                         src={image}
//                         alt={`Final ${index}`}
//                         style={{ width: '100px', margin: '5px', cursor: 'pointer' }}
//                         onClick={() => handleImageClick(image)}
//                       />
//                     ))}
//                   </Box>
//                 </Box>

//                 <Box mt={2}>
//                   <Typography sx={{ textAlign: "left" }} variant="body1"><strong>Información Adicional:</strong></Typography>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     placeholder="Escribe información adicional aquí..."
//                     value={additionalInfo}
//                     onChange={(e) => setAdditionalInfo(e.target.value)}
//                     InputProps={{
//                       endAdornment: <VoiceInputNoFormik onTextChange={handleAdditionalInfoChange} />,
//                     }}
//                   />
//                 </Box>

//                 {project && (
//                   <CreatePDFButton
//                     project={project}
//                     tasks={[task]}
//                     additionalInfo={additionalInfo}
//                     fileName={`reporte_${project.projectName}_${task.taskName}.pdf`}
//                   />
//                 )}
//               </Box>
//             </Collapse>
//           </Box>
//         ))
//       )}

//       <Modal open={modalOpen} onClose={handleCloseModal}>
//         <Box display="flex" justifyContent="center" alignItems="center" height="100vh" onClick={handleModalClick}>
//           <img src={selectedImage} alt="Selected" style={{ maxWidth: '90%', maxHeight: '90%' }} />
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// SectionsAndTasks.propTypes = {
//   projectId: PropTypes.string,
//   sectionKey: PropTypes.string,
//   taskData: PropTypes.array,
//   setTaskData: PropTypes.func,
// };





