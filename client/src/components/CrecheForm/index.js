import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { ADD_CRECHE } from "../../utils/mutations";

import Auth from "../../utils/auth";

const CrecheForm = () => {
  const [crecheFields, setCrecheFields] = useState({
    crecheTitle: "",
    crecheDescription: "",
    crecheOrigin: "",
    crecheImage: null,
    yearsDonated: [2023],
  });
  const [expanded, setExpanded] = useState(true);
  const [characterCount, setCharacterCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); // Store the selected image
  const [submitSnackbar, setSubmitSnackbar] = useState(false);
  const [addCreche, { error }] = useMutation(ADD_CRECHE);

  const handleFileUpload = (e) => {
    if (!e.target.files) {
      return;
    }

    const selectedFile = e.target.files[0];
    setSelectedImage(URL.createObjectURL(selectedFile)); // Store and display the selected image
    setCrecheFields({ ...crecheFields, crecheImage: selectedFile }); // Store the image file in your form data
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("submitting data...");

    try {
      const { data } = await addCreche({
        variables: {
          crecheTitle: crecheFields.crecheTitle,
          crecheDescription: crecheFields.crecheDescription,
          crecheOrigin: crecheFields.crecheOrigin,
          crecheImage: crecheFields.crecheImage,
          yearsDonated: crecheFields.yearsDonated,
        },
      });
      console.log(data);

      setCrecheFields({
        ...crecheFields,
        crecheTitle: "",
        crecheDescription: "",
        crecheOrigin: "",
        crecheImage: null,
      });
      setSelectedImage(null);
      setSubmitSnackbar(true);

    } catch (err) {
      console.log(crecheFields);
      console.error(err);
      
    } finally {
      const fileInput = document.getElementById("crecheImageInput");
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSubmitSnackbar(false);
  };

  const snackbarAction = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "crecheDescription" && value.length <= 280) {
      setCrecheFields({ ...crecheFields, [name]: value });
      setCharacterCount(value.length);
    }
    if (name !== "crecheDescription") {
      setCrecheFields({ ...crecheFields, [name]: value });
    }
  };

  const handlePanelChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handlePanelChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Contribute</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Contribute a creche to the event
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Auth.loggedIn() ? (
            <>
              <Box
                component="form"
                sx={{ display: "flex", flexWrap: "wrap" }}
                onSubmit={handleFormSubmit}
              >
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <TextField
                    name="crecheTitle"
                    placeholder="Write the title of the Creche..."
                    label="Title"
                    value={crecheFields.crecheTitle}
                    sx={{ m: 1 }}
                    onChange={handleChange}
                  ></TextField>
                  <TextField
                    name="crecheDescription"
                    placeholder="Describe this new creche..."
                    label="Description"
                    value={crecheFields.crecheDescription}
                    sx={{ m: 1 }}
                    multiline
                    onChange={handleChange}
                  ></TextField>
                  <Typography
                    variant="caption"
                    className={`mr-2 ${
                      characterCount === 280 || error ? "text-danger" : ""
                    }`}
                    sx={{ textAlign: "right" }}
                  >
                    Character Count: {characterCount}/280
                  </Typography>
                  {/* Display the selected image */}
                  {selectedImage && (
                    <Box sx={{ marginTop: 1, marginBottom: 0, mx: "auto" }}>
                      <img
                        id="uploadImagePreview"
                        src={selectedImage}
                        alt="Selected Creche"
                        style={{
                          width: "94%",
                          maxWidth: "400px",
                          marginTop: "5px",
                          marginLeft: "8px",
                          marginRight: "8px",
                        }}
                      />
                    </Box>
                  )}
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mx: 1, marginBottom: 1 }}
                  >
                    Upload Image
                    <VisuallyHiddenInput
                      id="crecheImageInput"
                      name="crecheImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </Button>
                  <TextField
                    name="crecheOrigin"
                    placeholder="Where is this Creche from?"
                    label="Origin"
                    value={crecheFields.crecheOrigin}
                    sx={{ m: 1 }}
                    onChange={handleChange}
                  ></TextField>
                </FormControl>
                <div className="col-12 col-lg-3">
                  <Button variant="contained" type="submit">
                    Add Creche
                  </Button>
                </div>
                {error && <Alert severity="error">{error.message}</Alert>}
              </Box>
            </>
          ) : (
            <Typography variant="body2">
              You need to be logged in to share your creches. Please{" "}
              <Link to="/login">login</Link> or{" "}
              <Link to="/signup">signup.</Link>
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
      <Snackbar
        open={submitSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
        action={snackbarAction}
      />
    </div>
  );
};

export default CrecheForm;
