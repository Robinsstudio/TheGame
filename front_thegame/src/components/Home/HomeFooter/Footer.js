import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <div>
        <footer id="footer">
          <div className="top-footer">
            <div className="container">
              <div className="row">
                <div className="col-md-4 col-sm-4 marb20">
                  <div className="ftr-tle">
                    <h4 className="white no-padding">A propos de nous</h4>
                  </div>
                  <div className="info-sec">
                    <p>
                      Projet de développement web en groupe durant notre 2ème
                      année de Master.
                    </p>
                  </div>
                </div>
                <div className="col-md-4 col-sm-4 marb20">
                  <div className="ftr-tle">
                    <h4 className="white no-padding">Liens Rapides</h4>
                  </div>
                  <div className="info-sec">
                    <ul className="quick-info">
                      <li>
                        <a href="#myNavbar">
                          <i className="fa fa-circle"></i>Accueil
                        </a>
                      </li>
                      <li>
                        <a href="#description">
                          <i className="fa fa-circle"></i>Description
                        </a>
                      </li>
                      <li>
                        <a
                          href="./pdf/TheGame_rules.pdf"
                          target="_blank"
                          download="rules_TheGame"
                        >
                          <i className="fa fa-circle"></i>Télécharger les régles
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-4 col-sm-4 marb20">
                  <div className="ftr-tle">
                    <h4 className="white no-padding">Suivez nous</h4>
                  </div>
                  <div className="info-sec">
                    <ul className="social-icon">
                      <li className="bglight-blue">
                        <i className="fa fa-facebook"></i>
                      </li>
                      <li className="bgred">
                        <i className="fa fa-google-plus"></i>
                      </li>
                      <li className="bgdark-blue">
                        <i className="fa fa-linkedin"></i>
                      </li>
                      <li className="bglight-blue">
                        <i className="fa fa-twitter"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
