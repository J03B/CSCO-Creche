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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";

import { useMutation } from "@apollo/client";
import { REDONATE_CRECHE } from "../../utils/mutations";

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
}) => {
  const [expanded, setExpanded] = useState(false);
  const [ redonateCreche ] = useMutation( REDONATE_CRECHE );
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (!creches.length) {
    return <Typography variant="h3" className="mainCard__heading">No Creches Donated Yet</Typography>;
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
  }

  return (
    <Box sx={{ width: "100%" }}>
      {showTitle && <Typography variant="h3" align="center">{title}</Typography>}
      <Grid container rowSpacing={1} columnSpacing={1}>
        {creches &&
          creches.map((creche) => (
            <Grid key={creche._id} item xs={12} sm={6} lg={4}>
              <Card sx={{ m: 2 }}>
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
                <CardMedia
                  component="img"
                  height="194"
                  image={process.env.NODE_ENV === "production" ? `${creche.crecheImage}` : `images/${creche.crecheImage}`}
                  alt={creche.crecheTitle}
                />
                <CardActions sx={{ justifyContent: "space-between" }} disableSpacing>
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                  
                  { (!creche.yearsDonated.includes(currentYear) && redonateOption) ? (
                    <Button id={`Redonate-${creche._id}`} variant="contained" size="small" onClick={useRedonate}>
                    Contribute to {currentYear}
                  </Button>
                  ) : (
                    <>{" "}</>
                  )}

                </CardActions>
                <Collapse in={expanded} timeout={"auto"} unmountOnExit>
                  <CardContent>
                    <Typography>
                      <b>Origin:</b> {creche.crecheOrigin}
                    </Typography>
                    <Typography>
                      <b>Description:</b> {creche.crecheDescription}
                    </Typography>
                    {showUsername ? (
                      <Link
                        className="text-light"
                        to={`/profiles/${creche.crecheUser}`}
                      >
                        {creche.crecheUser} contributed this creche on{" "}
                        {creche.createdAt}
                      </Link>
                    ) : (
                      <Typography variant="caption">
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
