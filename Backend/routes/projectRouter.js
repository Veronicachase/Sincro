const express = require("express");
const upload = require('../public/cloudinary/uploadMiddleware');
const {
  addProject,
  getProject,
  getAllProjects,
  deleteProject,
  updateProject,
  updateSection,
  deleteSection,
  addSection,
  getSections
} = require("../controllers/projectController");


const projectRouter = express.Router();

projectRouter.get("/:projectId", getProject);
projectRouter.get("/", getAllProjects);
projectRouter.post("/", upload.single("image"), addProject);
projectRouter.delete("/:projectId", deleteProject);
projectRouter.patch("/:projectId",upload.single("image"), updateProject);
/* Estas rutas son específicas para manejar las secciones (editar, borrar y agragar una sección (JSON) dentro de projects) */
projectRouter.post("/:projectId/sections", addSection);
projectRouter.patch("/:projectId/sections/:sectionKey", updateSection);
projectRouter.delete("/:projectId/sections/:sectionKey", deleteSection);
projectRouter.get("/:projectId",getSections );
module.exports = projectRouter;
