import React, { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

//Table components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";

import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ALL_USERS } from "../../utils/queries";
import { GRANT_ADMIN } from "../../utils/mutations";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const UserInfo = ({ open, setOpen, newAdminOption }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const { loading, data } = useQuery(QUERY_ALL_USERS);
  const [ grantAdminMutation ] = useMutation(GRANT_ADMIN);
  const userData = data?.allUsers || {};

  if (loading) {
    return <></>;
  }

  function createDataRow(name, phone, email, ward, role) {
    return { name, phone, email, ward, role };
  }
  const rows = [];
  userData.forEach((user) => {
    rows.push(
      createDataRow(
        user.userName,
        user.phoneNumber,
        user.email,
        user.wardName,
        user.role
      )
    );
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // Handle granting admin access to selected users
  function grantAdminAccess() {
    console.log("Selected user for admin access: ", selectedValue);
    const { data } = grantAdminMutation({
      variables: {
        email: selectedValue,
      },
    });
    handleClose();
    console.log(data);
  }

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={"xl"}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          All User Data
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
          {/** Adding the rows of User Data */}
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {newAdminOption ? (
                    <>
                      <TableCell>Grant</TableCell>
                      <TableCell align="right">Name</TableCell>
                    </>
                  ) : (
                    <TableCell>Name</TableCell>
                  )}
                  <TableCell align="right">Phone Number</TableCell>
                  <TableCell align="right">email</TableCell>
                  <TableCell align="right">Ward</TableCell>
                  <TableCell align="right">Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {newAdminOption ? (
                      <>
                        <TableCell component="th" scope="row">
                          <Radio
                            id="radio-grant-admin"
                            checked={selectedValue === row.email}
                            onChange={handleChange}
                            value={row.email}
                            name="radio-buttons"
                            inputProps={{ "aria-label": row.email }}
                          />
                        </TableCell>
                        <TableCell align="right">{row.name}</TableCell>
                      </>
                    ) : (
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                    )}
                    <TableCell align="right">{row.phone}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.ward}</TableCell>
                    <TableCell align="right">{row.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          {newAdminOption && (
            <Button variant="contained" autoFocus onClick={grantAdminAccess}>
              Grant Admin
            </Button>
          )}
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

export default UserInfo;
