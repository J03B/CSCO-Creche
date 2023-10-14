import React from "react";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";

import CrecheForm from "../components/CrecheForm";
import CrecheList from "../components/CrecheList";
import AdminActions from "../components/AdminActions";

import { QUERY_ME } from "../utils/queries";

import Auth from "../utils/auth";

const Profile = () => {
  const {
    loading: loadingMe,
    error: errorMe,
    data: dataMe,
  } = useQuery(QUERY_ME);
  const user = dataMe?.me || {};

  if (loadingMe) {
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

  if (errorMe) {
    console.log(errorMe);
    window.location.assign("login");
    return (
      <Stack spacing={1}>
        <Typography variant="h1">ERROR</Typography>
        <Skeleton animation="wave" variant="text" sx={{ fontSize: "1rem" }} />
      </Stack>
    );
  }
  console.log(user);

  if (!user.userName) {
    return (
      <Typography variant="h4">
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </Typography>
    );
  }

  return (
    <div>
      <div className="flex-row justify-center my-3">
        <Typography variant="h2" className="mainCard__heading">
          Viewing {user ? `${user.firstName}'s` : "your"} profile
        </Typography>
        {dataMe && (
          <div className="col-12 col-md-10 mb-3 p-3">
            <CrecheForm />
          </div>
        )}

        {user.role === "admin" ? (
          <div className="col-12 col-md-10 mb-3 p-3">
            <Typography variant="h5" align="center" className="mainCard__heading">
              Admin Actions
            </Typography>
            <AdminActions />
          </div>
        ) : (
          <></>
        )}

        <div className="col-12 col-md-10 mb-5">
          {user.creches ? (
            <CrecheList
              creches={user.creches}
              title={`${user.userName}'s creches...`}
              showTitle={false}
              showUsername={false}
              redonateOption={true}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
