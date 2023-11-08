import React, { useState } from "react";
import {
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  Grid,
  Box,
  Button,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { useMutation } from "@apollo/client";
import {
  REDONATE_CRECHE,
  EDIT_CRECHE,
  REMOVE_CRECHE,
} from "../../utils/mutations";

const currentYear = process.env.CURRENT_YEAR || 2023;

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CrecheList = ({
  creches,
  title,
  showTitle = true,
  showUsername = true,
  redonateOption = false,
  editCrecheEnabled = false,
  deleteModeEnabled = false,
}) => {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState({
    id: "",
    title: "",
    origin: "",
    description: "",
    image: null,
  });
  const [selectedImage, setSelectedImage] = useState(null); // Store the selected image
  const [redonateCreche] = useMutation(REDONATE_CRECHE);
  const [editCreche] = useMutation(EDIT_CRECHE);
  const [removeCreche] = useMutation(REMOVE_CRECHE);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (!creches.length) {
    return (
      <Typography variant="h3" className="mainCard__heading">
        No Creches Donated Yet
      </Typography>
    );
  }

  // Handle file upload image display
  const handleFileUpload = (e) => {
    if (!e.target.files) {
      return;
    }

    const selectedFile = e.target.files[0];
    setSelectedImage(URL.createObjectURL(selectedFile)); // Store and display the selected image
    setEditMode({ ...editMode, image: selectedFile }); // Store the image file in your form data
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

  // Use Redonate capability
  const useRedonate = async (e) => {
    const variables = {
      crecheId: e.target.id.split("-")[1],
      yearToDonate: currentYear,
    };
    console.log(variables);
    const { data } = await redonateCreche({ variables });
    console.log(data);
    // window.location.reload();
  };

  const editIndividualCreche = (e) => {
    if (!expanded) {
      setExpanded(true);
    }
    if (e.target.id.split("-")[1]) {
      setEditMode({
        id: e.target.id.split("-")[1],
        title: e.target.getAttribute("data-title"),
        origin: e.target.getAttribute("data-origin"),
        description: e.target.getAttribute("data-description"),
      });
    } else {
      setEditMode({
        id: e.target.parentElement.id.split("-")[1],
        title: e.target.parentElement.getAttribute("data-title"),
        origin: e.target.parentElement.getAttribute("data-origin"),
        description: e.target.parentElement.getAttribute("data-description"),
      });
    }
  };

  const cancelEdits = () => {
    setEditMode({
      id: "",
      title: "",
      origin: "",
      description: "",
      image: null
    });
    setSelectedImage(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "description" && value.length <= 280) {
      setEditMode({ ...editMode, [name]: value });
    }
    if (name !== "description") {
      setEditMode({ ...editMode, [name]: value });
    }
  };

  const saveEdits = async (e) => {
    e.preventDefault();
    console.log("saving edits...");

    try {
      const { data } = await editCreche({
        variables: {
          crecheId: editMode.id,
          crecheTitle: editMode.title,
          crecheOrigin: editMode.origin,
          crecheDescription: editMode.description,
          crecheImage: editMode.image,
        },
      });
      console.log(
        `Reloading page to display changes for creche titled: ${data.crecheTitle}`
      );
    } catch (err) {
      console.log("unable to save edits");
      console.error(err);
    } finally {
      setEditMode({
        id: "",
        title: "",
        origin: "",
        description: "",
      });
      window.location.reload();
    }
  };

  // Delete Dialog handling
  const handleConfirmClickOpen = () => {
    setOpenConfirmDelete(true);
  };

  const handleConfrimClose = () => {
    setOpenConfirmDelete(false);
  };

  const handleDelete = async (e) => {
    if (e.target.id.split("-")[1]) {
      await removeCreche({
        variables: {
          crecheId: e.target.id.split("-")[1],
        },
      });
    } else {
      await removeCreche({
        variables: {
          crecheId: e.target.parentElement.id.split("-")[1],
        },
      });
    }
    window.location.reload();
  };

  return (
    <Box sx={{ width: "100%" }}>
      {showTitle && (
        <Typography variant="h3" align="center">
          {title}
        </Typography>
      )}
      <Grid container rowSpacing={1} columnSpacing={1}>
        {creches &&
          creches.map((creche) => (
            <Grid key={creche._id} item xs={12} sm={6} lg={4}>
              <Card sx={{ m: 2 }}>
                {editCrecheEnabled ? (
                  <CardHeader
                    avatar={
                      <Avatar>
                        {creche.crecheUser.split(" ")[0][0] +
                          creche.crecheUser.split(" ")[1][0]}
                      </Avatar>
                    }
                    action={
                      <IconButton
                        id={`Edit-${creche._id}`}
                        aria-label="settings"
                        onClick={editIndividualCreche}
                        data-title={creche.crecheTitle}
                        data-origin={creche.crecheOrigin}
                        data-description={creche.crecheDescription}
                      >
                        <EditIcon
                          id={`EditChild-${creche._id}`}
                          data-title={creche.crecheTitle}
                          data-origin={creche.crecheOrigin}
                          data-description={creche.crecheDescription}
                        />
                      </IconButton>
                    }
                    title={creche.crecheTitle}
                    subheader={`Contributed: ${creche.yearsDonated}`}
                  />
                ) : (
                  <CardHeader
                    avatar={
                      <Avatar>
                        {creche.crecheUser.split(" ")[0][0] +
                          creche.crecheUser.split(" ")[1][0]}
                      </Avatar>
                    }
                    title={creche.crecheTitle}
                    subheader={`Contributed: ${creche.yearsDonated}`}
                  />
                )}

                <CardMedia
                  component="img"
                  height="194"
                  image={
                    process.env.NODE_ENV === "production"
                      ? `${creche.crecheImage}`
                      : `images/${creche.crecheImage}`
                  }
                  alt={creche.crecheTitle}
                />
                <CardActions
                  sx={{ justifyContent: "space-between" }}
                  disableSpacing
                >
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>

                  {deleteModeEnabled ? (
                    <div>
                      <IconButton onClick={handleConfirmClickOpen}>
                        <DeleteForeverIcon />
                      </IconButton>
                      <Dialog
                        open={openConfirmDelete}
                        onClose={handleConfrimClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Delete Creche?"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this creche? Once
                            done, this action cannot be undone.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleConfrimClose}>Cancel</Button>
                          <Button
                            id={`Delete-${creche._id}`}
                            onClick={handleDelete}
                            variant="contained"
                            color="error"
                            autoFocus
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  ) : (
                    <></>
                  )}

                  {!creche.yearsDonated.includes(currentYear) &&
                  redonateOption ? (
                    <Button
                      id={`Redonate-${creche._id}`}
                      variant="contained"
                      size="small"
                      onClick={useRedonate}
                    >
                      Contribute to {currentYear}
                    </Button>
                  ) : (
                    <> </>
                  )}
                </CardActions>
                <Collapse in={expanded} timeout={"auto"} unmountOnExit>
                  <CardContent>
                    {/* Button to save edits if editing this creche */}
                    {editMode.id === creche._id ? (
                      <>
                        <TextField
                          label="Title"
                          name="title"
                          value={editMode.title}
                          size="small"
                          sx={{ mb: 1.5 }}
                          fullWidth
                          onChange={handleChange}
                        />
                        <TextField
                          label="Origin"
                          name="origin"
                          value={editMode.origin}
                          size="small"
                          sx={{ mb: 1.5 }}
                          fullWidth
                          onChange={handleChange}
                        />

                        {/* Display the selected image */}
                        {selectedImage && (
                          <Box
                            sx={{
                              justifyContent: "center",
                              marginTop: 1,
                              marginBottom: 0,
                              mx: "auto",
                            }}
                          >
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
                          fullWidth
                          component="label"
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          sx={{ mb: 1.5 }}
                        >
                          Change Image
                          <VisuallyHiddenInput
                            id="crecheImageInput"
                            name="crecheImage"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                        </Button>

                        <TextField
                          label="Description"
                          name="description"
                          value={editMode.description}
                          size="small"
                          sx={{ mb: 1.5 }}
                          fullWidth
                          multiline
                          onChange={handleChange}
                        />

                        <Stack>
                          <Button
                            variant="contained"
                            sx={{ mt: 1 }}
                            onClick={saveEdits}
                          >
                            Save Changes
                          </Button>
                          <Button onClick={cancelEdits}>Cancel</Button>
                        </Stack>
                      </>
                    ) : (
                      <>
                        <Typography>
                          <b>Origin:</b> {creche.crecheOrigin}
                        </Typography>
                        <Typography>
                          <b>Description:</b> {creche.crecheDescription}
                        </Typography>
                      </>
                    )}

                    {showUsername ? (
                      <Typography
                        component="p"
                        variant="caption"
                        sx={{ marginTop: 1.5, lineHeight: 1, letterSpacing: 0 }}
                      >
                        {creche.crecheUser} contributed this creche on{" "}
                        {creche.createdAt}
                      </Typography>
                    ) : (
                      <Typography
                        component="p"
                        variant="caption"
                        sx={{ marginTop: 1.5, lineHeight: 1, letterSpacing: 0 }}
                      >
                        This creche was contributed on {creche.createdAt}
                      </Typography>
                    )}
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default CrecheList;
