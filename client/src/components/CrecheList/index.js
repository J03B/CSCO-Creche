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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";

import { useMutation } from "@apollo/client";
import { REDONATE_CRECHE } from "../../utils/mutations";
import { EDIT_CRECHE } from "../../utils/mutations";

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
}) => {
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState({
    id: "",
    title: "",
    origin: "",
    description: "",
  });
  const [redonateCreche] = useMutation(REDONATE_CRECHE);
  const [editCreche] = useMutation(EDIT_CRECHE);
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
    console.log(e.target.parentElement);
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

    console.log(editMode);
  };

  const cancelEdits = () => {
    setEditMode({
      id: "",
      title: "",
      origin: "",
      description: "",
    });
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
      const {data} = await editCreche({
        variables: {
          crecheId: editMode.id, crecheTitle: editMode.title, crecheOrigin: editMode.origin, crecheDescription: editMode.description
        },
      });
      console.log(`Reloading page to display changes for creche titled: ${data.crecheTitle}`);
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
                        <TextField
                          label="Description"
                          name="description"
                          value={editMode.description}
                          size="small"
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
