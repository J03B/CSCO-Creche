import React, { useState } from "react";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Snackbar from '@mui/material/Snackbar';
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';

import UserInfo from "./UserInfo";
import { useQuery } from "@apollo/client";
import { QUERY_USERS_BY_YEAR, QUERY_ALL_USERS, QUERY_EXHIBIT } from "../../utils/queries";

const AdminActions = () => {
  const [ openUserInfo, setOpenUserInfo ] = useState(false);
  const [ grantAdminOption, setGrantAdminOption ] = useState(false);
  const [ exhibitCopied, setExhibitCopied ] = useState(false);
  const currentYear = process.env.CURRENT_YEAR || 2023;

  const { data: dataByYear } = useQuery(
    QUERY_USERS_BY_YEAR,
    {
      variables: { year: 2023, include: true },
    }
  );
  const { data: dataByNotYear } = useQuery(
    QUERY_USERS_BY_YEAR,
    {
      variables: { year: 2023, include: false },
    }
  );
  const { data: dataAll } = useQuery(QUERY_ALL_USERS);
  const { data: dataExhibit } = useQuery(QUERY_EXHIBIT, { variables: { exhibitYear: currentYear }})
  const users2023 = dataByYear?.usersByYear || {};
  const usersNot2023 = dataByNotYear?.usersByYear || {};
  const usersAll = dataAll?.allUsers || {};
  const exhibitData = dataExhibit?.exhibit || {};

  function createData(id, name, description, button, action) {
    return { id, name, description, button, action };
  }

  // Email 2023 users
  function email2023() {
    let mailtoList = "";
    users2023.forEach((user) => {
      mailtoList += user.email + ";";
    });
    console.log("Mailing to: " + mailtoList);
    window.location.href = `mailto:${mailtoList}`;
  }

  // Email users not in 2023 creche
  function emailPrevious() {
    let mailtoList = "";
    usersNot2023.forEach((user) => {
      mailtoList += user.email + ";";
    });
    console.log("Mailing to: " + mailtoList);
    window.location.href = `mailto:${mailtoList}`;
  }

  // Email all users
  function emailAll() {
    let mailtoList = "";
    usersAll.forEach((user) => {
      mailtoList += user.email + ";";
    });
    console.log("Mailing to: " + mailtoList);
    window.location.href = `mailto:${mailtoList}`;
  }

  // View all Users
  function viewAllUsers() {
    setGrantAdminOption(false);
    setOpenUserInfo(true);
  }

  // Grant admin access to individual users
  function grantAdmin() {
    setGrantAdminOption(true);
    setOpenUserInfo(true);
  }

  // Copy the Exhibit Details
  function copyExhibit() {
    let copyClipboard = "";
    exhibitData.creches.forEach((creche) => {
      copyClipboard += `Title: ${creche.crecheTitle}\nOrigin: ${creche.crecheOrigin}\nDonor: ${creche.crecheUser}\n\n\n`;
    });
    navigator.clipboard.writeText(copyClipboard);
    setExhibitCopied(true);
  }
  const closeCopyExhibit = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setExhibitCopied(false);
  };
  const copyAction = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={closeCopyExhibit}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  // Delete Action
  function deleteCreche() {

  }

  const rows = [
    createData(
      1,
      "Email 2023 Users",
      "Email all users donating to the 2023 exhibit",
      "Email",
      email2023
    ),
    createData(
      2,
      "Email Previous Users",
      "Email all users who haven't donated to the 2023 exhibit",
      "Email",
      emailPrevious
    ),
    createData(
      3,
      "Email all users",
      "Email all users in the database.",
      "Email",
      emailAll
    ),
    createData(
      4,
      "View Users",
      "View all user details (name, phone number, email, ward, years donating)",
      "View",
      viewAllUsers
    ),
    createData(
      5,
      "Grant",
      "Grant users admin privileges (these actions).",
      "Authorize",
      grantAdmin
    ),
    createData(
      6,
      "Copy Exhibit",
      "Copies the Exhibit details for the selected year (Title, Donor, Origin, Phone).",
      "Copy",
      copyExhibit,
    ),
    createData(
      7,
      "Delete Creche",
      "Deletes a selected creche from the exhibit.",
      "Delete",
      deleteCreche,
    ),
  ];

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ width: "33%", flexShrink: 0 }}>
          Admin Actions
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Expand to view all admin action options
        </Typography>
      </AccordionSummary>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Submit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">
                  <Button onClick={row.action}>{row.button}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UserInfo open={ openUserInfo } setOpen={ setOpenUserInfo } newAdminOption={ grantAdminOption } />
      <Snackbar
        open={exhibitCopied}
        autoHideDuration={6000}
        onClose={closeCopyExhibit}
        message="Exhibit copied to clipboard"
        action={copyAction}
      />
    </Accordion>
  );
};

export default AdminActions;
