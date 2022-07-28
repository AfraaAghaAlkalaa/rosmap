import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import Config from "../scripts/Config";
import * as Three from "three";
import * as ROSLIB from "roslib";

class RobotState extends Component {
  state = {
    ros: null,
    x: 0,
    y: 0,
    orientation: 0,
   // linear_velocity: 0,
   // angular_velocity: 0,
  };

  constructor() {
    super();
    this.init_connection();
  }
// connection function 
  init_connection() {
    this.state.ros = new ROSLIB.Ros();
    console.log(this.state.ros);

    this.state.ros.on("connection", () => {
      console.log("connection established in Teleoperation component!");
      console.log("this.state.ros ");
      this.setState({ connected: true });
    });

    this.state.ros.on("close", () => {
      console.log("connection is closed");
      this.setState({ connected: false });
      // try to reconnect every 3 second
      setTimeout(() => {
        try {
          this.state.ros.connect(
            "ws://" +
              Config.ROSBRIDGE_SERVER_IP +
              ":" +
              Config.ROSBRIDGE_SERVER_PORT +
              ""
          );
        } catch (error) {
          console.log("connection problem");
        }
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
  componentDidMount() {
    this.getRobotState();
  }
// get robot postion 
  getRobotState() {
    var pose_subscriber = new ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.POSE_TOPIC,
      messageType: "geometry_msgs/PoseWithCovarianceStamped" // This represents a pose in free space with uncertainty.

    });

    pose_subscriber.subscribe((message) => {
      this.setState({ x: message.pose.pose.position.x.toFixed(2) });
      this.setState({ y: message.pose.pose.position.y.toFixed(2) });
      this.setState({
        orientation: this.getOrientaionFromQuaternion(
          message.pose.pose.orientation
        ).toFixed(2),
      });
    });
    // create a subscriber for the velocities in the topic
    // var velocity_subscriber = new ROSLIB.Topic({
    //   ros: this.state.ros,
    //   name: Config.ODOM_TOPIC,
    //   messageType: "nav_msgs/Odometry",
    // });
  }

  getOrientaionFromQuaternion(ros_orientation_quaternion) {
    var q = new Three.Quaternion(
      ros_orientation_quaternion.x,
      ros_orientation_quaternion.y,
      ros_orientation_quaternion.z,
      ros_orientation_quaternion.w
    );

    var RPY = new Three.Euler().setFromQuaternion(q);
    return RPY["_z"] * (180 / Math.PI); 
  }

  render() {
    return (
      <div id="coordinate">
        <Row>
          <Col>
            <h3 className="mt-4">Position</h3>
            <h5 className="mt=0">x: {this.state.x}</h5>
            <h5 className="mt=0">y: {this.state.y}</h5>
            <h5 className="mt=0">Orientation: {this.state.orientation}</h5>
          </Col>
        </Row>
        {/* <Row>
          <Col>
            <h3 className="my-4">Velocities</h3>
            <h5 className="mt=0">
              Linear Velocities:{this.state.linear_velocity}
            </h5>
            <h5 className="mt=0">
              Angular Velocities:{this.state.angular_velocity}
            </h5>
          </Col>
        </Row> */}
      </div>
    );
  }
}
export default RobotState;
