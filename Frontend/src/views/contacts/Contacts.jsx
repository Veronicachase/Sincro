import {
  Box,
  Typography,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllContacts } from "../../api/getAllContacts";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function Contacts() {
  const [open, setOpen] = useState({});
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        console.log("Llamando a getAllContacts desde el frontend");
        const allContacts = await getAllContacts();
        console.log("Contactos cargados correctamente:", allContacts);

        // Agrupar contactos por categoría
        const groupedContacts = allContacts.reduce((acc, contact) => {
          const category = contact.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(contact);
          return acc;
        }, {});

        setData(groupedContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const toggleCollapse = (categoryName) => {
    setOpen((prev) => ({ ...prev, [categoryName]: !prev[categoryName] }));
  };

  if (!data || Object.keys(data).length === 0) {
    return <Typography>No hay contactos disponibles</Typography>;
  }

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginBottom={5}
        marginTop="2em"
      >
        <Button
          variant="outlined"
          onClick={() => navigate(`/create-contact`)}
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            ":hover": { backgroundColor: "#115293" },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body" paddingRight={1}>
            Agregar contacto
          </Typography>
          <AddCircleIcon />
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Box sx={{ width: "80%" }}>
          {Object.keys(data).map((category) => (
            <Paper
              key={category}
              sx={{
                marginBottom: 2,
                backgroundColor: "#fff",
                borderRadius: "10px",
                transition: "transform 0.3s, box-shadow 0.3s",
                ":hover": {
                  transform: "scale(1.01)",
                  boxShadow: 3,
                },
              }}
            >
              <Box
                onClick={() => toggleCollapse(category)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1em",
                  cursor: "pointer",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h6">{category}</Typography>
                <IconButton>
                  {open[category] ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </IconButton>
              </Box>
              <Collapse in={open[category]} timeout="auto" unmountOnExit>
                <List>
                  {data[category].map((contactItem) => (
                    <ListItem
                      key={contactItem.contactId}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1em",
                        ":hover": {
                          backgroundColor: "#e0f7fa",
                        },
                      }}
                    >
                      <ListItemText primary={contactItem.contactName} />
                      <IconButton
                        onClick={() =>
                          navigate(`/contact-details/${contactItem.contactId}`)
                        }
                      >
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  );
}


// import { Box, Typography, IconButton, Collapse, List, ListItem, ListItemText } from '@mui/material';
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAllContacts } from '../../api/getAllContacts';

// export default function Contacts() {
//   const [open, setOpen] = useState({});
//   const [data, setData] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const allContacts = await getAllContacts();
//         setData(allContacts);
//       } catch (error) {
//         console.error("Error fetching contacts:", error);
//       }
//     };

//     fetchContacts();
//   }, []);

//   const toggleCollapse = (categoryName) => {
//     setOpen(prev => ({ ...prev, [categoryName]: !prev[categoryName] }));
//   };

//   return (
//     <Box>
//       {data.map((contactCategory) => (
//         <Box key={contactCategory.category} sx={{ marginBottom: 2 }}>
//           <IconButton onClick={() => toggleCollapse(contactCategory.category)} sx={{ width: '100%', justifyContent: 'space-between' }}>
//             <Typography variant="h6">{contactCategory.category}</Typography>
//             {open[contactCategory.category] ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
//           </IconButton>
//           <Collapse in={open[contactCategory.category]} timeout="auto" unmountOnExit>
//             <List>
//               {contactCategory.items.map((contactItem) => (
//                 <ListItem key={contactItem.contactId} sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <ListItemText primary={contactItem.contactName} />
//                   <IconButton onClick={() => navigate(`/contact-details/${contactItem.contactId}`)}>
//                     <ArrowForwardIosIcon />
//                   </IconButton>
//                 </ListItem>
//               ))}
//             </List>
//           </Collapse>
//         </Box>
//       ))}
//     </Box>
//   );
// }
