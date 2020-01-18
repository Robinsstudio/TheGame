import React, { Component } from "react";
import "./css/Home.css";
import "./css/template.css";
import "./css/font.css";
import Footer from "./HomeFooter/Footer";
import Section from "./HomeSection/Section";

export default class Home extends Component {
  render() {
    return (
      <div>
        <Section></Section>
        <Footer></Footer>
      </div>
    );
  }
}
