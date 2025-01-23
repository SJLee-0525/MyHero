#include <ros/ros.h>
#include "robot_motor_controller/motor_controller.h"
#include <signal.h>

MotorController* controller_ptr = nullptr;

void signalHandler(int signum) {
    if (controller_ptr) {
        delete controller_ptr;
    }
    ros::shutdown();
}

int main(int argc, char** argv) {
    ros::init(argc, argv, "motor_controller_node", ros::init_options::NoSigintHandler);
    ros::NodeHandle nh;
    
    signal(SIGINT, signalHandler);
    
    controller_ptr = new MotorController(nh);
    
    ros::spin();
    
    delete controller_ptr;
    return 0;
}
