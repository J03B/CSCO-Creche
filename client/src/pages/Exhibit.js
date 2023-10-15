import React, { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import CrecheList from "../components/CrecheList";

// Import the `useParams()` hook
import { useQuery } from "@apollo/client";
import { QUERY_EXHIBIT } from "../utils/queries";

const Exhibit = () => {
  const [yearState, setYearState] = useState(2023);
  const { loading, error, data } = useQuery(QUERY_EXHIBIT, {
    variables: { exhibitYear: yearState },
  });

  const exhibit = data?.exhibit || {};

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

  const handleYearChange = (e) => {
    setYearState(e.target.value);
  };
  console.log(exhibit);

  return (
    <div>
      <div className="flex-row justify-center mb-3">
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="select-exhibit-year-label">Year</InputLabel>
          <Select
            labelId="select-exhibit-year-label"
            id="select-exhibit-year"
            value={yearState}
            label="Year"
            onChange={handleYearChange}
          >
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2022}>2022</MenuItem>
            <MenuItem value={2021}>2021</MenuItem>
          </Select>
        </FormControl>
        {exhibit.creches ? (
          <CrecheList
            creches={exhibit.creches}
            title={`${
              exhibit.creches.length === 1
                ? exhibit.creches.length + " creche"
                : exhibit.creches.length + " creches"
            } in ${yearState}'s Exhibit`}
            showTitle={true}
            showUsername={true}
          />
        ) : (
          <>None</>
        )}
      </div>
    </div>
  );
};

export default Exhibit;
