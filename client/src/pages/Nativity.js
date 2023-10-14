import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";

const itemData = [
  {
    img: "/images/nativity/creche-m0037.png",
    title: "Angelic Voices",
  },
  {
    img: "/images/nativity/creche-m0047.png",
    title: "A New Star",
  },
  {
    img: "/images/nativity/creche-m0048.png",
    title: "The Wise Men",
  },
  {
    img: "/images/nativity/creche-m0051.png",
    title: "Mother Mary",
  },
  {
    img: "/images/nativity/creche-m0055.png",
    title: "Away in a Manger",
  },
  {
    img: "/images/nativity/creche-m0056.png",
    title: "To Bethlehem",
  },
];

const Nativity = () => {
  return (
    <ImageList >
      <ImageListItem key="Subheader" cols={2}>
        <ListSubheader component="div">Previous Live Nativity Images</ListSubheader>
      </ImageListItem>
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img
            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.img}?w=248&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.title}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default Nativity;
