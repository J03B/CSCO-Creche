import React, { useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function InfoCard({
  infoTitle,
  card1Title,
  card2Title,
  card3Title,
  card1Date,
  card2Date,
  card3Date,
  imagePath,
  card1Description,
  card2Description,
  card3Description,
}) {
  const cardsContainerRef = useRef(null); // Use useRef to get a reference to the cards container
  const overlayScheduled = useRef(false); // Track if the overlay callback is scheduled

  useEffect(() => {
    const cardsContainer = cardsContainerRef.current;
    const cards = Array.from(cardsContainer.querySelectorAll(".card"));
    const overlay = cardsContainer.querySelector(".overlay");

    const applyOverlayMask = (e) => {
      const overlayEl = e.currentTarget;
      const x = e.pageX - cardsContainer.offsetLeft;
      const y = e.pageY - cardsContainer.offsetTop;

      overlayEl.style.setProperty("--opacity", "1");
      overlayEl.style.setProperty("--x", `${x}px`);
      overlayEl.style.setProperty("--y", `${y}px`);
    };

    const createOverlayCta = (overlayCard, ctaEl) => {
      const overlayCta = document.createElement("div");
      overlayCta.classList.add("cta");
      overlayCta.textContent = ctaEl.textContent;
      overlayCta.setAttribute("aria-hidden", true);
      overlayCard.append(overlayCta);
    };

    const handleResize = (entries) => {
      if (overlayScheduled.current) {
        return;
      }

      overlayScheduled.current = true; // Prevent scheduling multiple times
      requestAnimationFrame(() => {
        entries.forEach((entry) => {
          const cardIndex = cards.indexOf(entry.target);
          let width = entry.borderBoxSize[0].inlineSize;
          let height = entry.borderBoxSize[0].blockSize;

          if (cardIndex >= 0) {
            overlay.children[cardIndex].style.width = `${width}px`;
            overlay.children[cardIndex].style.height = `${height}px`;
          }
        });
        overlayScheduled.current = false; // Reset to allow the next scheduling
      });
    };

    const observer = new ResizeObserver(handleResize);
    cards.forEach((cardEl) => {
      const overlayCard = document.createElement("div");
      overlayCard.classList.add("card");
      createOverlayCta(overlayCard, cardEl.lastElementChild);
      overlay.appendChild(overlayCard);
      observer.observe(cardEl);
    });

    const pointerMoveListener = (e) => {
      applyOverlayMask(e);
    };

    document.body.addEventListener("pointermove", pointerMoveListener);

    // Clean up the observer and event listener when the component unmounts
    return () => {
      observer.disconnect();
      document.body.removeEventListener("pointermove", pointerMoveListener);
    };
  }, []); // Run this effect only once, similar to componentDidMount

  // end of hover effects

  return (
    <main className="mainCard flow">
      <Typography variant="h2" className="mainCard__heading">
        {infoTitle}
      </Typography>
      {/* Add a ref to the cards container */}
      <div className="mainCard__cards cards" ref={cardsContainerRef}>
        <div className="cards__inner">
          <div className="cards__card card">
            <Typography variant="subtitle1" className="card__heading">
              {card1Date}
            </Typography>
            <Typography variant="h4">{card1Title}</Typography>
            <ul className="card__bullets flow">
              <Typography variant="body1">{card1Description}</Typography>
            </ul>
            <Link to={"/Exhibit"} className="card__cta cta">
              View Exhibit
            </Link>
          </div>

          <div className="cards__card card">
            <Typography variant="subtitle1" className="card__heading">
              {card2Date}
            </Typography>
            <Typography variant="h4" className="card__price">
              {card2Title}
            </Typography>
            <ul className="card__bullets flow">
              <Typography variant="body1">{card2Description}</Typography>
            </ul>
            <Link to={"/Nativity"} className="card__cta cta">
              Live Nativity Photos
            </Link>
          </div>

          <div className="cards__card card">
            <Typography variant="subtitle1" className="card__heading">
              {card3Date}
            </Typography>
            <Typography variant="h4" className="card__price">
              {card3Title}
            </Typography>
            <ul className="card__bullets flow">
              <Typography variant="body1">{card3Description}</Typography>
            </ul>
            <Link to={"/Exhibit"} className="card__cta cta">
              View Exhibit
            </Link>
          </div>
        </div>

        <div className="overlay cards__inner"></div>
      </div>
    </main>
  );
}
