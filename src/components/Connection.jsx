import React from "react";
import Alert from "react-bootstrap/Alert";
// import Config from "../scripts/Config";
// import * as ROSLIB from "roslib";

const Connection = (props) => {
  const ros = props.ros;
  return (
    <div>
      <Alert // render alert message to know if the ros connected or not
        className="text-center m-3"
        // the next syntex is an if statment
        variant={ros.isConnected ? "success" : "danger"}
      >
        {ros.isConnected ? "Robot Connected" : "Robot Disconnected"}
      </Alert>
    </div>
  );
};

export default Connection;
// class Connetction extends Component {
//   state = { connected: false, ros: null };

//   constructor() {
//     super();
//     this.init_connection();
//   }

//   init_connection() {
//     this.state.ros = new ROSLIB.Ros();
//     console.log(this.state.ros);

//     this.state.ros.on("connection", () => {
//       console.log("connection established!");
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

//   render() {
//     return (
//       <div>
//         <Alert
//           className="text-center m-3"
//           variant={this.state.connected ? "success" : "danger"}
//         >
//           {this.state.connected ? "Robot Connected" : "Robot Disconnected"}
//         </Alert>
//       </div>
//     );
//   }
// }

// export default Connetction;
