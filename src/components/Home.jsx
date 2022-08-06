import React, { Component } from "react";
import Config from "../scripts/Config"; // import config file
import * as ROSLIB from "roslib"; // import roslib library
import Connection from "./Connection"; // import components map , connection ...etc
import Teleoperation from "./Teleoperation";
import RobotState from "./RobotState";
import { Row, Col, Container } from "react-bootstrap"; // import feature from react bootstrap
import Map from "./Map";

class Home extends Component {
  // declare ros with start value null
  state = {
    ros: null,
    // counter:0,
  };
  constructor() {
    super();
    this.init_connection();
  }
  // init_connection is a function makes sure there is connection with ros
  init_connection() {
    // declare object from ROSLIB library caalled ros
    this.state.ros = new ROSLIB.Ros();
    // print it to console
    console.log(this.state.ros);
    // if it is connected it will print connection established in Teleoperation component! .
    this.state.ros.on("connection", () => {
      console.log("connection established in Teleoperation component!");
      this.setState({ connected: true });
    });
    // if it is not connected it will print connection is closed.
    this.state.ros.on("close", () => {
      console.log("connection is closed");
      this.setState({ connected: false });
      // try to reconnect every 3 second
      setTimeout(() => {
        try {
          this.state.ros.connect(
            // local host
            "ws://" +
              Config.ROSBRIDGE_SERVER_IP +
              ":" +
              Config.ROSBRIDGE_SERVER_PORT +
              ""
          );
          // to catch any errors specifically in this block we put it in catch and try block
        } catch (error) {
          console.log("connection problem");
        }
        // Config is a js file include the constnt variables (like RECONNECTION_TIMER)that can reuse in different components
      }, Config.RECONNECTION_TIMER);
    });

    try {
      this.state.ros.connect(
        "ws://" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
    } catch (error) {
      console.log(
        "ws://" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
      console.log("connection problem");
    }
  }

  // increment_counter(){
  //   // this.state.counter=this.state.counter+1;
  //   this.setState({counter:this.state.counter+1})
  //   console.log(this.state.counter)
  // }

  render() {
    return (
      <div>
        <Container>
          <h1 className="text-center" id="main_page">Robot Control Page</h1>

          <Row>
            <Col id="connection">
              {/* ros={this.state.ros} call the component via its props */}
              <Connection ros={this.state.ros} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Teleoperation ros={this.state.ros} />
            </Col>
          </Row>
          <Row>
            <Col>
              <RobotState />
            </Col>
            <Col>
              <Map ros={this.state.ros} />
            </Col>
          </Row>

          {/* <h5>Counter:
      <span>{this.state.counter}</span>
      </h5>
      <Button onClick={()=>this.increment_counter()}>Increment</Button> */}
        </Container>
      </div>
    );
  }
}

export default Home;
