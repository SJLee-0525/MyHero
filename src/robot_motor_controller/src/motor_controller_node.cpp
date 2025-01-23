#include <ros/ros.h>
#include "robot_motor_controller/motor_controller.h"

int main(int argc, char** argv)
{
    ros::init(argc, argv, "motor_controller_node");
    ros::NodeHandle nh;
    
    MotorController controller(nh);
    
    ros::spin();
    
    return 0;
}
