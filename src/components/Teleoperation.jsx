import React from "react";
import { Container } from "react-bootstrap";
import { Joystick } from "react-joystick-component";
import Config from "../scripts/Config";
import * as ROSLIB from "roslib";

const Teleoperation = (props) => {
  const ros = props.ros;
// declare function publishCMD_vel with x and y parameters to 
  function publishCMD_vel(x, y) {
    // publishing a topic >> cmd_vel - The main user interface topic 
    var cmd_vel = new ROSLIB.Topic({
      ros: ros,
      name: Config.CMD_VEL_TOPIC,
      messageType: "geometry_msgs/Twist",
    });
   // 
    var twist = new ROSLIB.Message({
      linear: {
        x: y / 50,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: -x / 50,
      },
    });
    cmd_vel.publish(twist);
  }
  // robot move function 
  function handle_Move(event) {
    // call function to moving the robot
    publishCMD_vel(event.x, event.y);
  }
  // robot stop function
  function handle_Stop() {
    // call function to stop the robot
    publishCMD_vel(0, 0);
  }

  return (
    <Container>
      <h1>Joystick</h1>
      {/* render a joystick */}
      <Joystick
        size={100}
        sticky={false}
        baseColor="black"
        stickColor="rgba(90, 103, 140, 0.836)"
        move={handle_Move}
        stop={handle_Stop}
      ></Joystick>
    </Container>
  );
};

export default Teleoperation;

// class Teleoperation extends Component {
//   state = { ros: null };

//   constructor() {

//     super();
//     this.init_connection();
//     this.handleMove = this.handleMove.bind(this);
//     this.handleStop= this.handleStop.bind(this);
//   }

//   init_connection() {
//     this.state.ros = new ROSLIB.Ros();
//     console.log(this.state.ros);

//     this.state.ros.on("connection", () => {
//       console.log("connection established in Teleoperation component!");
//       console.log("this.state.ros ");
//       this.setState({ connected: true });
//     });

//     this.state.ros.on("close", () => {
//       console.log("connection is closed");
//       this.setState({ connected: false });
//       // try to reconnect every 3 second
//       setTimeout(() => {
//         try {
//           this.state.ros.connect(
//             "ws://" +
//               Config.ROSBRIDGE_SERVER_IP +
//               ":" +
//               Config.ROSBRIDGE_SERVER_PORT +
//               ""
//           );
//         } catch (error) {
//           console.log("connection problem");
//         }
//       }, Config.RECONNECTION_TIMER);
//     });

//     try {
//       this.state.ros.connect(
//         "ws://" +
//           Config.ROSBRIDGE_SERVER_IP +
//           ":" +
//           Config.ROSBRIDGE_SERVER_PORT +
//           ""
//       );
//     } catch (error) {
//       console.log(
//         "ws://" +
//           Config.ROSBRIDGE_SERVER_IP +
//           ":" +
//           Config.ROSBRIDGE_SERVER_PORT +
//           ""
//       );
//       console.log("connection problem");
//     }
//   }

//   handleMove(event) {
//     console.log("handel move");
//     // first we need to create a ros publisher on the topic cmd_vel
//     var cmd_vel = new ROSLIB.Topic({
//       ros: this.state.ros,
//       name: Config.CMD_VEL_TOPIC,
//       messageType:"geometry_msgs/Twist",
//     });
//     // second create a twist message to be published  to rosbridge
//   var twist = new ROSLIB.Message({
//     linear:{
//         x:event.y/50,
//         y:0,
//         z:0,
//     },
//     angular:{
//         x:0,
//         y:0,
//         z:-event.x/50,
//     }
//   });
//     // third need to publish the message to the vmd_vel
//   cmd_vel.publish(twist);
// }
//   handleStop(event) {
//        // first we need to create a ros publisher on the topic cmd_vel
//        var cmd_vel = new ROSLIB.Topic({
//         ros: this.state.ros,
//         name: Config.CMD_VEL_TOPIC,
//         messageType:"geometry_msgs/Twist",
//       });
//       // second create a twist message to be published  to rosbridge
//     var twist = new ROSLIB.Message({
//       linear:{
//           x:event.y/50,
//           y:0,
//           z:0,
//       },
//       angular:{
//           x:0,
//           y:0,
//           z:-event.x/50,
//       }
//     });
//       // third need to publish the message to the vmd_vel
//     cmd_vel.publish(twist);

//     console.log("handel stop");
//   }

//   render() {
//     return (
//       <div id="joystick">
//         <Joystick
//           size={100}
//           sticky={false}
//           baseColor="black"
//           stickColor="rgba(90, 103, 140, 0.836)"
//           move={this.handleMove}
//           stop={this.handleStop}
//         ></Joystick>
//       </div>
//     );
//   }
// }

// export default Teleoperation;
