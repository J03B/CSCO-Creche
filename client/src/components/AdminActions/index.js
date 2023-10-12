import React, { useState } from "react";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useQuery } from "@apollo/client";
import { QUERY_USERS_BY_YEAR, QUERY_ALL_USERS } from "../../utils/queries";

const AdminActions = () => {
  const { loading: loadingByYear, error: errorByYear, data: dataByYear} = useQuery(QUERY_USERS_BY_YEAR, {
    variables: { year: 2023 }
  });
  const { loading: loadingAll, error: errorAll, data: dataAll} = useQuery(QUERY_ALL_USERS);
  const users2023 = dataByYear?.usersByYear || {};
  const usersAll = dataAll?.allUsers || {};
  console.log(users2023);
  console.log(usersAll);
  console.log(errorByYear);

  function createData(id, name, description, button, action) {
    return { id, name, description, button, action };
  }

  function email2023() {
    window.location.href = `mailto:`;
  }
  function emailPrevious() {}
  function emailAll() {
    let mailtoList = "";
    usersAll.forEach(user => {
      mailtoList += user.email + ";"
    });
    console.log("Mailing to: " + mailtoList);
    window.location.href = `mailto:${mailtoList}`;
  }
  function viewAllUsers() {}
  function grantAdmin() {}

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
      "Grant admin",
      "Grant users admin privileges (these actions).",
      "Authorize",
      grantAdmin
    ),
  ];

  return (
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
  );
};

export default AdminActions;
