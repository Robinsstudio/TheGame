import React, { Component } from "react";

export default class Section extends Component {
  render() {
    return (
      <div>
        <section id="banner" className="banner">
          <div className="bg-color">
            <div className="container">
              <div className="row">
                <div className="banner-info">
                  <div className="banner-text text-center">
                    <h1 className="white">The Game</h1>
                  </div>
                  <div className="banner-logo text-center">
                    <h1 className="white">Le jeu n'est pas votre ami !</h1>
                  </div>
                  <div className="overlay-detail text-center">
                    <a href="#description">
                      <i className="fa fa-angle-down"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="description" className="section-padding">
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-sm-4">
                <h2 className="ser-title">Description Rapide</h2>
                <hr className="botm-line" />
                <div className="col-md-12 col-sm-3 col-xs-6">
                  <div className="thumbnail Boite">
                    <img
                      src="./img/TheGame_boite.jpg"
                      alt="..."
                      className="team-img"
                    />
                    <div className="caption">
                      <h3>Spécifications :</h3>
                      <p className="petitPara">
                        <strong>Nombre de joueurs :</strong> 1 à 5 joueurs
                      </p>
                      <p className="petitPara">
                        <strong>Date de sortie : </strong>juin 2015
                      </p>
                      <p className="petitPara">
                        <strong>Auteur : </strong>Steffen Benndorf
                      </p>
                      <p className="petitPara">
                        <strong>Illustrateurs : </strong>Oliver Freudenreich,
                        Sandra Freudenreich
                      </p>
                      <p className="petitPara">
                        <strong>Editeur : </strong>Oya
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-4">
                <div className="description-info">
                  <div className="icon">
                    <i className="material-icons">group</i>
                  </div>
                  <div className="icon-info">
                    <h4>Principe du jeu</h4>
                    <p>
                      Les joueurs dans "The Game" essayent de défausser les 98
                      cartes du deck dans une des quatre piles de défausse, afin
                      de remporter la partie. Mais, pour celà, ils ont besoin de
                      le faire de la bonne manière...
                    </p>
                  </div>
                </div>
                <div className="description-info">
                  <div className="icon">
                    <i className="material-icons">cached</i>
                  </div>
                  <div className="icon-info">
                    <h4>A chaque tour</h4>
                    <p>
                      A son tour, un joueur doit défausser au moins deux cartes
                      de sa main vers une ou plusieurs piles de défausse.
                    </p>
                    <p>
                      Après qu'un joueur ai terminé son tour, il pioche des
                      cartes pour avoir à nouveau le même nombre de cartes qu'au
                      début du jeu.
                    </p>
                    <p>
                      Pendant son tour, un joueur ne peut pas révéler la valeur
                      exacte de ses cartes, mais il peut prévenir les autres
                      joueurs de ne pas jouer dans une certaine défausse ou
                      donner des suggestions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-4">
                <div className="description-info">
                  <div className="icon">
                    <i className="material-icons">flag</i>
                  </div>
                  <div className="icon-info">
                    <h4>Début de partie</h4>
                    <p>
                      Chaque joueur commence avec 6-8 cartes en main, dépendant
                      du nombre de joueurs, et quatre piles de défausse sont
                      placées sur la table. Deux piles ascendantes (de 1 à 99)
                      et deux piles descendantes (de 100 à 2).
                    </p>
                  </div>
                </div>
                <div className="description-info">
                  <div className="icon">
                    <i className="material-icons">done</i>
                  </div>
                  <div className="icon-info">
                    <h4>Fin de partie</h4>
                    <p>
                      Quand le deck est vide, les joueurs doivent juste jouer
                      les dernières cartes qu'ils ont en main, mais une à la
                      fois. Si toutes les 98 cartes ont été jouées, vous
                      remportez la partie!
                    </p>
                    <p>
                      Une fois que vous devenez doué, les règles vous proposent
                      de jouer au moins trois cartes par tour, pour augmenter le
                      challenge.
                    </p>
                    <p>
                      Pour plus d'infos vous pouvez{" "}
                      <a
                        href="./pdf/TheGame_rules.pdf"
                        target="_blank"
                        download="rules_TheGame"
                      >
                        télécharger les régles.
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section-padding">
          <div className="container">
            <div className="row">
              <div className="col-md-3 col-sm-4 col-xs-12">
                <div className="section-title">
                  <h2 className="head-title lg-line">
                    Jouer seul
                    <br />
                    ou à plusieurs
                  </h2>
                  <hr className="botm-line" />
                  <p className="sec-para">
                    Vous pouvez créer une partie personnalisée pour jouer seul.
                  </p>
                </div>
              </div>
              <div className="col-md-9 col-sm-8 col-xs-12">
                <div
                  style={{ visibility: "visible" }}
                  className="col-sm-9 more-features-box"
                >
                  <div className="more-features-box-text">
                    <div className="more-features-box-text-icon">
                      {" "}
                      <i
                        className="fa fa-angle-right"
                        aria-hidden="true"
                      ></i>{" "}
                    </div>
                    <div className="more-features-box-text-description">
                      <h3>Jouer avec des amis ou avec le monde entier</h3>
                      <p>Créez une partie et invitez des amis.</p>
                      <p>Ou rejoignez directement un lobby public.</p>
                    </div>
                  </div>
                  <div className="more-features-box-text">
                    <div className="more-features-box-text-icon">
                      {" "}
                      <i
                        className="fa fa-angle-right"
                        aria-hidden="true"
                      ></i>{" "}
                    </div>
                    <div className="more-features-box-text-description">
                      <h3>Reprendre une partie</h3>
                      <p>
                        Sauvegardez votre partie à tout moment et reprenez la
                        plus tard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonial" className="section-padding">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h2 className="ser-title">Avis de nos utilisateurs</h2>
                <hr className="botm-line" />
              </div>
              <div className="col-md-4 col-sm-4">
                <div className="testi-details">
                  <p>Un jeu très addictif et 100% gratuit !</p>
                  <p>Je recommande </p>
                </div>
                <div className="testi-info">
                  <a href="#banner">
                    <img
                      src="./img/thumb.png"
                      alt=""
                      className="img-responsive"
                    />
                  </a>
                  <h3>
                    Alain<span>Térieur</span>
                  </h3>
                </div>
              </div>
              <div className="col-md-4 col-sm-4">
                <div className="testi-details">
                  <p>
                    J'aimais bien mais dommage que je sois obligé de jouer avec
                    des chinois et des russes...
                  </p>
                </div>
                <div className="testi-info">
                  <a href="#banner">
                    <img
                      src="./img/thumb.png"
                      alt=""
                      className="img-responsive"
                    />
                  </a>
                  <h3>
                    Donald<span>Trump</span>
                  </h3>
                </div>
              </div>
              <div className="col-md-4 col-sm-4">
                <div className="testi-details">
                  <p>
                    J'ai pas compris pourquoi on m'insultait alors que j'avais
                    posé la carte 2 en premier sur la pile qui descend...
                  </p>
                </div>
                <div className="testi-info">
                  <a href="#banner">
                    <img
                      src="./img/thumb.png"
                      alt=""
                      className="img-responsive"
                    />
                  </a>
                  <h3>
                    Alex<span>Térieur</span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
