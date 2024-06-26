export const deleteProject = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:3000/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
  
      if (!response.ok) {
        throw new Error('No se pudo eliminar el proyecto');
      }
      return projectId;
    
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);

      
    }
  };
  