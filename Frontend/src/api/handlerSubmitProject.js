export const handleSubmitProject = async (values) => {    
  console.log('se ejecuta el submit');
    try {
      const response = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Datos del formulario enviados correctamente:", data);
        return data;
      } else {
        throw new Error('Failed to submit form data with status: ' + response.status);
      }
    } catch (error) {
      console.error("Error al enviar datos del formulario", error);
    }
  };