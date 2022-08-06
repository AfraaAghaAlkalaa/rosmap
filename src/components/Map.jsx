import React, { useRef, useEffect, useState } from "react";
import * as ROS2D from "ros2d";
import * as ROSLIB from "roslib";
import createjs from "createjs-module";
import goal from "../scripts/goal.png";
import robot from "../scripts/robot.png";
import charging_station from "../scripts/charging_station.png";
import getYawFromQuat from "../scripts/getY";
// import { useSearchParams } from "react-router-dom";
// import { GrFlagFill } from "react-icons/gr";
// useRef hook allows to persist values between renders.
const Map = (props) => {
  var gridClient;
  var robot_image;
  var viewer;
  var canvas;
  var context;
  var trace_shape;
  var golbal_path_image;
  var local_path_image;
  var goal_image;
  let footprintpolygon = [];
  var footprint = null;
  var chargeparam = null;
  var station_image;
  var charge_station_param1;
  const map = useRef(null);
  const ros = props.ros;

  useEffect(() => {
    viewMap();
    map.current.style.pointerEvents = "null";
    map.current.children[0].id = "canvas";
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.fillStyle = "#FF";
    // var footprintParam = new ROSLIB.Param({
    //   ros: ros,
    //   name: "/move_base_node/footprint",
    // });
    // footprintParam.get((footprintpoints) => {
    //   footprint = footprintpoints;
    //   //console.log(footprint);
    // });
  }, []);
  function charge_stations1() {
    station_image = new ROS2D.NavigationImage({
      size: 1.4,
      image: charging_station,
      alpha: 1,

      pulse: false,
    });

    station_image.x = chargeparam.position.x;
    station_image.y = -chargeparam.position.y;
    station_image.rotation = (-getYawFromQuat(chargeparam.orientation)).toFixed(
      2
    );
    viewer.scene.addChild(station_image);
  }
  function charge_stations2() {
    station_image = new ROS2D.NavigationImage({
      size: 1.4,
      image: charging_station,
      alpha: 1,
      pulse: false,
    });
    station_image.x = chargeparam.position.x;
    station_image.y = -chargeparam.position.y;
    station_image.rotation = (-getYawFromQuat(chargeparam.orientation)).toFixed(
      2
    );
    viewer.scene.addChild(station_image);
  }
  // render the robot car
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
      } catch (error) {
        return;
      }
    });
    //call the functions
    // rospolygon();
    subscribers();
    render_robot();
    //getfootprintfromros();
  }
  // to move the robot b the data that came from ros side
  //call back function
  function subscribers() {
    // var charge_station_param = new ROSLIB.Param({
    //   ros: ros,
    //   name: "/station1",
    // });
    // charge_station_param.get((charge_station_param1) => {
    //   console.log("station 1 : " + charge_station_param1.position.x);
    //   console.log("station 1 : " + charge_station_param1.position.y);
    //   chargeparam = charge_station_param1;
    //   charge_stations1();
    // });
    // var charge_station_param = new ROSLIB.Param({
    //   ros: ros,
    //   name: "/station2",
    // });
    // charge_station_param.get((charge_station_param1) => {
    //   console.log("station 1 : " + charge_station_param1.position.x);
    //   console.log("station 1 : " + charge_station_param1.position.y);
    //   chargeparam = charge_station_param1;
    //   charge_stations2();
    // });
    var position = new ROSLIB.Topic({
      ros: ros,
      name: "/robot_pose",
      messageType: "geometry_msgs/Pose",
    }).subscribe((message) => {
      robot_image.x = message.position.x.toFixed(2);
      robot_image.y = -message.position.y.toFixed(2);
      robot_image.rotation =(-getYawFromQuat(message.orientation)).toFixed(2);
      trace_shape.addPose(message);
      // drawFootprint();
    });
    var goal_subscriber = new ROSLIB.Topic({
      ros: ros,
      name: "/move_base_simple/goal",
      messageType: "geometry_msgs/PoseStamped",
    }).subscribe((message) => {
      var yaw = getYawFromQuat(message.pose.orientation);
      // console.log(yaw);
      goal_image.x = message.pose.position.x;
      goal_image.y = -message.pose.position.y;
      goal_image.rotation = yaw;
      viewer.scene.addChild(goal_image);
    });
    // var trace_Shape = new ROSLIB.Topic({
    //   ros: ros,
    //   name: "/move_base/feedback",
    //   messageType: "/move_base_msgs/MoveBaseActionFeedback",
    // });
    // trace_Shape.subscribe(function(message) {
    //   trace_shape.addPose(message.feedback.base_position.pose);
    //         //  trace_Shape.addPose({position});
    // });
    var global_path = new ROSLIB.Topic({
      ros: ros,
      name: "/move_base_node/DWBLocalPlanner/global_plan",
      messageType: "nav_msgs/Path",
    }).subscribe((message) => {
      golbal_path_image.setPath(message);
    });
    var local_path = new ROSLIB.Topic({
      ros: ros,
      name: "/move_base_node/DWBLocalPlanner/local_plan",
      messageType: "nav_msgs/Path",
    }).subscribe((message) => {
      local_path_image.setPath(message);
    });
  }
  function render_robot() {
    robot_image = new ROS2D.NavigationImage({
      size: 1.3,
      image: robot,
      pulse: false,
      alpha: 0.9,
    });
    robot_image.x = 10;
    robot_image.y = -10;

    golbal_path_image = new ROS2D.PathShape({
      strokeSize: 0.02,
      strokeColor: createjs.Graphics.getRGB(0, 150, 136),
    });

    trace_shape = new ROS2D.TraceShape({
      strokeSize: 0.01,
      maxPoses: 30,
      minDist: 0.05,
      strokeColor: createjs.Graphics.getRGB(255, 0, 0),
    });
    console.log("Stroke: " + trace_shape.strokeSize);
    viewer.scene.addChild(golbal_path_image);
    viewer.scene.addChild(local_path_image);
    viewer.scene.addChild(trace_shape);
    viewer.scene.addChild(robot_image);

    local_path_image = new ROS2D.PathShape({
      strokeSize: 0.02,
      strokeColor: createjs.Graphics.getRGB(255, 0, 0),
    });

    goal_image = new ROS2D.NavigationImage({
      size: 1,
      image: goal,
      alpha: 1,
      pulse: false,
    });
  }
  //   function charge_station(){
  // var charge_station_param = new ROSLIB.Param({
  // ros:ros,
  // name:"/station1",

  // });
  //   }
  // function rospolygon() {
  //   let polygon_zone = [];
  //   var zone = new ROSLIB.Topic({
  //     ros: ros,
  //     name: "/zones",
  //     messageType: "/mir_msgs/Zone",
  //   });

  //   zone.subscribe((message) => {
  //     let logic = false;
  //     for (let i = 0; i < polygon_zone.length; i++) {
  //       if (polygon_zone[i].zone_id === message.zone_id) {
  //         logic = true;
  //         break;
  //       }
  //     }
  //     if (!logic) {
  //       polygon_zone.push(message);
  //       drawpolygons(polygon_zone);
  //     }
  //   });
  // }
  // function drawpolygons(polygon_zone) {
  //   for (let i = 0; i < polygon_zone.length; i++) {
  //     var pointColor = null;
  //     var x = polygon_zone[i].zone_type;
  //     switch (x) {
  //       case 1:
  //         pointColor = createjs.Graphics.getRGB(205, 155, 190); // BLUE
  //         break;
  //       case 2:
  //         pointColor = createjs.Graphics.getRGB(174, 223, 249); // foshia
  //         break;
  //       default: // BLACK
  //         pointColor = createjs.Graphics.getRGB(0, 0, 0, 1);
  //         break;
  //     }
  //     var polygon_iterator = new ROS2D.PolygonMarker({
  //       pointSize: 0.000001,
  //       lineSize: 0.06,
  //       pointColor: pointColor,
  //       lineColor: createjs.Graphics.getRGB(121, 65, 181),
  //     });
  //     viewer.scene.addChild(polygon_iterator);
  //     for (let j = 0; j < polygon_zone[i].polygon.points.length; j++) {
  //       polygon_iterator.addPoint(polygon_zone[i].polygon.points[j]);
  //     }
  //   }
  // }
  // function drawFootprint() {
  //   //console.log(footprint);
  //   // console.log(robot_image);
  //   footprint[0][0] = robot_image.x + 0.488;
  //   footprint[0][1] = robot_image.y - 0.213;
  //   footprint[1][0] = robot_image.x + 0.488;
  //   footprint[1][1] = robot_image.y + 0.213;
  //   footprint[2][0] = robot_image.x - 0.488;
  //   footprint[2][1] = robot_image.y + 0.213;
  //   footprint[3][0] = robot_image.x - 0.488;
  //   footprint[3][1] = robot_image.y - 0.213;
  //   //  footprint[0]=robot_image.orientation- 0.213;

  //   var points = [footprint[0], footprint[1], footprint[2], footprint[3]];
  //   // console.log(points);

  //   for (let i = 0; i < footprintpolygon.length; i++) {
  //     var polygon_iterator = new ROS2D.PolygonMarker({
  //       pointSize: 0.000001,
  //       lineSize: 0.06,
  //       // pointColor: pointColor,
  //       lineColor: createjs.Graphics.getRGB(121, 65, 181, 212),
  //     });
  //     viewer.scene.addChild(polygon_iterator);
  //     polygon_iterator.addPoint({ x: points[0][0], y: points[0][1] });
  //     polygon_iterator.addPoint({ x: points[1][0], y: points[1][1] });
  //     polygon_iterator.addPoint({ x: points[2][0], y: points[2][1] });
  //     polygon_iterator.addPoint({ x: points[3][0], y: points[3][1] });
  //     // for (let j = 0; j < footprintpolygon[i].polygon.points.length; j++) {
  //     //   polygon_iterator.addPoint(footprintpolygon[i].polygon.points[j]);
  //     // }
  //   }
  // }

  // function drawfootprint(footprintpolygon){
  //   var pointColor = null;

  //   for (let i = 0; i < footprintpolygon.length; i++) {
  //     var polygon_iterator = new ROS2D.PolygonMarker({
  //       pointSize: 0.000001,
  //       lineSize: 0.06,
  //       pointColor: pointColor,
  //       lineColor: createjs.Graphics.getRGB(121, 65, 181),
  //     });
  //     viewer.scene.addChild(polygon_iterator);
  //     for (let j = 0; j < footprintpolygon[i].polygon.points.length; j++) {
  //       polygon_iterator.addPoint(footprintpolygon[i].polygon.points[j]);
  //     }
  // }}
  // function tail(){
  //       var trace_shape = new ROS2D.TraceShape({
  //           pointSize: 0.000001,
  //           lineSize: 0.06,
  //           pointColor: pointColor,
  //           lineColor: createjs.Graphics.getRGB(121, 65, 181),
  //         });
  //         viewer.scene.addChild(polygon_iterator);
  //         for (let j = 0; j < polygon_zone[i].polygon.points.length; j++) {
  //           polygon_iterator.addPoint(polygon_zone[i].polygon.points[j]);
  //         }
  // }
  return (
    <div>
      <div ref={map} id="map"></div>
      div
    </div>
  );
};
export default Map;
