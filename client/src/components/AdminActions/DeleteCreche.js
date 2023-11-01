import React, { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CrecheList from "../CrecheList";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_EXHIBIT } from "../../utils/queries";
import { REMOVE_CRECHE } from "../../utils/mutations";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const DeleteCreche = ({ open, setOpen }) => {
  const [yearState] = useState(2023);
  const { loading, error, data } = useQuery(QUERY_EXHIBIT, {
    variables: { exhibitYear: yearState },
  });
  const [removeCreche] = useMutation(REMOVE_CRECHE);
  const exhibitData = data?.exhibit || {};

  if (loading) {
    return (
      <Stack spacing={1}>
        {/* For variant="text", adjust the height via font-size */}
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        {/* For other variants, adjust the size with `width` and `height` */}
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={210} height={60} />
        <Skeleton variant="rounded" width={210} height={60} />
      </Stack>
    );
  }

  if (error) {
    console.log(error);
    return (
      <Stack spacing={1}>
        <Typography variant="h1">ERROR</Typography>
        <Skeleton animation="wave" variant="text" sx={{ fontSize: "1rem" }} />
      </Stack>
    );
  }

  const handleClose = () => {
    setOpen(false);
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
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={"xl"}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          All Creches in Exhibit
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {/** Adding the creches to choose from */}
          <CrecheList
            deleteModeEnabled={true}
            showTitle={false}
            creches={exhibitData.creches}
            deleteFunction={handleDelete}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

export default DeleteCreche;
