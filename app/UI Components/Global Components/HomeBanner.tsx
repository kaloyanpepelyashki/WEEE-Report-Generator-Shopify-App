import React from "react";

const HomeBanner: React.FC = () => {
  return (
    <section className="static-banner w-full">
      <div className="container w-full flex flex-row justify-center font-bold">
        <div className="row">
          <div className="other-card1 z-10">
            <div className="card shadow-customBig bg-secondaryColor">
              <div className="card-body flex flex-col items-end justify-end">
                <p className="card-text text-2xl font-medium">
                  REMEMBER TO
                  <br />
                  <b className="text-5xl font-bold">CATEGORIES</b>
                  <br />
                  ALL YOUR PRODUCTS
                </p>
              </div>
            </div>
          </div>
          <div className="first-card z-20">
            <div className="card shadow-customBig">
              <div className="card-body-first flex flex-col items-start justify-start">
                <h5 className="card-title"></h5>
                <p className="card-text text-2xl font-medium">
                  REMEMBER TO ADD <br />
                  <b className="text-5xl font-bold">WEIGHT</b>
                  <br />
                  TO YOUR PRODUCTS
                </p>
              </div>
            </div>
          </div>
          <div className="other-card2 z-10">
            <div className="card shadow-customBig bg-secondaryColor">
              <div className="w-full h-full card-body flex flex-col items-start justify-end">
                <h5 className="card-title"></h5>
                <p className="card-text text-2xl font-medium">
                  REMEMBER TO SELECT THE <br />
                  <b className="text-5xl font-bold">COUNTRY</b>
                  <br />
                  YOU WANT THE FILE FOR
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
