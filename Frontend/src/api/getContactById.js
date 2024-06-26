export const getContactById = async (contactId) => {
    try {
      const response = await fetch(`http://localhost:3000/contacts/${contactId}`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Contacto obtenido correctamente:", data);
        return data;
      } else {
        throw new Error('Failed to get contact with status: ' + response.status);
      }
    } catch (error) {
      console.error("Error al obtener el contacto:", error);
      throw error;
    }
  };