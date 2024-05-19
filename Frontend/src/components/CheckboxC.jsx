import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, FormGroup, Grid, Box } from '@mui/material';

export default function CheckboxC({ setFieldValue, values }) {
  const secciones = [
    { label: "Salón", name: "livingRoom" },
    { label: "Cocina", name: "kitchen" },
    { label: "Pasillo", name: "hall" },
    { label: "Habitación ", name: "room" },
    { label: "Baño", name: "bathRoom" },
    { label: "Terraza", name: "terrace" },
    { label: "Lavandería", name: "laundry" },
    { label: "Piscina", name: "pool" },
    { label: "Techo", name: "roof" }
  ];

  const handleChange = (name) => (event) => {
    const newSections = { ...values.sections, [name]: event.target.checked };
    
    setFieldValue('sections', newSections);
  };

  return (
    <FormGroup>
      <Grid container spacing={2}>
        {secciones.map((seccion) => (
          <Grid item xs={6} key={seccion.name}>
            <Box sx={{ backgroundColor: "#edf5f4", borderRadius: "10px", padding: "8px", display: 'flex', alignItems: 'center', justifyContent: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.sections[seccion.name] || false}
                    onChange={handleChange(seccion.name)}
                  />
                }
                label={seccion.label}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </FormGroup>
  );
}
CheckboxC.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.shape({
    sections: PropTypes.object.isRequired,
  }).isRequired,
};