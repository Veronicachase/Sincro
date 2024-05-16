import { useLocation } from "react-router-dom";

export default function UsePageTitle() {
  const location = useLocation();
  const pathDir = {
    "/login": "",
    "/create-new-project": "Nuevo Proyecto",
    "/my-projects": "Mis Proyectos",
    "/project-info/:projectId"  : "Información del Proyecto",
    "/project-section-tasks":"Tareas",
    "/project-info-task/${projectId}/${sectionKey}":"Crear tarea",
    "/project-info-task/:sectionKey":"Tarea",
    "/pendings" : "Mis pendientes",
    "/progress": "Avances de Proyecto",
    "/material": "Material y pedidos",
    "/contacts": "Contactos",
    "/staff-list": "Lista de trabajadores",
    "/create-employee": "Crear Trabajador",
    "/employee" : "Trabajador",
    "/reports": "Report",
  };

  return pathDir[location.pathname] || "PÁGINA NO ENCONTRADA";
}


