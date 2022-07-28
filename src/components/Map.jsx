import React, { useRef, useEffect } from "react";
import * as ROS2D from "ros2d";
import getYawFromQuat from "../scripts/getY";
import robot from "../scripts/robot.png";
import * as ROSLIB from "roslib";

const Map = (props) => {

  var gridClient;
  var robotimage;
  var viewer;
  var canvas;
  var context;
  // useRef hook allows to persist values between renders.
  const map = useRef(null);
  const ros = props.ros;


  useEffect(() => {
    viewMap();
    // map.current.style.pointerEvents = "null";
    map.current.children[0].id = "canvas";
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.fillStyle = "#FF";
  }, []);
// render the robot car
  function render_robot() {
    robotimage = new ROS2D.NavigationImage({
      size: 1.3,
      image: robot,
      pulse: false,
      alpha: 1,
    });
    // robotimage.x = 0;
    // robotimage.y = -0;
    viewer.scene.addChild(robotimage);
  }
//view the map using canvas and ros2d libray 
  function viewMap() {

    if (map.current.innerHTML !== "") return;

    viewer = new ROS2D.Viewer({
      divID: "map",
      width: 700,
      height: 600,
    });
// to render the map but continuously using OccupancyGridClient from ros2d library
    gridClient = new ROS2D.OccupancyGridClient({
      ros: ros,
      rootObject: viewer.scene,
      continuous: true,
    });
// to In order for the map to be positioned exactly the size of the section allocated to it
    gridClient.on("change", () => {
      viewer.scaleToDimensions(
        gridClient.currentGrid.width,
        gridClient.currentGrid.height
      );
      try {
        viewer.shift(
          gridClient.currentGrid.pose.position.x,
          gridClient.currentGrid.pose.position.y
        );
      } catch (err) {
        return;
      }
    });

    //call the functions
    render_robot();
    subscribe();
  }
// to move the robot b the data that came from ros side 
//call back function 
  function subscribe() {
    var position = new ROSLIB.Topic({
      ros: ros,
      name: "/robot_pose",
      messageType: "geometry_msgs/Pose",
    }).subscribe((message) => {
      robotimage.x = message.position.x.toFixed(2);
      robotimage.y = -message.position.y.toFixed(2);
      robotimage.rotation = (-getYawFromQuat(message.orientation)).toFixed(2);
    });
  }

  return (
    <div>
      <div ref={map} id="map"></div>
    </div>
  );
};

export default Map;
