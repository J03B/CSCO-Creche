import React, { useEffect, useRef } from "react";
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
      entries.forEach((entry) => {
        const cardIndex = cards.indexOf(entry.target);
        let width = entry.borderBoxSize[0].inlineSize;
        let height = entry.borderBoxSize[0].blockSize;

        if (cardIndex >= 0) {
          overlay.children[cardIndex].style.width = `${width}px`;
          overlay.children[cardIndex].style.height = `${height}px`;
        }
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
      <h1 className="mainCard__heading">{infoTitle}</h1>
      {/* Add a ref to the cards container */}
      <div className="mainCard__cards cards" ref={cardsContainerRef}>
        <div className="cards__inner">
          <div className="cards__card card">
            <h2 className="card__heading">{card1Date}</h2>
            <p className="card__price">{card1Title}</p>
            <ul className="card__bullets flow">
              <p>{card1Description}</p>
            </ul>
            <Link to={"/Exhibit"} className="card__cta cta">
              View Exhibit
            </Link>
          </div>

          <div className="cards__card card">
            <h2 className="card__heading">{card2Date}</h2>
            <p className="card__price">{card2Title}</p>
            <ul className="card__bullets flow">
              <p>{card2Description}</p>
            </ul>
            <Link to={"/Exhibit"} className="card__cta cta">
              View Exhibit
            </Link>
          </div>

          <div className="cards__card card">
            <h2 className="card__heading">{card3Date}</h2>
            <p className="card__price">{card3Title}</p>
            <ul className="card__bullets flow">
              <p>{card3Description}</p>
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
