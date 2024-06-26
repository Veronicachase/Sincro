export const getHoursWorked = async (employeeId, startDate, endDate) => {
    try {
      const response = await fetch(`http://localhost:3000/hours/${employeeId}?start=${startDate}&end=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching hours worked:", error);
      throw error;
    }
  };
  