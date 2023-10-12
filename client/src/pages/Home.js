import React from "react";

// Material UI Components being used
import Stack from "@mui/material/Stack";
import CrecheForm from "../components/CrecheForm";
import InfoCard from "../components/InfoCard";

const Home = () => {
  return (
    <main>
      <div className="flex-row justify-center">
        <div className="col-12 col-md-10 mb-3 p-3">
          <CrecheForm />
        </div>

        {/* Adding cards from the invitiation */}
        <Stack direction="row" spacing={2}>
          <InfoCard
            infoTitle="Event Information"
            card1Title="Creche Exhibit"
            card2Title="Live Nativity"
            card3Title="Christmas Concert"
            card1Date="Nov 30 - Dec 2: until 8pm"
            card2Date="December 1-2: 6, 6:30, 7pm"
            card3Date="December 10: 5pm, 7pm"
            imagePath="/static/media/crecheExhibit.jpg"
            card1Description="Experience the inspirational events of the nativity as you explore the path of hundreds of creches (nativity scenes) from around the world. The scene is set. Be a part of the greatest story ever told. Please consider donating a creche of your own as well."
            card2Description="Immerse yourself among real sheep and cattle as Mary and Joseph make their way to the stable of Bethlehem. Welcome the Christ child in a manger in this performance of the Live Nativity. Warm clothing recommended. Hot cocoa provided."
            card3Description="Held in the chapel sanctuary, our large choir and orchestra perform some of the most beloved Christmas carols. Feel the love and joy the Savior brings as we reflect on his birth and ring in the season through beautiful and inspirational music in the production of Joy! Finding Lasting Joy in Christ."
          />
        </Stack>

      </div>
    </main>
  );
};

export default Home;
