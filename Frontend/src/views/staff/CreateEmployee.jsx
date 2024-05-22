// aqui hay que  crear una vista 'crear trabajador', que llevará la fecha actual,

import { Formik, Form } from "formik";
import { initialValues } from "../../forms/Trabajadores/crearTrabajador/InitialValues.js";
import { CrearTrabajadorFormSchema } from "../../forms/Trabajadores/crearTrabajador/CrearTrabajadorFormSchema.js";
import { Grid, Box, Button } from "@mui/material";
import CustomTextField from "../../ui/CustomTextField.jsx";
import "../../assets/styles/estilosGenerales.css";
import MyButton from "../../components/MyButton.jsx";
import { ToggleButtonGroup } from "@mui/material";
import { ToggleButton } from "@mui/material";

/* Aquí se crea a un trabajador */
/* Falta arreglar botones, confirmar formato de fecha, y darle estilos a hoja, confirmar si los botones guardan la info */

function CrearTrabajador() {
  

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CrearTrabajadorFormSchema}
      onSubmit={(values, actions) => {
        console.log(values);
        actions.setSubmitting(false);
        actions.resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              maxWidth: "800px",
              margin: "2em auto",
              flexDirection: "column",
              boxShadow: "1px 2px 3px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Grid
              container
              spacing={4}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={10} sm={10}>
                <CustomTextField
                  name="Fecha"
                  type="date"
                  label="Fecha"
                  placeholder="Fecha"
                  sx={{backgroundColor:"#ffffff4d"}}
                 
                />
              </Grid>

              <Grid item xs={5} sm={10}>
                <CustomTextField
                  name="nombre"
                  type="text"
                  label="Nombre"
                  placeholder="Nombre"
                  sx={{backgroundColor:"#ffffff4d"}}
                  
                />
              </Grid>
              <Grid item xs={5} sm={10}>
                <CustomTextField
                  name="apellidos"
                  type="text"
                  label="Apellidos"
                  placeholder="Apellidos"
                  sx={{backgroundColor:"#ffffff4d"}}
                  
                />
              </Grid>
              <Grid item xs={10} sm={10}>
                <CustomTextField
                  name="posicion"
                  type="text"
                  label="Posición"
                  placeholder="Posición"
                  sx={{backgroundColor:"#ffffff4d"}}
              
                />
              </Grid>
              <Grid item xs={10} sm={10}>
                <CustomTextField
                  name="obra"
                  type="text"
                  label="Obra"
                  placeholder="Obra"
                 
                  sx={{backgroundColor:"#ffffff4d"}}
                 
                />
              </Grid>
              <Grid>
                <p>Equipo Reglamentario Entregado</p>
                <ToggleButtonGroup sx={{ gap: "2em", marginTop: "2em" }}>
                  <ToggleButton
                    sx={{ backgroundColor: "#8BB443", color: "white" }}
                    value=" SI"
                  >
                    SI
                  </ToggleButton>
                  <ToggleButton
                    sx={{ backgroundColor: "#F25244", color: "white" }}
                    value=""
                  >
                    NO
                  </ToggleButton>
                  <ToggleButton
                    sx={{ backgroundColor: "#F2CB05", color: "white" }}
                    value=" incompleto"
                  >
                    Incompleto
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={10}>
                <CustomTextField
                  name="detallesDelTrabajador"
                  type="text"
                  label="Comentarios"
                  placeholder="Comentarios"
                  sx={{backgroundColor:"#ffffff4d"}}
                 
                />
              </Grid>
              
              <Button type="submit" variant="outlined" sx={{marginTop:"2em", color:"#fff", border:"1px solid #fff"}}>Agregar Trabajador</Button>
             
              <Grid item xs={12}></Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default CrearTrabajador;
