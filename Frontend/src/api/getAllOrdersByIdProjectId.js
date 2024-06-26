export const getAllOrdersByProjectId = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${projectId}`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Pedidos cargadas correctamente:", data);
        return data;
      } else {
        throw new Error('Fallo en cargar las pedidos: ' + response.status);
      }
    } catch (error) {
      console.error("Error al obtener tus pedidos:", error);
      throw error;
    }
  };