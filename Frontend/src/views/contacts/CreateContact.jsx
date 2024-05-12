
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import NewContactFormSchema from '../../forms/Contactos/NewContactSchema';

import { handleSubmitContact } from '../../api'; 

export default function CreateContact() {
  const navigate = useNavigate();
  const initialValues = {
    category: "",
    contactName: "",
    company: "",
    address: "",
    email: "",
    phone: "",
    comments: ""
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NewContactFormSchema}
      onSubmit={(values, actions) => {
        handleSubmitContact (values).then(() => {
          console.log(values);
          actions.setSubmitting(false);
          actions.resetForm();
          alert("Contacto creado correctamente");
          navigate("/contacts");
        }).catch(error => {
          console.error("Error en el proceso: ", error);
          actions.setSubmitting(false);
        });
      }}
    >
      {({ isSubmitting, setFieldValue, values, errors }) => (
        <Form>
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              maxWidth: "800px",
              margin: "2em auto",
              flexDirection: "column",
              boxShadow: "shadow-custom",
              color: "#021F59",
              padding: 2
            }}
          >
            <Typography variant="h6" sx={{ textAlign: 'center' }}>Crear Contacto</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  name="category"
                  value={values.category}
                  onChange={event => setFieldValue("category", event.target.value)}
                  displayEmpty
                >
                  <MenuItem value=""><em>Selecciona una categoría</em></MenuItem>
                  <MenuItem value="client">Cliente</MenuItem>
                  <MenuItem value="company">Empresa</MenuItem>
                  <MenuItem value="vendor">Proveedor</MenuItem>
                  <MenuItem value="contractor">Subcontratista</MenuItem>
                  <MenuItem value="employee">Trabajador</MenuItem>
                  <MenuItem value="other">Otra</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Field as={TextField} label="Empresa" name="company" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Field as={TextField} label="Dirección" name="address" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Field as={TextField} label="Email" name="email" fullWidth placeholder="Ejemplo: juan@gmail.com" />
              </Grid>
              <Grid item xs={12}>
                <Field as={TextField} label="Teléfono" name="phone" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Field as={TextField} label="Comentarios" name="comments" fullWidth multiline rows={3} />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  Crear Contacto
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
}